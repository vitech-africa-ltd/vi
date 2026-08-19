import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  COMPANY_INFO as defaultCompanyInfo, 
  SERVICES_DATA as defaultServices, 
  CASE_STUDIES_DATA as defaultCaseStudies, 
  OFFICES_HUBS_DATA as defaultTechHubs, 
  TESTIMONIALS_DATA as defaultTestimonials, 
  BLOG_POSTS_DATA as defaultBlogPosts,
  DEFAULT_AI_CONFIG,
} from '../data/companyData';
import { ServiceItem, CaseStudy, BlogPost, Testimonial, OfficeHub, AIAssistantConfig } from '../types';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface SiteDataContextType {
  companyInfo: typeof defaultCompanyInfo;
  services: ServiceItem[];
  caseStudies: CaseStudy[];
  blogPosts: BlogPost[];
  techHubs: OfficeHub[];
  testimonials: Testimonial[];
  aiConfig: AIAssistantConfig;
  isLoading: boolean;
  isSaving: boolean;
  saveStatus: string | null;

  // CMS update methods
  updateCompanyInfo: (data: Partial<typeof defaultCompanyInfo>) => Promise<boolean>;
  
  // AI Assistant CMS Config
  updateAiConfig: (data: Partial<AIAssistantConfig>) => Promise<boolean>;
  resetAiConfigToDefault: () => Promise<boolean>;

  // Services
  addService: (service: ServiceItem) => Promise<boolean>;
  updateService: (service: ServiceItem) => Promise<boolean>;
  deleteService: (serviceId: string) => Promise<boolean>;

  // Case Studies / Portfolio
  addCaseStudy: (caseStudy: CaseStudy) => Promise<boolean>;
  updateCaseStudy: (caseStudy: CaseStudy) => Promise<boolean>;
  deleteCaseStudy: (id: string) => Promise<boolean>;

  // Blog Posts & Whitepapers
  addBlogPost: (post: BlogPost) => Promise<boolean>;
  updateBlogPost: (post: BlogPost) => Promise<boolean>;
  deleteBlogPost: (id: string) => Promise<boolean>;

  // Tech Hubs
  addTechHub: (hub: OfficeHub) => Promise<boolean>;
  updateTechHub: (hub: OfficeHub) => Promise<boolean>;
  deleteTechHub: (id: string) => Promise<boolean>;

  // Testimonials
  addTestimonial: (testimonial: Testimonial) => Promise<boolean>;
  updateTestimonial: (testimonial: Testimonial) => Promise<boolean>;
  deleteTestimonial: (id: string) => Promise<boolean>;

  // Reset to default factory data
  resetAllToFactoryDefaults: () => Promise<boolean>;
}

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

