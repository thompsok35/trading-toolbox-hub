import { motion } from 'framer-motion';
import { ArrowUpRight, type LucideIcon } from 'lucide-react';

interface ToolCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    url?: string;
    isComingSoon?: boolean;
}

const ToolCard: React.FC<ToolCardProps> = ({ title, description, icon: Icon, url, isComingSoon }) => {
    const content = (
        <div className={`p-3 md:p-3.5 rounded-[1.125rem] border transition-all duration-300 flex items-center gap-3.5 group 
            ${isComingSoon 
                ? 'bg-white/[0.02] border-white/5 opacity-60 grayscale' 
                : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-blue-500/40 shadow-lg hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] cursor-pointer'
            }`}>
            
            <div className={`p-2.5 rounded-xl transition-all duration-300 ${isComingSoon ? 'bg-white/5 text-slate-500' : 'bg-blue-600/10 text-blue-500 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]'}`}>
                <Icon size={18} strokeWidth={1.5} />
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-bold text-slate-100 tracking-wide truncate">{title}</h3>
                    {isComingSoon && (
                        <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest bg-slate-800 text-slate-400 rounded-full border border-slate-700 shrink-0">
                            Soon
                        </span>
                    )}
                </div>
                <p className="text-slate-400 text-[11px] md:text-xs mt-0.5 leading-tight line-clamp-2">{description}</p>
            </div>
            
            {!isComingSoon && (
                <div className="text-slate-600 group-hover:text-blue-400 transition-colors duration-300 translate-x-0 group-hover:translate-x-1 shrink-0">
                    <ArrowUpRight size={18} strokeWidth={1.5} />
                </div>
            )}
        </div>
    );

    if (isComingSoon) {
        return content;
    }

    return (
        <motion.a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="block"
        >
            {content}
        </motion.a>
    );
};

export default ToolCard;
