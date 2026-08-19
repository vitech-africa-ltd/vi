import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { ContactSection } from '../components/ContactSection';
import { useSiteData } from '../context/SiteDataContext';
import { ContactFormData, OfficeHub } from '../types';

interface ContactPageProps {
  initialData: Partial<ContactFormData>;
  onOpenScheduleModal: (hub?: OfficeHub) => void;
  onOpenChat: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  initialData,
  onOpenScheduleModal,
  onOpenChat,
}) => {
  const { companyInfo } = useSiteData();

  return (
    <div className="pt-24 pb-16 bg-slate-950 text-white animate-in fade-in duration-300">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Direct &amp; Cadrage Technique</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Donnez Vie à Vos Projets{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Technologiques Majeurs
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Initiez votre demande de projet ou contactez directement notre Direction Technique pour une prise en charge rapide sous 24h avec accord de confidentialité (NDA).
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onOpenScheduleModal()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Réserver un appel de 30 minutes</span>
              </button>

              <a
                href={`https://wa.me/${(companyInfo.director?.whatsapp || companyInfo.phone).replace(/[^0-9]/g, '')}?text=Bonjour%20Vitech%20Africa,%20je%20souhaite%20discuter%20d'un%20projet%20technologique`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Direction (+221 77 483 30 10)</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Contact Form & Direct Contacts */}
      <ContactSection initialData={initialData} />

    </div>
  );
};
