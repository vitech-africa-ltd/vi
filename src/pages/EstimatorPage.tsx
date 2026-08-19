import React from 'react';
import { 
  Calculator, 
  Sparkles, 
  Coins, 
  ArrowRightLeft, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Calendar 
} from 'lucide-react';
import { ProjectEstimator } from '../components/ProjectEstimator';
import { FaqSection } from '../components/FaqSection';
import { useCurrency } from '../context/CurrencyContext';

interface EstimatorPageProps {
  initialServiceId?: string;
  onApplyEstimateToContact: (data: {
    projectType: string;
    features: string[];
    platforms: string[];
    sla: string;
    estimatedBudget: string;
    estimatedTimeline: string;
  }) => void;
  onOpenScheduleModal: () => void;
}

export const EstimatorPage: React.FC<EstimatorPageProps> = ({
  initialServiceId,
  onApplyEstimateToContact,
  onOpenScheduleModal,
}) => {
  const { currencyOption, openConverterModal } = useCurrency();

  return (
    <div className="pt-24 pb-16 bg-slate-950 text-white animate-in fade-in duration-300">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5" />
              <span>Simulateur &amp; Chiffrage Instantané</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Estimez le Coût &amp; les Délais de Votre{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                Développement Sur-Mesure
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Sélectionnez vos plateformes cibles, fonctionnalités métiers et niveau de SLA pour obtenir une projection budgétaire claire et transparente dans votre devise ({currencyOption.name} - {currencyOption.symbol}).
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => openConverterModal()}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Coins className="w-4 h-4" />
                <span>Changer de devise ({currencyOption.flag} {currencyOption.code})</span>
                <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Project Estimator */}
      <ProjectEstimator
        initialServiceId={initialServiceId}
        onApplyEstimateToContact={onApplyEstimateToContact}
      />

      {/* FAQ on pricing & terms */}
      <div className="bg-slate-50 text-slate-900">
        <FaqSection onOpenChat={onOpenScheduleModal} />
      </div>

    </div>
  );
};
