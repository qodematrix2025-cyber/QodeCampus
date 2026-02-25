
import React from 'react';
import { AppNotification } from '../types';
import { BellIcon, X, Bot, Activity, CheckCircle } from './Icons';

interface NotificationCenterProps {
  notifications: AppNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  notifications, 
  isOpen, 
  onClose, 
  onMarkAsRead, 
  onMarkAllRead 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] pointer-events-none">
      <div 
        className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm pointer-events-auto" 
        onClick={onClose}
      ></div>
      
      <aside className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-ultra pointer-events-auto animate-in slide-in-from-right duration-500 border-l border-slate-100 flex flex-col">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Command Feed</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Institutional Intelligence Relay</p>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-rose-500 transition-all shadow-sm group"
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
          <div className="flex justify-between items-center mb-6 px-2">
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
              {notifications.filter(n => !n.isRead).length} Unread Updates
            </span>
            <button 
              onClick={onMarkAllRead}
              className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors"
            >
              Flush Registry
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-20 text-center opacity-30">
              <BellIcon className="w-16 h-16 mb-6 text-slate-300" />
              <p className="font-black uppercase tracking-[0.3em] text-xs">Registry Clear</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div 
                key={notif.id}
                onClick={() => onMarkAsRead(notif.id)}
                className={`relative p-6 rounded-[2.5rem] border transition-all cursor-pointer group hover:scale-[1.02] ${
                  notif.isRead 
                  ? 'bg-white border-slate-50 opacity-60' 
                  : 'bg-white border-indigo-100 shadow-premium ring-1 ring-indigo-50'
                }`}
              >
                {!notif.isRead && (
                  <div className="absolute top-6 right-6 w-2 h-2 bg-indigo-500 rounded-full shadow-glow-indigo animate-pulse"></div>
                )}
                
                <div className="flex gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                    notif.type === 'Insight' ? 'bg-indigo-50 text-indigo-500' :
                    notif.type === 'Alert' ? 'bg-rose-50 text-rose-500' :
                    'bg-emerald-50 text-emerald-500'
                  }`}>
                    {notif.type === 'Insight' ? <Bot className="w-8 h-8" /> :
                     notif.type === 'Alert' ? <Activity className="w-8 h-8" /> :
                     <CheckCircle className="w-8 h-8" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-black uppercase tracking-widest ${
                        notif.type === 'Insight' ? 'text-indigo-400' :
                        notif.type === 'Alert' ? 'text-rose-400' :
                        'text-emerald-400'
                      }`}>
                        {notif.type} • {notif.timestamp}
                      </span>
                    </div>
                    <h4 className="font-black text-slate-800 text-base leading-tight mb-2 tracking-tight group-hover:text-indigo-600 transition-colors">
                      {notif.title}
                    </h4>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100">
          <button 
            onClick={onClose}
            className="w-full py-5 bg-slate-950 text-white rounded-3xl font-black uppercase tracking-[0.4em] text-[10px] shadow-ultra hover:bg-indigo-600 transition-all active-scale btn-vibrant"
          >
            Close Feed
          </button>
        </div>
      </aside>
    </div>
  );
};
