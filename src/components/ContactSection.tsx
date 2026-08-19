import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle, 
  Save, 
  MessageCircle, 
  Paperclip, 
  ShieldCheck,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { useSiteData } from '../context/SiteDataContext';
import { useTranslation } from '../context/LanguageContext';
import { ContactFormData } from '../types';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

interface ContactSectionProps {
  initialData?: Partial<ContactFormData>;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ initialData }) => {
  const LOCAL_STORAGE_KEY = 'vitech_contact_draft_v1';
  const { user } = useAuth();
  const { companyInfo, services } = useSiteData();
  const { t } = useTranslation();

  const [formData, setFormData] = useState<ContactFormData>({
    fullName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    company: '',
    country: 'Sénégal',
    serviceNeeded: 'web-saas',
    budgetRange: '5k-15k',
    timeline: '1-3 mois',
    projectDescription: '',
    ndaRequired: true,
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastAutoSaved, setLastAutoSaved] = useState<string | null>(null);

  // Sync auth user details if available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.displayName || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  // Load drafts if available
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    } else {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setFormData((prev) => ({ ...prev, ...parsed }));
          setLastAutoSaved('Restauré depuis le brouillon local');
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      setLastAutoSaved(new Date().toLocaleTimeString());
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        ...formData,
        userId: user?.uid || null,
        userEmail: user?.email || formData.email,
        createdAt: new Date().toISOString(),
        status: 'new',
        source: 'contact_section_form',
      };

      if (db) {
        await addDoc(collection(db, 'inquiries'), payload);
        if (user) {
          const clientRef = doc(db, 'clients', user.uid);
          await setDoc(clientRef, {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
            country: formData.country,
            updatedAt: new Date().toISOString(),
          }, { merge: true });
        }
      }

      setIsSuccess(true);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
      });
    } catch (err: any) {
      console.error('Submission error:', err);
      handleFirestoreError(err, OperationType.CREATE, 'inquiries');
      setErrorMessage("Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer ou contacter directement via WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            <span>{t('contact.badge', 'Initier une Collaboration • Réponse sous 2h')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            {t('contact.title', 'Parlons de Votre Prochain')}{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Projet Digital
            </span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            {t('contact.subtitle', 'Notre équipe d’ingénieurs et chefs de projet est à votre disposition pour vous accompagner dans vos projets de transformation digitale.')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Contacts */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-6">
              <h3 className="text-xl font-bold text-white">Coordonnées Officielles</h3>
              
              <div className="space-y-4 text-xs sm:text-sm">
                <a 
                  href={`mailto:${companyInfo.email}`} 
                  className="flex items-start space-x-3 text-slate-300 hover:text-emerald-400 transition-colors group p-3 rounded-xl bg-slate-900/60 border border-slate-800"
                >
                  <Mail className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Email Officiel</span>
                    <span className="font-mono text-emerald-400">{companyInfo.email}</span>
                  </div>
                </a>

                <a 
                  href={`tel:${companyInfo.phone}`} 
                  className="flex items-start space-x-3 text-slate-300 hover:text-cyan-400 transition-colors group p-3 rounded-xl bg-slate-900/60 border border-slate-800"
                >
                  <Phone className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Ligne Téléphonique</span>
                    <span className="font-mono text-slate-300">{companyInfo.phone}</span>
                  </div>
                </a>

                <a
                  href={companyInfo.director?.whatsappUrl || `https://wa.me/${companyInfo.whatsapp?.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start space-x-3 text-slate-300 hover:text-emerald-400 transition-colors group p-3 rounded-xl bg-slate-900/60 border border-slate-800"
                >
                  <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">WhatsApp Direct</span>
                    <span className="font-mono text-emerald-400">{companyInfo.whatsapp}</span>
                  </div>
                </a>

                <div className="flex items-start space-x-3 text-slate-300 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Siège &amp; Présence</span>
                    <span className="text-slate-400">{companyInfo.headquarters} • {companyInfo.address}</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Instant Chat */}
              <div className="pt-2">
                <a
                  href={companyInfo.director?.whatsappUrl || `https://wa.me/${companyInfo.whatsapp?.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Discuter en direct sur WhatsApp</span>
                </a>
              </div>
            </div>

            {/* SLA & Security Commitment */}
            <div className="p-6 rounded-3xl bg-slate-950/60 border border-slate-800/80 space-y-3 text-xs">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Nos Engagements de Confidentialité</span>
              </div>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Signature systématique d'un accord NDA avant audit.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Chiffrement Cloud AES-256 de tous les documents transmis.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Propriété intellectuelle intégrale transférée au client.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-8">
            <div className="p-6 sm:p-10 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl relative">
              
              <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6 text-xs">
                <div className="flex items-center space-x-2 text-slate-300">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-white">Formulaire de Cadrage de Projet</span>
                </div>
                {lastAutoSaved && (
                  <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400 font-mono bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    <Save className="w-3 h-3" />
                    <span>Sauvegarde : {lastAutoSaved}</span>
                  </div>
                )}
              </div>

              {isSuccess ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Demande Enregistrée avec Succès !</h3>
                  <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                    Merci <span className="text-white font-bold">{formData.fullName}</span>. Votre brief technique a été transmis. Notre équipe étudie votre dossier et vous contactera sous 2 heures ouvrées.
                  </p>
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setFormData({
                        fullName: user?.displayName || '',
                        email: user?.email || '',
                        phone: '',
                        company: '',
                        country: 'Sénégal',
                        serviceNeeded: 'web-saas',
                        budgetRange: '5k-15k',
                        timeline: '1-3 mois',
                        projectDescription: '',
                        ndaRequired: true,
                      });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    Soumettre un autre projet
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm">
                  
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Identity Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                        Votre Nom &amp; Prénom <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Ex: Jean Dupont"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                        Email Professionnel <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="jean.dupont@entreprise.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Company & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                        Entreprise / Organisation
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Ex: AfriTech Corp"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                        Téléphone / WhatsApp <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+221 77 000 0000"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                        Pays du Projet
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      >
                        <option value="Sénégal">🇸🇳 Sénégal</option>
                        <option value="Côte d'Ivoire">🇨🇮 Côte d'Ivoire</option>
                        <option value="Rwanda">🇷🇼 Rwanda</option>
                        <option value="RDC">🇨🇩 RDC</option>
                        <option value="Cameroun">🇨🇲 Cameroun</option>
                        <option value="Bénin">🇧🇯 Bénin</option>
                        <option value="Togo">🇹🇬 Togo</option>
                        <option value="France">🇫🇷 France / Europe</option>
                        <option value="Autre">🌍 Autre</option>
                      </select>
                    </div>
                  </div>

                  {/* Service Needed Selection */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                      Pôle Technologique Demandé
                    </label>
                    <select
                      name="serviceNeeded"
                      value={formData.serviceNeeded}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title} ({s.startingPrice})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Project Description */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                      Description du Projet &amp; Enjeux Techniques <span className="text-emerald-400">*</span>
                    </label>
                    <textarea
                      name="projectDescription"
                      required
                      rows={4}
                      value={formData.projectDescription}
                      onChange={handleChange}
                      placeholder="Décrivez vos besoins : objectifs métiers, fonctionnalités attendues, charge utilisateur estimée, contraintes techniques..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                    />
                  </div>

                  {/* NDA Checkbox */}
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <input
                      type="checkbox"
                      id="ndaRequired"
                      name="ndaRequired"
                      checked={formData.ndaRequired}
                      onChange={handleChange}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-950 border-slate-700"
                    />
                    <label htmlFor="ndaRequired" className="text-xs text-slate-300 cursor-pointer">
                      Je souhaite recevoir et signer un accord de confidentialité (NDA) avant tout partage de code ou de données confidentielles.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Transmission sécurisée en cours...</span>
                      </div>
                    ) : (
                      <>
                        <span>Transmettre mon Dossier de Projet</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
