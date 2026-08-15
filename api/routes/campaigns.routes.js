import { Router } from 'express';
import { campaignsController } from '../controllers/campaigns.controller.js';
import { adminAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(adminAuth);

router.get('/templates', (req, res) => campaignsController.getTemplates(req, res));
router.post('/send-one', (req, res) => campaignsController.sendOne(req, res));
router.post('/broadcast', (req, res) => campaignsController.broadcast(req, res));

export default router;
