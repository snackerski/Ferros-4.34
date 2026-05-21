
import React from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, Legend 
} from 'recharts';
import { MOCK_CHART_DATA, MOCK_NOTIFICATION_LOGS } from '../services/mockData';
import { TrendingUp, Activity, Bell, CheckCircle, AlertCircle, ArrowUpRight, BarChart3, Star, Gauge, Timer, Users, Truck, Ship, DollarSign } from 'lucide-react';
import { SystemUser } from '../types';
import { useTranslation } from '../i18n';

interface DashboardProps {
  currentUser?: SystemUser | null;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser }) => {
  const { t } = useTranslation();

  const getChartLabel = (key: string) => {
    if (key === 'revenue') return t('dash.chart.revenue');
    if (key === 'pax') return t('dash.chart.pax');
    if (key === 'cargo') return t('dash.chart.cargo');
    return key;
  };

  const allKpis = [
    // Rząd 1: Główne Finanse i Wolumeny (Z poprzednich etapów)
    { label: t('dash.revenue'), value: '45 230', unit: 'PLN', icon: <DollarSign size={16}/>, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12.5%' },
    { label: t('dash.pax'), value: '1,240', unit: 'PAX', icon: <Users size={16}/>, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+3.2%' },
    { label: t('dash.cargo_units'), value: '86', unit: 'Units', icon: <Truck size={16}/>, color: 'text-amber-600', bg: 'bg-amber-50', trend: '-1.4%' },
    { label: t('dash.sailings'), value: '4', unit: 'Today', icon: <Ship size={16}/>, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: 'Planowo' },
    
    // Rząd 2: Nowe KPI Biznesowe i Analityczne
    { label: t('dash.kpi.yield'), value: '112.4', unit: 'PLN/m', icon: <TrendingUp size={16}/>, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+4.1%' },
    { label: t('dash.kpi.load_factor'), value: '78.2', unit: '%', icon: <Gauge size={16}/>, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+2.5%' },
    { label: t('dash.kpi.otp'), value: '96.4', unit: '%', icon: <Timer size={16}/>, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'STABLE' },
    { label: t('dash.kpi.loyalty_share'), value: '24', unit: '%', icon: <Star size={16}/>, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+1.4%' },
  ];

  return (
    <div className="p-3 space-y-3 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-lg font-black text-slate-800 tracking-tight">
              {t('dash.welcome')}, {currentUser?.fullName.split(' ')[0] || t('dash.user.default')}!
           </h2>
           <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{t('dash.summary')}</p>
        </div>
        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-sm">
          Live: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      </div>

      {/* COMPREHENSIVE KPI Grid - 8 Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {allKpis.map((kpi, i) => (
          <div key={i} className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-1.5">
              <div className={`p-1.5 rounded-lg ${kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform`}>
                {kpi.icon}
              </div>
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${
                kpi.trend.startsWith('+') ? 'text-green-600 bg-green-50 border-green-100' : 
                kpi.trend.startsWith('-') ? 'text-red-600 bg-red-50 border-red-100' : 
                'text-slate-500 bg-slate-50 border-slate-100'
              }`}>
                {kpi.trend}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight mb-1">{kpi.label}</p>
              <div className="flex items-baseline gap-1">
                <h3 className="text-lg font-black text-slate-800 tracking-tighter">{kpi.value}</h3>
                <span className="text-[9px] font-bold text-slate-400 uppercase">{kpi.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Analytical Charts (Left) and Operational Sidebar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left Column: Stacked Analytical Charts */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Chart 1: Revenue Comparison */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xs text-slate-800 flex items-center gap-2">
                <ArrowUpRight size={14} className="text-blue-500"/> {t('dash.weekly_sales')}
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                 <span className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase">
                   <div className="w-2 h-2 rounded-full bg-blue-500"></div> {t('dash.chart.current_week')}
                 </span>
                 <span className="flex items-center gap-1.5 text-[9px] font-black text-slate-300 uppercase">
                   <div className="w-2 h-2 rounded-full bg-slate-300"></div> {t('dash.chart.prev_week')}
                 </span>
                 <span className="flex items-center gap-1.5 text-[9px] font-black text-amber-300 uppercase">
                   <div className="w-2 h-2 rounded-full bg-amber-300"></div> {t('dash.chart.prev_year')}
                 </span>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_CHART_DATA}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(val) => `${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="prevYearRevenue" name={t('dash.chart.prev_year')} stroke="#fcd34d" strokeWidth={2} strokeDasharray="3 3" fill="transparent" />
                  <Area type="monotone" dataKey="prevRevenue" name={t('dash.chart.prev_week')} stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                  <Area type="monotone" dataKey="revenue" name={t('dash.chart.current_week')} stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Fleet Occupancy (Directly Below Sales) */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xs text-slate-800 flex items-center gap-2">
                <BarChart3 size={14} className="text-emerald-500"/> {t('dash.occupancy')}
              </h3>
              <div className="flex gap-4">
                 <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase">
                   <div className="w-2 h-2 rounded-full bg-emerald-500"></div> {getChartLabel('pax')}
                 </span>
                 <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase">
                   <div className="w-2 h-2 rounded-full bg-amber-500"></div> {getChartLabel('cargo')}
                 </span>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_CHART_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                      itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="passengers" name={getChartLabel('pax')} stroke="#10b981" strokeWidth={3} dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="cargo" name={getChartLabel('cargo')} stroke="#f59e0b" strokeWidth={3} dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Extended Notifications & Logs Sidebar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
           <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-[11px] text-slate-700 flex items-center gap-2 uppercase tracking-widest">
                 <Bell size={14} className="text-amber-500" /> {t('dash.notifications')}
              </h3>
              <button className="text-[10px] font-black text-blue-600 uppercase hover:underline">{t('dash.history')}</button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {MOCK_NOTIFICATION_LOGS.map(log => (
                 <div key={log.id} className="p-3 bg-white rounded-xl border border-slate-100 hover:border-blue-200 transition-all cursor-default shadow-sm group">
                    <div className="flex justify-between items-start mb-1">
                       <div className="flex items-center gap-2">
                          <div className={`p-1 rounded-lg ${log.status === 'SENT' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {log.status === 'SENT' ? <CheckCircle size={10}/> : <AlertCircle size={10}/>}
                          </div>
                          <p className="text-[11px] font-bold text-slate-700 leading-tight group-hover:text-blue-700 transition-colors">{log.templateName}</p>
                       </div>
                       <span className="text-[9px] font-medium text-slate-400 font-mono">{log.date.split(' ')[1]}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-2 italic mb-2">"{log.contentPreview}"</p>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                       <div className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${
                          log.channel === 'SMS' ? 'text-blue-600 bg-blue-50 border-blue-100' : 
                          log.channel === 'PUSH' ? 'text-purple-600 bg-purple-50 border-purple-100' : 
                          'text-orange-600 bg-orange-50 border-orange-100'
                       }`}>
                          {log.channel}
                       </div>
                       <span className="text-[9px] font-bold text-slate-400">PAX: <span className="text-slate-600">{log.recipientCount}</span></span>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
