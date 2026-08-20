import React, { useState } from 'react';
import { 
  Code2, 
  Cpu, 
  Database, 
  GraduationCap, 
  Smartphone, 
  Briefcase, 
  CheckCircle2, 
  ExternalLink, 
  Layers, 
  Sparkles, 
  Monitor, 
  Terminal, 
  Phone, 
  Mail, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  UserCheck,
  Building2,
  FileSpreadsheet,
  Award,
  Zap,
  Globe
} from 'lucide-react';
import { 
  FOUNDER_PROFILE, 
  FOUNDER_EDUCATION, 
  TECHNICAL_SKILLS_MATRIX, 
  DESKTOP_SYSTEMS_SKILLS, 
  DIGITAL_SOLUTIONS_SKILLS, 
  PROFESSIONAL_SOFT_SKILLS, 
  FLAGSHIP_PROJECTS_DATA, 
  OPEN_JOB_OPPORTUNITIES 
} from '../data/founderSkillsData';

interface FounderSkillsSectionProps {
  onContactFounder?: () => void;
}

export const FounderSkillsSection: React.FC<FounderSkillsSectionProps> = ({
  onContactFounder,
}) => {
  const [activeTab, setActiveTab] = useState<'skills' | 'projects' | 'education' | 'opportunities'>('skills');
  const [skillCategory, setSkillCategory] = useState<'all' | 'dev' | 'desktop' | 'digital' | 'soft'>('all');

  return (
    <section className="py-20 bg-slate-950 text-white relative overflow-hidden border-t border-b border-slate-800">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-400 text-xs font-bold uppercase tracking-wider shadow-inner">
            <Award className="w-3.5 h-3.5" />
            <span>Direction Technique &amp; Compétences d'Ingénierie</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Expertise Technique &amp;{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300 bg-clip-text text-transparent">
              Profil du Fondateur
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Découvrez le savoir-faire technologique, le cursus académique en génie logiciel et les réalisations logicielles qui animent <strong className="text-white">V&amp;I TECH AFRICA LTD</strong>.
          </p>
        </div>

        {/* Founder Highlights Banner */}
        <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/50 border border-slate-800 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* Left: Info */}
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-bold font-mono">
                  {FOUNDER_PROFILE.role}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700/60 text-xs font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {FOUNDER_PROFILE.availability}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                  ULK Gisenyi Campus
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white">
                Direction Technique &amp; Développement de Solutions Numériques
              </h3>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Spécialiste du développement applicatif (C# / .NET / WPF, Web Fullstack, PHP, Python, APIs) et de l'intégration de paiements panafricains (MTN MoMo, Airtel Money). Étudiant en Licence d'Ingénierie Logicielle à l'Université de Kigali (ULK).
              </p>

              {/* Direct Action Contacts */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
                <a
                  href={`https://wa.me/${FOUNDER_PROFILE.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Direct ({FOUNDER_PROFILE.whatsapp})</span>
                </a>
                <a
                  href={`tel:${FOUNDER_PROFILE.phone.replace(/[^0-9+]/g, '')}`}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span>{FOUNDER_PROFILE.phone}</span>
                </a>
                <a
                  href={`mailto:${FOUNDER_PROFILE.email}`}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{FOUNDER_PROFILE.email}</span>
                </a>
              </div>
            </div>

            {/* Right: Key Stats Card */}
            <div className="grid grid-cols-2 gap-3 w-full lg:w-auto shrink-0">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                <div className="text-2xl sm:text-3xl font-black text-blue-400">10+</div>
                <div className="text-[11px] text-slate-400 font-medium">Technologies Maîtrisées</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">90%</div>
                <div className="text-[11px] text-slate-400 font-medium">Expertise HTML/CSS &amp; PHP</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                <div className="text-2xl sm:text-3xl font-black text-cyan-400">WPF/.NET</div>
                <div className="text-[11px] text-slate-400 font-medium">Desktop &amp; SQLite</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                <div className="text-2xl sm:text-3xl font-black text-indigo-400">MoMo</div>
                <div className="text-[11px] text-slate-400 font-medium">MTN &amp; Airtel Money</div>
              </div>
            </div>

          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'skills'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Compétences Principales &amp; Technologies</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'projects'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Projets Phares (V&amp;I Manager, Vitech Africa...)</span>
          </button>

          <button
            onClick={() => setActiveTab('education')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'education'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Formation &amp; Diplôme ULK</span>
          </button>

          <button
            onClick={() => setActiveTab('opportunities')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'opportunities'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Postes Recherchés &amp; Recrutement</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: TECHNICAL SKILLS */}
        {/* ========================================================================= */}
        {activeTab === 'skills' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Category Filter */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'Toutes les compétences' },
                { id: 'dev', label: '💻 Informatique & Code' },
                { id: 'desktop', label: '🖥️ Applications Desktop' },
                { id: 'digital', label: '📱 Solutions Numériques' },
                { id: 'soft', label: '📊 Compétences Pro & Soft Skills' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSkillCategory(cat.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    skillCategory === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Matrix Display */}
            {(skillCategory === 'all' || skillCategory === 'dev') && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-blue-400" />
                  <span>💻 Informatique &amp; Développement</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {TECHNICAL_SKILLS_MATRIX.map((skill, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-white text-sm">{skill.name}</span>
                        <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
                          {skill.level}
                        </span>
                      </div>

                      {skill.percentage && (
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${skill.percentage}%` }}
                          />
                        </div>
                      )}

                      <p className="text-[11px] text-slate-400">{skill.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Desktop Systems */}
            {(skillCategory === 'all' || skillCategory === 'desktop') && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-indigo-400" />
                  <span>🖥️ Applications &amp; Systèmes Desktop</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {DESKTOP_SYSTEMS_SKILLS.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Digital Solutions */}
            {(skillCategory === 'all' || skillCategory === 'digital') && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  <span>📱 Solutions Numériques &amp; Passerelles Mobile Money</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {DIGITAL_SOLUTIONS_SKILLS.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-3 text-xs text-slate-200">
                      <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Professional Soft Skills */}
            {(skillCategory === 'all' || skillCategory === 'soft') && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span>📊 Compétences Professionnelles &amp; Organisation</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  {PROFESSIONAL_SOFT_SKILLS.map((skill, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-300 font-medium">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: FLAGSHIP PROJECTS */}
        {/* ========================================================================= */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
            {FLAGSHIP_PROJECTS_DATA.map((proj) => (
              <div
                key={proj.id}
                className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition-all flex flex-col justify-between space-y-6 shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-blue-950 text-blue-400 border border-blue-800 text-xs font-mono font-bold">
                      {proj.badge}
                    </span>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold"
                      >
                        <span>Visiter</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white">{proj.title}</h3>
                    <p className="text-xs text-blue-400 font-medium mt-0.5">{proj.subtitle}</p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>

                  {/* Features List */}
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Fonctionnalités Clés :
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {proj.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-1.5">
                  {proj.techStack.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 text-[11px] font-mono font-bold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: EDUCATION & UNIVERSITY */}
        {/* ========================================================================= */}
        {activeTab === 'education' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
            
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-black text-2xl shrink-0">
                    ULK
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">{FOUNDER_EDUCATION.degree}</h3>
                    <p className="text-sm font-semibold text-blue-400">{FOUNDER_EDUCATION.institution}</p>
                    <p className="text-xs text-slate-400">{FOUNDER_EDUCATION.campus} • {FOUNDER_EDUCATION.location}</p>
                  </div>
                </div>

                <div className="px-4 py-1.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold font-mono">
                  {FOUNDER_EDUCATION.level}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Disciplines &amp; Domaines d'Excellence Étudiés :
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {FOUNDER_EDUCATION.coreDisciplines.map((disc, dIdx) => (
                    <div key={dIdx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-2.5 text-xs text-slate-200">
                      <GraduationCap className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>{disc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Responsibilities in Enterprise */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Responsabilités en Entreprise &amp; Direction de Projets :
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {FOUNDER_PROFILE.responsibilities.map((resp, rIdx) => (
                    <div key={rIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: RECRUITMENT & JOB OPPORTUNITIES */}
        {/* ========================================================================= */}
        {activeTab === 'opportunities' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            <div className="p-6 rounded-3xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 uppercase">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Statut : {FOUNDER_PROFILE.availability}
                </div>
                <h3 className="text-lg font-black text-white">
                  Ouvert aux Collaborations, Recrutements &amp; Missions Techniques
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl">
                  Prêt à rejoindre votre équipe en tant que développeur, support informatique, administrateur système ou responsable de projets digitaux.
                </p>
              </div>

              <a
                href={`https://wa.me/${FOUNDER_PROFILE.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition-all shrink-0 cursor-pointer"
              >
                Contacter Immédiatement
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {OPEN_JOB_OPPORTUNITIES.map((opp, oIdx) => (
                <div key={oIdx} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-400" />
                    <span>{opp.category}</span>
                  </h4>

                  <ul className="space-y-2 text-xs text-slate-300">
                    {opp.roles.map((r, rIdx) => (
                      <li key={rIdx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800/60">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="font-medium text-slate-200">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
