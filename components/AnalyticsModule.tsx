// Add missing React and useState imports
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, ComposedChart 
} from 'recharts';
import { 
  MOCK_REVENUE_TRENDS, 
  MOCK_SPENDING_ANALYSIS, 
  MOCK_ROUTE_PERFORMANCE, 
  MOCK_BOOKING_PACE, 
  MOCK_FUEL_STATS, 
  MOCK_DEMOGRAPHICS,
  MOCK_LOYALTY_STATS,
  MOCK_CHART_DATA
} from '../services/mockData';
import { 
  PieChart as PieChartIcon, TrendingUp, Ship, DollarSign, Activity, Users, Truck, Anchor, BarChart2, Calendar, Droplet, LayoutDashboard, Gauge, Timer, Star, ArrowUpRight, BarChart3, ShoppingBag
} from 'lucide-react';
import { useTranslation } from '../i18n';
import { SystemUser } from '../types';

interface AnalyticsModuleProps {
  currentUser?: SystemUser | null;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

// Use React.FC which is now available from the import
const AnalyticsModule: React.FC<AnalyticsModuleProps> = ({ currentUser }) => {
  const { t } = useTranslation();
  // useState is now available from the import
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SALES' | 'OPS' | 'CUSTOMERS'>('OVERVIEW');

  const getChartLabel = (key: string) => {
    if (key === 'revenue') return t('dash.chart.revenue');
    if (key === 'pax') return t('dash.chart.pax');
    if (key === 'cargo') return t('nav.cargo');
    return key;
  };

  const allKpis = [
    { label: t('dash.revenue'), value: '45 230', unit: 'PLN', icon: <DollarSign size={18}/>, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12.5%' },
    { label: t('dash.pax'), value: '1,240', unit: 'PAX', icon: <Users size={18}/>, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+3.2%' },
    { label: t('nav.cargo'), value: '86', unit: 'Units', icon: <Truck size={18}/>, color: 'text-amber-600', bg: 'bg-amber-50', trend: '-1.4%' },
    { label: t('dash.sailings'), value: '4', unit: 'Today', icon: <Ship size={18}/>, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: 'Planowo' },
    { label: t('dash.kpi.yield'), value: '112.4', unit: 'PLN/m', icon: <TrendingUp size={18}/>, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+4.1%' },
    { label: t('dash.kpi.load_factor'), value: '78.2', unit: '%', icon: <Gauge size={18}/>, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+2.5%' },
    { label: t('dash.kpi.otp'), value: '96.4', unit: '%', icon: <Timer size={18}/>, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'STABLE' },
    { label: t('dash.kpi.loyalty_share'), value: '24', unit: '%', icon: <Star size={18}/>, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+1.4%' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-100">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <PieChartIcon size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {t('nav.analytics')}
            </h2>
            <p className="text-xs text-slate-500">Business Intelligence & Operational Performance</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${activeTab === 'OVERVIEW' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <LayoutDashboard size={16}/> {t('nav.analytics.overview')}
          </button>
          <button 
            onClick={() => setActiveTab('SALES')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${activeTab === 'SALES' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <DollarSign size={16}/> Sprzedaż
          </button>
          <button 
            onClick={() => setActiveTab('OPS')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${activeTab === 'OPS' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Anchor size={16}/> Operacje
          </button>
          <button 
            onClick={() => setActiveTab('CUSTOMERS')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${activeTab === 'CUSTOMERS' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Users size={16}/> Klienci
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'OVERVIEW' && (
          <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500">
             <div className="flex justify-between items-end mb-2">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                    {t('dash.welcome')}, {currentUser?.fullName.split(' ')[0] || t('dash.user.default')}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Podgląd analityczno-operacyjny FerrOS BI</p>
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  BI-Live: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {allKpis.map((kpi, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <div className={`p-2 rounded-xl ${kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform`}>
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
                        <h3 className="text-xl font-black text-slate-800 tracking-tighter">{kpi.value}</h3>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">{kpi.unit}</span>
                      </div>
                    </div>
                  </div>
                ))}
             </div>

             <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[400px]">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                      <ArrowUpRight size={16} className="text-blue-500"/> {t('dash.weekly_sales')}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4">
                       <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase">
                         <div className="w-2 h-2 rounded-full bg-blue-500"></div> {t('dash.chart.current_week')}
                       </span>
                       <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-300 uppercase">
                         <div className="w-2 h-2 rounded-full bg-slate-300"></div> {t('dash.chart.prev_week')}
                       </span>
                    </div>
                  </div>
                  <div className="flex-1 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MOCK_CHART_DATA}>
                        <defs>
                          <linearGradient id="colorRevBI" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} dy={10} />
                        <YAxis stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} tickFormatter={(val) => `${val/1000}k`} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="prevRevenue" name={t('dash.chart.prev_week')} stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                        <Area type="monotone" dataKey="revenue" name={t('dash.chart.current_week')} stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevBI)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-[450px]">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                      <BarChart3 size={16} className="text-emerald-500"/> {t('dash.occupancy')}
                    </h3>
                  </div>
                  <div className="flex-1 w-full h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={MOCK_CHART_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                            itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                        />
                        <Line type="monotone" dataKey="passengers" name={getChartLabel('pax')} stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="cargo" name={getChartLabel('cargo')} stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'SALES' && (
          <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                         <p className="text-xs font-bold text-slate-400 uppercase">Przychód (YTD)</p>
                         <h3 className="text-2xl font-bold text-slate-800">4.2M PLN</h3>
                      </div>
                      <div className="bg-green-100 p-2 rounded-lg text-green-600"><DollarSign size={20}/></div>
                   </div>
                   <div className="text-xs text-green-600 font-bold flex items-center gap-1">
                      <TrendingUp size={12}/> +12.5% vs zeszły rok
                   </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                         <p className="text-xs font-bold text-slate-400 uppercase">Śr. Bilet PAX</p>
                         <h3 className="text-2xl font-bold text-slate-800">245 PLN</h3>
                      </div>
                      <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Users size={20}/></div>
                   </div>
                   <div className="text-xs text-slate-500">Stabilny wzrost r/r</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                         <p className="text-xs font-bold text-slate-400 uppercase">{t('dash.kpi.avg_onboard_spend')}</p>
                         <h3 className="text-2xl font-bold text-slate-800">84.50 PLN</h3>
                      </div>
                      <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><ShoppingBag size={20}/></div>
                   </div>
                   <div className="text-xs text-green-600 font-bold flex items-center gap-1">
                      <TrendingUp size={12}/> +5.4% vs plan
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                   <h3 className="font-bold text-slate-800 mb-6">Trend Przychodów (Ostatnie 7 dni)</h3>
                   <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={MOCK_REVENUE_TRENDS}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickFormatter={(val) => val?.split('-').slice(1).join('/') || ''} />
                            <YAxis stroke="#94a3b8" fontSize={11} />
                            <Tooltip 
                               contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                               formatter={(value: number) => [`${value.toLocaleString()} PLN`]}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="value" name="Obecny Tydzień" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="previousValue" name="Poprzedni Tydzień" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                         </LineChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                   <h3 className="font-bold text-slate-800 mb-6">Struktura Wydatków Onboard</h3>
                   <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie
                               data={MOCK_SPENDING_ANALYSIS}
                               cx="50%"
                               cy="50%"
                               innerRadius={60}
                               outerRadius={100}
                               paddingAngle={5}
                               dataKey="amount"
                               nameKey="category"
                               label
                            >
                               {MOCK_SPENDING_ANALYSIS.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                               ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => `${value.toLocaleString()} PLN`} />
                            <Legend />
                         </PieChart>
                      </ResponsiveContainer>
                   </div>
                </div>
             </div>

             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <TrendingUp size={20} className="text-indigo-600"/> Krzywa Rezerwacji (Booking Pace)
                   </h3>
                </div>
                <div className="h-80 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MOCK_BOOKING_PACE}>
                         <defs>
                            <linearGradient id="colorCP" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                               <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                         </defs>
                         <XAxis 
                            dataKey="daysBeforeDeparture" 
                            stroke="#94a3b8" 
                            fontSize={11} 
                            label={{ value: 'Dni przed odejściem', position: 'insideBottomRight', offset: -5 }} 
                            reversed={true}
                         />
                         <YAxis stroke="#94a3b8" fontSize={11} unit="%" />
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                         <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}/>
                         <Legend />
                         <Area type="monotone" dataKey="currentYear" name="Bieżący Rok" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCP)" />
                         <Area type="monotone" dataKey="previousYear" name="Poprzedni Rok" stroke="#94a3b8" fillOpacity={0} strokeDasharray="5 5" fill="#fff" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'OPS' && (
           <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                       <Droplet size={20} className="text-slate-600"/> Efektywność Paliwowa (Fuel vs Speed)
                    </h3>
                 </div>
                 <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <ComposedChart data={MOCK_FUEL_STATS}>
                          <CartesianGrid stroke="#f5f5f5" />
                          <XAxis dataKey="date" scale="band" />
                          <YAxis yAxisId="left" orientation="left" stroke="#475569" label={{ value: 'Zużycie (t)', angle: -90, position: 'insideLeft' }} />
                          <YAxis yAxisId="right" orientation="right" stroke="#10b981" label={{ value: 'Prędkość (kn)', angle: 90, position: 'insideRight' }} />
                          <Tooltip />
                          <Legend />
                          <Bar yAxisId="left" dataKey="consumption" name="Zużycie HFO (t)" barSize={30} fill="#475569" />
                          <Line yAxisId="right" type="monotone" dataKey="speed" name="Prędkość Śr. (kn)" stroke="#10b981" strokeWidth={4} />
                       </ComposedChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                 <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-slate-800">Efektywność Eksploatacyjna Linii</h3>
                 </div>
                 <table className="w-full text-left">
                    <thead className="bg-white text-xs text-slate-500 uppercase border-b border-slate-200">
                       <tr>
                          <th className="p-4">Trasa / Linia</th>
                          <th className="p-4 text-center">Load Factor (PAX)</th>
                          <th className="p-4 text-center">Load Factor ({t('nav.cargo')})</th>
                          <th className="p-4 text-center">Punktualność</th>
                          <th className="p-4 text-center">Status Rentowności</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                       {MOCK_ROUTE_PERFORMANCE.map(route => (
                          <tr key={route.routeId} className="hover:bg-slate-50">
                             <td className="p-4 font-bold text-slate-700">{route.routeId}</td>
                             <td className="p-4 text-center font-bold">{route.averageLoadFactorPax}%</td>
                             <td className="p-4 text-center font-bold">{route.averageLoadFactorCargo}%</td>
                             <td className="p-4 text-center font-bold text-slate-700">{route.onTimePerformance}%</td>
                             <td className="p-4 text-center">
                                {route.averageLoadFactorPax > 80 ? (
                                   <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight">WYSOKA</span>
                                ) : (
                                   <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight">OPTYMALNA</span>
                                )}
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}

        {activeTab === 'CUSTOMERS' && (
           <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                       <Users size={20} className="text-purple-600"/> Demografia Pasażerów (Narodowość)
                    </h3>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                       <div className="h-64 w-64 flex-shrink-0">
                          <ResponsiveContainer width="100%" height="100%">
                             <PieChart>
                                <Pie data={MOCK_DEMOGRAPHICS} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                   {MOCK_DEMOGRAPHICS.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.color} />
                                   ))}
                                </Pie>
                                <Tooltip />
                             </PieChart>
                          </ResponsiveContainer>
                       </div>
                       <div className="flex-1 space-y-4">
                          {MOCK_DEMOGRAPHICS.map((d, idx) => (
                             <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                                   <span className="text-sm font-bold text-slate-700">{d.name}</span>
                                </div>
                                <span className="text-sm font-mono text-slate-500 font-bold">{d.value}%</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                       <Users size={20} className="text-amber-600"/> Dystrybucja Lojalnościowa (Segmentacja)
                    </h3>
                    <div className="h-64 w-full">
                       <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={MOCK_LOYALTY_STATS} layout="vertical" margin={{ left: 20 }}>
                             <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                             <XAxis type="number" hide />
                             <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 11, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                             <Tooltip cursor={{fill: 'transparent'}} />
                             <Bar dataKey="value" barSize={30} radius={[0, 4, 4, 0]}>
                                {MOCK_LOYALTY_STATS.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                             </Bar>
                          </BarChart>
                       </ResponsiveContainer>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsModule;
