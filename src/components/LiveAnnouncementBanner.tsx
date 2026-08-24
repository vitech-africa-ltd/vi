import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Copy, 
  Check, 
  X, 
  Tag, 
  Zap, 
  Flame,
  ShieldCheck
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

interface LiveAnnouncementBannerProps {
  onNavigate: (viewId: string) => void;
}

export const LiveAnnouncementBanner: React.FC<LiveAnnouncementBannerProps> = ({ onNavigate }) => {
  const { liveAnnouncement } = useSiteData();
  const [isDismissed, setIsDismissed] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  if (!liveAnnouncement || !liveAnnouncement.enabled || isDismissed) {
    return null;
  }

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!liveAnnouncement.couponCode) return;
    navigator.clipboard.writeText(liveAnnouncement.couponCode);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  const handleBannerClick = () => {
    if (liveAnnouncement.targetView) {
      onNavigate(liveAnnouncement.targetView);
    }
  };

  // Color theme mappings
  const themeClasses = {
    emerald: {
      bg: 'bg-gradient-to-r from-emerald-950 via-slate-950 to-teal-950 border-b border-emerald-500/30',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      text: 'text-emerald-100',
      highlight: 'text-emerald-400 font-bold',
      btn: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold',
      coupon: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
    },
    cyan: {
      bg: 'bg-gradient-to-r from-cyan-950 via-slate-950 to-blue-950 border-b border-cyan-500/30',
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      text: 'text-cyan-100',
      highlight: 'text-cyan-400 font-bold',
      btn: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold',
      coupon: 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
    },
    amber: {
      bg: 'bg-gradient-to-r from-amber-950 via-slate-950 to-orange-950 border-b border-amber-500/30',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      text: 'text-amber-100',
      highlight: 'text-amber-400 font-bold',
      btn: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold',
      coupon: 'bg-amber-950/80 border-amber-500/50 text-amber-300'
    },
    purple: {
      bg: 'bg-gradient-to-r from-purple-950 via-slate-950 to-indigo-950 border-b border-purple-500/30',
      badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      text: 'text-purple-100',
      highlight: 'text-purple-400 font-bold',
      btn: 'bg-purple-500 hover:bg-purple-400 text-white font-bold',
      coupon: 'bg-purple-950/80 border-purple-500/50 text-purple-300'
    },
    rose: {
      bg: 'bg-gradient-to-r from-rose-950 via-slate-950 to-pink-950 border-b border-rose-500/30',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      text: 'text-rose-100',
      highlight: 'text-rose-400 font-bold',
      btn: 'bg-rose-500 hover:bg-rose-400 text-white font-bold',
      coupon: 'bg-rose-950/80 border-rose-500/50 text-rose-300'
    }
  };

  const currentTheme = themeClasses[liveAnnouncement.theme] || themeClasses.emerald;

  return (
    <div 
      className={`relative z-50 px-3 sm:px-4 py-2 sm:py-2.5 transition-all duration-300 ${currentTheme.bg}`}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-4 text-xs">
        
        {/* Main Content & Message */}
        <div 
          onClick={handleBannerClick}
          className="flex flex-wrap items-center gap-2 sm:gap-3 cursor-pointer flex-1 min-w-0"
        >
          {liveAnnouncement.badge && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border shrink-0 ${currentTheme.badge}`}>
              {liveAnnouncement.badge}
            </span>
          )}

          <p className={`truncate text-xs sm:text-xs font-medium ${currentTheme.text}`}>
            {liveAnnouncement.message}
          </p>

          {/* Coupon Code Pill */}
          {liveAnnouncement.couponCode && (
            <button
              onClick={handleCopyCode}
              title="Copier le code promo"
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-mono border font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0 ${currentTheme.coupon}`}
            >
              <Tag className="w-3 h-3" />
              <span>{liveAnnouncement.couponCode}</span>
              {copiedCoupon ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3 text-slate-400 hover:text-white" />
              )}
            </button>
          )}
        </div>

        {/* Action Button & Dismiss */}
        <div className="flex items-center gap-2 shrink-0">
          {liveAnnouncement.linkText && (
            <button
              onClick={handleBannerClick}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 shadow transition-all hover:opacity-90 active:scale-95 cursor-pointer ${currentTheme.btn}`}
            >
              <span>{liveAnnouncement.linkText}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDismissed(true);
            }}
            aria-label="Fermer l'alerte"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
