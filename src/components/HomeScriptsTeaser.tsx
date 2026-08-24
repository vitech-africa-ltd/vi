import React from 'react';
import { 
  Code2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Database, 
  Smartphone, 
  CheckCircle2, 
  Layers
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

interface HomeScriptsTeaserProps {
  onNavigateToScripts: () => void;
}

export const HomeScriptsTeaser: React.FC<HomeScriptsTeaserProps> = ({
  onNavigateToScripts,
}) => {
  const { formatCurrency } = useCurrency();

  const sampleScripts = [
    {
      title: 'Vitech Core Banking & MoMo Switch',
      category: 'Fintech & Paiement',
      badge: 'POPULAIRE',
      tech: ['C# .NET 9', 'MySQL 8', 'MTN MoMo API'],
      priceEur: 139,
      gradient: 'from-blue-600/20 to-cyan-600/10',
      icon: Database,
    },
    {
      title: 'MediCare Clinic & Hospital ERP SaaS',
      category: 'Santé & Gestion',
      badge: 'TOP VENTE',
      tech: ['PHP 8.4', 'MVC', 'Docker'],
      priceEur: 109,
      gradient: 'from-emerald-600/20 to-teal-600/10',
      icon: ShieldCheck,
    },
    {
      title: 'Kigali Commerce & Multi-Vendor Hub',
      category: 'E-Commerce & Logistique',
      badge: 'NOUVEAU',
      tech: ['Node.js', 'React', 'Airtel Money'],
      priceEur: 89,
      gradient: 'from-amber-600/20 to-orange-600/10',
      icon: Zap,
    },
  ];

  return (
    <section className="py-20 bg-slate-950 border-t border-b border-slate-800/80 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vitech Scripts • Codes Sources Prêts à Déployer</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Solutions &amp; Applications Clés en Main{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                avec Code Source Inclus
              </span>
            </h2>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Gagnez des mois de développement. Téléchargez nos architectures logicielles complètes, testées et prêtes pour la production avec paiement direct Mobile Money ou CB.
            </p>
          </div>

          <button
            onClick={onNavigateToScripts}
            className="self-start md:self-auto px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 active:scale-95 shrink-0"
          >
            <span>Voir toute la Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Featured Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleScripts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={onNavigateToScripts}
                className="group p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-xl relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-500/20 px-2.5 py-1 rounded-lg">
                      {item.category}
                    </span>
                    <span className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1">Architecture MVC, API REST &amp; Base de données incluses</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tech.map((t, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-950 text-slate-300 border border-slate-800">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-800/80 flex items-center justify-between relative z-10">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Licence Commerciale :</span>
                    <span className="font-mono font-black text-sm text-cyan-400">
                      {formatCurrency(item.priceEur)}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Explorer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
