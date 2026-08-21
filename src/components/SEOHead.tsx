import React, { useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { generateMarketplaceJsonLd, generateProductJsonLd } from '../utils/seoStructuredData';
import { INITIAL_SCRIPTS, ScriptProduct } from '../data/scriptsData';

export { generateMarketplaceJsonLd, generateProductJsonLd };

interface SEOHeadProps {
  activeView: string;
  selectedProduct?: ScriptProduct | null;
}

interface PageMeta {
  title: string;
  description: string;
  keywords: string;
  ogType: string;
  canonicalPath: string;
  image?: string;
  breadcrumbs: { name: string; item: string }[];
}

export const SEOHead: React.FC<SEOHeadProps> = ({ activeView, selectedProduct }) => {
  const { currentLanguage } = useTranslation();

  useEffect(() => {
    const baseUrl = 'https://vitechafrica.vercel.app';

    const pageMetaMap: Record<string, PageMeta> = {
      home: {
        title: 'V&I TECH AFRICA LTD — Ingénierie Logicielle, Cloud & Solutions Digitales Panafricaines',
        description: 'Entreprise d’ingénierie logicielle panafricaine spécialisée en plateformes web, applications mobiles, C# .NET/WPF, architectures Cloud, IA et passerelles Mobile Money.',
        keywords: 'V&I TECH AFRICA, ingénierie logicielle Afrique, développement web Kigali, logiciel Kinshasa, React, C# WPF, Mobile Money MTN Airtel',
        ogType: 'website',
        canonicalPath: '',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&h=630&q=80',
        breadcrumbs: [{ name: 'Accueil', item: `${baseUrl}/#home` }],
      },
      services: {
        title: 'Services & Solutions Technologiques — V&I TECH AFRICA LTD',
        description: 'Développement Web & Mobile, Architectures Cloud & DevOps, IA & RAG, Systèmes de Gestion Desktop (C# .NET WPF), APIs & Intégration Mobile Money.',
        keywords: 'services informatiques, dev web, mobile flutter react native, cloud devops, C# WPF, IA RAG, API payment',
        ogType: 'website',
        canonicalPath: '#services',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=630&q=80',
        breadcrumbs: [
          { name: 'Accueil', item: `${baseUrl}/#home` },
          { name: 'Services & Solutions', item: `${baseUrl}/#services` },
        ],
      },
      portfolio: {
        title: 'Réalisations & Études de Cas — V&I TECH AFRICA LTD',
        description: 'Découvrez nos projets phares : V&I Manager System, plateformes fintech, solutions e-commerce et applications cloud déployées en Afrique.',
        keywords: 'portfolio vitech, études de cas dev, projets logiciels afrique, réalisations tech',
        ogType: 'website',
        canonicalPath: '#portfolio',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=630&q=80',
        breadcrumbs: [
          { name: 'Accueil', item: `${baseUrl}/#home` },
          { name: 'Réalisations', item: `${baseUrl}/#portfolio` },
        ],
      },
      estimator: {
        title: 'Simulateur & Calculateur de Devis en Ligne — V&I TECH AFRICA LTD',
        description: 'Estimez instantanément le coût et le délai de votre projet logiciel avec conversion automatique en USD, RWF, CDF, EUR, XOF et XAF.',
        keywords: 'calculateur devis dev, estimation projet web, prix application mobile, devis logiciel rwanda rdc',
        ogType: 'website',
        canonicalPath: '#estimator',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&h=630&q=80',
        breadcrumbs: [
          { name: 'Accueil', item: `${baseUrl}/#home` },
          { name: 'Simulateur de Devis', item: `${baseUrl}/#estimator` },
        ],
      },
      'tech-hubs': {
        title: 'Hubs Technologiques Panafricains & R&D — V&I TECH AFRICA LTD',
        description: 'Implantations régionales et centres d’ingénierie à Kigali (Rwanda), Goma/Kinshasa (RDC), Dakar, Abidjan et Casablanca.',
        keywords: 'hubs technologiques afrique, centre R&D Kigali, bureaux VITECH, tech hubs rdc',
        ogType: 'website',
        canonicalPath: '#tech-hubs',
        image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&h=630&q=80',
        breadcrumbs: [
          { name: 'Accueil', item: `${baseUrl}/#home` },
          { name: 'Hubs Panafricains', item: `${baseUrl}/#tech-hubs` },
        ],
      },
      'client-portal': {
        title: 'Espace Client Sécurisé & Suivi de Projet — V&I TECH AFRICA LTD',
        description: 'Accédez au tableau de bord de suivi en temps réel de vos développements, tickets d’assistance, SLA et livrables de code.',
        keywords: 'espace client vitech, suivi projet logiciel, client portal, dashboard dev',
        ogType: 'website',
        canonicalPath: '#client-portal',
        breadcrumbs: [
          { name: 'Accueil', item: `${baseUrl}/#home` },
          { name: 'Espace Client', item: `${baseUrl}/#client-portal` },
        ],
      },
      blog: {
        title: 'Blog Technique, R&D & Livres Blancs — V&I TECH AFRICA LTD',
        description: 'Articles d’experts en architectures logicielles, C# .NET WPF, cybersécurité, IA appliquée et transformation digitale en Afrique.',
        keywords: 'blog tech afrique, articles génie logiciel, tutoriels C# WPF, livres blancs vitech',
        ogType: 'blog',
        canonicalPath: '#blog',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&h=630&q=80',
        breadcrumbs: [
          { name: 'Accueil', item: `${baseUrl}/#home` },
          { name: 'Blog & R&D', item: `${baseUrl}/#blog` },
        ],
      },
      contact: {
        title: 'Contact & Consultation Technique Gratuite — V&I TECH AFRICA LTD',
        description: 'Contactez notre Direction Technique pour cadrer votre projet. Consultation gratuite de 30 minutes, WhatsApp direct et support par email.',
        keywords: 'contact vitech africa, devis logiciel, prise rendez-vous ingénieur, support technique',
        ogType: 'website',
        canonicalPath: '#contact',
        breadcrumbs: [
          { name: 'Accueil', item: `${baseUrl}/#home` },
          { name: 'Contact', item: `${baseUrl}/#contact` },
        ],
      },
      profile: {
        title: 'Direction Technique, Compétences Fondateur & Cursus ULK — V&I TECH AFRICA LTD',
        description: 'Profil d’ingénierie logicielle du fondateur : C# / .NET / WPF, PHP, Python, APIs, cursus en Computer Science à l’University of Kigali (ULK) et opportunités.',
        keywords: 'profil fondateur vitech, C# WPF développeur, ingénieur logiciel ULK, compétences informatiques rwanda',
        ogType: 'profile',
        canonicalPath: '#profile',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&h=630&q=80',
        breadcrumbs: [
          { name: 'Accueil', item: `${baseUrl}/#home` },
          { name: 'Profil & Compétences', item: `${baseUrl}/#profile` },
        ],
      },
      pricing: {
        title: 'Grille Tarifaire Internationale 2026 (Normes Banque Mondiale) — V&I TECH AFRICA LTD',
        description: 'Barème tarifaire 2026 équitable en 4 catégories économiques (Low-Income, Lower-Middle, Upper-Middle, High-Income) avec tarifs spéciaux en RWF et USD.',
        keywords: 'tarifs développement logiciel, grille prix banque mondiale, prix site web rwanda rdc, tarification dev 2026',
        ogType: 'website',
        canonicalPath: '#pricing',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&h=630&q=80',
        breadcrumbs: [
          { name: 'Accueil', item: `${baseUrl}/#home` },
          { name: 'Grille Tarifaire', item: `${baseUrl}/#pricing` },
        ],
      },
      scripts: {
        title: selectedProduct 
          ? `${selectedProduct.title} — Code Source & Licence | Vitech Scripts`
          : 'Vitech Scripts — Marketplace de Codes Sources, Passerelles MoMo & Starter Kits Pro 2026',
        description: selectedProduct
          ? `${selectedProduct.description} — Audité OWASP (${selectedProduct.analysis.securityScore}/100), compatible MTN/Airtel MoMo & Stripe.`
          : 'Place de marché premium de codes sources audités, passerelles de paiement panafricaines (MTN MoMo, Airtel Money), architectures SaaS Laravel 11, apps Flutter et kits admin.',
        keywords: 'vitech scripts, code source laravel 11, mtn momo api php, flutter ecommerce template, starter kit admin bootstrap, scripts pan-africains',
        ogType: 'website',
        canonicalPath: selectedProduct ? `#scripts/${selectedProduct.slug}` : '#scripts',
        image: selectedProduct?.previewImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&h=630&q=80',
        breadcrumbs: [
          { name: 'Accueil', item: `${baseUrl}/#home` },
          { name: 'Vitech Scripts', item: `${baseUrl}/#scripts` },
          ...(selectedProduct ? [{ name: selectedProduct.title, item: `${baseUrl}/#scripts/${selectedProduct.slug}` }] : []),
        ],
      },
      'scripts-member': {
        title: 'Espace Membre & Gestionnaire de Licences — Vitech Scripts',
        description: 'Espace membre sécurisé pour télécharger vos archives de scripts protégées, gérer vos clés de licence et lier vos domaines de production.',
        keywords: 'espace membre vitech scripts, téléchargement code source, licences logicielles, factures vitech',
        ogType: 'website',
        canonicalPath: '#scripts-member',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&h=630&q=80',
        breadcrumbs: [
          { name: 'Accueil', item: `${baseUrl}/#home` },
          { name: 'Vitech Scripts', item: `${baseUrl}/#scripts` },
          { name: 'Espace Membre', item: `${baseUrl}/#scripts-member` },
        ],
      },
      'scripts-admin': {
        title: 'Tableau de Bord Administrateur — Vitech Scripts Marketplace',
        description: 'Console d’administration de Vitech Scripts : gestion des ventes, validation des scripts, attribution des licences et monitoring des revenus MoMo.',
        keywords: 'admin vitech scripts, tableau de bord ventes scripts, modération scripts',
        ogType: 'website',
        canonicalPath: '#scripts-admin',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=630&q=80',
        breadcrumbs: [
          { name: 'Accueil', item: `${baseUrl}/#home` },
          { name: 'Admin Scripts', item: `${baseUrl}/#scripts-admin` },
        ],
      },
      'scripts-deliverables': {
        title: 'Livrables d’Architecture & Spécifications Techniques — Vitech Scripts',
        description: 'Spécifications techniques complètes, diagrammes d’architecture C4, modèle de licence et conformité OWASP Top 10 de la plateforme Vitech Scripts.',
        keywords: 'architecture logicielle vitech, audit securite owasp, conformite pci-dss mobile money',
        ogType: 'article',
        canonicalPath: '#scripts-deliverables',
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&h=630&q=80',
        breadcrumbs: [
          { name: 'Accueil', item: `${baseUrl}/#home` },
          { name: 'Livrables Techniques', item: `${baseUrl}/#scripts-deliverables` },
        ],
      },
      team: {
        title: 'Équipe d’Experts & Fondateurs — V&I TECH AFRICA LTD',
        description: 'Faites connaissance avec notre équipe d’ingénieurs, architectes logiciels, experts en cybersécurité et consultants Cloud basés à Kigali et dans la région des Grands Lacs.',
        keywords: 'équipe vitech africa, ingenieurs kigali rwanda, fondateurs tech rwanda, software engineers rwanda',
        ogType: 'profile',
        canonicalPath: '#team',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&h=630&q=80',
        breadcrumbs: [
          { name: 'Accueil', item: `${baseUrl}/#home` },
          { name: 'Notre Équipe', item: `${baseUrl}/#team` },
        ],
      },
    };

    const currentMeta = pageMetaMap[activeView] || pageMetaMap.home;

    // 1. Update Document Title
    document.title = currentMeta.title;

    // 2. Helper to set or update meta tag by name or property
    const setMetaTag = (attrName: 'name' | 'property', attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard Meta
    setMetaTag('name', 'description', currentMeta.description);
    setMetaTag('name', 'keywords', currentMeta.keywords);

    // Open Graph Meta
    setMetaTag('property', 'og:title', currentMeta.title);
    setMetaTag('property', 'og:description', currentMeta.description);
    setMetaTag('property', 'og:type', currentMeta.ogType);
    setMetaTag('property', 'og:url', `${baseUrl}/${currentMeta.canonicalPath}`);
    setMetaTag('property', 'og:site_name', 'V&I TECH AFRICA LTD');
    if (currentMeta.image) {
      setMetaTag('property', 'og:image', currentMeta.image);
      setMetaTag('property', 'og:image:width', '1200');
      setMetaTag('property', 'og:image:height', '630');
    }

    // Twitter Card Meta
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', currentMeta.title);
    setMetaTag('name', 'twitter:description', currentMeta.description);
    if (currentMeta.image) {
      setMetaTag('name', 'twitter:image', currentMeta.image);
    }

    // 3. Update or Create Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', `${baseUrl}/${currentMeta.canonicalPath}`);

    // 4. Update Schema.org JSON-LD Structured Data
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${baseUrl}/#organization`,
          name: 'V&I TECH AFRICA LTD',
          alternateName: 'VITECH AFRICA',
          url: baseUrl,
          logo: `${baseUrl}/favicon.svg`,
          description: 'Entreprise panafricaine d’ingénierie logicielle, plateformes web & mobiles, architectures Cloud, IA et logiciels desktop.',
          email: 'contact.vitechdev@gmail.com',
          telephone: '+250795507001',
          address: [
            {
              '@type': 'PostalAddress',
              streetAddress: 'KN 3 Rd, Downtown Commercial District',
              addressLocality: 'Kigali',
              addressCountry: 'RW',
            },
            {
              '@type': 'PostalAddress',
              streetAddress: 'Boulevard Kanyamuhanga, Quartier Les Volcans',
              addressLocality: 'Goma',
              addressCountry: 'CD',
            },
          ],
          founder: {
            '@type': 'Person',
            name: 'Direction Technique V&I TECH',
            jobTitle: 'Lead Software Engineer & Technical Director',
            alumniOf: {
              '@type': 'CollegeOrUniversity',
              name: 'University of Kigali (ULK)',
            },
            knowsAbout: [
              'C# .NET WPF',
              'PHP & MVC Frameworks',
              'Python & Tkinter',
              'React & TypeScript',
              'Mobile Money APIs (MTN MoMo, Airtel Money)',
              'Relational Databases (MySQL, SQLite, SQL Server)',
            ],
          },
          sameAs: [
            'https://wa.me/250795507001',
            'https://github.com',
            'https://linkedin.com',
          ],
        },
        {
          '@type': 'ProfessionalService',
          '@id': `${baseUrl}/#service`,
          name: 'V&I TECH AFRICA LTD Software Engineering Services',
          url: baseUrl,
          priceRange: '$30 - $25000',
          image: currentMeta.image || `${baseUrl}/favicon.svg`,
          telephone: '+250795507001',
          currenciesAccepted: 'USD, RWF, CDF, EUR, XOF, XAF',
          paymentAccepted: 'MTN Mobile Money, Airtel Money, Bank Wire (SWIFT), Credit Card, Western Union',
          areaServed: [
            { '@type': 'Country', name: 'Rwanda' },
            { '@type': 'Country', name: 'Democratic Republic of the Congo' },
            { '@type': 'Country', name: 'Senegal' },
            { '@type': 'Country', name: 'Ivory Coast' },
            { '@type': 'Country', name: 'France' },
            { '@type': 'Country', name: 'Belgium' },
            { '@type': 'Country', name: 'Canada' },
          ],
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.95',
            reviewCount: '128',
            bestRating: '5',
            worstRating: '1',
          },
        },
        {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          url: baseUrl,
          name: 'V&I TECH AFRICA LTD',
          description: 'Digital Solutions for Africa and Global Markets',
          inLanguage: currentLanguage,
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${baseUrl}/${currentMeta.canonicalPath}#breadcrumb`,
          itemListElement: currentMeta.breadcrumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: crumb.item,
          })),
        },
        // Dynamically add Marketplace or Product structured data when on scripts view
        ...(selectedProduct 
          ? [generateProductJsonLd(selectedProduct)]
          : activeView === 'scripts' 
            ? [generateMarketplaceJsonLd(INITIAL_SCRIPTS)]
            : []
        ),
      ],
    };

    let jsonLdScript = document.getElementById('vitech-structured-data') as HTMLScriptElement;
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'vitech-structured-data';
      jsonLdScript.type = 'application/ld+json';
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify(structuredData);
  }, [activeView, currentLanguage, selectedProduct]);

  return null;
};
