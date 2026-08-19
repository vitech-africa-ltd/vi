import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageCode = 'fr' | 'en' | 'ar' | 'es' | 'pt' | 'sw' | 'rw' | 'de' | 'zh';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
  dir?: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'fr', name: 'Français', nativeName: 'Français', flag: '🇫🇷', region: 'Afrique Francophone & International', dir: 'ltr' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', region: 'Pan-African, Diaspora & Global', dir: 'ltr' },
  { code: 'ar', name: 'العربية (Arabe)', nativeName: 'العربية', flag: '🇸🇦', region: 'المغرب العربي، الشرق الأوسط وأفريقيا', dir: 'rtl' },
  { code: 'es', name: 'Español', nativeName: 'Español', flag: '🇪🇸', region: 'Guinea Ecuatorial, España & Global', dir: 'ltr' },
  { code: 'pt', name: 'Português', nativeName: 'Português', flag: '🇵🇹', region: 'Angola, Moçambique, Cabo Verde & Brasil', dir: 'ltr' },
  { code: 'sw', name: 'Kiswahili', nativeName: 'Kiswahili', flag: '🇹🇿', region: 'East African Community (Kenya, Tanzania)', dir: 'ltr' },
  { code: 'rw', name: 'Kinyarwanda', nativeName: 'Ikinyarwanda', flag: '🇷🇼', region: 'Rwanda Hub & R&D Center', dir: 'ltr' },
  { code: 'de', name: 'Deutsch', nativeName: 'Deutsch', flag: '🇩🇪', region: 'Deutschland, Schweiz & Österreich', dir: 'ltr' },
  { code: 'zh', name: '中文 (Chinois)', nativeName: '简体中文', flag: '🇨🇳', region: '全球合作伙伴与企业投资', dir: 'ltr' },
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.services': 'Services',
    'nav.portfolio': 'Réalisations',
    'nav.estimator': 'Devis en Ligne',
    'nav.techHubs': 'Hubs Panafricains',
    'nav.clientPortal': 'Espace Client',
    'nav.blog': 'Blog & R&D',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin',
    'nav.ctaQuote': 'DEMANDER UN DEVIS',
    'nav.bookCall': 'Appel 30 min',
    'nav.login': 'Connexion',
    'nav.logout': 'Déconnexion',
    'nav.whatsappDir': 'WhatsApp Dir.',
    'nav.directLine': 'Ligne Directeur',
    'nav.online': 'En Ligne',

    // Hero
    'hero.badge': 'Pôle d’Excellence Technologique Panafricain',
    'hero.motto': 'INNOVATE • DEVELOP • GROW',
    'hero.title1': 'L’Ingénierie Logicielle',
    'hero.title2': 'qui Propulse les Leaders en Afrique',
    'hero.desc': 'V&I TECH AFRICA LTD conçoit des plateformes SaaS haute performance, applications mobiles natives, architectures Cloud résilientes et solutions d’IA taillées pour l’expansion panafricaine et mondiale.',
    'hero.ctaEstimator': 'Simuler mon Devis en Ligne',
    'hero.ctaServices': 'Explorer nos Services',
    'hero.ctaCall': 'Planifier un Cadrage Technique (30 min)',
    'hero.statSla': 'Uptime SLA Garanti',
    'hero.statProjects': 'Projets Déployés',
    'hero.statCountries': 'Pays Couverts',
    'hero.statSatisfaction': 'Satisfaction Client',

    // Services
    'services.badge': 'Pôles d’Ingénierie & R&D',
    'services.title': 'Solutions Technologiques Sur-Mesure',
    'services.subtitle': 'De l’architecture logicielle critique à l’automatisation intelligente par IA, nos équipes d’ingénieurs seniors délivrent des systèmes scalables et pérennes.',
    'services.allCategories': 'Tous les Domaines',
    'services.startingAt': 'À partir de',
    'services.timeline': 'Délais moyens',
    'services.ctaConfigure': 'Configurer ce service dans l’estimateur',
    'services.ctaDetails': 'Fiche Technique & Livrables',
    'services.deliverablesTitle': 'Livrables Contractuels Clés',
    'services.featuresTitle': 'Capacités & Fonctionnalités',

    // Estimator
    'estimator.badge': 'Simulateur Transparent & Devis par Pays',
    'estimator.title': 'Calculez le Budget & les Délais de Votre Futur Projet',
    'estimator.subtitle': 'Obtenez une estimation budgétaire détaillée, le délai de livraison et les modalités financières adaptées précisément à votre pays et votre localisation.',
    'estimator.countryDetected': 'Votre pays détecté',
    'estimator.changeCountry': 'Changer de pays / Localisation',
    'estimator.step1': '1. Domaine Technologique',
    'estimator.step2': '2. Plateformes Cibles',
    'estimator.step3': '3. Modules & Fonctionnalités',
    'estimator.step4': '4. SLA & Rythme de Livraison',
    'estimator.step5': '5. Synthèse & Transfert',
    'estimator.calculatedTotal': 'Budget Estimatif Global',
    'estimator.calculatedTime': 'Délai de Livraison Estimé',
    'estimator.applyToContact': 'Valider & Transférer au Formulaire',
    'estimator.instantQuotePdf': 'Générer le Devis Officiel Personnalisé (PDF)',
    'estimator.printQuote': 'Imprimer / Exporter le Devis',
    'estimator.localHub': 'Hub Régional V&I TECH',
    'estimator.paymentMethods': 'Modes de Paiement Locaux Acceptés',
    'estimator.taxCompliance': 'Régime Fiscal & Facturation',

    // Tech Hubs
    'techHubs.badge': 'Présence Géographique & R&D',
    'techHubs.title': 'Nos Hubs Technologiques en Afrique',
    'techHubs.subtitle': 'Une force d’ingénierie distribuée au cœur des écosystèmes d’innovation de Kigali, Dakar, Abidjan et Paris.',
    'techHubs.scheduleWithLead': 'Prendre rendez-vous avec ce Hub',

    // Portfolio
    'portfolio.badge': 'Études de Cas & Déploiements',
    'portfolio.title': 'Nos Réalisations d’Ingénierie Logicielle',
    'portfolio.subtitle': 'Découvrez comment nous avons transformé des défis technologiques complexes en solutions digitales à fort impact.',
    'portfolio.ctaSimilar': 'Démarrer un projet similaire',

    // Contact
    'contact.badge': 'Démarrage de Projet & Contact Direction',
    'contact.title': 'Parlons de Votre Prochain Défi Technologique',
    'contact.subtitle': 'Remplissez le formulaire ci-dessous ou contactez directement notre Directeur Général. Vous recevrez une réponse sous 24h avec accord de confidentialité (NDA).',
    'contact.formName': 'Nom complet & Fonction',
    'contact.formEmail': 'Email professionnel',
    'contact.formPhone': 'Téléphone / WhatsApp',
    'contact.formCompany': 'Entreprise ou Organisation',
    'contact.formService': 'Pôle d’ingénierie concerné',
    'contact.formBudget': 'Fourchette budgétaire',
    'contact.formTimeline': 'Délai souhaité',
    'contact.formDesc': 'Description de votre projet ou cahier des charges',
    'contact.formNda': 'Je souhaite signer un accord de confidentialité (NDA) préalable',
    'contact.submitBtn': 'Transmettre la Demande à la Direction',
    'contact.directWhatsapp': 'Discuter en direct sur WhatsApp avec le Directeur',
    'contact.successTitle': 'Demande Transmise avec Succès !',
    'contact.successDesc': 'Notre équipe d’ingénieurs et la Direction analysent votre projet. Un retour complet vous sera transmis sous 24h.',

    // Common
    'common.search': 'Rechercher...',
    'common.filter': 'Filtrer',
    'common.save': 'Enregistrer',
    'common.saving': 'Enregistrement...',
    'common.cancel': 'Annuler',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.add': 'Ajouter',
    'common.close': 'Fermer',
    'common.confirm': 'Confirmer',
    'common.loading': 'Chargement en cours...',
    'common.error': 'Une erreur est survenue',
    'common.success': 'Opération réussie !',
  },

  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.portfolio': 'Portfolio',
    'nav.estimator': 'Online Estimate',
    'nav.techHubs': 'Pan-African Hubs',
    'nav.clientPortal': 'Client Portal',
    'nav.blog': 'Blog & R&D',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin',
    'nav.ctaQuote': 'REQUEST A QUOTE',
    'nav.bookCall': 'Book 30 min Call',
    'nav.login': 'Sign In',
    'nav.logout': 'Sign Out',
    'nav.whatsappDir': 'WhatsApp Dir.',
    'nav.directLine': 'Managing Director',
    'nav.online': 'Online',

    // Hero
    'hero.badge': 'Pan-African Center of Software Engineering Excellence',
    'hero.motto': 'INNOVATE • DEVELOP • GROW',
    'hero.title1': 'Software Engineering',
    'hero.title2': 'Empowering Industry Leaders Across Africa',
    'hero.desc': 'V&I TECH AFRICA LTD builds mission-critical SaaS platforms, native mobile apps, resilient cloud architectures and enterprise AI tailored for pan-African and international growth.',
    'hero.ctaEstimator': 'Calculate Your Project Estimate',
    'hero.ctaServices': 'Explore Our Services',
    'hero.ctaCall': 'Schedule Technical Scoping (30 min)',
    'hero.statSla': 'Guaranteed Uptime SLA',
    'hero.statProjects': 'Projects Delivered',
    'hero.statCountries': 'Countries Covered',
    'hero.statSatisfaction': 'Client Satisfaction',

    // Services
    'services.badge': 'Engineering & R&D Divisions',
    'services.title': 'Custom Enterprise Software Solutions',
    'services.subtitle': 'From mission-critical backend architecture to intelligent AI automation, our senior engineers deliver resilient and scalable systems.',
    'services.allCategories': 'All Domains',
    'services.startingAt': 'Starting from',
    'services.timeline': 'Avg. Timeline',
    'services.ctaConfigure': 'Configure in Estimator',
    'services.ctaDetails': 'Specifications & Deliverables',
    'services.deliverablesTitle': 'Key Contractual Deliverables',
    'services.featuresTitle': 'Capabilities & Features',

    // Estimator
    'estimator.badge': 'Transparent Estimator & Country-Specific Quote',
    'estimator.title': 'Calculate the Budget & Timelines for Your Future Project',
    'estimator.subtitle': 'Get an instant, detailed budget breakdown, delivery schedule and legal/payment terms tailored specifically to your country and location.',
    'estimator.countryDetected': 'Your detected country',
    'estimator.changeCountry': 'Change country / location',
    'estimator.step1': '1. Tech Domain',
    'estimator.step2': '2. Target Platforms',
    'estimator.step3': '3. Core Modules & Features',
    'estimator.step4': '4. SLA & Delivery Pace',
    'estimator.step5': '5. Summary & Transfer',
    'estimator.calculatedTotal': 'Estimated Total Budget',
    'estimator.calculatedTime': 'Estimated Delivery Time',
    'estimator.applyToContact': 'Validate & Transfer to Contact Form',
    'estimator.instantQuotePdf': 'Generate Official Customized Quote (PDF)',
    'estimator.printQuote': 'Print / Export Country Quote',
    'estimator.localHub': 'Assigned V&I TECH Hub',
    'estimator.paymentMethods': 'Accepted Local Payment Methods',
    'estimator.taxCompliance': 'Tax Compliance & Invoicing',

    // Tech Hubs
    'techHubs.badge': 'Geographic Presence & R&D',
    'techHubs.title': 'Our Technology Hubs in Africa',
    'techHubs.subtitle': 'A distributed engineering force in the vibrant tech ecosystems of Kigali, Dakar, Abidjan and Paris.',
    'techHubs.scheduleWithLead': 'Book a call with this Hub',

    // Portfolio
    'portfolio.badge': 'Case Studies & Deployments',
    'portfolio.title': 'Our Software Engineering Achievements',
    'portfolio.subtitle': 'Discover how we transformed complex technical challenges into scalable, high-impact digital systems.',
    'portfolio.ctaSimilar': 'Start a similar project',

    // Contact
    'contact.badge': 'Project Initiation & Executive Contact',
    'contact.title': 'Let’s Discuss Your Next Engineering Challenge',
    'contact.subtitle': 'Fill out the form below or contact our Managing Director directly. You will receive a full response within 24 hours with NDA protection.',
    'contact.formName': 'Full Name & Title',
    'contact.formEmail': 'Business Email',
    'contact.formPhone': 'Phone / WhatsApp',
    'contact.formCompany': 'Company or Organization',
    'contact.formService': 'Relevant Engineering Division',
    'contact.formBudget': 'Budget Range',
    'contact.formTimeline': 'Desired Timeline',
    'contact.formDesc': 'Project Description or Requirements',
    'contact.formNda': 'I would like a Non-Disclosure Agreement (NDA) prior to project kick-off',
    'contact.submitBtn': 'Submit Inquiry to Executive Leadership',
    'contact.directWhatsapp': 'Chat directly on WhatsApp with Managing Director',
    'contact.successTitle': 'Inquiry Submitted Successfully!',
    'contact.successDesc': 'Our engineering leadership is analyzing your requirements. You will receive a detailed proposal within 24 hours.',

    // Common
    'common.search': 'Search...',
    'common.filter': 'Filter',
    'common.save': 'Save',
    'common.saving': 'Saving...',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.add': 'Add',
    'common.close': 'Close',
    'common.confirm': 'Confirm',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Operation successful!',
  },

  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.services': 'الخدمات الهندسية',
    'nav.portfolio': 'مشاريعنا الناجحة',
    'nav.estimator': 'حاسبة التكلفة',
    'nav.techHubs': 'مراكزنا في أفريقيا',
    'nav.clientPortal': 'بوابة العملاء',
    'nav.blog': 'المدونة والبحث',
    'nav.contact': 'تواصل معنا',
    'nav.admin': 'لوحة الإدارة',
    'nav.ctaQuote': 'طلب عرض أسعار',
    'nav.bookCall': 'حجز استشارة 30 دقيقة',
    'nav.login': 'تسجيل الدخول',
    'nav.logout': 'تسجيل الخروج',
    'nav.whatsappDir': 'واتساب الإدارة',
    'nav.directLine': 'الخط المباشر',
    'nav.online': 'متصل الآن',

    // Hero
    'hero.badge': 'مركز التميز التكنولوجي الأفريقي والعالمي',
    'hero.motto': 'ابتكار • تطوير • نمو مستدام',
    'hero.title1': 'الهندسة البرمجية المتقدمة',
    'hero.title2': 'التي تقود رواد الأعمال في أفريقيا والعالم',
    'hero.desc': 'تقوم شركة V&I TECH AFRICA LTD بتصميم وبناء منصات SaaS السحابية فائقة الأداء، وتطبيقات الهاتف الذكية، وحلول الذكاء الاصطناعي المؤسسي لضمان توسعك السريع.',
    'hero.ctaEstimator': 'احسب ميزانية مشروعك فوراً',
    'hero.ctaServices': 'استكشف حلولنا الهندسية',
    'hero.ctaCall': 'حجز جلسة تأطير تقني (30 دقيقة)',
    'hero.statSla': 'جاهزية السيرفرات المضمونة',
    'hero.statProjects': 'مشروع تم تسليمه',
    'hero.statCountries': 'دولة نغطيها',
    'hero.statSatisfaction': 'نسبة رضا العملاء',

    // Estimator
    'estimator.badge': 'حاسبة شفافة وعرض أسعار مخصص لكل دولة',
    'estimator.title': 'احسب ميزانية وجدول زمني لمشروعك المستقبلي',
    'estimator.subtitle': 'احصل على تقدير مالي دقيق وجدول تسليم تفصيلي مخصص بحسب دولتك وعملتك المحلية وخيارات الدفع المتاحة.',
    'estimator.countryDetected': 'دولتكم المحددة تلقائياً',
    'estimator.changeCountry': 'تغيير الدولة / الموقع الجغرافي',
    'estimator.step1': '1. المجال التكنولوجي',
    'estimator.step2': '2. منصات التشغيل',
    'estimator.step3': '3. الميزات والوحدات البرمجية',
    'estimator.step4': '4. مستوى الخدمة (SLA) وسرعة الإنجاز',
    'estimator.step5': '5. الملخص والتأكيد',
    'estimator.calculatedTotal': 'إجمالي الميزانية التقديرية',
    'estimator.calculatedTime': 'مدة التسليم التقديرية',
    'estimator.applyToContact': 'اعتماد ونقل البيانات لطلب التعاقد',
    'estimator.instantQuotePdf': 'توليد عرض السعر الرسمي للدولة (PDF)',
    'estimator.printQuote': 'طباعة وتصدير عرض السعر',
    'estimator.localHub': 'مركز V&I TECH الإقليمي المعتمد',
    'estimator.paymentMethods': 'طرق الدفع المحلية المقبولة',
    'estimator.taxCompliance': 'الامتثال الضريبي والفوترة القانونية',

    // Services
    'services.badge': 'أقسام الهندسة والتطوير',
    'services.title': 'حلول تكنولوجية مؤسسية مخصصة',
    'services.subtitle': 'من البنى التحتية الحساسة إلى أتمتة الأعمال بالذكاء الاصطناعي، يقدم مهندسونا أنظمة برمجية قابلة للتوسع.',
    'services.allCategories': 'كافة التخصصات',
    'services.startingAt': 'تبدأ من',
    'services.timeline': 'متوسط المدة',
    'services.ctaConfigure': 'تهيئة الخدمة في الحاسبة',
    'services.ctaDetails': 'المواصفات والمخرجات',
    'services.deliverablesTitle': 'المخرجات التعاقدية الرئيسية',
    'services.featuresTitle': 'القدرات والخصائص',

    // Contact
    'contact.badge': 'بدء المشروع والتواصل مع الإدارة',
    'contact.title': 'دعنا نناقش مشروعك التكنولوجي القادم',
    'contact.subtitle': 'املأ النموذج أدناه أو تواصل مباشرة مع الإدارة العامة. سنرد عليك خلال 24 ساعة مع اتفاقية سرية تامة (NDA).',
    'contact.formName': 'الاسم الكامل والمنصب',
    'contact.formEmail': 'البريد الإلكتروني للعمل',
    'contact.formPhone': 'رقم الهاتف / واتساب',
    'contact.formCompany': 'الشركة أو المؤسسة',
    'contact.formService': 'مجال الهندسة المطلوب',
    'contact.formBudget': 'النطاق المالي المقدر',
    'contact.formTimeline': 'المدة المطلوبة للتسليم',
    'contact.formDesc': 'شرح المشروع أو المواصفات التقنية',
    'contact.formNda': 'أرغب في توقيع اتفاقية عدم إفصاح وسرية (NDA) قبل البدء',
    'contact.submitBtn': 'إرسال الطلب للإدارة التنفيذية',
    'contact.directWhatsapp': 'محادثة مباشرة عبر واتساب مع المدير العام',
    'contact.successTitle': 'تم إرسال طلبكم بنجاح!',
    'contact.successDesc': 'فريق المهندسين والإدارة يدرسون طلبكم حالياً. سنزودكم بتقرير مفصل خلال 24 ساعة.',

    // Common
    'common.search': 'بحث...',
    'common.filter': 'تصفية',
    'common.save': 'حفظ',
    'common.saving': 'جاري الحفظ...',
    'common.cancel': 'إلغاء',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.add': 'إضافة',
    'common.close': 'إغلاق',
    'common.confirm': 'تأكيد',
    'common.loading': 'جاري التحميل...',
    'common.error': 'حدث خطأ غير متوقع',
    'common.success': 'تمت العملية بنجاح!',
  },

  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.services': 'Servicios',
    'nav.portfolio': 'Proyectos',
    'nav.estimator': 'Presupuesto Online',
    'nav.techHubs': 'Hubs Panafricanos',
    'nav.clientPortal': 'Portal del Cliente',
    'nav.blog': 'Blog & I+D',
    'nav.contact': 'Contacto',
    'nav.admin': 'Admin',
    'nav.ctaQuote': 'SOLICITAR PRESUPUESTO',
    'nav.bookCall': 'Llamada de 30 min',
    'nav.login': 'Iniciar Sesión',
    'nav.logout': 'Cerrar Sesión',
    'nav.whatsappDir': 'WhatsApp Dir.',
    'nav.directLine': 'Línea del Director',
    'nav.online': 'En Línea',

    // Hero
    'hero.badge': 'Polo Panafricano de Excelencia en Ingeniería de Software',
    'hero.motto': 'INNOVATE • DEVELOP • GROW',
    'hero.title1': 'Ingeniería de Software',
    'hero.title2': 'que Impulsa a los Líderes en África y el Mundo',
    'hero.desc': 'V&I TECH AFRICA LTD diseña plataformas SaaS de alto rendimiento, aplicaciones móviles nativas, arquitecturas Cloud resilientes y soluciones de Inteligencia Artificial para el crecimiento global.',
    'hero.ctaEstimator': 'Calcular Presupuesto Online',
    'hero.ctaServices': 'Explorar Servicios',
    'hero.ctaCall': 'Agendar Sesión Técnica (30 min)',
    'hero.statSla': 'SLA Uptime Garantizado',
    'hero.statProjects': 'Proyectos Entregados',
    'hero.statCountries': 'Países Cubiertos',
    'hero.statSatisfaction': 'Satisfacción de Clientes',

    // Estimator
    'estimator.badge': 'Simulador Transparente y Presupuesto por País',
    'estimator.title': 'Calcule el Presupuesto y Plazos de su Futuro Proyecto',
    'estimator.subtitle': 'Obtenga una estimación presupuestaria detallada, plazos de entrega y términos financieros adaptados a su país y moneda local.',
    'estimator.countryDetected': 'Su país detectado',
    'estimator.changeCountry': 'Cambiar país / ubicación',
    'estimator.step1': '1. Dominio Tecnológico',
    'estimator.step2': '2. Plataformas de Despliegue',
    'estimator.step3': '3. Módulos y Funcionalidades',
    'estimator.step4': '4. Nivel de Servicio (SLA) y Ritmo',
    'estimator.step5': '5. Síntesis y Envío',
    'estimator.calculatedTotal': 'Presupuesto Total Estimado',
    'estimator.calculatedTime': 'Plazo Estimado de Entrega',
    'estimator.applyToContact': 'Validar y Transferir al Formulario',
    'estimator.instantQuotePdf': 'Generar Presupuesto Oficial País (PDF)',
    'estimator.printQuote': 'Imprimir / Exportar Presupuesto',
    'estimator.localHub': 'Hub Regional V&I TECH',
    'estimator.paymentMethods': 'Métodos de Pago Locales Aceptados',
    'estimator.taxCompliance': 'Régimen Fiscal y Facturación',

    // Services
    'services.badge': 'Divisiones de Ingeniería e I+D',
    'services.title': 'Soluciones Tecnológicas a Medida',
    'services.subtitle': 'Desde arquitectura de software crítica hasta automatización con IA, entregamos sistemas seguros y escalables.',
    'services.allCategories': 'Todos los Dominios',
    'services.startingAt': 'Desde',
    'services.timeline': 'Plazo promedio',
    'services.ctaConfigure': 'Configurar en el estimador',
    'services.ctaDetails': 'Especificaciones y Entregables',
    'services.deliverablesTitle': 'Entregables Contractuales Clave',
    'services.featuresTitle': 'Capacidades y Funcionalidades',

    // Contact
    'contact.badge': 'Inicio de Proyecto y Contacto Directivo',
    'contact.title': 'Hablemos de su Próximo Desafío Tecnológico',
    'contact.subtitle': 'Complete el formulario o contacte directamente a nuestra Dirección General. Respuesta garantizada en 24h con acuerdo de confidencialidad (NDA).',
    'contact.formName': 'Nombre Completo y Cargo',
    'contact.formEmail': 'Correo Electrónico Corporativo',
    'contact.formPhone': 'Teléfono / WhatsApp',
    'contact.formCompany': 'Empresa u Organización',
    'contact.formService': 'División de Ingeniería',
    'contact.formBudget': 'Rango Presupuestario',
    'contact.formTimeline': 'Plazo deseado',
    'contact.formDesc': 'Descripción del proyecto o requerimientos',
    'contact.formNda': 'Deseo firmar un acuerdo de confidencialidad (NDA) antes de iniciar',
    'contact.submitBtn': 'Enviar Solicitud a la Dirección',
    'contact.directWhatsapp': 'Chatear por WhatsApp con el Director General',
    'contact.successTitle': '¡Solicitud Enviada con Éxito!',
    'contact.successDesc': 'Nuestro equipo directivo y de ingenieros está analizando su proyecto. Recibirá una propuesta completa en 24 horas.',

    // Common
    'common.search': 'Buscar...',
    'common.filter': 'Filtrar',
    'common.save': 'Guardar',
    'common.saving': 'Guardando...',
    'common.cancel': 'Cancelar',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.add': 'Añadir',
    'common.close': 'Cerrar',
    'common.confirm': 'Confirmar',
    'common.loading': 'Cargando...',
    'common.error': 'Ocurrió un error',
    'common.success': '¡Operación exitosa!',
  },

  pt: {
    // Navigation
    'nav.home': 'Início',
    'nav.services': 'Serviços',
    'nav.portfolio': 'Portfólio',
    'nav.estimator': 'Orçamento Online',
    'nav.techHubs': 'Hubs Pan-Africanos',
    'nav.clientPortal': 'Portal do Cliente',
    'nav.blog': 'Blog & I&D',
    'nav.contact': 'Contacto',
    'nav.admin': 'Admin',
    'nav.ctaQuote': 'SOLICITAR ORÇAMENTO',
    'nav.bookCall': 'Reunião de 30 min',
    'nav.login': 'Entrar',
    'nav.logout': 'Sair',
    'nav.whatsappDir': 'WhatsApp Dir.',
    'nav.directLine': 'Linha Direta Diretor',
    'nav.online': 'Online',

    // Hero
    'hero.badge': 'Polo Pan-Africano de Excelência em Engenharia de Software',
    'hero.motto': 'INNOVATE • DEVELOP • GROW',
    'hero.title1': 'Engenharia de Software',
    'hero.title2': 'que Impulsiona Líderes em África e no Mundo',
    'hero.desc': 'A V&I TECH AFRICA LTD cria plataformas SaaS de alto desempenho, aplicativos móveis nativos, arquiteturas Cloud resilientes e soluções de IA desenhadas para escala global.',
    'hero.ctaEstimator': 'Calcular Orçamento Online',
    'hero.ctaServices': 'Explorar Serviços',
    'hero.ctaCall': 'Agendar Reunião Técnica (30 min)',
    'hero.statSla': 'SLA Uptime Garantido',
    'hero.statProjects': 'Projetos Entregues',
    'hero.statCountries': 'Países Cobertos',
    'hero.statSatisfaction': 'Satisfação do Cliente',

    // Estimator
    'estimator.badge': 'Simulador Transparente e Orçamento por País',
    'estimator.title': 'Calcule o Orçamento e Prazos do Seu Futuro Projeto',
    'estimator.subtitle': 'Obtenha uma estimativa orçamentária detalhada, cronograma de entrega e condições financeiras adaptadas ao seu país e moeda local.',
    'estimator.countryDetected': 'O seu país detetado',
    'estimator.changeCountry': 'Alterar país / localização',
    'estimator.step1': '1. Domínio Tecnológico',
    'estimator.step2': '2. Plataformas Alvo',
    'estimator.step3': '3. Módulos e Funcionalidades',
    'estimator.step4': '4. Nível de SLA e Ritmo',
    'estimator.step5': '5. Resumo e Envio',
    'estimator.calculatedTotal': 'Orçamento Estimado Total',
    'estimator.calculatedTime': 'Prazo de Entrega Estimado',
    'estimator.applyToContact': 'Validar e Transferir para o Formulário',
    'estimator.instantQuotePdf': 'Gerar Orçamento Oficial por País (PDF)',
    'estimator.printQuote': 'Imprimir / Exportar Orçamento',
    'estimator.localHub': 'Hub Regional V&I TECH',
    'estimator.paymentMethods': 'Métodos de Pagamento Locais Aceites',
    'estimator.taxCompliance': 'Conformidade Fiscal e Faturação',

    // Services
    'services.badge': 'Divisões de Engenharia & I&D',
    'services.title': 'Soluções Tecnológicas Personalizadas',
    'services.subtitle': 'Da arquitetura de software crítica à automação inteligente por IA, entregamos sistemas robustos.',
    'services.allCategories': 'Todas as Áreas',
    'services.startingAt': 'A partir de',
    'services.timeline': 'Prazo médio',
    'services.ctaConfigure': 'Configurar no estimador',
    'services.ctaDetails': 'Especificações e Entregáveis',
    'services.deliverablesTitle': 'Principais Entregáveis Contratuais',
    'services.featuresTitle': 'Capacidades e Funcionalidades',

    // Contact
    'contact.badge': 'Início de Projeto e Contato Executivo',
    'contact.title': 'Vamos Conversar Sobre o Seu Próximo Desafio',
    'contact.subtitle': 'Preencha o formulário ou fale diretamente com a nossa Direção Geral. Resposta em 24h com acordo de confidencialidade (NDA).',
    'contact.formName': 'Nome Completo e Cargo',
    'contact.formEmail': 'E-mail Profissional',
    'contact.formPhone': 'Telefone / WhatsApp',
    'contact.formCompany': 'Empresa ou Organização',
    'contact.formService': 'Divisão de Engenharia',
    'contact.formBudget': 'Faixa Orçamentária',
    'contact.formTimeline': 'Prazo desejado',
    'contact.formDesc': 'Descrição do projeto ou especificações',
    'contact.formNda': 'Pretendo assinar um acordo de confidencialidade (NDA)',
    'contact.submitBtn': 'Enviar Pedido à Direção Geral',
    'contact.directWhatsapp': 'Conversar no WhatsApp com o Diretor Geral',
    'contact.successTitle': 'Pedido Enviado com Sucesso!',
    'contact.successDesc': 'A nossa equipa de engenheiros e a Direção estão a analisar o seu projeto. Retorno completo em 24h.',

    // Common
    'common.search': 'Pesquisar...',
    'common.filter': 'Filtrar',
    'common.save': 'Guardar',
    'common.saving': 'A guardar...',
    'common.cancel': 'Cancelar',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.add': 'Adicionar',
    'common.close': 'Fechar',
    'common.confirm': 'Confirmar',
    'common.loading': 'A carregar...',
    'common.error': 'Ocorreu um erro',
    'common.success': 'Operação concluída com sucesso!',
  },

  sw: {
    // Navigation
    'nav.home': 'Nyumbani',
    'nav.services': 'Huduma Zetu',
    'nav.portfolio': 'Kazi Tulizofanya',
    'nav.estimator': 'Kadiria Bei Mtandaoni',
    'nav.techHubs': 'Vituo vya Teknolojia Afrika',
    'nav.clientPortal': 'Tovuti ya Wateja',
    'nav.blog': 'Blogu na Utafiti',
    'nav.contact': 'Wasiliana Nasi',
    'nav.admin': 'Utawala',
    'nav.ctaQuote': 'OMBA NUKUU YA BEI',
    'nav.bookCall': 'Mkutano wa Dakika 30',
    'nav.login': 'Ingia',
    'nav.logout': 'Toka',
    'nav.whatsappDir': 'WhatsApp ya Mkurugenzi',
    'nav.directLine': 'Simu ya Mkurugenzi',
    'nav.online': 'Yuko Mtandaoni',

    // Hero
    'hero.badge': 'Kituo Kikuu cha Uhandisi wa Programu Barani Afrika',
    'hero.motto': 'INNOVATE • DEVELOP • GROW',
    'hero.title1': 'Uhandisi wa Programu',
    'hero.title2': 'Unaowawezesha Viongozi Barani Afrika',
    'hero.desc': 'V&I TECH AFRICA LTD inaunda mifumo ya SaaS yenye ufanisi wa hali ya juu, programu za simu za kisasa, mifumo thabiti ya Cloud na suluhu za Akili Mnemba (AI) kwa ukuaji wa kimataifa.',
    'hero.ctaEstimator': 'Kadiria Gharama za Mradi Wako',
    'hero.ctaServices': 'Tazama Huduma Zetu',
    'hero.ctaCall': 'Panga Mkutano wa Kiteknolojia (Dak 30)',
    'hero.statSla': 'Uhakika wa Huduma (SLA)',
    'hero.statProjects': 'Miradi Iliyokamilika',
    'hero.statCountries': 'Nchi Tunazohudumia',
    'hero.statSatisfaction': 'Kuridhika kwa Wateja',

    // Estimator
    'estimator.badge': 'Kikokotoo cha Wazi na Gharama kwa Kila Nchi',
    'estimator.title': 'Kadiria Bajeti na Muda wa Mradi Wako Ujao',
    'estimator.subtitle': 'Pata makadirio sahihi ya bajeti, muda wa utekelezaji na njia za malipo zinazolingana na nchi yako na sarafu ya eneo lako.',
    'estimator.countryDetected': 'Nchi Yako Iliyotambuliwa',
    'estimator.changeCountry': 'Badilisha Nchi / Eneo',
    'estimator.step1': '1. Aina ya Teknolojia',
    'estimator.step2': '2. Mifumo ya Utekelezaji',
    'estimator.step3': '3. Vipengele na Utendaji',
    'estimator.step4': '4. Kiwango cha Huduma (SLA)',
    'estimator.step5': '5. Muhtasari na Kutuma',
    'estimator.calculatedTotal': 'Jumla ya Bajeti Inayokadiriwa',
    'estimator.calculatedTime': 'Muda wa Kukamilisha Mradi',
    'estimator.applyToContact': 'Thibitisha na Tuma Kwenye Fomu',
    'estimator.instantQuotePdf': 'Tengeneza Waraka Rasmi wa Bei (PDF)',
    'estimator.printQuote': 'Chapa / Hamisha Makadirio',
    'estimator.localHub': 'Kituo cha Karibu cha V&I TECH',
    'estimator.paymentMethods': 'Njia za Malipo Zinazokubalika',
    'estimator.taxCompliance': 'Uzingatiaji wa Kodi na Risiti',

    // Services
    'services.badge': 'Idara za Uhandisi na Utafiti',
    'services.title': 'Suluhu za Kiteknolojia Zilizoboreshwa',
    'services.subtitle': 'Kutoka mifumo migumu ya kompyuta hadi Akili Mnemba (AI), wahandisi wetu wakuu hutoa mifumo dhabiti.',
    'services.allCategories': 'Nyanja Zote',
    'services.startingAt': 'Kuanzia',
    'services.timeline': 'Wastani wa muda',
    'services.ctaConfigure': 'Weka kwenye kikadiriaji',
    'services.ctaDetails': 'Maelezo ya Kiufundi',
    'services.deliverablesTitle': 'Matokeo Muhimu ya Mkataba',
    'services.featuresTitle': 'Uwezo na Vipengele',

    // Contact
    'contact.badge': 'Kuanzisha Mradi na Mawasiliano na Viongozi',
    'contact.title': 'Tujadili Changamoto Yako Ijayo ya Kiteknolojia',
    'contact.subtitle': 'Jaza fomu hapa chini au wasiliana moja kwa moja na Mkurugenzi Mtendaji wetu. Utapata jibu ndani ya saa 24 na mkataba wa usiri (NDA).',
    'contact.formName': 'Jina Kamili na Cheo',
    'contact.formEmail': 'Barua Pepe ya Kazini',
    'contact.formPhone': 'Nambari ya Simu / WhatsApp',
    'contact.formCompany': 'Kampuni au Shirika',
    'contact.formService': 'Idara ya Uhandisi Husika',
    'contact.formBudget': 'Kiwango cha Bajeti',
    'contact.formTimeline': 'Muda Unaotakiwa',
    'contact.formDesc': 'Maelezo ya mradi au mahitaji yako',
    'contact.formNda': 'Ninataka kusaini Mkataba wa Usiri (NDA) kabla ya kuanza',
    'contact.submitBtn': 'Wasilisha Ombi kwa Uongozi Mkuu',
    'contact.directWhatsapp': 'Zungumza moja kwa moja kwenye WhatsApp na Mkurugenzi',
    'contact.successTitle': 'Ombi Limewasilishwa Kikamilifu!',
    'contact.successDesc': 'Wahandisi wetu wakuu na Uongozi wanachambua mradi wako. Utapokea jibu la kina ndani ya saa 24.',

    // Common
    'common.search': 'Tafuta...',
    'common.filter': 'Chuja',
    'common.save': 'Hifadhi',
    'common.saving': 'Inahifadhi...',
    'common.cancel': 'Ghairi',
    'common.edit': 'Hariri',
    'common.delete': 'Futa',
    'common.add': 'Ongeza',
    'common.close': 'Funga',
    'common.confirm': 'Thibitisha',
    'common.loading': 'Inapakia...',
    'common.error': 'Kosa limetokea',
    'common.success': 'Imefanikiwa!',
  },

  rw: {
    // Navigation
    'nav.home': 'Ahabanza',
    'nav.services': 'Serivisi Zacu',
    'nav.portfolio': 'Ibyakozwe',
    'nav.estimator': 'Kubara Igiciro',
    'nav.techHubs': 'Ibiro Byacu Muri Afurika',
    'nav.clientPortal': 'Urubuga rw\'Abakiriya',
    'nav.blog': 'Amakuru & Ubushakashatsi',
    'nav.contact': 'Twandikire',
    'nav.admin': 'Ubuyobozi',
    'nav.ctaQuote': 'SABA IGICIRO',
    'nav.bookCall': 'Ibiganiro by\'Iminota 30',
    'nav.login': 'Kwinjira',
    'nav.logout': 'Gusohoka',
    'nav.whatsappDir': 'WhatsApp y\'Umuyobozi',
    'nav.directLine': 'Telefoni y\'Umuyobozi',
    'nav.online': 'Ari Kumurongo',

    // Hero
    'hero.badge': 'Ikigo cy\'Indashyikirwa mu Buhanga bwa Porogaramu Muri Afurika',
    'hero.motto': 'GUHANGA • KUBProbability • GUKURA',
    'hero.title1': 'Ubuhanga bwa Porogaramu',
    'hero.title2': 'Buteza Imbere Abayobozi Muri Afurika',
    'hero.desc': 'V&I TECH AFRICA LTD ikora imbuga za SaaS zikora neza cyane, porogaramu za telefoni, ububiko bwizewe bwa Cloud n\'ubwenge bw\'ubukorano (AI) byo guteza imbere ubucuruzi bwawe.',
    'hero.ctaEstimator': 'Bara Ingengo y\'Imari y\'Umushinga Wawe',
    'hero.ctaServices': 'Reba Serivisi Zacu',
    'hero.ctaCall': 'Teganya Inama y\'Ikoranabuhanga (Iminota 30)',
    'hero.statSla': 'Ubwizerane bwa Sisitemu (SLA)',
    'hero.statProjects': 'Imishinga Yarangiye',
    'hero.statCountries': 'Ibihugu Dukoreramo',
    'hero.statSatisfaction': 'Kunyurwa kw\'Abakiriya',

    // Estimator
    'estimator.badge': 'Ibarwa Ryizewe Ry\'Igiciro Buri Gihugu',
    'estimator.title': 'Bara Ingengo y\'Imari n\'Igihe cy\'Umushinga Wanyu',
    'estimator.subtitle': 'Bona igiciro nyacyo n\'igihe bizatwara bishingiye ku gihugu cyawe n\'uburyo bwo kwishyura buhari.',
    'estimator.countryDetected': 'Igihugu cyawe cyabonetse',
    'estimator.changeCountry': 'Hindura igihugu / Aho uri',
    'estimator.step1': '1. Ubwoko bw\'Ikoranabuhanga',
    'estimator.step2': '2. Aho Bizakoreshwa (Web/App)',
    'estimator.step3': '3. Ibizakorwa n\'Ubushobozi',
    'estimator.step4': '4. Urwego rwa Serivisi (SLA)',
    'estimator.step5': '5. Incamake no Kohereza',
    'estimator.calculatedTotal': 'Igiteranyo cy\'Ingengo y\'Imari',
    'estimator.calculatedTime': 'Igihe Bizatwara Byose',
    'estimator.applyToContact': 'Emeza Wohereze mu Formulaire',
    'estimator.instantQuotePdf': 'Kora Inyandiko y\'Igiciro Nyakuri (PDF)',
    'estimator.printQuote': 'Gucapa / Kubika Igiciro',
    'estimator.localHub': 'Ibiro Byegereye bya V&I TECH',
    'estimator.paymentMethods': 'Uburyo bwo Kwishyura Bwemewe',
    'estimator.taxCompliance': 'Uburyo bwo Gusoresha na Fagitire',

    // Services
    'services.badge': 'Amashami y\'Ubuhanga n\'Ubushakashatsi',
    'services.title': 'Ibisubizo by\'Ikoranabuhanga Bikozwe ku Gipimo',
    'services.subtitle': 'Guhera kuri sisitemu zikomeye kugeza ku bwenge bw\'ubukorano (AI), inzobere zacu zitanga ibyujuje ubuziranenge.',
    'services.allCategories': 'Ibyiciro Byose',
    'services.startingAt': 'Bihera kuri',
    'services.timeline': 'Igihe bitwara',
    'services.ctaConfigure': 'Tegurira muri Estimator',
    'services.ctaDetails': 'Ibisobanuro n\'Ibizakorwa',
    'services.deliverablesTitle': 'Iby\'ingenzi Bizatangwa mu Masezerano',
    'services.featuresTitle': 'Ubushobozi bw\'Icyo Wifuza',

    // Contact
    'contact.badge': 'Gutangira Umushinga no Kuvugana n\'Ubuyobozi',
    'contact.title': 'Reka Tuganire ku Mushinga Wawe Utaha',
    'contact.subtitle': 'Uzuza iyi fomu cyangwa uvugane n\'Umuyobozi Mukuru wacu. Uzasubizwa mu masaha 24 hamwe n\'amasezerano yo kubika ibanga (NDA).',
    'contact.formName': 'Amazina Yose n\'Umwanya',
    'contact.formEmail': 'Imeli y\'Akazi',
    'contact.formPhone': 'Telefoni / WhatsApp',
    'contact.formCompany': 'Ikigo cyangwa Umuryango',
    'contact.formService': 'Ishami ry\'Ikoranabuhanga Rikenewe',
    'contact.formBudget': 'Ingengo y\'Imari Uteganya',
    'contact.formTimeline': 'Igihe Wifuza Byarangiye',
    'contact.formDesc': 'Ibisobanuro by\'umushinga wawe',
    'contact.formNda': 'Nifuza gusinya amasezerano yo kubika ibanga (NDA) mbere yo gutangira',
    'contact.submitBtn': 'Ohereza Ubusabe ku Buyobozi',
    'contact.directWhatsapp': 'Vugana ako kanya kuri WhatsApp n\'Umuyobozi',
    'contact.successTitle': 'Ubusabe Bwoherejwe Neza!',
    'contact.successDesc': 'Inzobere n\'Ubuyobozi bari gusesengura umushinga wawe. Uzasubizwa mu masaha 24.',

    // Common
    'common.search': 'Shakisha...',
    'common.filter': 'Yungurura',
    'common.save': 'Bika',
    'common.saving': 'Birimo kubikwa...',
    'common.cancel': 'Kureka',
    'common.edit': 'Hindura',
    'common.delete': 'Siba',
    'common.add': 'Ongeraho',
    'common.close': 'Funga',
    'common.confirm': 'Emeza',
    'common.loading': 'Birimo gupakirwa...',
    'common.error': 'Habaye ikosa',
    'common.success': 'Byagenze neza!',
  },

  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.services': 'Dienstleistungen',
    'nav.portfolio': 'Projekte & Referenzen',
    'nav.estimator': 'Online-Kostenschätzung',
    'nav.techHubs': 'Panafrikanische Hubs',
    'nav.clientPortal': 'Kundenportal',
    'nav.blog': 'Blog & F&E',
    'nav.contact': 'Kontakt',
    'nav.admin': 'Verwaltung',
    'nav.ctaQuote': 'ANGEBOT ANFORDERN',
    'nav.bookCall': '30-Min-Beratung buchen',
    'nav.login': 'Anmelden',
    'nav.logout': 'Abmelden',
    'nav.whatsappDir': 'WhatsApp GF',
    'nav.directLine': 'Geschäftsleitung',
    'nav.online': 'Online',

    // Hero
    'hero.badge': 'Panafrikanisches Exzellenzzentrum für Software-Engineering',
    'hero.motto': 'INNOVATE • DEVELOP • GROW',
    'hero.title1': 'Software-Engineering',
    'hero.title2': 'das Marktführer in Afrika und weltweit antreibt',
    'hero.desc': 'V&I TECH AFRICA LTD entwickelt hochperformante SaaS-Plattformen, native mobile Apps, robuste Cloud-Architekturen und KI-Lösungen für globales Wachstum.',
    'hero.ctaEstimator': 'Projektschätzung Berechnen',
    'hero.ctaServices': 'Leistungen Entdecken',
    'hero.ctaCall': 'Technisches Scoping vereinbaren (30 Min)',
    'hero.statSla': 'Garantierte Uptime SLA',
    'hero.statProjects': 'Erfolgreiche Projekte',
    'hero.statCountries': 'Abgedeckte Länder',
    'hero.statSatisfaction': 'Kundenzufriedenheit',

    // Estimator
    'estimator.badge': 'Transparenter Kalkulator & Länderspezifisches Angebot',
    'estimator.title': 'Berechnen Sie das Budget und die Fristen Ihres Zukunftsprojekts',
    'estimator.subtitle': 'Erhalten Sie eine detaillierte Kostenschätzung, präzise Lieferzeiten und Zahlungsbedingungen angepasst an Ihr Land und Ihre Währung.',
    'estimator.countryDetected': 'Ihr erkanntes Land',
    'estimator.changeCountry': 'Land / Standort ändern',
    'estimator.step1': '1. Technologiebereich',
    'estimator.step2': '2. Zielplattformen',
    'estimator.step3': '3. Kernmodule & Funktionen',
    'estimator.step4': '4. Service-Level (SLA) & Tempo',
    'estimator.step5': '5. Zusammenfassung & Übermittlung',
    'estimator.calculatedTotal': 'Geschätztes Gesamtbudget',
    'estimator.calculatedTime': 'Geschätzte Lieferzeit',
    'estimator.applyToContact': 'Bestätigen & ins Formular übertragen',
    'estimator.instantQuotePdf': 'Offizielles Länderangebot (PDF) generieren',
    'estimator.printQuote': 'Angebot Drucken / Exportieren',
    'estimator.localHub': 'Zuständiger V&I TECH Hub',
    'estimator.paymentMethods': 'Akzeptierte lokale Zahlungsmethoden',
    'estimator.taxCompliance': 'Steuerkonformität & Rechnungsstellung',

    // Services
    'services.badge': 'Ingenieurwesen & F&E Abteilungen',
    'services.title': 'Maßgeschneiderte Unternehmenslösungen',
    'services.subtitle': 'Von kritischer Softwarearchitektur bis hin zu KI-Automatisierung liefern unsere Senior-Ingenieure skalierbare Systeme.',
    'services.allCategories': 'Alle Bereiche',
    'services.startingAt': 'Ab',
    'services.timeline': 'Durchschnittliche Dauer',
    'services.ctaConfigure': 'Im Schätzer konfigurieren',
    'services.ctaDetails': 'Spezifikationen & Lieferbestandteile',
    'services.deliverablesTitle': 'Wesentliche vertragliche Lieferbestandteile',
    'services.featuresTitle': 'Kapazitäten & Funktionen',

    // Contact
    'contact.badge': 'Projektstart & Geschäftsleitungskontakt',
    'contact.title': 'Lassen Sie uns über Ihre nächste Herausforderung sprechen',
    'contact.subtitle': 'Füllen Sie das Formular aus oder kontaktieren Sie direkt unsere Geschäftsführung. Antwort garantiert innerhalb von 24h inkl. Geheimhaltungsvereinbarung (NDA).',
    'contact.formName': 'Vollständiger Name & Position',
    'contact.formEmail': 'Geschäftliche E-Mail',
    'contact.formPhone': 'Telefon / WhatsApp',
    'contact.formCompany': 'Unternehmen oder Organisation',
    'contact.formService': 'Betroffener Entwicklungsbereich',
    'contact.formBudget': 'Budgetrahmen',
    'contact.formTimeline': 'Gewünschter Zeitrahmen',
    'contact.formDesc': 'Projektbeschreibung oder Lastenheft',
    'contact.formNda': 'Ich wünsche vorab eine Geheimhaltungsvereinbarung (NDA)',
    'contact.submitBtn': 'Anfrage an die Geschäftsleitung übermitteln',
    'contact.directWhatsapp': 'Direkt per WhatsApp mit der Geschäftsführung chatten',
    'contact.successTitle': 'Anfrage erfolgreich übermittelt!',
    'contact.successDesc': 'Unsere Geschäftsführung analysiert Ihre Anforderungen. Sie erhalten innerhalb von 24 Stunden eine Rückmeldung.',

    // Common
    'common.search': 'Suchen...',
    'common.filter': 'Filtern',
    'common.save': 'Speichern',
    'common.saving': 'Wird gespeichert...',
    'common.cancel': 'Abbrechen',
    'common.edit': 'Bearbeiten',
    'common.delete': 'Löschen',
    'common.add': 'Hinzufügen',
    'common.close': 'Schließen',
    'common.confirm': 'Bestätigen',
    'common.loading': 'Wird geladen...',
    'common.error': 'Ein Fehler ist aufgetreten',
    'common.success': 'Vorgang erfolgreich!',
  },

  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.services': '工程服务',
    'nav.portfolio': '成功案例',
    'nav.estimator': '在线估算报价',
    'nav.techHubs': '泛非研发中心',
    'nav.clientPortal': '客户门户',
    'nav.blog': '技术博客与研发',
    'nav.contact': '联系我们',
    'nav.admin': '管理后台',
    'nav.ctaQuote': '获取定制方案',
    'nav.bookCall': '预约30分钟技术咨询',
    'nav.login': '登录',
    'nav.logout': '退出',
    'nav.whatsappDir': '总经理WhatsApp',
    'nav.directLine': '总经办专线',
    'nav.online': '在线支持',

    // Hero
    'hero.badge': '泛非卓越软件工程与研发中心',
    'hero.motto': 'INNOVATE • DEVELOP • GROW',
    'hero.title1': '高端软件工程',
    'hero.title2': '赋能非洲及全球行业领军企业',
    'hero.desc': 'V&I TECH AFRICA LTD 打造高性能SaaS平台、原生移动应用、高可用云架构及企业级AI解决方案，助力国际化拓展。',
    'hero.ctaEstimator': '立即计算您的项目预算',
    'hero.ctaServices': '探索我们的工程服务',
    'hero.ctaCall': '预约30分钟技术架构评估',
    'hero.statSla': 'SLA服务可用性保证',
    'hero.statProjects': '已成功交付项目',
    'hero.statCountries': '业务覆盖国家',
    'hero.statSatisfaction': '客户满意度',

    // Estimator
    'estimator.badge': '透明化项目估算与国家专属报价单',
    'estimator.title': '计算您未来项目的预算与交付周期',
    'estimator.subtitle': '根据您所在的国家与地理位置，即时获取精准的成本预算、交付时间表、本地结算货币及合规支付方式。',
    'estimator.countryDetected': '系统自动识别国家',
    'estimator.changeCountry': '切换国家 / 所在地',
    'estimator.step1': '1. 技术架构领域',
    'estimator.step2': '2. 目标部署平台',
    'estimator.step3': '3. 核心功能与业务模块',
    'estimator.step4': '4. SLA服务等级与开发节奏',
    'estimator.step5': '5. 汇总并提交方案',
    'estimator.calculatedTotal': '项目总预算估算',
    'estimator.calculatedTime': '预计交付周期',
    'estimator.applyToContact': '确认并转入需求表单',
    'estimator.instantQuotePdf': '生成国家专属官方报价单 (PDF)',
    'estimator.printQuote': '打印 / 导出报价单',
    'estimator.localHub': '所属V&I TECH区域研发中心',
    'estimator.paymentMethods': '支持的本地及国际结算方式',
    'estimator.taxCompliance': '财税合规与国际发票条款',

    // Services
    'services.badge': '软件工程与研发部门',
    'services.title': '企业级定制化技术解决方案',
    'services.subtitle': '从核心底层架构到智能AI自动化，资深工程师团队交付高可用、高扩展性系统。',
    'services.allCategories': '全部分类',
    'services.startingAt': '起价',
    'services.timeline': '平均交付周期',
    'services.ctaConfigure': '在估算器中配置此服务',
    'services.ctaDetails': '技术规范与交付清单',
    'services.deliverablesTitle': '合同核心交付物',
    'services.featuresTitle': '功能与系统特性',

    // Contact
    'contact.badge': '启动项目与总经办直接对接',
    'contact.title': '共同探讨您的下一个技术突破',
    'contact.subtitle': '填写以下需求表单或直接与我们的总经理取得联系。我们将在24小时内提供包含保密协议 (NDA) 的完整评估方案。',
    'contact.formName': '您的全名与职位',
    'contact.formEmail': '企业电子邮箱',
    'contact.formPhone': '联系电话 / WhatsApp',
    'contact.formCompany': '公司或机构名称',
    'contact.formService': '相关工程技术领域',
    'contact.formBudget': '预算区间',
    'contact.formTimeline': '期望交付周期',
    'contact.formDesc': '项目需求描述或技术规格说明',
    'contact.formNda': '在启动前需签署严格保密协议 (NDA)',
    'contact.submitBtn': '将需求直接呈递至总经办',
    'contact.directWhatsapp': '通过 WhatsApp 与总经理即时对话',
    'contact.successTitle': '需求已成功提交！',
    'contact.successDesc': '工程管理团队正在深入分析您的项目需求，将在24小时内与您取得联系。',

    // Common
    'common.search': '搜索...',
    'common.filter': '筛选',
    'common.save': '保存',
    'common.saving': '保存中...',
    'common.cancel': '取消',
    'common.edit': '编辑',
    'common.delete': '删除',
    'common.add': '添加',
    'common.close': '关闭',
    'common.confirm': '确认',
    'common.loading': '加载中...',
    'common.error': '发生错误',
    'common.success': '操作成功！',
  },
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, defaultText?: string) => string;
  languages: LanguageOption[];
  currentLanguageOption: LanguageOption;
  isAutoDetected: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('fr');
  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(false);

  // Automatic language detection according to user browser & system environment
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('vitech_lang') as LanguageCode | null;
      if (savedLang && ['fr', 'en', 'ar', 'es', 'pt', 'sw', 'rw', 'de', 'zh'].includes(savedLang)) {
        setLanguageState(savedLang);
        return;
      }

      // Auto-detect from browser locale
      const browserLanguages = typeof navigator !== 'undefined' 
        ? [navigator.language, ...(navigator.languages || [])] 
        : [];

      let detected: LanguageCode = 'fr'; // default
      for (const lang of browserLanguages) {
        if (!lang) continue;
        const lower = lang.toLowerCase();
        if (lower.startsWith('ar')) {
          detected = 'ar';
          break;
        } else if (lower.startsWith('en')) {
          detected = 'en';
          break;
        } else if (lower.startsWith('de')) {
          detected = 'de';
          break;
        } else if (lower.startsWith('zh')) {
          detected = 'zh';
          break;
        } else if (lower.startsWith('es')) {
          detected = 'es';
          break;
        } else if (lower.startsWith('pt')) {
          detected = 'pt';
          break;
        } else if (lower.startsWith('sw')) {
          detected = 'sw';
          break;
        } else if (lower.startsWith('rw') || lower.startsWith('kin')) {
          detected = 'rw';
          break;
        } else if (lower.startsWith('fr')) {
          detected = 'fr';
          break;
        }
      }

      setLanguageState(detected);
      setIsAutoDetected(true);
    } catch {
      setLanguageState('fr');
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    setIsAutoDetected(false);
    try {
      localStorage.setItem('vitech_lang', lang);
      // Update HTML dir attribute for RTL support (e.g. Arabic)
      const selectedOption = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
      if (selectedOption?.dir) {
        document.documentElement.dir = selectedOption.dir;
      } else {
        document.documentElement.dir = 'ltr';
      }
    } catch {
      // ignore
    }
  };

  const t = (key: string, defaultText?: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.fr;
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English if not in current lang, then French
    if (TRANSLATIONS.en && TRANSLATIONS.en[key]) {
      return TRANSLATIONS.en[key];
    }
    if (TRANSLATIONS.fr && TRANSLATIONS.fr[key]) {
      return TRANSLATIONS.fr[key];
    }
    return defaultText || key;
  };

  const currentLanguageOption = 
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
        currentLanguageOption,
        isAutoDetected,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

export const useLanguage = useTranslation;
