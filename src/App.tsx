import { LayoutDashboard, Wallet, TrendingUp, Bell, Target, BarChart3 } from 'lucide-react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { useEffect } from 'react';
import ToolCard from './components/ToolCard';
import PrivacyPolicy from './components/PrivacyPolicy';
import LeadCapture from './components/LeadCapture';
import AdminDashboard from './components/AdminDashboard';
import PartnerCard from './components/PartnerCard';
import './App.css';

const PARTNERS = [
  {
    name: 'Tradier',
    description: 'A powerful, low-cost brokerage built for developers and active options traders.',
    url: 'https://trade.tradier.com/raf-open/?mwr=keith-a847',
    icon: BarChart3,
    badge: 'Brokerage'
  },
  {
    name: 'Finviz',
    description: 'Professional-grade stock screener and visualizations for advanced market analysis.',
    url: 'https://finviz.com/?affilId=78883761',
    icon: TrendingUp,
    badge: 'Analysis'
  },
  {
    name: 'OptionsAnimal',
    description: 'Expert-led options education and trading mentorship to take your skills to the next level.',
    url: 'https://www.optionsanimal.com/referrals/',
    icon: Target,
    badge: 'Education'
  }
];

const Home = () => {
  useEffect(() => {
    document.title = 'My Trading Toolbox';
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[#02040c] flex flex-col items-center py-12 px-4 md:px-6 relative overflow-x-hidden transition-all duration-500">
      
      {/* Dynamic Background Effects */}
      <div className="fixed top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-[40%] left-[50%] -translate-x-1/2 w-[60%] h-[20%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-4xl z-10 space-y-8"
      >
        {/* Hero Section */}
        <div className="bg-slate-900/30 backdrop-blur-2xl border border-white/10 rounded-[1.75rem] p-6 md:p-8 shadow-[0_0_50px_rgba(37,99,235,0.05)]">
          <div className="text-center mb-8 flex flex-col items-center">
            {/* Animated Tech Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-xs font-semibold text-blue-300 tracking-widest uppercase shadow-[0_0_15px_rgba(59,130,246,0.15)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              V1.0 System Online
            </motion.div>

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
              className="text-slate-400/90 mt-4 text-base md:text-lg max-w-xl mx-auto leading-relaxed"
            >
              The Trading Toolbox is committed to building the tools income traders need to stay informed about trends, manage risk, and maximize the potential of your portfolio.
            </motion.p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
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
                title="Market Insights"
                description="Derivative analysis generating implied expected moves via ATM Straddles."
                icon={TrendingUp}
                isComingSoon={true}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Partners Section */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.1, duration: 0.8 }}
           className="space-y-6"
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
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.5, duration: 0.8 }}
           className="relative"
        >
          <div className="absolute inset-0 bg-blue-600/5 blur-3xl -z-10" />
          <LeadCapture />
        </motion.div>

      </motion.div>

      <footer className="mt-12 flex flex-col items-center gap-4 z-10">
        <div className="flex gap-6">
          <Link 
            to="/privacy" 
            className="text-slate-500 hover:text-blue-400 text-xs font-semibold uppercase tracking-widest transition-all duration-300"
          >
            Privacy Policy
          </Link>
          <Link 
            to="/admin" 
            className="text-slate-500 hover:text-blue-400 text-xs font-semibold uppercase tracking-widest transition-all duration-300"
          >
            Admin
          </Link>
        </div>
        <p className="text-slate-600 text-xs font-medium tracking-wide">
          &copy; {new Date().getFullYear()} My Trading Toolbox. All rights reserved.
        </p>
      </footer>

    </div>
  );
};

function App() {
  // Identification & Heartbeat tracking
  useEffect(() => {
    const email = localStorage.getItem('lead_email');
    if (email) {
      // Send a heartbeat to update last_accessed
      fetch('/api/leads/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      }).catch(err => console.debug('Heartbeat failed', err));
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

