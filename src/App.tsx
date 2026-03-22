import { motion, type Variants } from 'framer-motion';
import { LayoutDashboard, Wallet, TrendingUp, Newspaper } from 'lucide-react';
import ToolCard from './components/ToolCard';
import './App.css';

function App() {
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
    <div className="min-h-screen bg-[#02040c] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Dynamic Background Effects */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[60%] h-[20%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-2xl bg-slate-900/30 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-[0_0_50px_rgba(37,99,235,0.05)] z-10"
      >
        <div className="text-center mb-8 flex flex-col items-center">
          {/* Animated Tech Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-xs font-semibold text-blue-300 tracking-widest uppercase shadow-[0_0_15px_rgba(59,130,246,0.15)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            V1.0 System Online
          </motion.div>

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-20 h-20 mb-5 flex items-center justify-center rounded-[1.5rem] shadow-[0_0_30px_rgba(59,130,246,0.3)] bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 overflow-hidden relative group"
          >
            {/* Inner Glow Hover Effect */}
            <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-screen" />
            <img src="/logo.png" alt="My Trading Toolbox Logo" className="w-full h-full object-cover mix-blend-screen opacity-90 transition-transform duration-500 group-hover:scale-110" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
            className="text-4xl md:text-5xl lg:text-6xl font-black font-outfit text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-white to-blue-200 tracking-tight drop-shadow-[0_0_20px_rgba(59,130,246,0.4)] animate-shimmer"
            style={{ backgroundSize: '200% auto' }}
          >
            My Trading Toolbox
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400/90 mt-3 text-base max-w-md mx-auto leading-relaxed"
          >
            The Trading Toolbox is committed to building the tools income traders need to stay informed about trends, manage risk, and maximize the potential of your portfolio.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-3"
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
              title="Market Insights"
              description="Derivative analysis generating implied expected moves via ATM Straddles."
              icon={TrendingUp}
              isComingSoon={true}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <ToolCard 
              title="Daily Market Update"
              description="Earnings, economic events, and fear/greed barometer dashboard."
              icon={Newspaper}
              isComingSoon={true}
            />
          </motion.div>
        </motion.div>

      </motion.div>
      
      <p className="mt-8 text-slate-500 text-sm font-medium tracking-wide z-10">
        &copy; {new Date().getFullYear()} My Trading Toolbox. All rights reserved.
      </p>

    </div>
  );
}

export default App;
