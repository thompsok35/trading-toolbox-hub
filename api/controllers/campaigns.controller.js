import { emailService } from '../services/email.service.js';
import { contactRepository } from '../db/repositories/contact.repository.js';
import { config } from '../config/env.js';

function getAppBaseUrl(req) {
  if (process.env.APP_URL) return process.env.APP_URL;
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.headers['x-forwarded-host'] || req.get('host') || 'localhost:3000';
  return `${protocol}://${host}`;
}

export class CampaignsController {
    async getTemplates(req, res) {
    const templates = await emailService.getAllTemplates();
    // Return templates with active server default meet URL
    const mapped = templates.map(t => ({
      ...t,
      default_meet_url: (t.default_meet_url && t.default_meet_url !== 'https://meet.google.com/new') 
        ? t.default_meet_url 
        : config.defaultMeetUrl
    }));
    res.json(mapped);
  }

  async getConfig(req, res) {
    res.json({
      defaultMeetUrl: config.defaultMeetUrl,
      adminEmail: config.adminEmail,
      welcomeSender: config.welcomeSender
    });
  }

  async updateTemplate(req, res) {
    const { id } = req.params;
    const template = await emailService.saveTemplate(id, req.body);
    res.json({ success: true, template });
  }

  async createTemplate(req, res) {
    const template = await emailService.createCustomTemplate(req.body);
    res.json({ success: true, template });
  }

  async resetTemplate(req, res) {
    const { id } = req.params;
    const template = await emailService.resetTemplateToDefault(id);
    if (!template) return res.status(404).json({ success: false, error: 'Default template not found' });
    res.json({ success: true, template });
  }

  async deleteTemplate(req, res) {
    const { id } = req.params;
    await emailService.deleteTemplate(id);
    res.json({ success: true });
  }

  async testSend(req, res) {
    const { templateId, customSubject, customBody, targetEmail, googleMeetUrl } = req.body;
    const recipient = targetEmail || config.adminEmail;
    const baseUrl = getAppBaseUrl(req);

    const result = await emailService.sendDirectCrmEmail({
      toEmail: recipient,
      name: 'Admin Test',
      templateId,
      customSubject: customSubject ? `[TEST] ${customSubject}` : undefined,
      customBody,
      googleMeetUrl,
      appBaseUrl: baseUrl
    });

    if (result.success) {
      res.json({ success: true, message: `Test email dispatched to ${recipient}` });
    } else {
      res.status(500).json({ success: false, error: result.error || 'Failed to dispatch test email' });
    }
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
        const tpl = await emailService.getTemplateById(templateId);
        const templateName = tpl?.name || 'Custom Email';
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
