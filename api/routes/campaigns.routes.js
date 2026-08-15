import { Router } from 'express';
import { campaignsController } from '../controllers/campaigns.controller.js';
import { adminAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(adminAuth);

router.get('/templates', (req, res) => campaignsController.getTemplates(req, res));
router.post('/templates', (req, res) => campaignsController.createTemplate(req, res));
router.put('/templates/:id', (req, res) => campaignsController.updateTemplate(req, res));
router.post('/templates/:id/reset', (req, res) => campaignsController.resetTemplate(req, res));
router.delete('/templates/:id', (req, res) => campaignsController.deleteTemplate(req, res));
router.post('/templates/test-send', (req, res) => campaignsController.testSend(req, res));

router.post('/send-one', (req, res) => campaignsController.sendOne(req, res));
router.post('/broadcast', (req, res) => campaignsController.broadcast(req, res));

export default router;
