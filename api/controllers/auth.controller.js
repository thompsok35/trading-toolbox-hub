import { userRepository } from '../db/repositories/user.repository.js';
import { config } from '../config/env.js';

export class AuthController {
  // Return public Google Client ID configuration to the frontend
  async getConfig(req, res) {
    return res.json({
      clientId: config.googleClientId || '',
      hasClientId: Boolean(config.googleClientId)
    });
  }

  // Handle Google Identity Services (OAuth / 2FA) Token Login & Auto-Registration
  async googleLogin(req, res) {
    const { credential, email: devEmail, name: devName, avatarUrl: devAvatar } = req.body;

    let payload = null;

    if (credential) {
      try {
        // Verify ID Token with Google OAuth TokenInfo Endpoint
        const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
        if (!verifyRes.ok) {
          const errBody = await verifyRes.text();
          console.error('[Auth] Google Token verification failed:', errBody);
          return res.status(401).json({ success: false, error: 'Invalid Google authentication credential' });
        }
        payload = await verifyRes.json();

        // Validate Audience matches client ID if client ID is configured
        if (config.googleClientId && payload.aud !== config.googleClientId) {
          console.warn('[Auth] Audience mismatch in Google token. Token aud:', payload.aud, 'Configured:', config.googleClientId);
        }
      } catch (err) {
        console.error('[Auth] Error communicating with Google token endpoint:', err.message);
        return res.status(500).json({ success: false, error: 'Failed to verify Google token with Google Identity Services' });
      }
    } else if (devEmail) {
      // Direct email fallback (e.g. for developer / preview environments without Google setup)
      payload = {
        email: devEmail,
        name: devName || 'Trader',
        sub: 'dev_' + Date.now(),
        picture: devAvatar || ''
      };
    } else {
      return res.status(400).json({ success: false, error: 'Missing Google credential or email' });
    }

    const email = (payload.email || '').toLowerCase().trim();
    if (!email) {
      return res.status(400).json({ success: false, error: 'Google credential did not contain a valid email' });
    }

    try {
      const { user, isNewUser } = await userRepository.findOrCreateGoogleUser({
        email,
        name: payload.name || payload.given_name || 'Trader',
        googleId: payload.sub || '',
        avatarUrl: payload.picture || ''
      });

      if (user.status === 'suspended') {
        return res.status(403).json({
          success: false,
          error: 'Your MyTradingToolbox account is suspended. Please contact Keith Thompson.',
          status: 'suspended'
        });
      }

      console.log(`[Auth] User logged in: ${email} (isNewUser: ${isNewUser}, tier: ${user.subscription?.plan_tier})`);

      return res.json({
        success: true,
        isNewUser,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          googleId: user.google_id,
          avatarUrl: user.avatar_url,
          status: user.status,
          isEmailVerified: user.is_email_verified,
          lastLoginAt: user.last_login_at
        },
        entitlements: user.entitlements,
        subscription: user.subscription
      });
    } catch (err) {
      console.error('[Auth] Database User Lookup Error:', err);
      return res.status(500).json({ success: false, error: 'Database account lookup failed' });
    }
  }

  // Get current user session details
  async getMe(req, res) {
    const email = req.query.email || req.body?.email;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    try {
      const user = await userRepository.findByEmail(email.toLowerCase().trim());
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found in system' });
      }

      const fullUser = await userRepository.getUserWithDetails(user.id);
      return res.json({
        success: true,
        user: {
          id: fullUser.id,
          email: fullUser.email,
          name: fullUser.name,
          googleId: fullUser.google_id,
          avatarUrl: fullUser.avatar_url,
          status: fullUser.status,
          isEmailVerified: fullUser.is_email_verified,
          lastLoginAt: fullUser.last_login_at
        },
        entitlements: fullUser.entitlements,
        subscription: fullUser.subscription
      });
    } catch (err) {
      console.error('[Auth] getMe error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}

export const authController = new AuthController();
