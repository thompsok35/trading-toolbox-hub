import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const useMock = process.env.MOCK_DB === 'true';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { 
    rejectUnauthorized: false 
  }
});

// Mock In-Memory DB
let mockLeads = [
  { 
    id: 1, 
    email: 'demo@mytradingtoolbox.com', 
    preferences: ['opus-analysis', 'opus-alerts', 'market-insights'], 
    visit_count: 5, 
    last_accessed: new Date(), 
    created_at: new Date(Date.now() - 86400000),
    last_promotional_contact: null 
  },
  { 
    id: 2, 
    email: 'tester@example.com', 
    preferences: ['cashmap'], 
    visit_count: 2, 
    last_accessed: new Date(Date.now() - 3600000), 
    created_at: new Date(Date.now() - 172800000),
    last_promotional_contact: new Date() 
  }
];

/**
 * Initialize the database tables if they don't exist
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
        preferences JSONB DEFAULT '[]',
        visit_count INTEGER DEFAULT 1,
        last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_promotional_contact TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database tables initialized successfully.');
    client.release();
  } catch (err) {
    console.warn('⚠️ Postgres connection failed. Falling back to Mock Database (In-Memory).');
    process.env.MOCK_DB = 'true'; // Set flag for session
  }
}

/**
 * Custom query wrapper that falls back to mock storage if Postgres is unavailable
 */
export async function query(text, params) {
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
 * Shitty but functional mock query handler for common operations
 */
function handleMockQuery(text, params) {
  const normalized = text.toLowerCase().trim();

  // GET ALL
  if (normalized.startsWith('select * from leads')) {
    return { rows: [...mockLeads].sort((a,b) => b.id - a.id) };
  }

  // STATS
  if (normalized.includes('count(*)') && !normalized.includes('group by')) {
    return { rows: [{ count: mockLeads.length }] };
  }
  if (normalized.includes('jsonb_array_elements_text')) {
    const counts = {};
    mockLeads.forEach(l => {
      l.preferences.forEach(p => counts[p] = (counts[p] || 0) + 1);
    });
    return { rows: Object.entries(counts).map(([tool, count]) => ({ tool, count })) };
  }

  // UPSERT
  if (normalized.includes('insert into leads')) {
    const [email, prefsJson] = params;
    const prefs = JSON.parse(prefsJson);
    let lead = mockLeads.find(l => l.email === email);
    if (lead) {
      lead.preferences = prefs;
      lead.visit_count += 1;
      lead.last_accessed = new Date();
    } else {
      lead = {
        id: mockLeads.length + 1,
        email,
        preferences: prefs,
        visit_count: 1,
        last_accessed: new Date(),
        created_at: new Date(),
        last_promotional_contact: null
      };
      mockLeads.push(lead);
    }
    return { rows: [lead] };
  }

  // UPDATE CONTACTED / HEARTBEAT
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
    return { rows: [lead] };
  }

  return { rows: [] };
}

export default { query, initDb };
