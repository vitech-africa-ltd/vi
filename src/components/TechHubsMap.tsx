import React, { useState, useEffect } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow, 
  useMap 
} from '@vis.gl/react-google-maps';
import { 
  MapPin, 
  Navigation, 
  Users, 
  Phone, 
  ShieldCheck, 
  ExternalLink, 
  Compass, 
  Calendar,
  Building
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { useTranslation } from '../context/LanguageContext';
import { OfficeHub } from '../types';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY' && API_KEY.trim() !== '';

// Map Controller for smooth pan & zoom
const MapController: React.FC<{ targetPosition: { lat: number; lng: number } | null; zoom: number }> = ({ 
  targetPosition, 
  zoom 
}) => {
  const map = useMap();
  useEffect(() => {
    if (map && targetPosition) {
      map.panTo(targetPosition);
      map.setZoom(zoom);
    }
  }, [map, targetPosition, zoom]);
  return null;
};

interface TechHubsMapProps {
  onScheduleCall?: (hub?: OfficeHub) => void;
}

export const TechHubsMap: React.FC<TechHubsMapProps> = ({ onScheduleCall }) => {
  const { techHubs } = useSiteData();
  const { t } = useTranslation();

  const [selectedHub, setSelectedHub] = useState<OfficeHub>(techHubs[0] || {} as OfficeHub);
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(techHubs[0]?.id || null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');

  useEffect(() => {
    if (techHubs.length > 0 && (!selectedHub || !selectedHub.id)) {
      setSelectedHub(techHubs[0]);
      setActiveMarkerId(techHubs[0].id);
    }
  }, [techHubs]);

  const handleSelectHub = (hub: OfficeHub) => {
    setSelectedHub(hub);
    setActiveMarkerId(hub.id);
  };

  const currentHubPosition = selectedHub.position || selectedHub.coordinates || { lat: -1.9441, lng: 30.0619 };

  return (
    <section id="tech-hubs" className="py-20 bg-slate-900 text-white relative overflow-hidden border-t border-slate-800">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>{t('techHubs.badge', 'Réseau Panafricain & Présence Globale')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            {t('techHubs.title', 'Nos Hubs Technologiques en Afrique')}
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            {t('techHubs.subtitle', 'Une présence stratégique en Afrique de l\'Ouest, de l\'Est, du Nord et en Europe pour concevoir et déployer vos infrastructures 24/7.')}
          </p>
        </div>

        {/* Hub Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {techHubs.map((hub) => {
            const isSelected = selectedHub?.id === hub.id;
            return (
              <button
                key={hub.id}
                onClick={() => handleSelectHub(hub)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400/50'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-slate-700'
                }`}
              >
                <span className="text-base leading-none">{hub.flag}</span>
                <span className="font-bold">{hub.city}</span>
                <span className="text-xs text-slate-400 hidden md:inline">({hub.country})</span>
              </button>
            );
          })}
        </div>

        {/* Main Grid: Interactive Map + Hub Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Map Column */}
          <div className="lg:col-span-7 bg-slate-800/80 rounded-3xl p-3 border border-slate-700/80 shadow-2xl relative overflow-hidden flex flex-col">
            
            {/* Map Header Toolbar */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700/60 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-slate-300">
                  Google Maps Platform • Nœud actif : <strong>{selectedHub?.city}</strong>
                </span>
              </div>

              {/* Map Type Toggle */}
              <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-700">
                {(['roadmap', 'satellite', 'hybrid'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setMapType(type)}
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition-colors cursor-pointer ${
                      mapType === type
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Google Map Container */}
            <div className="h-[440px] w-full rounded-2xl overflow-hidden relative bg-slate-950">
              {hasValidKey ? (
                <APIProvider apiKey={API_KEY}>
                  <Map
                    defaultCenter={currentHubPosition}
                    defaultZoom={13}
                    mapTypeId={mapType}
                    gestureHandling="greedy"
                    disableDefaultUI={false}
                    className="w-full h-full"
                  >
                    <MapController targetPosition={currentHubPosition} zoom={13} />

                    {/* Render All Hub Markers */}
                    {techHubs.map((hub) => {
                      const pos = hub.position || hub.coordinates || { lat: 0, lng: 0 };
                      const isSelected = selectedHub?.id === hub.id;
                      return (
                        <AdvancedMarker
                          key={hub.id}
                          position={pos}
                          onClick={() => handleSelectHub(hub)}
                          title={`${hub.city}, ${hub.country}`}
                        >
                          <Pin
                            background={isSelected ? '#2563eb' : '#0f172a'}
                            borderColor={isSelected ? '#60a5fa' : '#334155'}
                            glyphColor={isSelected ? '#ffffff' : '#94a3b8'}
                            scale={isSelected ? 1.25 : 0.95}
                          />
                        </AdvancedMarker>
                      );
                    })}

                    {/* Active InfoWindow */}
                    {selectedHub && (
                      <InfoWindow
                        position={currentHubPosition}
                        onCloseClick={() => setActiveMarkerId(null)}
                      >
                        <div className="p-2 text-slate-900 max-w-xs">
                          <div className="font-bold text-sm flex items-center gap-1.5">
                            <span>{selectedHub.flag}</span>
                            <span>{selectedHub.city} • V&amp;I TECH</span>
                          </div>
                          <div className="text-xs text-slate-600 mt-1 font-medium">{selectedHub.role}</div>
                          <div className="text-[11px] text-slate-500 mt-1">{selectedHub.address}</div>
                        </div>
                      </InfoWindow>
                    )}
                  </Map>
                </APIProvider>
              ) : (
                /* Fallback Stylized Interactive Map Simulator */
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-950 text-slate-200">
                  <div className="p-3 bg-blue-600/20 text-blue-400 rounded-2xl border border-blue-500/30">
                    <Compass className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Hub de {selectedHub?.city} ({selectedHub?.country})</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-md">{selectedHub?.address}</p>
                    <p className="text-[11px] text-emerald-400 font-mono mt-2">
                      Coordonnées GPS : {currentHubPosition.lat.toFixed(4)}°N, {currentHubPosition.lng.toFixed(4)}°E
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Hub Technical Dossier Column */}
          {selectedHub && (
            <div className="lg:col-span-5 bg-slate-800/90 rounded-3xl p-6 sm:p-7 border border-slate-700/80 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
                <div>
                  <div className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">
                    {selectedHub.country} • {selectedHub.role}
                  </div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span>{selectedHub.flag}</span>
                    <span>Hub de {selectedHub.city}</span>
                  </h3>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-xs font-bold font-mono">
                    {selectedHub.engineersCount || 12}+ Ingénieurs
                  </span>
                </div>
              </div>

              {/* Address & Lead */}
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Adresse du Hub :</span>
                    <span>{selectedHub.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <Users className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Lead Architecte Local :</span>
                    <span>{selectedHub.leadArchitect || 'Lead Solution Architect'}</span>
                  </div>
                </div>
              </div>

              {/* CTA Action */}
              <button
                onClick={() => onScheduleCall?.(selectedHub)}
                className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>{t('techHubs.scheduleWithLead', 'Prendre rendez-vous avec ce Hub')}</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
