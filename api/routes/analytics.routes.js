import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller.js';
import { adminAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(adminAuth);

router.get('/stats', (req, res) => analyticsController.getStats(req, res));

export default router;
