export interface DailyDownloadPoint {
  date: string;
  dayLabel: string;
  totalDownloads: number;
  premiumDownloads: number;
  freeDownloads: number;
  revenueUSD: number;
  revenueRWF: number;
  uniqueDevs: number;
}

export interface CategoryPerformanceData {
  categoryId: string;
  categoryName: string;
  iconName: string;
  color: string;
  totalDownloads: number;
  revenueUSD: number;
  revenueRWF: number;
  conversionRate: number; // e.g. 14.8%
  activeScriptsCount: number;
  averageRating: number;
  owaspComplianceAvg: number; // e.g. 98.6%
}

export interface DailySecurityScanPoint {
  date: string;
  dayLabel: string;
  totalScans: number;
  passedScans: number;
  flaggedScans: number;
  passRatePercentage: number; // e.g. 98.4
  vulnerabilitiesPrevented: number;
  owaspAPlusCount: number;
  avgScanDurationMs: number;
}

export interface LiveVisitorGeoNode {
  countryCode: string;
  countryName: string;
  city: string;
  flag: string;
  activeUsers: number;
  percentage: number;
  trend: 'up' | 'stable' | 'down';
  avgLatencyMs: number;
}

// 30 Days of Download & Sales Trends
export const GENERATE_30_DAYS_DOWNLOADS = (): DailyDownloadPoint[] => {
  const points: DailyDownloadPoint[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });

    // Deterministic realistic curve with weekend peaks and growth trend
    const baseFactor = 1 + (30 - i) * 0.035; // +3.5% organic growth over 30 days
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const weekendMultiplier = isWeekend ? 1.3 : 1.0;
    
    // Seed variation
    const noise = Math.sin(i * 1.7) * 8 + Math.cos(i * 0.9) * 6;
    
    const premium = Math.max(12, Math.round((28 * baseFactor * weekendMultiplier) + noise));
    const free = Math.max(25, Math.round((55 * baseFactor * weekendMultiplier) + (noise * 1.5)));
    const total = premium + free;
    const avgOrderValue = 68; // average USD per premium script
    const revenueUSD = premium * avgOrderValue;
    const revenueRWF = revenueUSD * 1320;
    const uniqueDevs = Math.round(total * 0.82);

    points.push({
      date: dateStr,
      dayLabel,
      totalDownloads: total,
      premiumDownloads: premium,
      freeDownloads: free,
      revenueUSD,
      revenueRWF,
      uniqueDevs
    });
  }

  return points;
};

// Top Category Performance Metrics
export const CATEGORY_PERFORMANCE_METRICS: CategoryPerformanceData[] = [
  {
    categoryId: 'php-laravel',
    categoryName: 'PHP & Laravel',
    iconName: 'Code',
    color: '#06b6d4', // Cyan
    totalDownloads: 3420,
    revenueUSD: 24800,
    revenueRWF: 32736000,
    conversionRate: 18.2,
    activeScriptsCount: 14,
    averageRating: 4.96,
    owaspComplianceAvg: 99.2
  },
  {
    categoryId: 'mobile-flutter',
    categoryName: 'Mobile Flutter & Dart',
    iconName: 'Smartphone',
    color: '#3b82f6', // Blue
    totalDownloads: 2850,
    revenueUSD: 19450,
    revenueRWF: 25674000,
    conversionRate: 16.5,
    activeScriptsCount: 10,
    averageRating: 4.94,
    owaspComplianceAvg: 98.8
  },
  {
    categoryId: 'fullstack-saas',
    categoryName: 'Full-Stack SaaS & Cloud',
    iconName: 'Layers',
    color: '#10b981', // Emerald
    totalDownloads: 2190,
    revenueUSD: 16800,
    revenueRWF: 22176000,
    conversionRate: 15.1,
    activeScriptsCount: 9,
    averageRating: 4.98,
    owaspComplianceAvg: 99.5
  },
  {
    categoryId: 'python-django',
    categoryName: 'Python, Django & IA',
    iconName: 'Cpu',
    color: '#8b5cf6', // Purple
    totalDownloads: 1740,
    revenueUSD: 13900,
    revenueRWF: 18348000,
    conversionRate: 14.3,
    activeScriptsCount: 7,
    averageRating: 4.92,
    owaspComplianceAvg: 99.0
  },
  {
    categoryId: 'node-react',
    categoryName: 'Node.js & Next.js',
    iconName: 'Zap',
    color: '#f59e0b', // Amber
    totalDownloads: 1420,
    revenueUSD: 9800,
    revenueRWF: 12936000,
    conversionRate: 13.8,
    activeScriptsCount: 8,
    averageRating: 4.90,
    owaspComplianceAvg: 98.4
  },
  {
    categoryId: 'wordpress-plugins',
    categoryName: 'Plugins WordPress MoMo',
    iconName: 'Globe',
    color: '#ec4899', // Pink
    totalDownloads: 980,
    revenueUSD: 5400,
    revenueRWF: 7128000,
    conversionRate: 11.2,
    activeScriptsCount: 5,
    averageRating: 4.88,
    owaspComplianceAvg: 97.9
  }
];

