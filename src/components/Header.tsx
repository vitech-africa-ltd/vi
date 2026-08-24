import React, { useEffect, useState } from 'react';
import {
  Menu,
  X,
  Lock,
  MessageCircle,
  Briefcase,
  Calendar,
  Shield,
  ArrowRight,
  Phone,
  LogIn,
  LogOut,
  ChevronDown,
  FileText,
  Calculator,
  Sun,
  Moon,
  Globe2,
  MapPin,
  Code2,
  Database,
  Smartphone,
  Cloud,
  BarChart3,
  Sparkles,
  Rocket,
  Headphones,
  CheckCircle2,
  Zap,
  Search,
  HelpCircle,
  Users,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/LanguageContext';
import { useSiteData } from '../context/SiteDataContext';
import { useCurrency } from '../context/CurrencyContext';
import { useCountry } from '../context/CountryContext';
import { VitechLogo } from './VitechLogo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { CurrencySwitcher } from './CurrencySwitcher';
import { MobileMenuBurger } from './MobileMenuBurger';
import { LiveAnnouncementBanner } from './LiveAnnouncementBanner';

interface HeaderProps {
  activeView?: string;
  setActiveView?: (view: string) => void;
  onOpenLiveChat?: () => void;
  onOpenQuoteEstimator?: () => void;
  onOpenChat?: () => void;
  onOpenScheduleModal?: () => void;
  onOpenAdminPortal?: () => void;
  onOpenSearch?: () => void;
}

type SubMenuItem = {
  label: string;
  description?: string;
  icon: React.ElementType;
  view: string;
  badge?: string;
};

type NavItem = {
  id: string;
  labelKey: string;
  defaultLabel: string;
  featured?: boolean;
  isMoreMenu?: boolean;
  submenu?: SubMenuItem[];
};

export const Header: React.FC<HeaderProps> = ({
  activeView = 'home',
  setActiveView,
  onOpenLiveChat,
  onOpenQuoteEstimator,
  onOpenChat,
  onOpenScheduleModal,
  onOpenAdminPortal,
  onOpenSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileQuickActionsOpen, setMobileQuickActionsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null);
  const [openMobileMenu, setOpenMobileMenu] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { user, signInWithGoogle, signOut, isAuthenticated } = useAuth();
  const { mode, toggleTheme, setMode } = useTheme();
  const { t } = useTranslation();
  const { companyInfo } = useSiteData();
  const { currencyOption, openConverterModal } = useCurrency();
  const { currentCountry, openCountryModal } = useCountry();

  const handleOpenChat = onOpenChat || onOpenLiveChat || (() => {});
  const handleOpenQuote = onOpenQuoteEstimator || (() => {});
  const handleOpenSchedule = onOpenScheduleModal || (() => {});
  const handleOpenAdmin = onOpenAdminPortal || (() => {});

  /*
   * ============================================================
   * NAVIGATION DATA
   * ============================================================
   */

  const navLinks: NavItem[] = [
    {
      id: 'home',
      labelKey: 'nav.home',
      defaultLabel: 'Home',
    },

    {
      id: 'services',
      labelKey: 'nav.services',
      defaultLabel: 'Services',
      submenu: [
        {
          label: 'Développement Web',
          description: 'Applications web rapides, SaaS et portails',
          icon: Code2,
          view: 'services',
        },
        {
          label: 'Applications Mobile',
          description: 'iOS, Android & solutions Flutter cross-platform',
          icon: Smartphone,
          view: 'services',
        },
        {
          label: 'Cloud & DevOps',
          description: 'Infrastructure haute disponibilité & CI/CD',
          icon: Cloud,
          view: 'services',
        },
        {
          label: 'Data & IA',
          description: 'Automatisation, LLMs, RAG & analytics',
          icon: BarChart3,
          view: 'services',
        },
      ],
    },

    {
      id: 'portfolio',
      labelKey: 'nav.portfolio',
      defaultLabel: 'Portfolio',
      submenu: [
        {
          label: 'Études de cas',
          description: 'Nos projets et architectures à fort impact',
          icon: Briefcase,
          view: 'portfolio',
        },
        {
          label: 'Fintech & Paiement',
          description: 'Passerelles MoMo, banques & solutions sécurisées',
          icon: Database,
          view: 'portfolio',
        },
        {
          label: 'Agritech & IA',
          description: 'Solutions intelligentes adaptées à l’Afrique',
          icon: Sparkles,
          view: 'portfolio',
        },
      ],
    },

    {
      id: 'blog',
      labelKey: 'nav.blog',
      defaultLabel: 'Blog & R&D',
      submenu: [
        {
          label: 'Technologie & Architecture',
          description: 'Tendances, bonnes pratiques & code 2026',
          icon: Code2,
          view: 'blog',
        },
        {
          label: 'Innovation & IA',
          description: 'Intelligence artificielle & transformation digitale',
          icon: Rocket,
          view: 'blog',
        },
        {
          label: 'Laboratoire R&D',
          description: 'Expérimentations et prototypes technologiques',
          icon: Sparkles,
          view: 'blog',
        },
      ],
    },

    {
      id: 'scripts',
      labelKey: 'nav.scripts',
      defaultLabel: 'Vitech Scripts',
      featured: true,
      submenu: [
        {
          label: 'Marketplace Scripts & Apps',
          description: 'Téléchargez des codes sources audités et prêts à l’emploi',
          icon: Code2,
          view: 'scripts',
        },
        {
          label: 'Espace Membre & Téléchargements',
          description: 'Clés de licence, archives sécurisées & mises à jour',
          icon: Shield,
          view: 'scripts-member',
        },
        {
          label: 'Analyseur de Code IA & Admin',
          description: 'Analyse automatique de ZIP et monitoring',
          icon: Sparkles,
          view: 'scripts-admin',
        },
        {
          label: 'Livrables & Architecture PHP 8.4',
          description: 'Schémas MySQL 8, Architecture MVC & API REST',
          icon: Database,
          view: 'scripts-deliverables',
        },
      ],
    },

    {
      id: 'contact',
      labelKey: 'nav.contact',
      defaultLabel: 'Contact',
    },

    {
      id: 'more',
      labelKey: 'nav.more',
      defaultLabel: 'Plus',
      isMoreMenu: true,
      submenu: [
        {
          label: 'FAQ & Help Center',
          description: 'Questions techniques, devises, propriété intellectuelle & garanties SLA',
          icon: HelpCircle,
          view: 'faq',
          badge: 'SUPPORT',
        },
        {
          label: 'Notre Équipe & Direction',
          description: 'Architectes logiciels, ingénieurs Cloud/IA et directeurs de projets',
          icon: Users,
          view: 'team',
          badge: 'EXPERTS',
        },
        {
          label: 'Simulateur de Devis en Ligne',
          description: 'Chiffrage budgétaire instantané & sélection de stack personnalisée',
          icon: Calculator,
          view: 'estimator',
          badge: 'POPULAIRE',
        },
        {
          label: 'Lab R&D & Démonstrateurs IA',
          description: 'Matrices d’ingénierie, démonstrations vidéos & grille Banque Mondiale',
          icon: Sparkles,
          view: 'tech-lab',
          badge: 'NOUVEAU',
        },
        {
          label: 'Hubs Panafricains & Présence',
          description: 'Centres régionaux : Rwanda (Kigali HQ), Sénégal, Côte d’Ivoire',
          icon: MapPin,
          view: 'tech-hubs',
        },
        {
          label: 'Portail Client Sécurisé',
          description: 'Suivi des sprints, livrables chiffrés et support technique prioritaire',
          icon: Shield,
          view: 'client-portal',
        },
        {
          label: 'Expertise & Grille Tarifaire',
          description: 'Normes Banque Mondiale 2026 & Stack technique d’ingénierie',
          icon: Globe2,
          view: 'profile',
        },
      ],
    },
  ];

  /*
   * ============================================================
   * EFFECTS
   * ============================================================
   */

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
        setOpenMobileMenu(null);
      }

      if (window.innerWidth < 1024) {
        setOpenDesktopMenu(null);
      }
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  /*
   * ESCAPE
   */

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      setOpenDesktopMenu(null);
      setOpenMobileMenu(null);
      setUserDropdownOpen(false);
      setMobileQuickActionsOpen(false);
      setMobileMenuOpen(false);
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  /*
   * CLICK OUTSIDE
   */

  useEffect(() => {
    if (!openDesktopMenu && !userDropdownOpen && !mobileQuickActionsOpen) return;

    const handleClickOutside = () => {
      setOpenDesktopMenu(null);
      setUserDropdownOpen(false);
      setMobileQuickActionsOpen(false);
    };

    const timer = window.setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openDesktopMenu, userDropdownOpen, mobileQuickActionsOpen]);

  /*
   * BODY SCROLL LOCK WHEN MOBILE MENU IS OPEN
   */

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  /*
   * ============================================================
   * HELPERS
   * ============================================================
   */

  const handleNavClick = (id: string) => {
    setActiveView?.(id);

    setMobileMenuOpen(false);
    setOpenDesktopMenu(null);
    setOpenMobileMenu(null);
    setUserDropdownOpen(false);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    try {
      window.location.hash = id;
    } catch {
      // Ignore hash errors.
    }
  };

  const handleMobileParentClick = (link: NavItem) => {
    if (link.submenu?.length) {
      setOpenMobileMenu((current) =>
        current === link.id ? null : link.id
      );
      return;
    }

    handleNavClick(link.id);
  };

  /*
   * ============================================================
   * USER / COMPANY
   * ============================================================
   */

  const isDirector =
    user?.email === companyInfo.email ||
    user?.email === companyInfo.director?.email;

  const whatsappUrl =
    companyInfo.director?.whatsappUrl ||
    `https://wa.me/${companyInfo.whatsappRaw || '250795507001'}`;

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <header
      id="main-header"
      className="fixed inset-x-0 top-0 z-[140]"
    >
      {/* Live Real-time Announcement Banner */}
      <LiveAnnouncementBanner onNavigate={(view) => handleNavClick(view)} />

      {/* ========================================================
          TOP UTILITY BAR
      ======================================================== */}

      <div className="relative z-20 hidden border-b border-slate-800/80 bg-slate-950 md:block">
        <div className="mx-auto flex h-8 max-w-[1500px] items-center justify-between px-4 xl:px-6 2xl:px-8">
          {/* LEFT */}

          <div className="flex min-w-0 items-center gap-3 text-[10px]">
            <div className="flex shrink-0 items-center gap-1.5 font-bold text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

              <span>
                SLA {companyInfo.stats.uptimeSLA}
              </span>
            </div>

            <span className="text-slate-700">•</span>

            <div className="hidden items-center gap-1.5 text-slate-400 lg:flex">
              <Globe2 className="h-3 w-3 text-cyan-400" />

              <span className="max-w-[260px] truncate">
                {companyInfo.headquarters}
              </span>
            </div>

            <span className="hidden text-slate-700 lg:inline">
              •
            </span>

            <a
              href={`tel:${companyInfo.phoneRaw || companyInfo.phone}`}
              className="hidden items-center gap-1.5 text-slate-400 transition hover:text-cyan-300 xl:flex"
            >
              <Phone className="h-3 w-3 text-cyan-400" />

              <span>
                Ligne directe :
                <strong className="ml-1 text-slate-300">
                  {companyInfo.phone}
                </strong>
              </span>
            </a>
          </div>

          {/* RIGHT */}

          <div className="flex shrink-0 items-center gap-1.5">
            {/* COUNTRY */}

            <button
              onClick={() => openCountryModal()}
              className="
                inline-flex h-6 items-center gap-1
                rounded-md border border-slate-800
                bg-slate-900 px-2
                text-[10px] font-bold text-slate-300
                transition
                hover:border-slate-700
                hover:bg-slate-800
                hover:text-white
              "
            >
              <span>{currentCountry.flag}</span>

              <span className="hidden xl:inline">
                {currentCountry.name}
              </span>

              <ChevronDown className="h-3 w-3 text-slate-500" />
            </button>

            <span className="text-slate-800">|</span>

            {/* CURRENCY */}

            <CurrencySwitcher variant="header-utility" />

            <button
              onClick={() => openConverterModal()}
              className="
                hidden h-6 items-center gap-1
                rounded-md border border-cyan-800/60
                bg-cyan-950/50 px-2
                text-[10px] font-bold text-cyan-300
                transition
                hover:bg-cyan-900/50
                xl:inline-flex
              "
            >
              <Calculator className="h-3 w-3" />

              Calculateur
            </button>

            <span className="text-slate-800">|</span>

            {/* LANGUAGE */}

            <LanguageSwitcher variant="header" />

            {/* THEME SWITCHER */}

            <button
              onClick={toggleTheme}
              className="
                inline-flex h-6 items-center gap-1.5
                rounded-md border border-slate-700/90
                bg-slate-900 px-2
                text-[10px] font-bold text-slate-300
                transition-all duration-200 cursor-pointer
                hover:border-slate-600 hover:bg-slate-800 hover:text-white
                active:scale-95 shadow-xs
              "
              aria-label="Changer le thème"
              title={mode === 'dark' ? "Passer en mode clair" : "Passer en mode sombre"}
            >
              {mode === 'dark' ? (
                <Sun className="h-3 w-3 text-amber-400 shrink-0" />
              ) : (
                <Moon className="h-3 w-3 text-cyan-300 shrink-0" />
              )}

              <span className="inline">
                {mode === 'dark' ? 'Clair' : 'Sombre'}
              </span>
            </button>

            {/* ADMIN */}

            <button
              onClick={handleOpenAdmin}
              className="
                inline-flex h-6 items-center gap-1
                rounded-md border border-amber-500/30
                bg-amber-500/10 px-2
                text-[9px] font-black uppercase
                tracking-wide text-amber-300
                transition
                hover:bg-amber-500/20
              "
            >
              <Lock className="h-3 w-3" />

              <span className="hidden sm:inline">
                Admin
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          MAIN NAVIGATION
      ======================================================== */}

      <div
        className={`
          relative z-10
          border-b
          transition-all duration-300
          ${
            isScrolled
              ? `
                border-slate-800/90
                bg-slate-950/95
                py-1.5
                shadow-2xl
                shadow-black/20
                backdrop-blur-2xl
              `
              : `
                border-slate-800
                bg-slate-950
                py-2.5
              `
          }
        `}
      >
        <div className="mx-auto max-w-[1500px] px-3 sm:px-5 xl:px-6 2xl:px-8">
          <div className="flex min-h-[54px] items-center gap-3">
            {/* ==================================================
                LOGO
            ================================================== */}

            <button
              id="brand-logo-btn"
              onClick={() => handleNavClick('home')}
              className="
                group shrink-0
                text-left
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-cyan-400
                focus-visible:ring-offset-2
                focus-visible:ring-offset-slate-950
              "
              aria-label="Retour à l'accueil"
            >
              <VitechLogo
                variant="horizontal"
                size="md"
              />
            </button>

            {/* ==================================================
                DESKTOP NAVIGATION
            ================================================== */}

            <nav
              className="
                ml-auto
                hidden
                items-center
                gap-0.5
                lg:flex
              "
              aria-label="Navigation principale"
            >
              {navLinks.map((link) => {
                const active =
                  activeView === link.id ||
                  link.submenu?.some(
                    (item) => item.view === activeView
                  );

                const hasSubmenu =
                  Boolean(link.submenu?.length);

                /*
                 * SIMPLE LINK
                 */

                if (!hasSubmenu) {
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleNavClick(link.id)}
                      className={`
                        relative
                        inline-flex
                        h-9
                        items-center
                        gap-1.5
                        rounded-lg
                        px-2.5
                        text-[11px]
                        font-bold
                        tracking-wide
                        transition-all
                        xl:px-3
                        ${
                          active
                            ? `
                              bg-cyan-500/10
                              text-cyan-300
                            `
                            : `
                              text-slate-300
                              hover:bg-slate-900
                              hover:text-white
                            `
                        }
                        ${
                          link.featured
                            ? `
                              text-cyan-300
                              hover:bg-cyan-500/10
                            `
                            : ''
                        }
                      `}
                    >
                      {link.featured && (
                        <Sparkles className="h-3.5 w-3.5" />
                      )}

                      <span>
                        {t(
                          link.labelKey,
                          link.defaultLabel
                        )}
                      </span>

                      {link.featured && (
                        <span
                          className="
                            absolute
                            -right-1
                            -top-2
                            rounded-full
                            bg-emerald-400
                            px-1.5
                            py-0.5
                            text-[7px]
                            font-black
                            text-slate-950
                          "
                        >
                          POPULAIRE
                        </span>
                      )}
                    </button>
                  );
                }

                /*
                 * DROPDOWN
                 */

                return (
                  <div
                    key={link.id}
                    className="relative"
                    onMouseEnter={() =>
                      setOpenDesktopMenu(link.id)
                    }
                  >
                    <button
                      onClick={(event) => {
                        event.stopPropagation();

                        setOpenDesktopMenu(
                          (current) =>
                            current === link.id
                              ? null
                              : link.id
                        );
                      }}
                      className={`
                        inline-flex
                        h-9
                        items-center
                        gap-1
                        rounded-lg
                        px-2.5
                        text-[11px]
                        font-bold
                        tracking-wide
                        transition-all
                        xl:px-3
                        ${
                          active ||
                          openDesktopMenu === link.id
                            ? `
                              bg-cyan-500/10
                              text-cyan-300
                            `
                            : `
                              text-slate-300
                              hover:bg-slate-900
                              hover:text-white
                            `
                        }
                      `}
                      aria-expanded={
                        openDesktopMenu === link.id
                      }
                      aria-haspopup="true"
                    >
                      <span>
                        {t(
                          link.labelKey,
                          link.defaultLabel
                        )}
                      </span>

                      <ChevronDown
                        className={`
                          h-3 w-3
                          transition-transform
                          ${
                            openDesktopMenu === link.id
                              ? 'rotate-180'
                              : ''
                          }
                        `}
                      />
                    </button>

                    {/* DROPDOWN PANEL */}

                    {openDesktopMenu === link.id && (
                      <div
                        className={`
                          absolute
                          top-full
                          z-[150]
                          ${link.id === 'more' ? 'w-[400px]' : 'w-[380px]'}
                          max-w-[calc(100vw-32px)]
                          pt-3
                          ${
                            link.id === 'services' || link.id === 'portfolio'
                              ? 'left-0'
                              : 'right-0'
                          }
                        `}
                        onMouseEnter={() =>
                          setOpenDesktopMenu(link.id)
                        }
                        onClick={(event) =>
                          event.stopPropagation()
                        }
                      >
                        <div
                          className="
                            overflow-hidden
                            rounded-2xl
                            border
                            border-slate-700/80
                            bg-slate-950/98
                            shadow-[0_24px_70px_rgba(0,0,0,0.45)]
                            backdrop-blur-2xl
                          "
                        >
                          {/* HEADER */}

                          <div
                            className="
                              border-b
                              border-slate-800
                              bg-gradient-to-r
                              from-cyan-500/10
                              via-cyan-500/5
                              to-transparent
                              px-4
                              py-3
                            "
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p
                                  className="
                                    text-[10px]
                                    font-black
                                    uppercase
                                    tracking-[0.18em]
                                    text-cyan-400
                                  "
                                >
                                  {t(
                                    link.labelKey,
                                    link.defaultLabel
                                  )}
                                </p>

                                <p className="mt-0.5 text-[10px] text-slate-400">
                                  {link.id === 'more'
                                    ? 'FAQ & Support, Équipe d’ingénierie, Hubs & Outils'
                                    : link.id === 'services'
                                    ? 'Nos pôles d’ingénierie logicielle & cloud'
                                    : link.id === 'portfolio'
                                    ? 'Nos études de cas & réalisations déployées'
                                    : link.id === 'blog'
                                    ? 'Articles tech, innovations & publications R&D'
                                    : link.id === 'scripts'
                                    ? 'Marketplace de codes sources audités & licences'
                                    : 'Découvrez nos solutions et expertises'}
                                </p>
                              </div>

                              <div
                                className="
                                  flex h-8 w-8
                                  items-center
                                  justify-center
                                  rounded-lg
                                  bg-cyan-500/10
                                  text-cyan-400
                                "
                              >
                                <Sparkles className="h-4 w-4" />
                              </div>
                            </div>
                          </div>

                          {/* THEME MODE TOGGLE (Specific to 'More' / Plus Menu) */}
                          {link.id === 'more' && (
                            <div className="mx-2 mt-2 mb-1 p-2.5 rounded-xl border border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-xs">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div
                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all ${
                                      mode === 'dark'
                                        ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300'
                                        : 'border-amber-500/40 bg-amber-500/15 text-amber-400'
                                    }`}
                                  >
                                    {mode === 'dark' ? (
                                      <Moon className="h-4 w-4" />
                                    ) : (
                                      <Sun className="h-4 w-4" />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-bold text-slate-100">
                                        Thème Visuel
                                      </span>
                                      <span
                                        className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md border ${
                                          mode === 'dark'
                                            ? 'bg-slate-800 text-cyan-300 border-slate-700'
                                            : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                        }`}
                                      >
                                        {mode === 'dark' ? 'Sombre' : 'Clair'}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 truncate">
                                      {mode === 'dark'
                                        ? 'Mode haute technologie actif'
                                        : 'Mode contrasté jour actif'}
                                    </p>
                                  </div>
                                </div>

                                {/* Segmented Toggle Buttons */}
                                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setMode('dark');
                                    }}
                                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                      mode === 'dark'
                                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                                        : 'text-slate-400 hover:text-slate-200 border border-transparent'
                                    }`}
                                    title="Basculer en mode sombre"
                                    aria-pressed={mode === 'dark'}
                                  >
                                    <Moon className="h-3 w-3 text-cyan-400" />
                                    <span>Sombre</span>
                                  </button>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setMode('light');
                                    }}
                                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                      mode === 'light'
                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                                        : 'text-slate-400 hover:text-slate-200 border border-transparent'
                                    }`}
                                    title="Basculer en mode clair"
                                    aria-pressed={mode === 'light'}
                                  >
                                    <Sun className="h-3 w-3 text-amber-400" />
                                    <span>Clair</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* ITEMS */}

                          <div className="p-2 space-y-1">
                            {link.submenu?.map(
                              (item) => {
                                const Icon = item.icon;
                                const isItemActive = activeView === item.view;

                                return (
                                  <button
                                    key={`${link.id}-${item.label}`}
                                    onClick={() => {
                                      handleNavClick(item.view);
                                      if (item.view === 'estimator') {
                                        handleOpenQuote();
                                      }
                                    }}
                                    className={`
                                      group
                                      flex
                                      w-full
                                      items-center
                                      gap-3
                                      rounded-xl
                                      p-2.5
                                      text-left
                                      transition-all
                                      cursor-pointer
                                      ${
                                        isItemActive
                                          ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300'
                                          : 'hover:bg-slate-900 border border-transparent text-slate-100'
                                      }
                                    `}
                                  >
                                    {/* ICON */}

                                    <div
                                      className={`
                                        flex
                                        h-10
                                        w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        border
                                        transition-all
                                        ${
                                          isItemActive
                                            ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                                            : 'border-slate-800 bg-slate-900 text-cyan-400 group-hover:border-cyan-500/40 group-hover:bg-cyan-500/10 group-hover:text-cyan-300'
                                        }
                                      `}
                                    >
                                      <Icon className="h-4 w-4" />
                                    </div>

                                    {/* TEXT */}

                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-1.5">
                                        <p
                                          className={`
                                            text-xs
                                            font-bold
                                            transition
                                            ${
                                              isItemActive
                                                ? 'text-cyan-300'
                                                : 'text-slate-100 group-hover:text-cyan-300'
                                            }
                                          `}
                                        >
                                          {item.label}
                                        </p>

                                        {item.badge && (
                                          <span className="rounded-full bg-emerald-400 px-1.5 py-0.5 text-[7.5px] font-black uppercase text-slate-950 shadow-xs">
                                            {item.badge}
                                          </span>
                                        )}
                                      </div>

                                      {item.description && (
                                        <p
                                          className="
                                            mt-0.5
                                            text-[10px]
                                            leading-4
                                            text-slate-400
                                          "
                                        >
                                          {item.description}
                                        </p>
                                      )}
                                    </div>

                                    <ArrowRight
                                      className="
                                        h-3.5
                                        w-3.5
                                        shrink-0
                                        text-slate-600
                                        transition-all
                                        group-hover:translate-x-1
                                        group-hover:text-cyan-400
                                      "
                                    />
                                  </button>
                                );
                              }
                            )}
                          </div>

                          {/* FOOTER */}

                          <div className="border-t border-slate-800 p-2">
                            <button
                              onClick={() => {
                                if (link.id === 'more') {
                                  handleNavClick('estimator');
                                  handleOpenQuote();
                                } else {
                                  handleNavClick(link.id);
                                }
                              }}
                              className="
                                flex
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                border
                                border-slate-800
                                bg-slate-900
                                px-3
                                py-2.5
                                text-[10px]
                                font-black
                                uppercase
                                tracking-wide
                                text-slate-300
                                transition
                                hover:border-cyan-500/30
                                hover:bg-cyan-500/5
                                hover:text-cyan-300
                                cursor-pointer
                              "
                            >
                              <span>
                                {link.id === 'more'
                                  ? 'Calculer un Devis en Ligne'
                                  : 'Voir toute la section'}
                              </span>

                              <ArrowRight className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* ==================================================
                RIGHT ACTIONS (Responsive: Mobile / Tablet / Desktop)
            ================================================== */}

            <div
              className="
                ml-auto
                lg:ml-1
                flex
                shrink-0
                items-center
                gap-1.5
                sm:gap-2.5
                md:gap-3
                lg:gap-2
              "
            >
              {/* MOBILE CONTEXTUAL QUICK ACTIONS (< 640px) */}
              <div className="relative sm:hidden">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileQuickActionsOpen((prev) => !prev);
                    setUserDropdownOpen(false);
                  }}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm ${
                    mobileQuickActionsOpen
                      ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200 ring-2 ring-cyan-500/30'
                      : 'border-slate-700/80 bg-slate-900/90 text-cyan-400 hover:border-cyan-500/50 hover:bg-slate-800'
                  }`}
                  aria-label="Accès rapide"
                  title="Accès rapide"
                  aria-expanded={mobileQuickActionsOpen}
                >
                  <Zap className="h-4 w-4 fill-cyan-400/20 text-cyan-400" />
                </button>

                {mobileQuickActionsOpen && (
                  <div
                    className="absolute right-0 top-full z-[150] mt-2 w-56 max-w-[calc(100vw-24px)] rounded-2xl border border-slate-700/90 bg-slate-950 p-2 shadow-2xl shadow-black/60 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-2.5 py-1.5 border-b border-slate-800/80 mb-1 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
                        Accès Rapide
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setMobileQuickActionsOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/15 hover:text-emerald-200"
                    >
                      <MessageCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>WhatsApp Direct</span>
                    </a>

                    <button
                      onClick={() => {
                        setMobileQuickActionsOpen(false);
                        handleOpenSchedule();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/15 hover:text-cyan-200"
                    >
                      <Calendar className="h-4 w-4 text-cyan-400 shrink-0" />
                      <span>Appel 30 min</span>
                    </button>

                    <button
                      onClick={() => {
                        setMobileQuickActionsOpen(false);
                        if (isAuthenticated) {
                          handleNavClick('client-portal');
                        } else {
                          signInWithGoogle();
                        }
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-semibold text-blue-300 transition hover:bg-blue-500/15 hover:text-blue-200"
                    >
                      <LogIn className="h-4 w-4 text-blue-400 shrink-0" />
                      <span>{isAuthenticated ? 'Espace Projets' : 'Connexion Client'}</span>
                    </button>

                    <div className="my-1 border-t border-slate-800/80" />

                    <button
                      onClick={() => {
                        toggleTheme();
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-xs font-medium text-slate-300 transition hover:bg-slate-800/60"
                    >
                      <span className="flex items-center gap-2">
                        {mode === 'dark' ? (
                          <Sun className="h-3.5 w-3.5 text-amber-400" />
                        ) : (
                          <Moon className="h-3.5 w-3.5 text-cyan-300" />
                        )}
                        <span>{mode === 'dark' ? 'Mode Clair' : 'Mode Sombre'}</span>
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* 1. WHATSAPP ICON BUTTON (Tablet sm+ and Desktop) */}
              <div className="relative group hidden sm:block">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 transition-all duration-300 hover:scale-110 active:scale-95 hover:border-emerald-400 hover:bg-emerald-500/25 hover:text-emerald-300 hover:shadow-lg hover:shadow-emerald-500/25 cursor-pointer shrink-0 shadow-sm"
                  aria-label="WhatsApp"
                  title="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-400 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                </a>
                <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-emerald-900/60 bg-slate-950 px-2 py-1 text-[10px] font-medium text-emerald-300 opacity-0 shadow-xl transition-opacity group-hover:opacity-100 z-50">
                  WhatsApp
                </div>
              </div>

              {/* 2. USER / CONNEXION (If logged in, always show avatar. If not logged in, show on sm+) */}
              {isAuthenticated && user ? (
                <div className="relative group shrink-0">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      setUserDropdownOpen((value) => !value);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 transition-all duration-300 hover:scale-105 active:scale-95 hover:border-blue-500/40 cursor-pointer overflow-hidden shadow-sm"
                    aria-expanded={userDropdownOpen}
                    aria-label="Mon Profil"
                    title={user.displayName || 'Mon Profil'}
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'Client'}
                        className="h-full w-full rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-blue-600 text-xs font-bold text-white">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                  </button>
                  <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-[10px] font-medium text-slate-200 opacity-0 shadow-xl transition-opacity group-hover:opacity-100 z-50">
                    {user.displayName?.split(' ')[0] || 'Mon Compte'}
                  </div>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 top-full z-[150] mt-2 w-64 max-w-[calc(100vw-24px)] rounded-2xl border border-slate-700 bg-slate-950 p-2 shadow-2xl shadow-black/40"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <div className="mb-1 border-b border-slate-800 px-3 py-3">
                        <p className="truncate text-xs font-bold text-white">
                          {user.displayName || 'Utilisateur connecté'}
                        </p>
                        <p className="mt-0.5 truncate text-[10px] text-slate-500">
                          {user.email}
                        </p>
                        {isDirector && (
                          <div className="mt-2 inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold text-amber-300">
                            <Shield className="h-2.5 w-2.5" />
                            Directeur Général
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleNavClick('client-portal')}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-slate-300 transition hover:bg-blue-500/10 hover:text-blue-300"
                      >
                        <Briefcase className="h-3.5 w-3.5 text-blue-400" />
                        Portail & Projets Client
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleOpenAdmin();
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-amber-300 transition hover:bg-amber-500/10"
                      >
                        <Lock className="h-3.5 w-3.5 text-amber-400" />
                        Administration
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          signOut();
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-rose-400 transition hover:bg-rose-500/10"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        {t('nav.logout', 'Déconnexion')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative group shrink-0 hidden sm:block">
                  <button
                    onClick={() => signInWithGoogle()}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-500/40 bg-blue-500/10 text-blue-400 transition-all duration-300 hover:scale-110 active:scale-95 hover:border-blue-400 hover:bg-blue-500/25 hover:text-white hover:shadow-lg hover:shadow-blue-500/25 cursor-pointer shrink-0 shadow-sm"
                    aria-label="Connexion"
                    title="Connexion"
                  >
                    <LogIn className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>
                  <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-blue-900/60 bg-slate-950 px-2 py-1 text-[10px] font-medium text-blue-300 opacity-0 shadow-xl transition-opacity group-hover:opacity-100 z-50">
                    Connexion
                  </div>
                </div>
              )}

              {/* 3. APPEL 30 MIN ICON BUTTON (Desktop & md+) */}
              <div className="relative group hidden md:block">
                <button
                  onClick={handleOpenSchedule}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 transition-all duration-300 hover:scale-110 active:scale-95 hover:border-cyan-400 hover:bg-cyan-500/25 hover:text-cyan-100 hover:shadow-lg hover:shadow-cyan-500/25 cursor-pointer shrink-0 shadow-sm"
                  aria-label="Appel 30 min"
                  title="Appel 30 min"
                >
                  <Calendar className="h-4 w-4 text-cyan-400 transition-transform duration-300 group-hover:scale-110" />
                </button>
                <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-cyan-900/60 bg-slate-950 px-2 py-1 text-[10px] font-medium text-cyan-300 opacity-0 shadow-xl transition-opacity group-hover:opacity-100 z-50">
                  Appel 30 min
                </div>
              </div>

              {/* SEARCH MODAL TRIGGER (Gemini AI Search) */}
              {onOpenSearch && (
                <div className="relative group">
                  <button
                    onClick={onOpenSearch}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-500/40 bg-cyan-950/60 text-cyan-300 transition-all duration-300 hover:scale-110 active:scale-95 hover:border-cyan-400 hover:bg-cyan-900/50 hover:text-white shadow-sm cursor-pointer shrink-0"
                    aria-label="Recherche Sémantique Gemini"
                    title="Recherche Globale (Cmd + K)"
                  >
                    <Search className="h-4 w-4 text-cyan-400" />
                  </button>
                  <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-[10px] font-medium text-slate-300 opacity-0 shadow-xl transition-opacity group-hover:opacity-100 z-50">
                    Recherche (Cmd+K)
                  </div>
                </div>
              )}

              {/* 4. DEMANDER UN DEVIS (Icon on mobile, Button on sm+) */}
              <div className="relative group">
                <button
                  id="header-get-started-btn"
                  onClick={() => {
                    handleNavClick('estimator');
                    handleOpenQuote();
                  }}
                  className="group/btn relative flex h-9 items-center justify-center overflow-hidden rounded-full bg-[#1a44c2] hover:bg-blue-600 text-white shadow-md shadow-blue-900/30 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-xl hover:shadow-blue-600/40 hover:ring-2 hover:ring-blue-400/40 cursor-pointer shrink-0 w-9 sm:w-auto sm:px-3.5 sm:gap-1.5"
                  aria-label="Demander un devis"
                  title="Demander un devis"
                >
                  <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover/btn:translate-x-full" />
                  <FileText className="relative h-4 w-4 shrink-0 transition-transform duration-300 group-hover/btn:rotate-6" />
                  <span className="relative hidden sm:inline text-xs font-bold whitespace-nowrap">
                    Devis
                  </span>
                </button>
                <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-blue-900/60 bg-slate-950 px-2 py-1 text-[10px] font-medium text-blue-300 opacity-0 shadow-xl transition-opacity group-hover:opacity-100 z-50 sm:hidden">
                  Demander un devis
                </div>
              </div>

              {/* MOBILE & TABLET BURGER MENU COMPONENT */}
              <MobileMenuBurger
                isOpen={mobileMenuOpen}
                onToggle={() => {
                  setMobileMenuOpen((val) => !val);
                  setOpenDesktopMenu(null);
                  setUserDropdownOpen(false);
                  setMobileQuickActionsOpen(false);
                }}
                onClose={() => setMobileMenuOpen(false)}
                activeView={activeView}
                navLinks={navLinks}
                onNavClick={handleNavClick}
                whatsappUrl={whatsappUrl}
                handleOpenSchedule={handleOpenSchedule}
                handleOpenQuote={handleOpenQuote}
                handleOpenAdmin={handleOpenAdmin}
                openCountryModal={openCountryModal}
                openConverterModal={openConverterModal}
                currentCountry={currentCountry}
                currencyOption={currencyOption}
                mode={mode}
                toggleTheme={toggleTheme}
                t={t}
                isAuthenticated={isAuthenticated}
                user={user}
                signInWithGoogle={signInWithGoogle}
                signOut={signOut}
                isDirector={isDirector}
                companyInfo={companyInfo}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};