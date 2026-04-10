import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Check, Loader2 } from 'lucide-react';

const TOOLS = [
  { id: 'opus-analysis', name: 'Opus Analysis Engine' },
  { id: 'cashmap', name: 'CashMap Planner' },
  { id: 'opus-alerts', name: 'Opus Alerting Engine' },
  { id: 'market-insights', name: 'Market Insights' },
  { id: 'market-update', name: 'Daily Market Update' }
];

const FUTURE_TOOLS = [
  { id: 'backtester', name: 'Portfolio Backtester' },
  { id: 'risk-manager', name: 'Advanced Risk Manager' },
  { id: 'ai-copilot', name: 'AI Trading Co-pilot' }
];

const LeadCapture: React.FC = () => {
  const [email, setEmail] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const toggleTool = (id: string) => {
    setSelectedTools(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, preferences: selectedTools }),
      });

      if (!response.ok) throw new Error('Failed to submit');

      // Store in localStorage for identification/tracking
      localStorage.setItem('lead_email', email);
      
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-8 text-center"
      >
        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="text-blue-400 w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">You're on the list!</h3>
        <p className="text-slate-400 mb-4">We'll reach out as your selected tools become available.</p>
        <button 
          onClick={() => setStatus('idle')}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
        >
          Register another email
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Mail className="text-blue-400 w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Join the Waitlist</h2>
          <p className="text-xs text-slate-400">Select the tools you want early access to.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Email Address
          </label>
          <div className="relative">
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="trader@example.com"
              className="w-full bg-slate-950/50 border border-white/5 rounded-xl py-3 px-4 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-outfit"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Available & Upcoming Tools
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[...TOOLS, ...FUTURE_TOOLS].map(tool => (
              <button
                key={tool.id}
                type="button"
                onClick={() => toggleTool(tool.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                  selectedTools.includes(tool.id) 
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-200' 
                    : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                }`}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                  selectedTools.includes(tool.id)
                    ? 'bg-blue-500 border-blue-500'
                    : 'bg-slate-900/50 border-white/10'
                }`}>
                  {selectedTools.includes(tool.id) && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className="text-sm font-medium">{tool.name}</span>
              </button>
            ))}
          </div>
        </div>

        {status === 'error' && (
          <p className="text-red-400 text-xs font-medium bg-red-400/10 p-3 rounded-lg border border-red-400/20">
            Something went wrong. Please try again.
          </p>
        )}

        <button 
          disabled={status === 'loading'}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-[0_10px_30px_rgba(37,99,235,0.2)] transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Reserve My Spot'
          )}
        </button>
      </form>
    </div>
  );
};

export default LeadCapture;
