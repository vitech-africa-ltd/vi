import { 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  query, 
  where 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ProjectDocument } from '../types';
import { INITIAL_PROJECT_DOCUMENTS } from '../data/projectDocumentsData';
import { downloadProjectPdf, GeneratedPdfMetadata } from '../utils/pdfGenerator';

const COLLECTION_NAME = 'project_documents';

/**
 * Subscribes in real-time to documents for a specific project
 */
export function subscribeToProjectDocuments(
  projectId: string,
  onUpdate: (docs: (ProjectDocument & { pdfData?: GeneratedPdfMetadata })[]) => void,
  onError?: (err: any) => void
) {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('projectId', '==', projectId)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          // Fallback to initial seed documents with full metadata
          onUpdate(INITIAL_PROJECT_DOCUMENTS);
        } else {
          const list: (ProjectDocument & { pdfData?: GeneratedPdfMetadata })[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as ProjectDocument;
            // Match with initial doc for enriched pdfData if present
            const matchedInitial = INITIAL_PROJECT_DOCUMENTS.find(d => d.id === data.id || d.docRef === data.docRef);
            list.push({
              ...data,
              id: docSnap.id,
              pdfData: matchedInitial?.pdfData
            });
          });
          onUpdate(list);
        }
      },
      (error) => {
        console.warn('Firestore documents subscription fallback to local cache:', error);
        onUpdate(INITIAL_PROJECT_DOCUMENTS);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.warn('Could not establish real-time Firestore listener, using local data:', error);
    onUpdate(INITIAL_PROJECT_DOCUMENTS);
    return () => {};
  }
}

/**
 * Saves or updates a project document in Firestore
 */
export async function saveProjectDocument(docData: ProjectDocument): Promise<void> {
  const docId = docData.id || `doc-${Date.now()}`;
  const docRef = doc(db, COLLECTION_NAME, docId);
  try {
    await setDoc(docRef, {
      ...docData,
      id: docId
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${docId}`);
  }
}

/**
 * Initiates direct download of a document's official certified PDF
 */
export function downloadDocument(docItem: ProjectDocument & { pdfData?: GeneratedPdfMetadata }) {
  const basePdfData = docItem.pdfData || {
    title: docItem.title,
    docRef: docItem.docRef || 'VIT-DOC-2026',
    category: docItem.documentType.toUpperCase(),
    clientName: 'AfriPay Financial Services Ltd',
    projectName: 'AfriPay Core Switch Payment Platform',
    leadArchitect: 'Abdoulaye Wade Jr. (Senior Partner & Lead Architect)',
    date: docItem.uploadedAt,
    version: docItem.version,
    sha256: docItem.hashSha256 || '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    milestoneTitle: 'Livrable Officiel du Projet',
    sections: [
      {
        heading: 'PÉRIMÈTRE & ENGAGEMENTS CONTRACTUELS',
        content: [
          docItem.description,
          ...(docItem.keyPoints || [
            'Livrable certifié conforme aux normes internationales',
            'Code source et architectures validés avec 100% de tests passants'
          ])
        ]
      }
    ]
  };

  const pdfData: GeneratedPdfMetadata = {
    ...basePdfData,
    clientSignature: docItem.clientSignature || basePdfData.clientSignature
  };

  downloadProjectPdf(pdfData, docItem.fileName);
}
