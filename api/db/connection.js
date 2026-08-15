import pg from 'pg';
import crypto from 'crypto';
import { config } from '../config/env.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: config.databaseUrl?.includes('localhost') ? false : { 
    rejectUnauthorized: false 
  }
});

export function generateToken() {
  return crypto.randomBytes(16).toString('hex');
}

export const DEFAULT_TEMPLATES = [
  {
    id: 'welcome_introduction',
    name: 'Welcome & Introduction (Discovery & Strategy)',
    category: 'Onboarding & Discovery',
    subject: 'Welcome to MyTradingToolbox — quick hello from Keith',
    description: 'Friendly intro asking how they found you, what strategies they trade, specific questions to answer by email, and offering an optional live Google Meet.',
    default_meet_url: config.defaultMeetUrl,
    is_system: true,
    body: `<p>Hi {{name}},</p>
<p>I'm Keith Thompson, the creator behind <strong>MyTradingToolbox</strong>. I wanted to personally reach out, say hello, and welcome you to our trading community!</p>
<p>We engineered these tools specifically for active income and options traders who want clearer data, automated cash flow forecasting, and disciplined risk management.</p>

<div style="background-color: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #334155; margin: 24px 0;">
  <h3 style="color: #38bdf8; margin-top: 0; margin-bottom: 12px; font-size: 15px;">I'd love to learn a little about you and your level of interest in options trading:</h3>
  <ol style="color: #cbd5e1; line-height: 1.7; padding-left: 20px; font-size: 14px; margin-bottom: 0;">
    <li><strong>How did you find MyTradingToolbox?</strong> (A friend/referral, trader community, social media, or search?)</li>
    <li><strong>What strategies are you currently running?</strong> (Covered calls, cash-secured puts, spreads, dividend growth, etc.)</li>
    <li><strong>Do you have any specific questions about our tools</strong> that I can answer for you with a quick reply?</li>
  </ol>
</div>

<p>You can simply <strong>hit Reply to this email</strong> and let me know—I read and respond to every email personally.</p>

<div style="background-color: #0f172a; padding: 18px 20px; border-radius: 12px; border: 1px dashed #334155; margin: 24px 0; text-align: center;">
  <p style="color: #94a3b8; font-size: 13px; margin: 0 0 12px 0;">Prefer to chat live? I'd be happy to hop on a quick 10-15 minute Google Meet video call:</p>
  <a href="{{meet_url}}" style="background: linear-gradient(135deg, #0284c7, #2563eb); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 14px; box-shadow: 0 4px 12px rgba(2,132,199,0.3);">
    Book / Join Quick Google Meet &rarr;
  </a>
</div>

<p style="margin-bottom: 0;">Excited to have you with us,<br/><strong>Keith Thompson</strong><br/><span style="color: #64748b; font-size: 13px;">Founder, MyTradingToolbox</span></p>`
  },
  {
    id: 'google_meet_demo',
    name: 'Google Meet 1-on-1 Demo Walkthrough',
    category: 'Sales & Onboarding',
    subject: 'Personal Invitation: 1-on-1 Walkthrough of MyTradingToolbox Suite',
    description: 'Invite high-intent traders to an exclusive 1-on-1 Google Meet video call walkthrough of Opus, CashMap, and Alerting Engine.',
    default_meet_url: config.defaultMeetUrl,
    is_system: true,
    body: `<p>Hi {{name}},</p>
<p>Thanks for your interest in <strong>MyTradingToolbox</strong>! We are currently onboarding a select group of options and income traders to showcase our end-to-end execution and analytics suite.</p>

<div style="background-color: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #334155; margin: 24px 0;">
  <h3 style="color: #38bdf8; margin-top: 0; margin-bottom: 12px; font-size: 16px;">What We Will Cover in Your 15-Minute Google Meet Demo:</h3>
  <ul style="color: #cbd5e1; line-height: 1.7; padding-left: 20px; font-size: 14px; margin-bottom: 0;">
    <li><strong>Opus Options Engine:</strong> Live analysis for covered calls, cash-secured puts, and multi-leg spreads with real-time Tradier connectivity.</li>
    <li><strong>CashMap Planner:</strong> Automated cash flow forecasting combining option premium & dividend schedules.</li>
    <li><strong>Real-Time Alert Engine:</strong> Strike breaches and implied expected move telemetry via SMS/email.</li>
    <li><strong>AI Options Coach:</strong> Tailored position sizing and strategy adjustments.</li>
  </ul>
</div>

<p>Would you have 15 minutes this week for a live walkthrough and to get direct access?</p>

<div style="text-align: center; margin: 30px 0;">
  <a href="{{meet_url}}" style="background: linear-gradient(135deg, #0284c7, #2563eb); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; font-size: 15px; box-shadow: 0 4px 14px rgba(2,132,199,0.3);">
    Join / Schedule Google Meet Demo &rarr;
  </a>
</div>

<p style="color: #94a3b8; font-size: 14px;">If you prefer another time, feel free to reply directly to this email with what days work best for you.</p>`
  },
  {
    id: 'feature_announcement',
    name: 'New Feature Drop & Tool Showcase',
    category: 'Product Updates',
    subject: 'New Tools Released: AI Options Coach, Stock Health & CashMap Integration',
    description: 'Keep your users and leads engaged by showcasing new suite capabilities and improvements.',
    default_meet_url: config.defaultMeetUrl,
    is_system: true,
    body: `<p>Hi {{name}},</p>
<p>We've rolled out major upgrades across the <strong>MyTradingToolbox</strong> ecosystem designed to give income traders a decisive edge in volatile markets.</p>

<div style="background-color: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #334155; margin: 20px 0;">
  <h3 style="color: #2dd4bf; margin-top: 0; font-size: 16px;">Key Suite Highlights:</h3>
  <div style="margin-bottom: 14px;">
    <h4 style="color: #38bdf8; margin: 0 0 4px 0; font-size: 14px;">1. Opus AI Options Coach</h4>
    <p style="color: #cbd5e1; font-size: 13px; margin: 0; line-height: 1.5;">Curated options strategy knowledge agent to assist in structuring covered calls, credit spreads, and risk mitigations.</p>
  </div>
  <div style="margin-bottom: 14px;">
    <h4 style="color: #38bdf8; margin: 0 0 4px 0; font-size: 14px;">2. Stock Health Analysis & Daily Ingestion</h4>
    <p style="color: #cbd5e1; font-size: 13px; margin: 0; line-height: 1.5;">Evaluates all publicly traded equities against S&P 500 benchmarks, sector peers, and DCF intrinsic valuations.</p>
  </div>
  <div>
    <h4 style="color: #38bdf8; margin: 0 0 4px 0; font-size: 14px;">3. Direct CashMap & Alerts Synchronization</h4>
    <p style="color: #cbd5e1; font-size: 13px; margin: 0; line-height: 1.5;">Seamlessly track realized options premium alongside automated SMS price and strike alerts.</p>
  </div>
</div>

<div style="text-align: center; margin: 28px 0;">
  <a href="https://opus.mytradingtoolbox.com" style="background-color: #0284c7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 14px; margin-right: 12px;">
    Explore Opus Platform
  </a>
  <a href="{{meet_url}}" style="background-color: #334155; color: #f8fafc; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 14px;">
    Book Live Video Demo
  </a>
</div>`
  },
  {
    id: 'founder_outreach',
    name: 'Personal Founder Check-In & Strategy Call',
    category: 'Founder Outreach',
    subject: 'Quick question regarding your trading workflow',
    description: 'Personal, high-response rate email from the founder offering 1-on-1 strategy support and demo setup.',
    default_meet_url: config.defaultMeetUrl,
    is_system: true,
    body: `<p>Hi {{name}},</p>
<p>I noticed your interest in the MyTradingToolbox suite. I am the lead builder behind the platform, and I wanted to personally reach out.</p>
<p>Whether you're selling covered calls for monthly income, running cash-secured puts, or looking for cleaner risk telemetry, we engineered these tools specifically for active income traders.</p>
<p>I'd love to jump on a quick 10-minute Google Meet call to learn about your current setup, answer any questions, and give you early access.</p>

<div style="text-align: center; margin: 25px 0;">
  <a href="{{meet_url}}" style="background: linear-gradient(135deg, #0284c7, #2563eb); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 14px;">
    Click Here to Meet on Google Meet &rarr;
  </a>
</div>

<p>Looking forward to connecting!</p>
<p style="margin-bottom: 0;">Best regards,<br/><strong>Keith Thompson</strong><br/><span style="color: #64748b; font-size: 13px;">Founder, MyTradingToolbox</span></p>`
  },
  {
    id: 'beta_access',
    name: 'VIP Beta Access & Revenue Pitch',
    category: 'Conversion & Sales',
    subject: 'Your VIP Early Access to the MyTradingToolbox Suite',
    description: 'High-converting invitation offering grandfathered access and private onboarding.',
    default_meet_url: config.defaultMeetUrl,
    is_system: true,
    body: `<p>Hi {{name}},</p>
<p>Your spot for early access to <strong>MyTradingToolbox</strong> is ready! As an early member, you will receive full access to our complete suite of trading engines:</p>
<ul style="color: #cbd5e1; line-height: 1.6; padding-left: 20px; font-size: 14px;">
  <li>Full Opus Options Suite with Tradier one-click execution</li>
  <li>CashMap Income Forecaster</li>
  <li>Real-Time SMS Alert Engine & Volatility Insights</li>
  <li>AI Options Strategy Coach</li>
</ul>
<p>We are hosting onboarding sessions this week on Google Meet to get your custom watchlists and strategies configured.</p>

<div style="text-align: center; margin: 28px 0;">
  <a href="{{meet_url}}" style="background: linear-gradient(135deg, #10b981, #059669); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; font-size: 15px;">
    Claim VIP Access & Schedule Onboarding &rarr;
  </a>
</div>`
  }
];

