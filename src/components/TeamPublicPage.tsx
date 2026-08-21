import React from 'react';
import { 
  Users, 
  Linkedin, 
  Github, 
  Twitter, 
  Mail, 
  Sparkles, 
  ShieldCheck, 
  Code2, 
  Globe, 
  ArrowRight,
  ChevronRight,
  Heart,
  Award
} from 'lucide-react';
import { INITIAL_TEAM_MEMBERS } from '../data/teamData';

interface TeamPublicPageProps {
  onNavigateContact: () => void;
  onNavigateScripts: () => void;
}

export const TeamPublicPage: React.FC<TeamPublicPageProps> = ({
  onNavigateContact,
  onNavigateScripts
}) => {
  const founders = INITIAL_TEAM_MEMBERS.filter(m => m.id.includes('founder'));
  const leads = INITIAL_TEAM_MEMBERS.filter(m => !m.id.includes('founder'));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-indigo-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>L'Élite de l'Ingénierie Logicielle Panafricaine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Rencontrez les Bâtisseurs de <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Vitech Africa &amp; Vitech Scripts
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Une escouade de fondateurs visionnaires, architectes logiciels, experts en cybersécurité DevSecOps, spécialistes de l'IA et designers UI/UX dédiés à l'excellence technique.
          </p>
        </div>
      </section>

      {/* FOUNDERS SHOWCASE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Award className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl sm:text-2xl font-black text-white">Les Co-Fondateurs (Founders)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {founders.map((founder) => (
            <div
              key={founder.id}
              className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-amber-500/30 relative overflow-hidden flex flex-col justify-between space-y-6 shadow-2xl group hover:border-amber-400 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={founder.avatar}
                      alt={founder.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-amber-400/50 shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 p-1.5 rounded-lg bg-slate-950 border border-amber-500/40 text-amber-400">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-white">{founder.name}</h3>
                    <span className="text-xs font-mono font-bold text-amber-400 block">{founder.role}</span>
                    <span className="text-[11px] text-slate-400">{founder.location}</span>
                  </div>
                </div>

                {founder.highlightQuote && (
                  <blockquote className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs italic text-slate-300 leading-relaxed">
                    "{founder.highlightQuote}"
                  </blockquote>
                )}

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {founder.bio}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {founder.skills.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-xl bg-slate-950 text-slate-200 border border-slate-800 text-xs font-mono font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">Contact Direct :</span>
                <div className="flex items-center gap-2">
                  {founder.socialLinks.linkedin && (
                    <a href={founder.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {founder.socialLinks.github && (
                    <a href={founder.socialLinks.github} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors">
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {founder.socialLinks.twitter && (
                    <a href={founder.socialLinks.twitter} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors">
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {founder.socialLinks.email && (
                    <a href={`mailto:${founder.socialLinks.email}`} className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-colors">
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* LEAD ENGINEERS & EXPERTS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-16">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Code2 className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl sm:text-2xl font-black text-white">Pôles d'Ingénierie &amp; DevSecOps</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={lead.avatar}
                    alt={lead.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-700"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white">{lead.name}</h3>
                    <span className="text-xs font-mono text-cyan-400 font-semibold block">{lead.role}</span>
                    <span className="text-[10px] text-slate-500">{lead.location}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {lead.bio}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {lead.skills.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-950 text-[10px] font-mono text-slate-400 border border-slate-800">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-slate-500">{lead.department}</span>
                <div className="flex items-center gap-1.5">
                  {lead.socialLinks.linkedin && (
                    <a href={lead.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-cyan-400">
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {lead.socialLinks.github && (
                    <a href={lead.socialLinks.github} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-cyan-400">
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 text-center space-y-4 shadow-2xl">
          <h3 className="text-xl sm:text-2xl font-black text-white">Vous souhaitez collaborer avec notre équipe ?</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Nous concevons des plateformes numériques sur-mesure pour les entreprises, fintechs et institutions à travers l'Afrique et l'international.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onNavigateContact}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer shadow active:scale-95 transition-all"
            >
              Nous Contacter
            </button>
            <button
              onClick={onNavigateScripts}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer active:scale-95 transition-all"
            >
              Explorer Vitech Scripts
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
