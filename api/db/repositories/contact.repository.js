import { query, generateToken } from '../connection.js';

export class ContactRepository {
  async getAllContacts() {
    const result = await query('SELECT * FROM leads ORDER BY id DESC');
    return result.rows;
  }

  async getSubscribedContacts() {
    const result = await query('SELECT * FROM leads WHERE is_unsubscribed = false ORDER BY id DESC');
    return result.rows;
  }

  async findByEmail(email) {
    const result = await query('SELECT * FROM leads WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  async findById(id) {
    const result = await query('SELECT * FROM leads WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async findByToken(token) {
    const result = await query('SELECT * FROM leads WHERE unsubscribe_token = $1', [token]);
    return result.rows[0] || null;
  }

  async upsertPublicLead(email, preferences = []) {
    const token = generateToken();
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
    const result = await query(queryString, [email, JSON.stringify(preferences), token]);
    return result.rows[0];
  }

  async createOrUpdateManual(contactData) {
    const { email, name = '', status = 'lead', source = 'manual_admin', preferences = [], notes = [] } = contactData;
    const token = generateToken();
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
      name, 
      status, 
      source, 
      JSON.stringify(preferences), 
      JSON.stringify(notes), 
      token
    ]);
    return result.rows[0];
  }

  async updateContact(id, updates) {
    const current = await this.findById(id);
    if (!current) return null;

    const name = updates.name !== undefined ? updates.name : current.name;
    const status = updates.status !== undefined ? updates.status : current.status;
    const preferences = updates.preferences !== undefined ? updates.preferences : current.preferences;

    const queryString = `
      UPDATE leads 
      SET name = $1, status = $2, preferences = $3 
      WHERE id = $4 
      RETURNING *;
    `;
    const result = await query(queryString, [name, status, JSON.stringify(preferences), id]);
    return result.rows[0];
  }

  async appendNote(id, noteText) {
    const current = await this.findById(id);
    if (!current) return null;

    const currentNotes = Array.isArray(current.notes) ? current.notes : [];
    const updatedNotes = [
      ...currentNotes,
      { id: Date.now().toString(), date: new Date().toISOString(), text: noteText }
    ];

    const result = await query('UPDATE leads SET notes = $1 WHERE id = $2 RETURNING *', [
      JSON.stringify(updatedNotes),
      id
    ]);
    return result.rows[0];
  }

  async deleteContact(id) {
    const res = await query('DELETE FROM leads WHERE id = $1 RETURNING *', [id]);
    return res.rows[0] || null;
  }

  async recordPromotionalContact(email) {
    const result = await query(`
      UPDATE leads 
      SET last_promotional_contact = CURRENT_TIMESTAMP, 
          status = CASE WHEN status = 'lead' THEN 'contacted' ELSE status END 
      WHERE email = $1 
      RETURNING *;
    `, [email]);
    return result.rows[0];
  }

  async unsubscribe(identifier) {
    const queryString = `
      UPDATE leads 
      SET is_unsubscribed = true, 
          unsubscribed_at = CURRENT_TIMESTAMP, 
          status = 'unsubscribed'
      WHERE unsubscribe_token = $1 OR email = $1
      RETURNING *;
    `;
    const result = await query(queryString, [identifier]);
    return result.rows[0] || null;
  }

  async resubscribe(identifier) {
    const queryString = `
      UPDATE leads 
      SET is_unsubscribed = false, 
          unsubscribed_at = NULL, 
          status = 'lead'
      WHERE unsubscribe_token = $1 OR email = $1
      RETURNING *;
    `;
    const result = await query(queryString, [identifier]);
    return result.rows[0] || null;
  }

  async heartbeat(email) {
    const result = await query(`
      UPDATE leads 
      SET last_accessed = CURRENT_TIMESTAMP 
      WHERE email = $1 
      RETURNING *;
    `, [email]);
    return result.rows[0] || null;
  }
}

export const contactRepository = new ContactRepository();