export let mockTemplates = JSON.parse(JSON.stringify(DEFAULT_TEMPLATES));

export let mockLeads = [
  { 
    id: 1, 
    email: 'demo@mytradingtoolbox.com', 
    name: 'Alex Trader',
    status: 'demo_scheduled',
    source: 'referral',
    preferences: ['opus-analysis', 'opus-alerts', 'market-insights'], 
    notes: [
      { id: '1', date: new Date(Date.now() - 43200000).toISOString(), text: 'Scheduled Google Meet walkthrough for Opus Options Engine.' }
    ],
    visit_count: 5, 
    last_accessed: new Date(), 
    created_at: new Date(Date.now() - 86400000),
    last_promotional_contact: new Date(Date.now() - 43200000),
    unsubscribe_token: 'demo-token-12345',
    is_unsubscribed: false,
    unsubscribed_at: null
  },
  { 
    id: 2, 
    email: 'tester@example.com', 
    name: 'Sarah Jenkins',
    status: 'contacted',
    source: 'waitlist',
    preferences: ['cashmap'], 
    notes: [
      { id: '2', date: new Date(Date.now() - 86400000).toISOString(), text: 'Interested in dividend & option premium cash flow tracking.' }
    ],
    visit_count: 2, 
    last_accessed: new Date(Date.now() - 3600000), 
    created_at: new Date(Date.now() - 172800000),
    last_promotional_contact: new Date(),
    unsubscribe_token: 'tester-token-67890',
    is_unsubscribed: false,
    unsubscribed_at: null
  }
];

