import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Twitter, 
  ArrowUp, 
  CheckCircle2,
  Coins,
  Sparkles,
  Code2,
  Users,
  HelpCircle
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { useTranslation } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { VitechLogo } from './VitechLogo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { CurrencySwitcher } from './CurrencySwitcher';
import { Newsletter } from './Newsletter';
import { VisitorCounterBadge } from './VisitorCounterBadge';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenScheduleModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenScheduleModal }) => {
  const { companyInfo, services } = useSiteData();
  const { t } = useTranslation();
  const { openConverterModal } = useCurrency();
  const [legalModal, setLegalModal] = useState<string | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#020617] text-slate-100 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        
        {/* TOP SECTION: Integrated Footer Newsletter Bar */}
        <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/40 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
            <div className="lg:col-span-6 space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 text-xs font-mono font-semibold border border-cyan-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Vitech Engineering Dispatch • Actualités Tech &amp; Scripts</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Abonnez-vous aux <span className="text-cyan-400">Actualités Technologiques</span> de Vitech Africa
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
                Recevez nos analyses d'architecture logicielle, sorties de scripts &amp; templates open-source/premium, et veille en cybersécurité africaine.
              </p>
            </div>

            <div className="lg:col-span-6">
              <Newsletter variant="footer" />
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-900">
          
          {/* Col 1: Brand & Identity (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center space-x-3">
              <VitechLogo variant="badge" size="lg" />
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-lg font-black tracking-tight text-white">
                    {companyInfo.name || 'V&I TECH AFRICA LTD'}
                  </span>
                </div>
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block mt-1">
                  {companyInfo.motto || 'INNOVATE • DEVELOP • GROW'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {companyInfo.tagline || t('footer.desc', 'Partenaire technologique de référence en ingénierie logicielle avancée, développement SaaS, infrastructures Cloud DevOps et cybersécurité.')}
            </p>

            <div className="pt-2 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{companyInfo.headquarters} • {companyInfo.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <a href={`mailto:${companyInfo.email}`} className="hover:text-white transition-colors">{companyInfo.email}</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{companyInfo.phone} ({companyInfo.businessHours})</span>
              </div>
            </div>

            {/* Currency & Language Controls in Footer */}
            <div className="pt-3 flex flex-wrap items-center gap-2">
              <LanguageSwitcher variant="footer" />
              <button
                onClick={() => openConverterModal()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
                title="Convertisseur de Devises Panafricain"
              >
                <Coins className="w-3.5 h-3.5 text-cyan-400" />
                <span>Convertisseur de Devises</span>
              </button>
            </div>
          </div>

          {/* Col 2: Services Dynamiques */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              {t('footer.poles', 'Pôles d\'Expertise')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {services.slice(0, 5).map((s) => (
                <li key={s.id}>
                  <button 
                    onClick={() => onNavigate('services')}
                    className="hover:text-cyan-400 transition-colors text-left truncate max-w-full cursor-pointer"
                  >
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Navigation Rapide & Vitech Scripts */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              {t('footer.navigation', 'Navigation & Plateformes')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('scripts')} className="text-cyan-400 font-bold hover:underline flex items-center gap-1 cursor-pointer">
                  <Code2 className="w-3 h-3" />
                  <span>Vitech Scripts (Marketplace)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('team')} className="text-amber-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer">
                  <Users className="w-3 h-3" />
                  <span>Notre Équipe (Team)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tech-lab')} className="text-purple-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer">
                  <Sparkles className="w-3 h-3" />
                  <span>Lab R&amp;D &amp; Écosystème</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  {t('nav.services', 'Services')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('portfolio')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  {t('nav.portfolio', 'Portfolio')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('estimator')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  {t('nav.estimator', 'Devis en Ligne')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tech-hubs')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  {t('nav.hubs', 'Hubs & Présence')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('client-portal')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  {t('nav.clientPortal', 'Espace Client')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  {t('nav.blog', 'Blog & Publications')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="text-cyan-300 font-semibold hover:text-cyan-200 transition-colors cursor-pointer flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-cyan-400" />
                  <span>{t('nav.faq', 'Foire Aux Questions (FAQ)')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  {t('nav.contact', 'Contact')}
                </button>
              </li>
              <li>
                <button onClick={onOpenScheduleModal} className="text-emerald-400 font-semibold hover:underline cursor-pointer">
                  {t('nav.schedule', 'Cadrage Technique (30 min)')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Sécurité & Conformité */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Sécurité &amp; Conformité
            </h4>
            
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
              <span className="font-semibold text-cyan-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Normes OWASP &amp; ISO
              </span>
              <p className="text-[11px] text-slate-400">Audit de code continu, chiffrement AES-256 et MFA WebAuthn.</p>
            </div>

            {/* Live Visitor Counter Widget in Footer */}
            <VisitorCounterBadge variant="footer" className="w-full" />

            {/* Social Icons */}
            <div className="flex items-center space-x-2 pt-1">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Sub-Footer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} {companyInfo.name || 'V&I TECH AFRICA LTD'}. Tous droits réservés.
          </div>

          <div className="flex items-center space-x-3">
            <button onClick={() => setLegalModal('rgpd')} className="hover:text-slate-300 cursor-pointer">
              Confidentialité &amp; RGPD
            </button>
            <span>•</span>
            <button onClick={() => setLegalModal('cgv')} className="hover:text-slate-300 cursor-pointer">
              Conditions de Service
            </button>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="p-1.5 px-2 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              title="Retour en haut"
            >
              <ArrowUp className="w-3 h-3" />
              <span className="text-[11px]">Haut</span>
            </button>
          </div>
        </div>

      </div>

      {/* Modal for Legal / RGPD */}
      {legalModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-100">
                {legalModal === 'rgpd' ? 'Politique de Confidentialité & RGPD' : 'Conditions Générales de Service'}
              </h3>
              <button 
                onClick={() => setLegalModal(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {legalModal === 'rgpd' 
                ? 'Vitech Africa s\'engage à protéger la confidentialité de vos données personnelles et professionnelles. Aucune donnée saisie dans nos calculateurs ou portails n\'est cédée à des tiers sans votre consentement explicite.'
                : 'Nos prestations d\'ingénierie logicielle, de maintenance et d\'infogérance cloud sont régies par nos accords de niveau de service (SLA 99.99%) et des contrats de cession totale des droits de propriété intellectuelle au client.'}
            </p>
            <div className="pt-2 text-right">
              <button
                onClick={() => setLegalModal(null)}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
