import React, { useState } from 'react';
import { 
  Download, 
  Key, 
  FileText, 
  Heart, 
  Bell, 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  Layers, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Globe,
  Trash2,
  Lock,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_SCRIPTS, ScriptProduct } from '../../data/scriptsData';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

interface ScriptsMemberSpaceProps {
  onBackToMarketplace: () => void;
  onSelectProduct: (product: ScriptProduct) => void;
}

export const ScriptsMemberSpace: React.FC<ScriptsMemberSpaceProps> = ({
  onBackToMarketplace,
  onSelectProduct
}) => {
  const { user } = useAuth();
  const { wishlistProducts, wishlistCount, removeFromWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState<'downloads' | 'licenses' | 'orders' | 'wishlist' | 'notifications'>('downloads');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [selectedDownloadItem, setSelectedDownloadItem] = useState<any | null>(null);

  // Mock User Licenses & Purchased Items
  const [licenses, setLicenses] = useState([
    {
      id: 'lic-1',
      productId: 'vitech-pay-gateway',
      productTitle: 'VitechPay - Pan-African Mobile Money Suite',
      licenseKey: 'VITECH-PAY-94FA-88DC-4311-90AA',
      domain: 'ecommerce-kigali.rw',
      version: 'v3.2.0',
      purchaseDate: '2026-06-18',
      downloadsUsed: 2,
      downloadsMax: 10,
      status: 'Active'
    },
    {
      id: 'lic-2',
      productId: 'proclean-admin-bootstrap-kit',
      productTitle: 'ProClean UI - Kit Admin Pro Max Bootstrap 5',
      licenseKey: 'VITECH-UI-FREE-8899-2211-0000',
      domain: 'saas-portal.com',
      version: 'v2.4.0',
      purchaseDate: '2026-06-20',
      downloadsUsed: 1,
      downloadsMax: 99,
      status: 'Active'
    }
  ]);

  const [orders, setOrders] = useState([
    {
      id: 'ORD-2026-8841',
      date: '2026-06-18',
      item: 'VitechPay - Pan-African Mobile Money Suite',
      amountUSD: 49,
      amountRWF: 65000,
      paymentMethod: 'MTN Mobile Money (Rwanda)',
      status: 'Complété',
      invoiceUrl: '#'
    },
    {
      id: 'ORD-2026-8802',
      date: '2026-06-20',
      item: 'ProClean UI - Kit Admin Pro Max Bootstrap 5',
      amountUSD: 0,
      amountRWF: 0,
      paymentMethod: 'Gratuit',
      status: 'Complété',
      invoiceUrl: '#'
    }
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Mise à jour VitechPay v3.2.0 disponible',
      body: 'Ajout de la compatibilité avec MTN MoMo Open API v2.1 et optimisation des webhooks.',
      date: 'Il y a 2 jours',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Bienvenue sur Vitech Scripts !',
      body: 'Votre compte membre bénéficie d un accès prioritaire aux nouveaux scripts et starter kits.',
      date: 'Il y a 5 jours',
      read: true
    }
  ]);

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleStartDownload = (lic: any) => {
    setSelectedDownloadItem(lic);
    setDownloadModalOpen(true);
  };

  const handleExecuteDownload = () => {
    if (!selectedDownloadItem) return;

    // Simulate Protected Download Gateway + Automated Copyright injection
    const archiveContent = 
`================================================================================
VITECH SCRIPTS PROTECTED ARCHIVE - COPYRIGHT & LICENSE WATERMARK
================================================================================
Product: ${selectedDownloadItem.productTitle}
License Key: ${selectedDownloadItem.licenseKey}
Assigned Domain: ${selectedDownloadItem.domain || 'Unrestricted'}
Purchaser: client.member@vitechafrica.com
Generated at: ${new Date().toISOString()}

--- AUTOMATED COPYRIGHT INJECTION APPLIED TO ALL HTML/PHP/CSS FILES ---
<footer style="text-align:center; padding:20px; font-family:sans-serif;">
  Copyright © Vab & Idriss (Vitech Africa)
</footer>
================================================================================

[Source Code Files Extracted Cleanly]
- /src/Controllers/
- /src/Models/
- /public/index.php
- /config/database.php
- /sql/schema.sql
`;

    const blob = new Blob([archiveContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vitech_${selectedDownloadItem.productId}_${selectedDownloadItem.version}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Update download count
    setLicenses(prev => prev.map(l => l.id === selectedDownloadItem.id ? { ...l, downloadsUsed: l.downloadsUsed + 1 } : l));
    setDownloadModalOpen(false);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <button
              onClick={onBackToMarketplace}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono mb-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour à la Marketplace</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              <Lock className="w-7 h-7 text-cyan-400" />
              <span>Espace Membre Vitech Scripts</span>
            </h1>
            <p className="text-xs text-slate-400">
              Gérez vos licences actives, téléchargez vos archives sécurisées et suivez vos factures.
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <img
              src={user?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border border-cyan-500/40"
            />
            <div>
              <span className="text-xs font-bold text-white block truncate max-w-[160px]">
                {user?.displayName || user?.email?.split('@')[0] || 'Membre Vitech'}
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">
                {user ? 'Membre Connecté • Firebase' : 'Mode Invité'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick KPI Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-mono">Scripts Achetés</span>
            <span className="text-2xl font-black text-white block">{licenses.length}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-mono">Licences Actives</span>
            <span className="text-2xl font-black text-emerald-400 block">{licenses.filter(l => l.status === 'Active').length}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-mono">Wishlist / Favoris</span>
            <span className="text-2xl font-black text-rose-400 block">{wishlistCount}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-mono">Téléchargements</span>
            <span className="text-2xl font-black text-cyan-400 block">
              {licenses.reduce((acc, l) => acc + l.downloadsUsed, 0)}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-mono">Notifications</span>
            <span className="text-2xl font-black text-amber-400 block">{notifications.filter(n => !n.read).length} non lues</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-800 flex items-center gap-2 sm:gap-6 overflow-x-auto pb-1 text-xs sm:text-sm font-semibold">
          {[
            { id: 'downloads', label: 'Mes Téléchargements & Archives', icon: Download, count: licenses.length },
            { id: 'licenses', label: 'Gestion des Licences & Domaines', icon: Key, count: licenses.length },
            { id: 'wishlist', label: 'Ma Wishlist / Favoris', icon: Heart, count: wishlistCount },
            { id: 'orders', label: 'Factures & Commandes', icon: FileText, count: orders.length },
            { id: 'notifications', label: 'Centre de Notifications', icon: Bell, count: notifications.filter(n => !n.read).length }
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
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-800 text-slate-300">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: DOWNLOADS */}
        {activeTab === 'downloads' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Passerelle de téléchargement protégée • Injection automatique de la mention de droit d'auteur : <strong>Copyright © Vab &amp; Idriss</strong>
              </span>
            </div>

            <div className="space-y-3">
              {licenses.map(lic => (
                <div key={lic.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400">{lic.version}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Acheté le {lic.purchaseDate}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                        {lic.status}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">{lic.productTitle}</h3>
                    <div className="text-xs text-slate-400 font-mono">
                      Quota : {lic.downloadsUsed} / {lic.downloadsMax} téléchargements utilisés
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <button
                      onClick={() => handleStartDownload(lic)}
                      className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      <span>Télécharger (.ZIP)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: LICENSES & DOMAINS */}
        {activeTab === 'licenses' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {licenses.map(lic => (
                <div key={lic.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white">{lic.productTitle}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                      {lic.status}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Clé de Licence</span>
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-xs font-mono font-bold text-cyan-400 truncate">{lic.licenseKey}</code>
                      <button
                        onClick={() => handleCopyKey(lic.licenseKey)}
                        className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                      >
                        {copiedKey === lic.licenseKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="text-slate-400 block font-medium">Domaine de Production Associé :</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        defaultValue={lic.domain}
                        placeholder="ex: app.monsite.rw"
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                      />
                      <button className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold whitespace-nowrap">
                        Lier
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: WISHLIST & FAVORITES */}
        {activeTab === 'wishlist' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                Vos scripts favoris sauvegardés et synchronisés en direct via Firestore.
              </span>
              <span className="font-mono text-rose-400 font-bold">
                {wishlistCount} script{wishlistCount > 1 ? 's' : ''} en favoris
              </span>
            </div>

            {wishlistProducts.length === 0 ? (
              <div className="p-12 text-center space-y-4 rounded-3xl bg-slate-900/40 border border-slate-800">
                <div className="w-16 h-16 rounded-full bg-rose-950/40 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">Votre liste de favoris est vide</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Explorez les codes sources, passerelles Mobile Money et starters kits de la marketplace et cliquez sur l'icône cœur pour les sauvegarder.
                  </p>
                </div>
                <button
                  onClick={onBackToMarketplace}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 cursor-pointer shadow"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Explorer le Catalogue Marketplace</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlistProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950">
                        <img
                          src={p.previewImage}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeFromWishlist(p.id)}
                          className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-slate-950/80 hover:bg-rose-950 text-rose-400 hover:text-rose-300 border border-slate-800 transition-colors cursor-pointer"
                          title="Retirer des favoris"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                          {p.analysis.language} • {p.analysis.framework}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-mono text-[11px]">{p.categoryLabel}</span>
                          <span className="font-bold text-white">
                            {p.isFree ? 'GRATUIT' : `$${p.priceUSD} USD`}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-white line-clamp-1">{p.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2">{p.tagline}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => {
                          onSelectProduct(p);
                        }}
                        className="flex-1 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Voir la Fiche</span>
                      </button>
                      <button
                        onClick={() => removeFromWishlist(p.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Retirer des favoris"
                      >
                        <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ORDERS & INVOICES */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400 bg-slate-950/60">
                  <tr>
                    <th className="p-4">Réf. Commande</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Script / Produit</th>
                    <th className="p-4">Mode de Paiement</th>
                    <th className="p-4">Montant</th>
                    <th className="p-4">Statut</th>
                    <th className="p-4 text-right">Facture PDF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-white">{o.id}</td>
                      <td className="p-4 text-slate-400">{o.date}</td>
                      <td className="p-4 font-semibold text-white">{o.item}</td>
                      <td className="p-4">{o.paymentMethod}</td>
                      <td className="p-4 font-mono font-bold text-emerald-400">
                        {o.amountUSD === 0 ? 'Gratuit' : `$${o.amountUSD} USD (${o.amountRWF.toLocaleString()} RWF)`}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                          {o.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            const pdfBlob = new Blob([
                              `=== FACTURE OFFICIELLE VITECH AFRICA LTD ===\n` +
                              `Facture #: ${o.id}\n` +
                              `Date: ${o.date}\n` +
                              `Client: Alexandre Mugisha\n` +
                              `Article: ${o.item}\n` +
                              `Montant: $${o.amountUSD} USD / ${o.amountRWF} RWF\n` +
                              `TVA (18%): Incluse\n` +
                              `Statut: PAYÉ INTÉGRALEMENT\n` +
                              `TIN Rwanda: 108934821\n` +
                              `============================================`
                            ], { type: 'text/plain' });
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(pdfBlob);
                            link.download = `Facture_${o.id}.pdf`;
                            link.click();
                          }}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="space-y-3">
            {notifications.map(notif => (
              <div key={notif.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>{notif.title}</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">{notif.date}</span>
                </div>
                <p className="text-xs text-slate-300">{notif.body}</p>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* DOWNLOAD CONFIRMATION MODAL */}
      {downloadModalOpen && selectedDownloadItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-cyan-400" />
                <span>Passerelle de Téléchargement</span>
              </h3>
              <button onClick={() => setDownloadModalOpen(false)} className="text-slate-400 hover:text-white">
                &times;
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <p>Vous êtes sur le point de télécharger :</p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-bold text-white">
                {selectedDownloadItem.productTitle} ({selectedDownloadItem.version})
              </div>
              
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-[11px] text-cyan-300 space-y-1">
                <span className="font-bold block">Watermark &amp; Protection :</span>
                <p>La mention officielle de droit d'auteur <strong>Copyright © Vab &amp; Idriss (Vitech Africa)</strong> sera injectée dans le pied de page de tous les fichiers de template.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDownloadModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                Annuler
              </button>
              <button
                onClick={handleExecuteDownload}
                className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow"
              >
                <Download className="w-4 h-4" />
                <span>Confirmer &amp; Télécharger</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
