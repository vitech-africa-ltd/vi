import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { CountryProvider } from './context/CountryContext';
import { SiteDataProvider } from './context/SiteDataContext';
import { WishlistProvider } from './context/WishlistContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SEOHead } from './components/SEOHead';
import { LiveChatWidget } from './components/LiveChatWidget';
import { ScheduleModal } from './components/ScheduleModal';
import { CurrencyConverterModal } from './components/CurrencyConverterModal';
import { CountrySelectorModal } from './components/CountrySelectorModal';
import { AdminPortal } from './components/AdminPortal';
import { GlobalSemanticSearch } from './components/GlobalSemanticSearch';

// Dedicated Modular Pages
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { EstimatorPage } from './pages/EstimatorPage';
import { TechHubsPage } from './pages/TechHubsPage';
import { ClientPortalPage } from './pages/ClientPortalPage';
import { BlogPage } from './pages/BlogPage';
import { ContactPage } from './pages/ContactPage';
import { ProfilePage } from './pages/ProfilePage';
import { ScriptsMarketplace } from './components/scripts/ScriptsMarketplace';
import { ScriptsMemberSpace } from './components/scripts/ScriptsMemberSpace';
import { ScriptsAdminDashboard } from './components/scripts/ScriptsAdminDashboard';
import { ScriptsArchitectureDeliverables } from './components/scripts/ScriptsArchitectureDeliverables';
import { TeamPublicPage } from './components/TeamPublicPage';

import { ContactFormData, OfficeHub } from './types';

