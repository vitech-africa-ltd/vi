import React, { useState } from 'react';
import { 
  FileCode, 
  Download, 
  Copy, 
  Check, 
  Layers, 
  Database, 
  Server, 
  ShieldCheck, 
  BookOpen, 
  Terminal, 
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Code2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { COMPLETE_DELIVERABLES, DeliverableFile } from '../../data/deliverablesData';

interface ScriptsArchitectureDeliverablesProps {
  onBackToMarketplace: () => void;
}

export const ScriptsArchitectureDeliverables: React.FC<ScriptsArchitectureDeliverablesProps> = ({
  onBackToMarketplace
}) => {
  const [selectedFile, setSelectedFile] = useState<DeliverableFile>(COMPLETE_DELIVERABLES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = (file: DeliverableFile) => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleDownloadAllPackage = () => {
    COMPLETE_DELIVERABLES.forEach((f, idx) => {
      setTimeout(() => {
        handleDownloadFile(f);
      }, idx * 250);
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <button
              onClick={onBackToMarketplace}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono mb-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour à la Marketplace</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-indigo-400" />
              <span>Package de Livrables &amp; Code Source Vitech Scripts</span>
            </h1>
            <p className="text-xs text-slate-400">
              Architecture MVC PHP 8.4, Schéma MySQL 8, Spécification API REST, Guides d'installation et Sécurité OWASP.
            </p>
          </div>

          <button
            onClick={handleDownloadAllPackage}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow cursor-pointer active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger Tout le Package (ZIP/Docs)</span>
          </button>
        </div>

        {/* Deliverables Explorer Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* File Selector Sidebar (Left) */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold block px-1">
              Fichiers &amp; Spécifications
            </span>

            <div className="space-y-1.5">
              {COMPLETE_DELIVERABLES.map((file) => {
                const isSelected = selectedFile.id === file.id;
                return (
                  <button
                    key={file.id}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${isSelected ? 'bg-indigo-950 text-indigo-400' : 'bg-slate-900 text-slate-500'}`}>
                      {file.category === 'database' ? <Database className="w-4 h-4" /> :
                       file.category === 'backend-php' ? <Server className="w-4 h-4" /> :
                       file.category === 'security' ? <ShieldCheck className="w-4 h-4" /> :
                       <FileCode className="w-4 h-4" />}
                    </div>

                    <div className="space-y-0.5 overflow-hidden">
                      <span className="text-xs font-bold block truncate text-slate-100">{file.name}</span>
                      <span className="text-[10px] font-mono text-slate-500 block truncate">{file.filename}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code & Document Viewer (Right) */}
          <div className="lg:col-span-8 rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col shadow-2xl">
            
            {/* Viewer Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold block">{selectedFile.filename}</span>
                <h3 className="text-sm font-bold text-white">{selectedFile.title}</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copié !' : 'Copier'}</span>
                </button>

                <button
                  onClick={() => handleDownloadFile(selectedFile)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger</span>
                </button>
              </div>
            </div>

            {/* Viewer Body */}
            <div className="p-5 flex-1 overflow-x-auto bg-slate-950">
              <pre className="text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
                <code>{selectedFile.content}</code>
              </pre>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