export const SiteDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companyInfo, setCompanyInfo] = useState<typeof defaultCompanyInfo>(defaultCompanyInfo);
  const [services, setServices] = useState<ServiceItem[]>(defaultServices);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(defaultCaseStudies);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(defaultBlogPosts);
  const [techHubs, setTechHubs] = useState<OfficeHub[]>(defaultTechHubs);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [aiConfig, setAiConfig] = useState<AIAssistantConfig>(DEFAULT_AI_CONFIG);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Load Initial Data from Firestore
  useEffect(() => {
    let unsubscribes: (() => void)[] = [];

    const initContent = () => {
      try {
        if (!db) {
          setIsLoading(false);
          return;
        }

        // Load Company Info
        const compRef = doc(db, 'site_content', 'company_info');
        const unsubComp = onSnapshot(compRef, (snap) => {
          if (snap.exists() && snap.data()?.data) {
            setCompanyInfo((prev) => ({ ...prev, ...snap.data()?.data }));
          }
        }, () => {});
        unsubscribes.push(unsubComp);

        // Load Services
        const servRef = doc(db, 'site_content', 'services');
        const unsubServ = onSnapshot(servRef, (snap) => {
          if (snap.exists() && Array.isArray(snap.data()?.data) && snap.data()?.data.length > 0) {
            setServices(snap.data()?.data);
          }
        }, () => {});
        unsubscribes.push(unsubServ);

        // Load Portfolio
        const portRef = doc(db, 'site_content', 'case_studies');
        const unsubPort = onSnapshot(portRef, (snap) => {
          if (snap.exists() && Array.isArray(snap.data()?.data) && snap.data()?.data.length > 0) {
            setCaseStudies(snap.data()?.data);
          }
        }, () => {});
        unsubscribes.push(unsubPort);

        // Load Blog Posts
        const blogRef = doc(db, 'site_content', 'blog_posts');
        const unsubBlog = onSnapshot(blogRef, (snap) => {
          if (snap.exists() && Array.isArray(snap.data()?.data) && snap.data()?.data.length > 0) {
            setBlogPosts(snap.data()?.data);
          }
        }, () => {});
        unsubscribes.push(unsubBlog);

        // Load Tech Hubs
        const hubsRef = doc(db, 'site_content', 'tech_hubs');
        const unsubHubs = onSnapshot(hubsRef, (snap) => {
          if (snap.exists() && Array.isArray(snap.data()?.data) && snap.data()?.data.length > 0) {
            setTechHubs(snap.data()?.data);
          }
        }, () => {});
        unsubscribes.push(unsubHubs);

        // Load Testimonials
        const testRef = doc(db, 'site_content', 'testimonials');
        const unsubTest = onSnapshot(testRef, (snap) => {
          if (snap.exists() && Array.isArray(snap.data()?.data) && snap.data()?.data.length > 0) {
            setTestimonials(snap.data()?.data);
          }
        }, () => {});
        unsubscribes.push(unsubTest);

        // Load AI Config
        const aiRef = doc(db, 'site_content', 'ai_config');
        const unsubAi = onSnapshot(aiRef, (snap) => {
          if (snap.exists() && snap.data()?.data) {
            setAiConfig((prev) => ({ ...prev, ...snap.data()?.data }));
          }
        }, () => {});
        unsubscribes.push(unsubAi);

        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing site content listeners:', err);
        setIsLoading(false);
      }
    };

    initContent();

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, []);

  // Generic helper to persist to Firestore
  const saveToFirestore = async (documentId: string, data: any): Promise<boolean> => {
    setIsSaving(true);
    setSaveStatus('Enregistrement sur Firestore...');
    try {
      if (!db) return false;
      const ref = doc(db, 'site_content', documentId);
      await setDoc(ref, {
        data,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      setSaveStatus('Modifications enregistrées avec succès !');
      setTimeout(() => setSaveStatus(null), 3000);
      return true;
    } catch (err) {
      console.error(`Error saving site_content/${documentId}:`, err);
      setSaveStatus("Erreur lors de l'enregistrement. Vérifiez les permissions.");
      setTimeout(() => setSaveStatus(null), 4000);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Company Info Actions
  const updateCompanyInfo = async (data: Partial<typeof defaultCompanyInfo>) => {
    const updated = { ...companyInfo, ...data };
    setCompanyInfo(updated);
    return await saveToFirestore('company_info', updated);
  };

  // Services Actions
  const addService = async (service: ServiceItem) => {
    const updated = [...services, service];
    setServices(updated);
    return await saveToFirestore('services', updated);
  };

  const updateService = async (service: ServiceItem) => {
    const updated = services.map((s) => (s.id === service.id ? service : s));
    setServices(updated);
    return await saveToFirestore('services', updated);
  };

  const deleteService = async (serviceId: string) => {
    const updated = services.filter((s) => s.id !== serviceId);
    setServices(updated);
    return await saveToFirestore('services', updated);
  };

  // Case Studies Actions
  const addCaseStudy = async (caseStudy: CaseStudy) => {
    const updated = [...caseStudies, caseStudy];
    setCaseStudies(updated);
    return await saveToFirestore('case_studies', updated);
  };

  const updateCaseStudy = async (caseStudy: CaseStudy) => {
    const updated = caseStudies.map((c) => (c.id === caseStudy.id ? caseStudy : c));
    setCaseStudies(updated);
    return await saveToFirestore('case_studies', updated);
  };

  const deleteCaseStudy = async (id: string) => {
    const updated = caseStudies.filter((c) => c.id !== id);
    setCaseStudies(updated);
    return await saveToFirestore('case_studies', updated);
  };

  // Blog Posts Actions
  const addBlogPost = async (post: BlogPost) => {
    const updated = [post, ...blogPosts];
    setBlogPosts(updated);
    return await saveToFirestore('blog_posts', updated);
  };

  const updateBlogPost = async (post: BlogPost) => {
    const updated = blogPosts.map((b) => (b.id === post.id ? post : b));
    setBlogPosts(updated);
    return await saveToFirestore('blog_posts', updated);
  };

  const deleteBlogPost = async (id: string) => {
    const updated = blogPosts.filter((b) => b.id !== id);
    setBlogPosts(updated);
    return await saveToFirestore('blog_posts', updated);
  };

  // Tech Hubs Actions
  const addTechHub = async (hub: OfficeHub) => {
    const updated = [...techHubs, hub];
    setTechHubs(updated);
    return await saveToFirestore('tech_hubs', updated);
  };

  const updateTechHub = async (hub: OfficeHub) => {
    const updated = techHubs.map((h) => (h.id === hub.id ? hub : h));
    setTechHubs(updated);
    return await saveToFirestore('tech_hubs', updated);
  };

  const deleteTechHub = async (id: string) => {
    const updated = techHubs.filter((h) => h.id !== id);
    setTechHubs(updated);
    return await saveToFirestore('tech_hubs', updated);
  };

  // Testimonials Actions
  const addTestimonial = async (testimonial: Testimonial) => {
    const updated = [...testimonials, testimonial];
    setTestimonials(updated);
    return await saveToFirestore('testimonials', updated);
  };

  const updateTestimonial = async (testimonial: Testimonial) => {
    const updated = testimonials.map((t) => (t.id === testimonial.id ? testimonial : t));
    setTestimonials(updated);
    return await saveToFirestore('testimonials', updated);
  };

  const deleteTestimonial = async (id: string) => {
    const updated = testimonials.filter((t) => t.id !== id);
    setTestimonials(updated);
    return await saveToFirestore('testimonials', updated);
  };

  // AI Assistant CMS Actions
  const updateAiConfig = async (data: Partial<AIAssistantConfig>) => {
    const updated = { ...aiConfig, ...data, updatedAt: new Date().toISOString() };
    setAiConfig(updated);
    return await saveToFirestore('ai_config', updated);
  };

  const resetAiConfigToDefault = async () => {
    setAiConfig(DEFAULT_AI_CONFIG);
    return await saveToFirestore('ai_config', DEFAULT_AI_CONFIG);
  };

  // Factory Reset
  const resetAllToFactoryDefaults = async () => {
    setCompanyInfo(defaultCompanyInfo);
    setServices(defaultServices);
    setCaseStudies(defaultCaseStudies);
    setBlogPosts(defaultBlogPosts);
    setTechHubs(defaultTechHubs);
    setTestimonials(defaultTestimonials);
    setAiConfig(DEFAULT_AI_CONFIG);

    await Promise.all([
      saveToFirestore('company_info', defaultCompanyInfo),
      saveToFirestore('services', defaultServices),
      saveToFirestore('case_studies', defaultCaseStudies),
      saveToFirestore('blog_posts', defaultBlogPosts),
      saveToFirestore('tech_hubs', defaultTechHubs),
      saveToFirestore('testimonials', defaultTestimonials),
      saveToFirestore('ai_config', DEFAULT_AI_CONFIG),
    ]);
    return true;
  };

  return (
    <SiteDataContext.Provider
      value={{
        companyInfo,
        services,
        caseStudies,
        blogPosts,
        techHubs,
        testimonials,
        aiConfig,
        isLoading,
        isSaving,
        saveStatus,
        updateCompanyInfo,
        updateAiConfig,
        resetAiConfigToDefault,
        addService,
        updateService,
        deleteService,
        addCaseStudy,
        updateCaseStudy,
        deleteCaseStudy,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        addTechHub,
        updateTechHub,
        deleteTechHub,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        resetAllToFactoryDefaults,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }
  return context;
};
