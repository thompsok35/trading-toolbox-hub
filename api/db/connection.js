import pg from 'pg';
import crypto from 'crypto';
import { config } from '../config/env.js';

const { Pool } = pg;

function getPoolConfig() {
  const url = config.databaseUrl || '';
  if (!url) return null;

  // Railway internal private network or localhost do NOT use SSL
  const isInternal = url.includes('.railway.internal') || 
                     url.includes('localhost') || 
                     url.includes('127.0.0.1') ||
                     url.includes('sslmode=disable');

  return {
    connectionString: url,
    ssl: isInternal ? false : { rejectUnauthorized: false }
  };
}

const poolConfig = getPoolConfig();
export const pool = poolConfig ? new Pool(poolConfig) : null;

export function generateToken() {
  return crypto.randomBytes(16).toString('hex');
}

export const DEFAULT_TEMPLATES = [
  {
    id: 'itm_bot_announcement',
    name: 'Feature Release: ITM Covered Call Strategy BOT (Paper Trading Included)',
    category: 'Product Releases',
    subject: 'New Feature Release: Semi-Automated ITM Covered Call Strategy BOT (Risk-Free Paper Trading)',
    description: 'Announce the new semi-automated ITM Covered Call Strategy BOT with guided risk analysis, capital management, and risk-free paper trading.',
    default_meet_url: config.defaultMeetUrl,
    is_system: true,
    body: `<div style="margin-bottom: 24px;">
  <div style="display: inline-block; background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; padding: 4px 10px; border-radius: 6px; margin-bottom: 12px;">
    🤖 NEW FEATURE RELEASE &bull; LIVE ON PLATFORM
  </div>
  <h2 style="font-size: 22px; font-weight: 800; color: #ffffff; margin: 0 0 12px 0; line-height: 1.3;">
    Master Consistent Monthly Income with the <span style="color: #38bdf8; font-weight: 800;">ITM Covered Call Strategy BOT</span>
  </h2>
  
  <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1; margin: 0 0 16px 0;">
    Hi {{name}},
  </p>
  
  <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1; margin: 0 0 20px 0;">
    We are excited to announce our newest addition to the <strong>MyTradingToolbox</strong> ecosystem: the <strong>Semi-Automated ITM Covered Call Strategy BOT</strong>!
  </p>
  <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1; margin: 0 0 20px 0;">
    Whether you are just getting started with options or looking to generate reliable monthly cash flow from a portfolio of stocks, In-The-Money (ITM) covered calls are one of the highest-probability, most disciplined income strategies available.
  </p>
</div>

<div style="background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%); border: 1px solid #334155; border-radius: 16px; padding: 22px; margin: 24px 0; box-shadow: 0 8px 24px rgba(0,0,0,0.3);">
  <h3 style="color: #38bdf8; font-size: 15px; font-weight: 800; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 0.5px;">
    Why Traders Love The New Strategy BOT:
  </h3>

  <div style="margin-bottom: 12px; background-color: #0b1120; border: 1px solid #1e293b; border-radius: 12px; padding: 14px 16px;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="width: 32px; vertical-align: top;">
          <span style="font-size: 20px;">🛡️</span>
        </td>
        <td style="padding-left: 8px;">
          <div style="color: #ffffff; font-weight: 700; font-size: 13px;">Guided Risk Analysis & Capital Management</div>
          <div style="color: #94a3b8; font-size: 12px; margin-top: 3px; line-height: 1.5;">The BOT walks you through deep downside breakeven levels, intrinsic vs. extrinsic premium decay, and exact position sizing before you ever enter a trade.</div>
        </td>
      </tr>
    </table>
  </div>

  <div style="margin-bottom: 12px; background-color: #0b1120; border: 1px solid #1e293b; border-radius: 12px; padding: 14px 16px;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="width: 32px; vertical-align: top;">
          <span style="font-size: 20px;">📝</span>
        </td>
        <td style="padding-left: 8px;">
          <div style="color: #34d399; font-weight: 700; font-size: 13px;">100% Risk-Free 'Paper' Trading Mode</div>
          <div style="color: #94a3b8; font-size: 12px; margin-top: 3px; line-height: 1.5;">Practice and simulate live trades for as long as you need with zero risk. Build total confidence and mastery of assignment cycles, rolling mechanics, and profit targets.</div>
        </td>
      </tr>
    </table>
  </div>

  <div style="background-color: #0b1120; border: 1px solid #1e293b; border-radius: 12px; padding: 14px 16px;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="width: 32px; vertical-align: top;">
          <span style="font-size: 20px;">⚡</span>
        </td>
        <td style="padding-left: 8px;">
          <div style="color: #818cf8; font-weight: 700; font-size: 13px;">Semi-Automated Execution & Trade Plans</div>
          <div style="color: #94a3b8; font-size: 12px; margin-top: 3px; line-height: 1.5;">Get clear strike recommendations and automated trade plans synchronized directly into CashMap Planner and our Real-Time Alerts engine.</div>
        </td>
      </tr>
    </table>
  </div>
</div>

<div style="background: linear-gradient(135deg, rgba(2,132,199,0.15) 0%, rgba(99,102,241,0.15) 100%); border: 1px solid rgba(56,189,248,0.3); border-radius: 16px; padding: 24px; text-align: center; margin: 28px 0;">
  <h4 style="color: #ffffff; font-size: 16px; font-weight: 800; margin: 0 0 6px 0;">
    Ready to Explore the ITM Covered Call BOT?
  </h4>
  <p style="color: #94a3b8; font-size: 13px; margin: 0 0 18px 0; line-height: 1.5;">
    Log into the platform to start paper trading, or schedule a 15-minute 1-on-1 walkthrough with Keith:
  </p>

  <div style="margin-bottom: 12px;">
    <a href="https://opus.mytradingtoolbox.com" style="background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-weight: 800; display: inline-block; font-size: 14px; margin-right: 8px; box-shadow: 0 4px 14px rgba(2,132,199,0.35);">
      🚀 Launch Opus & Try the BOT &rarr;
    </a>
    <a href="{{meet_url}}" style="background-color: #1e293b; color: #ffffff; border: 1px solid #334155; padding: 12px 22px; text-decoration: none; border-radius: 10px; font-weight: 700; display: inline-block; font-size: 14px;">
      📅 Book 15-Min Live Demo
    </a>
  </div>

  <div style="margin-top: 14px; font-size: 12px; color: #38bdf8; font-weight: 600;">
    💬 Have questions about how ITM covered calls work? Simply reply to this email!
  </div>
</div>

<p style="margin: 0; color: #cbd5e1; font-size: 14px; line-height: 1.6;">
  Happy Trading,<br/>
  <strong style="color: #ffffff; font-size: 15px;">Keith Thompson</strong><br/>
  <span style="color: #64748b; font-size: 12px;">Founder & Developer &bull; MyTradingToolbox</span>
</p>`
  },
  {
    id: 'welcome_introduction',
    name: 'Welcome & Introduction (Discovery & Strategy)',
    category: 'Onboarding & Discovery',
    subject: 'Welcome to MyTradingToolbox — quick hello from Keith',
    description: 'Friendly intro asking how they found you, what strategies they trade, specific questions to answer by email, and offering an optional live Google Meet.',
    default_meet_url: config.defaultMeetUrl,
    is_system: true,
    body: `
<div style="margin-bottom: 24px;">
  <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
    <tr>
      <td style="width: 48px; height: 48px; background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%); border-radius: 12px; text-align: center; vertical-align: middle; color: #ffffff; font-weight: 900; font-size: 18px; box-shadow: 0 4px 14px rgba(2,132,199,0.4); border: 1px solid rgba(255,255,255,0.15);">
        KT
      </td>
      <td style="padding-left: 14px; vertical-align: middle;">
        <span style="font-size: 16px; font-weight: 800; color: #ffffff; display: block; letter-spacing: -0.2px;">Keith Thompson</span>
        <span style="font-size: 12px; color: #38bdf8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Founder &bull; MyTradingToolbox</span>
      </td>
    </tr>
  </table>

  <h2 style="font-size: 22px; font-weight: 800; color: #ffffff; margin: 0 0 12px 0; line-height: 1.3; letter-spacing: -0.4px;">
    Welcome to <span style="color: #38bdf8; font-weight: 800;">MyTradingToolbox</span>!
  </h2>
  
  <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1; margin: 0 0 16px 0;">
    Hi {{name}},
  </p>
  
  <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1; margin: 0 0 20px 0;">
    I wanted to personally welcome you to our trading community. We engineered these tools specifically for active income & options traders who want clearer trade setups, real-time risk telemetry, and automated cash flow forecasting.
  </p>
</div>

<!-- 3 Elevated Question Cards -->
<div style="background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%); border: 1px solid #334155; border-radius: 16px; padding: 22px; margin: 24px 0; box-shadow: 0 8px 24px rgba(0,0,0,0.3);">
  <div style="margin-bottom: 16px;">
    <span style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; padding: 4px 10px; rounded-radius: 6px; border-radius: 6px; display: inline-block;">
      Quick 30-Second Discovery
    </span>
    <h3 style="color: #f8fafc; font-size: 16px; font-weight: 700; margin: 10px 0 4px 0;">
      I'd love to learn a little about you and your level of interest in options trading:
    </h3>
  </div>

  <!-- Question 1 -->
  <div style="background-color: #0b1120; border: 1px solid #1e293b; border-radius: 12px; padding: 14px 16px; margin-bottom: 10px;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="width: 28px; vertical-align: top;">
          <span style="background: linear-gradient(135deg, #0284c7, #38bdf8); color: #ffffff; font-size: 11px; font-weight: 900; width: 22px; height: 22px; line-height: 22px; text-align: center; border-radius: 6px; display: inline-block;">1</span>
        </td>
        <td style="padding-left: 10px; vertical-align: middle;">
          <div style="color: #ffffff; font-weight: 700; font-size: 13px;">How did you find MyTradingToolbox?</div>
          <div style="color: #94a3b8; font-size: 12px; margin-top: 2px;">Friend / Referral &bull; Twitter/X &bull; Discord &bull; YouTube &bull; Search</div>
        </td>
      </tr>
    </table>
  </div>

  <!-- Question 2 -->
  <div style="background-color: #0b1120; border: 1px solid #1e293b; border-radius: 12px; padding: 14px 16px; margin-bottom: 10px;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="width: 28px; vertical-align: top;">
          <span style="background: linear-gradient(135deg, #6366f1, #818cf8); color: #ffffff; font-size: 11px; font-weight: 900; width: 22px; height: 22px; line-height: 22px; text-align: center; border-radius: 6px; display: inline-block;">2</span>
        </td>
        <td style="padding-left: 10px; vertical-align: middle;">
          <div style="color: #ffffff; font-weight: 700; font-size: 13px;">What strategies are you currently running?</div>
          <div style="color: #94a3b8; font-size: 12px; margin-top: 2px;">Covered Calls &bull; Cash-Secured Puts &bull; Spreads &bull; Dividend Income</div>
        </td>
      </tr>
    </table>
  </div>

  <!-- Question 3 -->
  <div style="background-color: #0b1120; border: 1px solid #1e293b; border-radius: 12px; padding: 14px 16px;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="width: 28px; vertical-align: top;">
          <span style="background: linear-gradient(135deg, #10b981, #34d399); color: #ffffff; font-size: 11px; font-weight: 900; width: 22px; height: 22px; line-height: 22px; text-align: center; border-radius: 6px; display: inline-block;">3</span>
        </td>
        <td style="padding-left: 10px; vertical-align: middle;">
          <div style="color: #ffffff; font-weight: 700; font-size: 13px;">Do you have any specific questions about our tools?</div>
          <div style="color: #94a3b8; font-size: 12px; margin-top: 2px;">Ask about live scanner setups, Tradier connection, or expected move alerts.</div>
        </td>
      </tr>
    </table>
  </div>
</div>

<!-- What's Inside Feature Grid -->
<div style="margin: 28px 0;">
  <div style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px;">
    What You Can Explore In The Suite:
  </div>
  <table cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      <td width="50%" style="padding-right: 6px; padding-bottom: 10px;" valign="top">
        <div style="background-color: #131d31; border: 1px solid #1e293b; border-radius: 10px; padding: 12px;">
          <div style="color: #38bdf8; font-weight: 700; font-size: 12px; margin-bottom: 2px;">⚡ Opus Options Engine</div>
          <div style="color: #94a3b8; font-size: 11px; line-height: 1.4;">Covered call & put scanner with real-time Tradier execution.</div>
        </div>
      </td>
      <td width="50%" style="padding-left: 6px; padding-bottom: 10px;" valign="top">
        <div style="background-color: #131d31; border: 1px solid #1e293b; border-radius: 10px; padding: 12px;">
          <div style="color: #34d399; font-weight: 700; font-size: 12px; margin-bottom: 2px;">📊 CashMap Planner</div>
          <div style="color: #94a3b8; font-size: 11px; line-height: 1.4;">Project option premium cash flow & dividend calendars.</div>
        </div>
      </td>
    </tr>
    <tr>
      <td width="50%" style="padding-right: 6px;" valign="top">
        <div style="background-color: #131d31; border: 1px solid #1e293b; border-radius: 10px; padding: 12px;">
          <div style="color: #f43f5e; font-weight: 700; font-size: 12px; margin-bottom: 2px;">🚨 Real-Time Alerts</div>
          <div style="color: #94a3b8; font-size: 11px; line-height: 1.4;">Instant SMS/email strike breaches & volatility warnings.</div>
        </div>
      </td>
      <td width="50%" style="padding-left: 6px;" valign="top">
        <div style="background-color: #131d31; border: 1px solid #1e293b; border-radius: 10px; padding: 12px;">
          <div style="color: #a78bfa; font-weight: 700; font-size: 12px; margin-bottom: 2px;">🤖 AI Options Coach</div>
          <div style="color: #94a3b8; font-size: 11px; line-height: 1.4;">Tailored position sizing & risk mitigation strategies.</div>
        </div>
      </td>
    </tr>
  </table>
</div>

<!-- Dual Call-to-Action Section -->
<div style="background: linear-gradient(135deg, rgba(2,132,199,0.15) 0%, rgba(99,102,241,0.15) 100%); border: 1px solid rgba(56,189,248,0.3); border-radius: 16px; padding: 24px; text-align: center; margin: 28px 0;">
  <h4 style="color: #ffffff; font-size: 16px; font-weight: 800; margin: 0 0 6px 0;">
    Let's Connect & Walk Through The Tools
  </h4>
  <p style="color: #94a3b8; font-size: 13px; margin: 0 0 18px 0; line-height: 1.5;">
    You can simply <strong>hit Reply</strong> to this email with your answers, or book a quick 10-15 minute live Google Meet walkthrough with me:
  </p>

  <div>
    <a href="{{meet_url}}" style="background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: 800; display: inline-block; font-size: 14px; box-shadow: 0 6px 20px rgba(2,132,199,0.4); border: 1px solid rgba(255,255,255,0.2);">
      📅 Schedule 15-Min Live Demo (Google Meet) &rarr;
    </a>
  </div>

  <div style="margin-top: 14px; font-size: 12px; color: #38bdf8; font-weight: 600;">
    💬 Or reply directly to this email — I read every response personally!
  </div>
</div>

<p style="margin: 0; color: #cbd5e1; font-size: 14px; line-height: 1.6;">
  Excited to have you with us,<br/>
  <strong style="color: #ffffff; font-size: 15px;">Keith Thompson</strong><br/>
  <span style="color: #64748b; font-size: 12px;">Founder & Developer &bull; MyTradingToolbox</span>
</p>
`
  },
  {
    id: 'google_meet_demo',
    name: 'Google Meet 1-on-1 Demo Walkthrough',
    category: 'Sales & Onboarding',
    subject: 'Personal Invitation: 1-on-1 Walkthrough of MyTradingToolbox Suite',
    description: 'Invite high-intent traders to an exclusive 1-on-1 Google Meet video call walkthrough of Opus, CashMap, and Alerting Engine.',
    default_meet_url: config.defaultMeetUrl,
    is_system: true,
    body: `
<div style="margin-bottom: 24px;">
  <div style="display: inline-block; background: rgba(99, 102, 241, 0.15); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.3); font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; padding: 4px 10px; border-radius: 6px; margin-bottom: 12px;">
    📹 VIP 1-on-1 Walkthrough
  </div>
  <h2 style="font-size: 22px; font-weight: 800; color: #ffffff; margin: 0 0 12px 0; line-height: 1.3;">
    Personal Demo of <span style="color: #38bdf8; font-weight: 800;">MyTradingToolbox Suite</span>
  </h2>
  
  <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1; margin: 0 0 16px 0;">
    Hi {{name}},
  </p>
  
  <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1; margin: 0 0 20px 0;">
    Thanks for your interest in <strong>MyTradingToolbox</strong>! We are currently onboarding a select group of options and income traders to showcase our live execution and cash flow analytics platform.
  </p>
</div>

<!-- Covered in Demo Grid -->
<div style="background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%); border: 1px solid #334155; border-radius: 16px; padding: 22px; margin: 24px 0; box-shadow: 0 8px 24px rgba(0,0,0,0.3);">
  <h3 style="color: #38bdf8; font-size: 15px; font-weight: 800; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 0.5px;">
    What We Will Walk Through on Google Meet (15 Mins):
  </h3>

  <div style="display: grid; gap: 10px;">
    <div style="background-color: #0b1120; border: 1px solid #1e293b; border-radius: 12px; padding: 12px 16px; margin-bottom: 8px;">
      <div style="color: #ffffff; font-weight: 700; font-size: 13px;">⚡ Opus Options Engine</div>
      <div style="color: #94a3b8; font-size: 12px; margin-top: 2px;">Live screening for covered calls, cash-secured puts, and spreads with real-time Tradier 1-click execution.</div>
    </div>
    
    <div style="background-color: #0b1120; border: 1px solid #1e293b; border-radius: 12px; padding: 12px 16px; margin-bottom: 8px;">
      <div style="color: #34d399; font-weight: 700; font-size: 13px;">📊 CashMap Income Forecaster</div>
      <div style="color: #94a3b8; font-size: 12px; margin-top: 2px;">Synchronized cash flow planning combining option premium cash with dividend payout schedules.</div>
    </div>

    <div style="background-color: #0b1120; border: 1px solid #1e293b; border-radius: 12px; padding: 12px 16px; margin-bottom: 8px;">
      <div style="color: #f43f5e; font-weight: 700; font-size: 13px;">🚨 Risk & Strike Breach Alerts</div>
      <div style="color: #94a3b8; font-size: 12px; margin-top: 2px;">Instant SMS/email notifications when underlying price approaches short strikes or volatility shifts.</div>
    </div>

    <div style="background-color: #0b1120; border: 1px solid #1e293b; border-radius: 12px; padding: 12px 16px;">
      <div style="color: #a78bfa; font-weight: 700; font-size: 13px;">🤖 AI Options Strategy Coach</div>
      <div style="color: #94a3b8; font-size: 12px; margin-top: 2px;">Real-time position sizing, hedge recommendations, and defense adjustments for active traders.</div>
    </div>
  </div>
</div>

<!-- CTA Box -->
<div style="background: linear-gradient(135deg, rgba(2,132,199,0.15) 0%, rgba(99,102,241,0.15) 100%); border: 1px solid rgba(56,189,248,0.3); border-radius: 16px; padding: 24px; text-align: center; margin: 28px 0;">
  <p style="color: #ffffff; font-size: 15px; font-weight: 700; margin: 0 0 16px 0;">
    Would you have 15 minutes this week for a live walkthrough and to get direct access?
  </p>
  <div>
    <a href="{{meet_url}}" style="background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: 800; display: inline-block; font-size: 14px; box-shadow: 0 6px 20px rgba(2,132,199,0.4); border: 1px solid rgba(255,255,255,0.2);">
      📅 Schedule / Join Google Meet Demo &rarr;
    </a>
  </div>
  <div style="margin-top: 14px; font-size: 12px; color: #94a3b8;">
    Prefer another time? Simply reply directly to this email with what days work best for you!
  </div>
</div>

<p style="margin: 0; color: #cbd5e1; font-size: 14px; line-height: 1.6;">
  Best regards,<br/>
  <strong style="color: #ffffff; font-size: 15px;">Keith Thompson</strong><br/>
  <span style="color: #64748b; font-size: 12px;">Founder &bull; MyTradingToolbox</span>
</p>
`
  },
  {
    id: 'feature_announcement',
    name: 'New Feature Drop & Tool Showcase',
    category: 'Product Updates',
    subject: 'New Tools Released: AI Options Coach, Stock Health & CashMap Integration',
    description: 'Keep your users and leads engaged by showcasing new suite capabilities and improvements.',
    default_meet_url: config.defaultMeetUrl,
    is_system: true,
    body: `<p>Hi {{name}},</p>
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
</div>`
  },
  {
    id: 'founder_outreach',
    name: 'Personal Founder Check-In & Strategy Call',
    category: 'Founder Outreach',
    subject: 'Quick question regarding your trading workflow',
    description: 'Personal, high-response rate email from the founder offering 1-on-1 strategy support and demo setup.',
    default_meet_url: config.defaultMeetUrl,
    is_system: true,
    body: `<p>Hi {{name}},</p>
<p>I noticed your interest in the MyTradingToolbox suite. I am the lead builder behind the platform, and I wanted to personally reach out.</p>
<p>Whether you're selling covered calls for monthly income, running cash-secured puts, or looking for cleaner risk telemetry, we engineered these tools specifically for active income traders.</p>
<p>I'd love to jump on a quick 10-minute Google Meet call to learn about your current setup, answer any questions, and give you early access.</p>

<div style="text-align: center; margin: 25px 0;">
  <a href="{{meet_url}}" style="background: linear-gradient(135deg, #0284c7, #2563eb); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 14px;">
    Click Here to Meet on Google Meet &rarr;
  </a>
</div>

<p>Looking forward to connecting!</p>
<p style="margin-bottom: 0;">Best regards,<br/><strong>Keith Thompson</strong><br/><span style="color: #64748b; font-size: 13px;">Founder, MyTradingToolbox</span></p>`
  },
  {
    id: 'beta_access',
    name: 'VIP Beta Access & Revenue Pitch',
    category: 'Conversion & Sales',
    subject: 'Your VIP Early Access to the MyTradingToolbox Suite',
    description: 'High-converting invitation offering grandfathered access and private onboarding.',
    default_meet_url: config.defaultMeetUrl,
    is_system: true,
    body: `<p>Hi {{name}},</p>
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
</div>`
  }
];

