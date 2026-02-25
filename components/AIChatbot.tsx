
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { User, School } from '../types';
import { Bot, Send, X, MessageSquare } from './Icons';
import { GoogleGenAI } from "@google/genai";

interface AIChatbotProps {
  user: User;
  school?: School;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({ user, school }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([
    { role: 'ai', text: `Greetings, ${user.name.split(' ')[0]}. I am the QodeMatrix Intelligence Core. How can I assist with ${school?.name || 'your institutional'} tasks today?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are the helpful AI assistant for QodeCampus School ERP. 
        Context: The user is a ${user.role} named ${user.name} at ${school?.name || 'an institution'}. 
        Constraint: Keep your response professional, precise, and max 2 sentences. 
        User Query: ${userMsg}`,
      });
      setMessages(prev => [...prev, { role: 'ai', text: response.text || "I'm experiencing a brief synchronization lag. Please try again." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Telemetry offline. Core intelligence services are currently re-calibrating." }]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, user, school]);

  return (
    <div className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-[1000] flex flex-col items-end">
      {isOpen && (
        <div className="w-[calc(100vw-48px)] sm:w-[380px] h-[580px] bg-white rounded-5xl shadow-2xl border border-slate-100 flex flex-col mb-6 overflow-hidden animate-in origin-bottom-right duration-500 ease-out">
          <div className="p-8 bg-slate-900 text-white flex justify-between items-center relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
            <div className="flex items-center gap-4 relative z-10">
               <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 floating-ui">
                  <Bot className="w-7 h-7" />
               </div>
               <div>
                  <p className="text-sm font-black tracking-tight leading-none mb-1.5">Matrix Core</p>
                  <p className="text-[9px] text-indigo-400 font-black uppercase tracking-[0.2em] opacity-80">Sync: {school?.id || 'GLOBAL'}</p>
               </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all active-scale relative z-10"><X className="w-5 h-5" /></button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-slate-50/30">
             {messages.map((m, i) => (
               <div key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'} animate-reveal`}>
                  <div className={`max-w-[85%] p-5 rounded-[2rem] text-xs font-medium leading-relaxed shadow-sm ${
                    m.role === 'ai' ? 'bg-white border border-slate-100 rounded-tl-none text-slate-700' : 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-100'
                  }`}>
                    {m.text}
                  </div>
               </div>
             ))}
             {isTyping && (
               <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 p-4 rounded-3xl flex gap-1.5 items-center">
                     <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                     <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                     <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                  </div>
               </div>
             )}
          </div>

          <div className="p-6 bg-white border-t border-slate-50 flex gap-3 shrink-0">
             <input 
               type="text" 
               className="flex-1 px-6 py-4 bg-slate-50 rounded-2xl border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-xs shadow-inner-soft transition-all"
               placeholder="Query core intelligence..."
               value={input}
               onChange={e => setInput(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && handleSend()}
             />
             <button 
              onClick={handleSend} 
              disabled={isTyping || !input.trim()}
              className="p-4 bg-slate-950 text-white rounded-2xl hover:bg-indigo-600 transition-all active-scale shadow-lg disabled:opacity-50"
             >
               <Send className="w-5 h-5" />
             </button>
          </div>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-18 h-18 bg-slate-900 text-white rounded-3xl flex items-center justify-center shadow-2xl hover:bg-indigo-600 transition-all active-scale group ${isOpen ? 'rotate-90' : ''}`}
        style={{ width: '4.5rem', height: '4.5rem' }}
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageSquare className="w-8 h-8 group-hover:scale-110 transition-transform" />}
      </button>
    </div>
  );
};
