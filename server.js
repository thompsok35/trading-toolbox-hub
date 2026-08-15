import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { query, initDb, generateToken } from './db.js';
import { 
  sendAdminNewLeadAlert, 
  sendWelcomeEmail, 
  sendDirectCrmEmail, 
  EMAIL_TEMPLATES 
} from './email.js';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Initialize Database
initDb().catch(err => console.error('Failed to init DB:', err));

// Middleware
app.use(express.json());

// Helper to determine base URL
function getAppBaseUrl(req) {
  if (process.env.APP_URL) return process.env.APP_URL;
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.headers['x-forwarded-host'] || req.get('host') || 'localhost:3000';
  return `${protocol}://${host}`;
}

// -------------------------------------------------------------
// PUBLIC LEAD CAPTURE & HEARTBEAT
// -------------------------------------------------------------

app.post('/api/leads', async (req, res) => {
  const { email, preferences, name } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const token = generateToken();
  const baseUrl = getAppBaseUrl(req);

  try {
    const queryString = `
      INSERT INTO leads (email, preferences, unsubscribe_token, visit_count, last_accessed)
      VALUES ($1, $2, $3, 1, CURRENT_TIMESTAMP)
      ON CONFLICT (email) 
      DO UPDATE SET 
        preferences = EXCLUDED.preferences,
        visit_count = leads.visit_count + 1,
        last_accessed = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const result = await query(queryString, [email, JSON.stringify(preferences || []), token]);
    const lead = result.rows[0];

    // Dispatch admin notification and welcome email asynchronously
    Promise.all([
      sendAdminNewLeadAlert(email, preferences),
      sendWelcomeEmail(email, lead?.unsubscribe_token || token, baseUrl)
    ]).catch(err => console.error('[Hub Email] Async error sending lead notifications:', err));

    res.json(lead);
  } catch (err) {
    console.error('Error saving lead:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/leads/heartbeat', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const queryString = `
      UPDATE leads 
      SET last_accessed = CURRENT_TIMESTAMP 
      WHERE email = $1 
      RETURNING *;
    `;
    const result = await query(queryString, [email]);
    res.json({ success: true, lead: result.rows[0] });
  } catch (err) {
    console.error('Error in heartbeat:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// -------------------------------------------------------------
// PUBLIC UNSUBSCRIBE / PREFERENCES API
// -------------------------------------------------------------

app.get('/api/unsubscribe/status', async (req, res) => {
  const { token, email } = req.query;
  if (!token && !email) return res.status(400).json({ error: 'Token or email is required' });

  try {
    let result;
    if (token) {
      result = await query('SELECT email, is_unsubscribed, unsubscribed_at FROM leads WHERE unsubscribe_token = $1', [token]);
    } else {
      result = await query('SELECT email, is_unsubscribed, unsubscribed_at FROM leads WHERE email = $1', [email]);
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subscriber record not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error verifying unsubscribe status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/unsubscribe', async (req, res) => {
  const { token, email } = req.body;
  const identifier = token || email;
  if (!identifier) return res.status(400).json({ error: 'Token or email is required' });

  try {
    const queryString = `
      UPDATE leads 
      SET is_unsubscribed = true, 
          unsubscribed_at = CURRENT_TIMESTAMP, 
          status = 'unsubscribed'
      WHERE unsubscribe_token = $1 OR email = $1
      RETURNING *;
    `;
    const result = await query(queryString, [identifier]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json({ success: true, message: 'Successfully unsubscribed', lead: result.rows[0] });
  } catch (err) {
    console.error('Error processing unsubscribe:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/unsubscribe/resubscribe', async (req, res) => {
  const { token, email } = req.body;
  const identifier = token || email;
  if (!identifier) return res.status(400).json({ error: 'Token or email is required' });

  try {
    const queryString = `
      UPDATE leads 
      SET is_unsubscribed = false, 
          unsubscribed_at = NULL, 
          status = 'lead'
      WHERE unsubscribe_token = $1 OR email = $1
      RETURNING *;
    `;
    const result = await query(queryString, [identifier]);
    res.json({ success: true, message: 'Successfully resubscribed', lead: result.rows[0] });
  } catch (err) {
    console.error('Error resubscribing:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// -------------------------------------------------------------
// ADMIN AUTHENTICATION & CRM API
// -------------------------------------------------------------

const adminAuth = (req, res, next) => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const providedPassword = req.headers['x-admin-password'];
  
  if (!adminPassword || providedPassword !== adminPassword) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// CRM Templates list
app.get('/api/admin/templates', adminAuth, (req, res) => {
  res.json(EMAIL_TEMPLATES);
});

// GET Contacts with filtering
app.get('/api/admin/contacts', adminAuth, async (req, res) => {
  try {
    const result = await query('SELECT * FROM leads ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching CRM contacts:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Legacy backward-compatibility route for leads
app.get('/api/admin/leads', adminAuth, async (req, res) => {
  try {
    const result = await query('SELECT * FROM leads ORDER BY last_accessed DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching leads:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Manual contact creation in CRM
app.post('/api/admin/contacts', adminAuth, async (req, res) => {
  const { name, email, status, source, preferences, note } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const initialNotes = note ? [{ id: Date.now().toString(), date: new Date().toISOString(), text: note }] : [];
  const token = generateToken();

  try {
    const queryString = `
      INSERT INTO leads (email, name, status, source, preferences, notes, unsubscribe_token)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (email)
      DO UPDATE SET
        name = COALESCE(NULLIF(EXCLUDED.name, ''), leads.name),
        status = EXCLUDED.status,
        source = EXCLUDED.source,
        preferences = EXCLUDED.preferences,
        notes = leads.notes || EXCLUDED.notes
      RETURNING *;
    `;
    const result = await query(queryString, [
      email, 
      name || '', 
      status || 'lead', 
      source || 'manual_admin', 
      JSON.stringify(preferences || []), 
      JSON.stringify(initialNotes), 
      token
    ]);
    res.json({ success: true, contact: result.rows[0] });
  } catch (err) {
    console.error('Error creating contact:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update contact details (Status, Name, Preferences)
app.patch('/api/admin/contacts/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  const { name, status, preferences } = req.body;

  try {
    const existing = await query('SELECT * FROM leads WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    const current = existing.rows[0];
    const newName = name !== undefined ? name : current.name;
    const newStatus = status !== undefined ? status : current.status;
    const newPrefs = preferences !== undefined ? preferences : current.preferences;

    const queryString = `
      UPDATE leads 
      SET name = $1, status = $2, preferences = $3 
      WHERE id = $4 
      RETURNING *;
    `;
    const result = await query(queryString, [
      newName, 
      newStatus, 
      JSON.stringify(newPrefs), 
      id
    ]);

    res.json({ success: true, contact: result.rows[0] });
  } catch (err) {
    console.error('Error updating contact:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add timestamped note to contact
app.post('/api/admin/contacts/:id/notes', adminAuth, async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Note text is required' });

  try {
    const existing = await query('SELECT * FROM leads WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    const currentNotes = Array.isArray(existing.rows[0].notes) ? existing.rows[0].notes : [];
    const updatedNotes = [
      ...currentNotes,
      { id: Date.now().toString(), date: new Date().toISOString(), text }
    ];

    const result = await query('UPDATE leads SET notes = $1 WHERE id = $2 RETURNING *', [
      JSON.stringify(updatedNotes),
      id
    ]);

    res.json({ success: true, contact: result.rows[0] });
  } catch (err) {
    console.error('Error appending note:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send 1-on-1 CRM Email with Google Meet Link
app.post('/api/admin/email/send-one', adminAuth, async (req, res) => {
  const { contactId, email, name, templateId, customSubject, customBody, googleMeetUrl } = req.body;
  const targetEmail = email;

  if (!targetEmail) return res.status(400).json({ error: 'Target email is required' });

  const baseUrl = getAppBaseUrl(req);

  try {
    // Check if contact is unsubscribed
    const contactRes = await query('SELECT * FROM leads WHERE email = $1', [targetEmail]);
    const contact = contactRes.rows[0];

    if (contact && contact.is_unsubscribed) {
      return res.status(400).json({ error: 'Cannot send promotional email: User has unsubscribed from communications.' });
    }

    const unsubToken = contact?.unsubscribe_token || generateToken();

    const dispatchResult = await sendDirectCrmEmail({
      toEmail: targetEmail,
      name: name || contact?.name || '',
      templateId,
      customSubject,
      customBody,
      googleMeetUrl,
      unsubscribeToken: unsubToken,
      appBaseUrl: baseUrl
    });

    if (dispatchResult.success) {
      // Update last promotional contact and status
      await query('UPDATE leads SET last_promotional_contact = CURRENT_TIMESTAMP, status = CASE WHEN status = \'lead\' THEN \'contacted\' ELSE status END WHERE email = $1', [targetEmail]);

      // Add audit note
      const templateName = EMAIL_TEMPLATES.find(t => t.id === templateId)?.name || 'Custom Email';
      if (contact) {
        const currentNotes = Array.isArray(contact.notes) ? contact.notes : [];
        const updatedNotes = [
          ...currentNotes,
          { id: Date.now().toString(), date: new Date().toISOString(), text: `Sent Email: "${templateName}" with Google Meet link.` }
        ];
        await query('UPDATE leads SET notes = $1 WHERE id = $2', [JSON.stringify(updatedNotes), contact.id]);
      }

      res.json({ success: true, message: `Email dispatched to ${targetEmail}` });
    } else {
      res.status(500).json({ error: dispatchResult.error || 'Failed to dispatch email' });
    }
  } catch (err) {
    console.error('Error sending CRM direct email:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Broadcast Marketing Campaign to Filtered Contacts
app.post('/api/admin/email/broadcast', adminAuth, async (req, res) => {
  const { templateId, customSubject, customBody, googleMeetUrl, filterStatus, filterTool } = req.body;
  const baseUrl = getAppBaseUrl(req);

  try {
    const allContacts = await query('SELECT * FROM leads WHERE is_unsubscribed = false');
    let recipients = allContacts.rows;

    if (filterStatus && filterStatus !== 'all') {
      recipients = recipients.filter(c => c.status === filterStatus);
    }
    if (filterTool && filterTool !== 'all') {
      recipients = recipients.filter(c => Array.isArray(c.preferences) && c.preferences.includes(filterTool));
    }

    if (recipients.length === 0) {
      return res.status(400).json({ error: 'No active, subscribed recipients match the selected criteria.' });
    }

    let successCount = 0;
    let failCount = 0;

    for (const recipient of recipients) {
      const result = await sendDirectCrmEmail({
        toEmail: recipient.email,
        name: recipient.name || '',
        templateId,
        customSubject,
        customBody,
        googleMeetUrl,
        unsubscribeToken: recipient.unsubscribe_token,
        appBaseUrl: baseUrl
      });

      if (result.success) {
        successCount++;
        await query('UPDATE leads SET last_promotional_contact = CURRENT_TIMESTAMP WHERE id = $1', [recipient.id]);
      } else {
        failCount++;
      }
    }

    res.json({ 
      success: true, 
      sent: successCount, 
      failed: failCount, 
      total: recipients.length 
    });
  } catch (err) {
    console.error('Error broadcasting email campaign:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CRM Stats Overview
app.get('/api/admin/stats', adminAuth, async (req, res) => {
  try {
    const totalLeads = await query('SELECT COUNT(*) FROM leads');
    const toolStats = await query(`
      SELECT pref as tool, COUNT(*) as count 
      FROM leads, jsonb_array_elements_text(preferences) as pref 
      GROUP BY pref 
      ORDER BY count DESC
    `);
    const statusStats = await query(`
      SELECT status, COUNT(*) as count 
      FROM leads 
      GROUP BY status
    `);
    
    res.json({
      totalLeads: parseInt(totalLeads.rows[0]?.count || totalLeads.rows.length || 0),
      toolStats: toolStats.rows,
      statusStats: statusStats.rows
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark Contacted (Legacy)
app.post('/api/admin/mark-contacted', adminAuth, async (req, res) => {
  const { email } = req.body;
  try {
    await query('UPDATE leads SET last_promotional_contact = CURRENT_TIMESTAMP, status = \'contacted\' WHERE email = $1', [email]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating contacted status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static assets from the pre-built dist folder
app.use(express.static(join(__dirname, 'dist')));

// Ensure Railway health checks report 200 OK without touching the filesystem
app.get('/health', (req, res) => res.status(200).send('OK'));

// Fallback to index.html for Single Page Application routing
app.use((req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`MyTradingToolbox CRM Hub Server running on port ${port}`);
});
