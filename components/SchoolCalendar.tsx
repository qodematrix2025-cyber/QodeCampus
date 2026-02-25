
import React, { useState } from 'react';
import { CalendarEvent } from '../types';
import { Plus, Calendar as CalIcon, X, CheckCircle } from './Icons';

interface SchoolCalendarProps {
  schoolId: string;
  events: CalendarEvent[];
  onAddEvent?: (event: CalendarEvent) => void;
}

const SchoolCalendar: React.FC<SchoolCalendarProps> = ({ schoolId, events, onAddEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
      type: 'Event',
      date: new Date().toISOString().split('T')[0]
  });

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (newEvent.title && newEvent.date && onAddEvent) {
          // Fix: Added missing schoolId property
          onAddEvent({
              id: `E-${Date.now()}`,
              schoolId: schoolId,
              title: newEvent.title,
              date: newEvent.date,
              type: newEvent.type as any,
              description: newEvent.description || ''
          });
          setShowModal(false);
          setNewEvent({ type: 'Event', date: new Date().toISOString().split('T')[0] });
      }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">School Calendar</h2>
          <p className="text-slate-500 text-sm">Events, Holidays, and Academic Schedules</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
             <button onClick={prevMonth} className="px-3 py-1 hover:bg-slate-50 rounded text-slate-600 font-medium">‹</button>
             <span className="px-4 py-1 font-bold text-slate-800 w-32 text-center">{monthNames[month]} {year}</span>
             <button onClick={nextMonth} className="px-3 py-1 hover:bg-slate-50 rounded text-slate-600 font-medium">›</button>
           </div>
           <button 
             onClick={() => setShowModal(true)}
             className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
           >
             <Plus className="w-5 h-5" />
             <span className="hidden sm:inline">Add Event</span>
           </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-7 border-b border-slate-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, index) => (
            <div 
              key={d} 
              className={`p-3 text-center text-sm font-bold uppercase tracking-wider border-r border-slate-100 last:border-r-0 ${index === 0 ? 'text-red-500 bg-red-50' : 'text-slate-500 bg-slate-50'}`}
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 auto-rows-fr h-full bg-slate-50/50">
          {/* Empty Cells for prev month */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-slate-50/30 border-b border-r border-slate-200 min-h-[120px]" />
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const currentDayDate = new Date(year, month, day);
            const isSunday = currentDayDate.getDay() === 0;
            const dayEvents = getEventsForDay(day);
            const isToday = new Date().toDateString() === currentDayDate.toDateString();

            // Determine Background Color
            let bgClass = 'bg-white';
            if (isToday) bgClass = 'bg-indigo-50/40';
            else if (isSunday) bgClass = 'bg-red-50/30';
            
            // Highlight text if Sunday
            const numClass = isSunday ? 'text-red-500' : isToday ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-700';
            const numBg = isToday ? 'w-8 h-8 rounded-full flex items-center justify-center' : '';

            return (
              <div key={day} className={`${bgClass} border-b border-r border-slate-200 p-2 min-h-[120px] transition-colors hover:bg-slate-50 flex flex-col group`}>
                <div className="flex justify-between items-start mb-2">
                   <div className={`${numBg} ${numClass} text-sm font-bold`}>
                     {day}
                   </div>
                   {isSunday && (
                     <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest opacity-60">Holiday</span>
                   )}
                </div>
                
                <div className="space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                  {dayEvents.map(event => (
                    <div 
                      key={event.id}
                      className={`text-xs px-2 py-1 rounded-md border font-medium truncate shadow-sm ${
                        event.type === 'Holiday' ? 'bg-red-100 text-red-700 border-red-200' :
                        event.type === 'Exam' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        event.type === 'Academic' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        'bg-emerald-100 text-emerald-700 border-emerald-200'
                      }`}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
                
                {/* Add Event Hover Button */}
                <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                     onClick={() => {
                         const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                         setNewEvent({ ...newEvent, date: dateStr });
                         setShowModal(true);
                     }}
                     className="w-full text-[10px] text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 py-1 rounded"
                   >
                      + Add
                   </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
              <div className="p-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-t-2xl flex justify-between items-center">
                 <h3 className="text-lg font-bold flex items-center gap-2"><CalIcon className="w-5 h-5"/> Add Event</h3>
                 <button onClick={() => setShowModal(false)} className="bg-white/10 p-1.5 rounded-full hover:bg-white/20"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Event Title</label>
                    <input required type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={newEvent.title || ''} onChange={e => setNewEvent({...newEvent, title: e.target.value})} placeholder="e.g. Sports Day" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
                        <input required type="date" className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={newEvent.date || ''} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Type</label>
                        <select className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none" value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value as any})}>
                            <option value="Event">Event</option>
                            <option value="Holiday">Holiday</option>
                            <option value="Exam">Exam</option>
                            <option value="Academic">Academic</option>
                        </select>
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Description (Optional)</label>
                    <textarea className="w-full p-2 border border-slate-200 rounded-lg text-sm h-20 resize-none focus:ring-2 focus:ring-indigo-500 outline-none" value={newEvent.description || ''} onChange={e => setNewEvent({...newEvent, description: e.target.value})}></textarea>
                 </div>
                 <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-lg shadow-lg shadow-indigo-200 mt-2">Add to Calendar</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default SchoolCalendar;
