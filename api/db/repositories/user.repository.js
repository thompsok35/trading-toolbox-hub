import { query } from '../connection.js';

export class UserRepository {
  async findByEmail(email) {
    if (!email) return null;
    const res = await query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email.trim()]);
    return res.rows[0] || null;
  }

  async findById(id) {
    const res = await query('SELECT * FROM users WHERE id = $1', [id]);
    return res.rows[0] || null;
  }

  async findOrCreateGoogleUser({ email, name = '', googleId = '', avatarUrl = '' }) {
    const cleanEmail = email.toLowerCase().trim();
    let existing = await this.findByEmail(cleanEmail);
    let isNewUser = false;

    if (existing) {
      // Update existing user with Google details and last login
      await query(
        `UPDATE users 
         SET google_id = COALESCE($2, google_id),
             avatar_url = COALESCE($3, avatar_url),
             name = CASE WHEN (name IS NULL OR name = '' OR name = 'Trader') AND $4 != '' THEN $4 ELSE name END,
             last_login_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [existing.id, googleId || null, avatarUrl || null, name ? name.trim() : '']
      );
    } else {
      isNewUser = true;
      const newId = 'usr_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
      const userRes = await query(
        `INSERT INTO users (id, email, name, google_id, avatar_url, status, is_email_verified, last_login_at)
         VALUES ($1, $2, $3, $4, $5, 'active', true, CURRENT_TIMESTAMP)
         RETURNING *`,
        [
          newId,
          cleanEmail,
          name ? name.trim() : 'Trader',
          googleId || null,
          avatarUrl || null
        ]
      );
      existing = userRes.rows[0];

      // Default entitlements: Opus, CashMap, Alerts, DataServices, ITM Bot active, AI Coach pending
      await query(
        `INSERT INTO app_entitlements (
          user_id, opus_access, opus_tradier_connected,
          ai_coach_access, ai_coach_status,
          alerts_access, alerts_sms_limit,
          cashmap_access, dataservices_access,
          itm_bot_access, itm_bot_mode
        ) VALUES ($1, true, false, false, 'pending_approval', true, 10, true, true, true, 'paper_only')
        ON CONFLICT (user_id) DO NOTHING`,
        [existing.id]
      );

      // Default subscription (Free Tier)
      await query(
        `INSERT INTO subscriptions (user_id, plan_tier, status)
         VALUES ($1, 'free_tier', 'active')
         ON CONFLICT DO NOTHING`,
        [existing.id]
      );

      // If user was a waitlist lead, upgrade lead status
      try {
        await query(
          `UPDATE leads SET status = 'registered_member', last_accessed = CURRENT_TIMESTAMP WHERE LOWER(email) = $1`,
          [cleanEmail]
        );
      } catch (leadErr) {
        console.debug('[UserRepo] Could not update lead status:', leadErr.message);
      }
    }

    const fullUser = await this.getUserWithDetails(existing.id);
    return { user: fullUser, isNewUser };
  }

  async getOrCreateUser(email, name = '', source = 'satellite_app') {
    let user = await this.findByEmail(email);
    if (!user) {
      const newId = 'usr_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
      const userRes = await query(
        `INSERT INTO users (id, email, name, status, is_email_verified)
         VALUES ($1, $2, $3, 'active', true)
         RETURNING *`,
        [newId, email.toLowerCase().trim(), name ? name.trim() : 'Trader']
      );
      user = userRes.rows[0];

      // Default entitlements: AI Coach set to 'pending_approval'
      await query(
        `INSERT INTO app_entitlements (
          user_id, opus_access, opus_tradier_connected,
          ai_coach_access, ai_coach_status,
          alerts_access, alerts_sms_limit,
          cashmap_access, dataservices_access,
          itm_bot_access, itm_bot_mode
        ) VALUES ($1, true, false, false, 'pending_approval', true, 10, true, true, true, 'paper_only')
        ON CONFLICT (user_id) DO NOTHING`,
        [user.id]
      );

      // Default subscription (Free Tier)
      await query(
        `INSERT INTO subscriptions (user_id, plan_tier, status)
         VALUES ($1, 'free_tier', 'active')
         ON CONFLICT DO NOTHING`,
        [user.id]
      );
    }
    return this.getUserWithDetails(user.id);
  }

  async updateLastLogin(id) {
    await query('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1', [id]);
  }

  async getUserWithDetails(id) {
    const userRes = await query('SELECT id, email, name, google_id, avatar_url, phone, status, is_email_verified, created_at, last_login_at FROM users WHERE id = $1', [id]);
    if (!userRes.rows[0]) return null;

    const user = userRes.rows[0];
    const entRes = await query('SELECT * FROM app_entitlements WHERE user_id = $1', [id]);
    const subRes = await query('SELECT * FROM subscriptions WHERE user_id = $1', [id]);

    return {
      ...user,
      entitlements: entRes.rows[0] || {
        opus_access: true,
        opus_tradier_connected: false,
        ai_coach_access: false,
        ai_coach_status: 'pending_approval',
        alerts_access: true,
        alerts_sms_limit: 10,
        cashmap_access: true,
        dataservices_access: true,
        itm_bot_access: true,
        itm_bot_mode: 'paper_only'
      },
      subscription: subRes.rows[0] || {
        plan_tier: 'free_tier',
        status: 'active'
      }
    };
  }

  async getAllUsers() {
    // 1. Auto-sync any leads whose status is 'customer' into the users & entitlements tables
    try {
      const customerLeadsRes = await query(`SELECT email, name FROM leads WHERE LOWER(status) = 'customer'`);
      if (customerLeadsRes && customerLeadsRes.rows) {
        for (const lead of customerLeadsRes.rows) {
          if (lead.email) {
            await this.findOrCreateGoogleUser({ email: lead.email, name: lead.name });
          }
        }
      }
    } catch (e) {
      console.warn('[UserRepository] Auto-sync leads warning:', e.message);
    }

    const queryString = `
      SELECT 
        u.id, u.email, u.name, u.phone, u.status, u.is_email_verified, u.created_at, u.last_login_at,
        u.google_id, u.avatar_url,
        e.opus_access, e.opus_tradier_connected, e.ai_coach_access, e.ai_coach_status, e.ai_coach_approved_at,
        e.alerts_access, e.alerts_sms_limit, e.cashmap_access, e.dataservices_access, e.itm_bot_access, e.itm_bot_mode,
        s.plan_tier, s.status as subscription_status, s.stripe_customer_id
      FROM users u
      LEFT JOIN app_entitlements e ON u.id = e.user_id
      LEFT JOIN subscriptions s ON u.id = s.user_id
      ORDER BY u.created_at DESC;
    `;
    const res = await query(queryString);
    return res.rows;
  }

  async deleteUser(userId) {
    await query(`DELETE FROM app_entitlements WHERE user_id = $1`, [userId]);
    await query(`DELETE FROM subscriptions WHERE user_id = $1`, [userId]);
    const res = await query(`DELETE FROM users WHERE id = $1 RETURNING *`, [userId]);
    return res.rows[0] || null;
  }

  async updateEntitlements(userId, updates) {
    const fields = [];
    const values = [userId];
    let idx = 2;

    const allowed = [
      'opus_access', 'opus_tradier_connected', 'ai_coach_access', 'ai_coach_status',
      'ai_coach_approved_at', 'alerts_access', 'alerts_sms_limit', 'cashmap_access',
      'dataservices_access', 'itm_bot_access', 'itm_bot_mode'
    ];

    for (const key of allowed) {
      if (updates[key] !== undefined) {
        fields.push(`${key} = $${idx}`);
        values.push(updates[key]);
        idx++;
      }
    }

    if (fields.length === 0) return null;

    const queryStr = `
      UPDATE app_entitlements 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
      RETURNING *;
    `;
    const res = await query(queryStr, values);
    return res.rows[0];
  }

  async setAiCoachApproval(userId, isApproved) {
    const status = isApproved ? 'approved' : 'rejected';
    const approvedAt = isApproved ? new Date().toISOString() : null;
    return this.updateEntitlements(userId, {
      ai_coach_access: isApproved,
      ai_coach_status: status,
      ai_coach_approved_at: approvedAt
    });
  }

  async updateSubscription(userId, { planTier, status }) {
    const res = await query(
      `UPDATE subscriptions 
       SET plan_tier = COALESCE($2, plan_tier), status = COALESCE($3, status)
       WHERE user_id = $1
       RETURNING *;`,
      [userId, planTier, status]
    );
    return res.rows[0];
  }
}

export const userRepository = new UserRepository();
