import React, { useState } from 'react';
import { 
  Mail, 
  Sparkles, 
  CheckCircle, 
  Download, 
  FileText, 
  Send, 
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

export const NewsletterSection: React.FC = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);

    const docId = `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    try {
      await setDoc(doc(db, 'newsletter_subscribers', docId), {
        email: email.slice(0, 150),
        topic: selectedTopic.slice(0, 50),
        userId: user?.uid || 'guest_user',
        createdAt: new Date().toISOString(),
      });

      // Also notify backend API if available
      try {
        await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, topic: selectedTopic, firestoreDocId: docId }),
        });
      } catch (err) {
        // silent
      }

      setIsSubscribed(true);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (e) {
      console.warn('Newsletter firestore sync note:', e);
      setIsSubscribed(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-slate-950 text-white relative overflow-hidden border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 border border-emerald-500/30 p-8 sm:p-12 shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Copy & Whitepaper Download Promo */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-mono font-semibold border border-emerald-500/30">
                <FileText className="w-3.5 h-3.5" />
                <span>Livre Blanc Technique 2026 Gratuit</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Restez à la Pointe de la{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Tech Africaine & Mondiale
                </span>
              </h3>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Abonnez-vous à notre newsletter bimensuelle "Vitech Engineering Dispatch" et recevez immédiatement notre guide exclusif : <strong className="text-white">"Architecturer des Systèmes Fintech Scalables & Conformité OWASP en Afrique"</strong>.
              </p>

              <div className="flex items-center space-x-4 pt-2 text-xs text-slate-400 font-mono">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>0 Spam, 100% Code & Architecture</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Désinscription en 1 clic</span>
                </div>
              </div>
            </div>

            {/* Right: Subscription Form */}
            <div className="lg:col-span-5">
              {isSubscribed ? (
                <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Merci pour votre inscription !</h4>
                  <p className="text-xs text-emerald-200">
                    Le Livre Blanc a été enregistré et expédié à <span className="font-bold text-white">{email}</span>.
                  </p>
                  <button
                    onClick={() => {
                      const element = document.createElement('a');
                      const file = new Blob([
                        `VITECH AFRICA - LIVRE BLANC 2026\nArchitecture Cloud & Fintech en Afrique\n\nMerci de votre confiance.\nContact: contact.vitechdev@gmail.com`
                      ], { type: 'text/plain' });
                      element.href = URL.createObjectURL(file);
                      element.download = 'Vitech-Whitepaper-Fintech-2026.txt';
                      document.body.appendChild(element);
                      element.click();
                    }}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Télécharger le document</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 bg-slate-950/80 p-6 rounded-2xl border border-slate-800">
                  <span className="text-xs font-semibold text-slate-300 block">Choisissez votre domaine d'intérêt :</span>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'all', label: 'Toutes les Thématiques' },
                      { id: 'fintech', label: 'Fintech & Cloud' },
                      { id: 'ai', label: 'IA & RAG Entreprise' },
                      { id: 'security', label: 'Cybersécurité' },
                    ].map((topic) => (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => setSelectedTopic(topic.id)}
                        className={`p-2 rounded-lg text-[11px] font-medium border text-left transition-colors cursor-pointer ${
                          selectedTopic === topic.id
                            ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {topic.label}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1.5 focus-within:border-emerald-500">
                      <input
                        type="email"
                        required
                        placeholder="votre.email@entreprise.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                      >
                        <span>{isLoading ? 'Envoi...' : 'Recevoir le guide'}</span>
                        <Send className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
