import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ShieldCheck } from 'lucide-react';

interface PartnerCardProps {
  name: string;
  description: string;
  url: string;
  icon: React.ElementType;
  badge?: string;
}

const PartnerCard: React.FC<PartnerCardProps> = ({ name, description, url, icon: Icon, badge }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_20px_40px_rgba(59,130,246,0.1)] overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
        <Icon size={80} />
      </div>

      <div className="relative z-10">
        {badge && (
          <div className="mb-4">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-400 uppercase tracking-widest shadow-sm w-fit">
              <ShieldCheck className="w-3 h-3" /> {badge}
            </span>
          </div>
        )}
        
        <div className="p-3 bg-blue-500/10 rounded-2xl group-hover:bg-blue-500/20 transition-colors w-fit mb-4">
          <Icon className="text-blue-400 w-6 h-6" />
        </div>

        <h3 className="text-xl font-black text-white mb-2 tracking-tight">{name}</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6 h-12 line-clamp-2">
          {description}
        </p>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 transition-all hover:text-blue-300 group-hover:gap-3"
        >
          Visit Partner <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
};

export default PartnerCard;
