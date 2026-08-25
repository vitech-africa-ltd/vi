import React, { useState, useEffect, useMemo } from 'react';
import {
  DollarSign,
  Receipt,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Building2,
  Mail,
  Phone,
  Trash2,
  Edit3,
  Copy,
  ExternalLink,
  Send,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  Smartphone,
  Globe2,
  Calendar,
  X,
  Check,
  RotateCcw,
  BarChart3,
  Coins,
  ArrowRightLeft,
  Calculator
} from 'lucide-react';
import { Invoice, InvoiceLineItem, InvoiceStatus, InvoiceType } from '../../types';
import { downloadInvoicePdf } from '../../utils/pdfGenerator';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { MonthlyInvoicingRevenueChart } from '../scripts/admin/MonthlyInvoicingRevenueChart';
import { InvoiceEmailModal } from './InvoiceEmailModal';
import { sendAutomatedInvoiceEmail } from '../../services/emailNotificationService';
import { useCurrency, CurrencyCode, CURRENCIES_DATA } from '../../context/CurrencyContext';

const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-2026-001',
    invoiceNumber: 'FAC-2026-0089',
    type: 'invoice',
    clientName: 'Mamadou Diop',
    clientCompany: 'AfriPay Financial Services Ltd',
    clientEmail: 'm.diop@afripay.africa',
    clientAddress: 'Plateau, Immeuble CCIA, Abidjan, Côte d\'Ivoire',
    clientTaxId: 'CI-ABJ-03-2024-B14-99821',
    currency: 'EUR',
    currencySymbol: '€',
    issueDate: '01 Février 2026',
    dueDate: '28 Février 2026',
    status: 'paid',
    items: [
      { id: '1', description: 'Sprint 1 - Architecture Microservices & Passerelle mTLS', quantity: 1, unitPrice: 12500, total: 12500, category: 'development' },
      { id: '2', description: 'Sprint 2 - Intégration Endpoints Mobile Money (MTN, Orange, Wave)', quantity: 1, unitPrice: 14000, total: 14000, category: 'development' },
      { id: '3', description: 'Audit de Sécurité Préalable & Cession de Propriété Intellectuelle', quantity: 1, unitPrice: 4500, total: 4500, category: 'audit' }
    ],
    subtotal: 31000,
    taxRate: 0,
    taxAmount: 0,
    totalAmount: 31000,
    paidAmount: 31000,
    paymentMethod: 'bank_transfer',
    paymentReference: 'VIR-SEPA-BOKI-88291',
    paidAt: '12 Février 2026',
    notes: 'Règlement intégral reçu. PV contradictoire et certificat de recette signés avec succès.',
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-12T15:30:00Z'
  },
  {
    id: 'inv-2026-002',
    invoiceNumber: 'FAC-2026-0094',
    type: 'invoice',
    clientName: 'Mamadou Diop',
    clientCompany: 'AfriPay Financial Services Ltd',
    clientEmail: 'm.diop@afripay.africa',
    clientAddress: 'Plateau, Immeuble CCIA, Abidjan, Côte d\'Ivoire',
    currency: 'EUR',
    currencySymbol: '€',
    issueDate: '15 Février 2026',
    dueDate: '15 Mars 2026',
    status: 'pending',
    items: [
      { id: '1', description: 'Sprint 3 - Moteur de Cache Local SQLite & Synchronisation Hors-Ligne', quantity: 1, unitPrice: 9800, total: 9800, category: 'development' },
      { id: '2', description: 'Sprint 4 - Déploiement Cluster Kubernetes Multi-Région (Kigali / Francfort)', quantity: 1, unitPrice: 7700, total: 7700, category: 'cloud' }
    ],
    subtotal: 17500,
    taxRate: 0,
    taxAmount: 0,
    totalAmount: 17500,
    paymentMethod: 'bank_transfer',
    notes: 'Échéance à 30 jours net. Virement vers compte Bank of Kigali RW72 0001 2026 9981 2004 55.',
    createdAt: '2026-02-15T09:00:00Z',
    updatedAt: '2026-02-15T09:00:00Z'
  },
  {
    id: 'inv-2026-003',
    invoiceNumber: 'FAC-2026-0078',
    type: 'invoice',
    clientName: 'Oumar Sylla',
    clientCompany: 'Sahel Agritech Solutions',
    clientEmail: 'o.sylla@sahel-agri.sn',
    clientAddress: 'Almadies, Dakar, Sénégal',
    currency: 'XOF',
    currencySymbol: 'FCFA',
    issueDate: '10 Janvier 2026',
    dueDate: '25 Janvier 2026',
    status: 'overdue',
    items: [
      { id: '1', description: 'Plateforme IA de cartographie parcellaire & API Météo par satellite', quantity: 1, unitPrice: 15000000, total: 15000000, category: 'development' },
      { id: '2', description: 'Hébergement Cloud Souverain & Infogérance 1 an', quantity: 1, unitPrice: 3500000, total: 3500000, category: 'cloud' }
    ],
    subtotal: 18500000,
    taxRate: 18,
    taxAmount: 3330000,
    totalAmount: 21830000,
    paymentMethod: 'orange_money',
    notes: 'Relance effectuée le 10 Février. En attente de déblocage trésorerie.',
    createdAt: '2026-01-10T14:00:00Z',
    updatedAt: '2026-02-10T11:00:00Z'
  },
  {
    id: 'inv-2026-004',
    invoiceNumber: 'DEV-2026-0105',
    type: 'estimate',
    clientName: 'Koffi Mensah',
    clientCompany: 'Ecobank FinTech Lab',
    clientEmail: 'k.mensah@ecobank.com',
    currency: 'USD',
    currencySymbol: '$',
    issueDate: '20 Février 2026',
    dueDate: '20 Mars 2026',
    status: 'pending',
    items: [
      { id: '1', description: 'Cœur de Banque Digital & Moteur de Scoring Crédit par IA', quantity: 1, unitPrice: 48000, total: 48000, category: 'development' },
      { id: '2', description: 'Certification ISO/IEC 27001 & Conformité PCI-DSS v4', quantity: 1, unitPrice: 16000, total: 16000, category: 'audit' }
    ],
    subtotal: 64000,
    taxRate: 0,
    taxAmount: 0,
    totalAmount: 64000,
    notes: 'Devis estimatif valable 30 jours. Acompte de 40% au démarrage du projet.',
    createdAt: '2026-02-20T08:30:00Z',
    updatedAt: '2026-02-20T08:30:00Z'
  }
];

