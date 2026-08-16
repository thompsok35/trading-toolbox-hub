import { query } from '../connection.js';

export class SupportRepository {
  async createTicket({ userId, email, appContext, subject, message }) {
    const res = await query(
      `INSERT INTO support_tickets (user_id, email, app_context, subject, message, status)
       VALUES ($1, $2, $3, $4, $5, 'open')
       RETURNING *`,
      [userId || null, email.toLowerCase().trim(), appContext || 'general', subject.trim(), message.trim()]
    );
    return res.rows[0];
  }

  async getAllTickets() {
    const res = await query('SELECT * FROM support_tickets ORDER BY created_at DESC');
    return res.rows;
  }

  async getTicketsByUserId(userId) {
    const res = await query('SELECT * FROM support_tickets WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return res.rows;
  }

  async updateTicketStatus(id, { status, adminNotes }) {
    const res = await query(
      `UPDATE support_tickets 
       SET status = COALESCE($2, status), admin_notes = COALESCE($3, admin_notes)
       WHERE id = $1
       RETURNING *`,
      [id, status, adminNotes]
    );
    return res.rows[0];
  }
}

export const supportRepository = new SupportRepository();
