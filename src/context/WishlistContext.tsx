import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where 
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { INITIAL_SCRIPTS, ScriptProduct } from '../data/scriptsData';

export interface WishlistItemData {
  id: string;
  userId: string;
  scriptId: string;
  title: string;
  category?: string;
  priceUSD?: number;
  priceRWF?: number;
  previewImage?: string;
  createdAt: string;
}

interface WishlistContextType {
  wishlistIds: string[];
  wishlistItems: WishlistItemData[];
  wishlistProducts: ScriptProduct[];
  wishlistCount: number;
  loading: boolean;
  isInWishlist: (scriptId: string) => boolean;
  toggleWishlist: (product: ScriptProduct) => Promise<boolean>;
  addToWishlist: (product: ScriptProduct) => Promise<void>;
  removeFromWishlist: (scriptId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const LOCAL_STORAGE_WISHLIST_KEY = 'vitech_guest_wishlist';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItemData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load from local storage for unauthenticated / guest fallback
  useEffect(() => {
    if (!isAuthenticated) {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_WISHLIST_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setWishlistItems(parsed);
          }
        } else {
          setWishlistItems([]);
        }
      } catch (err) {
        console.warn('Failed to parse guest wishlist:', err);
      } finally {
        setLoading(false);
      }
    }
  }, [isAuthenticated]);

  // Real-time Firestore synchronization for authenticated member
  useEffect(() => {
    if (!isAuthenticated || !user?.uid) {
      return;
    }

    setLoading(true);
    const wishlistCollectionRef = collection(db, 'wishlists');
    const userWishlistQuery = query(wishlistCollectionRef, where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(
      userWishlistQuery,
      (snapshot) => {
        const items: WishlistItemData[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as WishlistItemData;
          items.push({
            ...data,
            id: docSnap.id,
          });
        });
        setWishlistItems(items);
        setLoading(false);
      },
      (error) => {
        console.error('Wishlist Firestore onSnapshot error:', error);
        handleFirestoreError(error, OperationType.LIST, 'wishlists');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isAuthenticated, user?.uid]);

  // Wishlist IDs array for quick lookups
  const wishlistIds = useMemo(() => {
    return wishlistItems.map((item) => item.scriptId);
  }, [wishlistItems]);

  // Resolved ScriptProduct items matching the wishlist
  const wishlistProducts = useMemo(() => {
    return INITIAL_SCRIPTS.filter((script) => wishlistIds.includes(script.id));
  }, [wishlistIds]);

  const isInWishlist = (scriptId: string): boolean => {
    return wishlistIds.includes(scriptId);
  };

  const getDocId = (userId: string, scriptId: string): string => {
    // Generate valid alphanumeric doc ID compliant with regex '^[a-zA-Z0-9_\-]+$'
    const cleanUser = userId.replace(/[^a-zA-Z0-9_\-]/g, '_');
    const cleanScript = scriptId.replace(/[^a-zA-Z0-9_\-]/g, '_');
    return `${cleanUser}_${cleanScript}`.substring(0, 128);
  };

  const addToWishlist = async (product: ScriptProduct): Promise<void> => {
    if (isInWishlist(product.id)) return;

    const newItem: WishlistItemData = {
      id: user?.uid ? getDocId(user.uid, product.id) : `guest_${product.id}`,
      userId: user?.uid || 'guest',
      scriptId: product.id,
      title: product.title,
      category: product.category,
      priceUSD: product.priceUSD,
      priceRWF: product.priceRWF,
      previewImage: product.previewImage,
      createdAt: new Date().toISOString(),
    };

    if (isAuthenticated && user?.uid) {
      const docId = getDocId(user.uid, product.id);
      const docRef = doc(db, 'wishlists', docId);
      try {
        await setDoc(docRef, newItem);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `wishlists/${docId}`);
      }
    } else {
      // Local storage guest mode
      const updated = [...wishlistItems, newItem];
      setWishlistItems(updated);
      try {
        localStorage.setItem(LOCAL_STORAGE_WISHLIST_KEY, JSON.stringify(updated));
      } catch (e) {}
    }
  };

  const removeFromWishlist = async (scriptId: string): Promise<void> => {
    if (isAuthenticated && user?.uid) {
      const docId = getDocId(user.uid, scriptId);
      const docRef = doc(db, 'wishlists', docId);
      try {
        await deleteDoc(docRef);
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `wishlists/${docId}`);
      }
    } else {
      const updated = wishlistItems.filter((item) => item.scriptId !== scriptId);
      setWishlistItems(updated);
      try {
        localStorage.setItem(LOCAL_STORAGE_WISHLIST_KEY, JSON.stringify(updated));
      } catch (e) {}
    }
  };

  const toggleWishlist = async (product: ScriptProduct): Promise<boolean> => {
    const currentlyIn = isInWishlist(product.id);
    if (currentlyIn) {
      await removeFromWishlist(product.id);
      return false;
    } else {
      await addToWishlist(product);
      return true;
    }
  };

  const clearWishlist = async (): Promise<void> => {
    if (isAuthenticated && user?.uid) {
      const promises = wishlistItems.map((item) => {
        const docRef = doc(db, 'wishlists', item.id);
        return deleteDoc(docRef).catch((err) =>
          handleFirestoreError(err, OperationType.DELETE, `wishlists/${item.id}`)
        );
      });
      await Promise.all(promises);
    } else {
      setWishlistItems([]);
      try {
        localStorage.removeItem(LOCAL_STORAGE_WISHLIST_KEY);
      } catch (e) {}
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistItems,
        wishlistProducts,
        wishlistCount: wishlistIds.length,
        loading,
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