// 30 Days of Security Scan Pass Rates and Vulnerability Interceptions
export const GENERATE_30_DAYS_SECURITY_SCANS = (): DailySecurityScanPoint[] => {
  const points: DailySecurityScanPoint[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });

    const totalScans = Math.round(45 + Math.sin(i * 0.8) * 15 + (30 - i) * 1.8);
    const flagged = Math.max(0, Math.round(Math.random() * 2));
    const passed = totalScans - flagged;
    const passRate = parseFloat(((passed / totalScans) * 100).toFixed(1));
    const vulnerabilities = Math.round(flagged * 2 + (Math.random() > 0.6 ? 1 : 0));
    const aPlusCount = Math.round(passed * 0.92);
    const duration = Math.round(180 + Math.random() * 80);

    points.push({
      date: dateStr,
      dayLabel,
      totalScans,
      passedScans: passed,
      flaggedScans: flagged,
      passRatePercentage: passRate,
      vulnerabilitiesPrevented: vulnerabilities,
      owaspAPlusCount: aPlusCount,
      avgScanDurationMs: duration
    });
  }

  return points;
};

// Initial Geographic Nodes for Realtime Visitors
export const INITIAL_GEO_VISITORS: LiveVisitorGeoNode[] = [
  { countryCode: 'RW', countryName: 'Rwanda', city: 'Kigali', flag: '🇷🇼', activeUsers: 486, percentage: 33, trend: 'up', avgLatencyMs: 14 },
  { countryCode: 'KE', countryName: 'Kenya', city: 'Nairobi', flag: '🇰🇪', activeUsers: 274, percentage: 19, trend: 'up', avgLatencyMs: 28 },
  { countryCode: 'CI', countryName: 'Côte d\'Ivoire', city: 'Abidjan', flag: '🇨🇮', activeUsers: 198, percentage: 14, trend: 'stable', avgLatencyMs: 42 },
  { countryCode: 'FR', countryName: 'France', city: 'Paris', flag: '🇫🇷', activeUsers: 165, percentage: 11, trend: 'up', avgLatencyMs: 65 },
  { countryCode: 'CD', countryName: 'RD Congo', city: 'Kinshasa', flag: '🇨🇩', activeUsers: 142, percentage: 10, trend: 'stable', avgLatencyMs: 38 },
  { countryCode: 'SN', countryName: 'Sénégal', city: 'Dakar', flag: '🇸🇳', activeUsers: 95, percentage: 7, trend: 'up', avgLatencyMs: 52 },
  { countryCode: 'US', countryName: 'États-Unis', city: 'San Francisco', flag: '🇺🇸', activeUsers: 64, percentage: 4, trend: 'stable', avgLatencyMs: 110 },
  { countryCode: 'CM', countryName: 'Cameroun', city: 'Douala', flag: '🇨🇲', activeUsers: 48, percentage: 3, trend: 'down', avgLatencyMs: 45 }
];

export const LIVE_VISITOR_ACTIVITY_FEED = [
  { id: 'act-1', text: 'Nouveau développeur connecté depuis Kigali (MTN MoMo)', time: 'À l\'instant', type: 'purchase', flag: '🇷🇼' },
  { id: 'act-2', text: 'Audit ZIP Laravel v11 validé avec succès (100/100 OWASP)', time: 'Il y a 12s', type: 'scan', flag: '🇰🇪' },
  { id: 'act-3', text: 'Téléchargement bundle sécurisé AfriRide Flutter', time: 'Il y a 34s', type: 'download', flag: '🇨🇮' },
  { id: 'act-4', text: 'Consultation architecture OmniCloud Telemedicine', time: 'Il y a 52s', type: 'browse', flag: '🇫🇷' },
  { id: 'act-5', text: 'Nouvelle souscription Newsletter développeur', time: 'Il y a 1m', type: 'sub', flag: '🇨🇩' },
  { id: 'act-6', text: 'Paiement Airtel Money Rwanda confirmé (118,000 RWF)', time: 'Il y a 2m', type: 'purchase', flag: '🇷🇼' },
];
