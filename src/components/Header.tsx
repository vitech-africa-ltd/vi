import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Lock, 
  MessageSquare, 
  Briefcase, 
  Calendar,
  Shield,
  ArrowRight,
  Phone,
  Mail,
  LogIn,
  LogOut,
  ChevronDown,
  Coins,
  Calculator,
  Globe2,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { useSiteData } from '../context/SiteDataContext';
import { useCurrency } from '../context/CurrencyContext';
import { useCountry } from '../context/CountryContext';
import { VitechLogo } from './VitechLogo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { CurrencySwitcher } from './CurrencySwitcher';

interface HeaderProps {
  activeView?: string;
  setActiveView?: (view: string) => void;
  onOpenLiveChat?: () => void;
  onOpenQuoteEstimator?: () => void;
  onOpenChat?: () => void;
  onOpenScheduleModal?: () => void;
  onOpenAdminPortal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView = 'home',
  setActiveView,
  onOpenLiveChat,
  onOpenQuoteEstimator,
  onOpenChat,
  onOpenScheduleModal,
  onOpenAdminPortal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signInWithGoogle, signOut, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const { companyInfo } = useSiteData();
  const { currencyOption, openConverterModal } = useCurrency();
  const { currentCountry, openCountryModal } = useCountry();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleOpenChat = onOpenChat || onOpenLiveChat || (() => {});
  const handleOpenSchedule = onOpenScheduleModal || (() => {});
  const handleOpenAdmin = onOpenAdminPortal || (() => {});

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Logical and standard website navigation hierarchy with multilingual keys
  const navLinks = [
    { id: 'home', labelKey: 'nav.home', defaultLabel: 'Accueil' },
    { id: 'services', labelKey: 'nav.services', defaultLabel: 'Services' },
    { id: 'portfolio', labelKey: 'nav.portfolio', defaultLabel: 'Réalisations' },
    { id: 'estimator', labelKey: 'nav.estimator', defaultLabel: 'Devis en Ligne' },
    { id: 'tech-hubs', labelKey: 'nav.techHubs', defaultLabel: 'Hubs Panafricains' },
    { id: 'client-portal', labelKey: 'nav.clientPortal', defaultLabel: 'Espace Client' },
    { id: 'blog', labelKey: 'nav.blog', defaultLabel: 'Blog & R&D' },
    { id: 'contact', labelKey: 'nav.contact', defaultLabel: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    if (setActiveView) {
      setActiveView(id);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.location.hash = id;
    } catch (e) {}
  };

  const isDirector = user?.email === companyInfo.email || user?.email === companyInfo.director?.email;

  return (
    <header
      id="main-header"
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      {/* TOP UTILITY BAR (Desktop & Tablet) */}
      <div className="bg-slate-950 text-slate-300 text-[11px] border-b border-slate-800/90 px-3 sm:px-6 lg:px-8 py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left: SLA & Direct Director Contacts */}
          <div className="flex items-center gap-2.5 lg:gap-4 overflow-hidden">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SLA {companyInfo.stats.uptimeSLA} • {companyInfo.headquarters}</span>
            </div>
            
            <span className="text-slate-700 hidden lg:inline">|</span>
            
            <a
              href={`tel:${companyInfo.phoneRaw || companyInfo.phone}`}
              className="hidden lg:flex items-center gap-1 text-slate-300 hover:text-cyan-400 transition-colors shrink-0"
              title="Ligne directe Direction Générale"
            >
              <Phone className="w-3 h-3 text-cyan-400" />
              <span>Ligne Directe : <strong>{companyInfo.phone}</strong></span>
            </a>
            
            <span className="text-slate-700">|</span>
            
            <a
              href={companyInfo.director?.whatsappUrl || `https://wa.me/${companyInfo.whatsappRaw || '250795507001'}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 transition-colors shrink-0"
              title="WhatsApp Officiel Direction"
            >
              <MessageSquare className="w-3 h-3 text-emerald-400" />
              <span>WhatsApp Dir. : <strong>{companyInfo.whatsapp}</strong></span>
            </a>
          </div>

          {/* Right: Country + Currency Selector + Converter Trigger + Language + Admin */}
          <div className="flex items-center gap-2 lg:gap-3 shrink-0">
            
            {/* Country Selector Button */}
            <button
              onClick={() => openCountryModal()}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-[11px] font-bold transition-all cursor-pointer hover:border-slate-700 shadow-2xs"
              title="Changer de pays / localisation"
            >
              <span className="text-xs leading-none">{currentCountry.flag}</span>
              <span className="font-semibold text-slate-300 hidden xl:inline">{currentCountry.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            <span className="text-slate-700">|</span>

            {/* Currency Converter & Switcher */}
            <div className="flex items-center gap-1">
              <CurrencySwitcher variant="header-utility" />
              <button
                onClick={() => openConverterModal()}
                className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-400 border border-cyan-800/60 text-[10px] font-bold transition-all cursor-pointer"
                title="Calculateur & Convertisseur multi-devises interactif"
              >
                <Calculator className="w-2.5 h-2.5" />
                <span>Calculateur</span>
              </button>
            </div>

            <span className="text-slate-700">|</span>

            {/* Language Switcher in utility bar */}
            <LanguageSwitcher variant="header" />

            <span className="text-slate-700">|</span>

            {/* Direct Admin Access */}
            <button
              onClick={handleOpenAdmin}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 border border-amber-500/30 text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
            >
              <Lock className="w-2.5 h-2.5" />
              <span>{t('nav.admin', 'Admin CMS')}</span>
            </button>
          </div>

        </div>
      </div>

      {/* PRIMARY NAVIGATION BAR */}
      <div
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-md py-2 sm:py-2.5'
            : 'bg-white border-b border-slate-200 py-2.5 sm:py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2">
            
            {/* Official Brand Logo */}
            <button
              id="brand-logo-btn"
              onClick={() => handleNavClick('home')}
              className="flex items-center group text-left focus:outline-none cursor-pointer shrink-0"
              aria-label="Retour à l'accueil"
            >
              <VitechLogo variant="horizontal" size="md" />
            </button>

            {/* Desktop Navigation Links — Ordered Logically */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 text-[11px] xl:text-xs font-bold tracking-wider text-slate-700">
              {navLinks.map((link) => {
                const isActive = activeView === link.id;
                return (
                  <button
                    key={link.id}
                    id={`nav-${link.id}`}
                    onClick={() => handleNavClick(link.id)}
                    className={`px-2 xl:px-2.5 py-1.5 rounded-xl transition-all cursor-pointer uppercase ${
                      isActive 
                        ? 'text-[#1a44c2] bg-blue-50/90 font-black shadow-xs' 
                        : 'text-slate-700 hover:text-[#1a44c2] hover:bg-slate-50'
                    }`}
                  >
                    {t(link.labelKey, link.defaultLabel)}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              
              {/* Quick Currency Selector (for Mobile & Medium screen widths) */}
              <div className="inline-block md:hidden">
                <button
                  onClick={() => openConverterModal()}
                  className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800"
                  title="Devise et Convertisseur"
                >
                  <span>{currencyOption.flag}</span>
                  <span className="font-mono text-[11px] text-blue-700">{currencyOption.code}</span>
                </button>
              </div>

              {/* WhatsApp Directeur Direct Chat Pill */}
              <a
                href={companyInfo.director?.whatsappUrl || `https://wa.me/${companyInfo.whatsappRaw || '250795507001'}`}
                target="_blank"
                rel="noreferrer"
                className="hidden xl:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-200 hover:border-emerald-300 transition-all cursor-pointer shadow-2xs"
                title="Discuter directement avec la Direction Générale sur WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600/20" />
                <span>{t('nav.whatsappDir', 'WhatsApp Dir.')}</span>
              </a>

              {/* User Account / Google Auth Dropdown */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 hover:border-blue-300 transition-all cursor-pointer"
                  >
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName || 'Client'} 
                        className="w-6 h-6 rounded-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-slate-800 hidden sm:inline truncate max-w-[80px]">
                      {user.displayName?.split(' ')[0] || 'Client'}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.displayName || 'Utilisateur Connecté'}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        {isDirector && (
                          <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                            <Shield className="w-2.5 h-2.5 text-amber-600" />
                            Directeur Général
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleNavClick('client-portal');
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                        <span>Portail &amp; Projets Client</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleOpenAdmin();
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-amber-700 hover:bg-amber-50 transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Espace Administration</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          signOut();
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t('nav.logout', 'Déconnexion')}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => signInWithGoogle()}
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-700 px-3 py-1.5 rounded-full border border-slate-200 hover:border-blue-400 bg-slate-50 transition-all cursor-pointer shadow-2xs"
                >
                  <LogIn className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t('nav.login', 'Connexion')}</span>
                </button>
              )}

              {/* Consultation Call CTA (Tablet & Desktop) */}
              <button
                onClick={handleOpenSchedule}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-700 px-3 py-1.5 rounded-full border border-slate-300 hover:border-blue-500 transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-blue-700" />
                <span>{t('nav.bookCall', 'Appel 30 min')}</span>
              </button>

              {/* Primary Action Button (DEMANDER UN DEVIS) */}
              <button
                id="header-get-started-btn"
                onClick={() => handleNavClick('estimator')}
                className="bg-[#1a44c2] hover:bg-[#1437a3] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-md shadow-blue-700/25 hover:shadow-lg active:scale-95 transition-all cursor-pointer inline-flex items-center gap-1 sm:gap-1.5 shrink-0"
              >
                <span>{t('nav.ctaQuote', 'DEVIS')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Mobile Menu Hamburger Toggle */}
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 lg:hidden text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl focus:outline-none transition-colors cursor-pointer"
                aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* RESPONSIVE MOBILE & TABLET DRAWER WITH BACKDROP */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[54px] sm:top-[60px] z-50 lg:hidden flex flex-col justify-start">
          {/* Backdrop Blur Overlay */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative bg-white border-b border-slate-200 px-4 pt-3 pb-8 space-y-4 shadow-2xl max-h-[calc(100vh-60px)] overflow-y-auto z-10 animate-in fade-in slide-in-from-top-3">
            
            {/* Country Selector in Mobile Drawer */}
            <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl leading-none">{currentCountry.flag}</span>
                <div>
                  <div className="text-xs font-bold text-slate-900">Pays : {currentCountry.name}</div>
                  <div className="text-[10px] text-slate-500">{currentCountry.localHub}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openCountryModal();
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                Changer
              </button>
            </div>

            {/* Currency Converter & Switcher in Mobile Drawer */}
            <CurrencySwitcher variant="mobile" />

            {/* Language Switcher in Mobile Drawer */}
            <LanguageSwitcher variant="mobile" />

            {/* Director Quick Contact Badges on Mobile */}
            <div className="p-3.5 rounded-2xl bg-slate-900 text-white space-y-2.5 shadow-md">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-100">{companyInfo.name}</span>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {t('nav.online', 'En Ligne')}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href={`tel:${companyInfo.phoneRaw || companyInfo.phone}`}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center gap-2 text-cyan-300 font-bold border border-slate-700"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Appeler Dir.</span>
                </a>
                <a
                  href={companyInfo.director?.whatsappUrl || `https://wa.me/${companyInfo.whatsappRaw || '250795507001'}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 hover:bg-emerald-900 flex items-center justify-center gap-2 text-emerald-300 font-bold"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Dir.</span>
                </a>
              </div>
            </div>

            {/* Section: Menu Principal */}
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-1">
                Navigation
              </p>
              <div className="grid grid-cols-1 gap-1">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-between cursor-pointer ${
                      activeView === link.id 
                        ? 'bg-blue-50 text-[#1a44c2] font-black' 
                        : 'text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <span>{t(link.labelKey, link.defaultLabel)}</span>
                    <ChevronDown className="w-3 h-3 -rotate-90 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Section: Espace Administration */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-1.5">
                Gestion de Contenu &amp; Direction
              </p>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenAdmin();
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-extrabold tracking-wider text-amber-800 bg-amber-50 hover:bg-amber-100 transition-colors uppercase flex items-center justify-between border border-amber-200/60 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Espace Administration (CMS)</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200/60 text-amber-900 font-bold">
                  Direction
                </span>
              </button>
            </div>

            {/* Section: Actions & Google Sign In */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              {!isAuthenticated ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signInWithGoogle();
                  }}
                  className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 border border-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <LogIn className="w-4 h-4 mr-2 text-blue-600" />
                  {t('nav.login', 'Connexion avec Google')}
                </button>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 text-xs border border-blue-100">
                  <span className="font-semibold text-blue-900 truncate">Connecté : {user?.email}</span>
                  <button
                    onClick={() => signOut()}
                    className="text-rose-600 font-bold ml-2 shrink-0 hover:underline cursor-pointer"
                  >
                    {t('nav.logout', 'Déconnexion')}
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenChat();
                }}
                className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat avec un Ingénieur
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenSchedule();
                }}
                className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#1a44c2] hover:bg-[#1437a3] shadow-md transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4 mr-2" />
                {t('nav.bookCall', 'Réserver un Appel Technique (30 min)')}
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
