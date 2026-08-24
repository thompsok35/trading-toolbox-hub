import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Cpu, 
  Bot, 
  Bell, 
  LayoutDashboard, 
  Wallet, 
  Activity, 
  ExternalLink, 
  ArrowLeft, 
  HelpCircle, 
  Send,
  Sparkles,
  ShieldCheck,
  UserCheck,
  LogOut,
  Sparkle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

declare global {
  interface Window {
    google?: any;
  }
}

export const CustomerPortal: React.FC = () => {
  const [email, setEmail] = useState(localStorage.getItem('lead_email') || '');
  const [userData, setUserData] = useState<any>(() => {
    try {
      const cached = localStorage.getItem('mtt_user_data');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketAppContext, setTicketAppContext] = useState('general');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketFeedback, setTicketFeedback] = useState<string | null>(null);
  const [googleClientId, setGoogleClientId] = useState<string>('');

  const googleBtnRef = useRef<HTMLDivElement>(null);

  // Handle Google Token Response
  const handleGoogleCredentialResponse = useCallback(async (response: any) => {
    if (!response || !response.credential) {
      setAuthError('Google credential was not provided. Please try again.');
      return;
    }

    setGoogleLoading(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/v1/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setAuthError(data.error || 'Google login failed. Please verify your account.');
        return;
      }

      setUserData(data);
      setIsNewUser(Boolean(data.isNewUser));
      setEmail(data.user?.email || '');
      localStorage.setItem('lead_email', data.user?.email || '');
      localStorage.setItem('mtt_user_data', JSON.stringify(data));
      localStorage.setItem('mtt_auth_type', 'google');
    } catch (err: any) {
      console.error('[GoogleAuth] Error:', err);
      setAuthError('Network error during Google authentication. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  }, []);

  // Fetch Google Auth configuration & Initialize Google Identity Services
  useEffect(() => {
    let isMounted = true;

    const initGoogleAuth = async () => {
      try {
        const cfgRes = await fetch('/api/v1/auth/config');
        const cfg = await cfgRes.json();
        const clientId = cfg.clientId;
        
        if (isMounted) {
          setGoogleClientId(clientId);
        }

        if (!clientId) {
          console.warn('[GoogleAuth] GOOGLE_CLIENT_ID not configured yet in Railway.');
          return;
        }

        // Dynamically load Google Identity Services script if not already present
        if (!window.google?.accounts?.id) {
          const script = document.createElement('script');
          script.src = 'https://accounts.google.com/gsi/client';
          script.async = true;
          script.defer = true;
          script.onload = () => {
            if (window.google?.accounts?.id && isMounted) {
              window.google.accounts.id.initialize({
                client_id: clientId,
                callback: handleGoogleCredentialResponse,
                auto_select: false,
                cancel_on_tap_outside: true
              });

              if (googleBtnRef.current) {
                window.google.accounts.id.renderButton(googleBtnRef.current, {
                  theme: 'filled_blue',
                  size: 'large',
                  shape: 'pill',
                  text: 'signin_with',
                  width: 280
                });
              }
            }
          };
          document.body.appendChild(script);
        } else if (isMounted) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true
          });

          if (googleBtnRef.current) {
            window.google.accounts.id.renderButton(googleBtnRef.current, {
              theme: 'filled_blue',
              size: 'large',
              shape: 'pill',
              text: 'signin_with',
              width: 280
            });
          }
        }
      } catch (err) {
        console.error('[GoogleAuth] Config fetch error:', err);
      }
    };

    initGoogleAuth();

    return () => {
      isMounted = false;
    };
  }, [handleGoogleCredentialResponse]);

  // Re-render Google button if user signs out or ref becomes available
  useEffect(() => {
    if (!userData && googleClientId && window.google?.accounts?.id && googleBtnRef.current) {
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'filled_blue',
        size: 'large',
        shape: 'pill',
        text: 'signin_with',
        width: 280
      });
    }
  }, [userData, googleClientId]);

  // Email manual lookup / refresh entitlements
  const fetchEntitlements = async (emailToFetch: string) => {
    if (!emailToFetch) return;
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/v1/entitlements/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToFetch })
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Account check failed.');
        return;
      }
      setUserData(data);
      localStorage.setItem('lead_email', emailToFetch);
      localStorage.setItem('mtt_user_data', JSON.stringify(data));
    } catch (err) {
      console.error(err);
      setAuthError('Failed to fetch account access.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email && !userData) {
      fetchEntitlements(email);
    }
  }, []);

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEntitlements(email);
  };

  const handleSignOut = () => {
    localStorage.removeItem('lead_email');
    localStorage.removeItem('mtt_user_data');
    localStorage.removeItem('mtt_auth_type');
    setUserData(null);
    setIsNewUser(false);
    setEmail('');
    setAuthError(null);
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !ticketSubject || !ticketMessage) return;
    try {
      const res = await fetch('/api/v1/entitlements/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userData?.user?.id,
          email,
          appContext: ticketAppContext,
          subject: ticketSubject,
          message: ticketMessage
        })
      });
      if (res.ok) {
        setTicketFeedback('Your support ticket has been submitted. Keith will follow up directly by email!');
        setTicketSubject('');
        setTicketMessage('');
      }
    } catch (err) {
      setTicketFeedback('Failed to submit ticket. Please try again.');
    }
  };

  const ent = userData?.entitlements || {};
  const tier = userData?.user?.tier || userData?.subscription?.plan_tier || 'free_tier';
  const currentUser = userData?.user || null;

  return (
    <div className="min-h-screen bg-[#02040c] text-white font-outfit p-4 md:p-8 relative selection:bg-blue-500 selection:text-white">
      {/* Glow overlays */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/10 to-teal-500/10 blur-[140px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Navbar */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Suite Hub
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-300">Member Entitlements & Identity Portal</span>
            </div>
            {currentUser && (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 hover:bg-slate-700 border border-white/10 rounded-lg text-[11px] font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Sign out of account"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            )}
          </div>
        </div>

        {/* New Member Registration Banner */}
        {isNewUser && currentUser && (
          <div className="bg-gradient-to-r from-teal-500/20 via-blue-500/20 to-indigo-500/20 border border-teal-500/40 p-5 rounded-3xl backdrop-blur-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-teal-500/20 border border-teal-500/40 rounded-2xl text-teal-300">
                <Sparkle className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  Welcome to MyTradingToolbox, {currentUser.name}! 🎉
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Your member account has been registered. You have active access to the 6 suite applications below.
                </p>
              </div>
            </div>
            <span className="shrink-0 px-3 py-1 bg-teal-500/30 border border-teal-400/40 text-teal-300 rounded-full text-xs font-bold uppercase tracking-wider">
              Registered Member
            </span>
          </div>
        )}

        {/* Authentication & Member Banner */}
        {!currentUser ? (
          <div className="bg-slate-900/70 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-xl space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold mb-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Google 2FA & Identity Authentication
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Member Portal Login</h1>
                <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">
                  Sign in with your Google Account (supports 2-Factor Authentication). The system automatically validates your customer record or activates your new member registration.
                </p>
              </div>
              
              {/* Google Sign-In Button Container */}
              <div className="flex flex-col items-center gap-2 w-full md:w-auto">
                <div ref={googleBtnRef} className="min-h-[44px] flex items-center justify-center" />
                {googleLoading && (
                  <span className="text-xs text-blue-400 font-semibold animate-pulse">
                    Authenticating Google 2FA...
                  </span>
                )}
                {!googleClientId && (
                  <span className="text-[11px] text-amber-400/80 text-center">
                    (Google Client ID will activate once added to Railway)
                  </span>
                )}
              </div>
            </div>

            {authError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Fallback Email Lookup */}
            <div className="pt-6 border-t border-white/5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Or Direct Email Lookup / Fast Check
              </div>
              <form onSubmit={handleLookupSubmit} className="flex gap-2 max-w-md">
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email..."
                  className="bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
                >
                  {loading ? 'Checking...' : 'Check Access'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {currentUser.avatarUrl ? (
                  <img 
                    src={currentUser.avatarUrl} 
                    alt={currentUser.name} 
                    className="w-14 h-14 rounded-2xl border-2 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.3)] object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 border border-blue-400/40 flex items-center justify-center text-white text-xl font-black shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'T'}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl md:text-2xl font-black text-white">{currentUser.name || 'Member Trader'}</h1>
                    <span title="Verified Customer">
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{currentUser.email}</div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-blue-400" /> Account Status: <span className="text-teal-300 font-semibold uppercase">{currentUser.status || 'Active'}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Subscription Plan</div>
                  <div className="mt-1 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border border-blue-500/40 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                    {tier === 'vip_elite' ? '👑 VIP Elite' : tier === 'pro_suite' ? '⚡ Pro Suite' : '🌱 Free Tier'}
                  </div>
                </div>
                <button 
                  onClick={handleSignOut}
                  className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold border border-white/10 transition-all cursor-pointer"
                >
                  Switch Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 6 Tool Entitlement Matrix */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" /> 6 Suite Applications Access Matrix
            </h2>
            {currentUser && (
              <span className="text-xs text-slate-400">
                Logged in as <strong className="text-white">{currentUser.email}</strong>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* 1. Opus Engine */}
            <div className="bg-slate-900/50 border border-white/5 p-5 rounded-2xl space-y-3 hover:border-blue-500/30 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400"><LayoutDashboard className="w-4 h-4" /></div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Opus Analysis Engine</h3>
                    <div className="text-[10px] text-slate-400">Multi-Leg & Buy-Writes</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">Active ✅</span>
              </div>
              <p className="text-xs text-slate-400">Tradier Brokerage: {ent.opus_tradier_connected ? 'Connected 🟢' : 'Ready to Connect'}</p>
              <a href="https://opus.mytradingtoolbox.com" target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
                Launch Opus Engine <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* 2. AI Options Coach (RAG Gate) */}
            <div className="bg-slate-900/50 border border-white/5 p-5 rounded-2xl space-y-3 hover:border-purple-500/30 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400"><Bot className="w-4 h-4" /></div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Opus AI Options Coach</h3>
                    <div className="text-[10px] text-slate-400">Proprietary RAG Engine</div>
                  </div>
                </div>
                {ent.ai_coach_status === 'approved' ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">Approved ✅</span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">Pending Review ⏳</span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {ent.ai_coach_status === 'approved' 
                  ? 'Access granted by Keith. Full RAG trade coaching active.' 
                  : 'Proprietary knowledge base. Access request is in review.'}
              </p>
              <a href="https://coach.mytradingtoolbox.com" target="_blank" rel="noreferrer" className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1">
                Launch AI Coach <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* 3. Alerts Engine */}
            <div className="bg-slate-900/50 border border-white/5 p-5 rounded-2xl space-y-3 hover:border-rose-500/30 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400"><Bell className="w-4 h-4" /></div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Opus Alerting Engine</h3>
                    <div className="text-[10px] text-slate-400">Strike & Volatility Telemetry</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">Active ✅</span>
              </div>
              <p className="text-xs text-slate-400">SMS Allotment: {ent.alerts_sms_limit || 10} SMS alerts / month</p>
              <a href="https://alerts.mytradingtoolbox.com" target="_blank" rel="noreferrer" className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1">
                Launch Alerts <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* 4. CashMap Planner */}
            <div className="bg-slate-900/50 border border-white/5 p-5 rounded-2xl space-y-3 hover:border-teal-500/30 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400"><Wallet className="w-4 h-4" /></div>
                  <div>
                    <h3 className="font-bold text-sm text-white">CashMap Planner</h3>
                    <div className="text-[10px] text-slate-400">Income & Dividend Forecasts</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">Active ✅</span>
              </div>
              <p className="text-xs text-slate-400">Syncs option premium cash flow directly with Opus.</p>
              <a href="https://cashmap.mytradingtoolbox.com" target="_blank" rel="noreferrer" className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1">
                Launch CashMap <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* 5. DataServices Scanner */}
            <div className="bg-slate-900/50 border border-white/5 p-5 rounded-2xl space-y-3 hover:border-indigo-500/30 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400"><Activity className="w-4 h-4" /></div>
                  <div>
                    <h3 className="font-bold text-sm text-white">DataServices Scanner</h3>
                    <div className="text-[10px] text-slate-400">Stock Health & Screeners</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">Active ✅</span>
              </div>
              <p className="text-xs text-slate-400">Institutional health metrics & DCF valuations.</p>
              <a href="https://dataservices.mytradingtoolbox.com/login" target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
                Launch DataServices <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* 6. ITM Covered Call BOT */}
            <div className="bg-slate-900/50 border border-white/5 p-5 rounded-2xl space-y-3 hover:border-cyan-500/30 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400"><Cpu className="w-4 h-4" /></div>
                  <div>
                    <h3 className="font-bold text-sm text-white">ITM Covered Call BOT</h3>
                    <div className="text-[10px] text-slate-400">Semi-Automated Strategy</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {ent.itm_bot_mode === 'live_enabled' ? 'Live Mode ⚡' : 'Paper Mode 📝'}
                </span>
              </div>
              <p className="text-xs text-slate-400">Risk-first downside buffer planning & trade continuity.</p>
              <Link to="/itm-covered-call-bot" className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1">
                Open BOT Portal <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

          </div>
        </div>

        {/* Customer Support Desk Form */}
        <div className="bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            <span>Need Help, Account Support, or Feature Inquiries?</span>
          </div>
          <p className="text-xs text-slate-400">Submit a support request directly to Keith Thompson and the development team.</p>

          <form onSubmit={handleSupportSubmit} className="space-y-3 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">Application Context</label>
                <select
                  value={ticketAppContext}
                  onChange={(e) => setTicketAppContext(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="general">General Support / Account</option>
                  <option value="opus">Opus Analysis Engine / Tradier</option>
                  <option value="ai_coach">AI Options Coach (RAG Access)</option>
                  <option value="alerts">Alerts Engine / SMS</option>
                  <option value="cashmap">CashMap Planner</option>
                  <option value="dataservices">DataServices Scanner</option>
                  <option value="itm_bot">ITM Covered Call Strategy BOT</option>
                  <option value="billing">Subscriptions & Billing</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">Subject</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="Brief summary of your question..."
                  className="w-full mt-1 bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase">Message Details</label>
              <textarea
                required
                rows={3}
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                placeholder="Describe your issue or feature request..."
                className="w-full mt-1 bg-slate-950 border border-white/15 rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-teal-400 font-semibold">{ticketFeedback}</span>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Submit Support Ticket
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default CustomerPortal;