export const AdminInvoicingTab: React.FC = () => {
  const {
    currency,
    setCurrency,
    currencyOption,
    currenciesList,
    convertBetween,
    formatRawAmount,
    openConverterModal
  } = useCurrency();

  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currencyDisplayMode, setCurrencyDisplayMode] = useState<'active' | 'original'>('active');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [showChart, setShowChart] = useState<boolean>(true);
  const [autoEmailEnabled, setAutoEmailEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('vitech_auto_email_invoice_enabled');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });
  const [emailModalInvoice, setEmailModalInvoice] = useState<Invoice | null>(null);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);

  // Form State for creating / editing invoice
  const [formInvoiceNumber, setFormInvoiceNumber] = useState<string>('');
  const [formType, setFormType] = useState<InvoiceType>('invoice');
  const [formClientCompany, setFormClientCompany] = useState<string>('');
  const [formClientName, setFormClientName] = useState<string>('');
  const [formClientEmail, setFormClientEmail] = useState<string>('');
  const [formClientAddress, setFormClientAddress] = useState<string>('');
  const [formClientTaxId, setFormClientTaxId] = useState<string>('');
  const [formCurrency, setFormCurrency] = useState<string>('EUR');
  const [formCurrencySymbol, setFormCurrencySymbol] = useState<string>('€');
  const [formIssueDate, setFormIssueDate] = useState<string>('');
  const [formDueDate, setFormDueDate] = useState<string>('');
  const [formStatus, setFormStatus] = useState<InvoiceStatus>('pending');
  const [formPaymentMethod, setFormPaymentMethod] = useState<Invoice['paymentMethod']>('bank_transfer');
  const [formTaxRate, setFormTaxRate] = useState<number>(0);
  const [formNotes, setFormNotes] = useState<string>('');
  
  // Line items in form
  const [formItems, setFormItems] = useState<InvoiceLineItem[]>([
    { id: '1', description: 'Sprint de Développement & Architecture Cloud', quantity: 1, unitPrice: 5000, total: 5000, category: 'development' }
  ]);

  // Real-time Firestore synchronization if available
  useEffect(() => {
    try {
      const q = collection(db, 'invoices');
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const remoteDocs = snapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data()
            })) as Invoice[];
            setInvoices(remoteDocs);
          }
        },
        (error) => {
          console.warn('Firestore invoices fallback to local state:', error);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore not configured for invoices:', e);
    }
  }, []);

  const showNotification = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  // Open modal for new invoice
  const handleOpenNewModal = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    const in30Days = new Date(Date.now() + 30 * 86400000).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

    setEditingInvoice(null);
    setFormInvoiceNumber(`FAC-2026-0${randomNum}`);
    setFormType('invoice');
    setFormClientCompany('AfriPay Financial Services Ltd');
    setFormClientName('Mamadou Diop');
    setFormClientEmail('m.diop@afripay.africa');
    setFormClientAddress('Plateau, Abidjan, Côte d\'Ivoire');
    setFormClientTaxId('');
    setFormCurrency('EUR');
    setFormCurrencySymbol('€');
    setFormIssueDate(today);
    setFormDueDate(in30Days);
    setFormStatus('pending');
    setFormPaymentMethod('bank_transfer');
    setFormTaxRate(0);
    setFormNotes('Paiement à 30 jours. Virement bancaire Bank of Kigali ou Ecobank.');
    setFormItems([
      { id: '1', description: 'Sprint de Développement Frontend & Backend', quantity: 1, unitPrice: 8500, total: 8500, category: 'development' }
    ]);
    setShowModal(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (inv: Invoice) => {
    setEditingInvoice(inv);
    setFormInvoiceNumber(inv.invoiceNumber);
    setFormType(inv.type);
    setFormClientCompany(inv.clientCompany);
    setFormClientName(inv.clientName);
    setFormClientEmail(inv.clientEmail);
    setFormClientAddress(inv.clientAddress || '');
    setFormClientTaxId(inv.clientTaxId || '');
    setFormCurrency(inv.currency);
    setFormCurrencySymbol(inv.currencySymbol);
    setFormIssueDate(inv.issueDate);
    setFormDueDate(inv.dueDate);
    setFormStatus(inv.status);
    setFormPaymentMethod(inv.paymentMethod || 'bank_transfer');
    setFormTaxRate(inv.taxRate || 0);
    setFormNotes(inv.notes || '');
    setFormItems(inv.items.length > 0 ? inv.items : [{ id: '1', description: 'Prestation', quantity: 1, unitPrice: 1000, total: 1000 }]);
    setShowModal(true);
  };

  // Update item in form
  const handleItemChange = (index: number, field: keyof InvoiceLineItem, value: any) => {
    const updated = [...formItems];
    const item = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      const q = field === 'quantity' ? Number(value) : item.quantity;
      const p = field === 'unitPrice' ? Number(value) : item.unitPrice;
      item.total = (isNaN(q) ? 0 : q) * (isNaN(p) ? 0 : p);
    }
    updated[index] = item;
    setFormItems(updated);
  };

  const handleAddItem = () => {
    setFormItems(prev => [
      ...prev,
      { id: Date.now().toString(), description: 'Nouveau module / service', quantity: 1, unitPrice: 1000, total: 1000, category: 'development' }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (formItems.length === 1) return;
    setFormItems(prev => prev.filter((_, i) => i !== index));
  };

  // Currency select change
  const handleCurrencyChange = (curr: string) => {
    setFormCurrency(curr);
    if (curr === 'EUR') setFormCurrencySymbol('€');
    else if (curr === 'USD') setFormCurrencySymbol('$');
    else if (curr === 'XOF' || curr === 'XAF') setFormCurrencySymbol('FCFA');
    else if (curr === 'RWF') setFormCurrencySymbol('RWF');
    else setFormCurrencySymbol(curr);
  };

  // Calculate totals
  const formSubtotal = formItems.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const formTaxAmount = Math.round((formSubtotal * (formTaxRate || 0)) / 100);
  const formTotalAmount = formSubtotal + formTaxAmount;

  // Save invoice
  const handleSaveInvoice = async (e: React.FormEvent) => {
    e.preventDefault();

    const invoiceToSave: Invoice = {
      id: editingInvoice ? editingInvoice.id : `inv-${Date.now()}`,
      invoiceNumber: formInvoiceNumber,
      type: formType,
      clientCompany: formClientCompany,
      clientName: formClientName,
      clientEmail: formClientEmail,
      clientAddress: formClientAddress,
      clientTaxId: formClientTaxId,
      currency: formCurrency,
      currencySymbol: formCurrencySymbol,
      issueDate: formIssueDate,
      dueDate: formDueDate,
      status: formStatus,
      paymentMethod: formPaymentMethod,
      items: formItems,
      subtotal: formSubtotal,
      taxRate: formTaxRate,
      taxAmount: formTaxAmount,
      totalAmount: formTotalAmount,
      notes: formNotes,
      paidAmount: formStatus === 'paid' ? (editingInvoice?.paidAmount || formTotalAmount) : editingInvoice?.paidAmount,
      paidAt: formStatus === 'paid' ? (editingInvoice?.paidAt || new Date().toLocaleDateString('fr-FR')) : editingInvoice?.paidAt,
      createdAt: editingInvoice ? editingInvoice.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const prevStatus = editingInvoice ? editingInvoice.status : null;
      const statusChangedToNotifiable =
        (formStatus === 'paid' && prevStatus !== 'paid') ||
        (formStatus === 'pending' && prevStatus !== 'pending') ||
        (!editingInvoice && (formStatus === 'pending' || formStatus === 'paid'));

      // Save locally
      if (editingInvoice) {
        setInvoices(prev => prev.map(inv => inv.id === invoiceToSave.id ? invoiceToSave : inv));
      } else {
        setInvoices(prev => [invoiceToSave, ...prev]);
      }

      // Try Firestore
      try {
        await setDoc(doc(db, 'invoices', invoiceToSave.id), invoiceToSave);
      } catch (err) {
        console.warn('Saved in local state only:', err);
      }

      setShowModal(false);

      // Automated Email Notification dispatch
      if (autoEmailEnabled && statusChangedToNotifiable && invoiceToSave.clientEmail) {
        try {
          await sendAutomatedInvoiceEmail({
            invoice: invoiceToSave,
            newStatus: formStatus as 'paid' | 'pending',
            previousStatus: prevStatus || undefined,
            actorName: 'Administrateur V&I Tech'
          });
          showNotification(
            `Facture ${invoiceToSave.invoiceNumber} enregistrée. ✉️ Notification e-mail envoyée à ${invoiceToSave.clientEmail} (${formStatus === 'paid' ? 'Acquittée' : 'En attente'}).`
          );
        } catch (err) {
          showNotification(`Facture ${invoiceToSave.invoiceNumber} enregistrée avec succès.`);
        }
      } else {
        showNotification(`Facture ${invoiceToSave.invoiceNumber} enregistrée avec succès.`);
      }
    } catch (error) {
      console.error(error);
      alert('Erreur lors de l\'enregistrement de la facture.');
    }
  };

  // Toggle status to paid
  const handleMarkAsPaid = async (inv: Invoice) => {
    const updated: Invoice = {
      ...inv,
      status: 'paid',
      paidAmount: inv.totalAmount,
      paidAt: new Date().toLocaleDateString('fr-FR'),
      updatedAt: new Date().toISOString()
    };

    setInvoices(prev => prev.map(i => i.id === inv.id ? updated : i));

    try {
      await updateDoc(doc(db, 'invoices', inv.id), {
        status: 'paid',
        paidAmount: inv.totalAmount,
        paidAt: updated.paidAt,
        updatedAt: updated.updatedAt
      });
    } catch (e) {
      // Local fallback
    }

    if (autoEmailEnabled && inv.clientEmail) {
      try {
        await sendAutomatedInvoiceEmail({
          invoice: updated,
          newStatus: 'paid',
          previousStatus: inv.status,
          actorName: 'Administrateur V&I Tech'
        });
        showNotification(
          `Facture ${inv.invoiceNumber} marquée comme PAYÉE. ✉️ Quittance e-mail envoyée à ${inv.clientEmail} !`
        );
      } catch (err) {
        showNotification(`Facture ${inv.invoiceNumber} marquée comme PAYÉE.`);
      }
    } else {
      showNotification(`Facture ${inv.invoiceNumber} marquée comme PAYÉE.`);
    }
  };

  // Quick change status (e.g. pending, paid, overdue, draft)
  const handleQuickStatusChange = async (inv: Invoice, newStatus: InvoiceStatus) => {
    if (inv.status === newStatus) return;
    const isPaid = newStatus === 'paid';
    const updated: Invoice = {
      ...inv,
      status: newStatus,
      paidAmount: isPaid ? inv.totalAmount : inv.paidAmount,
      paidAt: isPaid ? (inv.paidAt || new Date().toLocaleDateString('fr-FR')) : inv.paidAt,
      updatedAt: new Date().toISOString()
    };

    setInvoices(prev => prev.map(i => i.id === inv.id ? updated : i));

    try {
      await updateDoc(doc(db, 'invoices', inv.id), {
        status: newStatus,
        paidAmount: updated.paidAmount,
        paidAt: updated.paidAt,
        updatedAt: updated.updatedAt
      });
    } catch (e) {
      // Local fallback
    }

    if (autoEmailEnabled && (newStatus === 'paid' || newStatus === 'pending') && inv.clientEmail) {
      try {
        await sendAutomatedInvoiceEmail({
          invoice: updated,
          newStatus: newStatus as 'paid' | 'pending',
          previousStatus: inv.status,
          actorName: 'Administrateur V&I Tech'
        });
        showNotification(
          `Statut #${inv.invoiceNumber} passé à '${newStatus === 'paid' ? 'Payée' : 'En attente'}'. ✉️ Notification e-mail envoyée automatiquement à ${inv.clientEmail} !`
        );
      } catch (err) {
        showNotification(`Statut de ${inv.invoiceNumber} mis à jour : ${newStatus}.`);
      }
    } else {
      showNotification(`Statut de ${inv.invoiceNumber} mis à jour : ${newStatus}.`);
    }
  };

  // Delete invoice
  const handleDeleteInvoice = async (id: string, number: string) => {
    if (window.confirm(`Voulez-vous vraiment supprimer la facture ${number} ?`)) {
      setInvoices(prev => prev.filter(i => i.id !== id));
      try {
        await deleteDoc(doc(db, 'invoices', id));
      } catch (e) {
        // Local fallback
      }
      showNotification(`Facture ${number} supprimée.`);
    }
  };

  // Filtered invoices
  const safeInvoices = Array.isArray(invoices) ? invoices : [];

  const filteredInvoices = safeInvoices.filter(inv => {
    if (!inv) return false;
    const matchesSearch =
      (inv.invoiceNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.clientCompany || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.clientName || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    const matchesType = typeFilter === 'all' || inv.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Dynamic Currency Calculations for Invoices
  const totalPaidInActiveCurrency = useMemo(() => {
    return safeInvoices
      .filter(i => i && i.status === 'paid')
      .reduce((acc, i) => acc + convertBetween(i.totalAmount || 0, (i.currency || 'EUR') as CurrencyCode, currency), 0);
  }, [safeInvoices, currency, convertBetween]);

  const totalPendingInActiveCurrency = useMemo(() => {
    return safeInvoices
      .filter(i => i && i.status === 'pending')
      .reduce((acc, i) => acc + convertBetween(i.totalAmount || 0, (i.currency || 'EUR') as CurrencyCode, currency), 0);
  }, [safeInvoices, currency, convertBetween]);

  const totalInvoicedInActiveCurrency = useMemo(() => {
    return safeInvoices
      .filter(i => i && i.type === 'invoice')
      .reduce((acc, i) => acc + convertBetween(i.totalAmount || 0, (i.currency || 'EUR') as CurrencyCode, currency), 0);
  }, [safeInvoices, currency, convertBetween]);

  const overdueCount = safeInvoices.filter(i => i && i.status === 'overdue').length;

  return (
    <div className="space-y-6">
      {/* SUCCESS NOTIFICATION TOAST */}
      {actionSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg(null)} className="text-emerald-400 hover:text-emerald-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TOP HEADER & STATS BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-400 border border-amber-500/30">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">
                Facturier &amp; Gestion Financière Pro
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold uppercase">
                Conforme OHADA 2026
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Émission de factures, devis, acomptes, calcul de TVA et conversion en temps réel ({currencyOption.name}).
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Auto-Email Toggle Button */}
          <button
            onClick={() => {
              const next = !autoEmailEnabled;
              setAutoEmailEnabled(next);
              try {
                localStorage.setItem('vitech_auto_email_invoice_enabled', String(next));
              } catch (e) {}
              showNotification(
                next
                  ? '✉️ Envoi automatique d\'e-mails activé (Payé & En attente).'
                  : '⚠️ Envoi automatique d\'e-mails désactivé.'
              );
            }}
            className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              autoEmailEnabled
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
            }`}
            title="Activer ou désactiver l'envoi automatique d'e-mails au client lors du passage en Payé ou En attente"
          >
            <Mail className={`w-4 h-4 ${autoEmailEnabled ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>Notification Client : {autoEmailEnabled ? 'Auto E-mail ON' : 'Auto E-mail OFF'}</span>
          </button>

          <button
            onClick={() => setShowChart(!showChart)}
            className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              showChart
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
            }`}
            title="Afficher/Masquer les graphiques d'analyse financière"
          >
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>{showChart ? 'Masquer Graphiques' : 'Graphiques & Tendances'}</span>
          </button>

          <button
            onClick={handleOpenNewModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black transition shadow-lg shadow-amber-950 flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Facture / Devis</span>
          </button>
        </div>
      </div>

      {/* DYNAMIC CURRENCY BAR & REAL-TIME EXCHANGE RATE STRIP */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
            <Coins className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white">Devise d'Affichage Dynamique :</span>
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(['XOF', 'EUR', 'USD', 'RWF', 'XAF', 'MAD'] as CurrencyCode[]).map((currCode) => {
              const opt = CURRENCIES_DATA[currCode];
              const isSelected = currency === currCode;
              return (
                <button
                  key={currCode}
                  onClick={() => setCurrency(currCode)}
                  className={`px-2.5 py-1 rounded-lg transition-all font-mono text-[11px] font-bold cursor-pointer flex items-center gap-1 ${
                    isSelected ? 'bg-amber-500 text-slate-950 shadow font-black' : 'text-slate-400 hover:text-white'
                  }`}
                  title={`${opt.name} (${opt.symbol})`}
                >
                  <span>{opt.flag}</span>
                  <span>{currCode}</span>
                </button>
              );
            })}
            <button
              onClick={() => openConverterModal(1000)}
              className="px-2 py-1 text-slate-400 hover:text-amber-400 transition"
              title="Calculateur de change"
            >
              <Calculator className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-300 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
            <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
            <span>1 € = <strong className="text-white">{currencyOption.rateToEUR}</strong> {currencyOption.symbol}</span>
          </div>

          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setCurrencyDisplayMode('active')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                currencyDisplayMode === 'active' ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-400'
              }`}
            >
              Converti ({currency})
            </button>
            <button
              onClick={() => setCurrencyDisplayMode('original')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                currencyDisplayMode === 'original' ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-400'
              }`}
            >
              Devise d'origine
            </button>
          </div>
        </div>
      </div>

      {/* RECHARTS DATA VISUALIZATION WIDGET */}
      {showChart && (
        <MonthlyInvoicingRevenueChart />
      )}

      {/* FINANCIAL KPI SUMMARY CARDS (CONVERTED LIVE) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Encaissé */}
        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/90 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Règlements Encaissés</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {formatRawAmount(totalPaidInActiveCurrency, currency)}
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Encaissé dans {invoices.filter(i => i.status === 'paid').length} règlements</span>
          </div>
        </div>

        {/* Card 2: En Attente */}
        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/90 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>En Attente de Règlement</span>
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-cyan-300 font-mono">
            {formatRawAmount(totalPendingInActiveCurrency, currency)}
          </div>
          <div className="text-[11px] text-slate-400">
            {invoices.filter(i => i.status === 'pending').length} factures sous échéance 30 jours
          </div>
        </div>

        {/* Card 3: Factures en Retard */}
        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/90 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Factures en Retard</span>
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-rose-400">
            {overdueCount} Facture{overdueCount > 1 ? 's' : ''}
          </div>
          <div className="text-[11px] text-rose-300 font-semibold">
            {overdueCount > 0 ? 'Relance automatique requise' : 'Aucun impayé bloquant'}
          </div>
        </div>

        {/* Card 4: Volume Total Facturé */}
        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/90 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Factures Émises</span>
            <span className="p-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {formatRawAmount(totalInvoicedInActiveCurrency, currency)}
          </div>
          <div className="text-[11px] text-slate-400">
            {invoices.length} Pièces au total (Factures, Devis, Acomptes)
          </div>
        </div>
      </div>


      {/* FILTER & SEARCH BAR */}
      <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par N°, client, société..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs outline-none cursor-pointer"
          >
            <option value="all">Tous les statuts</option>
            <option value="paid">Payée</option>
            <option value="pending">En attente</option>
            <option value="overdue">En retard</option>
            <option value="draft">Brouillon</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs outline-none cursor-pointer"
          >
            <option value="all">Tous les types</option>
            <option value="invoice">Facture</option>
            <option value="estimate">Devis</option>
            <option value="deposit">Acompte</option>
          </select>
        </div>
      </div>

      {/* INVOICES TABLE */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Réf &amp; Type</th>
                <th className="p-4">Client &amp; Société</th>
                <th className="p-4">Date &amp; Échéance</th>
                <th className="p-4">Montant TTC</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/40 transition">
                  {/* Ref & Type */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-amber-400 shrink-0">
                        <Receipt className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white">{inv.invoiceNumber}</div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          {inv.type === 'invoice' ? 'Facture' : inv.type === 'estimate' ? 'Devis' : 'Acompte'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Client */}
                  <td className="p-4">
                    <div className="font-bold text-slate-200">{inv.clientCompany}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <span>{inv.clientName}</span>
                      <span>•</span>
                      <span>{inv.clientEmail}</span>
                    </div>
                  </td>

                  {/* Dates */}
                  <td className="p-4">
                    <div className="text-slate-300 font-medium">{inv.issueDate}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Échéance : <span className={inv.status === 'overdue' ? 'text-rose-400 font-bold' : ''}>{inv.dueDate}</span>
                    </div>
                  </td>

                  {/* Amount with Dynamic Real-Time Currency Conversion */}
                  <td className="p-4">
                    {currencyDisplayMode === 'active' ? (
                      <div>
                        <div className="text-sm font-black text-amber-300 font-mono">
                          {formatRawAmount(
                            convertBetween(inv.totalAmount, (inv.currency || 'EUR') as CurrencyCode, currency),
                            currency
                          )}
                        </div>
                        {inv.currency !== currency && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            Origine : {inv.totalAmount.toLocaleString('fr-FR')} {inv.currencySymbol}
                          </div>
                        )}
                        {inv.taxAmount > 0 && (
                          <div className="text-[10px] text-slate-500">
                            dont TVA {inv.taxRate}%
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm font-black text-white font-mono">
                          {inv.totalAmount.toLocaleString('fr-FR')} {inv.currencySymbol}
                        </div>
                        {inv.currency !== currency && (
                          <div className="text-[10px] text-amber-400/80 font-mono">
                            ≈ {formatRawAmount(
                              convertBetween(inv.totalAmount, (inv.currency || 'EUR') as CurrencyCode, currency),
                              currency
                            )}
                          </div>
                        )}
                        {inv.taxAmount > 0 && (
                          <div className="text-[10px] text-slate-400">
                            dont TVA {inv.taxRate}% : {inv.taxAmount.toLocaleString('fr-FR')} {inv.currencySymbol}
                          </div>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Status with Quick Change Selector */}
                  <td className="p-4">
                    <div className="relative inline-block">
                      <select
                        value={inv.status}
                        onChange={(e) => handleQuickStatusChange(inv, e.target.value as InvoiceStatus)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border outline-none cursor-pointer appearance-none pr-6 ${
                          inv.status === 'paid'
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/90'
                            : inv.status === 'pending'
                            ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40 hover:bg-cyan-900/90'
                            : inv.status === 'overdue'
                            ? 'bg-rose-950/80 text-rose-300 border-rose-500/40 hover:bg-rose-900/90'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                        title="Changer le statut (déclenche un e-mail automatique pour 'Payée' ou 'En attente')"
                      >
                        <option value="draft">Brouillon</option>
                        <option value="pending">⏳ En attente</option>
                        <option value="paid">✓ Payée</option>
                        <option value="overdue">⚠️ En retard</option>
                        <option value="cancelled">Annulée</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-slate-400">
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Email Dispatch / Preview Center */}
                      <button
                        onClick={() => {
                          setEmailModalInvoice(inv);
                          setShowEmailModal(true);
                        }}
                        className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 transition cursor-pointer"
                        title="Aperçu & Envoi d'E-mail au Client"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </button>

                      {/* Download PDF */}
                      <button
                        onClick={() => downloadInvoicePdf(inv)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition cursor-pointer"
                        title="Télécharger Facture PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      {/* Mark Paid Quick Button */}
                      {inv.status !== 'paid' && (
                        <button
                          onClick={() => handleMarkAsPaid(inv)}
                          className="p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400 border border-emerald-500/30 transition cursor-pointer"
                          title="Marquer comme Payée & Notifier par E-mail"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Edit */}
                      <button
                        onClick={() => handleOpenEditModal(inv)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                        title="Modifier"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteInvoice(inv.id, inv.invoiceNumber)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 border border-slate-700 transition cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 text-xs">
                    Aucune facture ne correspond à votre recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT INVOICE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingInvoice ? `Modifier la Pièce ${formInvoiceNumber}` : 'Créer une Nouvelle Facture / Devis'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Saisie conforme aux normes comptables OHADA, BCEAO et internationales.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveInvoice} className="space-y-4">
              {/* Row 1: Number, Type, Currency */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Numéro de Pièce *
                  </label>
                  <input
                    type="text"
                    required
                    value={formInvoiceNumber}
                    onChange={(e) => setFormInvoiceNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs font-mono focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Type de Pièce
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs outline-none"
                  >
                    <option value="invoice">Facture Définitive</option>
                    <option value="estimate">Devis Estimatif</option>
                    <option value="deposit">Facture d'Acompte</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Devise
                  </label>
                  <select
                    value={formCurrency}
                    onChange={(e) => handleCurrencyChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs outline-none"
                  >
                    <option value="EUR">Euro (€)</option>
                    <option value="USD">Dollar US ($)</option>
                    <option value="XOF">Franc CFA UEMOA (FCFA)</option>
                    <option value="XAF">Franc CFA CEMAC (FCFA)</option>
                    <option value="RWF">Franc Rwandais (RWF)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Client Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Société / Organisation Client *
                  </label>
                  <input
                    type="text"
                    required
                    value={formClientCompany}
                    onChange={(e) => setFormClientCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Nom du Contact Client *
                  </label>
                  <input
                    type="text"
                    required
                    value={formClientName}
                    onChange={(e) => setFormClientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Email & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Email Client
                  </label>
                  <input
                    type="email"
                    required
                    value={formClientEmail}
                    onChange={(e) => setFormClientEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Adresse / Pays
                  </label>
                  <input
                    type="text"
                    value={formClientAddress}
                    onChange={(e) => setFormClientAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Row 4: Dates & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Date d'Émission
                  </label>
                  <input
                    type="text"
                    value={formIssueDate}
                    onChange={(e) => setFormIssueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Date d'Échéance
                  </label>
                  <input
                    type="text"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Statut Initial
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs outline-none"
                  >
                    <option value="pending">En attente de paiement</option>
                    <option value="paid">Payée</option>
                    <option value="overdue">En retard</option>
                    <option value="draft">Brouillon</option>
                  </select>
                </div>
              </div>

              {/* LINE ITEMS SECTION */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Lignes de Prestations &amp; Livrables
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter une ligne</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {formItems.map((item, idx) => (
                    <div key={item.id || idx} className="grid grid-cols-12 gap-2 items-center p-2.5 rounded-xl bg-slate-950/90 border border-slate-800">
                      <div className="col-span-6">
                        <input
                          type="text"
                          required
                          placeholder="Description de la prestation..."
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="Qté"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs text-center focus:ring-1 focus:ring-amber-500 outline-none"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          min="0"
                          placeholder="Prix Unit."
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs text-right focus:ring-1 focus:ring-amber-500 outline-none"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          disabled={formItems.length === 1}
                          className="p-1 rounded-md text-slate-500 hover:text-rose-400 disabled:opacity-30 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TOTALS & TAX */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-bold">Taux de TVA :</span>
                  <select
                    value={formTaxRate}
                    onChange={(e) => setFormTaxRate(Number(e.target.value))}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs outline-none"
                  >
                    <option value={0}>0% (Exportation / Franchise)</option>
                    <option value={18}>18% (UEMOA standard)</option>
                    <option value={20}>20% (France / Europe)</option>
                  </select>
                </div>

                <div className="text-right space-y-0.5">
                  <div className="text-xs text-slate-400">
                    Sous-Total HT : <strong className="text-slate-200">{formSubtotal.toLocaleString('fr-FR')} {formCurrencySymbol}</strong>
                  </div>
                  {formTaxAmount > 0 && (
                    <div className="text-xs text-slate-400">
                      TVA ({formTaxRate}%) : <strong className="text-slate-200">{formTaxAmount.toLocaleString('fr-FR')} {formCurrencySymbol}</strong>
                    </div>
                  )}
                  <div className="text-sm font-black text-amber-400">
                    TOTAL TTC : {formTotalAmount.toLocaleString('fr-FR')} {formCurrencySymbol}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Conditions Particulières &amp; Coordonnées
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black transition shadow-lg cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Enregistrer la Facture</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* INVOICE EMAIL NOTIFICATION MODAL */}
      <InvoiceEmailModal
        invoice={emailModalInvoice}
        isOpen={showEmailModal}
        onClose={() => {
          setShowEmailModal(false);
          setEmailModalInvoice(null);
        }}
        onEmailSent={(log) => {
          showNotification(`E-mail envoyé avec succès à ${log.recipientEmail} (${log.trackingCode})`);
        }}
      />
    </div>
  );
};
