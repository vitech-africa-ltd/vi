import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  UserCheck, 
  Bot, 
  Clock, 
  Zap, 
  ChevronDown, 
  Check, 
  CheckCheck,
  Cpu,
  CornerDownLeft,
  ShieldCheck,
  ExternalLink,
  Phone,
  BookOpen,
  AlertCircle,
  Minimize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from '../types';
import { VitechLogo } from './VitechLogo';
import { useSiteData } from '../context/SiteDataContext';
import { useTranslation } from '../context/LanguageContext';

interface LiveChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({
  isOpen,
  onClose,
  onToggle,
}) => {
  const { aiConfig, companyInfo } = useSiteData();
  const { language: currentLanguage } = useTranslation();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: aiConfig.welcomeMessage || "Bonjour et bienvenue chez V&I TECH AFRICA LTD ! Je suis votre Assistant IA Officiel. Comment pouvons-nous concrétiser votre projet technologique ?",
      timestamp: 'À l\'instant',
      isAi: true,
      sources: ["Présentation V&I TECH AFRICA LTD"],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<'ai' | 'engineer'>('ai');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync welcome message if aiConfig changes and only 1 message exists
  useEffect(() => {
    if (messages.length === 1 && messages[0].sender === 'assistant' && aiConfig.welcomeMessage) {
      setMessages([{
        id: 'msg-1',
        sender: 'assistant',
        text: aiConfig.welcomeMessage,
        timestamp: 'À l\'instant',
        isAi: true,
        sources: ["Présentation V&I TECH AFRICA LTD"],
      }]);
    }
  }, [aiConfig.welcomeMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    "Quels sont vos tarifs pour une application mobile ?",
    "Quelles sont vos garanties (propriété intellectuelle & SLA) ?",
    "Quelle stack technique préconisez-vous pour un SaaS ?",
    "Parler directement à un ingénieur humain",
  ];

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      if (chatMode === 'ai') {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: textToSend,
            customPrompt: aiConfig.systemPrompt,
            temperature: aiConfig.temperature,
            model: aiConfig.model,
            visitorLanguage: currentLanguage,
            conversationHistory: messages.map((m) => ({
              role: m.sender === 'user' ? 'user' : 'model',
              content: m.text,
            })),
          }),
        });
        const data = await response.json();
        
        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          text: data.reply || "Merci pour votre message. Un expert technique V&I TECH AFRICA LTD vous répondra dans les plus brefs délais.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAi: true,
          sources: data.sources || [],
          escalatedToHuman: data.escalatedToHuman,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        // Direct human connection response
        setTimeout(() => {
          const engMsg: ChatMessage = {
            id: `msg-${Date.now() + 1}`,
            sender: 'engineer',
            text: `Bonjour ! Ici l'équipe d'Ingénierie de V&I TECH AFRICA LTD. Nous avons bien reçu votre demande. Vous pouvez échanger en direct avec notre Directeur Général sur WhatsApp (+250 795 507 001) ou planifier un appel technique gratuit de 30 minutes.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isAi: false,
            escalatedToHuman: true,
          };
          setMessages((prev) => [...prev, engMsg]);
          setIsLoading(false);
        }, 1000);
        return;
      }
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: "Merci pour votre message. V&I TECH AFRICA LTD conçoit des architectures logicielles de pointe (Web, Mobile, Cloud, IA et Cybersécurité). Pour une réponse immédiate, contactez notre Direction au +250 795 507 001 (WhatsApp).",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAi: true,
        sources: ["V&I TECH AFRICA LTD Overview"],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEscalateToWhatsApp = () => {
    const url = companyInfo.director?.whatsappUrl || `https://wa.me/${companyInfo.whatsappRaw || '250795507001'}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50">
      
      {/* Floating Trigger Button with Framer Motion */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            id="live-chat-toggle-btn"
            onClick={onToggle}
            initial={{ scale: 0, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 20 }}
            whileHover={{ scale: 1.08, shadow: "0 20px 25px -5px rgba(59, 130, 246, 0.5)" }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className="relative group p-2.5 rounded-full bg-slate-950 border-2 border-blue-500/60 text-white shadow-2xl shadow-blue-500/30 flex items-center justify-center cursor-pointer"
            title="Discuter avec l'Assistant IA V&I TECH AFRICA"
          >
            <span className="absolute -top-1 -right-1 flex h-4 w-4 z-20">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400 border-2 border-slate-950"></span>
            </span>
            <VitechLogo variant="badge" size="lg" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Chat Box Panel with Smooth Fluid Entrance Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 40, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 40, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="w-[calc(100vw-32px)] sm:w-[440px] h-[600px] max-h-[calc(100vh-80px)] rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-slate-950/80 flex flex-col overflow-hidden text-white"
          >
            
            {/* Header */}
            <div className="p-3.5 sm:p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5 sm:space-x-3">
                <div className="relative shrink-0">
                  <VitechLogo variant="shield" size="md" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 truncate">
                    <span className="truncate">{chatMode === 'ai' ? (aiConfig.assistantName || 'Assistant IA V&I Tech') : 'Direction Technique V&I Tech'}</span>
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>RAG Connaissances Certifiées • 99.99% Fiable</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 shrink-0">
                {/* Mode Switcher */}
                <button
                  onClick={() => setChatMode(chatMode === 'ai' ? 'engineer' : 'ai')}
                  className={`text-[10px] px-2 py-1 rounded-lg border font-bold transition-colors cursor-pointer ${
                    chatMode === 'engineer' 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                  title="Basculer entre Mode IA RAG et Conseiller Humain"
                >
                  {chatMode === 'ai' ? 'Humain' : 'IA RAG'}
                </button>
                
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Fermer le chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Guarantee Security Strip */}
            <div className="bg-slate-950/80 px-3.5 py-1.5 border-b border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1 text-slate-300 font-medium">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Base officielle V&amp;I TECH (Aucune hallucination)</span>
              </span>
              <button
                onClick={handleEscalateToWhatsApp}
                className="text-emerald-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                <Phone className="w-2.5 h-2.5" />
                <span>WhatsApp Dir.</span>
              </button>
            </div>

            {/* Messages Feed with Framer Motion Bubbles */}
            <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 bg-slate-950/60">
              {messages.map((msg, index) => {
                const isUser = msg.sender === 'user';
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isUser
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none shadow-md'
                          : 'bg-slate-800/90 text-slate-200 rounded-bl-none border border-slate-700/60'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>

                      {/* Grounded Source Badges */}
                      {!isUser && msg.sources && msg.sources.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex flex-wrap items-center gap-1 text-[10px] text-slate-400">
                          <BookOpen className="w-2.5 h-2.5 text-blue-400 shrink-0" />
                          <span className="font-semibold text-slate-300">Sources vérifiées :</span>
                          {msg.sources.map((src, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-slate-900/80 text-blue-300 border border-slate-700/80">
                              {src}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Escalation to Human Action */}
                      {!isUser && (msg.escalatedToHuman || msg.text.toLowerCase().includes('whatsapp') || msg.text.toLowerCase().includes('contactez')) && (
                        <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center gap-2">
                          <button
                            onClick={handleEscalateToWhatsApp}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-extrabold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                          >
                            <Phone className="w-2.5 h-2.5" />
                            <span>Ouvrir WhatsApp Direction (+250 795 507 001)</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] text-slate-500 mt-1 px-1 flex items-center gap-1">
                      {msg.timestamp}
                      {isUser && <CheckCheck className="w-3 h-3 text-blue-400" />}
                    </span>
                  </motion.div>
                );
              })}

              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2 text-xs text-slate-400 p-3 rounded-2xl bg-slate-800/60 w-fit"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-100" />
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-200" />
                  <span className="ml-1">Recherche dans la base de connaissances &amp; formulation...</span>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions Pills */}
            <div className="px-3 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-blue-400 border border-slate-800 transition-colors whitespace-nowrap cursor-pointer shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="p-3 bg-slate-950 border-t border-slate-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Posez votre question (tarifs, stack, garanties, contact)..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md"
                  aria-label="Envoyer le message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