export default function App() {
  const [activeView, setActiveView] = useState<string>('home');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedHubForSchedule, setSelectedHubForSchedule] = useState<OfficeHub | null>(null);
  const [selectedServiceForEstimator, setSelectedServiceForEstimator] = useState<string>('web-saas');
  const [contactInitialData, setContactInitialData] = useState<Partial<ContactFormData>>({});

  // Keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync hash routing on mount and hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validViews = [
        'home', 'services', 'portfolio', 'estimator', 'tech-hubs', 
        'client-portal', 'blog', 'contact', 'admin', 'profile', 'pricing',
        'scripts', 'scripts-member', 'scripts-admin', 'scripts-deliverables', 'team'
      ];
      if (validViews.includes(hash)) {
        if (hash === 'admin') {
          setIsAdminPortalOpen(true);
        } else {
          setActiveView(hash);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToView = (viewId: string) => {
    if (viewId === 'admin') {
      setIsAdminPortalOpen(true);
      return;
    }
    setActiveView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.location.hash = viewId;
    } catch (e) {}
  };

  // Flow 1: When user clicks "Configurer ce service dans l'estimateur" from Services
  const handleSelectServiceForQuote = (serviceId: string) => {
    setSelectedServiceForEstimator(serviceId);
    navigateToView('estimator');
  };

  // Flow 2: When user configures estimate and clicks "Valider & Transférer au Formulaire"
  const handleApplyEstimateToContact = (data: {
    projectType: string;
    features: string[];
    platforms: string[];
    sla: string;
    estimatedBudget: string;
    estimatedTimeline: string;
  }) => {
    setContactInitialData({
      projectDescription: `[Devis Estimé via Simulateur Vitech Africa]
Type de Projet : ${data.projectType}
Plateformes Cibles : ${data.platforms.join(', ')}
Fonctionnalités : ${data.features.join(', ')}
Niveau SLA : ${data.sla}
Budget Estimatif : ${data.estimatedBudget}
Délais Estimés : ${data.estimatedTimeline}`,
      serviceNeeded: data.projectType.toLowerCase().includes('mobile')
        ? 'mobile-apps'
        : data.projectType.toLowerCase().includes('cloud')
        ? 'cloud-devops'
        : data.projectType.toLowerCase().includes('ia') || data.projectType.toLowerCase().includes('ai')
        ? 'ai-automation'
        : data.projectType.toLowerCase().includes('sécurité') || data.projectType.toLowerCase().includes('pentest')
        ? 'cybersecurity-audit'
        : 'web-saas',
    });
    navigateToView('contact');
  };

  // Flow 3: When user clicks "Démarrer un projet similaire" from Portfolio
  const handleStartProjectWithContext = (projectName: string) => {
    setContactInitialData({
      projectDescription: `Bonjour, je souhaite démarrer un projet similaire à votre étude de cas : "${projectName}". Pouvez-vous me proposer un cadrage technique adapté à nos besoins ?`,
    });
    navigateToView('contact');
  };

  const handleOpenScheduleForHub = (hub?: OfficeHub) => {
    setSelectedHubForSchedule(hub || null);
    setIsScheduleModalOpen(true);
  };

  return (
    <AuthProvider>
      <WishlistProvider>
        <SiteDataProvider>
          <LanguageProvider>
            <CurrencyProvider>
              <CountryProvider>
                <ThemeProvider>
                  <SEOHead activeView={activeView} />
                <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white flex flex-col font-sans transition-colors duration-200">
                
                {/* Main Navigation Header with Active View Support */}
                <Header
                  activeView={activeView}
                  setActiveView={navigateToView}
                  onOpenChat={() => setIsChatOpen(true)}
                  onOpenScheduleModal={() => handleOpenScheduleForHub()}
                  onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
                  onOpenSearch={() => setIsSearchOpen(true)}
                />

                {/* If Admin Portal is open as full-screen modal */}
                {isAdminPortalOpen && (
                  <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950">
                    <AdminPortal onClose={() => setIsAdminPortalOpen(false)} />
                  </div>
                )}

                {/* Main View Router */}
                <main className="flex-grow">
                  {activeView === 'home' && (
                    <HomePage
                      onNavigateToView={navigateToView}
                      onSelectServiceForQuote={handleSelectServiceForQuote}
                      onApplyEstimateToContact={handleApplyEstimateToContact}
                      onStartProjectWithContext={handleStartProjectWithContext}
                      onOpenScheduleModal={handleOpenScheduleForHub}
                      onOpenChat={() => setIsChatOpen(true)}
                      contactInitialData={contactInitialData}
                    />
                  )}

                  {activeView === 'services' && (
                    <ServicesPage
                      onSelectServiceForQuote={handleSelectServiceForQuote}
                      onOpenScheduleModal={() => handleOpenScheduleForHub()}
                      onNavigateToView={navigateToView}
                    />
                  )}

                  {activeView === 'portfolio' && (
                    <PortfolioPage
                      onStartProjectWithContext={handleStartProjectWithContext}
                      onOpenScheduleModal={() => handleOpenScheduleForHub()}
                      onNavigateToView={navigateToView}
                    />
                  )}

                  {activeView === 'estimator' && (
                    <EstimatorPage
                      initialServiceId={selectedServiceForEstimator}
                      onApplyEstimateToContact={handleApplyEstimateToContact}
                      onOpenScheduleModal={() => handleOpenScheduleForHub()}
                    />
                  )}

                  {activeView === 'tech-hubs' && (
                    <TechHubsPage
                      onScheduleCall={handleOpenScheduleForHub}
                      onNavigateToView={navigateToView}
                    />
                  )}

                  {activeView === 'client-portal' && (
                    <ClientPortalPage
                      onOpenChat={() => setIsChatOpen(true)}
                      onNavigateToView={navigateToView}
                    />
                  )}

                  {activeView === 'blog' && (
                    <BlogPage
                      onNavigateToView={navigateToView}
                    />
                  )}

                  {activeView === 'contact' && (
                    <ContactPage
                      initialData={contactInitialData}
                      onOpenScheduleModal={handleOpenScheduleForHub}
                      onOpenChat={() => setIsChatOpen(true)}
                    />
                  )}

                  {(activeView === 'profile' || activeView === 'pricing') && (
                    <ProfilePage
                      onNavigateToView={navigateToView}
                      onOpenScheduleModal={() => handleOpenScheduleForHub()}
                      onOpenChat={() => setIsChatOpen(true)}
                    />
                  )}

                  {activeView === 'scripts' && (
                    <ScriptsMarketplace
                      onNavigateMemberSpace={() => navigateToView('scripts-member')}
                      onNavigateAdminSpace={() => navigateToView('scripts-admin')}
                      onNavigateDeliverables={() => navigateToView('scripts-deliverables')}
                      onNavigateTeam={() => navigateToView('team')}
                    />
                  )}

                  {activeView === 'scripts-member' && (
                    <ScriptsMemberSpace
                      onBackToMarketplace={() => navigateToView('scripts')}
                      onSelectProduct={() => navigateToView('scripts')}
                    />
                  )}

                  {activeView === 'scripts-admin' && (
                    <ScriptsAdminDashboard
                      onBackToMarketplace={() => navigateToView('scripts')}
                    />
                  )}

                  {activeView === 'scripts-deliverables' && (
                    <ScriptsArchitectureDeliverables
                      onBackToMarketplace={() => navigateToView('scripts')}
                    />
                  )}

                  {activeView === 'team' && (
                    <TeamPublicPage
                      onNavigateContact={() => navigateToView('contact')}
                      onNavigateScripts={() => navigateToView('scripts')}
                    />
                  )}
                </main>

                {/* Global Footer */}
                <Footer
                  onNavigate={navigateToView}
                  onOpenScheduleModal={() => handleOpenScheduleForHub()}
                />

                {/* Floating Live Chat & AI Tech Consultant */}
                <LiveChatWidget
                  isOpen={isChatOpen}
                  onClose={() => setIsChatOpen(false)}
                  onToggle={() => setIsChatOpen((prev) => !prev)}
                />

                {/* 30-min Discovery Call Schedule Modal */}
                <ScheduleModal
                  isOpen={isScheduleModalOpen}
                  onClose={() => setIsScheduleModalOpen(false)}
                  selectedHub={selectedHubForSchedule}
                />

                {/* Interactive Multi-Currency Converter Modal */}
                <CurrencyConverterModal
                  onApplyBudgetToEstimator={() => navigateToView('estimator')}
                />

                {/* Visitor Geolocation & Country Selector Modal */}
                <CountrySelectorModal />

                {/* Global Semantic Search powered by Gemini */}
                <GlobalSemanticSearch
                  isOpen={isSearchOpen}
                  onClose={() => setIsSearchOpen(false)}
                  onNavigateToView={navigateToView}
                />

              </div>
            </ThemeProvider>
          </CountryProvider>
        </CurrencyProvider>
      </LanguageProvider>
      </SiteDataProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
