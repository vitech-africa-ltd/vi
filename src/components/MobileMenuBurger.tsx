import React, { useState } from 'react';
import {
  Menu,
  X,
  MessageCircle,
  Calendar,
  FileText,
  Rocket,
  ArrowRight,
  LogIn,
  LogOut,
  Sparkles,
  ChevronDown,
  Lock,
  Search,
  Globe2,
  Shield,
  Phone,
  Briefcase,
  Headphones,
  Moon,
  Sun,
} from 'lucide-react';
import { VitechLogo } from './VitechLogo';
import { LanguageSwitcher } from './LanguageSwitcher';
import type { User } from 'firebase/auth';

export interface NavSubMenuItem {
  label: string;
  description?: string;
  icon: React.ElementType;
  view: string;
  badge?: string;
}

export interface NavItemType {
  id: string;
  labelKey: string;
  defaultLabel: string;
  featured?: boolean;
  isMoreMenu?: boolean;
  submenu?: NavSubMenuItem[];
}

interface MobileMenuBurgerProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  activeView: string;
  navLinks: NavItemType[];
  onNavClick: (view: string) => void;
  whatsappUrl: string;
  handleOpenSchedule: () => void;
  handleOpenQuote: () => void;
  handleOpenAdmin: () => void;
  openCountryModal: () => void;
  openConverterModal: () => void;
  currentCountry: {
    name: string;
    flag: string;
    localHub?: string;
  };
  currencyOption: {
    code: string;
    flag: string;
    symbol: string;
  };
  mode: 'dark' | 'light';
  toggleTheme: () => void;
  user: User | null;
  isAuthenticated: boolean;
  isDirector: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  companyInfo: {
    phone: string;
    phoneRaw?: string;
    email: string;
    headquarters: string;
  };
  t: (key: string, defaultText: string) => string;
}

