import React from 'react';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  TrendingUp, 
  ShieldCheck, 
  Quote,
  Globe
} from 'lucide-react';
import { CaseStudy } from '../types';
import { useTranslation } from '../context/LanguageContext';

interface CaseStudyModalProps {
  caseStudy?: CaseStudy | null;
  study?: CaseStudy | null;
  onClose: () => void;
  onStartSimilarProject?: (projectName: string) => void;
  onStartProject?: (projectName: string) => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  caseStudy: rawCaseStudy,
  study: rawStudy,
  onClose,
  onStartSimilarProject,
  onStartProject,
}) => {
  const { t } = useTranslation();
  const caseStudy = rawCaseStudy || rawStudy;
  if (!caseStudy) return null;

  const results = Array.isArray(caseStudy.results) ? caseStudy.results : [];
  const techStack = Array.isArray(caseStudy.techStack)
    ? caseStudy.techStack
    : Array.isArray(caseStudy.technologies)
    ? caseStudy.technologies
    : [];

  const handleStartProject = () => {
    onClose();
    if (onStartSimilarProject) {
      onStartSimilarProject(caseStudy.title);
    } else if (onStartProject) {
      onStartProject(caseStudy.title);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-white my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{caseStudy.countryFlag || '🌍'}</span>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
              {caseStudy.client || 'Client Partenaire'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-6 sm:p-8 space-y-8 overflow-y-auto">
          
          {/* Header & Hero Image */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {caseStudy.title}
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              {caseStudy.description || caseStudy.summary || ''}
            </p>

            <div className="relative rounded-2xl overflow-hidden h-64 sm:h-80 border border-slate-800">
              <img 
                src={caseStudy.image || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80'} 
                alt={caseStudy.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              
              {/* Overlay KPIs */}
              {results.length > 0 && (
                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {results.map((res, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-center">
                      <span className="text-lg sm:text-2xl font-black text-emerald-400 font-mono block">
                        {res.value}
                      </span>
                      <span className="text-[11px] text-slate-300 font-medium block truncate">
                        {res.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Problem & Solution Grid */}
          {(caseStudy.challenge || caseStudy.solution) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {caseStudy.challenge && (
                <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/20 space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
                    <span>{t('portfolio.modalChallenge', 'Le Défi Initial')}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {caseStudy.challenge}
                  </p>
                </div>
              )}

              {caseStudy.solution && (
                <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <span>{t('portfolio.modalSolution', 'La Solution Vitech Africa')}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {caseStudy.solution}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Technical Architecture Breakdown */}
          {caseStudy.architecture && (
            <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
                <Cpu className="w-4 h-4" />
                <span>{t('portfolio.modalArchitecture', "Choix d'Architecture & Décisions d'Ingénierie")}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {caseStudy.architecture}
              </p>

              {/* Tech stack badges */}
              {techStack.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-400 block mb-2">{t('portfolio.modalTechDeployed', 'Technologies & Outils déployés :')}</span>
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((tech, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 rounded-lg bg-slate-900 text-emerald-300 font-mono text-xs border border-slate-700/80 font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Client Quote */}
          {caseStudy.clientQuote && caseStudy.clientQuote.text && (
            <div className="p-5 rounded-2xl bg-slate-950/90 border border-emerald-500/30 flex items-start space-x-4">
              {caseStudy.clientQuote.avatar && (
                <img 
                  src={caseStudy.clientQuote.avatar} 
                  alt={caseStudy.clientQuote.author || 'Client'}
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shrink-0"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="space-y-1">
                <Quote className="w-5 h-5 text-emerald-400/60" />
                <p className="text-xs sm:text-sm italic text-slate-300">
                  "{caseStudy.clientQuote.text}"
                </p>
                <div className="text-xs text-slate-400 pt-1">
                  <span className="font-bold text-white">{caseStudy.clientQuote.author}</span>
                  {caseStudy.clientQuote.role && <span> — {caseStudy.clientQuote.role}</span>}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 z-20 backdrop-blur-md">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            {t('portfolio.modalClose', "Fermer l'étude de cas")}
          </button>

          <button
            onClick={handleStartProject}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md shadow-emerald-500/30 transition-all cursor-pointer"
          >
            <span>{t('portfolio.modalStartSimilar', 'Démarrer un projet similaire')}</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
