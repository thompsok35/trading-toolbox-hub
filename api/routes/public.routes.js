import { Router } from 'express';
import { publicController } from '../controllers/public.controller.js';

const router = Router();

router.post('/leads', (req, res) => publicController.captureLead(req, res));
router.post('/leads/heartbeat', (req, res) => publicController.heartbeat(req, res));
router.get('/unsubscribe/status', (req, res) => publicController.getUnsubscribeStatus(req, res));
router.post('/unsubscribe', (req, res) => publicController.unsubscribe(req, res));
router.post('/unsubscribe/resubscribe', (req, res) => publicController.resubscribe(req, res));

export default router;
