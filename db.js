import pg from 'pg';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const { Pool } = pg;

const useMock = process.env.MOCK_DB === 'true';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { 
    rejectUnauthorized: false 
  }
});

export function generateToken() {
  return crypto.randomBytes(16).toString('hex');
}

// Mock In-Memory DB
let mockLeads = [
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

/**
 * Initialize the database tables if they don't exist and run non-destructive column additions
 */
export async function initDb() {
  if (useMock) {
    console.log('Using Mock Database (In-Memory).');
    return;
  }
  
  try {
    const client = await pool.connect();
    console.log('Initializing database tables...');
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

    // Safe migration checks for existing installations
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

    console.log('Database tables initialized and migrated successfully.');
    client.release();
  } catch (err) {
    console.warn('Postgres connection failed. Falling back to Mock Database (In-Memory).', err.message);
    process.env.MOCK_DB = 'true';
  }
}

/**
 * Custom query wrapper that falls back to mock storage if Postgres is unavailable
 */
export async function query(text, params = []) {
  if (process.env.MOCK_DB === 'true') {
    return handleMockQuery(text, params);
  }

  try {
    return await pool.query(text, params);
  } catch (err) {
    console.error('DB Query Error, falling back to mock:', err.message);
    process.env.MOCK_DB = 'true';
    return handleMockQuery(text, params);
  }
}

/**
 * Mock query handler for all CRM and Lead operations
 */
function handleMockQuery(text, params) {
  const normalized = text.toLowerCase().trim();

  // GET ALL / FILTERED
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
  if (normalized.includes('count(*)') && !normalized.includes('group by')) {
    const totalLeads = mockLeads.length;
    const activeLeads = mockLeads.filter(l => !l.is_unsubscribed).length;
    const demosScheduled = mockLeads.filter(l => l.status === 'demo_scheduled' || l.status === 'demo_requested').length;
    const customers = mockLeads.filter(l => l.status === 'customer').length;
    const unsubscribed = mockLeads.filter(l => l.is_unsubscribed).length;
    return { rows: [{ count: totalLeads, active: activeLeads, demos: demosScheduled, customers, unsubscribed }] };
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

  // UPDATE CONTACT DETAILS (STATUS / NAME / PREFERENCES / NOTES)
  if (normalized.startsWith('update leads set') && normalized.includes('where id = $')) {
    const id = params[params.length - 1];
    const lead = mockLeads.find(l => l.id === parseInt(id));
    if (lead) {
      if (normalized.includes('status = $1') && !normalized.includes('name = $2')) lead.status = params[0];
      if (normalized.includes('name = $1')) lead.name = params[0];
      if (normalized.includes('notes = $1')) {
        lead.notes = typeof params[0] === 'string' ? JSON.parse(params[0]) : params[0];
      }
      if (normalized.includes('name = $1, status = $2, preferences = $3, notes = $4')) {
        lead.name = params[0];
        lead.status = params[1];
        lead.preferences = typeof params[2] === 'string' ? JSON.parse(params[2]) : params[2];
        lead.notes = typeof params[3] === 'string' ? JSON.parse(params[3]) : params[3];
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

export default { query, initDb, generateToken };
