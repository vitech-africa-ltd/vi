import { 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ClientNotification, NotificationType } from '../types';

const NOTIFICATIONS_STORAGE_KEY = 'vitech_client_notifications_v1';
const FIRESTORE_COLLECTION = 'client_notifications';

export const INITIAL_NOTIFICATIONS: ClientNotification[] = [
  {
    id: 'notif-01',
    projectId: 'proj-afripay-001',
    title: 'Audit de Sécurité OWASP Terminé',
    message: 'Le rapport d’audit de sécurité (Pentest Niveau 1) a été certifié sans vulnérabilité critique et ajouté au coffre-fort.',
    type: 'audit_completed',
    timestamp: 'Il y a 10 minutes',
    timestampUtc: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    read: false,
    docId: 'doc-pentest-01',
    docRef: 'VIT-SEC-2026-044',
    actorName: 'Dr. Ousmane Kane (Auditeur Lead)'
  },
  {
    id: 'notif-02',
    projectId: 'proj-afripay-001',
    title: 'Nouveau Livrable Technique Déposé',
    message: 'Le Dossier d\'Architecture Technique C4 & Spécifications PCI-DSS v1.2 est disponible pour consultation.',
    type: 'document_uploaded',
    timestamp: 'Il y a 2 heures',
    timestampUtc: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    read: false,
    docId: 'doc-arch-02',
    docRef: 'VIT-DAT-2026-102',
    actorName: 'Abdoulaye Wade Jr.'
  },
  {
    id: 'notif-03',
    projectId: 'proj-afripay-001',
    title: 'Jalon 1 Recette Validée',
    message: 'Le procès-verbal de recette contradictoire pour le Jalon 1 (Sprint 1 & 2) a été approuvé et signé.',
    type: 'milestone_validated',
    timestamp: 'Hier',
    timestampUtc: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    read: true,
    milestoneId: 'm1',
    docRef: 'VIT-PVR-2026-001',
    actorName: 'Mamadou Diop (CEO AfriPay)'
  },
  {
    id: 'notif-04',
    projectId: 'proj-afripay-001',
    title: 'Contrat-Cadre Signé & Certifié eIDAS',
    message: 'La convention de cession de propriété intellectuelle à 100% est enregistrée avec empreinte SHA-256 inviolable.',
    type: 'document_signed',
    timestamp: 'Il y a 3 jours',
    timestampUtc: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    read: true,
    docId: 'doc-contract-01',
    docRef: 'VIT-CTR-2026-084',
    actorName: 'Mamadou Diop & Abdoulaye Wade Jr.'
  }
];

function getStoredNotifications(): ClientNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Error reading notifications from localStorage:', err);
    return INITIAL_NOTIFICATIONS;
  }
}

function persistStoredNotifications(notifs: ClientNotification[]): void {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifs));
  } catch (err) {
    console.warn('Error saving notifications to localStorage:', err);
  }
}

/**
 * Real-time listener for notifications with Firestore + local fallback
 */
export function subscribeToClientNotifications(
  projectId: string = 'proj-afripay-001',
  callback: (notifications: ClientNotification[]) => void
): () => void {
  let isFirestoreActive = false;
  let unsubscribeFirestore: (() => void) | null = null;

  // Immediately invoke with local storage
  const initial = getStoredNotifications();
  callback(initial);

  try {
    const notifsRef = collection(db, FIRESTORE_COLLECTION);
    const q = query(notifsRef, where('projectId', '==', projectId));

    unsubscribeFirestore = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          isFirestoreActive = true;
          const firestoreNotifs: ClientNotification[] = [];
          snapshot.forEach((d) => {
            firestoreNotifs.push({ id: d.id, ...d.data() } as ClientNotification);
          });
          // Sort by date descending
          firestoreNotifs.sort((a, b) => 
            new Date(b.timestampUtc || 0).getTime() - new Date(a.timestampUtc || 0).getTime()
          );
          persistStoredNotifications(firestoreNotifs);
          callback(firestoreNotifs);
        } else if (!isFirestoreActive) {
          // Sync initial items to Firestore
          const stored = getStoredNotifications();
          stored.forEach(async (n) => {
            try {
              await setDoc(doc(db, FIRESTORE_COLLECTION, n.id), n, { merge: true });
            } catch (e) {
              // ignore
            }
          });
        }
      },
      (error) => {
        console.warn('Firestore notifications real-time error, using local storage:', error);
      }
    );
  } catch (err) {
    console.warn('Could not connect to Firestore for notifications:', err);
  }

  // Also listen to local window storage events for cross-tab sync
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === NOTIFICATIONS_STORAGE_KEY && e.newValue) {
      try {
        callback(JSON.parse(e.newValue));
      } catch (err) {
        // ignore
      }
    }
  };
  window.addEventListener('storage', handleStorageChange);

  return () => {
    if (unsubscribeFirestore) unsubscribeFirestore();
    window.removeEventListener('storage', handleStorageChange);
  };
}

/**
 * Dispatches a new notification to Firestore and localStorage
 */
export async function sendClientNotification(params: {
  title: string;
  message: string;
  type: NotificationType;
  projectId?: string;
  docId?: string;
  docRef?: string;
  milestoneId?: string;
  actionUrl?: string;
  actionLabel?: string;
  actorName?: string;
}): Promise<ClientNotification> {
  const newNotif: ClientNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    projectId: params.projectId || 'proj-afripay-001',
    title: params.title,
    message: params.message,
    type: params.type,
    timestamp: 'À l’instant',
    timestampUtc: new Date().toISOString(),
    read: false,
    docId: params.docId,
    docRef: params.docRef,
    milestoneId: params.milestoneId,
    actionUrl: params.actionUrl,
    actionLabel: params.actionLabel,
    actorName: params.actorName
  };

  // Update local storage immediately
  const existing = getStoredNotifications();
  const updated = [newNotif, ...existing];
  persistStoredNotifications(updated);

  // Dispatch custom browser event for instant UI toast trigger
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('vitech_new_notification', { detail: newNotif }));
  }

  // Sync to Firestore
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, newNotif.id);
    await setDoc(docRef, newNotif, { merge: true });
  } catch (err) {
    console.warn('Firestore notification write fallback:', err);
  }

  return newNotif;
}

/**
 * Mark a single notification as read
 */
export async function markNotificationAsRead(id: string): Promise<void> {
  const existing = getStoredNotifications();
  const updated = existing.map(n => n.id === id ? { ...n, read: true } : n);
  persistStoredNotifications(updated);

  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, id);
    await setDoc(docRef, { read: true }, { merge: true });
  } catch (err) {
    // ignore
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<void> {
  const existing = getStoredNotifications();
  const updated = existing.map(n => ({ ...n, read: true }));
  persistStoredNotifications(updated);

  for (const n of existing) {
    if (!n.read) {
      try {
        const docRef = doc(db, FIRESTORE_COLLECTION, n.id);
        await setDoc(docRef, { read: true }, { merge: true });
      } catch (err) {
        // ignore
      }
    }
  }
}
