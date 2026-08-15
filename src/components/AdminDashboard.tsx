import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  CheckCircle2, 
  Mail, 
  ShieldAlert, 
  TrendingUp, 
  RefreshCw, 
  LogOut, 
  Plus, 
  Video, 
  Send, 
  Sparkles, 
  MessageSquare, 
  Search, 
  UserCheck, 
  Clock, 
  X, 
  ChevronDown, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface Note {
  id: string;
  date: string;
  text: string;
}

interface Lead {
  id: number;
  email: string;
  name?: string;
  status: 'lead' | 'intro_sent' | 'contacted' | 'demo_requested' | 'demo_scheduled' | 'customer' | 'unsubscribed' | 'inactive';
  source?: string;
  preferences: string[];
  notes?: Note[];
  visit_count: number;
  last_accessed: string;
  last_promotional_contact: string | null;
  unsubscribe_token?: string;
  is_unsubscribed?: boolean;
  unsubscribed_at?: string | null;
  created_at: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  description: string;
  defaultMeetUrl: string;
  body: string;
}

interface Stats {
  totalLeads: number;
  toolStats: { tool: string; count: string }[];
  statusStats?: { status: string; count: string }[];
}

const AVAILABLE_TOOLS = [
  { id: 'opus-analysis', name: 'Opus Analysis Engine' },
  { id: 'cashmap', name: 'CashMap Planner' },
  { id: 'opus-alerts', name: 'Opus Alerting Engine' },
  { id: 'opportunity-scanner', name: 'Opportunity Scanner & Stock Health' },
  { id: 'opus-ai-coach', name: 'Opus AI Options Coach' },
  { id: 'market-insights', name: 'Market Insights' },
  { id: 'market-update', name: 'Daily Market Update' }
];