export const MobileMenuBurger: React.FC<MobileMenuBurgerProps> = ({
  isOpen,
  onToggle,
  onClose,
  activeView,
  navLinks,
  onNavClick,
  whatsappUrl,
  handleOpenSchedule,
  handleOpenQuote,
  handleOpenAdmin,
  openCountryModal,
  openConverterModal,
  currentCountry,
  currencyOption,
  mode,
  toggleTheme,
  user,
  isAuthenticated,
  isDirector,
  signInWithGoogle,
  signOut,
  companyInfo,
  t,
}) => {
  const [openSubmenuId, setOpenSubmenuId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSubmenu = (id: string) => {
    setOpenSubmenuId((prev) => (prev === id ? null : id));
  };

  const handleLinkSelect = (view: string) => {
    onClose();
    onNavClick(view);
  };

  // Filter links if search is active
  const filteredNavLinks = searchQuery.trim()
    ? navLinks.filter((link) => {
        const query = searchQuery.toLowerCase();
        const mainMatch = link.defaultLabel.toLowerCase().includes(query);
        const subMatch = link.submenu?.some(
          (sub) =>
            sub.label.toLowerCase().includes(query) ||
            (sub.description && sub.description.toLowerCase().includes(query))
        );
        return mainMatch || subMatch;
      })
    : navLinks;

  return (
    <>
      {/* BURGER TRIGGER BUTTON */}
      <button
        id="mobile-menu-burger-btn"
        onClick={onToggle}
        className={`
          relative
          flex
          h-9
          items-center
          gap-1.5
          px-2.5
          sm:px-3
          rounded-xl
          border
          transition-all
          duration-300
          shrink-0
          cursor-pointer
          lg:hidden
          shadow-sm
          active:scale-95
          ${
            isOpen
              ? 'border-rose-500/60 bg-rose-500/15 text-rose-300 ring-2 ring-rose-500/20'
              : 'border-slate-700/80 bg-slate-900/90 text-slate-100 hover:border-cyan-400 hover:bg-slate-800 hover:shadow-lg hover:shadow-cyan-500/10'
          }
        `}
        aria-label={isOpen ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation'}
        aria-expanded={isOpen}
      >
        <div className="relative flex h-4 w-4 items-center justify-center">
          {isOpen ? (
            <X className="h-4 w-4 text-rose-400 transition-transform duration-300 rotate-90 scale-110" />
          ) : (
            <Menu className="h-4 w-4 text-cyan-400 transition-transform duration-300" />
          )}
        </div>
        <span className="text-[11px] font-bold tracking-tight">
          {isOpen ? 'Fermer' : 'Menu'}
        </span>
      </button>

      {/* FULL DRAWER MODAL (< 1024px) */}
      {isOpen && (
        <div
          id="mobile-menu-drawer"
          className="fixed inset-0 z-[180] flex flex-col bg-slate-950 text-slate-100 lg:hidden animate-in fade-in duration-200"
        >
          {/* DRAWER TOP BAR (FIXED HEIGHT 56px) */}
          <div className="flex h-14 items-center justify-between border-b border-slate-800 bg-slate-950/95 px-4 sm:px-6 shrink-0 backdrop-blur-xl">
            <button
              onClick={() => handleLinkSelect('home')}
              className="flex items-center gap-2 text-left focus:outline-none"
            >
              <VitechLogo
                variant="horizontal"
                size="sm"
                showTagline={false}
              />
            </button>

            <button
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-300 transition-all duration-200 hover:bg-rose-500/20 active:scale-95 cursor-pointer shadow-sm"
              aria-label="Fermer le menu"
            >
              <X className="h-4 w-4 text-rose-400" />
              <span>Fermer</span>
            </button>
          </div>

          {/* DRAWER SCROLLABLE BODY */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 space-y-4 pb-28">
            {/* SEARCH INPUT */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un service, projet ou page..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2 pl-9 pr-8 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* HERO CTA CARD */}
            <div className="overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/40 p-4 shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-emerald-400">
                      DISPONIBLE • DISPATCH IMMÉDIAT
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-white">
                    Un projet digital ou une idée à concrétiser ?
                  </h3>

                  <p className="mt-1 max-w-md text-[10px] leading-4 text-slate-400">
                    Développement web, mobile, cloud et IA pour entreprises et startups d'Afrique.
                  </p>
                </div>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Rocket className="h-4 w-4" />
                </div>
              </div>

              {/* QUICK ACTION BUTTONS */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3 py-2.5 text-xs font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/40 active:scale-95 shadow-sm"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  <span>WhatsApp direct</span>
                </a>

                <button
                  onClick={() => {
                    onClose();
                    handleOpenSchedule();
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-2.5 text-xs font-bold text-cyan-300 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-900/40 active:scale-95 shadow-sm"
                >
                  <Calendar className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Appel 30 min</span>
                </button>
              </div>

              <button
                onClick={() => {
                  onClose();
                  handleLinkSelect('estimator');
                  handleOpenQuote();
                }}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a44c2] hover:bg-blue-600 px-3 py-2.5 text-xs font-black uppercase tracking-wider text-white transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/40 active:scale-95"
              >
                <FileText className="h-4 w-4 shrink-0" />
                <span>Demander un devis interactif</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* AUTH / USER STATUS IN MOBILE */}
            {!isAuthenticated ? (
              <button
                onClick={() => {
                  onClose();
                  signInWithGoogle();
                }}
                className="flex w-full items-center justify-between rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-xs font-bold text-blue-300 transition-all duration-200 hover:bg-blue-500/20 active:scale-98"
              >
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4 text-blue-400" />
                  <span>Espace Client & Connexion</span>
                </span>
                <span className="text-[10px] font-medium text-blue-400">Google OAuth</span>
              </button>
            ) : (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase text-blue-400">
                    Compte connecté
                  </p>
                  <p className="truncate text-xs font-semibold text-blue-100">
                    {user?.email}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleLinkSelect('client-portal')}
                    className="rounded-lg bg-blue-600 hover:bg-blue-500 px-2.5 py-1.5 text-[10px] font-bold text-white transition"
                  >
                    Portail
                  </button>
                  {isDirector && (
                    <button
                      onClick={() => {
                        onClose();
                        handleOpenAdmin();
                      }}
                      className="rounded-lg bg-amber-500/20 px-2.5 py-1.5 text-[10px] font-bold text-amber-300 transition hover:bg-amber-500/30"
                    >
                      Admin
                    </button>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="rounded-lg bg-rose-500/20 px-2.5 py-1.5 text-[10px] font-bold text-rose-400 transition hover:bg-rose-500/30"
                  >
                    Sortir
                  </button>
                </div>
              </div>
            )}

            {/* NAVIGATION ACCORDION */}
            <div>
              <p className="mb-2 px-1 text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">
                Menu & Navigation
              </p>

              <div className="space-y-1.5">
                {filteredNavLinks.map((link) => {
                  const active =
                    activeView === link.id ||
                    link.submenu?.some((item) => item.view === activeView);

                  const hasSubmenu = Boolean(link.submenu?.length);
                  const isOpen = openSubmenuId === link.id;

                  return (
                    <div
                      key={link.id}
                      className={`
                        overflow-hidden
                        rounded-xl
                        border
                        transition-all
                        duration-200
                        ${
                          active
                            ? 'border-cyan-500/50 bg-slate-900 shadow-sm'
                            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                        }
                      `}
                    >
                      {/* MAIN ITEM */}
                      <button
                        onClick={() => {
                          if (hasSubmenu) {
                            toggleSubmenu(link.id);
                          } else {
                            handleLinkSelect(link.id);
                          }
                        }}
                        className={`
                          flex
                          w-full
                          items-center
                          justify-between
                          px-4
                          py-3
                          text-left
                          transition
                          ${
                            active
                              ? 'text-cyan-300 font-bold'
                              : 'text-slate-200 hover:bg-slate-800/60'
                          }
                        `}
                      >
                        <span className="flex items-center gap-2.5">
                          {link.featured && (
                            <Sparkles className="h-4 w-4 text-cyan-400 shrink-0" />
                          )}

                          <span className="text-xs font-bold tracking-wide">
                            {t(link.labelKey, link.defaultLabel)}
                          </span>

                          {link.featured && (
                            <span className="rounded-full bg-emerald-400 px-1.5 py-0.5 text-[8px] font-black text-slate-950">
                              ESTIMATION
                            </span>
                          )}
                        </span>

                        {hasSubmenu ? (
                          <ChevronDown
                            className={`
                              h-4
                              w-4
                              text-slate-500
                              transition-transform
                              duration-300
                              ${isOpen ? 'rotate-180 text-cyan-400' : ''}
                            `}
                          />
                        ) : (
                          <ArrowRight className="h-3.5 w-3.5 text-slate-600" />
                        )}
                      </button>

                      {/* SUBMENU ITEMS */}
                      {hasSubmenu && isOpen && (
                        <div className="border-t border-slate-800 bg-slate-950/70 p-2 space-y-1 animate-in fade-in duration-150">
                          {/* Dedicated Theme Quick Switcher in 'Plus' Submenu */}
                          {link.id === 'more' && (
                            <div className="mb-2 p-2.5 rounded-xl border border-slate-800 bg-slate-900/90 flex items-center justify-between gap-2 shadow-xs">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                                    mode === 'dark'
                                      ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-400'
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
                                  <p className="text-xs font-bold text-slate-100">
                                    Thème Visuel
                                  </p>
                                  <p className="text-[10px] text-slate-400">
                                    {mode === 'dark' ? 'Mode Sombre actif' : 'Mode Clair actif'}
                                  </p>
                                </div>
                              </div>

                              <button
                                onClick={toggleTheme}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border cursor-pointer ${
                                  mode === 'dark'
                                    ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                                    : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                                }`}
                              >
                                {mode === 'dark' ? (
                                  <>
                                    <Sun className="h-3 w-3 text-amber-400" />
                                    <span>Passer en Clair</span>
                                  </>
                                ) : (
                                  <>
                                    <Moon className="h-3 w-3 text-cyan-400" />
                                    <span>Passer en Sombre</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}

                          {link.submenu?.map((item) => {
                            const Icon = item.icon;
                            const itemActive = activeView === item.view;

                            return (
                              <button
                                key={`${link.id}-${item.label}-burger`}
                                onClick={() => {
                                  handleLinkSelect(item.view);
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
                                  px-3
                                  py-2.5
                                  text-left
                                  transition-all
                                  duration-150
                                  ${
                                    itemActive
                                      ? 'bg-cyan-500/15 text-cyan-300'
                                      : 'hover:bg-slate-800/70 text-slate-300'
                                  }
                                `}
                              >
                                <div
                                  className={`
                                    flex
                                    h-8
                                    w-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    border
                                    ${
                                      itemActive
                                        ? 'border-cyan-500/40 bg-cyan-500/20 text-cyan-400'
                                        : 'border-slate-700 bg-slate-900 text-slate-400'
                                    }
                                  `}
                                >
                                  <Icon className="h-4 w-4" />
                                </div>

                                <span className="min-w-0 flex-1">
                                  <span className="flex items-center gap-1.5">
                                    <span className="block text-xs font-bold">
                                      {item.label}
                                    </span>
                                    {item.badge && (
                                      <span className="rounded-full bg-emerald-400 px-1.5 py-0.2 text-[7px] font-black uppercase text-slate-950">
                                        {item.badge}
                                      </span>
                                    )}
                                  </span>
                                  {item.description && (
                                    <span className="mt-0.5 block text-[10px] text-slate-500">
                                      {item.description}
                                    </span>
                                  )}
                                </span>

                                <ArrowRight className="h-3.5 w-3.5 text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-400" />
                              </button>
                            );
                          })}

                          <button
                            onClick={() => {
                              if (link.id === 'more') {
                                handleLinkSelect('estimator');
                                handleOpenQuote();
                              } else {
                                handleLinkSelect(link.id);
                              }
                            }}
                            className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-800 py-2 text-[10px] font-black uppercase text-slate-400 hover:border-cyan-500/30 hover:text-cyan-300 transition"
                          >
                            <span>
                              {link.id === 'more'
                                ? 'Simulateur de Devis en Ligne'
                                : `Voir tout : ${t(link.labelKey, link.defaultLabel)}`}
                            </span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* REGIONAL CONTROLS & UTILITIES */}
            <div>
              <p className="mb-2 px-1 text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">
                Préférences Régionales & Thème
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onClose();
                    openCountryModal();
                  }}
                  className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2.5 text-left transition hover:border-slate-700 hover:bg-slate-800 active:scale-98"
                >
                  <span className="text-xl shrink-0">{currentCountry.flag}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-bold text-white">
                      {currentCountry.name}
                    </span>
                    <span className="block truncate text-[9px] text-slate-500">
                      Hub {currentCountry.localHub || 'Afrique'}
                    </span>
                  </span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    openConverterModal();
                  }}
                  className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2.5 text-left transition hover:border-slate-700 hover:bg-slate-800 active:scale-98"
                >
                  <span className="text-xl shrink-0">{currencyOption.flag}</span>
                  <span className="min-w-0">
                    <span className="block text-xs font-bold text-white">
                      {currencyOption.code} ({currencyOption.symbol})
                    </span>
                    <span className="block text-[9px] text-slate-500">
                      Convertisseur
                    </span>
                  </span>
                </button>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2">
                  <LanguageSwitcher variant="mobile" />
                </div>

                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-left transition hover:border-slate-700 hover:bg-slate-800 active:scale-98"
                >
                  <div className="flex items-center gap-2">
                    {mode === 'dark' ? (
                      <Sun className="h-4 w-4 text-amber-400" />
                    ) : (
                      <Moon className="h-4 w-4 text-cyan-300" />
                    )}
                    <span className="text-[10px] font-bold text-slate-200">
                      {mode === 'dark' ? 'Mode clair' : 'Mode sombre'}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* ADMIN ACCESS */}
            <button
              onClick={() => {
                onClose();
                handleOpenAdmin();
              }}
              className="flex w-full items-center justify-between rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-left transition hover:bg-amber-500/20 active:scale-98"
            >
              <span className="flex items-center gap-2 text-xs font-black text-amber-300">
                <Lock className="h-4 w-4" />
                Espace Administration CMS
              </span>
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[8px] font-black uppercase text-amber-300">
                Accès Sécurisé
              </span>
            </button>

            {/* FOOTER CONTACT INFO */}
            <div className="rounded-xl border border-slate-900 bg-slate-950 p-3 text-[10px] text-slate-500 space-y-1">
              <p className="flex items-center gap-1.5">
                <Globe2 className="h-3 w-3 text-cyan-400 shrink-0" />
                <span>{companyInfo.headquarters}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="h-3 w-3 text-emerald-400 shrink-0" />
                <a
                  href={`tel:${companyInfo.phoneRaw || companyInfo.phone}`}
                  className="hover:text-emerald-300"
                >
                  {companyInfo.phone}
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
