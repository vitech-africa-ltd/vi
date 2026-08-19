import React from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Clock, 
  FolderLock, 
  Cpu, 
  MessageSquare, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ClientDashboard } from '../components/ClientDashboard';
import { useAuth } from '../context/AuthContext';

interface ClientPortalPageProps {
  onOpenChat: () => void;
  onNavigateToView: (viewId: string) => void;
}

export const ClientPortalPage: React.FC<ClientPortalPageProps> = ({
  onOpenChat,
  onNavigateToView,
}) => {
  const { user, isAuthenticated, signInWithGoogle } = useAuth();

  return (
    <div className="pt-24 pb-16 bg-slate-950 text-white animate-in fade-in duration-300">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              <span>Espace Client Sécurisé &amp; Suivi en Temps Réel</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Gouvernance de Projet, Livrables &amp;{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Suivi des Sprints
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Consultez l'état d'avancement de vos développements, validez les jalons techniques, accédez au coffre-fort de livrables et échangez en direct avec votre Lead Developer dédié.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              {!isAuthenticated ? (
                <button
                  onClick={signInWithGoogle}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Connexion Sécurisée Google</span>
                </button>
              ) : (
                <button
                  onClick={onOpenChat}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Contacter l'équipe projet en direct</span>
                </button>
              )}

              <button
                onClick={() => onNavigateToView('estimator')}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Ajouter un nouveau projet</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Client Dashboard Component */}
      <ClientDashboard />

    </div>
  );
};
