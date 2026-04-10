import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BarChart3, 
  CheckCircle2, 
  Calendar, 
  Mail, 
  ShieldAlert, 
  TrendingUp,
  RefreshCw,
  LogOut
} from 'lucide-react';

interface Lead {
  id: number;
  email: string;
  preferences: string[];
  visit_count: number;
  last_accessed: string;
  last_promotional_contact: string | null;
  created_at: string;
}

interface Stats {
  totalLeads: number;
  toolStats: { tool: string; count: string }[];
}

const AdminDashboard: React.FC = () => {
  const [password, setPassword] = useState(sessionStorage.getItem('admin_pass') || '');
  const [isAuthorized, setIsAuthorized] = useState(false);
  // Mock In-Memory DB
  const [leads, setLeads] = useState<Lead[]>([
    { 
      id: 1, 
      email: 'demo@mytradingtoolbox.com', 
      preferences: ['opus-analysis', 'opus-alerts'], 
      visit_count: 5, 
      last_accessed: new Date().toISOString(), 
      created_at: new Date(Date.now() - 86400000).toISOString(),
      last_promotional_contact: null 
    },
    { 
      id: 2, 
      email: 'tester@example.com', 
      preferences: ['cashmap'], 
      visit_count: 2, 
      last_accessed: new Date(Date.now() - 3600000).toISOString(), 
      created_at: new Date(Date.now() - 172800000).toISOString(),
      last_promotional_contact: new Date().toISOString() 
    }
  ]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async (pw: string) => {
    setLoading(true);
    setError('');
    try {
      const [leadsRes, statsRes] = await Promise.all([
        fetch('/api/admin/leads', { headers: { 'x-admin-password': pw } }),
        fetch('/api/admin/stats', { headers: { 'x-admin-password': pw } })
      ]);

      if (leadsRes.status === 401) {
        setError('Invalid password');
        setIsAuthorized(false);
        return;
      }

      if (!leadsRes.ok || !statsRes.ok) {
        throw new Error('Server returned an error');
      }

      const leadsData = await leadsRes.json();
      const statsData = await statsRes.json();

      setLeads(Array.isArray(leadsData) ? leadsData : []);
      setStats(statsData);
      setIsAuthorized(true);
      sessionStorage.setItem('admin_pass', pw);
    } catch (err) {
      setError('Connection failed');
      setLeads([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'My Trading Toolbox-Admin';
    if (password) {
      fetchData(password);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(password);
  };

  const handleMarkContacted = async (email: string) => {
    try {
      const res = await fetch('/api/admin/mark-contacted', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-password': password
        },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        fetchData(password); // Refresh
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#02040c] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4">
              <ShieldAlert className="text-blue-400 w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white">Admin Access</h1>
            <p className="text-slate-500 text-sm mt-1">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Access Password"
                className="w-full bg-slate-950/50 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            {error && <p className="text-red-400 text-xs font-semibold">{error}</p>}
            <button 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="animate-spin w-5 h-5" /> : 'Enter Dashboard'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02040c] text-white p-4 md:p-8 font-outfit">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-blue-400 tracking-tight">Tools Admin</h1>
            <p className="text-slate-500">Managing potential users and tool interest</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => fetchData(password)}
              className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-white/5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button 
              onClick={() => {
                sessionStorage.removeItem('admin_pass');
                setIsAuthorized(false);
              } }
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-blue-500/20 rounded-2xl">
                <Users className="text-blue-400 w-6 h-6" />
              </div>
              <span className="text-slate-400 font-semibold tracking-wider text-xs uppercase">Total Interested</span>
            </div>
            <div className="text-4xl font-black">{stats?.totalLeads || 0}</div>
            <div className="text-xs text-blue-400 mt-2 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3 h-3" /> Growth tracking active
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl overflow-hidden">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-indigo-500/20 rounded-2xl">
                <BarChart3 className="text-indigo-400 w-6 h-6" />
              </div>
              <span className="text-slate-400 font-semibold tracking-wider text-xs uppercase">Popular Tools</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {stats?.toolStats.map((tool, idx) => (
                <div key={idx} className="bg-white/5 border border-white/5 px-4 py-3 rounded-2xl flex flex-col">
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{tool.tool}</span>
                  <span className="text-xl font-black text-indigo-200">{tool.count}</span>
                </div>
              ))}
              {(!stats || stats.toolStats.length === 0) && <p className="text-slate-600 italic py-2">No selections yet</p>}
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">User / Email</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Preferences</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Visits</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Last Active</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center font-bold text-slate-400">
                          {lead.email[0].toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-200">{lead.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1">
                        {lead.preferences.map((pref, i) => (
                          <span key={i} className="text-[10px] font-bold bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/20">
                            {pref}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-slate-400 font-medium">{lead.visit_count}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-300 font-medium">{new Date(lead.last_accessed).toLocaleDateString()}</span>
                        <span className="text-[10px] text-slate-500">{new Date(lead.last_accessed).toLocaleTimeString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {lead.last_promotional_contact ? (
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Contacted {new Date(lead.last_promotional_contact).toLocaleDateString()}
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleMarkContacted(lead.email)}
                          className="flex items-center gap-2 text-blue-400 hover:text-white hover:bg-blue-600 transition-all text-xs font-bold bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20"
                        >
                          <Mail className="w-3.5 h-3.5" /> Mark Contacted
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {leads.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center opacity-40">
                <Calendar className="w-12 h-12 mb-4" />
                <p>No leads found in database</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
