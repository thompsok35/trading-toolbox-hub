import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  Sparkles, 
  Activity, 
  Play, 
  Sliders, 
  RotateCcw, 
  BookOpen, 
  ArrowLeft,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ItmBotLanding: React.FC = () => {
  // Simulator State
  const [lots, setLots] = useState(2);
  const [testPrice, setTestPrice] = useState(34.06);
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [riskStep, setRiskStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedPathway, setSelectedPathway] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [targetSupport, setTargetSupport] = useState(24.00);
  const [additionalLots, setAdditionalLots] = useState(1);

  // Waitlist form state
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Calculations for Candidate Match (UMAC sample)
  const spotPrice = 34.06;
  const strike = 26.50;
  const netDebitPerShare = 25.36;
  const premiumCollectedPerShare = spotPrice - netDebitPerShare; // 8.70
  const maxProfitPerShare = strike - netDebitPerShare; // 1.14
  const shares = lots * 100;
  const netDebitCapital = shares * netDebitPerShare; // 5072.00
  const expectedProfit = shares * maxProfitPerShare; // 228.00
  const downsideBufferPct = ((spotPrice - netDebitPerShare) / spotPrice * 100).toFixed(1); // 25.5%

  // DCA calculations
  const reserveCapitalNeeded = additionalLots * 100 * targetSupport;
  const newTotalShares = shares + (additionalLots * 100);
  const newBlendedBasis = ((netDebitCapital + reserveCapitalNeeded) / newTotalShares).toFixed(2);
  const newDownsideBuffer = ((spotPrice - parseFloat(newBlendedBasis)) / spotPrice * 100).toFixed(1);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, preferences: ['itm-covered-call-bot'] })
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#02040c] text-white font-outfit relative selection:bg-blue-500 selection:text-white">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/10 to-teal-500/10 blur-[150px] rounded-full" />
        <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-blue-500/10 blur-[130px] rounded-full" />
      </div>

      {/* Top Navigation */}
      <nav className="border-b border-white/5 bg-slate-950/40 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group text-slate-400 hover:text-white transition-colors">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">Hub Overview</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm text-white tracking-tight">ITM Covered Call Strategy BOT</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Beta Access
              </span>
            </div>
          </div>

          <a 
            href="#try-bot"
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20"
          >
            Get Access
          </a>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20 space-y-24">
        
        {/* HERO SECTION */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold tracking-wide"
          >
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Think Risk First, Then Reward &bull; 100% Paper Trading Included</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-300 tracking-tight leading-tight"
          >
            Generate Steady Stock Income with Zero Guesswork.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
          >
            The semi-automated <strong>ITM Covered Call Strategy BOT</strong> walks beginners through deep downside buffer calculations, capital reserves, and step-by-step recovery plans before opening a trade.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <a 
              href="#interactive-demo"
              className="px-6 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white rounded-2xl text-sm font-bold transition-all shadow-xl shadow-blue-600/30 flex items-center gap-2 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" /> Explore Interactive BOT Demo
            </a>
            <button 
              onClick={() => setIsRiskModalOpen(true)}
              className="px-6 py-3.5 bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-200 rounded-2xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4 text-teal-400" /> View 4-Step Risk Protocol
            </button>
          </motion.div>
        </section>

        {/* 3 PILLARS / HIGHLIGHTS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl space-y-3 hover:border-blue-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">1. Think Risk First</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Every position features a massive <strong>+20% to +35% downside safety buffer</strong>. Your profit is protected even if the stock drops moderately.
            </p>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl space-y-3 hover:border-teal-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">2. Trade Continuity Protocol</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Never panic on expiration day. The BOT pre-programs 4 recovery pathways (Roll for Cash Flow, DCA at Support, Adapt, or Defensive Exit).
            </p>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl space-y-3 hover:border-indigo-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">3. Risk-Free Paper Trading</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Practice in simulated mode with live market data for as long as you need to build total emotional control and execution mastery.
            </p>
          </div>
        </section>

        {/* INTERACTIVE DEMO COMPONENT (EXACT UI FROM SCREENSHOTS) */}
        <section id="interactive-demo" className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-full">
              Live Interactive UI Showcase
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">
              Test-Drive the BOT Candidate Engine
            </h2>
            <p className="text-slate-400 text-xs max-w-xl mx-auto">
              Simulate position sizing, explore downside protection buffers, and test expiration payoff curves in real time.
            </p>
          </div>

          {/* CANDIDATE MATCH CARD */}
          <div className="bg-slate-900/70 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
            {/* Top Match Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/5">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    Optimal Candidate Match
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-white">
                    UMAC $26.50 Call (12 DTE)
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>Spot Price: <strong className="text-white">${spotPrice}</strong></span>
                  <span>&bull;</span>
                  <span>Net Debit (AskSkew): <strong className="text-teal-300 font-bold">${netDebitPerShare} / share</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsRiskModalOpen(true)}
                  className="px-4 py-2 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" /> Risk Plan Protocol
                </button>
              </div>
            </div>

            {/* Lot Size Simulator Bar */}
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white uppercase text-[11px] tracking-wider">Interactive Lot Size Simulator & Yield Calculator</div>
                  <div className="text-slate-500 text-[11px]">Model total capital investment vs expected expiration profit.</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 5, 10].map(n => (
                  <button
                    key={n}
                    onClick={() => setLots(n)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      lots === n
                        ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                        : 'bg-slate-900 border border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {n}L
                  </button>
                ))}
              </div>
            </div>

            {/* 4 KPI Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5">
                <div className="text-slate-500 text-xs font-medium">Downside Buffer %</div>
                <div className="text-2xl font-black text-cyan-400 mt-1">+{downsideBufferPct}%</div>
                <div className="text-[10px] text-slate-500 mt-1">Cushion against stock decline</div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5">
                <div className="text-slate-500 text-xs font-medium">ITM Exp Probability</div>
                <div className="text-2xl font-black text-blue-400 mt-1">86.4%</div>
                <div className="text-[10px] text-slate-500 mt-1">1 - Δ_Call probability</div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5">
                <div className="text-slate-500 text-xs font-medium">Annualized ROC %</div>
                <div className="text-2xl font-black text-indigo-300 mt-1">+136.7%</div>
                <div className="text-[10px] text-slate-500 mt-1">+4.5% Static Return (12d)</div>
              </div>

              <div className="bg-gradient-to-br from-teal-950/40 to-slate-950/60 p-4 rounded-2xl border border-teal-500/30">
                <div className="text-teal-300 text-xs font-medium flex justify-between">
                  <span>Expected Expiration P&L</span>
                  <span className="text-[9px] bg-teal-500/20 px-1.5 rounded">{lots} Lots</span>
                </div>
                <div className="text-2xl font-black text-teal-300 mt-1">+${expectedProfit.toFixed(2)}</div>
                <div className="text-[10px] text-slate-400 mt-1">Capital: ${netDebitCapital.toLocaleString()}</div>
              </div>
            </div>

            {/* Dual Column: AI Reasoning + Expiration Risk Curve */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* AI Options Coach Reasoning */}
              <div className="bg-slate-950/60 p-5 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-cyan-400" /> Google Gemini AI Options Coach Reasoning
                </div>
                <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">&bull;</span>
                    <span><strong>Downside Protection:</strong> {downsideBufferPct}% cushion provides strong safety against market pullbacks.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">&bull;</span>
                    <span><strong>Probability of Success:</strong> 86.4% ITM probability exceeds the 75% high-conviction threshold.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">&bull;</span>
                    <span><strong>Yield Evaluation:</strong> 136.7% Annualized ROC satisfies optimal income compounding criteria.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">&bull;</span>
                    <span><strong>Recommendation:</strong> High-probability Buy-Write trade setup with low time-decay risk.</span>
                  </li>
                </ul>
              </div>

              {/* Payoff Profile Simulator */}
              <div className="bg-slate-950/60 p-5 rounded-2xl border border-white/5 space-y-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-teal-400" /> Expiration Risk & Payoff Profile
                  </span>
                  <span className="text-teal-400 font-mono">+{downsideBufferPct}% BUFFER</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Simulated Expiration Stock Price:</span>
                    <strong className="text-cyan-300 text-xs">${testPrice.toFixed(2)}</strong>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="45"
                    step="0.5"
                    value={testPrice}
                    onChange={(e) => setTestPrice(parseFloat(e.target.value))}
                    className="w-full accent-teal-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>$20.00 (-41%)</span>
                    <span>B/E: ${netDebitPerShare}</span>
                    <span>Strike: ${strike}</span>
                    <span>$45.00 (+32%)</span>
                  </div>
                </div>

                <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                  testPrice >= strike 
                    ? 'bg-teal-500/10 border-teal-500/30 text-teal-300' 
                    : testPrice >= netDebitPerShare 
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}>
                  <div>
                    <span className="font-bold block">
                      {testPrice >= strike ? 'MAX PROFIT (Called Away)' : testPrice >= netDebitPerShare ? 'PROFITABLE (Hold Shares)' : 'BUFFER BREACH (Execute Protocol)'}
                    </span>
                    <span className="text-[10px] opacity-80">
                      {testPrice >= strike ? `+$${expectedProfit.toFixed(2)} realized profit (+4.5% static)` : testPrice >= netDebitPerShare ? `Keep shares at net basis $${netDebitPerShare}` : 'Execute DCA or Roll pathway'}
                    </span>
                  </div>
                  <strong className="text-sm">
                    {testPrice >= strike ? `+$${expectedProfit.toFixed(2)}` : testPrice >= netDebitPerShare ? `+$${((testPrice - netDebitPerShare) * shares).toFixed(2)}` : `-$${((netDebitPerShare - testPrice) * shares).toFixed(2)}`}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4-STEP PROTOCOL OVERVIEW SECTION */}
        <section className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 md:p-12 rounded-3xl space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
              Emotions Under Control
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">
              The 4-Step Trade Continuity Protocol
            </h2>
            <p className="text-slate-400 text-xs md:text-sm">
              Professional traders never enter a position without knowing their exact recovery steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-white/5 space-y-2">
              <span className="text-cyan-400 font-black text-sm">STEP 01</span>
              <h4 className="font-bold text-white text-sm">The Golden Rule</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Collect immediate guaranteed premium upfront to reduce your net cost basis on day 1.
              </p>
            </div>

            <div className="bg-slate-950/80 p-5 rounded-2xl border border-white/5 space-y-2">
              <span className="text-indigo-400 font-black text-sm">STEP 02</span>
              <h4 className="font-bold text-white text-sm">Recovery Pathway</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Choose ahead of time whether to roll into next cycle call, DCA at support, or adapt parameters.
              </p>
            </div>

            <div className="bg-slate-950/80 p-5 rounded-2xl border border-white/5 space-y-2">
              <span className="text-teal-400 font-black text-sm">STEP 03</span>
              <h4 className="font-bold text-white text-sm">Capital Planning</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Calculate reserve cash required to buy support lots and lower your blended breakeven.
              </p>
            </div>

            <div className="bg-slate-950/80 p-5 rounded-2xl border border-white/5 space-y-2">
              <span className="text-amber-400 font-black text-sm">STEP 04</span>
              <h4 className="font-bold text-white text-sm">Action Protocol</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Commit your risk plan to the BOT. Real-time alerts notify you exactly when and how to execute.
              </p>
            </div>
          </div>
        </section>

        {/* WAITLIST & SIGNUP CTA */}
        <section id="try-bot" className="relative text-center space-y-6 max-w-2xl mx-auto pt-6">
          <div className="absolute inset-0 bg-blue-600/10 blur-3xl -z-10 rounded-full" />
          
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Ready to Master ITM Covered Calls?
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Join the early access cohort. Test your setups in 100% paper trading mode or schedule a 1-on-1 walkthrough.
          </p>

          <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email for early access..."
              className="flex-1 bg-slate-950/90 border border-white/15 rounded-2xl px-4 py-3.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading || submitted}
              className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white rounded-2xl text-xs font-bold transition-all shadow-lg shadow-blue-500/25 shrink-0 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Submitting...' : submitted ? 'You\'re on the list! 🎉' : 'Get Access Now'}
            </button>
          </form>

          {submitted && (
            <p className="text-xs text-teal-300 font-semibold">
              ✓ Thanks! You will receive early access invitations and strategy teardowns directly in your inbox.
            </p>
          )}
        </section>

      </div>

      {/* ========================================================================= */}
      {/* 4-STEP PROTOCOL MODAL (EXACT WORKFLOW FROM USER SCREENSHOTS) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isRiskModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/15 rounded-3xl p-6 md:p-8 max-w-3xl w-full shadow-2xl relative max-h-[92vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsRiskModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-teal-500/20 rounded-xl text-teal-400 border border-teal-500/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">Risk Management & Trade Continuity Protocol</h2>
                    <span className="text-[10px] bg-slate-800 text-cyan-300 font-mono px-2 py-0.5 rounded border border-white/10">
                      UMAC $26.50 Call (12d)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Plan ahead with 100% confidence. Establish clear, non-panicked recovery rules before opening the trade.</p>
                </div>
              </div>

              {/* 4 Step Navigation Tabs */}
              <div className="grid grid-cols-4 gap-2 mb-6 text-left">
                {[
                  { step: 1, title: '1. The Golden Rule', sub: 'Guaranteed Premium' },
                  { step: 2, title: '2. Recovery Pathway', sub: 'If Unassigned' },
                  { step: 3, title: '3. Capital Planning', sub: 'Support & DCA' },
                  { step: 4, title: '4. Action Protocol', sub: 'Final Plan' }
                ].map(s => (
                  <button
                    key={s.step}
                    onClick={() => setRiskStep(s.step as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      riskStep === s.step
                        ? 'bg-cyan-500/20 border-cyan-500/40 text-white'
                        : 'bg-slate-950 border-white/5 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <div className="text-[11px] font-bold truncate">{s.title}</div>
                    <div className="text-[9px] opacity-70 truncate">{s.sub}</div>
                  </button>
                ))}
              </div>

              {/* STEP 1: THE GOLDEN RULE */}
              {riskStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Step 1: The Golden Rule of ITM Options</h3>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-3 text-xs text-slate-300 leading-relaxed">
                    <p>
                      <strong>Guaranteed Premium Buffer:</strong> By selling the in-the-money $26.50 call against stock at $34.06, you collect <span className="text-teal-300 font-bold">${premiumCollectedPerShare.toFixed(2)}/sh</span> upfront.
                    </p>
                    <p>
                      This immediate cash lowers your net breakeven cost to <span className="text-cyan-300 font-bold">${netDebitPerShare}/share</span>, giving you a <strong>+{downsideBufferPct}% safety cushion</strong> against any stock pullback.
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setRiskStep(2)}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Next: Recovery Pathways &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: RECOVERY PATHWAYS (EXACT PATHWAYS FROM SCREENSHOT 3) */}
              {riskStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Choose Preferred Recovery Pathway</h3>
                  <p className="text-xs text-slate-400">If the stock finishes below $26.50 at expiration and is not called away, which path will you take?</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Pathway A */}
                    <div
                      onClick={() => setSelectedPathway('A')}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        selectedPathway === 'A'
                          ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                          : 'bg-slate-950 border-white/5 text-slate-400 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-cyan-400 uppercase">Pathway A: Roll & Sell Next Cycle Call</span>
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${selectedPathway === 'A' ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600'}`} />
                      </div>
                      <div className="font-bold text-xs text-white">Seamless Cash-Flow Continuity</div>
                      <p className="text-[11px] text-slate-400">Sell another short call against your 200 shares on the next cycle (7-13 DTE) collecting additional premium to further reduce cost basis.</p>
                      <div className="text-[10px] text-teal-400 font-semibold">✓ Recommended for steady dividend/income compounding</div>
                    </div>

                    {/* Pathway B */}
                    <div
                      onClick={() => setSelectedPathway('B')}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        selectedPathway === 'B'
                          ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                          : 'bg-slate-950 border-white/5 text-slate-400 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-emerald-400 uppercase">Pathway B: Lower Cost Basis (DCA at Support)</span>
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${selectedPathway === 'B' ? 'border-emerald-400 bg-emerald-400' : 'border-slate-600'}`} />
                      </div>
                      <div className="font-bold text-xs text-white">Buy Additional Lot at Technical Low</div>
                      <p className="text-[11px] text-slate-400">If the stock drops to key support, buy 100 more shares to drastically reduce blended cost basis, and sell 2+ covered calls in subsequent cycles.</p>
                      <div className="text-[10px] text-emerald-400 font-semibold">✓ Ideal if you have reserve cash to accelerate recovery</div>
                    </div>

                    {/* Pathway C */}
                    <div
                      onClick={() => setSelectedPathway('C')}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        selectedPathway === 'C'
                          ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                          : 'bg-slate-950 border-white/5 text-slate-400 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-400 uppercase">Pathway C: Adapt Strategy Parameters</span>
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${selectedPathway === 'C' ? 'border-amber-400 bg-amber-400' : 'border-slate-600'}`} />
                      </div>
                      <div className="font-bold text-xs text-white">Lower Min ROC or Extend DTE</div>
                      <p className="text-[11px] text-slate-400">Temporarily extend DTE out to 21-30 days to sell deeper in-the-money calls with massive downside protection.</p>
                      <div className="text-[10px] text-amber-400 font-semibold">✓ Great for high-volatility sideways tickers</div>
                    </div>

                    {/* Pathway D */}
                    <div
                      onClick={() => setSelectedPathway('D')}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        selectedPathway === 'D'
                          ? 'bg-rose-500/10 border-rose-500 text-white shadow-lg shadow-rose-500/10'
                          : 'bg-slate-950 border-white/5 text-slate-400 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-rose-400 uppercase">Pathway D: Defensive Contingency Exit</span>
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${selectedPathway === 'D' ? 'border-rose-400 bg-rose-400' : 'border-slate-600'}`} />
                      </div>
                      <div className="font-bold text-xs text-white">Automated Buffer Breach Exit</div>
                      <p className="text-[11px] text-slate-400">Configure the bot to trigger an alert or close order if the downside buffer breaches 2%.</p>
                      <div className="text-[10px] text-rose-400 font-semibold">✓ Strict capital preservation for risk-intolerant accounts</div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      onClick={() => setRiskStep(1)}
                      className="px-4 py-2 text-slate-400 hover:text-white text-xs cursor-pointer"
                    >
                      &larr; Previous Step
                    </button>
                    <button
                      onClick={() => setRiskStep(3)}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Next: Capital Planning &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: CAPITAL PLANNING (EXACT SIMULATOR FROM SCREENSHOT 4) */}
              {riskStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Step 3: Capital Reserve & Cost Basis Reduction Simulator</h3>
                  
                  <div className="bg-slate-950 p-5 rounded-2xl border border-white/5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Target Support Price ($/share):</span>
                          <strong className="text-white">${targetSupport.toFixed(2)}</strong>
                        </div>
                        <input
                          type="range"
                          min="18"
                          max="30"
                          step="0.5"
                          value={targetSupport}
                          onChange={(e) => setTargetSupport(parseFloat(e.target.value))}
                          className="w-full accent-cyan-400 cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="text-xs text-slate-400 mb-1.5">Additional Lot Sizing:</div>
                        <div className="flex gap-2">
                          {[1, 2, 3].map(n => (
                            <button
                              key={n}
                              onClick={() => setAdditionalLots(n)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                additionalLots === n ? 'bg-cyan-500 text-black' : 'bg-slate-900 border border-white/10 text-slate-400'
                              }`}
                            >
                              +{n} Lot ({n * 100} shs)
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                        <div className="text-slate-500 text-[10px]">Reserve Capital Needed</div>
                        <div className="text-base font-bold text-cyan-300 mt-0.5">${reserveCapitalNeeded.toLocaleString()}</div>
                        <div className="text-[9px] text-slate-500">To buy {additionalLots * 100} shs @ ${targetSupport}</div>
                      </div>

                      <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                        <div className="text-slate-500 text-[10px]">New Total Shares</div>
                        <div className="text-base font-bold text-white mt-0.5">{newTotalShares} Shares</div>
                        <div className="text-[9px] text-slate-500">{newTotalShares / 100} Calls in Next Cycle</div>
                      </div>

                      <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                        <div className="text-slate-500 text-[10px]">New Blended Net Basis</div>
                        <div className="text-base font-bold text-teal-300 mt-0.5">${newBlendedBasis} / sh</div>
                        <div className="text-[9px] text-teal-400">-${(netDebitPerShare - parseFloat(newBlendedBasis)).toFixed(2)} lower cost basis!</div>
                      </div>

                      <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                        <div className="text-slate-500 text-[10px]">New Downside Buffer</div>
                        <div className="text-base font-bold text-cyan-300 mt-0.5">+{newDownsideBuffer}%</div>
                        <div className="text-[9px] text-cyan-400">Enhanced safety cushion</div>
                      </div>
                    </div>

                    <div className="bg-teal-500/10 border border-teal-500/20 p-3 rounded-xl text-xs text-teal-300 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                      <span><strong>Peace of Mind Protocol:</strong> By reserving ${reserveCapitalNeeded.toLocaleString()}, a market dip is not a panic event — it is a planned opportunity to acquire more shares at a discount and reduce your overall breakeven to ${newBlendedBasis}.</span>
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      onClick={() => setRiskStep(2)}
                      className="px-4 py-2 text-slate-400 hover:text-white text-xs cursor-pointer"
                    >
                      &larr; Previous Step
                    </button>
                    <button
                      onClick={() => setRiskStep(4)}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Next: Final Action Protocol &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: ACTION PROTOCOL (EXACT PROTOCOL REVIEW FROM SCREENSHOT 5) */}
              {riskStep === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Trade Risk Management & Contingency Protocol</h3>
                    <span className="text-[10px] bg-teal-500/20 text-teal-300 font-bold px-2 py-0.5 rounded border border-teal-500/30">
                      PROTOCOL READY
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-2 text-xs">
                      <div className="text-cyan-400 font-bold uppercase text-[10px]">Trade Entry Specifications</div>
                      <div className="flex justify-between text-slate-400"><span>Target Ticker:</span><strong className="text-white font-mono">UMAC</strong></div>
                      <div className="flex justify-between text-slate-400"><span>Position Sizing:</span><strong className="text-white">{lots} Lot(s) ({shares} shs + {lots} Calls)</strong></div>
                      <div className="flex justify-between text-slate-400"><span>Guaranteed Premium:</span><strong className="text-teal-300">+${(premiumCollectedPerShare * shares).toFixed(2)}</strong></div>
                      <div className="flex justify-between text-slate-400"><span>Net Debit Cost Basis:</span><strong className="text-white">${netDebitPerShare} / share</strong></div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-2 text-xs">
                      <div className="text-amber-400 font-bold uppercase text-[10px]">Selected Contingency Protocol</div>
                      <div className="flex justify-between text-slate-400"><span>Recovery Pathway:</span><strong className="text-amber-300">{selectedPathway === 'A' ? 'Roll & Sell Next Cycle Call' : selectedPathway === 'B' ? 'DCA at Support' : selectedPathway === 'C' ? 'Adapt Strategy' : 'Defensive Exit'}</strong></div>
                      <div className="flex justify-between text-slate-400"><span>Planned Support Price:</span><strong className="text-white">${targetSupport.toFixed(2)} / share</strong></div>
                      <div className="flex justify-between text-slate-400"><span>Recommended Reserve:</span><strong className="text-teal-300">${reserveCapitalNeeded.toLocaleString()}</strong></div>
                      <div className="flex justify-between text-slate-400"><span>Buffer Breach Alert:</span><strong className="text-cyan-300 font-mono">5% Threshold</strong></div>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/5 text-xs text-slate-300 space-y-1.5 leading-relaxed">
                    <div className="text-slate-400 font-bold uppercase text-[10px]">Execution & Monitoring Protocol:</div>
                    <p>&bull; <strong>If Spot &ge; $26.50 at expiration:</strong> Stock called away, realizing +${expectedProfit.toFixed(2)} (+4.5%). Reinvest into next high-conviction candidate.</p>
                    <p>&bull; <strong>If Spot &lt; $26.50 but &gt; ${netDebitPerShare}:</strong> Keep {shares} shares at net basis ${netDebitPerShare} and immediately execute Pathway: ROLL.</p>
                    <p>&bull; <strong>If Spot breaches downside buffer:</strong> Bot dispatches real-time email & dashboard alerts to notify you for execution of reserve capital deployment.</p>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      onClick={() => setRiskStep(3)}
                      className="px-4 py-2 text-slate-400 hover:text-white text-xs cursor-pointer"
                    >
                      &larr; Previous Step
                    </button>
                    <button
                      onClick={() => setIsRiskModalOpen(false)}
                      className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-teal-500/20 flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Save & Commit Risk Plan
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-600">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            &copy; {new Date().getFullYear()} MyTradingToolbox &bull; ITM Covered Call Strategy BOT.
          </div>
          <div className="flex gap-4">
            <Link to="/" className="hover:text-blue-400 transition-colors">Hub Home</Link>
            <Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
            <Link to="/admin" className="hover:text-blue-400 transition-colors">Admin CRM</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ItmBotLanding;
