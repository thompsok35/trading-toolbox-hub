import { contactRepository } from '../db/repositories/contact.repository.js';

export class ContactsController {
  async getContacts(req, res) {
    const contacts = await contactRepository.getAllContacts();
    res.json(contacts);
  }

  async createContact(req, res) {
    const { name, email, status, source, preferences, note } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email is required' });

    const initialNotes = note ? [{ id: Date.now().toString(), date: new Date().toISOString(), text: note }] : [];
    const contact = await contactRepository.createOrUpdateManual({
      name,
      email,
      status,
      source,
      preferences,
      notes: initialNotes
    });

    res.json({ success: true, contact });
  }

  async updateContact(req, res) {
    const { id } = req.params;
    const contact = await contactRepository.updateContact(id, req.body);
    if (!contact) return res.status(404).json({ success: false, error: 'Contact not found' });

    res.json({ success: true, contact });
  }

  async addNote(req, res) {
    const { id } = req.params;
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, error: 'Note text is required' });

    const contact = await contactRepository.appendNote(id, text);
    if (!contact) return res.status(404).json({ success: false, error: 'Contact not found' });

    res.json({ success: true, contact });
  }

  async markContacted(req, res) {
    const { email } = req.body;
    await contactRepository.recordPromotionalContact(email);
    res.json({ success: true });
  }
}

export const contactsController = new ContactsController();
