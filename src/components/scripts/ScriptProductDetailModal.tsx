import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Code2, 
  Layers, 
  FileCode, 
  Cpu, 
  Zap, 
  Heart, 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  ExternalLink, 
  Lock, 
  CreditCard, 
  Phone, 
  FileText, 
  Sparkles, 
  ChevronRight, 
  MessageSquare, 
  AlertCircle,
  Copy,
  Check,
  Eye,
  Key,
  Globe,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ScriptProduct } from '../../data/scriptsData';
import { useCurrency } from '../../context/CurrencyContext';
import { useTranslation } from '../../context/LanguageContext';
import { useWishlist } from '../../context/WishlistContext';
import { 
  executeMomoPayment, 
  MomoProvider, 
  MOMO_PROVIDERS, 
  detectProviderFromPhone, 
  MomoTransactionResult 
} from '../../services/momoPaymentService';
import { 
  generateWatermarkedScriptZip, 
  triggerScriptDownload 
} from '../../utils/scriptWatermarkService';
import { 
  downloadScriptInvoicePDF, 
  ScriptInvoiceData 
} from '../../utils/scriptInvoiceGenerator';
import { trackGoogleAdsConversion } from '../../services/googleAdsService';


interface ScriptProductDetailModalProps {
  product: ScriptProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onInstantBuy: (product: ScriptProduct, paymentMethod: 'mtn_momo' | 'airtel_money' | 'stripe') => void;
}

