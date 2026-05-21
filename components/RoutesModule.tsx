import React, { useState } from 'react';
import { Map, ArrowRight, Ship, Clock, CalendarDays, Search, Info, MapPin, Anchor, DollarSign, X, LayoutList, GripHorizontal, RotateCw, RefreshCw, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { MOCK_ROUTES, MOCK_SHIPS, MOCK_SAILING_SCHEDULES } from '../services/mockData';
import { Route, SailingSchedule, SailingStatus } from '../types';
import { useTranslation } from '../i18n';

const RoutesModule: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'VIEW' | 'GENERATOR'>('VIEW');
  
  // View State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [viewMode, setViewMode] = useState<'LIST' | 'TIMELINE'>('LIST');
  
  // Timeline Date State
  const [timelineDate, setTimelineDate] = useState('2023-10-25'); // Default to mock data date

  // Generator State
  const [config, setConfig] = useState({
      selectedShipId: '',
      selectedRouteId: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
      departureTime: '18:00',
      days: [1,2,3,4,5,6,0] // All days by default
   });
   const [generatedSailings, setGeneratedSailings] = useState<SailingSchedule[]>([]);
   const [currentSchedule, setCurrentSchedule] = useState<SailingSchedule[]>(MOCK_SAILING_SCHEDULES);

  // Group routes by Ship
  const shipsWithRoutes = MOCK_SHIPS.map(ship => {
    const routes = MOCK_ROUTES.filter(r => 
        r.shipName === ship.name && 
        (r.origin.toLowerCase().includes(searchTerm.toLowerCase()) || 
         r.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
         r.id.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    return { ...ship, routes };
  }).filter(s => s.routes.length > 0);

  const getShipImageColor = (shipCode: string) => {
      const colors: any = { 'POL': 'bg-blue-100 text-blue-600', 'SKA': 'bg-indigo-100 text-indigo-600', 'WOL': 'bg-emerald-100 text-emerald-600' };
      return colors[shipCode] || 'bg-slate-100 text-slate-600';
  };

  const getTimelinePosition = (departureTime: string) => {
      const date = new Date(departureTime);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const totalMinutes = hours * 60 + minutes;
      const percentStart = (totalMinutes / (24 * 60)) * 100;
      
      const durationMinutes = 7.5 * 60; // Domyślny czas rejsu 7.5h
      const percentWidth = (durationMinutes / (24 * 60)) * 100;
      
      return { left: `${percentStart}%`, width: `${percentWidth}%` };
  };

  const handleTimelineDateChange = (days: number) => {
      const date = new Date(timelineDate);
      date.setDate(date.getDate() + days);
      setTimelineDate(date.toISOString().split('T')[0]);
  };

  // Generator Helpers
  const daysOfWeek = [
      { id: 1, label: t('days.mon_short') },
      { id: 2, label: t('days.tue_short') },
      { id: 3, label: t('days.wed_short') },
      { id: 4, label: t('days.thu_short') },
      { id: 5, label: t('days.fri_short') },
      { id: 6, label: t('days.sat_short') },
      { id: 0, label: t('days.sun_short') },
   ];

   const handleDayToggle = (dayId: number) => {
      setConfig(prev => {
         const newDays = prev.days.includes(dayId) 
            ? prev.days.filter(d => d !== dayId)
            : [...prev.days, dayId];
         return { ...prev, days: newDays };
      });
   };

   const handleGeneratePreview = () => {
      if (!config.selectedShipId || !config.selectedRouteId) {
         alert(t('routes.gen.alert_select'));
         return;
      }

      const ship = MOCK_SHIPS.find(s => s.id === config.selectedShipId);
      
      if (!ship) return;

      const generated: SailingSchedule[] = [];
      let currentDate = new Date(config.startDate);
      const end = new Date(config.endDate);

      while (currentDate <= end) {
         if (config.days.includes(currentDate.getDay())) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const departureTimeStr = `${dateStr}T${config.departureTime}:00`;

            generated.push({
               routeId: config.selectedRouteId,
               shipName: ship.name,
               originalDeparture: departureTimeStr,
               actualDeparture: departureTimeStr,
               status: SailingStatus.SCHEDULED,
               paxCount: 0,
               cargoMeterCount: 0
            });
         }
         currentDate.setDate(currentDate.getDate() + 1);
      }

      setGeneratedSailings(generated);
   };

   const handleSaveSchedule = () => {
      if (generatedSailings.length === 0) return;
      setCurrentSchedule([...generatedSailings, ...currentSchedule]);
      const count = generatedSailings.length;
      setGeneratedSailings([]);
      alert(t('routes.gen.success', { count }));
   };

   const formatDate = (dateStr: string) => {
      return new Date(dateStr).toLocaleString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
   };

  return (
    <div className="flex flex-col h-full bg-slate-100">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-10 overflow-x-auto">
        <div className="flex-shrink-0 mr-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Map className="text-blue-600" /> {t('routes.title')}
          </h2>
          <p className="text-xs text-slate-500">{t('routes.subtitle')}</p>
        </div>
        <div className="flex gap-4 items-center">
            <div className="flex gap-2 mr-4">
                <button 
                    onClick={() => setActiveTab('VIEW')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'VIEW' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                    {t('routes.tabs.view')}
                </button>
                <button 
                    onClick={() => setActiveTab('GENERATOR')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'GENERATOR' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                    {t('routes.tabs.generator')}
                </button>
            </div>

            {activeTab === 'VIEW' && (
                <>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder={t('routes.search.placeholder')}
                            className="pl-10 pr-4 py-2 border rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="bg-slate-100 p-1 rounded-lg flex border border-slate-200">
                        <button 
                            onClick={() => setViewMode('LIST')}
                            className={`p-2 rounded-md transition ${viewMode === 'LIST' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                            title={t('routes.view.list')}
                        >
                            <LayoutList size={18}/>
                        </button>
                        <button 
                            onClick={() => setViewMode('TIMELINE')}
                            className={`p-2 rounded-md transition ${viewMode === 'TIMELINE' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                            title={t('routes.view.timeline')}
                        >
                            <GripHorizontal size={18}/>
                        </button>
                    </div>
                </>
            )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 relative">
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
          
          {activeTab === 'VIEW' && (
            <>
                {shipsWithRoutes.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        <Map size={48} className="mx-auto mb-4 opacity-20"/>
                        <p>{t('routes.list.empty')}</p>
                    </div>
                )}

                {viewMode === 'LIST' ? (
                    shipsWithRoutes.map(ship => (
                        <div key={ship.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${getShipImageColor(ship.code)}`}>
                                <Ship size={32} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">{ship.name}</h3>
                                <div className="flex gap-3 text-xs text-slate-500 mt-1">
                                    <span className="bg-white border px-2 py-0.5 rounded font-mono">{ship.code}</span>
                                    <span className="flex items-center gap-1"><Anchor size={12}/> {ship.paxCapacity} {t('routes.ship.pax')}</span>
                                    <span className="flex items-center gap-1"><Clock size={12}/> {t('routes.ship.speed', { speed: ship.maxSpeed })}</span>
                                </div>
                            </div>
                            </div>
                            <div className="flex gap-2">
                            <div className="text-center px-4 border-l border-slate-200">
                                    <div className="text-xs font-bold text-slate-400 uppercase">{t('routes.ship.lane')}</div>
                                    <div className="font-bold text-slate-700">{ship.laneMeters} m</div>
                            </div>
                            <div className="text-center px-4 border-l border-slate-200">
                                    <div className="text-xs font-bold text-slate-400 uppercase">{t('routes.ship.build_year')}</div>
                                    <div className="font-bold text-slate-700">{ship.buildYear}</div>
                            </div>
                            </div>
                        </div>
                        
                        <div className="divide-y divide-slate-100">
                            {ship.routes.map(route => {
                            const depTime = new Date(route.departureTime);
                            const formattedTime = depTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                            
                            return (
                                <div key={route.id} className="p-5 hover:bg-blue-50/30 transition group">
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                                    <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-2">
                                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-mono font-bold border border-slate-200">{route.id}</span>
                                        <div className="flex items-center gap-2 font-bold text-slate-700 text-lg">
                                            {route.origin} <ArrowRight size={20} className="text-slate-400"/> {route.destination}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                        <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded"><Clock size={14} className="text-blue-500"/> {t('book.duration')}: {t('routes.duration_val')}</span>
                                    </div>
                                    </div>
                                    
                                    <div className="flex gap-6 items-center">
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{t('routes.list.departure')}</p>
                                        <p className="font-mono font-black text-slate-800 text-2xl flex items-center justify-end gap-2">
                                            {formattedTime} <span className="text-sm font-normal text-slate-400">{t('routes.timezone')}</span>
                                        </p>
                                    </div>
                                    
                                    <div className="w-px h-10 bg-slate-200 hidden md:block"></div>

                                    <div className="text-right min-w-[100px]">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{t('routes.list.price')}</p>
                                        <p className="font-bold text-emerald-600 text-xl flex items-center justify-end gap-1">
                                            {route.basePrice} <span className="text-sm">PLN</span>
                                        </p>
                                    </div>

                                    <button 
                                        onClick={() => setSelectedRoute(route)}
                                        className="px-4 py-2 bg-white border border-blue-200 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-600 hover:text-white transition shadow-sm flex items-center gap-2"
                                    >
                                        <Info size={16}/> {t('routes.list.details')}
                                    </button>
                                    </div>
                                </div>
                                </div>
                            );
                            })}
                        </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-slate-800 flex items-center gap-2"><Clock size={20}/> {t('routes.timeline.title')}</h3>
                                <p className="text-xs text-slate-500 mt-1">{t('routes.timeline.desc')}</p>
                            </div>
                            
                            <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg p-1">
                                <button onClick={() => handleTimelineDateChange(-1)} className="p-1 hover:bg-slate-100 rounded text-slate-600">
                                    <ChevronLeft size={18}/>
                                </button>
                                <input 
                                    type="date" 
                                    className="text-sm font-bold text-slate-700 bg-transparent border-none outline-none text-center w-32"
                                    value={timelineDate}
                                    onChange={(e) => setTimelineDate(e.target.value)}
                                />
                                <button onClick={() => handleTimelineDateChange(1)} className="p-1 hover:bg-slate-100 rounded text-slate-600">
                                    <ChevronRight size={18}/>
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6 overflow-x-auto">
                            <div className="min-w-[800px]">
                                <div className="flex border-b border-slate-200 pb-2 mb-4 text-xs text-slate-400 font-mono">
                                    <div className="w-48 shrink-0">{t('routes.timeline.ship')}</div>
                                    <div className="flex-1 relative h-6">
                                        {[0, 6, 12, 18, 24].map(hour => (
                                            <div key={hour} className="absolute top-0 transform -translate-x-1/2" style={{ left: `${(hour / 24) * 100}%` }}>
                                                {hour}:00
                                            </div>
                                        ))}
                                        {[...Array(25)].map((_, i) => (
                                            <div key={i} className="absolute top-4 bottom-0 w-px bg-slate-100" style={{ left: `${(i / 24) * 100}%`, height: '500px' }}></div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6 relative">
                                    {MOCK_SHIPS.map(ship => {
                                        const dailySailings = currentSchedule.filter(s => 
                                            s.shipName === ship.name && 
                                            s.originalDeparture.startsWith(timelineDate)
                                        );

                                        return (
                                            <div key={ship.id} className="flex items-center h-16 group">
                                                <div className="w-48 shrink-0 flex items-center gap-3 pr-4 border-r border-slate-100 z-10 bg-white">
                                                    <div className={`p-2 rounded-lg ${getShipImageColor(ship.code)}`}>
                                                        <Ship size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-sm text-slate-800">{ship.name}</div>
                                                        <div className="text-[10px] text-slate-500 font-mono">{ship.code}</div>
                                                    </div>
                                                </div>

                                                <div className="flex-1 relative h-full bg-slate-50/50 rounded-r-lg">
                                                    {dailySailings.length > 0 ? dailySailings.map((sailing, idx) => {
                                                        const pos = getTimelinePosition(sailing.originalDeparture);
                                                        const routeDef = MOCK_ROUTES.find(r => r.id === sailing.routeId);
                                                        
                                                        return (
                                                            <div 
                                                                key={`${sailing.routeId}-${idx}`}
                                                                className={`absolute top-2 bottom-2 rounded-md shadow-sm border cursor-pointer transition-all hover:shadow-md group/item z-20 flex items-center overflow-hidden ${
                                                                    sailing.status === SailingStatus.CANCELLED ? 'bg-red-500 border-red-600' :
                                                                    sailing.status === SailingStatus.DELAYED ? 'bg-amber-500 border-amber-600' :
                                                                    'bg-blue-600 border-blue-700 hover:bg-blue-500'
                                                                }`}
                                                                style={{ left: pos.left, width: pos.width }}
                                                                onClick={() => {
                                                                    if (routeDef) setSelectedRoute(routeDef);
                                                                }}
                                                            >
                                                                <div className="px-2 text-xs font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-1">
                                                                    <span>{new Date(sailing.originalDeparture).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                                    <ArrowRight size={10} className="opacity-70"/>
                                                                    <span>{routeDef?.destination || sailing.routeId}</span>
                                                                </div>
                                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-800 text-white text-xs p-2 rounded shadow-lg opacity-0 group-hover/item:opacity-100 pointer-events-none transition-opacity z-50">
                                                                    <div className="font-bold border-b border-slate-600 pb-1 mb-1">{sailing.routeId}</div>
                                                                    <div>{t('common.status')}: {sailing.status}</div>
                                                                    <div className="text-slate-400 mt-1">Pax: {sailing.paxCount}</div>
                                                                </div>
                                                            </div>
                                                        );
                                                    }) : (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <span className="text-[10px] text-slate-300 uppercase font-bold tracking-widest">{t('routes.timeline.no_sailings')}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                            <p className="text-xs text-slate-400">{t('routes.timeline.24h_hint')}</p>
                        </div>
                    </div>
                )}
            </>
          )}

          {activeTab === 'GENERATOR' && (
             <div className="animate-in fade-in slide-in-from-right-4">
                <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600"><CalendarDays size={24}/></div>
                    <div>
                        <div className="text-2xl font-bold text-slate-800">{currentSchedule.length}</div>
                        <div className="text-xs text-slate-500 uppercase font-bold">{t('routes.gen.active_sailings')}</div>
                    </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="bg-amber-100 p-3 rounded-full text-amber-600"><Ship size={24}/></div>
                    <div>
                        <div className="text-2xl font-bold text-slate-800">{new Set(currentSchedule.map(s => s.shipName)).size}</div>
                        <div className="text-xs text-slate-500 uppercase font-bold">{t('routes.gen.ships_in_use')}</div>
                    </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="bg-purple-100 p-3 rounded-full text-purple-600"><RotateCw size={24}/></div>
                    <div>
                        <div className="text-2xl font-bold text-slate-800">{currentSchedule.length}</div>
                        <div className="text-xs text-slate-500 uppercase font-bold">{t('routes.gen.plan_count')}</div>
                    </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <CalendarDays size={20} className="text-blue-600"/> {t('routes.gen.form_title')}
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('routes.timeline.ship')}</label>
                            <select 
                                className="w-full border p-2 rounded text-sm bg-white"
                                value={config.selectedShipId}
                                onChange={e => setConfig({...config, selectedShipId: e.target.value})}
                            >
                                <option value="">{t('routes.gen.ship_select')}</option>
                                {MOCK_SHIPS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('res.route')}</label>
                            <select 
                                className="w-full border p-2 rounded text-sm bg-white"
                                value={config.selectedRouteId}
                                onChange={e => setConfig({...config, selectedRouteId: e.target.value})}
                            >
                                <option value="">{t('routes.gen.route_select')}</option>
                                {MOCK_ROUTES.map(r => <option key={r.id} value={r.id}>{r.origin} - {r.destination}</option>)}
                            </select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('routes.gen.date_from')}</label>
                                <input 
                                type="date" 
                                className="w-full border p-2 rounded text-sm bg-white"
                                value={config.startDate}
                                onChange={e => setConfig({...config, startDate: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('routes.gen.date_to')}</label>
                                <input 
                                type="date" 
                                className="w-full border p-2 rounded text-sm bg-white"
                                value={config.endDate}
                                onChange={e => setConfig({...config, endDate: e.target.value})}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('routes.gen.dep_time')}</label>
                            <input 
                                type="time" 
                                className="w-full border p-2 rounded text-sm bg-white"
                                value={config.departureTime}
                                onChange={e => setConfig({...config, departureTime: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t('routes.gen.weekdays')}</label>
                            <div className="flex gap-1 justify-between">
                                {daysOfWeek.map(day => (
                                <button 
                                    key={day.id}
                                    onClick={() => handleDayToggle(day.id)}
                                    className={`w-8 h-8 rounded text-xs font-bold flex items-center justify-center transition ${
                                        config.days.includes(day.id) 
                                        ? 'bg-blue-600 text-white shadow-sm' 
                                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                    }`}
                                >
                                    {day.label}
                                </button>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={handleGeneratePreview}
                            className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 shadow-md flex items-center justify-center gap-2 mt-4"
                        >
                            <RefreshCw size={16}/> {t('routes.gen.btn_preview')}
                        </button>
                    </div>
                    </div>

                    <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col h-[500px]">
                        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">{t('routes.gen.preview_title', { count: generatedSailings.length })}</h3>
                            {generatedSailings.length > 0 && (
                                <button 
                                onClick={handleSaveSchedule}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-700 shadow-sm flex items-center gap-2"
                                >
                                <Save size={16}/> {t('routes.gen.btn_save')}
                                </button>
                            )}
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50/50">
                            {generatedSailings.length > 0 ? generatedSailings.map((sailing, idx) => (
                                <div key={idx} className="bg-white p-3 rounded border border-slate-200 flex justify-between items-center animate-in fade-in slide-in-from-bottom-1" style={{ animationDelay: `${idx * 0.05}s` }}>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 font-bold">{idx + 1}</span>
                                    <div>
                                        <div className="font-bold text-sm text-slate-800">{formatDate(sailing.originalDeparture)}</div>
                                        <div className="text-xs text-slate-500">{sailing.routeId} • {sailing.shipName}</div>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100">{t('routes.gen.new_badge')}</span>
                                </div>
                            )) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <CalendarDays size={48} className="mb-4 opacity-20"/>
                                <p>{t('routes.gen.empty_hint')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
                    <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-700">
                        {t('routes.gen.current_title')}
                    </div>
                    <table className="w-full text-left text-sm">
                    <thead className="bg-white text-slate-500 uppercase text-xs border-b border-slate-200">
                        <tr>
                            <th className="p-4">{t('res.route')}</th>
                            <th className="p-4">{t('book.date')}</th>
                            <th className="p-4">{t('routes.timeline.ship')}</th>
                            <th className="p-4 text-center">{t('common.status')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {currentSchedule.slice(0, 10).map((s, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                                <td className="p-4 font-bold text-slate-700">{s.routeId}</td>
                                <td className="p-4">{formatDate(s.originalDeparture)}</td>
                                <td className="p-4 text-slate-600">{s.shipName}</td>
                                <td className="p-4 text-center">
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase">{s.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
             </div>
          )}
        </div>

        {selectedRoute && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                    <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-xl font-bold">{selectedRoute.origin} <span className="text-slate-400 mx-1">→</span> {selectedRoute.destination}</h3>
                                <span className="bg-blue-600 text-xs px-2 py-0.5 rounded font-mono">{selectedRoute.id}</span>
                            </div>
                            <p className="text-slate-400 text-sm flex items-center gap-2"><Ship size={14}/> {selectedRoute.shipName}</p>
                        </div>
                        <button onClick={() => setSelectedRoute(null)} className="text-slate-400 hover:text-white transition p-1 rounded-full hover:bg-slate-800">
                            <X size={24}/>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <CalendarDays size={18} className="text-blue-500"/> {t('routes.detail.weekly')}
                            </h4>
                            <div className="grid grid-cols-7 gap-2">
                                {[t('days.mon_short'), t('days.tue_short'), t('days.wed_short'), t('days.thu_short'), t('days.fri_short'), t('days.sat_short'), t('days.sun_short')].map((day, idx) => (
                                    <div key={day} className={`p-2 rounded border text-center ${idx === 5 || idx === 6 ? 'bg-blue-50 border-blue-100' : 'bg-white border-slate-100'}`}>
                                        <div className="text-xs font-bold text-slate-400 mb-1">{day}</div>
                                        <div className="font-bold text-slate-700 text-sm">
                                            {new Date(selectedRoute.departureTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-slate-400 mt-3 text-center italic">{t('routes.detail.holiday_hint')}</p>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6 relative h-48 bg-blue-50">
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2/3 h-1 bg-slate-300 relative rounded">
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-4 border-slate-800 rounded-full"></div>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-4 border-blue-600 rounded-full"></div>
                                    <Ship className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 text-blue-500 animate-pulse" size={24}/>
                                </div>
                            </div>
                            <div className="absolute bottom-4 left-6 font-bold text-slate-600">{selectedRoute.origin}</div>
                            <div className="absolute bottom-4 right-6 font-bold text-blue-700">{selectedRoute.destination}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-slate-200">
                                <h4 className="font-bold text-slate-700 mb-2 text-sm flex items-center gap-2"><DollarSign size={16} className="text-emerald-500"/> {t('routes.detail.pricing')}</h4>
                                <ul className="space-y-2 text-xs text-slate-600">
                                    <li className="flex justify-between"><span>{t('routes.detail.pax')}</span> <span className="font-bold">{selectedRoute.basePrice} PLN</span></li>
                                    <li className="flex justify-between"><span>{t('routes.detail.car')}</span> <span className="font-bold">+{150} PLN</span></li>
                                    <li className="flex justify-between"><span>{t('routes.detail.cabin')}</span> <span className="font-bold">+{200} PLN</span></li>
                                </ul>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-200">
                                <h4 className="font-bold text-slate-700 mb-2 text-sm flex items-center gap-2"><Info size={16} className="text-purple-500"/> {t('routes.detail.port_info')}</h4>
                                <div className="text-xs text-slate-600 space-y-1">
                                    <p>{t('routes.detail.checkin_open')}</p>
                                    <p>{t('routes.detail.checkin_close')}</p>
                                    <p>{t('routes.detail.terminal_info')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-white border-t border-slate-200 flex justify-end gap-3">
                        <button onClick={() => setSelectedRoute(null)} className="px-4 py-2 border border-slate-300 rounded-lg font-bold text-slate-600 hover:bg-slate-50">{t('common.close')}</button>
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md">{t('routes.detail.book_btn')}</button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default RoutesModule;