export let mockTemplates = JSON.parse(JSON.stringify(DEFAULT_TEMPLATES));


export let mockUsers = [];
export let mockEntitlements = [];
export let mockSubscriptions = [];
export let mockTickets = [];

export let mockLeads = [];

export let isDbConnected = false;

export async function initDb() {
  if (!pool || config.useMockDb) {
    console.log('[DB] No PostgreSQL DATABASE_URL or MOCK_DB=true. Using In-Memory Database.');
    return;
  }
  
  try {
    const client = await pool.connect();
    isDbConnected = true;
    console.log('[DB] ✓ Successfully connected to PostgreSQL (' + (poolConfig?.ssl ? 'SSL' : 'Internal Non-SSL') + ') & verifying schema...');

    // 1. Leads Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT DEFAULT '',
        status TEXT DEFAULT 'lead',
        source TEXT DEFAULT 'waitlist',
        preferences JSONB DEFAULT '[]',
        notes JSONB DEFAULT '[]',
        visit_count INTEGER DEFAULT 1,
        last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_promotional_contact TIMESTAMP,
        unsubscribe_token TEXT UNIQUE,
        is_unsubscribed BOOLEAN DEFAULT FALSE,
        unsubscribed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Migrations for leads
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='name') THEN
          ALTER TABLE leads ADD COLUMN name TEXT DEFAULT '';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='status') THEN
          ALTER TABLE leads ADD COLUMN status TEXT DEFAULT 'lead';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='source') THEN
          ALTER TABLE leads ADD COLUMN source TEXT DEFAULT 'waitlist';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='notes') THEN
          ALTER TABLE leads ADD COLUMN notes JSONB DEFAULT '[]';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='unsubscribe_token') THEN
          ALTER TABLE leads ADD COLUMN unsubscribe_token TEXT UNIQUE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='is_unsubscribed') THEN
          ALTER TABLE leads ADD COLUMN is_unsubscribed BOOLEAN DEFAULT FALSE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='unsubscribed_at') THEN
          ALTER TABLE leads ADD COLUMN unsubscribed_at TIMESTAMP;
        END IF;
      END $$;
    `);

    // 2. Email Templates Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS email_templates (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT DEFAULT 'General',
        subject TEXT NOT NULL,
        description TEXT DEFAULT '',
        body TEXT NOT NULL,
        default_meet_url TEXT DEFAULT '',
        is_system BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const tplCountRes = await client.query('SELECT COUNT(*) FROM email_templates');
    if (parseInt(tplCountRes.rows[0].count) === 0) {
      console.log('[DB] Seeding default email templates...');
      for (const tpl of DEFAULT_TEMPLATES) {
        await client.query(`
          INSERT INTO email_templates (id, name, category, subject, description, body, default_meet_url, is_system)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO NOTHING;
        `, [tpl.id, tpl.name, tpl.category, tpl.subject, tpl.description, tpl.body, tpl.default_meet_url, tpl.is_system]);
      }
    }

    console.log('[DB] PostgreSQL schema & templates verified successfully.');
    client.release();
  } catch (err) {
    console.error('[DB] ❌ PostgreSQL Connection Failed:', err.message);
    isDbConnected = false;
    // Do not silently set useMockDb if user provided DATABASE_URL
    if (!config.databaseUrl) {
      config.useMockDb = true;
    }
  }
}

export async function query(text, params = []) {
  if (config.useMockDb || !pool) {
    return handleMockQuery(text, params);
  }

  try {
    return await pool.query(text, params);
  } catch (err) {
    console.error('[DB] PostgreSQL Query Error:', err.message, 'Query:', text.substring(0, 100));
    // If pool is dead, fallback to mock to avoid crashing but log loudly
    return handleMockQuery(text, params);
  }
}

function handleMockQuery(text, params) {
  const normalized = text.toLowerCase().trim();

  // TEMPLATES: GET ALL / FILTERED
  if (normalized.startsWith('select * from email_templates')) {
    if (normalized.includes('where id = $1')) {
      const id = params[0];
      const t = mockTemplates.find(tpl => tpl.id === id);
      return { rows: t ? [t] : [] };
    }
    return { rows: [...mockTemplates] };
  }

  // TEMPLATES: UPSERT / UPDATE
  if (normalized.includes('insert into email_templates')) {
    const [id, name, category, subject, description, body, defaultMeetUrl, isSystem] = params;
    let t = mockTemplates.find(tpl => tpl.id === id);
    if (t) {
      t.name = name;
      t.category = category;
      t.subject = subject;
      t.description = description;
      t.body = body;
      t.default_meet_url = defaultMeetUrl;
    } else {
      t = {
        id,
        name,
        category,
        subject,
        description,
        body,
        default_meet_url: defaultMeetUrl || config.defaultMeetUrl,
        is_system: isSystem || false,
        created_at: new Date(),
        updated_at: new Date()
      };
      mockTemplates.push(t);
    }
    return { rows: [t] };
  }

  if (normalized.startsWith('update email_templates set')) {
    const id = params[params.length - 1];
    let t = mockTemplates.find(tpl => tpl.id === id);
    if (t) {
      t.name = params[0];
      t.category = params[1];
      t.subject = params[2];
      t.description = params[3];
      t.body = params[4];
      t.default_meet_url = params[5] || t.default_meet_url;
      t.updated_at = new Date();
      return { rows: [t] };
    }
    return { rows: [] };
  }

  if (normalized.startsWith('delete from email_templates')) {
    const id = params[0];
    mockTemplates = mockTemplates.filter(t => t.id !== id);
    return { rowCount: 1 };
  }

  // LEADS: GET ALL / FILTERED
  if (normalized.startsWith('select * from leads')) {
    if (normalized.includes('where unsubscribe_token = $1')) {
      const token = params[0];
      const lead = mockLeads.find(l => l.unsubscribe_token === token);
      return { rows: lead ? [lead] : [] };
    }
    if (normalized.includes('where email = $1')) {
      const email = params[0];
      const lead = mockLeads.find(l => l.email === email);
      return { rows: lead ? [lead] : [] };
    }
    if (normalized.includes('where is_unsubscribed = false')) {
      return { rows: mockLeads.filter(l => !l.is_unsubscribed).sort((a,b) => b.id - a.id) };
    }
    return { rows: [...mockLeads].sort((a,b) => b.id - a.id) };
  }

  // STATS
  if (normalized.includes('count(*)') && !normalized.includes('group by') && normalized.includes('from leads')) {
    return { rows: [{ count: mockLeads.length }] };
  }

  if (normalized.includes('group by status')) {
    const counts = {};
    mockLeads.forEach(l => {
      const st = l.status || 'lead';
      counts[st] = (counts[st] || 0) + 1;
    });
    return { rows: Object.entries(counts).map(([status, count]) => ({ status, count })) };
  }

  if (normalized.includes('jsonb_array_elements_text')) {
    const counts = {};
    mockLeads.forEach(l => {
      if (Array.isArray(l.preferences)) {
        l.preferences.forEach(p => counts[p] = (counts[p] || 0) + 1);
      }
    });
    return { rows: Object.entries(counts).map(([tool, count]) => ({ tool, count })) };
  }

  // MANUAL CONTACT CREATION / INSERT
  if (normalized.includes('insert into leads (email, name, status, source, preferences, notes, unsubscribe_token)')) {
    const [email, name, status, source, prefsJson, notesJson, token] = params;
    const prefs = typeof prefsJson === 'string' ? JSON.parse(prefsJson) : (prefsJson || []);
    const notes = typeof notesJson === 'string' ? JSON.parse(notesJson) : (notesJson || []);
    
    let lead = mockLeads.find(l => l.email === email);
    if (lead) {
      lead.name = name || lead.name;
      lead.status = status || lead.status;
      lead.source = source || lead.source;
      lead.preferences = prefs;
      lead.notes = [...(lead.notes || []), ...notes];
    } else {
      lead = {
        id: mockLeads.length + 1,
        email,
        name: name || '',
        status: status || 'lead',
        source: source || 'manual_admin',
        preferences: prefs,
        notes: notes,
        visit_count: 1,
        last_accessed: new Date(),
        created_at: new Date(),
        last_promotional_contact: null,
        unsubscribe_token: token || generateToken(),
        is_unsubscribed: false,
        unsubscribed_at: null
      };
      mockLeads.push(lead);
    }
    return { rows: [lead] };
  }

  // PUBLIC LEAD CAPTURE UPSERT
  if (normalized.includes('insert into leads (email, preferences, unsubscribe_token, visit_count, last_accessed)')) {
    const [email, prefsJson, token] = params;
    const prefs = typeof prefsJson === 'string' ? JSON.parse(prefsJson) : (prefsJson || []);
    let lead = mockLeads.find(l => l.email === email);
    if (lead) {
      lead.preferences = prefs;
      lead.visit_count += 1;
      lead.last_accessed = new Date();
      if (!lead.unsubscribe_token) lead.unsubscribe_token = token || generateToken();
    } else {
      lead = {
        id: mockLeads.length + 1,
        email,
        name: '',
        status: 'lead',
        source: 'waitlist',
        preferences: prefs,
        notes: [],
        visit_count: 1,
        last_accessed: new Date(),
        created_at: new Date(),
        last_promotional_contact: null,
        unsubscribe_token: token || generateToken(),
        is_unsubscribed: false,
        unsubscribed_at: null
      };
      mockLeads.push(lead);
    }
    return { rows: [lead] };
  }

  // UPDATE BY ID
  if (normalized.startsWith('update leads set') && normalized.includes('where id = $')) {
    const id = params[params.length - 1];
    const lead = mockLeads.find(l => l.id === parseInt(id));
    if (lead) {
      if (normalized.includes('status = $1') && !normalized.includes('name = $2')) lead.status = params[0];
      if (normalized.includes('name = $1, status = $2, preferences = $3')) {
        lead.name = params[0];
        lead.status = params[1];
        lead.preferences = typeof params[2] === 'string' ? JSON.parse(params[2]) : params[2];
      }
      if (normalized.includes('notes = $1')) {
        lead.notes = typeof params[0] === 'string' ? JSON.parse(params[0]) : params[0];
      }
      if (normalized.includes('last_promotional_contact = current_timestamp')) {
        lead.last_promotional_contact = new Date();
      }
      return { rows: [lead] };
    }
    return { rows: [] };
  }

  // UNSUBSCRIBE
  if (normalized.includes('is_unsubscribed = true')) {
    const identifier = params[0];
    const lead = mockLeads.find(l => l.unsubscribe_token === identifier || l.email === identifier);
    if (lead) {
      lead.is_unsubscribed = true;
      lead.unsubscribed_at = new Date();
      lead.status = 'unsubscribed';
      return { rows: [lead] };
    }
    return { rows: [] };
  }

  // RESUBSCRIBE
  if (normalized.includes('is_unsubscribed = false')) {
    const identifier = params[0];
    const lead = mockLeads.find(l => l.unsubscribe_token === identifier || l.email === identifier);
    if (lead) {
      lead.is_unsubscribed = false;
      lead.unsubscribed_at = null;
      lead.status = 'lead';
      return { rows: [lead] };
    }
    return { rows: [] };
  }

  // GENERIC UPDATE
  if (normalized.includes('delete from leads')) {
    const id = parseInt(params[0], 10);
    const idx = mockLeads.findIndex(l => l.id === id);
    if (idx !== -1) {
      const removed = mockLeads.splice(idx, 1);
      return { rows: removed };
    }
    return { rows: [] };
  }

  if (normalized.includes('update leads')) {
    const email = params[0];
    const lead = mockLeads.find(l => l.email === email);
    if (lead) {
      if (normalized.includes('last_promotional_contact')) {
        lead.last_promotional_contact = new Date();
      } else {
        lead.last_accessed = new Date();
      }
    }
    return { rows: [lead || {}] };
  }

  
  // USERS & ENTITLEMENTS MOCK QUERIES
  if (normalized.includes('select * from users where lower(email)')) {
    const email = (params[0] || '').toLowerCase().trim();
    const user = mockUsers.find(u => u.email.toLowerCase() === email);
    return { rows: user ? [user] : [] };
  }

  if (normalized.includes('select * from users where id =')) {
    const id = params[0];
    const user = mockUsers.find(u => u.id === id);
    return { rows: user ? [user] : [] };
  }

  if (normalized.includes('select id, email, name, phone, status, is_email_verified, created_at, last_login_at from users where id =')) {
    const id = params[0];
    const user = mockUsers.find(u => u.id === id);
    return { rows: user ? [user] : [] };
  }

  if (normalized.includes('insert into users')) {
    const email = (params[0] || '').toLowerCase().trim();
    let name = params[1] || 'Trader';
    if (params.length >= 3 && typeof params[2] === 'string' && params[2] !== '') {
      name = params[2];
    }
    const user = {
      id: 'usr_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      email,
      name,
      status: 'active',
      is_email_verified: true,
      created_at: new Date(),
      last_login_at: new Date()
    };
    mockUsers.push(user);
    return { rows: [user] };
  }

  if (normalized.includes('insert into app_entitlements')) {
    const userId = params[0];
    let ent = mockEntitlements.find(e => e.user_id === userId);
    if (!ent) {
      ent = {
        user_id: userId,
        opus_access: true,
        opus_tradier_connected: false,
        ai_coach_access: false,
        ai_coach_status: 'pending_approval',
        ai_coach_approved_at: null,
        alerts_access: true,
        alerts_sms_limit: 10,
        cashmap_access: true,
        dataservices_access: true,
        itm_bot_access: true,
        itm_bot_mode: 'paper_only',
        updated_at: new Date()
      };
      mockEntitlements.push(ent);
    }
    return { rows: [ent] };
  }

  if (normalized.includes('select * from app_entitlements where user_id =')) {
    const userId = params[0];
    const ent = mockEntitlements.find(e => e.user_id === userId);
    return { rows: ent ? [ent] : [] };
  }

  if (normalized.includes('update app_entitlements')) {
    const userId = params[0];
    let ent = mockEntitlements.find(e => e.user_id === userId);
    if (ent) {
      if (normalized.includes('ai_coach_status =')) {
        ent.ai_coach_status = params[1] !== undefined ? params[1] : ent.ai_coach_status;
      }
      if (normalized.includes('ai_coach_access =')) {
        ent.ai_coach_access = params[1] !== undefined ? params[1] : ent.ai_coach_access;
      }
      ent.updated_at = new Date();
    }
    return { rows: [ent || {}] };
  }

  if (normalized.includes('insert into subscriptions')) {
    const userId = params[0];
    let sub = mockSubscriptions.find(s => s.user_id === userId);
    if (!sub) {
      sub = {
        id: 'sub_' + Date.now(),
        user_id: userId,
        plan_tier: params[1] || 'free_tier',
        status: params[2] || 'active',
        created_at: new Date()
      };
      mockSubscriptions.push(sub);
    }
    return { rows: [sub] };
  }

  if (normalized.includes('select * from subscriptions where user_id =')) {
    const userId = params[0];
    const sub = mockSubscriptions.find(s => s.user_id === userId);
    return { rows: sub ? [sub] : [] };
  }

  if (normalized.includes('select') && normalized.includes('from users u') && normalized.includes('left join app_entitlements')) {
    const combined = mockUsers.map(u => {
      const ent = mockEntitlements.find(e => e.user_id === u.id) || {};
      const sub = mockSubscriptions.find(s => s.user_id === u.id) || {};
      return {
        ...u,
        ...ent,
        plan_tier: sub.plan_tier || 'free_tier',
        subscription_status: sub.status || 'active'
      };
    });
    return { rows: combined };
  }

  if (normalized.includes('insert into support_tickets')) {
    const ticket = {
      id: 'tkt_' + Date.now(),
      user_id: params[0] || null,
      email: params[1],
      app_context: params[2] || 'general',
      subject: params[3],
      message: params[4],
      status: 'open',
      admin_notes: '',
      created_at: new Date()
    };
    mockTickets.push(ticket);
    return { rows: [ticket] };
  }

  if (normalized.includes('select * from support_tickets')) {
    return { rows: [...mockTickets].sort((a, b) => b.created_at - a.created_at) };
  }

  if (normalized.includes('update support_tickets')) {
    const id = params[0];
    const ticket = mockTickets.find(t => t.id === id);
    if (ticket) {
      ticket.status = params[1] || ticket.status;
      ticket.admin_notes = params[2] || ticket.admin_notes;
    }
    return { rows: [ticket || {}] };
  }


  return { rows: [] };
}
