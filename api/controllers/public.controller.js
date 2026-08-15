import { contactRepository } from '../db/repositories/contact.repository.js';
import { emailService } from '../services/email.service.js';

function getAppBaseUrl(req) {
  if (process.env.APP_URL) return process.env.APP_URL;
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.headers['x-forwarded-host'] || req.get('host') || 'localhost:3000';
  return `${protocol}://${host}`;
}

export class PublicController {
  async captureLead(req, res) {
    const { email, preferences } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email is required' });

    const baseUrl = getAppBaseUrl(req);
    const lead = await contactRepository.upsertPublicLead(email, preferences || []);

    // Dispatch background alerts
    Promise.all([
      emailService.sendAdminNewLeadAlert(email, preferences),
      emailService.sendWelcomeEmail(email, lead.unsubscribe_token, baseUrl)
    ]).catch(err => console.error('[Public API] Async notification error:', err));

    res.json(lead);
  }

  async heartbeat(req, res) {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email is required' });

    const lead = await contactRepository.heartbeat(email);
    res.json({ success: true, lead });
  }

  async getUnsubscribeStatus(req, res) {
    const { token, email } = req.query;
    if (!token && !email) return res.status(400).json({ success: false, error: 'Token or email is required' });

    const contact = token ? await contactRepository.findByToken(token) : await contactRepository.findByEmail(email);
    if (!contact) return res.status(404).json({ success: false, error: 'Subscriber record not found' });

    res.json({
      email: contact.email,
      is_unsubscribed: contact.is_unsubscribed,
      unsubscribed_at: contact.unsubscribed_at
    });
  }

  async unsubscribe(req, res) {
    const { token, email } = req.body;
    const identifier = token || email;
    if (!identifier) return res.status(400).json({ success: false, error: 'Token or email is required' });

    const contact = await contactRepository.unsubscribe(identifier);
    if (!contact) return res.status(404).json({ success: false, error: 'Record not found' });

    res.json({ success: true, message: 'Successfully unsubscribed', contact });
  }

  async resubscribe(req, res) {
    const { token, email } = req.body;
    const identifier = token || email;
    if (!identifier) return res.status(400).json({ success: false, error: 'Token or email is required' });

    const contact = await contactRepository.resubscribe(identifier);
    res.json({ success: true, message: 'Successfully resubscribed', contact });
  }
}

export const publicController = new PublicController();
