import { analyticsService } from '../services/analytics.service.js';

export class AnalyticsController {
  async getStats(req, res) {
    const stats = await analyticsService.getCRMStats();
    res.json(stats);
  }
}

export const analyticsController = new AnalyticsController();
