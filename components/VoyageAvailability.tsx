
import React, { useState, useEffect } from 'react';
import { Ship, Calendar, User, Truck, Bed, Filter, TrendingUp, Grid, List as ListIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { VoyageCapacity } from '../types';
import { useTranslation } from '../i18n';

const VoyageAvailability: React.FC = () => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'LIST' | 'GRID'>('LIST');
  const [capacities, setCapacities] = useState<VoyageCapacity[]>([]);

  useEffect(() => {
    fetch('/api/availability')
      .then(res => res.json())
      .then(data => setCapacities(data))
      .catch(err => console.error("Failed to fetch availability", err));
  }, []);

  const getPriceLevelBadge = (level: string) => {
    switch (level) {
      case 'LOW': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">{t('avail.status.low')}</span>;
      case 'STANDARD': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">{t('avail.status.standard')}</span>;
      case 'HIGH': return <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">{t('avail.status.high')}</span>;
      case 'SOLD_OUT': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">{t('avail.status.sold_out')}</span>;
      default: return null;
    }
  };

  const getProgressColor = (percent: number) => {
    if (percent > 90) return 'bg-red-500';
    if (percent > 75) return 'bg-amber-500';
    return 'bg-blue-500';
  };

  return (
    <div className="flex flex-col h-full bg-slate-100">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="text-blue-600" /> {t('avail.title')}
          </h2>
          <p className="text-xs text-slate-500">{t('avail.subtitle')}</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setViewMode('LIST')}
            className={`p-2 rounded transition ${viewMode === 'LIST' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <ListIcon size={18}/>
          </button>
          <button 
            onClick={() => setViewMode('GRID')}
            className={`p-2 rounded transition ${viewMode === 'GRID' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Grid size={18}/>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-center">
           <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
              <Filter size={16}/> {t('avail.filter.label')}
           </div>
           <select className="border rounded p-2 text-sm bg-white">
              <option>{t('avail.filter.all_lines')}</option>
              <option>Gdańsk - Nynäshamn</option>
              <option>Świnoujście - Ystad</option>
              <option>Świnoujście - Trelleborg</option>
           </select>
           <input type="date" className="border rounded p-2 text-sm bg-white" />
           <div className="border-l pl-4 flex gap-4 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> {t('avail.legend.available')}</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-500 rounded-sm"></div> {t('avail.legend.last_items')}</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> {t('avail.legend.full')}</span>
           </div>
        </div>

        {viewMode === 'LIST' && (
           <div className="space-y-4">
              {capacities.map((voyage, idx) => {
                 const paxPercent = (voyage.paxBooked / voyage.paxTotal) * 100;
                 const cabinPercent = (voyage.cabinBooked / voyage.cabinTotal) * 100;
                 const cargoPercent = (voyage.laneMetersBooked / voyage.laneMetersTotal) * 100;

                 return (
                    <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition">
                       {/* Voyage Info */}
                       <div className="w-48 flex-shrink-0 border-r border-slate-100 pr-6">
                          <h3 className="font-bold text-lg text-slate-800">{voyage.routeId}</h3>
                          <div className="text-sm text-slate-500 mb-2">
                             {new Date(voyage.departureTime).toLocaleDateString()} <br/>
                             <span className="font-bold text-slate-700">{new Date(voyage.departureTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                             <Ship size={12}/> {voyage.shipName}
                          </div>
                          <div className="mt-3">
                             {getPriceLevelBadge(voyage.priceLevel)}
                          </div>
                       </div>

                       {/* Progress Bars */}
                       <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8">
                          {/* PAX */}
                          <div>
                             <div className="flex justify-between mb-1">
                                <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><User size={12}/> {t('avail.stats.pax')}</span>
                                <span className="text-xs font-bold">{voyage.paxBooked} / {voyage.paxTotal}</span>
                             </div>
                             <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                <div className={`h-full ${getProgressColor(paxPercent)}`} style={{ width: `${paxPercent}%` }}></div>
                             </div>
                             <div className="text-right text-[10px] text-slate-400 mt-1">{paxPercent.toFixed(0)}%</div>
                          </div>

                          {/* Cabins */}
                          <div>
                             <div className="flex justify-between mb-1">
                                <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Bed size={12}/> {t('avail.stats.cabins')}</span>
                                <span className="text-xs font-bold">{voyage.cabinBooked} / {voyage.cabinTotal}</span>
                             </div>
                             <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden mb-2">
                                <div className={`h-full ${getProgressColor(cabinPercent)}`} style={{ width: `${cabinPercent}%` }}></div>
                             </div>
                             {/* Breakdown */}
                             <div className="flex gap-1 h-1.5 w-full">
                                {voyage.cabinBreakdown.map((cb, i) => (
                                   <div 
                                      key={i} 
                                      className="bg-slate-300 relative group flex-1 first:rounded-l last:rounded-r"
                                      title={`${cb.type}: ${cb.booked}/${cb.total}`}
                                   >
                                      <div className={`h-full ${cb.booked >= cb.total ? 'bg-red-400' : 'bg-green-400'}`} style={{ width: `${(cb.booked/cb.total)*100}%` }}></div>
                                   </div>
                                ))}
                             </div>
                          </div>

                          {/* Cargo */}
                          <div>
                             <div className="flex justify-between mb-1">
                                <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Truck size={12}/> {t('avail.stats.cargo')}</span>
                                <span className="text-xs font-bold">{voyage.laneMetersBooked} / {voyage.laneMetersTotal}</span>
                             </div>
                             <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                <div className={`h-full ${getProgressColor(cargoPercent)}`} style={{ width: `${cargoPercent}%` }}></div>
                             </div>
                             <div className="text-right text-[10px] text-slate-400 mt-1">{cargoPercent.toFixed(0)}%</div>
                          </div>
                       </div>

                       {/* Action */}
                       <div className="flex flex-col justify-center border-l border-slate-100 pl-6">
                          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition">
                             <TrendingUp size={20}/>
                          </button>
                       </div>
                    </div>
                 )
              })}
           </div>
        )}

        {viewMode === 'GRID' && (
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {capacities.map((voyage, idx) => {
                 const paxPercent = (voyage.paxBooked / voyage.paxTotal) * 100;
                 return (
                    <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition">
                       <div className="flex justify-between items-start mb-4">
                          <div className="font-bold text-slate-800">
                             {new Date(voyage.departureTime).toLocaleDateString()}
                             <div className="text-sm font-normal text-slate-500">{new Date(voyage.departureTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</div>
                          </div>
                          {getPriceLevelBadge(voyage.priceLevel)}
                       </div>
                       
                       <div className="text-center py-6 relative">
                          <div className="text-3xl font-bold text-slate-800">{paxPercent.toFixed(0)}%</div>
                          <div className="text-xs text-slate-400 uppercase font-bold">{t('avail.grid.occupancy')}</div>
                          {/* Circular indicator simulation */}
                          <svg className="absolute top-0 left-0 w-full h-full -rotate-90 pointer-events-none opacity-20" viewBox="0 0 100 100">
                             <circle cx="50" cy="50" r="40" fill="none" stroke={paxPercent > 90 ? 'red' : 'blue'} strokeWidth="8" strokeDasharray={`${paxPercent * 2.5} 250`} />
                          </svg>
                       </div>

                       <div className="space-y-2 text-xs border-t pt-4">
                          <div className="flex justify-between">
                             <span className="text-slate-500">{t('routes.timeline.ship')}:</span>
                             <span className="font-bold">{voyage.shipName}</span>
                          </div>
                          <div className="flex justify-between">
                             <span className="text-slate-500">{t('cargo.gen.goods')}:</span>
                             <span className="font-bold">{voyage.laneMetersBooked}m</span>
                          </div>
                          <div className="flex justify-between">
                             <span className="text-slate-500">{t('avail.stats.cabins')}:</span>
                             <span className="font-bold">{voyage.cabinBooked}/{voyage.cabinTotal}</span>
                          </div>
                       </div>
                    </div>
                 )
              })}
           </div>
        )}
      </div>
    </div>
  );
};

export default VoyageAvailability;
