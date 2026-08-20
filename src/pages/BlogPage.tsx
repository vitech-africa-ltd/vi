import React from 'react';
import { 
  BookOpen, 
  ArrowRight 
} from 'lucide-react';
import { TechBlogSection } from '../components/TechBlogSection';
import { NewsletterSection } from '../components/NewsletterSection';
import { useTranslation } from '../context/LanguageContext';

interface BlogPageProps {
  onNavigateToView: (viewId: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigateToView }) => {
  const { t } = useTranslation();

  return (
    <div className="pt-24 pb-16 bg-slate-50 animate-in fade-in duration-300">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white py-16 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t('blog.heroBadge', "Publications d'Ingénierie & R&D")}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              {t('blog.heroTitle', "Retours d'Expérience & Architecture")}{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                {t('blog.heroTitleHighlight', 'Logicielle Avancée')}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {t('blog.heroDesc', "Découvrez les articles techniques rédigés par nos Lead Developers : architectures événementielles, déploiements Kubernetes multi-régions, intégration de modèles d'IA souverains et sécurité bancaire OWASP.")}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigateToView('estimator')}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{t('blog.heroCta', 'Démarrer un projet technique')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Blog Component */}
      <TechBlogSection />

      {/* Newsletter */}
      <NewsletterSection />

    </div>
  );
};
