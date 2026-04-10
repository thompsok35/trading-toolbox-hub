import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { query, initDb } from './db.js';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Initialize Database
initDb().catch(err => console.error('Failed to init DB:', err));

// Middleware
app.use(express.json());

// Lead API
app.post('/api/leads', async (req, res) => {
  const { email, preferences } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    // Upsert lead: update preferences and visit count if email exists
    const queryString = `
      INSERT INTO leads (email, preferences, visit_count, last_accessed)
      VALUES ($1, $2, 1, CURRENT_TIMESTAMP)
      ON CONFLICT (email) 
      DO UPDATE SET 
        preferences = EXCLUDED.preferences,
        visit_count = leads.visit_count + 1,
        last_accessed = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const result = await query(queryString, [email, JSON.stringify(preferences || [])]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error saving lead:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Heartbeat for identified users
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

// Admin API (Protected)
const adminAuth = (req, res, next) => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const providedPassword = req.headers['x-admin-password'];
  
  if (!adminPassword || providedPassword !== adminPassword) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

app.get('/api/admin/leads', adminAuth, async (req, res) => {
  try {
    const result = await query('SELECT * FROM leads ORDER BY last_accessed DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching leads:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/admin/mark-contacted', adminAuth, async (req, res) => {
  const { email } = req.body;
  try {
    await query('UPDATE leads SET last_promotional_contact = CURRENT_TIMESTAMP WHERE email = $1', [email]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating contacted status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/admin/stats', adminAuth, async (req, res) => {
  try {
    const totalLeads = await query('SELECT COUNT(*) FROM leads');
    const toolStats = await query(`
      SELECT pref as tool, COUNT(*) as count 
      FROM leads, jsonb_array_elements_text(preferences) as pref 
      GROUP BY pref 
      ORDER BY count DESC
    `);
    
    res.json({
      totalLeads: parseInt(totalLeads.rows[0].count),
      toolStats: toolStats.rows
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
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
// Securely bind port dynamically (Node natively supports both IPv4 & IPv6 here without explicit strict strings)
app.listen(port, () => {
  console.log(`Static server dynamically bound and listening on port ${port}`);
});
