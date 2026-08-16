import { Router } from 'express';
import { contactsController } from '../controllers/contacts.controller.js';
import { adminAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(adminAuth);

router.get('/', (req, res) => contactsController.getContacts(req, res));
router.post('/', (req, res) => contactsController.createContact(req, res));
router.patch('/:id', (req, res) => contactsController.updateContact(req, res));
router.post('/:id/notes', (req, res) => contactsController.addNote(req, res));
router.delete('/:id', (req, res) => contactsController.deleteContact(req, res));
router.post('/mark-contacted', (req, res) => contactsController.markContacted(req, res));

export default router;
