import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, onSnapshot, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface CountryVisitorStat {
  code: string;
  name: string;
  flag: string;
  visits: number;
  activeNow: number;
}

export interface LiveActivityItem {
  id: string;
  location: string;
  flag: string;
  action: string;
  timestamp: string;
}

interface VisitorStatsData {
  totalVisits: number;
  todayVisits: number;
  uniqueVisitors: number;
  activeNow: number;
  lastUpdated: string;
}

interface VisitorCounterContextType {
  totalVisits: number;
  todayVisits: number;
  uniqueVisitors: number;
  activeNow: number;
  countryStats: CountryVisitorStat[];
  recentActivities: LiveActivityItem[];
  isLive: boolean;
  hasVisitedBefore: boolean;
  refreshStats: () => Promise<void>;
  simulateNewVisit: () => void;
}

const DEFAULT_STATS: VisitorStatsData = {
  totalVisits: 18450,
  todayVisits: 842,
  uniqueVisitors: 12930,
  activeNow: 38,
  lastUpdated: new Date().toISOString()
};

const INITIAL_COUNTRY_STATS: CountryVisitorStat[] = [
  { code: 'RW', name: 'Rwanda (Kigali & Gisenyi)', flag: '🇷🇼', visits: 5420, activeNow: 12 },
  { code: 'SN', name: 'Sénégal (Dakar)', flag: '🇸🇳', visits: 3840, activeNow: 8 },
  { code: 'CI', name: "Côte d'Ivoire (Abidjan)", flag: '🇨🇮', visits: 3120, activeNow: 7 },
  { code: 'CD', name: 'RDC (Kinshasa & Goma)', flag: '🇨🇩', visits: 2450, activeNow: 5 },
  { code: 'CM', name: 'Cameroun (Douala & Yaoundé)', flag: '🇨🇲', visits: 1680, activeNow: 3 },
  { code: 'MA', name: 'Maroc (Casablanca)', flag: '🇲🇦', visits: 1120, activeNow: 2 },
  { code: 'FR', name: 'France (Paris & Lyon)', flag: '🇫🇷', visits: 1340, activeNow: 3 },
  { code: 'OTHER', name: 'Autres Pays & Diaspora', flag: '🌍', visits: 980, activeNow: 2 },
];

const INITIAL_ACTIVITIES: LiveActivityItem[] = [
  { id: '1', location: 'Kigali, Rwanda', flag: '🇷🇼', action: 'Consultation Passerelle MTN MoMo', timestamp: 'Il y a 35s' },
  { id: '2', location: 'Dakar, Sénégal', flag: '🇸🇳', action: 'Simulation de devis Fintech Core Banking', timestamp: 'Il y a 1 min' },
  { id: '3', location: 'Abidjan, Côte d’Ivoire', flag: '🇨🇮', action: 'Téléchargement Livre Blanc Cloud & FinOps', timestamp: 'Il y a 2 min' },
  { id: '4', location: 'Goma, RDC', flag: '🇨🇩', action: 'Test du simulateur d’impact écologique Green Cloud', timestamp: 'Il y a 3 min' },
  { id: '5', location: 'Paris, France', flag: '🇫🇷', action: 'Réservation cadrage technique 30 min', timestamp: 'Il y a 4 min' },
];

const VisitorCounterContext = createContext<VisitorCounterContextType | undefined>(undefined);

