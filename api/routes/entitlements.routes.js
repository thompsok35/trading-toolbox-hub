import { Router } from 'express';
import { entitlementsController } from '../controllers/entitlements.controller.js';
import { adminAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Public / Satellite App Hook
router.post('/check', (req, res) => entitlementsController.checkAccess(req, res));

// Customer Support Ticket Submission (Public / Customer)
router.post('/support/tickets', (req, res) => entitlementsController.createTicket(req, res));

// Admin Protected Endpoints
router.get('/users', adminAuth, (req, res) => entitlementsController.getUsers(req, res));
router.put('/users/:id/entitlements', adminAuth, (req, res) => entitlementsController.updateEntitlements(req, res));
router.post('/users/:id/approve-coach', adminAuth, (req, res) => entitlementsController.approveAiCoach(req, res));
router.put('/users/:id/subscription', adminAuth, (req, res) => entitlementsController.updateSubscription(req, res));
router.get('/support/tickets', adminAuth, (req, res) => entitlementsController.getTickets(req, res));
router.put('/support/tickets/:id', adminAuth, (req, res) => entitlementsController.updateTicket(req, res));

export default router;
