import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  ShieldCheck, 
  Coins, 
  Code2, 
  Clock, 
  Lock, 
  MessageSquare, 
  Sparkles,
  Phone,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

interface FaqItem {
  id: string;
  category: 'all' | 'dev' | 'pricing' | 'method' | 'ip' | 'sla';
  categoryLabel: string;
  question: string;
  answer: string;
  tags?: string[];
}

export const FaqSection: React.FC<{ onOpenChat?: () => void; onOpenEstimator?: () => void }> = ({
  onOpenChat,
  onOpenEstimator,
}) => {
  const { t } = useTranslation();
  const { currencyOption, openConverterModal } = useCurrency();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'faq-1': true,
    'faq-2': false,
  });

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const faqData: FaqItem[] = [
    {
      id: 'faq-1',
      category: 'ip',
      categoryLabel: 'Propriété Intellectuelle & Code',
      question: 'Qui est propriétaire du code source et de la propriété intellectuelle développés ?',
      answer: 'Vous êtes le propriétaire exclusif à 100% de l’ensemble du code source, des designs UI/UX, des schémas d’architecture et des bases de données dès validation du projet. Nos contrats de développement prévoient une cession totale et sans réserve des droits d’auteur et de propriété intellectuelle. Le code vous est livré sur vos dépôts privés (GitHub / GitLab) avec documentation complète.',
      tags: ['Propriété 100%', 'GitHub', 'Cession de droits', 'Licence exclusive'],
    },
    {
      id: 'faq-2',
      category: 'pricing',
      categoryLabel: 'Facturation & Devises',
      question: 'Quelles sont les modalités de paiement et les devises acceptées ?',
      answer: `Nos devis et factures peuvent être émis dans votre devise locale : Franc CFA (XOF / XAF), Euro (€), Dollar US ($), Franc Rwandais (RWF), Franc Guinéen (GNF) ou Dirham Marocain (MAD). Le paiement est échelonné par Sprints livrés : un acompte initial de cadrage (30% à 40%), puis des versements intermédiaires conditionnés à la validation de chaque jalon technique (Démos en direct), et le solde à la mise en production. Nous acceptons les virements bancaires internationaux, virements SEPA et passerelles Mobile Money sécurisées.`,
      tags: ['XOF / XAF', 'EUR / USD', 'Paiement par Sprints', 'Mobile Money & Virement'],
    },
    {
      id: 'faq-3',
      category: 'dev',
      categoryLabel: 'Technologies & Stacks',
      question: 'Quelles technologies et frameworks utilisez-vous pour les projets web et mobiles ?',
      answer: 'Nous utilisons les technologies de pointe de l’industrie pour garantir la scalabilité et la performance : React 19, Next.js 15, TypeScript, Node.js / NestJS, Python (FastAPI / Django pour l’IA), Flutter & React Native pour le mobile avec mode Offline-First, PostgreSQL, Redis et architectures conteneurisées Kubernetes / Docker sous AWS, Google Cloud ou infrastructures locales souveraines.',
      tags: ['Next.js', 'React', 'Flutter', 'TypeScript', 'PostgreSQL', 'Docker'],
    },
    {
      id: 'faq-4',
      category: 'method',
      categoryLabel: 'Méthodologie & Délais',
      question: 'Comment se déroule le suivi de projet et quel est le délai moyen de livraison ?',
      answer: 'Nous travaillons selon la méthodologie Agile Scrum avec des sprints de 2 semaines. Vous disposez d’un accès 24/7 à votre Espace Client dédié avec suivi en temps réel des tâches, prévisualisations en staging et réunions de démo bi-hebdomadaires. Un MVP (Produit Minimum Viable) est généralement déployé en 4 à 8 semaines, tandis que les plateformes SaaS complexes s’étalent sur 8 à 14 semaines.',
      tags: ['Agile Scrum', 'Sprints 2 semaines', 'Démo Staging', '4 à 8 semaines MVP'],
    },
    {
      id: 'faq-5',
      category: 'sla',
      categoryLabel: 'Support & Garantie',
      question: 'Quelle garantie et quel accompagnement proposez-vous après la mise en production ?',
      answer: 'Tous nos projets incluent contractuellement une garantie corrective intégrale de 3 à 6 mois après livraison. Au-delà, nos contrats de Tierce Maintenance Applicative (TMA) et nos SLAs (jusqu’à 99.99% Uptime) assurent la surveillance continue de vos serveurs, l’application des correctifs de sécurité OWASP, les sauvegardes journalières automatisées et une astreinte d’ingénieurs 24h/24 et 7j/7.',
      tags: ['Garantie 6 mois', 'SLA 99.99%', 'TMA Proactive', 'Astreinte 24/7'],
    },
    {
      id: 'faq-6',
      category: 'dev',
      categoryLabel: 'Paiements Panafricains',
      question: 'Pouvez-vous intégrer les moyens de paiement locaux (Wave, Orange Money, MTN, Moov) ?',
      answer: 'Absolument. Vitech Africa dispose d’une expertise approfondie dans l’intégration des passerelles de paiement panafricaines (Wave, Orange Money, MTN Mobile Money, Moov Money, Airtel Money, PayDunya, Bizao, Paystack, Flutterwave) ainsi que les cartes Visa/Mastercard et Stripe pour les paiements internationaux.',
      tags: ['Wave', 'Orange Money', 'MTN Mobile', 'Paystack', 'Stripe'],
    },
    {
      id: 'faq-7',
      category: 'ip',
      categoryLabel: 'Sécurité & Confidentialité',
      question: 'Comment garantissez-vous la confidentialité de nos données et de nos idées de projet ?',
      answer: 'Avant toute discussion technique ou transmission de cahier des charges, nous signons un Accord de Non-Divulgation (NDA) juridiquement contraignant. Toutes nos architectures respectent les normes de chiffrement AES-256 au repos et TLS 1.3 en transit, avec conformité aux réglementations de protection des données personnelles (RGPD et lois nationales africaines sur la protection des données).',
      tags: ['NDA signé', 'AES-256', 'Conformité RGPD', 'Données souveraines'],
    },
    {
      id: 'faq-8',
      category: 'pricing',
      categoryLabel: 'Cadrage & Devis',
      question: 'Combien coûte un devis ou un premier cadrage technique ?',
      answer: 'Le premier cadrage technique et l’établissement de votre devis détaillé sont 100% gratuits et sans engagement. Vous pouvez simuler votre budget immédiatement avec notre simulateur de devis en ligne ou réserver un appel stratégique de 30 minutes avec l’un de nos architectes logiciels.',
      tags: ['100% Gratuit', 'Sans engagement', 'Appel 30 min', 'Simulateur en direct'],
    },
  ];

  const categories = [
    { id: 'all', label: 'Toutes les Questions' },
    { id: 'dev', label: 'Technologies & Mobile' },
    { id: 'pricing', label: 'Tarifs & Devises' },
    { id: 'method', label: 'Méthodologie & Délais' },
    { id: 'ip', label: 'Propriété & Sécurité' },
    { id: 'sla', label: 'Garantie & SLA' },
  ];

  const filteredFaqs = faqData.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="faq" className="py-20 bg-slate-50 text-slate-900 relative border-t border-slate-200">
      
      {/* Decorative Blur Backdrops */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-cyan-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('faq.badge', 'Foire Aux Questions')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            {t('faq.title', 'Tout Ce Que Vous Devez Savoir')}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {t('faq.subtitle', 'Transparence contractuelle, propriété du code, devises de facturation et méthodologie Agile : retrouvez les réponses détaillées à vos questions.')}
          </p>

          {/* Interactive Search Bar */}
          <div className="pt-4 max-w-md mx-auto relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une question (ex: code source, paiements, délais, SLA)..."
                className="w-full bg-white border border-slate-300 hover:border-slate-400 focus:border-blue-600 rounded-full py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-xs focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  Effacer
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#1a44c2] text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = !!openItems[faq.id];
              return (
                <div
                  key={faq.id}
                  className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                    isOpen 
                      ? 'border-blue-600 shadow-md ring-1 ring-blue-600/10' 
                      : 'border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block">
                        {faq.categoryLabel}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        {faq.question}
                      </h3>
                    </div>

                    <div className={`p-2 rounded-xl shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-blue-50 text-[#1a44c2] rotate-180' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in slide-in-from-top-1">
                      <p className="pt-2">{faq.answer}</p>
                      
                      {faq.tags && faq.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-3 mt-3 border-t border-slate-100">
                          {faq.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                            >
                              ✓ {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
              <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700">Aucune question ne correspond à votre recherche "{searchQuery}"</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>

        {/* Bottom Fast Help Card */}
        <div className="mt-12 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold">
              <Sparkles className="w-3 h-3" />
              <span>Assistance Directe</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-black text-white">
              Vous avez une question spécifique sur votre projet ?
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Nos ingénieurs d'affaires et lead developers vous répondent en moins de 15 minutes sur WhatsApp ou par Live Chat.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              onClick={onOpenChat}
              className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ouvrir le Live Chat</span>
            </button>

            <button
              onClick={onOpenEstimator}
              className="px-5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
            >
              <span>Simuler un Devis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
