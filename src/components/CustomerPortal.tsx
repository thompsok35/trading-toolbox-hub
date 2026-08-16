import React, { useState, useEffect } from 'react';
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
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CustomerPortal: React.FC = () => {
  const [email, setEmail] = useState(localStorage.getItem('lead_email') || '');
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketAppContext, setTicketAppContext] = useState('general');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketFeedback, setTicketFeedback] = useState<string | null>(null);

  const fetchEntitlements = async (emailToFetch: string) => {
    if (!emailToFetch) return;
    setLoading(true);
    try {
      const res = await fetch('/api/v1/entitlements/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToFetch })
      });
      const data = await res.json();
      setUserData(data);
      localStorage.setItem('lead_email', emailToFetch);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) {
      fetchEntitlements(email);
    }
  }, []);

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEntitlements(email);
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
  const tier = userData?.user?.tier || 'free_tier';

  return (
    <div className="min-h-screen bg-[#02040c] text-white font-outfit p-4 md:p-8 relative selection:bg-blue-500 selection:text-white">
      {/* Glow overlays */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/10 to-teal-500/10 blur-[140px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Navbar */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider">
            <ArrowLeft className="w-4 h-4" /> Back to Hub
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-300">Customer Identity & Subscription Portal</span>
          </div>
        </div>

        {/* Email Lookup Bar */}
        <div className="bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-white">Your Suite Access & Entitlements</h1>
              <p className="text-xs text-slate-400 mt-1">Manage permissions, view AI Coach approval status, and request priority support.</p>
            </div>
            <form onSubmit={handleLookupSubmit} className="flex gap-2 w-full md:w-auto">
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email..."
                className="bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
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

          {userData && (
            <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                  {userData.user?.name ? userData.user.name.charAt(0).toUpperCase() : 'T'}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{userData.user?.name || 'Registered Trader'}</div>
                  <div className="text-xs text-slate-400 font-mono">{userData.user?.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Subscription Tier:</span>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border border-blue-500/40 text-blue-300">
                  {tier === 'vip_elite' ? '👑 VIP Elite' : tier === 'pro_suite' ? '⚡ Pro Suite' : '🌱 Free Tier'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 6 Tool Entitlement Matrix */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" /> 6 Suite Applications Access Matrix
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* 1. Opus Engine */}
            <div className="bg-slate-900/50 border border-white/5 p-5 rounded-2xl space-y-3">
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
                Launch Opus <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* 2. AI Options Coach (RAG Gate) */}
            <div className="bg-slate-900/50 border border-white/5 p-5 rounded-2xl space-y-3">
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
                  ? 'Access granted by Keith. You can use full RAG trade coaching.' 
                  : 'Proprietary knowledge base. Access request is in review.'}
              </p>
              <a href="https://coach.mytradingtoolbox.com" target="_blank" rel="noreferrer" className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1">
                Launch AI Coach <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* 3. Alerts Engine */}
            <div className="bg-slate-900/50 border border-white/5 p-5 rounded-2xl space-y-3">
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
            <div className="bg-slate-900/50 border border-white/5 p-5 rounded-2xl space-y-3">
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
            <div className="bg-slate-900/50 border border-white/5 p-5 rounded-2xl space-y-3">
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
            <div className="bg-slate-900/50 border border-white/5 p-5 rounded-2xl space-y-3">
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
