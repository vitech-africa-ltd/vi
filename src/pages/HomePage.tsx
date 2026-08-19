import React from 'react';
import { Hero } from '../components/Hero';
import { ServicesSection } from '../components/ServicesSection';
import { ProjectEstimator } from '../components/ProjectEstimator';
import { TechHubsMap } from '../components/TechHubsMap';
import { PortfolioSection } from '../components/PortfolioSection';
import { ClientDashboard } from '../components/ClientDashboard';
import { ClientTestimonials } from '../components/ClientTestimonials';
import { FaqSection } from '../components/FaqSection';
import { TechBlogSection } from '../components/TechBlogSection';
import { ContactSection } from '../components/ContactSection';
import { NewsletterSection } from '../components/NewsletterSection';
import { ContactFormData, OfficeHub } from '../types';

interface HomePageProps {
  onNavigateToView: (viewId: string) => void;
  onSelectServiceForQuote: (serviceId: string) => void;
  onApplyEstimateToContact: (data: {
    projectType: string;
    features: string[];
    platforms: string[];
    sla: string;
    estimatedBudget: string;
    estimatedTimeline: string;
  }) => void;
  onStartProjectWithContext: (projectName: string) => void;
  onOpenScheduleModal: (hub?: OfficeHub) => void;
  onOpenChat: () => void;
  contactInitialData: Partial<ContactFormData>;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateToView,
  onSelectServiceForQuote,
  onApplyEstimateToContact,
  onStartProjectWithContext,
  onOpenScheduleModal,
  onOpenChat,
  contactInitialData,
}) => {
  return (
    <div className="space-y-0 animate-in fade-in duration-300">
      {/* Hero Section */}
      <Hero
        onExploreServices={() => onNavigateToView('services')}
        onOpenEstimator={() => onNavigateToView('estimator')}
        onOpenScheduleModal={() => onOpenScheduleModal()}
        onNavigateToPortfolio={() => onNavigateToView('portfolio')}
        onNavigateToClientPortal={() => onNavigateToView('client-portal')}
      />

      {/* Interactive Services Section */}
      <ServicesSection
        onSelectServiceForQuote={onSelectServiceForQuote}
      />

      {/* Live Interactive Project Estimator */}
      <ProjectEstimator
        onApplyEstimateToContact={onApplyEstimateToContact}
      />

      {/* Google Maps Platform: Panafrican Engineering Hubs & R&D Map */}
      <TechHubsMap
        onScheduleCall={onOpenScheduleModal}
      />

      {/* Dynamic Portfolio & Case Studies */}
      <PortfolioSection
        onStartProjectWithContext={onStartProjectWithContext}
      />

      {/* Secure Client Portal & Real-time Tracking */}
      <ClientDashboard />

      {/* Interactive Client Testimonials Slider with Social Proof */}
      <ClientTestimonials />

      {/* Interactive FAQ Accordion Section */}
      <FaqSection
        onOpenChat={onOpenChat}
        onOpenEstimator={() => onNavigateToView('estimator')}
      />

      {/* Technical Engineering Blog */}
      <TechBlogSection />

      {/* Contact & Auto-Save Project Initiation */}
      <ContactSection
        initialData={contactInitialData}
      />

      {/* Newsletter & Whitepaper Download */}
      <NewsletterSection />
    </div>
  );
};
