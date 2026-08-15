import { config } from '../config/env.js';
import { query, DEFAULT_TEMPLATES } from '../db/connection.js';

export class EmailService {
  async getAllTemplates() {
    try {
      const res = await query('SELECT * FROM email_templates ORDER BY is_system DESC, name ASC');
      if (res.rows && res.rows.length > 0) {
        return res.rows;
      }
    } catch (err) {
      console.warn('[EmailService] Error loading templates from DB:', err.message);
    }
    return DEFAULT_TEMPLATES;
  }

  async getTemplateById(id) {
    const templates = await this.getAllTemplates();
    return templates.find(t => t.id === id) || templates[0];
  }

  async saveTemplate(id, { name, category, subject, description, body, defaultMeetUrl }) {
    const queryString = `
      INSERT INTO email_templates (id, name, category, subject, description, body, default_meet_url, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
      ON CONFLICT (id) 
      DO UPDATE SET 
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        subject = EXCLUDED.subject,
        description = EXCLUDED.description,
        body = EXCLUDED.body,
        default_meet_url = EXCLUDED.default_meet_url,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const res = await query(queryString, [
      id, 
      name, 
      category || 'General', 
      subject, 
      description || '', 
      body, 
      defaultMeetUrl || config.defaultMeetUrl
    ]);
    return res.rows[0];
  }

  async createCustomTemplate({ name, category, subject, description, body, defaultMeetUrl }) {
    const id = 'custom_' + Date.now();
    const queryString = `
      INSERT INTO email_templates (id, name, category, subject, description, body, default_meet_url, is_system)
      VALUES ($1, $2, $3, $4, $5, $6, $7, false)
      RETURNING *;
    `;
    const res = await query(queryString, [
      id, 
      name, 
      category || 'Custom Campaign', 
      subject, 
      description || '', 
      body, 
      defaultMeetUrl || config.defaultMeetUrl
    ]);
    return res.rows[0];
  }

  async resetTemplateToDefault(id) {
    const def = DEFAULT_TEMPLATES.find(t => t.id === id);
    if (!def) return null;

    return this.saveTemplate(id, {
      name: def.name,
      category: def.category,
      subject: def.subject,
      description: def.description,
      body: def.body,
      defaultMeetUrl: def.default_meet_url
    });
  }

  async deleteTemplate(id) {
    await query('DELETE FROM email_templates WHERE id = $1 AND is_system = false', [id]);
    return { success: true };
  }

  buildFullHtml({ content, unsubscribeUrl, recipientEmail }) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #02040c; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #02040c; padding: 30px 10px;">
          <tr>
            <td align="center">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0f172a; border-radius: 16px; border: 1px solid #1e293b; overflow: hidden;">
                <tr>
                  <td style="padding: 24px 28px; border-bottom: 1px solid #1e293b; background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="left">
                          <span style="font-size: 20px; font-weight: 900; color: #38bdf8; letter-spacing: -0.5px;">MyTradingToolbox</span>
                          <span style="display: block; font-size: 12px; color: #94a3b8; margin-top: 2px;">Professional Suite for Income & Options Traders</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px 28px; font-size: 15px; line-height: 1.6; color: #e2e8f0;">
                    ${content}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 24px 28px; background-color: #090d16; border-top: 1px solid #1e293b; text-align: center; font-size: 12px; color: #64748b;">
                    <p style="margin: 0 0 8px 0;">This email was sent to <strong style="color: #94a3b8;">${recipientEmail || 'you'}</strong> because you requested early access or signed up on MyTradingToolbox.</p>
                    <p style="margin: 0 0 12px 0;">MyTradingToolbox &bull; Income Trading Tools &bull; Financial Suite</p>
                    <p style="margin: 0;">
                      <a href="${unsubscribeUrl}" style="color: #38bdf8; text-decoration: underline; font-weight: 500;">
                        Unsubscribe / Manage Email Preferences
                      </a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }

  renderTemplate(templateHtml, variables) {
    let rendered = templateHtml;
    const name = variables.name || (variables.email ? variables.email.split('@')[0] : 'Trader');
    rendered = rendered.replace(/\{\{name\}\}/g, name);
    rendered = rendered.replace(/\{\{email\}\}/g, variables.email || '');
    rendered = rendered.replace(/\{\{meet_url\}\}/g, variables.meetUrl || config.defaultMeetUrl);
    rendered = rendered.replace(/\{\{unsubscribe_url\}\}/g, variables.unsubscribeUrl || '#');
    return rendered;
  }

  async sendRawEmail({ to, fromAlias = config.welcomeSender, subject, htmlBody }) {
    if (!config.resendApiKey) {
      console.warn('[Email] RESEND_API_KEY is missing. Email simulated in mock mode.');
      return { success: true, simulated: true, id: `mock-${Date.now()}` };
    }

    try {
      const payload = {
        from: `MyTradingToolbox <${fromAlias}>`,
        to: Array.isArray(to) ? to : [to],
        subject: subject,
        html: htmlBody
      };

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, id: data.id };
      } else {
        const errorText = await response.text();
        console.error('[Email] Resend Error:', errorText);
        return { success: false, error: errorText };
      }
    } catch (err) {
      console.error('[Email] Dispatch Exception:', err);
      return { success: false, error: err.message };
    }
  }

  async sendDirectCrmEmail({ toEmail, name = '', templateId = 'welcome_introduction', customSubject = '', customBody = '', googleMeetUrl, unsubscribeToken = '', appBaseUrl = config.defaultAppUrl }) {
    const template = await this.getTemplateById(templateId);
    const subject = customSubject || template.subject;
    const rawBody = customBody || template.body;

    const unsubscribeUrl = `${appBaseUrl.replace(/\/$/, '')}/unsubscribe?token=${encodeURIComponent(unsubscribeToken || toEmail)}`;

    const rendered = this.renderTemplate(rawBody, {
      name,
      email: toEmail,
      meetUrl: googleMeetUrl || config.defaultMeetUrl,
      unsubscribeUrl
    });

    const fullHtml = this.buildFullHtml({
      content: rendered,
      unsubscribeUrl,
      recipientEmail: toEmail
    });

    return this.sendRawEmail({
      to: toEmail,
      subject,
      htmlBody: fullHtml
    });
  }

  async sendAdminNewLeadAlert(leadEmail, preferences = []) {
    const prefStr = Array.isArray(preferences) && preferences.length > 0 ? preferences.join(', ') : 'General Interest';
    const timestampStr = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    const subject = `[New Lead Alert] ${leadEmail}`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #0f172a; color: #f8fafc; border-radius: 16px; border: 1px solid #1e293b;">
        <h2 style="color: #38bdf8; margin-top: 0;">🚀 New Hub Lead Submission</h2>
        <div style="background-color: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #334155; margin: 20px 0;">
          <p style="margin: 6px 0; color: #94a3b8; font-size: 14px;"><strong>Lead Email:</strong> <span style="color: #ffffff; font-weight: bold;">${leadEmail}</span></p>
          <p style="margin: 6px 0; color: #94a3b8; font-size: 14px;"><strong>Tool Preferences:</strong> <span style="color: #2dd4bf;">${prefStr}</span></p>
          <p style="margin: 6px 0; color: #94a3b8; font-size: 14px;"><strong>Submitted At:</strong> <span style="color: #cbd5e1;">${timestampStr}</span></p>
        </div>
      </div>
    `;

    return this.sendRawEmail({
      to: config.adminEmail,
      subject,
      htmlBody
    });
  }

