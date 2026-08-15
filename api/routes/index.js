import { Router } from 'express';
import publicRoutes from './public.routes.js';
import contactsRoutes from './contacts.routes.js';
import campaignsRoutes from './campaigns.routes.js';
import analyticsRoutes from './analytics.routes.js';

const router = Router();

// Version 1 Routes
router.use('/v1/public', publicRoutes);
router.use('/v1/contacts', contactsRoutes);
router.use('/v1/campaigns', campaignsRoutes);
router.use('/v1/analytics', analyticsRoutes);

// Backwards compatibility aliases for existing frontend and clients
router.use('/', publicRoutes);
router.use('/admin/contacts', contactsRoutes);
router.use('/admin/leads', contactsRoutes); // legacy
router.use('/admin/mark-contacted', contactsRoutes); // legacy
router.use('/admin/templates', campaignsRoutes);
router.use('/admin/email', campaignsRoutes);
router.use('/admin', analyticsRoutes);

export default router;
