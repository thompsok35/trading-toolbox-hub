import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Mail, Phone, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#02040c] text-slate-300 p-6 md:p-12 relative overflow-hidden flex flex-col items-center">
      {/* Dynamic Background Effects */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl z-10"
      >
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Toolbox
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
            <ShieldCheck className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Privacy Policy</h1>
            <p className="text-slate-400 text-sm mt-1">Last Updated: April 8, 2026</p>
          </div>
        </div>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
              Introduction
            </h2>
            <p>
              Welcome to My Trading Toolbox (mytradingtoolbox.com). We value your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information when you use our services, including our SMS alert system.
            </p>
          </section>

          {/* SMS SPECIFIC SECTION - 10DLC COMPLIANCE */}
          <section className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              SMS Disclosure & Privacy (10DLC)
            </h2>
            <div className="space-y-4">
              <p>
                By providing your phone number and opting in to receive SMS alerts from My Trading Toolbox, you consent to receive text messages (which may include trading alerts, account notifications, and platform updates).
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-400">
                <li><strong className="text-blue-300">Consent:</strong> Program enrollment requires your explicit consent. We do not use "blind" or "bought" lists.</li>
                <li><strong className="text-blue-300">Message Frequency:</strong> Message frequency varies based on user-defined alerts and market events.</li>
                <li><strong className="text-blue-300">No Third-Party Sharing:</strong> <span className="text-white font-medium">Mobile information will not be shared with third parties/affiliates for marketing/promotional purposes. All the above categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.</span></li>
                <li><strong className="text-blue-300">Costs:</strong> Message and data rates may apply depending on your mobile carrier.</li>
                <li><strong className="text-blue-300">Opt-Out:</strong> You can cancel the SMS service at any time. Just text <span className="text-white font-semibold">STOP</span> to our short code or long-code. After you send the SMS message STOP to us, we will send you an SMS message to confirm that you have been unsubscribed.</li>
                <li><strong className="text-blue-300">Help:</strong> If you are experiencing issues with the messaging program you can reply with the keyword <span className="text-white font-semibold">HELP</span> for more assistance.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
              Information We Collect
            </h2>
            <p>
              We collect information that you provide directly to us, such as when you create an account, subscribe to our newsletter, or opt-in to SMS alerts. This includes:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1 text-slate-400">
              <li>Contact information (email address, phone number).</li>
              <li>Account credentials.</li>
              <li>Portfolio preferences and alert settings.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
              How We Use Your Information
            </h2>
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1 text-slate-400">
              <li>Provide and maintain our services.</li>
              <li>Send you technical notices, updates, and security alerts.</li>
              <li>Deliver market insights and trading alerts (including via SMS if opted-in).</li>
              <li>Respond to your comments and questions.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
              Contact Us
            </h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors">
                <Mail className="w-5 h-5 text-blue-400" />
                <span className="text-sm">support@mytradingtoolbox.com</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors">
                <Phone className="w-5 h-5 text-blue-400" />
                <span className="text-sm">Contact Support via App</span>
              </div>
            </div>
          </section>
        </div>
      </motion.div>

      <footer className="mt-12 text-slate-500 text-sm font-medium tracking-wide z-10 text-center">
        <p>&copy; {new Date().getFullYear()} My Trading Toolbox. All rights reserved.</p>
        <p className="mt-2">mytradingtoolbox.com is a platform for educational and informational purposes.</p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