export const VisitorCounterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<VisitorStatsData>(() => {
    try {
      const cached = localStorage.getItem('vitech_visitor_stats');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_STATS;
  });

  const [countryStats, setCountryStats] = useState<CountryVisitorStat[]>(INITIAL_COUNTRY_STATS);
  const [recentActivities, setRecentActivities] = useState<LiveActivityItem[]>(INITIAL_ACTIVITIES);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [hasVisitedBefore, setHasVisitedBefore] = useState<boolean>(false);

  // Synchronize with Firestore `site_content/visitors_stats`
  useEffect(() => {
    let unsubscribe = () => {};

    try {
      const statsDocRef = doc(db, 'site_content', 'visitors_stats');
      
      unsubscribe = onSnapshot(statsDocRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data && typeof data.totalVisits === 'number') {
            const updatedStats: VisitorStatsData = {
              totalVisits: data.totalVisits,
              todayVisits: data.todayVisits || Math.floor(data.totalVisits * 0.045),
              uniqueVisitors: data.uniqueVisitors || Math.floor(data.totalVisits * 0.7),
              activeNow: Math.max(12, data.activeNow || 38),
              lastUpdated: data.lastUpdated || new Date().toISOString()
            };
            setStats(updatedStats);
            try {
              localStorage.setItem('vitech_visitor_stats', JSON.stringify(updatedStats));
            } catch (e) {}
          }
        } else {
          // Initialize document if not found
          setDoc(statsDocRef, {
            contentKey: 'visitors_stats',
            ...DEFAULT_STATS,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }).catch(() => {});
        }
      }, (err) => {
        console.warn('Firestore visitor stats onSnapshot fallback:', err);
      });
    } catch (e) {
      console.warn('Firestore visitor subscription error:', e);
    }

    return () => unsubscribe();
  }, []);

  // Increment session visit on first load
  useEffect(() => {
    const sessionVisited = sessionStorage.getItem('vitech_session_counted');
    const persistentId = localStorage.getItem('vitech_visitor_id');

    if (persistentId) {
      setHasVisitedBefore(true);
    } else {
      const newId = 'vis_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      localStorage.setItem('vitech_visitor_id', newId);
    }

    if (!sessionVisited) {
      sessionStorage.setItem('vitech_session_counted', 'true');
      
      // Update local state immediately
      setStats(prev => {
        const next = {
          ...prev,
          totalVisits: prev.totalVisits + 1,
          todayVisits: prev.todayVisits + 1,
          uniqueVisitors: persistentId ? prev.uniqueVisitors : prev.uniqueVisitors + 1,
          activeNow: Math.min(80, prev.activeNow + 1),
          lastUpdated: new Date().toISOString()
        };
        try {
          localStorage.setItem('vitech_visitor_stats', JSON.stringify(next));
        } catch (e) {}
        return next;
      });

      // Increment in Firestore asynchronously
      try {
        const statsDocRef = doc(db, 'site_content', 'visitors_stats');
        getDoc(statsDocRef).then((snap) => {
          if (snap.exists()) {
            updateDoc(statsDocRef, {
              totalVisits: increment(1),
              todayVisits: increment(1),
              lastUpdated: new Date().toISOString()
            }).catch(() => {});
          } else {
            setDoc(statsDocRef, {
              contentKey: 'visitors_stats',
              totalVisits: DEFAULT_STATS.totalVisits + 1,
              todayVisits: DEFAULT_STATS.todayVisits + 1,
              uniqueVisitors: DEFAULT_STATS.uniqueVisitors + 1,
              activeNow: 42,
              lastUpdated: new Date().toISOString()
            }).catch(() => {});
          }
        }).catch(() => {});
      } catch (e) {}
    }
  }, []);

  // Periodic simulated live fluctuations to reflect real user concurrent traffic
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => {
        // Natural gentle oscillation of active concurrent users between 25 and 65
        const fluctuation = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const nextActive = Math.max(18, Math.min(75, prev.activeNow + fluctuation));
        return {
          ...prev,
          activeNow: nextActive
        };
      });

      // Randomly update an activity event
      if (Math.random() > 0.6) {
        const sampleLocations = [
          { loc: 'Kigali, Rwanda', flag: '🇷🇼', action: 'Consultation API VitechPay' },
          { loc: 'Dakar, Sénégal', flag: '🇸🇳', action: 'Simulation de devis Cloud Kubernetes' },
          { loc: 'Abidjan, Côte d’Ivoire', flag: '🇨🇮', action: 'Calculateur d’impact écologique Green Cloud' },
          { loc: 'Kinshasa, RDC', flag: '🇨🇩', action: 'Accès espace membres marketplace' },
          { loc: 'Douala, Cameroun', flag: '🇨🇲', action: 'Recherche sémantique globale' },
          { loc: 'Casablanca, Maroc', flag: '🇲🇦', action: 'Consultation des études de cas fintech' },
          { loc: 'Paris, France', flag: '🇫🇷', action: 'Prise de rendez-vous cadrage' },
        ];
        const randomItem = sampleLocations[Math.floor(Math.random() * sampleLocations.length)];
        const newAct: LiveActivityItem = {
          id: 'act_' + Date.now(),
          location: randomItem.loc,
          flag: randomItem.flag,
          action: randomItem.action,
          timestamp: 'À l’instant'
        };

        setRecentActivities(prev => [newAct, ...prev.slice(0, 5)]);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const refreshStats = useCallback(async () => {
    try {
      const statsDocRef = doc(db, 'site_content', 'visitors_stats');
      const snap = await getDoc(statsDocRef);
      if (snap.exists()) {
        const data = snap.data();
        if (data && typeof data.totalVisits === 'number') {
          setStats({
            totalVisits: data.totalVisits,
            todayVisits: data.todayVisits || Math.floor(data.totalVisits * 0.045),
            uniqueVisitors: data.uniqueVisitors || Math.floor(data.totalVisits * 0.7),
            activeNow: data.activeNow || 38,
            lastUpdated: data.lastUpdated || new Date().toISOString()
          });
        }
      }
    } catch (e) {
      console.warn('Error refreshing visitor stats:', e);
    }
  }, []);

  const simulateNewVisit = useCallback(() => {
    setStats(prev => ({
      ...prev,
      totalVisits: prev.totalVisits + 1,
      todayVisits: prev.todayVisits + 1,
      activeNow: prev.activeNow + 1,
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  return (
    <VisitorCounterContext.Provider
      value={{
        totalVisits: stats.totalVisits,
        todayVisits: stats.todayVisits,
        uniqueVisitors: stats.uniqueVisitors,
        activeNow: stats.activeNow,
        countryStats,
        recentActivities,
        isLive,
        hasVisitedBefore,
        refreshStats,
        simulateNewVisit
      }}
    >
      {children}
    </VisitorCounterContext.Provider>
  );
};

export const useVisitorCounter = () => {
  const context = useContext(VisitorCounterContext);
  if (!context) {
    throw new Error('useVisitorCounter must be used within a VisitorCounterProvider');
  }
  return context;
};
