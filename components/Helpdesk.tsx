
import React, { useState } from 'react';
import { SupportTicket, User } from '../types';
import { LifeBuoy, Plus, MessageSquare, CheckCircle, X, Search } from './Icons';

interface HelpdeskProps {
  schoolId: string;
  tickets: SupportTicket[];
  currentUser: User;
  onAddTicket: (ticket: SupportTicket) => void;
  onUpdateTicket?: (ticket: SupportTicket) => void;
}

const Helpdesk: React.FC<HelpdeskProps> = ({ schoolId, tickets, currentUser, onAddTicket, onUpdateTicket }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [newTicket, setNewTicket] = useState<Partial<SupportTicket>>({ category: 'General' });
  const [replyText, setReplyText] = useState('');

  // Admins see all, Users see their own
  const userTickets = currentUser.role === 'Admin' 
    ? tickets 
    : tickets.filter(t => t.userId === currentUser.id);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTicket.subject && newTicket.category) {
      // Fix: Added missing schoolId property
      onAddTicket({
        id: `TKT-${Math.floor(Math.random() * 10000)}`,
        schoolId: schoolId,
        userId: currentUser.id,
        subject: newTicket.subject,
        category: newTicket.category as any,
        status: 'Open',
        dateRaised: new Date().toISOString().split('T')[0],
        lastUpdate: new Date().toISOString().split('T')[0],
        messages: newTicket.messages ? [{ ...newTicket.messages[0], date: new Date().toLocaleString() }] : []
      });
      setShowAddModal(false);
      setNewTicket({ category: 'General' });
    }
  };

  const handleReply = () => {
    if (activeTicket && replyText && onUpdateTicket) {
      const updatedTicket = {
        ...activeTicket,
        lastUpdate: new Date().toISOString().split('T')[0],
        messages: [
          ...activeTicket.messages,
          { sender: currentUser.role, text: replyText, date: new Date().toLocaleString() }
        ]
      };
      onUpdateTicket(updatedTicket);
      setActiveTicket(updatedTicket);
      setReplyText('');
    }
  };

  const handleStatusChange = (status: 'Open' | 'In Progress' | 'Resolved') => {
      if(activeTicket && onUpdateTicket) {
          const updated = { ...activeTicket, status: status };
          onUpdateTicket(updated);
          setActiveTicket(updated);
      }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <LifeBuoy className="w-6 h-6 text-indigo-600" /> Parent Support Helpdesk
          </h2>
          <p className="text-slate-500 text-sm">Raise queries regarding fees, transport, or academics.</p>
        </div>
        
        {currentUser.role === 'Parent' && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> New Ticket
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ticket List */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                  <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Your Tickets</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {userTickets.map(ticket => (
                      <div 
                        key={ticket.id}
                        onClick={() => setActiveTicket(ticket)}
                        className={`p-4 rounded-lg cursor-pointer border transition-all ${
                            activeTicket?.id === ticket.id 
                            ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200' 
                            : 'bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                          <div className="flex justify-between items-start mb-1">
                              <span className="text-xs font-bold text-indigo-600">{ticket.id}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                  ticket.status === 'Open' ? 'bg-red-100 text-red-700' :
                                  ticket.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                  'bg-yellow-100 text-yellow-700'
                              }`}>{ticket.status}</span>
                          </div>
                          <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{ticket.subject}</h4>
                          <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                              <span>{ticket.category}</span>
                              <span>{ticket.dateRaised}</span>
                          </div>
                      </div>
                  ))}
                  {userTickets.length === 0 && (
                      <div className="p-8 text-center text-slate-400 text-sm">No tickets found.</div>
                  )}
              </div>
          </div>

          {/* Chat / Detail View */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[600px]">
              {activeTicket ? (
                  <>
                    <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-bold text-slate-800">{activeTicket.subject}</h3>
                                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded font-medium">{activeTicket.category}</span>
                            </div>
                            <p className="text-xs text-slate-400">Raised by {activeTicket.userId === currentUser.id ? 'You' : activeTicket.userId} on {activeTicket.dateRaised}</p>
                        </div>
                        {currentUser.role === 'Admin' && (
                            <div className="flex gap-2">
                                <button onClick={() => handleStatusChange('In Progress')} className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded font-bold hover:bg-yellow-200">In Progress</button>
                                <button onClick={() => handleStatusChange('Resolved')} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded font-bold hover:bg-green-200">Resolve</button>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                        {activeTicket.messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === currentUser.role ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-4 rounded-xl shadow-sm ${
                                    msg.sender === currentUser.role 
                                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                                    : 'bg-white border border-slate-200 rounded-tl-none'
                                }`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <p className={`text-[10px] mt-2 text-right ${msg.sender === currentUser.role ? 'text-indigo-200' : 'text-slate-400'}`}>
                                        {msg.sender} • {msg.date}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-slate-100 bg-white rounded-b-xl">
                        {activeTicket.status === 'Resolved' ? (
                            <div className="text-center p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100">
                                This ticket has been marked as Resolved.
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    className="flex-1 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Type your reply..."
                                    value={replyText}
                                    onChange={e => setReplyText(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && handleReply()}
                                />
                                <button 
                                    onClick={handleReply}
                                    disabled={!replyText}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                                >
                                    Reply
                                </button>
                            </div>
                        )}
                    </div>
                  </>
              ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                      <LifeBuoy className="w-16 h-16 mb-4 opacity-20" />
                      <p>Select a ticket to view conversation.</p>
                  </div>
              )}
          </div>
      </div>

      {/* New Ticket Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
              <div className="p-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-t-2xl flex justify-between items-center">
                 <h3 className="text-lg font-bold">New Support Request</h3>
                 <button onClick={() => setShowAddModal(false)} className="bg-white/10 p-1.5 rounded-full hover:bg-white/20"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Subject</label>
                    <input required type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="Brief summary of issue" value={newTicket.subject || ''} onChange={e => setNewTicket({...newTicket, subject: e.target.value})} />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                    <select className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white" value={newTicket.category} onChange={e => setNewTicket({...newTicket, category: e.target.value as any})}>
                        <option value="General">General Inquiry</option>
                        <option value="Transport">Transport / Bus</option>
                        <option value="Fees">Fees & Finance</option>
                        <option value="Academics">Academics / Grades</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                    <textarea 
                        required
                        className="w-full p-2 border border-slate-200 rounded-lg text-sm h-32 resize-none" 
                        placeholder="Explain your concern in detail..."
                        onChange={e => setNewTicket({
                            ...newTicket, 
                            messages: [{ sender: 'Parent', text: e.target.value, date: '' }]
                        })}
                    ></textarea>
                 </div>
                 <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-lg shadow-lg shadow-indigo-200 mt-2">Submit Ticket</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Helpdesk;
