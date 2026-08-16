import { userRepository } from '../db/repositories/user.repository.js';
import { supportRepository } from '../db/repositories/support.repository.js';
import { emailService } from '../services/email.service.js';

export class EntitlementsController {
  // Verification check called by satellite apps (ITM BOT, Coach, Opus, etc.)
  async checkAccess(req, res) {
    const { email, app = 'general', name = '' } = req.body;
    if (!email) {
      return res.status(400).json({ allowed: false, error: 'Email parameter is required' });
    }

    try {
      const user = await userRepository.getOrCreateUser(email, name, app);
      const ent = user.entitlements;
      const tier = user.subscription?.plan_tier || 'free_tier';

      if (user.status === 'suspended') {
        return res.status(403).json({
          allowed: false,
          reason: 'account_suspended',
          message: 'Your MyTradingToolbox account is currently suspended. Please contact support.'
        });
      }

      // App-Specific Logic
      if (app === 'ai_coach') {
        if (ent.ai_coach_status === 'pending_approval') {
          return res.status(200).json({
            allowed: false,
            reason: 'coach_pending_approval',
            status: 'pending_approval',
            message: 'Your access to the proprietary AI Options Coach RAG knowledge base is pending approval by Keith Thompson.',
            user: { id: user.id, email: user.email, name: user.name, tier }
          });
        }
        if (!ent.ai_coach_access) {
          return res.status(403).json({
            allowed: false,
            reason: 'coach_access_denied',
            status: 'rejected',
            message: 'Access to the AI Options Coach is not currently enabled for your account.',
            user: { id: user.id, email: user.email, name: user.name, tier }
          });
        }
        return res.json({
          allowed: true,
          status: 'approved',
          tier,
          user: { id: user.id, email: user.email, name: user.name }
        });
      }

      if (app === 'itm_bot') {
        return res.json({
          allowed: ent.itm_bot_access,
          mode: ent.itm_bot_mode || 'paper_only',
          tier,
          user: { id: user.id, email: user.email, name: user.name }
        });
      }

      if (app === 'alerts') {
        return res.json({
          allowed: ent.alerts_access,
          smsLimit: ent.alerts_sms_limit || 10,
          tier,
          user: { id: user.id, email: user.email, name: user.name }
        });
      }

      if (app === 'opus') {
        return res.json({
          allowed: ent.opus_access,
          tradierConnected: ent.opus_tradier_connected,
          tier,
          user: { id: user.id, email: user.email, name: user.name }
        });
      }

      if (app === 'cashmap') {
        return res.json({
          allowed: ent.cashmap_access,
          tier,
          user: { id: user.id, email: user.email, name: user.name }
        });
      }

      if (app === 'dataservices') {
        return res.json({
          allowed: ent.dataservices_access,
          tier,
          user: { id: user.id, email: user.email, name: user.name }
        });
      }

      // General fallback
      return res.json({
        allowed: true,
        user: { id: user.id, email: user.email, name: user.name, tier },
        entitlements: ent
      });
    } catch (err) {
      console.error('[Entitlements] Check Error:', err);
      return res.status(500).json({ allowed: false, error: 'Internal entitlement check failure' });
    }
  }

  // Admin: Get all registered customers
  async getUsers(req, res) {
    try {
      const users = await userRepository.getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Admin: Update entitlements (e.g. 1-click Coach approval or tool access)
  async updateEntitlements(req, res) {
    const { id } = req.params;
    try {
      const updated = await userRepository.updateEntitlements(id, req.body);
      res.json({ success: true, entitlements: updated });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // Admin: 1-Click AI Coach Approval
  async approveAiCoach(req, res) {
    const { id } = req.params;
    const { approved } = req.body;
    try {
      const user = await userRepository.findById(id);
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });

      await userRepository.setAiCoachApproval(id, approved !== false);

      // Send automated approval notification email
      if (approved !== false) {
        await emailService.sendRawEmail({
          to: user.email,
          subject: '🎉 Access Approved: Opus AI Options Coach is Now Active',
          htmlBody: `
            <div style="font-family: sans-serif; background-color: #030712; padding: 24px; color: #f8fafc; border-radius: 16px;">
              <h2 style="color: #38bdf8; margin-top: 0;">Your AI Options Coach Access is Approved!</h2>
              <p>Hi ${user.name || 'Trader'},</p>
              <p>Keith Thompson has approved your access to the proprietary <strong>Opus AI Options Coach RAG Knowledge Base</strong>.</p>
              <p>You can now log in and begin using context-aware options coaching, trade sizing, and hedge analysis.</p>
              <div style="margin: 24px 0;">
                <a href="https://coach.mytradingtoolbox.com" style="background: #0284c7; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Launch AI Options Coach &rarr;
                </a>
              </div>
            </div>
          `
        });
      }

      res.json({ success: true, message: approved !== false ? 'AI Coach access approved & email dispatched' : 'AI Coach access revoked' });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // Admin: Update subscription tier
  async updateSubscription(req, res) {
    const { id } = req.params;
    const { planTier, status } = req.body;
    try {
      const sub = await userRepository.updateSubscription(id, { planTier, status });
      res.json({ success: true, subscription: sub });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // Support Tickets API
  async createTicket(req, res) {
    try {
      const ticket = await supportRepository.createTicket(req.body);
      res.json({ success: true, ticket });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getTickets(req, res) {
    try {
      const tickets = await supportRepository.getAllTickets();
      res.json(tickets);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateTicket(req, res) {
    const { id } = req.params;
    try {
      const updated = await supportRepository.updateTicketStatus(id, req.body);
      res.json({ success: true, ticket: updated });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

export const entitlementsController = new EntitlementsController();