const DISCOVERY_SOURCES = [
  { id: 'referral', label: 'Friend / Word of Mouth' },
  { id: 'trading_group', label: 'Discord / Trading Community' },
  { id: 'twitter_x', label: 'Twitter / X' },
  { id: 'youtube', label: 'YouTube / Video' },
  { id: 'reddit', label: 'Reddit / Options Subreddit' },
  { id: 'google_search', label: 'Google Search' },
  { id: 'manual_admin', label: 'Direct Outreach' },
  { id: 'waitlist', label: 'Website Waitlist' }
];

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  lead: { label: 'New Lead', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  intro_sent: { label: 'Intro Sent 💬', bg: 'bg-teal-500/10', text: 'text-teal-300', border: 'border-teal-500/20' },
  contacted: { label: 'Contacted', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  demo_requested: { label: 'Demo Requested', bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  demo_scheduled: { label: 'Demo Scheduled 📹', bg: 'bg-indigo-500/10', text: 'text-indigo-300', border: 'border-indigo-500/20' },
  customer: { label: 'Active Customer 🚀', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  unsubscribed: { label: 'Unsubscribed', bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
  inactive: { label: 'Inactive', bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' }
};

const AdminDashboard: React.FC = () => {
  const [password, setPassword] = useState(sessionStorage.getItem('admin_pass') || '');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'campaigns' | 'templates'>('pipeline');
  
  // CRM Data State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [selectedToolFilter, setSelectedToolFilter] = useState('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Lead | null>(null);

  // Add Contact Form State
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactStatus, setNewContactStatus] = useState<Lead['status']>('lead');
  const [newContactSource, setNewContactSource] = useState('referral');
  const [newContactPrefs, setNewContactPrefs] = useState<string[]>([]);
  const [newContactNote, setNewContactNote] = useState('');
  const [addContactLoading, setAddContactLoading] = useState(false);

  // Email Composer State
  const [emailTemplateId, setEmailTemplateId] = useState('welcome_introduction');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailCustomBody, setEmailCustomBody] = useState('');
  const [emailGoogleMeetUrl, setEmailGoogleMeetUrl] = useState(
    localStorage.getItem('saved_meet_url') || 'https://meet.google.com/new'
  );
  const [emailSending, setEmailSending] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Broadcast Campaign State
  const [broadcastTemplateId, setBroadcastTemplateId] = useState('welcome_introduction');
  const [broadcastTargetStatus, setBroadcastTargetStatus] = useState('all');
  const [broadcastTargetTool, setBroadcastTargetTool] = useState('all');
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<string | null>(null);

  // Notes Modal State
  const [newNoteText, setNewNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  const fetchData = async (pw: string) => {
    setLoading(true);
    setError('');
    try {
      const [leadsRes, statsRes, templatesRes] = await Promise.all([
        fetch('/api/v1/contacts', { headers: { 'x-admin-password': pw } }),
        fetch('/api/v1/analytics/stats', { headers: { 'x-admin-password': pw } }),
        fetch('/api/v1/campaigns/templates', { headers: { 'x-admin-password': pw } })
      ]);

      if (leadsRes.status === 401) {
        setError('Invalid admin password');
        setIsAuthorized(false);
        return;
      }

      if (!leadsRes.ok || !statsRes.ok) {
        throw new Error('Server returned an error');
      }

      const leadsData = await leadsRes.json();
      const statsData = await statsRes.json();
      const templatesData = templatesRes.ok ? await templatesRes.json() : [];

      setLeads(Array.isArray(leadsData) ? leadsData : []);
      setStats(statsData);
      setTemplates(Array.isArray(templatesData) ? templatesData : []);
      setIsAuthorized(true);
      sessionStorage.setItem('admin_pass', pw);
    } catch (err: any) {
      setError(err.message || 'Connection failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Admin CRM & Marketing Hub | My Trading Toolbox';
    if (password) {
      fetchData(password);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    fetchData(password);
  };

  // Add Contact Handler
  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactEmail) return;

    setAddContactLoading(true);
    try {
      const res = await fetch('/api/v1/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password
        },
        body: JSON.stringify({
          name: newContactName,
          email: newContactEmail,
          status: newContactStatus,
          source: newContactSource,
          preferences: newContactPrefs,
          note: newContactNote
        })
      });

      if (!res.ok) throw new Error('Failed to create contact');
      
      setIsAddModalOpen(false);
      setNewContactName('');
      setNewContactEmail('');
      setNewContactStatus('lead');
      setNewContactPrefs([]);
      setNewContactNote('');
      fetchData(password);
    } catch (err: any) {
      alert(err.message || 'Error saving contact');
    } finally {
      setAddContactLoading(false);
    }
  };

  // Status Change Handler
  const handleStatusChange = async (contactId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/v1/contacts/${contactId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === contactId ? { ...l, status: newStatus as any } : l));
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  // Open 1-on-1 Email Modal (defaulting to Welcome & Intro or Demo)
  const openEmailModal = (contact: Lead, defaultTplId = 'welcome_introduction') => {
    setSelectedContact(contact);
    setEmailTemplateId(defaultTplId);
    const tpl = templates.find(t => t.id === defaultTplId) || templates[0];
    setEmailSubject(tpl ? tpl.subject : 'Welcome to MyTradingToolbox');
    setEmailCustomBody('');
    setEmailFeedback(null);
    setIsEmailModalOpen(true);
  };

  // Send 1-on-1 Email
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact) return;

    setEmailSending(true);
    setEmailFeedback(null);
    localStorage.setItem('saved_meet_url', emailGoogleMeetUrl);

    try {
      const res = await fetch('/api/v1/campaigns/send-one', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password
        },
        body: JSON.stringify({
          contactId: selectedContact.id,
          email: selectedContact.email,
          name: selectedContact.name,
          templateId: emailTemplateId,
          customSubject: emailSubject,
          customBody: emailCustomBody || undefined,
          googleMeetUrl: emailGoogleMeetUrl
        })
      });

      const data = await res.json();
      if (res.ok) {
        setEmailFeedback({ type: 'success', text: `Email successfully sent to ${selectedContact.email}!` });
        
        // Auto-advance status if sent Welcome & Intro
        if (emailTemplateId === 'welcome_introduction' && selectedContact.status === 'lead') {
          handleStatusChange(selectedContact.id, 'intro_sent');
        }
        
        fetchData(password);
      } else {
        setEmailFeedback({ type: 'error', text: data.error || 'Failed to send email' });
      }
    } catch (err: any) {
      setEmailFeedback({ type: 'error', text: err.message || 'Connection error' });
    } finally {
      setEmailSending(false);
    }
  };

  // Send Broadcast Campaign
  const handleBroadcastCampaign = async () => {
    const confirmed = window.confirm('Are you sure you want to broadcast this campaign to all matching active subscribers?');
    if (!confirmed) return;

    setBroadcastSending(true);
    setBroadcastResult(null);

    try {
      const res = await fetch('/api/v1/campaigns/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password
        },
        body: JSON.stringify({
          templateId: broadcastTemplateId,
          filterStatus: broadcastTargetStatus,
          filterTool: broadcastTargetTool,
          googleMeetUrl: emailGoogleMeetUrl
        })
      });

      const data = await res.json();
      if (res.ok) {
        setBroadcastResult(`Success! Dispatched campaign to ${data.sent} recipient(s).`);
        fetchData(password);
      } else {
        setBroadcastResult(`Error: ${data.error || 'Failed to dispatch broadcast'}`);
      }
    } catch (err: any) {
      setBroadcastResult(`Network Error: ${err.message}`);
    } finally {
      setBroadcastSending(false);
    }
  };

  // Open Notes Modal
  const openNotesModal = (contact: Lead) => {
    setSelectedContact(contact);
    setNewNoteText('');
    setIsNotesModalOpen(true);
  };

  // Add Note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact || !newNoteText.trim()) return;

    setAddingNote(true);
    try {
      const res = await fetch(`/api/v1/contacts/${selectedContact.id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password
        },
        body: JSON.stringify({ text: newNoteText })
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedContact(data.contact);
        setLeads(prev => prev.map(l => l.id === selectedContact.id ? data.contact : l));
        setNewNoteText('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingNote(false);
    }
  };

  // Filtered Contacts
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lead.name && lead.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lead.source && lead.source.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = selectedStatusFilter === 'all' || lead.status === selectedStatusFilter;
    const matchesTool = selectedToolFilter === 'all' || (Array.isArray(lead.preferences) && lead.preferences.includes(selectedToolFilter));

    return matchesSearch && matchesStatus && matchesTool;
  });

  // Calculate Pipeline Funnel
  const pipelineMetrics = {
    total: leads.length,
    newLeads: leads.filter(l => l.status === 'lead').length,
    introSent: leads.filter(l => l.status === 'intro_sent').length,
    demos: leads.filter(l => l.status === 'demo_scheduled' || l.status === 'demo_requested').length,
    customers: leads.filter(l => l.status === 'customer').length,
    unsubscribed: leads.filter(l => l.is_unsubscribed || l.status === 'unsubscribed').length
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#02040c] text-white flex flex-col justify-center items-center p-4 font-outfit relative">
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-blue-600/10 via-indigo-600/10 to-teal-500/10 blur-[120px] rounded-full" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl"
        >
          <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-6">
            <ShieldAlert className="text-blue-400 w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mb-2">MyTradingToolbox CRM</h1>
          <p className="text-slate-400 text-sm mb-6">Enter admin password to access pipeline, discovery & demo outreach.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Admin Password
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-outfit"
              />
            </div>
            {error && <p className="text-red-400 text-xs font-semibold">{error}</p>}
            <button 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              {loading ? <RefreshCw className="animate-spin w-4 h-4" /> : 'Unlock CRM Suite'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02040c] text-white p-4 md:p-8 font-outfit relative selection:bg-blue-500 selection:text-white">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-10 left-1/3 w-[600px] h-[300px] bg-blue-600/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <TrendingUp className="text-white w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-300 tracking-tight">
                  CRM & Marketing Hub
                </h1>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Pro Suite
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">Welcome intros, discovery questionnaires, Google Meet demos & conversions.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Interested Lead
            </button>
            <button 
              onClick={() => fetchData(password)}
              className="px-4 py-2.5 bg-slate-800/60 hover:bg-slate-700/60 border border-white/10 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 text-slate-300 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button 
              onClick={() => {
                sessionStorage.removeItem('admin_pass');
                setIsAuthorized(false);
              }}
              className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </header>

        {/* Funnel Pipeline KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
              <span>Total Leads</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-white">{pipelineMetrics.total}</div>
            <div className="text-[10px] text-slate-500 mt-1">All captured contacts</div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
              <span>Welcome / Intro Sent</span>
              <Clock className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-teal-300">{pipelineMetrics.introSent}</div>
            <div className="text-[10px] text-teal-400/80 mt-1">Discovery questions active</div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
              <span>Demos Booked</span>
              <Video className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-indigo-300">{pipelineMetrics.demos}</div>
            <div className="text-[10px] text-indigo-400/80 mt-1">Google Meet calls</div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
              <span>Customers</span>
              <UserCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-emerald-300">{pipelineMetrics.customers}</div>
            <div className="text-[10px] text-emerald-400/80 mt-1">Active Subscribers</div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-4 rounded-2xl col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
              <span>Opt-Outs</span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-slate-400">{pipelineMetrics.unsubscribed}</div>
            <div className="text-[10px] text-slate-500 mt-1">Unsubscribed</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 gap-6">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'pipeline'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" /> Contacts & Pipeline ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'campaigns'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Send className="w-4 h-4" /> Marketing Broadcasts
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'templates'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Email Templates ({templates.length})
          </button>
        </div>

        {/* TAB 1: CONTACTS & PIPELINE */}
        {activeTab === 'pipeline' && (
          <div className="space-y-4">
            {/* Search & Filter Bar */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, email, source..."
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Pipeline Stages</option>
                  <option value="lead">New Leads</option>
                  <option value="intro_sent">Intro Sent 💬</option>
                  <option value="contacted">Contacted</option>
                  <option value="demo_requested">Demo Requested</option>
                  <option value="demo_scheduled">Demo Scheduled</option>
                  <option value="customer">Customers</option>
                  <option value="unsubscribed">Unsubscribed</option>
                </select>

                <select
                  value={selectedToolFilter}
                  onChange={(e) => setSelectedToolFilter(e.target.value)}
                  className="bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Tool Preferences</option>
                  {AVAILABLE_TOOLS.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contacts Table */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/5">
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">Contact / Email</th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">Pipeline Stage</th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">Tool Interests</th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">Discovery & Notes</th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-right">Outreach Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredLeads.map((lead) => {
                      const stConfig = STATUS_CONFIG[lead.status] || STATUS_CONFIG.lead;
                      return (
                        <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center font-bold text-xs text-slate-300 shadow-inner shrink-0">
                                {lead.name ? lead.name[0].toUpperCase() : lead.email[0].toUpperCase()}
                              </div>
                              <div>
                                {lead.name && (
                                  <div className="font-bold text-sm text-white flex items-center gap-1.5">
                                    {lead.name}
                                  </div>
                                )}
                                <div className="text-xs text-slate-400 flex items-center gap-2">
                                  <span>{lead.email}</span>
                                  {lead.source && (
                                    <span className="text-[10px] bg-slate-800 text-blue-300 px-1.5 py-0.2 rounded border border-white/5">
                                      {DISCOVERY_SOURCES.find(s => s.id === lead.source)?.label || lead.source}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="relative inline-block">
                              <select
                                value={lead.status}
                                onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                className={`text-xs font-bold px-3 py-1.5 rounded-xl border appearance-none pr-8 cursor-pointer focus:outline-none transition-all ${stConfig.bg} ${stConfig.text} ${stConfig.border}`}
                              >
                                <option value="lead">New Lead</option>
                                <option value="intro_sent">Intro Sent 💬</option>
                                <option value="contacted">Contacted</option>
                                <option value="demo_requested">Demo Requested</option>
                                <option value="demo_scheduled">Demo Scheduled 📹</option>
                                <option value="customer">Customer 🚀</option>
                                <option value="unsubscribed">Unsubscribed</option>
                                <option value="inactive">Inactive</option>
                              </select>
                              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {Array.isArray(lead.preferences) && lead.preferences.length > 0 ? (
                                lead.preferences.map((pref, i) => (
                                  <span key={i} className="text-[10px] font-semibold bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded-md border border-blue-500/20">
                                    {pref.replace('opus-', '')}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-slate-600 italic">General Suite</span>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <button
                              onClick={() => openNotesModal(lead)}
                              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-300 bg-slate-800/40 hover:bg-slate-800 border border-white/5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                              <span>{lead.notes?.length || 0} notes</span>
                            </button>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {lead.is_unsubscribed ? (
                                <span className="text-[11px] text-rose-400/80 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                                  Opted Out
                                </span>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  <button 
                                    onClick={() => openEmailModal(lead, 'welcome_introduction')}
                                    title="Send Welcome & Discovery Introduction Email"
                                    className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-xl bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white border border-teal-500/30 transition-all shadow-sm active:scale-95 cursor-pointer"
                                  >
                                    <HelpCircle className="w-3.5 h-3.5" />
                                    <span>Welcome & Intro</span>
                                  </button>
                                  <button 
                                    onClick={() => openEmailModal(lead, 'google_meet_demo')}
                                    title="Send Google Meet Demo Invitation"
                                    className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 transition-all shadow-sm active:scale-95 cursor-pointer"
                                  >
                                    <Video className="w-3.5 h-3.5" />
                                    <span>Demo Invite</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {filteredLeads.length === 0 && (
                  <div className="py-16 text-center text-slate-500 space-y-3">
                    <Users className="w-10 h-10 mx-auto opacity-30" />
                    <p className="text-sm">No contacts match your filters.</p>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="text-xs text-blue-400 hover:underline font-semibold cursor-pointer"
                    >
                      + Add a lead manually
                    </button>
                  </div>
                )}
              </div>
            </div>

            {stats && stats.toolStats && stats.toolStats.length > 0 && (
              <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-4 rounded-2xl">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Demand by Trading Tool</span>
                <div className="flex flex-wrap gap-2">
                  {stats.toolStats.map((t, idx) => (
                    <div key={idx} className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 flex items-center gap-2">
                      <span className="text-xs text-slate-300">{t.tool}</span>
                      <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">{t.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MARKETING CAMPAIGNS */}
        {activeTab === 'campaigns' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Send className="text-blue-400 w-5 h-5" /> Launch Broadcast Email Campaign
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Send targeted product announcements, demo invitations, or revenue offers to multiple leads at once.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Select Campaign Template
                  </label>
                  <select
                    value={broadcastTemplateId}
                    onChange={(e) => setBroadcastTemplateId(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    {templates.map(tpl => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.name} — [{tpl.category}]
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Target Pipeline Stage
                    </label>
                    <select
                      value={broadcastTargetStatus}
                      onChange={(e) => setBroadcastTargetStatus(e.target.value)}
                      className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      <option value="all">All Active Subscribers</option>
                      <option value="lead">New Leads Only</option>
                      <option value="intro_sent">Intro Sent Contacts</option>
                      <option value="contacted">Contacted Leads</option>
                      <option value="demo_requested">Demo Requested</option>
                      <option value="customer">Existing Customers</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Filter by Tool Preference
                    </label>
                    <select
                      value={broadcastTargetTool}
                      onChange={(e) => setBroadcastTargetTool(e.target.value)}
                      className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      <option value="all">All Tools</option>
                      {AVAILABLE_TOOLS.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Google Meet / Scheduler URL (Dynamic Placeholder)
                  </label>
                  <input
                    type="url"
                    value={emailGoogleMeetUrl}
                    onChange={(e) => setEmailGoogleMeetUrl(e.target.value)}
                    placeholder="https://meet.google.com/xyz-abc or Calendly"
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                  />
                </div>

                {broadcastResult && (
                  <div className={`p-4 rounded-xl text-xs font-semibold ${
                    broadcastResult.startsWith('Success')
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-300 border border-red-500/20'
                  }`}>
                    {broadcastResult}
                  </div>
                )}

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    <span className="text-emerald-400 font-semibold">CAN-SPAM Safe:</span> Unsubscribed contacts are excluded automatically.
                  </div>
                  <button
                    type="button"
                    disabled={broadcastSending}
                    onClick={handleBroadcastCampaign}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {broadcastSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Broadcast Campaign Now
                  </button>
                </div>
              </div>
            </div>

            {/* Campaign Summary & Best Practices */}
            <div className="space-y-4">
              <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Revenue & Outreach Tips
                </h3>
                <ul className="text-xs text-slate-400 space-y-3 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span><strong>Welcome & Discovery Intro:</strong> High reply rate asking how they found you and what strategies they run.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span><strong>15-Minute Google Meet Demos:</strong> High conversion rate for income traders when walking through live trade setups.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span><strong>Founder Touchpoints:</strong> Personal emails from Keith Thompson build long-term trust and loyalty.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EMAIL TEMPLATES */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map(tpl => (
              <div key={tpl.id} className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {tpl.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">{tpl.name}</h3>
                  <p className="text-xs text-slate-400 mb-3">{tpl.description}</p>
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5 text-xs text-slate-300">
                    <span className="text-slate-500 font-semibold">Subject: </span>
                    {tpl.subject}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD INTERESTED LEAD */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Add Interested Lead</h2>
                  <p className="text-xs text-slate-400">Record a new prospect with their discovery source and tool preferences.</p>
                </div>
              </div>

              <form onSubmit={handleAddContact} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    placeholder="trader@example.com"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Pipeline Stage
                    </label>
                    <select
                      value={newContactStatus}
                      onChange={(e) => setNewContactStatus(e.target.value as any)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      <option value="lead">New Lead</option>
                      <option value="intro_sent">Intro Sent 💬</option>
                      <option value="contacted">Contacted</option>
                      <option value="demo_requested">Demo Requested</option>
                      <option value="demo_scheduled">Demo Scheduled</option>
                      <option value="customer">Customer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      How Did They Find You?
                    </label>
                    <select
                      value={newContactSource}
                      onChange={(e) => setNewContactSource(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      {DISCOVERY_SOURCES.map(source => (
                        <option key={source.id} value={source.id}>{source.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Tool Interests
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {AVAILABLE_TOOLS.map(tool => (
                      <button
                        type="button"
                        key={tool.id}
                        onClick={() => {
                          setNewContactPrefs(prev =>
                            prev.includes(tool.id) ? prev.filter(p => p !== tool.id) : [...prev, tool.id]
                          );
                        }}
                        className={`text-left text-[11px] p-2 rounded-lg border transition-all cursor-pointer ${
                          newContactPrefs.includes(tool.id)
                            ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                            : 'bg-slate-950 border-white/5 text-slate-400 hover:bg-white/5'
                        }`}
                      >
                        {tool.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Initial Note / Context
                  </label>
                  <textarea
                    rows={2}
                    value={newContactNote}
                    onChange={(e) => setNewContactNote(e.target.value)}
                    placeholder="e.g. Trader interested in covered call scanner, asked about Tradier connectivity..."
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addContactLoading}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
                  >
                    {addContactLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    Save Lead to CRM
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 2: 1-ON-1 EMAIL COMPOSER */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isEmailModalOpen && selectedContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Send Outreach Email</h2>
                  <p className="text-xs text-slate-400">
                    Recipient: <strong className="text-blue-300">{selectedContact.name || selectedContact.email}</strong> ({selectedContact.email})
                  </p>
                </div>
              </div>

              <form onSubmit={handleSendEmail} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Email Template
                  </label>
                  <select
                    value={emailTemplateId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setEmailTemplateId(id);
                      const tpl = templates.find(t => t.id === id);
                      if (tpl) setEmailSubject(tpl.subject);
                    }}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    {templates.map(tpl => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.name} ({tpl.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    required
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Google Meet / Video Call URL (Embedded in CTA button)
                  </label>
                  <input
                    type="url"
                    value={emailGoogleMeetUrl}
                    onChange={(e) => setEmailGoogleMeetUrl(e.target.value)}
                    placeholder="https://meet.google.com/xyz-abc or scheduling link"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Custom Message Note (Optional - overrides template default)
                  </label>
                  <textarea
                    rows={3}
                    value={emailCustomBody}
                    onChange={(e) => setEmailCustomBody(e.target.value)}
                    placeholder="Leave empty to use the standard high-converting template HTML, or enter custom paragraphs..."
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 text-xs text-slate-400 space-y-2">
                  <div className="flex items-center gap-2 text-blue-400 font-semibold">
                    <Sparkles className="w-3.5 h-3.5" /> Dynamic variables supported:
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">{'{{name}}'}</span>
                    <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">{'{{email}}'}</span>
                    <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">{'{{meet_url}}'}</span>
                    <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">{'{{unsubscribe_url}}'}</span>
                  </div>
                </div>

                {emailFeedback && (
                  <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    emailFeedback.type === 'success'
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-300 border border-red-500/20'
                  }`}>
                    {emailFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                    <span>{emailFeedback.text}</span>
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEmailModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={emailSending}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {emailSending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    Send Email via Resend
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 3: NOTES & ACTIVITY HISTORY */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isNotesModalOpen && selectedContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsNotesModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Contact Notes & Activity</h2>
                  <p className="text-xs text-slate-400">{selectedContact.name || selectedContact.email}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {selectedContact.notes && selectedContact.notes.length > 0 ? (
                    selectedContact.notes.map((note) => (
                      <div key={note.id} className="bg-slate-950/80 p-3 rounded-xl border border-white/5 space-y-1">
                        <div className="text-[10px] text-slate-500">
                          {new Date(note.date).toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-200 leading-relaxed">
                          {note.text}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-500 text-xs italic">
                      No activity notes logged yet.
                    </div>
                  )}
                </div>

                <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-white/5">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Add New Note
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Log call summary, demo feedback, customer requests..."
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={addingNote || !newNoteText.trim()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      {addingNote ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                      Add Note
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