  async sendWelcomeEmail(userEmail, unsubscribeToken = '', appBaseUrl = config.defaultAppUrl) {
    const subject = 'Welcome to MyTradingToolbox Suite';
    const unsubscribeUrl = `${appBaseUrl.replace(/\/$/, '')}/unsubscribe?token=${encodeURIComponent(unsubscribeToken || userEmail)}`;

    const body = `
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #38bdf8; margin: 0; font-size: 26px;">Welcome to MyTradingToolbox</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 6px;">Your professional trading suite gateway.</p>
      </div>
      <div style="background-color: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #334155; margin-bottom: 20px;">
        <h3 style="color: #2dd4bf; margin-top: 0;">Explore Our Trading Tools:</h3>
        <ul style="color: #cbd5e1; line-height: 1.6; padding-left: 20px; font-size: 14px;">
          <li><strong>Opus Options Suite:</strong> Multi-leg options execution, RAG AI coaching & Tradier integration.</li>
          <li><strong>Alerts Engine:</strong> Real-time price level, strike breach, and risk telemetry alerts.</li>
          <li><strong>Stock Data Services:</strong> Intrinsic DCF valuations, FinViz metrics, and yield scanners.</li>
          <li><strong>CashMap Planner:</strong> Cash flow planning synchronized with option premium income.</li>
        </ul>
      </div>
      <div style="text-align: center; margin: 28px 0;">
        <a href="https://opus.mytradingtoolbox.com" style="background-color: #0284c7; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 9999px; font-weight: bold; display: inline-block; font-size: 15px;">
          Launch Opus Platform &rarr;
        </a>
      </div>
    `;

    const fullHtml = this.buildFullHtml({
      content: body,
      unsubscribeUrl,
      recipientEmail: userEmail
    });

    return this.sendRawEmail({
      to: userEmail,
      subject,
      htmlBody: fullHtml
    });
  }
}

export const emailService = new EmailService();
export const EMAIL_TEMPLATES = DEFAULT_TEMPLATES;
