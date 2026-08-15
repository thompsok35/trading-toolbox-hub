import { query } from '../db/connection.js';

export class AnalyticsService {
  async getCRMStats() {
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

    return {
      totalLeads: parseInt(totalLeads.rows[0]?.count || totalLeads.rows.length || 0),
      toolStats: toolStats.rows,
      statusStats: statusStats.rows
    };
  }
}

export const analyticsService = new AnalyticsService();
