import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MailCheck, BellOff, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export const Unsubscribe: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [email, setEmail] = useState('');
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Manage Email Preferences | My Trading Toolbox';

    const checkStatus = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/unsubscribe/status?token=${encodeURIComponent(token)}`);
        if (res.ok) {
          const data = await res.json();
          setEmail(data.email);
          setIsUnsubscribed(data.is_unsubscribed);
        } else {
          // If token looks like email directly
          if (token.includes('@')) {
            setEmail(token);
          }
        }
      } catch (err) {
        console.error('Failed to check status', err);
        if (token.includes('@')) setEmail(token);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [token]);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = token || email;
    if (!target) return;

    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token || undefined, email: !token ? email : undefined })
      });

      const data = await res.json();
      if (res.ok) {
        setIsUnsubscribed(true);
        setMessage('You have been successfully removed from our marketing and product update emails.');
      } else {
        setError(data.error || 'Failed to update preferences. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResubscribe = async () => {
    const target = token || email;
    if (!target) return;

    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch('/api/unsubscribe/resubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token || undefined, email: !token ? email : undefined })
      });

      const data = await res.json();
      if (res.ok) {
        setIsUnsubscribed(false);
        setMessage('Welcome back! You are now subscribed to product updates and early access.');
      } else {
        setError(data.error || 'Failed to resubscribe.');
      }
    } catch (err) {
      setError('An error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#02040c] text-white flex flex-col justify-center items-center p-4 font-outfit relative selection:bg-blue-500 selection:text-white">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-blue-600/10 via-indigo-600/10 to-transparent blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-400 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to My Trading Toolbox
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            {isUnsubscribed ? (
              <BellOff className="text-amber-400 w-6 h-6" />
            ) : (
              <MailCheck className="text-blue-400 w-6 h-6" />
            )}
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white mb-2">
            {isUnsubscribed ? 'Unsubscribed' : 'Email Preferences'}
          </h1>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            {isUnsubscribed 
              ? 'You have opted out of promotional communications and marketing emails from MyTradingToolbox.' 
              : 'We respect your inbox. You can opt out of product announcements and demo invitations anytime.'}
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
            </div>
          ) : isUnsubscribed ? (
            <div className="space-y-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-200 leading-relaxed">
                  {message || `The email address ${email ? `"${email}"` : 'associated with this link'} has been unsubscribed.`}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleResubscribe}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm py-3 px-4 rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Unsubscribed by mistake? Re-subscribe'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUnsubscribe} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trader@example.com"
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-outfit"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-2 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !email}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-red-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Unsubscribe from All Marketing'}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-[11px] text-slate-500">
              For account support or questions, contact{' '}
              <a href="mailto:keith.thompson@mytradingtoolbox.com" className="text-blue-400 hover:underline">
                keith.thompson@mytradingtoolbox.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Unsubscribe;
