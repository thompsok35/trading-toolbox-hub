import { config } from '../config/env.js';

export const EMAIL_TEMPLATES = [
  {
    id: 'welcome_introduction',
    name: 'Welcome & Introduction (Discovery & Strategy)',
    category: 'Onboarding & Discovery',
    subject: 'Welcome to MyTradingToolbox — quick hello from Keith',
    description: 'Friendly intro asking how they found you, what strategies they trade, specific questions to answer by email, and offering an optional live Google Meet.',
    defaultMeetUrl: config.defaultMeetUrl,
    body: `
      <p>Hi {{name}},</p>
      <p>I'm Keith Thompson, the creator behind <strong>MyTradingToolbox</strong>. I wanted to personally reach out, say hello, and welcome you to our trading community!</p>
      
      <p>We engineered these tools specifically for active income and options traders who want clearer data, automated cash flow forecasting, and disciplined risk management.</p>

      <div style="background-color: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #334155; margin: 24px 0;">
        <h3 style="color: #38bdf8; margin-top: 0; margin-bottom: 12px; font-size: 15px;">I'd love to learn a little about you and your level of interest in options trading:</h3>
        <ol style="color: #cbd5e1; line-height: 1.7; padding-left: 20px; font-size: 14px; margin-bottom: 0;">
          <li><strong>How did you find MyTradingToolbox?</strong> (A friend/referral, trader community, social media, or search?)</li>
          <li><strong>What strategies are you currently running?</strong> (Covered calls, cash-secured puts, spreads, dividend growth, etc.)</li>
          <li><strong>Do you have any specific questions about our tools</strong> that I can answer for you with a quick reply?</li>
        </ol>
      </div>

      <p>You can simply <strong>hit Reply to this email</strong> and let me know—I read and respond to every email personally.</p>

      <div style="background-color: #0f172a; padding: 18px 20px; border-radius: 12px; border: 1px dashed #334155; margin: 24px 0; text-align: center;">
        <p style="color: #94a3b8; font-size: 13px; margin: 0 0 12px 0;">Prefer to chat live? I'd be happy to hop on a quick 10-15 minute Google Meet video call:</p>
        <a href="{{meet_url}}" style="background: linear-gradient(135deg, #0284c7, #2563eb); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 14px; box-shadow: 0 4px 12px rgba(2,132,199,0.3);">
          Book / Join Quick Google Meet &rarr;
        </a>
      </div>

      <p style="margin-bottom: 0;">Excited to have you with us,<br/><strong>Keith Thompson</strong><br/><span style="color: #64748b; font-size: 13px;">Founder, MyTradingToolbox</span></p>
    `
  },
  {
    id: 'google_meet_demo',
    name: 'Google Meet 1-on-1 Demo Walkthrough',
    category: 'Sales & Onboarding',
    subject: 'Personal Invitation: 1-on-1 Walkthrough of MyTradingToolbox Suite',
    description: 'Invite high-intent traders to an exclusive 1-on-1 Google Meet video call walkthrough of Opus, CashMap, and Alerting Engine.',
    defaultMeetUrl: config.defaultMeetUrl,
    body: `
      <p>Hi {{name}},</p>
      <p>Thanks for your interest in <strong>MyTradingToolbox</strong>! We are currently onboarding a select group of options and income traders to showcase our end-to-end execution and analytics suite.</p>
      
      <div style="background-color: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #334155; margin: 24px 0;">
        <h3 style="color: #38bdf8; margin-top: 0; margin-bottom: 12px; font-size: 16px;">What We Will Cover in Your 15-Minute Google Meet Demo:</h3>
        <ul style="color: #cbd5e1; line-height: 1.7; padding-left: 20px; font-size: 14px; margin-bottom: 0;">
          <li><strong>Opus Options Engine:</strong> Live analysis for covered calls, cash-secured puts, and multi-leg spreads with real-time Tradier connectivity.</li>
          <li><strong>CashMap Planner:</strong> Automated cash flow forecasting combining option premium & dividend schedules.</li>
          <li><strong>Real-Time Alert Engine:</strong> Strike breaches and implied expected move telemetry via SMS/email.</li>
          <li><strong>AI Options Coach:</strong> Tailored position sizing and strategy adjustments.</li>
        </ul>
      </div>

      <p>Would you have 15 minutes this week for a live walkthrough and to get direct access?</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{meet_url}}" style="background: linear-gradient(135deg, #0284c7, #2563eb); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; font-size: 15px; box-shadow: 0 4px 14px rgba(2,132,199,0.3);">
          Join / Schedule Google Meet Demo &rarr;
        </a>
      </div>

      <p style="color: #94a3b8; font-size: 14px;">If you prefer another time, feel free to reply directly to this email with what days work best for you.</p>
    `
  },
  {
    id: 'feature_announcement',
    name: 'New Feature Drop & Tool Showcase',
    category: 'Product Updates',
    subject: 'New Tools Released: AI Options Coach, Stock Health & CashMap Integration',
    description: 'Keep your users and leads engaged by showcasing new suite capabilities and improvements.',
    defaultMeetUrl: config.defaultMeetUrl,
    body: `
      <p>Hi {{name}},</p>
      <p>We've rolled out major upgrades across the <strong>MyTradingToolbox</strong> ecosystem designed to give income traders a decisive edge in volatile markets.</p>

      <div style="background-color: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #334155; margin: 20px 0;">
        <h3 style="color: #2dd4bf; margin-top: 0; font-size: 16px;">Key Suite Highlights:</h3>
        <div style="margin-bottom: 14px;">
          <h4 style="color: #38bdf8; margin: 0 0 4px 0; font-size: 14px;">1. Opus AI Options Coach</h4>
          <p style="color: #cbd5e1; font-size: 13px; margin: 0; line-height: 1.5;">Curated options strategy knowledge agent to assist in structuring covered calls, credit spreads, and risk mitigations.</p>
        </div>
        <div style="margin-bottom: 14px;">
          <h4 style="color: #38bdf8; margin: 0 0 4px 0; font-size: 14px;">2. Stock Health Analysis & Daily Ingestion</h4>
          <p style="color: #cbd5e1; font-size: 13px; margin: 0; line-height: 1.5;">Evaluates all publicly traded equities against S&P 500 benchmarks, sector peers, and DCF intrinsic valuations.</p>
        </div>
        <div>
          <h4 style="color: #38bdf8; margin: 0 0 4px 0; font-size: 14px;">3. Direct CashMap & Alerts Synchronization</h4>
          <p style="color: #cbd5e1; font-size: 13px; margin: 0; line-height: 1.5;">Seamlessly track realized options premium alongside automated SMS price and strike alerts.</p>
        </div>
      </div>

      <div style="text-align: center; margin: 28px 0;">
        <a href="https://opus.mytradingtoolbox.com" style="background-color: #0284c7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 14px; margin-right: 12px;">
          Explore Opus Platform
        </a>
        <a href="{{meet_url}}" style="background-color: #334155; color: #f8fafc; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 14px;">
          Book Live Video Demo
        </a>
      </div>
    `
  },
  {
    id: 'founder_outreach',
    name: 'Personal Founder Check-In & Strategy Call',
    category: 'Founder Outreach',
    subject: 'Quick question regarding your trading workflow',
    description: 'Personal, high-response rate email from the founder offering 1-on-1 strategy support and demo setup.',
    defaultMeetUrl: config.defaultMeetUrl,
    body: `
      <p>Hi {{name}},</p>
      <p>I noticed your interest in the MyTradingToolbox suite. I am the lead builder behind the platform, and I wanted to personally reach out.</p>
      <p>Whether you're selling covered calls for monthly income, running cash-secured puts, or looking for cleaner risk telemetry, we engineered these tools specifically for active income traders.</p>
      <p>I'd love to jump on a quick 10-minute Google Meet call to learn about your current setup, answer any questions, and give you early access.</p>
      
      <div style="text-align: center; margin: 25px 0;">
        <a href="{{meet_url}}" style="background: linear-gradient(135deg, #0284c7, #2563eb); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 14px;">
          Click Here to Meet on Google Meet &rarr;
        </a>
      </div>

      <p>Looking forward to connecting!</p>
      <p style="margin-bottom: 0;">Best regards,<br/><strong>Keith Thompson</strong><br/><span style="color: #64748b; font-size: 13px;">Founder, MyTradingToolbox</span></p>
    `
  },
  {
    id: 'beta_access',
    name: 'VIP Beta Access & Revenue Pitch',
    category: 'Conversion & Sales',
    subject: 'Your VIP Early Access to the MyTradingToolbox Suite',
    description: 'High-converting invitation offering grandfathered access and private onboarding.',
    defaultMeetUrl: config.defaultMeetUrl,
    body: `
      <p>Hi {{name}},</p>
      <p>Your spot for early access to <strong>MyTradingToolbox</strong> is ready! As an early member, you will receive full access to our complete suite of trading engines:</p>
      <ul style="color: #cbd5e1; line-height: 1.6; padding-left: 20px; font-size: 14px;">
        <li>Full Opus Options Suite with Tradier one-click execution</li>
        <li>CashMap Income Forecaster</li>
        <li>Real-Time SMS Alert Engine & Volatility Insights</li>
        <li>AI Options Strategy Coach</li>
      </ul>
      <p>We are hosting onboarding sessions this week on Google Meet to get your custom watchlists and strategies configured.</p>
      
      <div style="text-align: center; margin: 28px 0;">
        <a href="{{meet_url}}" style="background: linear-gradient(135deg, #10b981, #059669); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; font-size: 15px;">
          Claim VIP Access & Schedule Onboarding &rarr;
        </a>
      </div>
    `
  }
];

export class EmailService {
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
      console.warn('[Email] RESEND_API_KEY is missing. Email simulated.');
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
    const template = EMAIL_TEMPLATES.find(t => t.id === templateId) || EMAIL_TEMPLATES[0];
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
