/**
 * Email notification utility for MyTradingToolbox-Hub using Resend HTTP API Gateway.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'keith.thompson@mytradingtoolbox.com';
const WELCOME_EMAIL_SENDER = process.env.WELCOME_EMAIL_SENDER || 'hello@mytradingtoolbox.com';

async function sendEmailInternal({ to, fromAlias, subject, htmlBody }) {
  const apiKey = RESEND_API_KEY || process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn('[Email] RESEND_API_KEY environment variable is missing. Email dispatch skipped.');
    return false;
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
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`[Email] Sent email successfully to ${to} (ID: ${data.id})`);
      return true;
    } else {
      const errorText = await response.text();
      console.error(`[Email] Resend API error (${response.status}): ${errorText}`);
      return false;
    }
  } catch (error) {
    console.error('[Email] Failed to send email via Resend API:', error);
    return false;
  }
}

/**
 * Send Admin Notification email when a new lead or user submits on Hub
 */
export async function sendAdminNewLeadAlert(leadEmail, preferences = []) {
  const prefStr = Array.isArray(preferences) && preferences.length > 0 
    ? preferences.join(', ') 
    : 'General Suite Interest';
  const timestampStr = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

  const subject = `[New Hub Lead Alert] ${leadEmail}`;
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #0f172a; color: #f8fafc; border-radius: 16px; border: 1px solid #1e293b;">
      <h2 style="color: #38bdf8; margin-top: 0;">🚀 New Hub Lead Submission</h2>
      <div style="background-color: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #334155; margin: 20px 0;">
        <p style="margin: 6px 0; color: #94a3b8; font-size: 14px;"><strong>Lead Email:</strong> <span style="color: #ffffff; font-weight: bold;">${leadEmail}</span></p>
        <p style="margin: 6px 0; color: #94a3b8; font-size: 14px;"><strong>Tool Preferences:</strong> <span style="color: #2dd4bf;">${prefStr}</span></p>
        <p style="margin: 6px 0; color: #94a3b8; font-size: 14px;"><strong>Submitted At:</strong> <span style="color: #cbd5e1;">${timestampStr}</span></p>
      </div>
      <p style="color: #64748b; font-size: 12px;">Automated notification from MyTradingToolbox-Hub Architecture.</p>
    </div>
  `;

  return sendEmailInternal({
    to: ADMIN_EMAIL,
    fromAlias: WELCOME_EMAIL_SENDER,
    subject: subject,
    htmlBody: htmlBody
  });
}

/**
 * Send Welcome Email to a newly registered lead on Hub
 */
export async function sendWelcomeEmail(userEmail) {
  const subject = 'Welcome to MyTradingToolbox Suite';
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #0f172a; color: #f8fafc; border-radius: 16px; border: 1px solid #1e293b;">
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
        </ul>
      </div>
      <div style="text-align: center; margin: 28px 0;">
        <a href="https://opus.mytradingtoolbox.com" style="background-color: #0284c7; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 9999px; font-weight: bold; display: inline-block; font-size: 15px;">
          Launch Opus Platform &rarr;
        </a>
      </div>
      <p style="color: #64748b; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} MyTradingToolbox. All rights reserved.</p>
    </div>
  `;

  return sendEmailInternal({
    to: userEmail,
    fromAlias: WELCOME_EMAIL_SENDER,
    subject: subject,
    htmlBody: htmlBody
  });
}
