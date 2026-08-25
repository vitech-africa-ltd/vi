import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  ShieldCheck, 
  FileText, 
  Clock, 
  Sparkles, 
  X, 
  ExternalLink, 
  AlertCircle, 
  Trash2,
  Lock,
  PenTool,
  TrendingUp,
  History
} from 'lucide-react';
import { ClientNotification, NotificationType } from '../types';
import { 
  subscribeToClientNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from '../services/notificationService';

interface NotificationCenterProps {
  onNavigateTab?: (tabId: string) => void;
  onOpenDocPreview?: (docId: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  onNavigateTab,
  onOpenDocPreview
}) => {
  const [notifications, setNotifications] = useState<ClientNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toastNotif, setToastNotif] = useState<ClientNotification | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = subscribeToClientNotifications('proj-afripay-001', (items) => {
      setNotifications(items);
    });

    // Listen to real-time browser toast event
    const handleNewNotif = (e: any) => {
      if (e.detail) {
        setToastNotif(e.detail);
        setTimeout(() => {
          setToastNotif((prev) => (prev?.id === e.detail.id ? null : prev));
        }, 6000);
      }
    };

    window.addEventListener('vitech_new_notification', handleNewNotif);

    // Close dropdown on outside click
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      if (typeof unsub === 'function') unsub();
      window.removeEventListener('vitech_new_notification', handleNewNotif);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadCount = safeNotifications.filter(n => n && !n.read).length;

  const handleNotificationClick = (notif: ClientNotification) => {
    markNotificationAsRead(notif.id);

    if (notif.docId && onOpenDocPreview) {
      onOpenDocPreview(notif.docId);
      setIsOpen(false);
    } else if (notif.type === 'audit_completed' && onNavigateTab) {
      onNavigateTab('audit-trail');
      setIsOpen(false);
    } else if (notif.type === 'milestone_validated' && onNavigateTab) {
      onNavigateTab('milestones');
      setIsOpen(false);
    }
  };

  const getNotifIcon = (type: NotificationType) => {
    switch (type) {
      case 'document_uploaded':
        return <FileText className="w-4 h-4 text-cyan-400" />;
      case 'document_signed':
        return <PenTool className="w-4 h-4 text-emerald-400" />;
      case 'milestone_validated':
        return <TrendingUp className="w-4 h-4 text-blue-400" />;
      case 'audit_completed':
        return <ShieldCheck className="w-4 h-4 text-purple-400" />;
      case 'security_alert':
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
        title="Notifications en temps réel"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-cyan-500 text-slate-950 font-mono text-[10px] font-black flex items-center justify-center shadow-lg shadow-cyan-500/50 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Floating Toast Alert Banner */}
      {toastNotif && (
        <div className="fixed top-20 right-4 z-50 max-w-sm w-full bg-slate-900 border-2 border-cyan-500/80 rounded-2xl shadow-2xl p-4 animate-slide-in space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400">
                {getNotifIcon(toastNotif.type)}
              </span>
              <h5 className="text-xs font-bold text-white">{toastNotif.title}</h5>
            </div>
            <button
              onClick={() => setToastNotif(null)}
              className="text-slate-400 hover:text-white cursor-pointer p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {toastNotif.message}
          </p>
          <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px]">
            <span className="text-slate-400 font-mono">À l'instant</span>
            <button
              onClick={() => {
                handleNotificationClick(toastNotif);
                setToastNotif(null);
              }}
              className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Consulter</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 overflow-hidden animate-fade-in flex flex-col max-h-[500px]">
          {/* Header */}
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-cyan-500/15 text-cyan-400">
                <Bell className="w-3.5 h-3.5" />
              </span>
              <h4 className="text-xs font-bold text-white">Centre de Notifications</h4>
              {unreadCount > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-[10px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 cursor-pointer transition-colors"
                title="Tout marquer comme lu"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Tout lire</span>
              </button>
            )}
          </div>

          {/* List of Notifications */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Bell className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">Aucune notification pour le moment.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3 rounded-xl transition-all cursor-pointer space-y-1.5 ${
                    !notif.read
                      ? 'bg-cyan-950/20 hover:bg-cyan-950/40 border-l-2 border-l-cyan-500'
                      : 'hover:bg-slate-800/50 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-md bg-slate-950 border border-slate-800 shrink-0">
                        {getNotifIcon(notif.type)}
                      </span>
                      <h5 className={`text-xs font-bold ${!notif.read ? 'text-white' : 'text-slate-300'}`}>
                        {notif.title}
                      </h5>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono shrink-0 whitespace-nowrap">
                      {notif.timestamp}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    {notif.actorName && (
                      <span className="text-cyan-400/80 font-medium truncate max-w-[200px]">
                        Par : {notif.actorName}
                      </span>
                    )}
                    {notif.docRef && (
                      <span className="font-mono text-slate-400 bg-slate-950 px-1 py-0.5 rounded text-[9px] ml-auto">
                        {notif.docRef}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Quick Links */}
          <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <button
              onClick={() => {
                if (onNavigateTab) onNavigateTab('audit-trail');
                setIsOpen(false);
              }}
              className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <History className="w-3 h-3" />
              <span>Voir le Journal d'Audit</span>
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-slate-300 cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
