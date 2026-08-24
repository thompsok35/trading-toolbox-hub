import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';

const router = Router();

// Public: Get OAuth Client configuration
router.get('/config', (req, res) => authController.getConfig(req, res));

// Public: Google Sign-In & ID Token Verification
router.post('/google', (req, res) => authController.googleLogin(req, res));

// Current User Details
router.get('/me', (req, res) => authController.getMe(req, res));

export default router;
