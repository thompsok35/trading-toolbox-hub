import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  TrendingUp,
  Cpu, 
  Wallet, 
  Bell, 
  Activity, 
  Bot, 
  LayoutDashboard, 
  Shield, 
  Layers,
  Lock,
  UserCheck,
  ChevronRight,
  Menu,
  X,
  HeartHandshake
} from 'lucide-react';
import { motion } from 'framer-motion';
import ToolCard from './components/ToolCard';
import ItmBotLanding from './components/ItmBotLanding';
import CustomerPortal from './components/CustomerPortal';
import LeadCapture from './components/LeadCapture';
import PartnerCard from './components/PartnerCard';
import PrivacyPolicy from './components/PrivacyPolicy';
import AdminDashboard from './components/AdminDashboard';
import Unsubscribe from './components/Unsubscribe';

const PARTNERS = [
  {
    name: 'Tradier Brokerage',
    description: 'Direct market access and automated execution engine with flat-rate options pricing.',
    icon: TrendingUp,
    badge: 'Execution Partner',
    url: 'https://tradier.com'
  },
  {
    name: 'FinViz & Intrinsic Analytics',
    description: 'Deep fundamental screening, institutional ownership tracking, and automated DCF valuation models.',
    icon: Layers,
    badge: 'Data Feed',
    url: 'https://finviz.com'
  },
  {
    name: 'Enterprise Security',
    description: 'Bank-grade 256-bit encryption with isolated API keys and multi-factor authentication for portfolio safety.',
    icon: Shield,
    badge: 'Infrastructure'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const Home: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<{ email: string; name?: string; avatarUrl?: string } | null>(null);

  useEffect(() => {
    try {
      const rawData = localStorage.getItem('mtt_user_data');
      if (rawData) {
        const parsed = JSON.parse(rawData);
        if (parsed.user?.email) {
          setUserProfile({
            email: parsed.user.email,
            name: parsed.user.name,
            avatarUrl: parsed.user.avatarUrl
          });
        }
      } else {
        const email = localStorage.getItem('lead_email');
        if (email) {
          setUserProfile({ email });
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const scrollToTools = () => {
    document.getElementById('suite-tools')?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const scrollToPartners = () => {
    document.getElementById('partners')?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#02040c] text-white flex flex-col justify-between p-4 md:p-8 font-outfit relative selection:bg-blue-500 selection:text-white">
      {/* Background glow overlay */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/10 to-teal-500/10 blur-[140px] rounded-full" />
        <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full" />
      </div>

      {/* Top Header Navigation Bar */}
      <header className="sticky top-2 z-50 w-full max-w-5xl mx-auto mb-8 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between">
          
          {/* Logo & Hub Link */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 border border-blue-400/30 p-1 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(59,130,246,0.4)] group-hover:scale-105 transition-transform">
              <img src="/logo.png" alt="MTT Logo" className="w-full h-full object-cover mix-blend-screen" />
            </div>
            <span className="font-black text-sm md:text-base tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-white to-blue-200">
              My Trading Toolbox
            </span>
          </Link>

            {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <button 
              onClick={scrollToTools}
              className="hover:text-blue-400 transition-colors cursor-pointer"
            >
              7 Suite Apps
            </button>
            <button 
              onClick={scrollToPartners}
              className="hover:text-blue-400 transition-colors cursor-pointer"
            >
              Partners
            </button>
            <button 
              onClick={scrollToWaitlist}
              className="hover:text-blue-400 transition-colors cursor-pointer"
            >
              Join Waitlist
            </button>
          </nav>

          {/* Member Login Call-to-Action Button */}
          <div className="hidden md:flex items-center gap-3">
            {userProfile ? (
              <Link 
                to="/portal"
                className="group relative px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500/20 to-blue-500/20 hover:from-teal-500/30 hover:to-blue-500/30 border border-teal-500/40 text-teal-300 text-xs font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(20,184,166,0.25)]"
              >
                {userProfile.avatarUrl ? (
                  <img src={userProfile.avatarUrl} alt="Avatar" className="w-5 h-5 rounded-full object-cover border border-teal-400" />
                ) : (
                  <UserCheck className="w-4 h-4 text-teal-400" />
                )}
                <span>Member Portal</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ) : (
              <Link 
                to="/portal"
                className="group relative px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs md:text-sm font-bold flex items-center gap-2 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.4)] border border-blue-400/40 hover:scale-105"
              >
                <Lock className="w-3.5 h-3.5 text-blue-200" />
                <span>Member Login</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-white/10"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 mt-3 border-t border-white/10 flex flex-col gap-3">
            <button 
              onClick={scrollToTools}
              className="text-left py-1 text-xs font-semibold text-slate-300 hover:text-white"
            >
              7 Suite Apps
            </button>
            <button 
              onClick={scrollToPartners}
              className="text-left py-1 text-xs font-semibold text-slate-300 hover:text-white"
            >
              Partners
            </button>
            <button 
              onClick={scrollToWaitlist}
              className="text-left py-1 text-xs font-semibold text-slate-300 hover:text-white"
            >
              Join Waitlist
            </button>
            <Link 
              to="/portal"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{userProfile ? 'Member Portal (Logged In)' : 'Member Login'}</span>
            </Link>
          </div>
        )}
      </header>

      <div className="w-full max-w-5xl mx-auto z-10">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-16"
        >
          {/* Hero Section */}
          <div className="space-y-8">
            <div className="flex flex-col items-center text-center">
              
              {/* Badge Button with Smooth Scroll */}
              <motion.button 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={scrollToWaitlist}
                className="cursor-pointer group mb-6 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md text-blue-300 text-xs font-semibold tracking-wide flex items-center gap-2 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Join the Waitlist
                <TrendingUp className="w-3 h-3 opacity-50 group-hover:translate-x-0.5 transition-transform" />
              </motion.button>

              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="w-14 h-14 md:w-16 md:h-16 mb-6 flex items-center justify-center rounded-[1.25rem] shadow-[0_0_30px_rgba(59,130,246,0.3)] bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 overflow-hidden relative group"
              >
                <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-screen" />
                <img src="/logo.png" alt="My Trading Toolbox Logo" className="w-full h-full object-cover mix-blend-screen opacity-90 transition-transform duration-500 group-hover:scale-110" />
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                className="text-4xl md:text-5xl lg:text-6xl font-black font-outfit text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-white to-blue-200 tracking-tight drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]"
              >
                My Trading Toolbox
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-slate-400/90 mt-4 text-base md:text-lg max-w-xl mx-auto leading-relaxed text-center"
              >
                The Trading Toolbox is committed to building the tools income traders need to stay informed about trends, manage risk, and maximize the potential of your portfolio.
              </motion.p>
            </div>

            {/* 7 Suite Applications Grid */}
            <div id="suite-tools" className="pt-4 space-y-4">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> 7 Integrated Suite Applications
                </h2>
                <Link to="/portal" className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1">
                  Access Portal &rarr;
                </Link>
              </div>

              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <motion.div variants={itemVariants}>
                  <ToolCard 
                    title="Opus Analysis Engine"
                    description="Generate monthly income via Covered Calls, Spreads, and Buy-Writes. Analyze your complete P&L breakdown and monitor live cash allocation."
                    icon={LayoutDashboard}
                    url="https://opus.mytradingtoolbox.com"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <ToolCard 
                    title="CashMap Planner"
                    description="Integrated directly with Opus to automatically import expected option premiums and dividends into your monthly income and expense plan."
                    icon={Wallet}
                    url="https://cashmap.mytradingtoolbox.com"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <ToolCard 
                    title="Opus Alerting Engine"
                    description="Create SMS alerts based on Market Insights expected moves. Execute trade plans including covered calls and buy-writes directly from your alerts."
                    icon={Bell}
                    url="https://alerts.mytradingtoolbox.com/"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <ToolCard 
                    title="Opportunity Scanner & Stock Health Analysis"
                    description="Daily ingestion of all publicly traded stocks with health scores compared against S&P 500, Sector, and Industry peers. Create and share scanner lists across Opus applications."
                    icon={Activity}
                    url="https://dataservices.mytradingtoolbox.com/login"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <ToolCard 
                    title="Opus AI Options Coach"
                    description="AI agent with curated in-depth options strategy knowledge to help beginner and advanced options traders make better decisions about their next position."
                    icon={Bot}
                    url="https://coach.mytradingtoolbox.com/"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <ToolCard 
                    title="ITM Covered Call Strategy BOT"
                    description="Semi-automated strategy bot guiding traders through position risk analysis, capital management, and 100% risk-free paper trading for steady monthly stock income."
                    icon={Cpu}
                    url="/itm-covered-call-bot"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <ToolCard 
                    title="PayItForward"
                    description="Help parents and grandparents invite family members to contribute to a child's 529 or ROTH IRA savings account."
                    icon={HeartHandshake}
                    url="https://payitforward.mytradingtoolbox.com"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Partners Section */}
          <motion.div
            id="partners"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="space-y-6 pt-4"
          >
            <div className="flex flex-col items-center text-center px-4">
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Trusted Trading Partners</h2>
              <p className="text-slate-500 text-sm mt-2 max-w-md">We partner with industry leaders to provide you with the best trading ecosystem.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PARTNERS.map((partner, idx) => (
                <PartnerCard key={idx} {...partner} />
              ))}
            </div>
          </motion.div>

          {/* Lead Capture Section */}
          <motion.div
             id="waitlist"
             initial={{ opacity: 0, y: 40 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.5, duration: 0.8 }}
             className="relative pt-8"
          >
            <div className="absolute inset-0 bg-blue-600/5 blur-3xl -z-10" />
            <LeadCapture />
          </motion.div>

        </motion.div>
      </div>

      <footer className="mt-12 flex flex-col items-center gap-4 z-10">
        <div className="flex gap-6">
          <Link 
            to="/privacy" 
            className="text-slate-500 hover:text-blue-400 text-xs font-semibold uppercase tracking-widest transition-all duration-300"
          >
            Privacy Policy
          </Link>
          <Link 
            to="/portal" 
            className="text-slate-500 hover:text-teal-400 text-xs font-semibold uppercase tracking-widest transition-all duration-300"
          >
            Customer Portal
          </Link>
          <Link 
            to="/admin" 
            className="text-slate-500 hover:text-blue-400 text-xs font-semibold uppercase tracking-widest transition-all duration-300"
          >
            Admin CRM
          </Link>
        </div>
        <p className="text-slate-600 text-xs font-medium tracking-wide">
          &copy; {new Date().getFullYear()} My Trading Toolbox. All rights reserved.
        </p>
      </footer>

    </div>
  );
};

const PageTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_title: document.title
      });
    }
  }, [location]);

  return null;
};

function App() {
  // Identification & Heartbeat tracking
  useEffect(() => {
    const email = localStorage.getItem('lead_email');
    if (email) {
      fetch('/api/leads/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      }).catch(err => console.debug('Heartbeat failed', err));
    }
  }, []);

  return (
    <BrowserRouter>
      <PageTracker />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/unsubscribe" element={<Unsubscribe />} />
        <Route path="/itm-covered-call-bot" element={<ItmBotLanding />} />
        <Route path="/bot" element={<ItmBotLanding />} />
        <Route path="/portal" element={<CustomerPortal />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