export async function initDb() {
  if (config.useMockDb) {
    console.log('[DB] Using In-Memory Database.');
    return;
  }
  
  try {
    const client = await pool.connect();
    console.log('[DB] Connecting to PostgreSQL & verifying schema...');

    // 1. Leads Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT DEFAULT '',
        status TEXT DEFAULT 'lead',
        source TEXT DEFAULT 'waitlist',
        preferences JSONB DEFAULT '[]',
        notes JSONB DEFAULT '[]',
        visit_count INTEGER DEFAULT 1,
        last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_promotional_contact TIMESTAMP,
        unsubscribe_token TEXT UNIQUE,
        is_unsubscribed BOOLEAN DEFAULT FALSE,
        unsubscribed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Migrations for leads
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='name') THEN
          ALTER TABLE leads ADD COLUMN name TEXT DEFAULT '';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='status') THEN
          ALTER TABLE leads ADD COLUMN status TEXT DEFAULT 'lead';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='source') THEN
          ALTER TABLE leads ADD COLUMN source TEXT DEFAULT 'waitlist';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='notes') THEN
          ALTER TABLE leads ADD COLUMN notes JSONB DEFAULT '[]';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='unsubscribe_token') THEN
          ALTER TABLE leads ADD COLUMN unsubscribe_token TEXT UNIQUE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='is_unsubscribed') THEN
          ALTER TABLE leads ADD COLUMN is_unsubscribed BOOLEAN DEFAULT FALSE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='unsubscribed_at') THEN
          ALTER TABLE leads ADD COLUMN unsubscribed_at TIMESTAMP;
        END IF;
      END $$;
    `);

    // 2. Email Templates Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS email_templates (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT DEFAULT 'General',
        subject TEXT NOT NULL,
        description TEXT DEFAULT '',
        body TEXT NOT NULL,
        default_meet_url TEXT DEFAULT '',
        is_system BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const tplCountRes = await client.query('SELECT COUNT(*) FROM email_templates');
    if (parseInt(tplCountRes.rows[0].count) === 0) {
      console.log('[DB] Seeding default email templates...');
      for (const tpl of DEFAULT_TEMPLATES) {
        await client.query(`
          INSERT INTO email_templates (id, name, category, subject, description, body, default_meet_url, is_system)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO NOTHING;
        `, [tpl.id, tpl.name, tpl.category, tpl.subject, tpl.description, tpl.body, tpl.default_meet_url, tpl.is_system]);
      }
    }

    console.log('[DB] PostgreSQL schema & templates verified successfully.');
    client.release();
  } catch (err) {
    console.warn('[DB] PostgreSQL connection unavailable. Falling back to In-Memory DB:', err.message);
    config.useMockDb = true;
  }
}

export async function query(text, params = []) {
  if (config.useMockDb) {
    return handleMockQuery(text, params);
  }

  try {
    return await pool.query(text, params);
  } catch (err) {
    console.error('[DB] Query Error, failing over to mock:', err.message);
    config.useMockDb = true;
    return handleMockQuery(text, params);
  }
}

function handleMockQuery(text, params) {
  const normalized = text.toLowerCase().trim();

  // TEMPLATES: GET ALL / FILTERED
  if (normalized.startsWith('select * from email_templates')) {
    if (normalized.includes('where id = $1')) {
      const id = params[0];
      const t = mockTemplates.find(tpl => tpl.id === id);
      return { rows: t ? [t] : [] };
    }
    return { rows: [...mockTemplates] };
  }

  // TEMPLATES: UPSERT / UPDATE
  if (normalized.includes('insert into email_templates')) {
    const [id, name, category, subject, description, body, defaultMeetUrl, isSystem] = params;
    let t = mockTemplates.find(tpl => tpl.id === id);
    if (t) {
      t.name = name;
      t.category = category;
      t.subject = subject;
      t.description = description;
      t.body = body;
      t.default_meet_url = defaultMeetUrl;
    } else {
      t = {
        id,
        name,
        category,
        subject,
        description,
        body,
        default_meet_url: defaultMeetUrl || config.defaultMeetUrl,
        is_system: isSystem || false,
        created_at: new Date(),
        updated_at: new Date()
      };
      mockTemplates.push(t);
    }
    return { rows: [t] };
  }

  if (normalized.startsWith('update email_templates set')) {
    const id = params[params.length - 1];
    let t = mockTemplates.find(tpl => tpl.id === id);
    if (t) {
      t.name = params[0];
      t.category = params[1];
      t.subject = params[2];
      t.description = params[3];
      t.body = params[4];
      t.default_meet_url = params[5] || t.default_meet_url;
      t.updated_at = new Date();
      return { rows: [t] };
    }
    return { rows: [] };
  }

  if (normalized.startsWith('delete from email_templates')) {
    const id = params[0];
    mockTemplates = mockTemplates.filter(t => t.id !== id);
    return { rowCount: 1 };
  }

  // LEADS: GET ALL / FILTERED
  if (normalized.startsWith('select * from leads')) {
    if (normalized.includes('where unsubscribe_token = $1')) {
      const token = params[0];
      const lead = mockLeads.find(l => l.unsubscribe_token === token);
      return { rows: lead ? [lead] : [] };
    }
    if (normalized.includes('where email = $1')) {
      const email = params[0];
      const lead = mockLeads.find(l => l.email === email);
      return { rows: lead ? [lead] : [] };
    }
    if (normalized.includes('where is_unsubscribed = false')) {
      return { rows: mockLeads.filter(l => !l.is_unsubscribed).sort((a,b) => b.id - a.id) };
    }
    return { rows: [...mockLeads].sort((a,b) => b.id - a.id) };
  }

  // STATS
  if (normalized.includes('count(*)') && !normalized.includes('group by') && normalized.includes('from leads')) {
    return { rows: [{ count: mockLeads.length }] };
  }

  if (normalized.includes('group by status')) {
    const counts = {};
    mockLeads.forEach(l => {
      const st = l.status || 'lead';
      counts[st] = (counts[st] || 0) + 1;
    });
    return { rows: Object.entries(counts).map(([status, count]) => ({ status, count })) };
  }

  if (normalized.includes('jsonb_array_elements_text')) {
    const counts = {};
    mockLeads.forEach(l => {
      if (Array.isArray(l.preferences)) {
        l.preferences.forEach(p => counts[p] = (counts[p] || 0) + 1);
      }
    });
    return { rows: Object.entries(counts).map(([tool, count]) => ({ tool, count })) };
  }

  // MANUAL CONTACT CREATION / INSERT
  if (normalized.includes('insert into leads (email, name, status, source, preferences, notes, unsubscribe_token)')) {
    const [email, name, status, source, prefsJson, notesJson, token] = params;
    const prefs = typeof prefsJson === 'string' ? JSON.parse(prefsJson) : (prefsJson || []);
    const notes = typeof notesJson === 'string' ? JSON.parse(notesJson) : (notesJson || []);
    
    let lead = mockLeads.find(l => l.email === email);
    if (lead) {
      lead.name = name || lead.name;
      lead.status = status || lead.status;
      lead.source = source || lead.source;
      lead.preferences = prefs;
      lead.notes = [...(lead.notes || []), ...notes];
    } else {
      lead = {
        id: mockLeads.length + 1,
        email,
        name: name || '',
        status: status || 'lead',
        source: source || 'manual_admin',
        preferences: prefs,
        notes: notes,
        visit_count: 1,
        last_accessed: new Date(),
        created_at: new Date(),
        last_promotional_contact: null,
        unsubscribe_token: token || generateToken(),
        is_unsubscribed: false,
        unsubscribed_at: null
      };
      mockLeads.push(lead);
    }
    return { rows: [lead] };
  }

  // PUBLIC LEAD CAPTURE UPSERT
  if (normalized.includes('insert into leads (email, preferences, unsubscribe_token, visit_count, last_accessed)')) {
    const [email, prefsJson, token] = params;
    const prefs = typeof prefsJson === 'string' ? JSON.parse(prefsJson) : (prefsJson || []);
    let lead = mockLeads.find(l => l.email === email);
    if (lead) {
      lead.preferences = prefs;
      lead.visit_count += 1;
      lead.last_accessed = new Date();
      if (!lead.unsubscribe_token) lead.unsubscribe_token = token || generateToken();
    } else {
      lead = {
        id: mockLeads.length + 1,
        email,
        name: '',
        status: 'lead',
        source: 'waitlist',
        preferences: prefs,
        notes: [],
        visit_count: 1,
        last_accessed: new Date(),
        created_at: new Date(),
        last_promotional_contact: null,
        unsubscribe_token: token || generateToken(),
        is_unsubscribed: false,
        unsubscribed_at: null
      };
      mockLeads.push(lead);
    }
    return { rows: [lead] };
  }

  // UPDATE BY ID
  if (normalized.startsWith('update leads set') && normalized.includes('where id = $')) {
    const id = params[params.length - 1];
    const lead = mockLeads.find(l => l.id === parseInt(id));
    if (lead) {
      if (normalized.includes('status = $1') && !normalized.includes('name = $2')) lead.status = params[0];
      if (normalized.includes('name = $1, status = $2, preferences = $3')) {
        lead.name = params[0];
        lead.status = params[1];
        lead.preferences = typeof params[2] === 'string' ? JSON.parse(params[2]) : params[2];
      }
      if (normalized.includes('notes = $1')) {
        lead.notes = typeof params[0] === 'string' ? JSON.parse(params[0]) : params[0];
      }
      if (normalized.includes('last_promotional_contact = current_timestamp')) {
        lead.last_promotional_contact = new Date();
      }
      return { rows: [lead] };
    }
    return { rows: [] };
  }

  // UNSUBSCRIBE
  if (normalized.includes('is_unsubscribed = true')) {
    const identifier = params[0];
    const lead = mockLeads.find(l => l.unsubscribe_token === identifier || l.email === identifier);
    if (lead) {
      lead.is_unsubscribed = true;
      lead.unsubscribed_at = new Date();
      lead.status = 'unsubscribed';
      return { rows: [lead] };
    }
    return { rows: [] };
  }

  // RESUBSCRIBE
  if (normalized.includes('is_unsubscribed = false')) {
    const identifier = params[0];
    const lead = mockLeads.find(l => l.unsubscribe_token === identifier || l.email === identifier);
    if (lead) {
      lead.is_unsubscribed = false;
      lead.unsubscribed_at = null;
      lead.status = 'lead';
      return { rows: [lead] };
    }
    return { rows: [] };
  }

  // GENERIC UPDATE
  if (normalized.includes('update leads')) {
    const email = params[0];
    const lead = mockLeads.find(l => l.email === email);
    if (lead) {
      if (normalized.includes('last_promotional_contact')) {
        lead.last_promotional_contact = new Date();
      } else {
        lead.last_accessed = new Date();
      }
    }
    return { rows: [lead || {}] };
  }

  return { rows: [] };
}
