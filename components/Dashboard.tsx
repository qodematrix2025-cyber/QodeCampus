
import React, { useState, useEffect, useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { Student, FinanceRecord, Bus, User } from '../types';
import { StudentsIcon, FinanceIcon, BusIcon, BellIcon, Bot } from './Icons';
import { generateSchoolInsights } from '../services/geminiService';

interface DashboardProps {
  students: Student[];
  finance: FinanceRecord[];
  buses: Bus[];
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ students, finance, buses, user }) => {
  const [aiBriefing, setAiBriefing] = useState<string>("Hello! Initializing institutional data stream...");
  const [isLoading, setIsLoading] = useState(true);

  const metrics = useMemo(() => {
    if (user.role === 'Parent') {
      const child = students[0];
      return { 
        m1: { l: 'Scholar Coins', v: child?.eduCoins || 0, c: 'bg-amber-500', ic: 'text-amber-600' },
        m2: { l: 'Fees Status', v: child?.feesStatus || 'Pending', c: 'bg-emerald-500', ic: 'text-emerald-600' },
        m3: { l: 'Performance', v: child?.gpa || 'A+', c: 'bg-indigo-500', ic: 'text-indigo-600' },
        m4: { l: 'Attendance', v: `${child?.attendancePct || 0}%`, c: 'bg-rose-500', ic: 'text-rose-600' },
        attendance: child?.attendancePct || 0
      };
    }
    const rev = finance.filter(f => f.type === 'Income').reduce((acc, f) => acc + f.amount, 0);
    const exp = finance.filter(f => f.type === 'Expense').reduce((acc, f) => acc + f.amount, 0);
    const att = Math.round(students.reduce((acc, s) => acc + s.attendancePct, 0) / (students.length || 1));
    
    return { 
      m1: { l: 'Total Students', v: students.length, c: 'bg-indigo-600', ic: 'text-indigo-600' },
      m2: { l: 'Net Revenue', v: `₹${((rev - exp)/1000).toFixed(1)}k`, c: 'bg-emerald-600', ic: 'text-emerald-600' },
      m3: { l: 'Active Buses', v: buses.length, c: 'bg-amber-500', ic: 'text-amber-600' },
      m4: { l: 'Avg Presence', v: `${att}%`, c: 'bg-rose-600', ic: 'text-rose-600' },
      attendance: att
    };
  }, [students, finance, user, buses]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const res = await generateSchoolInsights(students.length, metrics.attendance, 100000, 0);
      setAiBriefing(res);
      setIsLoading(false);
    };
    load();
  }, [metrics.attendance, students.length]);

  const chartData = [ { d: 'Mon', v: 80 }, { d: 'Tue', v: 85 }, { d: 'Wed', v: 82 }, { d: 'Thu', v: 90 }, { d: 'Fri', v: 88 } ];

  return (
    <div className="space-y-8 animate-reveal">
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden bg-brand-950 rounded-[3rem] p-10 lg:p-14 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="w-24 h-24 lg:w-32 lg:h-32 bg-white/10 backdrop-blur-2xl rounded-[2.5rem] flex items-center justify-center text-5xl lg:text-6xl border border-white/20 shadow-2xl animate-float">
            👋
          </div>
          <div className="text-center lg:text-left flex-1">
            <h1 className="text-4xl lg:text-6xl font-black tracking-tight mb-4">Hello, {(user && user.name) ? user.name.split(' ')[0] : (user && (user.id || user.email)) || 'Guest'}!</h1>
            <div className={`inline-flex items-start gap-4 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md transition-all duration-1000 ${isLoading ? 'opacity-40' : 'opacity-100'}`}>
              <Bot className="w-8 h-8 text-brand-500 shrink-0" />
              <p className="text-lg lg:text-xl text-slate-300 font-medium italic leading-relaxed">"{aiBriefing}"</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard data={metrics.m1} icon={StudentsIcon} />
        <StatCard data={metrics.m2} icon={FinanceIcon} />
        <StatCard data={metrics.m3} icon={BusIcon} />
        <StatCard data={metrics.m4} icon={BellIcon} />
      </div>

      {/* Modern Chart Card */}
      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-premium flex flex-col h-[450px]">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Weekly Attendance</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time presence monitoring</p>
          </div>
          <div className="px-5 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">Live Sync</div>
        </div>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#94a3b8'}} />
              <Tooltip contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="v" stroke="#6366f1" fill="url(#colorVal)" strokeWidth={4} dot={{r: 6, fill: '#6366f1', strokeWidth: 3, stroke: '#fff'}} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ data, icon: Icon }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all group cursor-default">
    <div className={`w-16 h-16 rounded-2xl bg-slate-50 ${data.ic} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner`}>
      <Icon className="w-8 h-8" />
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{data.l}</p>
    <p className="text-3xl font-black text-slate-900 tracking-tight">{data.v}</p>
  </div>
);

export default Dashboard;