export const ScriptProductDetailModal: React.FC<ScriptProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onInstantBuy
}) => {
  const { currency, currencyOption } = useCurrency();
  const { t } = useTranslation();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'docs' | 'reviews' | 'changelog'>('overview');
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState(0);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<MomoProvider>('mtn_momo');
  const [phoneNumber, setPhoneNumber] = useState('250788123456');
  const [customerName, setCustomerName] = useState('Alexandre Mugisha');
  const [customerEmail, setCustomerEmail] = useState('contact.vitechdev@gmail.com');
  const [userPinCode, setUserPinCode] = useState('');
  
  // Payment progress states
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'initiating' | 'ussd_push_sent' | 'pin_prompt' | 'confirming' | 'completed'>('idle');
  const [transactionResult, setTransactionResult] = useState<MomoTransactionResult | null>(null);
  const [generatedLicense, setGeneratedLicense] = useState('');
  const [copiedLicense, setCopiedLicense] = useState(false);
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // New review form
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewsList, setReviewsList] = useState(product?.reviews || []);

  React.useEffect(() => {
    if (product) {
      setReviewsList(product.reviews || []);
      setLikeCount(product.likes);
      setSelectedScreenshotIndex(0);
      setActiveTab('overview');
      setCheckoutModalOpen(false);
      setPaymentStep('idle');
      setTransactionResult(null);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = (network: 'whatsapp' | 'x' | 'linkedin' | 'facebook') => {
    const url = window.location.href;
    const text = `Découvrez ${product.title} sur Vitech Scripts !`;
    let shareUrl = '';
    if (network === 'whatsapp') shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
    else if (network === 'x') shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    else if (network === 'linkedin') shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    else if (network === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=500');
  };

  const handleStartCheckout = () => {
    setPaymentStep('idle');
    setCheckoutModalOpen(true);
  };

  const handlePhoneChange = (val: string) => {
    setPhoneNumber(val);
    if (!product.isFree) {
      const detected = detectProviderFromPhone(val);
      if (detected && paymentMethod !== 'stripe_card') {
        setPaymentMethod(detected);
      }
    }
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (product.isFree) {
      // Free download process
      handleFreeInstantDownload();
      return;
    }

    setIsProcessingPayment(true);
    setPaymentStep('initiating');

    try {
      const result = await executeMomoPayment({
        provider: paymentMethod,
        phoneNumber,
        customerName: customerName || 'Développeur Vitech',
        customerEmail: customerEmail || 'client@vitechafrica.com',
        product,
        currency: 'RWF',
        amountRWF: product.priceRWF,
        amountUSD: product.priceUSD
      }, (step) => {
        if (step === 'ussd_push_sent') setPaymentStep('ussd_push_sent');
        else if (step === 'pin_received') setPaymentStep('confirming');
        else if (step === 'completed') setPaymentStep('completed');
      });

      setTransactionResult(result);
      setGeneratedLicense(result.licenseKey);
      setIsProcessingPayment(false);
      setPaymentStep('completed');

      const mappedMethod = paymentMethod === 'stripe_card' ? 'stripe' : paymentMethod === 'airtel_money' ? 'airtel_money' : 'mtn_momo';
      onInstantBuy(product, mappedMethod);

      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 }
      });

      // Track Google Ads SEA Purchase Conversion
      trackGoogleAdsConversion('purchase', {
        value: product.priceUSD,
        currency: 'USD',
        transactionId: result.orderReference || `ORD-${Date.now()}`,
      });
    } catch (err) {

      console.error(err);
      setIsProcessingPayment(false);
      setPaymentStep('idle');
    }
  };

  const handleFreeInstantDownload = async () => {
    setIsGeneratingZip(true);
    const newLicense = `VITECH-FREE-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setGeneratedLicense(newLicense);
    
    try {
      const buyerId = `usr_${Math.random().toString(36).substring(2, 10)}`;
      const zipBlob = await generateWatermarkedScriptZip(product, {
        buyerId,
        buyerEmail: customerEmail || 'free.client@vitechafrica.com',
        buyerName: customerName || 'Utilisateur Communauté Vitech',
        licenseKey: newLicense,
        orderId: `FREE-${Date.now().toString(36).toUpperCase()}`,
        domain: '*'
      });

      triggerScriptDownload(zipBlob, `${product.slug || product.id}-v${product.version}-free.zip`);
      setPaymentStep('completed');
      
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsGeneratingZip(false);
    }
  };

  const handleDownloadWatermarkedZip = async () => {
    setIsGeneratingZip(true);
    try {
      const buyerId = `usr_rw_${Math.random().toString(36).substring(2, 10)}`;
      const zipBlob = await generateWatermarkedScriptZip(product, {
        buyerId,
        buyerEmail: customerEmail || 'contact.vitechdev@gmail.com',
        buyerName: customerName || 'Alexandre Mugisha',
        licenseKey: generatedLicense || `VITECH-${product.category.substring(0, 3).toUpperCase()}-99AA-88BB-22CC`,
        orderId: transactionResult?.orderReference || `ORD-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        domain: 'production'
      });

      triggerScriptDownload(
        zipBlob, 
        `${product.slug || product.id}-v${product.version}-licensed.zip`
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingZip(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (transactionResult) {
      downloadScriptInvoicePDF(transactionResult.invoiceData);
    } else {
      // Fallback sample invoice
      const invoiceData: ScriptInvoiceData = {
        invoiceNumber: `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        orderReference: `ORD-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        issueDate: new Date().toLocaleDateString('fr-FR'),
        clientName: customerName || 'Alexandre Mugisha',
        clientEmail: customerEmail || 'contact.vitechdev@gmail.com',
        clientPhone: phoneNumber,
        paymentMethod: paymentMethod === 'airtel_money' ? 'Airtel Money (Rwanda)' : paymentMethod === 'stripe_card' ? 'Carte Bancaire / Stripe' : 'MTN Mobile Money (Rwanda)',
        transactionRef: `TXN-RW-${Date.now().toString(36).toUpperCase()}`,
        product,
        licenseKey: generatedLicense || 'VITECH-PAY-98AA-77BC-44CD',
        licenseType: 'Commerciale Standard',
        amountUSD: product.priceUSD,
        amountRWF: product.priceRWF,
        selectedCurrency: 'RWF',
        taxRatePercent: 0
      };
      downloadScriptInvoicePDF(invoiceData);
    }
  };

  const handleCopyLicense = () => {
    navigator.clipboard.writeText(generatedLicense);
    setCopiedLicense(true);
    setTimeout(() => setCopiedLicense(false), 2000);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    const newRev = {
      id: `rev-${Date.now()}`,
      author: customerName || 'Développeur Vitech',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      rating: reviewRating,
      date: 'À l instant',
      comment: reviewComment,
      verifiedPurchase: true,
      likes: 0
    };
    setReviewsList([newRev, ...reviewsList]);
    setReviewComment('');
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative text-slate-100">
        
        {/* Top Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/50">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                {product.categoryLabel}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Score Sécurité {product.analysis.securityScore}/100
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-indigo-950 text-indigo-400 border border-indigo-500/30">
                Qualité {product.analysis.qualityScore}/100 ({product.analysis.owaspCompliance})
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {product.title}
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              {product.tagline}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with Tabs */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Main Showcase Hero & Action Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Gallery View (Left) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative group shadow-inner">
                <img
                  src={product.screenshots[selectedScreenshotIndex] || product.previewImage}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  {product.liveDemoUrl && (
                    <a
                      href={product.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md hover:bg-cyan-500 hover:text-slate-950 text-xs font-semibold text-white border border-slate-700 flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {product.screenshots.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.screenshots.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedScreenshotIndex(idx)}
                      className={`w-20 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        selectedScreenshotIndex === idx ? 'border-cyan-400 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={s} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price & Purchase Card (Right) */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Licence Standard Illimitée</span>
                  <div className="text-right">
                    {product.isFree ? (
                      <span className="text-2xl font-black text-emerald-400">GRATUIT (0 $)</span>
                    ) : (
                      <div>
                        <span className="text-2xl font-black text-white">${product.priceUSD} USD</span>
                        <span className="text-xs font-mono text-cyan-400 block">≈ {product.priceRWF.toLocaleString()} RWF (MTN/Airtel)</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Auteur :</span>
                    <span className="font-semibold text-white">{product.author.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Version Actuelle :</span>
                    <span className="font-mono text-cyan-400 font-bold">{product.analysis.version}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Mises à Jour :</span>
                    <span className="text-emerald-400 font-semibold">À Vie &amp; Gratuites</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Téléchargements :</span>
                    <span className="font-mono text-white">{product.downloadsCount} ventes</span>
                  </div>
                </div>

                {/* Social, Wishlist & Likes */}
                <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        isInWishlist(product.id)
                          ? 'bg-rose-950 border-rose-500 text-rose-400 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-rose-300'
                      }`}
                      title={isInWishlist(product.id) ? 'Retirer de la Wishlist' : 'Ajouter à ma Wishlist'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isInWishlist(product.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{isInWishlist(product.id) ? 'Dans la Wishlist' : 'Favoris'}</span>
                    </button>

                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        isLiked 
                          ? 'bg-cyan-950 border-cyan-500 text-cyan-400' 
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'text-cyan-400' : ''}`} />
                      <span>{likeCount}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-emerald-950 border border-slate-800 text-emerald-400 transition-colors text-xs"
                      title="Partager sur WhatsApp"
                    >
                      WA
                    </button>
                    <button
                      onClick={() => handleShare('x')}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors text-xs"
                      title="Partager sur X (Twitter)"
                    >
                      X
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-blue-950 border border-slate-800 text-blue-400 transition-colors text-xs"
                      title="Partager sur LinkedIn"
                    >
                      IN
                    </button>
                  </div>
                </div>
              </div>

              {/* Instant Buy Button */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleStartCheckout}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-500/20 active:scale-98 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{product.isFree ? 'Télécharger Gratuitement' : 'Acheter & Obtenir la Clé de Licence'}</span>
                </button>

                <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> MTN MoMo</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Airtel</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Facture PDF</span>
                </div>
              </div>

            </div>

          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-slate-800 flex items-center gap-2 sm:gap-6 overflow-x-auto pb-1 text-xs sm:text-sm font-semibold">
            {[
              { id: 'overview', label: 'Description & Fonctionnalités', icon: Layers },
              { id: 'analysis', label: 'Analyse Automatique du Code (IA)', icon: Cpu, badge: `${product.analysis.securityScore}/100` },
              { id: 'docs', label: 'Documentation & Installation', icon: FileCode },
              { id: 'reviews', label: `Avis & Commentaires (${reviewsList.length})`, icon: MessageSquare },
              { id: 'changelog', label: 'Historique des Versions', icon: Sparkles },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-3 px-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-cyan-400 text-cyan-400 font-bold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="pt-2">
            
            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6 text-xs sm:text-sm text-slate-300">
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-white">Présentation Détaillée</h3>
                  <div className="whitespace-pre-line leading-relaxed text-slate-300 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                    {product.fullDescription}
                  </div>
                </div>

                {/* Compatibility Tags */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Compatibilité &amp; Environnements</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.compatibility.map((c, i) => (
                      <span key={i} className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sample Code Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Aperçu du Code Source</h4>
                    <span className="text-[10px] font-mono text-cyan-400">{product.analysis.language}</span>
                  </div>
                  <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                    <code>{product.sampleCodeSnippet}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* Tab 2: Automated Script Analysis */}
            {activeTab === 'analysis' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-3">
                  <Cpu className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Rapport d'Analyse Automatique Vitech Inspector</h4>
                    <p className="text-xs text-slate-300">
                      Chaque script est scanné lors de l'upload pour vérifier l'intégrité du code source, la conformité aux normes OWASP Top 10 et l'absence de vulnérabilités.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[11px] text-slate-400 block font-mono">Langage Détecté</span>
                    <span className="text-base font-bold text-white">{product.analysis.language}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[11px] text-slate-400 block font-mono">Framework</span>
                    <span className="text-base font-bold text-cyan-400">{product.analysis.framework}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[11px] text-slate-400 block font-mono">Taille de l'Archive</span>
                    <span className="text-base font-bold text-white">{product.analysis.fileSize}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[11px] text-slate-400 block font-mono">Fichiers &amp; Lignes de Code</span>
                    <span className="text-base font-bold text-emerald-400">{product.analysis.filesCount} f. ({product.analysis.linesOfCode.toLocaleString()} LOC)</span>
                  </div>
                </div>

                {/* Score Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400 uppercase">Score Sécurité</span>
                      <span className="text-xs font-bold text-emerald-400">{product.analysis.owaspCompliance}</span>
                    </div>
                    <div className="text-3xl font-black text-white">{product.analysis.securityScore} <span className="text-sm text-slate-500">/ 100</span></div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-emerald-400 h-2 rounded-full" style={{ width: `${product.analysis.securityScore}%` }} />
                    </div>
                    <p className="text-[11px] text-slate-400">Zero SQL Injection, protection XSS native, CSRF guards validés.</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400 uppercase">Score Qualité Code</span>
                      <span className="text-xs font-bold text-cyan-400">PSR-12 / Clean Code</span>
                    </div>
                    <div className="text-3xl font-black text-white">{product.analysis.qualityScore} <span className="text-sm text-slate-500">/ 100</span></div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-cyan-400 h-2 rounded-full" style={{ width: `${product.analysis.qualityScore}%` }} />
                    </div>
                    <p className="text-[11px] text-slate-400">Architecture modulaire, classes documentées, typage strict.</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400 uppercase">Niveau de Complexité</span>
                      <span className="text-xs font-bold text-indigo-400">{product.analysis.difficulty}</span>
                    </div>
                    <div className="text-3xl font-black text-indigo-300">{product.analysis.difficulty}</div>
                    <p className="text-[11px] text-slate-400">Dépendances gérées : {product.analysis.dependenciesCount} packages analysés.</p>
                  </div>
                </div>

                {/* Dependencies List */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Dépendances Clés Détectées</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.analysis.dependenciesList.map((dep, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Documentation */}
            {activeTab === 'docs' && (
              <div className="space-y-6 text-xs sm:text-sm text-slate-300">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-cyan-400" />
                    <span>Démarrage Rapide (Quickstart)</span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-900 p-3 rounded-xl border border-slate-800">
                    {product.documentation.quickStart}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Étapes d'Installation</h4>
                  <div className="space-y-2">
                    {product.documentation.installationSteps.map((step, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {product.documentation.envVariables.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Variables d'Environnement (.env)</h4>
                    <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
                      <code>{product.documentation.envVariables.join('\n')}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Reviews & Comments */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                
                {/* Submit review */}
                <form onSubmit={handleAddReview} className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Laisser un Avis / Commentaire</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Note :</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star className={`w-4 h-4 ${star <= reviewRating ? 'fill-amber-400' : 'text-slate-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    required
                    placeholder="Partagez votre retour sur l'architecture, la facilité de déploiement et le support..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none h-20"
                  />

                  <div className="text-right">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer active:scale-95 transition-all"
                    >
                      Publier mon avis
                    </button>
                  </div>
                </form>

                {/* Reviews List */}
                <div className="space-y-3">
                  {reviewsList.map(rev => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={rev.avatar} alt={rev.author} className="w-7 h-7 rounded-full object-cover" />
                          <div>
                            <span className="text-xs font-bold text-white block leading-tight">{rev.author}</span>
                            <span className="text-[10px] text-slate-500">{rev.date}</span>
                          </div>
                          {rev.verifiedPurchase && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                              Achat Vérifié
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed pl-9">
                        {rev.comment}
                      </p>

                      {/* Developer replies */}
                      {rev.replies && rev.replies.map((reply, rIdx) => (
                        <div key={rIdx} className="ml-9 p-3 rounded-xl bg-slate-900 border border-cyan-500/20 space-y-1 mt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-cyan-400">{reply.author}</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 font-mono">{reply.role}</span>
                          </div>
                          <p className="text-[11px] text-slate-300">{reply.comment}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* Tab 5: Changelog */}
            {activeTab === 'changelog' && (
              <div className="space-y-4">
                {product.changelog.map((log, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-cyan-400">{log.version}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{log.date}</span>
                    </div>
                    <ul className="space-y-1 text-xs text-slate-300 pl-4 list-disc">
                      {log.changes.map((c, cIdx) => (
                        <li key={cIdx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Licence nominative • Injection auto Copyright © Vab &amp; Idriss</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              Fermer
            </button>
            <button
              onClick={handleStartCheckout}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{product.isFree ? 'Télécharger' : `Acheter ($${product.priceUSD})`}</span>
            </button>
          </div>
        </div>

      </div>

      {/* CHECKOUT & PAYMENT MODAL (MTN MoMo, Airtel Money, Stripe) */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-base text-white">
                  {product.isFree ? 'Téléchargement Gratuit' : 'Paiement Sécurisé MTN & Airtel Money'}
                </h3>
              </div>
              <button
                onClick={() => setCheckoutModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {paymentStep === 'completed' ? (
              <div className="text-center space-y-4 py-2">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Paiement &amp; Licence Validés !</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Votre archive ZIP avec <strong>filigrane cryptographique nominatif</strong> et votre <strong>facture officielle</strong> sont prêtes.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/40 text-left space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Clé de Licence Unique</span>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">Active • 100% Validée</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-xs font-mono font-bold text-emerald-300 truncate">{generatedLicense}</code>
                    <button
                      onClick={handleCopyLicense}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
                      title="Copier la clé"
                    >
                      {copiedLicense ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-left text-[11px] text-cyan-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Traçabilité &amp; Sécurité Incluses :</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    L'identifiant <code className="text-cyan-300 font-mono">{customerEmail}</code> est injecté dans le fichier non-obvie <code className="text-cyan-300 font-mono">.vitech-origin-meta.dat</code> pour certifier votre authenticité.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleDownloadWatermarkedZip}
                    disabled={isGeneratingZip}
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isGeneratingZip ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Génération du ZIP Chiffré...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Télécharger le ZIP Traçable (.zip)</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadInvoice}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer border border-emerald-500/30 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Télécharger Facture Officielle (PDF)</span>
                  </button>

                  <button
                    onClick={() => setCheckoutModalOpen(false)}
                    className="w-full py-2 rounded-xl bg-transparent hover:bg-slate-800 text-slate-400 text-xs font-semibold transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            ) : (paymentStep === 'ussd_push_sent' || paymentStep === 'confirming') ? (
              <div className="py-4 space-y-4 text-center">
                <div className="relative mx-auto w-16 h-16 rounded-2xl bg-slate-950 border-2 border-cyan-500/50 flex items-center justify-center shadow-lg animate-pulse">
                  <Phone className="w-8 h-8 text-cyan-400 animate-bounce" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Prompt USSD Push Envoyé !</h4>
                  <p className="text-xs text-slate-400">
                    Vérifiez votre mobile <strong className="text-white font-mono">{phoneNumber}</strong>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left font-mono text-[11px] text-slate-300 space-y-2">
                  <div className="flex items-center justify-between text-cyan-400 border-b border-slate-800 pb-1.5">
                    <span>{MOMO_PROVIDERS[paymentMethod]?.name || 'MTN Mobile Money'}</span>
                    <span>{MOMO_PROVIDERS[paymentMethod]?.ussdCode || '*182#'}</span>
                  </div>
                  <p className="text-slate-200">
                    Approuver le débit de <strong className="text-emerald-400">{product.priceRWF.toLocaleString()} RWF</strong> vers <strong>VITECH AFRICA LTD</strong> (Réf: VTPAY-{product.id.slice(0, 6).toUpperCase()}).
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] text-slate-500">Statut :</span>
                    <span className="text-amber-400 flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      Validation PIN sécurisée en cours...
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                  <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span>Attente de la réponse de la passerelle telco...</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmPayment} className="space-y-4 text-xs">
                
                {/* Method selector */}
                {!product.isFree && (
                  <div className="space-y-2">
                    <span className="font-semibold text-slate-300 block">Choisissez l'Opérateur de Paiement :</span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'mtn_momo', label: 'MTN MoMo', sub: 'Rwanda (*182#)', icon: Phone, color: 'text-amber-400' },
                        { id: 'airtel_money', label: 'Airtel Money', sub: 'Rwanda (*500#)', icon: Phone, color: 'text-rose-400' },
                        { id: 'stripe_card', label: 'Carte / Stripe', sub: 'International', icon: CreditCard, color: 'text-cyan-400' },
                      ].map(m => {
                        const Icon = m.icon;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setPaymentMethod(m.id as any)}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              paymentMethod === m.id
                                ? 'bg-cyan-950 border-cyan-400 text-white shadow-sm'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${m.color} mb-1`} />
                            <span className="font-bold block text-[11px]">{m.label}</span>
                            <span className="text-[9px] text-slate-500 font-mono">{m.sub}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Amount to pay */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Montant total du script :</span>
                  <div className="text-right font-bold text-white">
                    {product.isFree ? (
                      <span className="text-emerald-400">0 RWF (Gratuit)</span>
                    ) : paymentMethod === 'stripe_card' ? (
                      `$${product.priceUSD} USD`
                    ) : (
                      <div>
                        <span className="text-cyan-400 text-sm font-black">{product.priceRWF.toLocaleString()} RWF</span>
                        <span className="text-[10px] text-slate-500 block font-mono">(${product.priceUSD} USD)</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-medium">Nom du Développeur / Entreprise :</label>
                    <input
                      type="text"
                      required
                      placeholder="Alexandre Mugisha"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {(paymentMethod === 'mtn_momo' || paymentMethod === 'airtel_money') && !product.isFree && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-slate-400 font-medium">Numéro Mobile Money (MTN / Airtel) :</label>
                        <span className="text-[10px] font-mono text-cyan-400">
                          {paymentMethod === 'mtn_momo' ? 'MTN MoMo Détecté' : 'Airtel Money Détecté'}
                        </span>
                      </div>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="250788123456 ou 078..."
                          value={phoneNumber}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                        />
                      </div>
                      <span className="text-[10px] text-slate-500">Un prompt USSD push sera envoyé sur votre mobile pour validation PIN.</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-slate-400 font-medium">Email pour la Licence nominative &amp; Facture PDF :</label>
                    <input
                      type="email"
                      required
                      placeholder="contact.vitechdev@gmail.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50 active:scale-95 transition-all"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Initialisation Mobile Money en cours...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>{product.isFree ? 'Confirmer & Télécharger le ZIP' : `Payer ${product.priceRWF.toLocaleString()} RWF via MoMo`}</span>
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
