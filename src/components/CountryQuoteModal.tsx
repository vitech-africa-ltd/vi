import React, { useRef, useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Coins, 
  CreditCard,
  Send,
  Sparkles,
  Globe,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';
import { useCountry } from '../context/CountryContext';
import { useCurrency } from '../context/CurrencyContext';
import { generateQuotePDF } from '../utils/pdfGenerator';

interface CountryQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  estimatorState: {
    serviceName: string;
    platforms: string[];
    features: string[];
    slaOption: string;
    totalEUR: number;
    timelineWeeks: number;
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
    clientCompany?: string;
  };
  onTransferToContact?: () => void;
}

export const CountryQuoteModal: React.FC<CountryQuoteModalProps> = ({
  isOpen,
  onClose,
  estimatorState,
  onTransferToContact,
}) => {
  const { currentCountry, getCountryQuoteDetails } = useCountry();
  const { formatRawAmount } = useCurrency();
  const printRef = useRef<HTMLDivElement>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const quote = getCountryQuoteDetails(estimatorState.totalEUR);
  const quoteRefNumber = `VIT-${currentCountry.code}-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
  const issueDate = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    try {
      setIsDownloadingPdf(true);
      generateQuotePDF({
        quoteRefNumber,
        issueDate,
        validUntil,
        clientName: estimatorState.clientName,
        clientCompany: estimatorState.clientCompany,
        clientEmail: estimatorState.clientEmail,
        clientPhone: estimatorState.clientPhone,
        country: currentCountry,
        serviceName: estimatorState.serviceName,
        platforms: estimatorState.platforms,
        features: estimatorState.features,
        slaOption: estimatorState.slaOption,
        timelineWeeks: estimatorState.timelineWeeks,
        totalEUR: estimatorState.totalEUR,
        formattedLocalPrice: quote.formattedLocal,
        formattedEURPrice: quote.formattedEUR,
        formattedUSDPrice: quote.formattedUSD,
      });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-4xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Control Bar (Hidden on Print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xl leading-none">{currentCountry.flag}</span>
            <div>
              <h3 className="font-bold text-sm">
                Devis Officiel Personnalisé — {currentCountry.name}
              </h3>
              <p className="text-[11px] text-slate-400">
                Hub Référent : {currentCountry.localHub}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleDownloadPDF}
              disabled={isDownloadingPdf}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                downloadSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>PDF Téléchargé !</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>{isDownloadingPdf ? 'Génération PDF...' : 'Télécharger Devis PDF'}</span>
                </>
              )}
            </motion.button>
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Imprimer"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div ref={printRef} className="p-6 sm:p-10 space-y-6 text-slate-800 bg-white">
          
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-black text-xl tracking-tighter shadow-md">
                  V&amp;I
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight text-slate-950">
                    V&amp;I TECH AFRICA LTD
                  </h1>
                  <p className="text-xs font-semibold text-blue-700">
                    Pôle d'Ingénierie Logicielle Panafricain &amp; International
                  </p>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-500 space-y-0.5">
                <p><strong>Hub de Rattachement :</strong> {currentCountry.localHub} ({currentCountry.hubCity})</p>
                <p><strong>Juridiction :</strong> {currentCountry.ndaJurisdiction}</p>
                <p><strong>Email Officiel :</strong> direction@vitech-africa.com | <strong>Web :</strong> www.vitech-africa.com</p>
              </div>
            </div>

            {/* Quote Metadata Badge */}
            <div className="sm:text-right bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1 w-full sm:w-auto">
              <div className="font-mono text-blue-700 font-extrabold text-sm">
                {quoteRefNumber}
              </div>
              <p className="text-slate-600"><strong>Date d'émission :</strong> {issueDate}</p>
              <p className="text-slate-600"><strong>Validité :</strong> 30 jours (jusqu'au {validUntil})</p>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] mt-1">
                <Sparkles className="w-3 h-3" /> Devis Spécifique {currentCountry.name} {currentCountry.flag}
              </div>
            </div>
          </div>

          {/* Client & Country Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs">
            <div>
              <h4 className="font-bold text-blue-900 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-700" />
                <span>Bénéficiaire / Destinataire :</span>
              </h4>
              <p className="font-bold text-slate-900 text-sm">
                {estimatorState.clientCompany || estimatorState.clientName || 'Client Entreprise / Organisation'}
              </p>
              {estimatorState.clientName && <p className="text-slate-600">{estimatorState.clientName}</p>}
              {estimatorState.clientEmail && <p className="text-slate-600">{estimatorState.clientEmail}</p>}
              {estimatorState.clientPhone && <p className="text-slate-600">{estimatorState.clientPhone}</p>}
            </div>

            <div>
              <h4 className="font-bold text-blue-900 mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-700" />
                <span>Territoire &amp; Monnaie Applicable :</span>
              </h4>
              <p className="font-bold text-slate-900">
                {currentCountry.name} ({currentCountry.region})
              </p>
              <p className="text-slate-600">
                <strong>Devise contractuelle :</strong> {currentCountry.currency} ({currentCountry.currencySymbol})
              </p>
              <p className="text-slate-600">
                <strong>Régime fiscal :</strong> {currentCountry.taxInfo}
              </p>
            </div>
          </div>

          {/* Technical Scope Breakdown Table */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Détail des Prestations &amp; Architecture Logicielle</span>
            </h4>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/90 text-slate-700 border-b border-slate-200">
                    <th className="p-3 font-bold">Composant &amp; Livrable</th>
                    <th className="p-3 font-bold">Spécifications Incluses</th>
                    <th className="p-3 font-bold text-right">Délai Estimé</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-bold text-slate-900">
                      Domaine Principal : {estimatorState.serviceName}
                    </td>
                    <td className="p-3 text-slate-600">
                      Conception UX/UI, Architecture Cloud résiliente, Tests automatisés &amp; Code source complet.
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-800">
                      {estimatorState.timelineWeeks} sem.
                    </td>
                  </tr>

                  {estimatorState.platforms.length > 0 && (
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Plateformes Cibles</td>
                      <td className="p-3 text-slate-600">
                        {estimatorState.platforms.join(', ')}
                      </td>
                      <td className="p-3 text-right text-slate-500">Inclus</td>
                    </tr>
                  )}

                  {estimatorState.features.length > 0 && (
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Modules &amp; Intégrations</td>
                      <td className="p-3 text-slate-600">
                        {estimatorState.features.join(' • ')}
                      </td>
                      <td className="p-3 text-right text-slate-500">Inclus</td>
                    </tr>
                  )}

                  <tr>
                    <td className="p-3 font-bold text-slate-900">SLA &amp; Support Post-Lancement</td>
                    <td className="p-3 text-slate-600">
                      Garantie contractuelle de bon fonctionnement, monitoring proactif et transferts de compétences.
                    </td>
                    <td className="p-3 text-right text-emerald-700 font-bold">Garanti</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Box tailored to the Country */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div>
              <div className="text-xs text-blue-200 uppercase font-extrabold tracking-wider mb-1">
                Investissement Global Estimé ({currentCountry.name})
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
                {quote.formattedLocal}
              </div>
              <div className="text-xs text-blue-300 mt-1 flex items-center gap-2">
                <span>Équivalent international : {quote.formattedEUR} / {quote.formattedUSD}</span>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-blue-700/60 sm:pl-6 space-y-1">
              <div className="text-xs text-blue-200 font-bold">Délai Global de Livraison</div>
              <div className="text-xl font-bold font-mono text-cyan-300">
                {estimatorState.timelineWeeks} Semaines
              </div>
              <div className="text-[10px] text-blue-200">
                Sprints Agile de 2 semaines
              </div>
            </div>
          </div>

          {/* Country-specific payment gateways & Legal Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-blue-700" />
                <span>Modalités de Règlement dans votre Pays :</span>
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {currentCountry.paymentMethods.map((pm, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-semibold text-[11px]">
                    {pm}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 pt-1">
                Échelonnement standard : 40% au démarrage • 30% à mi-parcours • 30% à la livraison finale et recette.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Garanties &amp; Propriété Intellectuelle :</span>
              </h5>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Cession intégrale et exclusive du code source, des droits de propriété intellectuelle et des accès administrateurs dès le règlement complet. Accord de confidentialité (NDA) inclus.
              </p>
            </div>
          </div>

          {/* Signatures & Approval */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
            <div className="space-y-1">
              <p className="font-bold text-slate-900">Pour V&amp;I TECH AFRICA LTD</p>
              <p className="text-slate-500">Direction Générale &amp; Lead Architect</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 font-mono text-[10px] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Cachet Électronique &amp; Signature Certifiée
              </div>
            </div>

            <div className="sm:text-right space-y-1">
              <p className="font-bold text-slate-900">Pour le Client (Bon pour accord)</p>
              <p className="text-slate-500">Signature &amp; Cachet de l'entreprise</p>
              <div className="w-48 h-12 border-b border-dashed border-slate-300 mt-2"></div>
            </div>
          </div>

        </div>

        {/* Modal Bottom Actions (Hidden on Print) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Devis conforme aux barèmes d'ingénierie {currentCountry.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDownloadPDF}
              disabled={isDownloadingPdf}
              className={`px-4 py-2.5 rounded-xl text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                downloadSuccess ? 'bg-emerald-600' : 'bg-slate-900 hover:bg-slate-800'
              }`}
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Devis PDF Téléchargé !</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>{isDownloadingPdf ? 'Génération PDF...' : 'Télécharger Devis PDF'}</span>
                </>
              )}
            </motion.button>

            {onTransferToContact && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onClose();
                  onTransferToContact();
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Transmettre ce Devis à la Direction</span>
              </motion.button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
