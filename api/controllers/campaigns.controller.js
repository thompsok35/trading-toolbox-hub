import { emailService, EMAIL_TEMPLATES } from '../services/email.service.js';
import { contactRepository } from '../db/repositories/contact.repository.js';

function getAppBaseUrl(req) {
  if (process.env.APP_URL) return process.env.APP_URL;
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.headers['x-forwarded-host'] || req.get('host') || 'localhost:3000';
  return `${protocol}://${host}`;
}

export class CampaignsController {
  getTemplates(req, res) {
    res.json(EMAIL_TEMPLATES);
  }

  async sendOne(req, res) {
    const { email, name, templateId, customSubject, customBody, googleMeetUrl } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Target email is required' });

    const contact = await contactRepository.findByEmail(email);
    if (contact && contact.is_unsubscribed) {
      return res.status(400).json({ success: false, error: 'Cannot send promotional email: User has unsubscribed.' });
    }

    const baseUrl = getAppBaseUrl(req);
    const result = await emailService.sendDirectCrmEmail({
      toEmail: email,
      name: name || contact?.name || '',
      templateId,
      customSubject,
      customBody,
      googleMeetUrl,
      unsubscribeToken: contact?.unsubscribe_token,
      appBaseUrl: baseUrl
    });

    if (result.success) {
      await contactRepository.recordPromotionalContact(email);
      if (contact) {
        const templateName = EMAIL_TEMPLATES.find(t => t.id === templateId)?.name || 'Custom Email';
        await contactRepository.appendNote(contact.id, `Sent Email: "${templateName}" with Google Meet link.`);
      }
      res.json({ success: true, message: `Email dispatched to ${email}` });
    } else {
      res.status(500).json({ success: false, error: result.error || 'Failed to dispatch email' });
    }
  }

  async broadcast(req, res) {
    const { templateId, customSubject, customBody, googleMeetUrl, filterStatus, filterTool } = req.body;
    const baseUrl = getAppBaseUrl(req);

    let recipients = await contactRepository.getSubscribedContacts();

    if (filterStatus && filterStatus !== 'all') {
      recipients = recipients.filter(c => c.status === filterStatus);
    }
    if (filterTool && filterTool !== 'all') {
      recipients = recipients.filter(c => Array.isArray(c.preferences) && c.preferences.includes(filterTool));
    }

    if (recipients.length === 0) {
      return res.status(400).json({ success: false, error: 'No active subscribers match selected criteria.' });
    }

    let sent = 0;
    let failed = 0;

    for (const recipient of recipients) {
      const result = await emailService.sendDirectCrmEmail({
        toEmail: recipient.email,
        name: recipient.name || '',
        templateId,
        customSubject,
        customBody,
        googleMeetUrl,
        unsubscribeToken: recipient.unsubscribe_token,
        appBaseUrl: baseUrl
      });

      if (result.success) {
        sent++;
        await contactRepository.recordPromotionalContact(recipient.email);
      } else {
        failed++;
      }
    }

    res.json({ success: true, sent, failed, total: recipients.length });
  }
}

export const campaignsController = new CampaignsController();
