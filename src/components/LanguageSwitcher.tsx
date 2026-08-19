import React, { useState, useRef, useEffect } from 'react';
import { useTranslation, LanguageCode } from '../context/LanguageContext';
import { Globe, ChevronDown, Check, Sparkles } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'header' | 'footer' | 'mobile';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'header',
  className = '',
}) => {
  const { language, setLanguage, languages, currentLanguageOption, isAutoDetected } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  if (variant === 'footer') {
    return (
      <div className={`relative inline-block ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
        >
          <span className="text-base leading-none">{currentLanguageOption.flag}</span>
          <span>{currentLanguageOption.name}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in">
            <div className="px-2.5 py-1 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800 mb-1 flex items-center justify-between">
              <span>Langue / Language</span>
              {isAutoDetected && (
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <Sparkles className="w-2.5 h-2.5" /> Auto
                </span>
              )}
            </div>
            <div className="space-y-0.5 max-h-56 overflow-y-auto">
              {languages.map((lang) => {
                const isSelected = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/30 text-blue-300 font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base leading-none">{lang.flag}</span>
                      <div>
                        <div className="leading-tight">{lang.name}</div>
                        <div className="text-[10px] text-slate-400">{lang.region}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'mobile') {
    return (
      <div className={`p-3 rounded-2xl bg-slate-100 border border-slate-200 ${className}`}>
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
          <div className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>Langue du Site (Auto-détectée)</span>
          </div>
          {isAutoDetected && (
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
              Auto
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {languages.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.code.toUpperCase()}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Default: Header Dropdown
  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 text-xs font-bold text-slate-700 hover:text-slate-900 transition-all cursor-pointer shadow-2xs"
        title="Changer de langue / Switch Language"
      >
        <span className="text-sm leading-none">{currentLanguageOption.flag}</span>
        <span className="hidden sm:inline font-mono text-[11px] font-extrabold uppercase">
          {currentLanguageOption.code}
        </span>
        <ChevronDown className="w-3 h-3 text-slate-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-blue-600" />
              <span>Traduction Automatique</span>
            </span>
            {isAutoDetected && (
              <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[9px] font-extrabold">
                Environnement détecté
              </span>
            )}
          </div>
          <div className="space-y-0.5 max-h-60 overflow-y-auto">
            {languages.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors text-left cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 text-blue-800 font-bold border border-blue-100'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg leading-none">{lang.flag}</span>
                    <div>
                      <div className="leading-tight font-bold">{lang.name}</div>
                      <div className="text-[10px] text-slate-500">{lang.region}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
