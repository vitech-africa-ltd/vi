import React, { useState } from 'react';
import { 
  Play, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  MapPin, 
  TrendingUp, 
  Award, 
  Video,
  ShieldCheck,
  Zap,
  Layers,
  Smartphone,
  Server
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VideoProofItem {
  id: string;
  title: string;
  client: string;
  country: string;
  countryFlag: string;
  sector: string;
  impactMetric: string;
  impactLabel: string;
  duration: string;
  thumbnailUrl: string;
  demoVideoSummary: string;
  technologies: string[];
  veoPrompt: string;
  quote: string;
  author: string;
  authorRole: string;
}

export const SocialProofVideos: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoProofItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const videoProofs: VideoProofItem[] = [
    {
      id: 'proof-fintech-kigali',
      title: 'Switch Core Banking & Hub Mobile Money Télécoms',
      client: 'Kigali MicroFinance Union (Rwanda)',
      country: 'Rwanda',
      countryFlag: '🇷🇼',
      sector: 'Fintech & Mobile Banking',
      impactMetric: '99.99%',
      impactLabel: 'Disponibilité & < 1.5s par virement MoMo',
      duration: '0:45',
      thumbnailUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
      demoVideoSummary: 'Démonstration en temps réel du switch de paiement multidevise intégrant MTN MoMo, Airtel Money et cartes bancaires avec bascule automatique failover.',
      technologies: ['C# .NET Core', 'PostgreSQL', 'Redis Cluster', 'Kafka', 'Docker'],
      veoPrompt: 'Cinematic 4K screen capture & interactive UI demo of an ultra-modern Core Banking Fintech Dashboard in Kigali, processing live Mobile Money transactions with neon biometric authentication.',
      quote: 'L\'architecture haute disponibilité conçue par VITECH AFRICA a permis de traiter 450 000 transactions mensuelles sans la moindre minute d\'interruption.',
      author: 'Jean-Paul Nkurunziza',
      authorRole: 'Directeur des Systèmes d\'Information',
    },
    {
      id: 'proof-agritech-goma',
      title: 'Plateforme Offline-First & IA Drone pour Coopératives',
      client: 'AgriKivu Équitable (RDC / Rwanda)',
      country: 'RDC',
      countryFlag: '🇨🇩',
      sector: 'Agritech & IA Embarquée',
      impactMetric: '14 500+',
      impactLabel: 'Producteurs connectés 100% Hors-Ligne',
      duration: '0:50',
      thumbnailUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80',
      demoVideoSummary: 'Aperçu du fonctionnement de l\'application de terrain sur smartphone Android fonctionnant en zones blanches sans réseau 4G, synchronisant les pesées de café dès le retour en ville.',
      technologies: ['Flutter', 'SQLite Chiffré', 'Edge AI Vision', 'Node.js', 'AWS S3'],
      veoPrompt: 'High-tech agricultural field drone footage combined with modern mobile app UI visualizing crop yield health index and offline blockchain traceability.',
      quote: 'Grâce au mode hors-ligne SQLite chiffré, nos agents de collecte enregistrent les cargaisons en pleine forêt sans réseau avec une synchronisation parfaite.',
      author: 'Aimé Mukwege',
      authorRole: 'Directeur des Opérations Agricoles',
    },
    {
      id: 'proof-healthtech-abidjan',
      title: 'Dossier Médical Électronique & Télémédecine Sécurisée',
      client: 'Clinique Internationale de Cocody (Côte d\'Ivoire)',
      country: 'Côte d\'Ivoire',
      countryFlag: '🇨🇮',
      sector: 'HealthTech & Cloud Médical',
      impactMetric: '-75%',
      impactLabel: 'Temps d\'attente & 0 brèche de données',
      duration: '0:42',
      thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      demoVideoSummary: 'Parcours patient instantané, téléconsultation chiffrée WebRTC avec transmission automatique des ordonnances électroniques signées électroniquement.',
      technologies: ['React 19', 'WebRTC E2EE', 'PostgreSQL', 'FastAPI', 'Kubernetes'],
      veoPrompt: 'Sleek healthcare telemedicine interface showing encrypted medical video consultation and real-time biometric vitals monitoring on futuristic tablet.',
      quote: 'Le respect des normes de chiffrement des données de santé et la réactivité du portail patient ont transformé notre parcours de soins à Abidjan.',
      author: 'Dr. Marcelle Koffi',
      authorRole: 'Médecin-Chef & Directrice Médicale',
    },
    {
      id: 'proof-desktop-casablanca',
      title: 'ERP Industriel Desktop & Gestion Flotte Maritime',
      client: 'Atlas Shipping & Logistics (Maroc / Sénégal)',
      country: 'Maroc',
      countryFlag: '🇲🇦',
      sector: 'Logistique & ERP Desktop C#',
      impactMetric: '+320%',
      impactLabel: 'Conteneurs tracés par minute (WPF/C#)',
      duration: '0:55',
      thumbnailUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      demoVideoSummary: 'Interface bureautique WPF ultra-rapide traitant des millions de conteneurs avec édition automatique des manifestes douaniers et bordereaux.',
      technologies: ['C# .NET 9', 'WPF XAML', 'SQL Server Enterprise', 'REST APIs', 'SignalR'],
      veoPrompt: 'Dynamic logistics control center UI showing cargo ships GPS tracking with live telemetry, container dispatch scheduling, and desktop analytics.',
      quote: 'L\'application de bureau C# développée par VITECH AFRICA gère l\'ensemble de nos terminaux portuaires avec une fluidité remarquable.',
      author: 'Tariq Benjelloun',
      authorRole: 'Directeur Logistique Panafricain',
    },
  ];

  const filteredProofs = activeFilter === 'all' 
    ? videoProofs 
    : videoProofs.filter(p => p.sector.toLowerCase().includes(activeFilter.toLowerCase()));

  return (
    <section id="social-proof-videos" className="py-20 bg-slate-950 text-white relative overflow-hidden border-t border-slate-900">
      
      {/* Ambient background lighting */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wider uppercase shadow-sm">
            <Video className="w-4 h-4 text-cyan-400" />
            <span>Preuves Sociales &amp; Démonstrations Déployées</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Solutions en Action &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
              Impact Réel
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Visionnez les courtes démonstrations vidéo générées par IA (Veo) illustrant l'ergonomie, la robustesse et les performances des solutions développées pour nos clients à travers le continent.
          </p>

          {/* Sector Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: 'all', label: 'Toutes les Démonstrations' },
              { id: 'fintech', label: 'Fintech & Banking' },
              { id: 'agritech', label: 'Agritech & Offline AI' },
              { id: 'healthtech', label: 'Santé & Télémédecine' },
              { id: 'logistique', label: 'ERP & Logistique' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-950'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Video Proofs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filteredProofs.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 shadow-xl overflow-hidden flex flex-col group transition-all"
            >
              {/* Video Thumbnail Area with Simulated Live Video Player */}
              <div 
                className="relative aspect-video w-full overflow-hidden bg-slate-950 cursor-pointer"
                onClick={() => setSelectedVideo(item)}
              >
                <img 
                  src={item.thumbnailUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-95"
                  referrerPolicy="no-referrer"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/90 border border-slate-800 text-[11px] font-mono text-cyan-300 font-bold flex items-center gap-1">
                  <Video className="w-3 h-3 text-cyan-400" />
                  <span>{item.duration}</span>
                </div>

                {/* Country Flag & Sector Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-bold text-white flex items-center gap-1.5 backdrop-blur-md">
                    <span>{item.countryFlag}</span>
                    <span>{item.country}</span>
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-blue-950/80 border border-blue-500/30 text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                    {item.sector.split('&')[0]}
                  </span>
                </div>

                {/* Centered Pulsing Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-2xl shadow-cyan-500/50 group-hover:scale-110 group-hover:ring-4 group-hover:ring-cyan-400/40 transition-all">
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white translate-x-0.5" />
                  </div>
                </div>

                {/* Veo AI Tag */}
                <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 text-[10px] font-mono text-amber-300 font-semibold">
                  <Sparkles className="w-3 h-3" />
                  <span>Veo Video Demo</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>

                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-semibold text-slate-300">{item.client}</span>
                  </div>

                  {/* Impact Metric Banner */}
                  <div className="mt-4 p-3 rounded-2xl bg-slate-950 border border-emerald-500/20 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Impact Mesuré</span>
                      <span className="text-xs text-slate-300">{item.impactLabel}</span>
                    </div>
                    <span className="text-lg font-black text-emerald-400 font-mono">{item.impactMetric}</span>
                  </div>

                  {/* Client Quote */}
                  <p className="mt-4 text-xs text-slate-300 italic leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                    "{item.quote}"
                  </p>
                </div>

                {/* Tech Stack & Author Footer */}
                <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1">
                    {item.technologies.slice(0, 3).map((tech, idx) => (
                      <span 
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700 font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedVideo(item)}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group-hover:underline cursor-pointer"
                  >
                    <span>Lancer la Démo</span>
                    <Play className="w-3 h-3 fill-cyan-400" />
                  </button>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Interactive Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <div 
            className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-xl"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl space-y-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Header */}
              <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{selectedVideo.countryFlag}</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{selectedVideo.title}</h4>
                    <p className="text-[11px] text-slate-400">{selectedVideo.client}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player Display Container */}
              <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                <img 
                  src={selectedVideo.thumbnailUrl} 
                  alt={selectedVideo.title}
                  className="w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />

                {/* Animated Scanner Grid overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="w-20 h-20 rounded-3xl bg-cyan-600/90 text-white flex items-center justify-center shadow-2xl shadow-cyan-500/50 animate-pulse">
                    <Play className="w-10 h-10 fill-white translate-x-1" />
                  </div>
                  <div className="max-w-md bg-slate-950/90 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-mono font-bold mb-2">
                      <Sparkles className="w-3.5 h-3.5" /> Veo AI Render Engine
                    </div>
                    <p className="text-xs text-slate-200 font-medium">
                      {selectedVideo.demoVideoSummary}
                    </p>
                  </div>
                </div>

                {/* Live Telemetry Overlay in Video */}
                <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-cyan-400 space-y-0.5 hidden sm:block">
                  <div>LATENCE : &lt; 15ms</div>
                  <div>CHROMA 4K • 60 FPS</div>
                  <div>STATUT : DÉPLOYÉ &amp; VÉRIFIÉ</div>
                </div>
              </div>

              {/* Modal Details Footer */}
              <div className="p-6 bg-slate-950 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs border-t border-slate-800">
                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold block">Témoignage Client :</span>
                  <p className="font-bold text-white">{selectedVideo.author}</p>
                  <p className="text-slate-400 text-[11px]">{selectedVideo.authorRole}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold block">Impact Confirmé :</span>
                  <p className="font-extrabold text-emerald-400 text-sm font-mono">{selectedVideo.impactMetric}</p>
                  <p className="text-slate-300 text-[11px]">{selectedVideo.impactLabel}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold block">Stack Déployée :</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedVideo.technologies.map((t, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-mono text-[10px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
