import React, { useEffect, useRef, useState } from 'react';
import { useSiteData } from '../../context/SiteDataContext';
import { Megaphone, ExternalLink, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface GoogleAdBannerProps {
  slotId?: string;
  format?: 'horizontal-leaderboard' | 'in-article' | 'rectangle-card' | 'sidebar';
  label?: string;
  className?: string;
}

export const GoogleAdBanner: React.FC<GoogleAdBannerProps> = ({
  slotId,
  format = 'horizontal-leaderboard',
  label = 'Espace Partenaire VITECH & Solutions Cloud',
  className = '',
}) => {
  const { googleAdsConfig } = useSiteData();
  const adRef = useRef<HTMLDivElement>(null);
  const [adPushed, setAdPushed] = useState(false);
  const [simulatedClick, setSimulatedClick] = useState(false);

  const isEnabled = googleAdsConfig?.adSenseEnabled ?? false;
  const isTestMode = googleAdsConfig?.testMode ?? true;
  const publisherId = googleAdsConfig?.adSensePublisherId || 'ca-pub-3096798858530242';
  const effectiveSlotId = slotId || googleAdsConfig?.blogBannerSlotId || '5482910394';

  useEffect(() => {
    if (isEnabled && !isTestMode && typeof window !== 'undefined' && !adPushed) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        setAdPushed(true);
      } catch (err) {
        // Safe catch if adsbygoogle script is blocked by client adblocker
        console.warn('Google AdSense render error:', err);
      }
    }
  }, [isEnabled, isTestMode, adPushed]);

  if (!isEnabled) {
    return null;
  }

  // Format styles configuration
  const formatClasses = {
    'horizontal-leaderboard': 'w-full min-h-[90px] py-4',
    'in-article': 'w-full my-6 p-4 min-h-[120px]',
    'rectangle-card': 'w-full max-w-[340px] mx-auto min-h-[250px] p-5',
    'sidebar': 'w-full min-h-[400px] p-4',
  }[format];

  // If in Test Mode or awaiting Google AdSense domain validation:
  if (isTestMode) {
    return (
      <div
        id={`ad-slot-${effectiveSlotId}`}
        className={`relative overflow-hidden rounded-2xl border border-dashed border-blue-500/40 bg-gradient-to-r from-blue-950/20 via-slate-900/40 to-indigo-950/20 text-slate-300 dark:text-slate-300 transition-all ${formatClasses} ${className}`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  Google AdSense / Ads
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  Mode Aperçu / Test
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {label} • Slot: <code className="text-cyan-300 font-mono text-[11px]">{effectiveSlotId}</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setSimulatedClick(true);
                setTimeout(() => setSimulatedClick(false), 2500);
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 transition-colors flex items-center gap-1.5"
              title="Vérifier la réactivité du bloc publicitaire"
            >
              {simulatedClick ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Clic Simulé OK</span>
                </>
              ) : (
                <>
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Tester le Bloc</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Informative footer bar */}
        <div className="bg-slate-900/80 dark:bg-slate-950/80 border-t border-slate-800/80 px-4 py-1.5 text-[10px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <span>Client: <code className="text-slate-300">{publisherId}</code></span>
          <span className="text-slate-500 hidden sm:inline">Affichage sécurisé conforme aux règles Google Ads</span>
        </div>
      </div>
    );
  }

  // Live Production AdSense Container
  return (
    <div
      ref={adRef}
      id={`ad-container-${effectiveSlotId}`}
      className={`relative my-4 overflow-hidden text-center ${formatClasses} ${className}`}
    >
      <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
        <span>Annonce Partenaire</span>
      </div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={publisherId}
        data-ad-slot={effectiveSlotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
