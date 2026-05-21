import React, { useState, useMemo, useEffect } from 'react';
import { 
  QrCode, Anchor, CheckSquare, ShieldAlert, BarChart2, 
  Users, Truck, LayoutDashboard, Search, Ship, UserCheck, 
  Printer, FileText, ShieldCheck, UserX, Loader2, CheckCircle,
  ChevronRight, Activity, Clock, Timer, ArrowUpRight, UserPlus, ListFilter, MoreVertical, Car, Layers, Bed, Flag, User, X, AlertTriangle, Fingerprint, Shield,
  Calendar, RefreshCw, Play
} from 'lucide-react';
import { MOCK_RESERVATIONS, MOCK_BLACKLIST, MOCK_VOYAGE_CAPACITIES } from '../services/mockData';
import { BookingStatus, BlacklistEntry, BlacklistType, VehicleType, CargoLoadType, Reservation, CabinType } from '../types';
import { useTranslation } from '../i18n';

const CheckInModule: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'SEARCH' | 'DASHBOARD'>('SEARCH');
  const [manifestView, setManifestView] = useState<'ALL' | 'PAX' | 'CARGO'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReservation, setActiveReservation] = useState<Reservation | null>(null);
  const [securityAlert, setSecurityAlert] = useState<BlacklistEntry | null>(null);
  
  // Terminal State
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkedInIds, setCheckedInIds] = useState<string[]>([]);
  const [lastActions, setLastActions] = useState<{id: string, time: string, status: string}[]>([]);
  const [docVerified, setDocVerified] = useState(false);
  const [boardingPassIssued, setBoardingPassIssued] = useState(false);

  const currentVoyageId = 'R001';
  const voyageData = MOCK_VOYAGE_CAPACITIES.find(v => v.routeId === currentVoyageId);
  
  const voyageReservations = useMemo(() => 
    MOCK_RESERVATIONS.filter(r => r.routeId === currentVoyageId && r.status !== BookingStatus.CANCELLED),
    [currentVoyageId]
  );

  const boardedReservations = useMemo(() => 
    voyageReservations.filter(r => r.status === BookingStatus.CHECKED_IN || checkedInIds.includes(r.id)),
    [voyageReservations, checkedInIds]
  );

  const pendingReservations = useMemo(() => {
    const pending = voyageReservations.filter(r => r.status !== BookingStatus.CHECKED_IN && !checkedInIds.includes(r.id));
    if (manifestView === 'PAX') return pending.filter(r => r.vehicleType === VehicleType.NONE);
    if (manifestView === 'CARGO') return pending.filter(r => r.vehicleType !== VehicleType.NONE);
    return pending;
  }, [voyageReservations, checkedInIds, manifestView]);

  const stats = useMemo(() => {
    const totalPax = voyageReservations.reduce((acc, r) => acc + r.passengers.length, 0);
    const checkedInPax = boardedReservations.reduce((acc, r) => acc + r.passengers.length, 0);
    const vehicles = voyageReservations.filter(r => r.vehicleType !== VehicleType.NONE);
    const checkedInVehicles = boardedReservations.filter(r => r.vehicleType !== VehicleType.NONE);

    return {
      totalPax,
      checkedInPax,
      missingPax: totalPax - checkedInPax,
      paxPercent: Math.round((checkedInPax / (totalPax || 1)) * 100),
      totalVehicles: vehicles.length,
      checkedInVehicles: checkedInVehicles.length,
      missingVehicles: vehicles.length - checkedInVehicles.length,
      vehiclePercent: Math.round((checkedInVehicles.length / (vehicles.length || 1)) * 100),
    };
  }, [voyageReservations, boardedReservations]);

  const performSearch = (query: string) => {
    setIsProcessing(true);
    setSecurityAlert(null);
    setActiveReservation(null);
    setDocVerified(false);
    setBoardingPassIssued(false);

    // Simulation of network delay / scan processing
    setTimeout(() => {
        const found = MOCK_RESERVATIONS.find(r => 
          r.id.toLowerCase().includes(query.toLowerCase()) || 
          r.passengers.some(p => p.lastName.toLowerCase().includes(query.toLowerCase())) ||
          (r.vehicleReg && r.vehicleReg.toLowerCase().includes(query.toLowerCase()))
        );

        if (found) {
           // Security Check
           for (const pax of found.passengers) {
              const blacklistMatch = MOCK_BLACKLIST.find(entry => 
                 entry.value === pax.documentNumber || 
                 (entry.type === BlacklistType.PERSON && pax.lastName.toLowerCase() === entry.value.toLowerCase())
              );
              if (blacklistMatch && blacklistMatch.active) {
                 setSecurityAlert(blacklistMatch);
                 break; 
              }
           }
           setActiveReservation(found);
        }
        setIsProcessing(false);
    }, 600);
  };

  const handleSearch = () => {
    if (!searchQuery) return;
    performSearch(searchQuery);
  };

  const handleLoadDemo = () => {
    // Przykładowa rezerwacja: Anders Svensson (RES-P001)
    performSearch('RES-P001');
  };

  const handleConfirmCheckIn = () => {
     if (!activeReservation || securityAlert) return;
     setIsProcessing(true);
     
     setTimeout(() => {
        setCheckedInIds([...checkedInIds, activeReservation.id]);
        setLastActions([{ id: activeReservation.id, time: new Date().toLocaleTimeString(), status: 'SUCCESS' }, ...lastActions].slice(0, 5));
        setIsProcessing(false);
        setActiveReservation(null);
        setSearchQuery('');
        setDocVerified(false);
        setBoardingPassIssued(false);
     }, 1000);
  };

  const handleQuickCheckIn = (resId: string) => {
    if (confirm(`Ręczna odprawa rezerwacji ${resId}?`)) {
      setCheckedInIds(prev => [...prev, resId]);
      setLastActions([{ id: resId, time: new Date().toLocaleTimeString(), status: 'MANUAL' }, ...lastActions].slice(0, 5));
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 font-sans">
      {/* Dynamic Header - Reduced Radius */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex justify-between items-center shadow-sm z-20">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-1.5 rounded text-white shadow-sm">
            <Anchor size={18} />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-800 tracking-tight uppercase">
              Terminal Operacyjny Odprawy
            </h2>
            <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em]">
               {voyageData?.shipName || 'm/f Polonia'} • {currentVoyageId} • PORT: ŚWINOUJŚCIE
            </p>
          </div>
        </div>

        <div className="flex bg-slate-100 p-0.5 rounded border border-slate-200 shadow-inner">
          <button 
            onClick={() => setActiveTab('SEARCH')}
            className={`px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-widest transition flex items-center gap-2 ${activeTab === 'SEARCH' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <QrCode size={12}/> Skaner / SOK
          </button>
          <button 
            onClick={() => setActiveTab('DASHBOARD')}
            className={`px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-widest transition flex items-center gap-2 ${activeTab === 'DASHBOARD' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <LayoutDashboard size={12}/> Dashboard
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-4">
        
        {activeTab === 'SEARCH' && (
          <div className="h-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            
            {/* Left: Scanner Control - Professional Smaller Radius */}
            <div className="lg:col-span-4 space-y-4">
               <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-focus-within:opacity-10 transition-opacity">
                     <QrCode size={60} />
                  </div>
                  
                  <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Wprowadź dane lub skanuj</h3>
                  
                  <div className="space-y-3">
                     <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
                        <input 
                           type="text" 
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                           className="w-full pl-11 pr-4 py-3 rounded border border-slate-200 bg-slate-50 outline-none focus:border-blue-500 focus:bg-white font-bold text-base transition-all placeholder:text-slate-300 shadow-inner"
                           placeholder="NR REZ / NAZWISKO"
                        />
                     </div>
                     <button 
                        onClick={handleSearch}
                        disabled={isProcessing}
                        className="w-full bg-slate-900 text-white py-3 rounded font-black uppercase tracking-widest text-[10px] hover:bg-black transition shadow shadow-slate-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                     >
                        {isProcessing ? <Loader2 className="animate-spin" size={18}/> : <><QrCode size={16}/> Identyfikuj Jednostkę</>}
                     </button>
                  </div>
               </div>

               {/* Recent Actions List */}
               <div className="bg-slate-900 rounded-lg shadow-md overflow-hidden flex flex-col min-h-[250px]">
                  <div className="p-3 border-b border-white/10 flex justify-between items-center bg-white/5">
                     <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ostatnie Akcje</h4>
                     <Activity size={12} className="text-green-500 animate-pulse"/>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                     {lastActions.length > 0 ? lastActions.map((action, i) => (
                        <div key={i} className="flex justify-between items-center bg-white/5 p-2 rounded border border-white/5 animate-in slide-in-from-left-2">
                           <div>
                              <p className="font-mono text-[11px] text-white font-bold">{action.id}</p>
                              <p className="text-[8px] text-slate-500 uppercase font-black">{action.time} • {action.status}</p>
                           </div>
                           <CheckCircle size={14} className="text-green-500"/>
                        </div>
                     )) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-30 text-center py-10">
                           <Clock size={32} className="mb-2"/>
                           <p className="text-[9px] font-black uppercase tracking-widest">Brak sesji</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Right: Detailed Dossier / Profile */}
            <div className="lg:col-span-8 h-full">
               {activeReservation ? (
                  <div className="bg-white rounded-lg shadow-lg border border-slate-200 h-full flex flex-col overflow-hidden animate-in zoom-in duration-300">
                     
                     {/* Dossier Header */}
                     <div className={`p-6 flex justify-between items-start ${securityAlert ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'} transition-colors duration-500`}>
                        <div>
                           <div className="flex items-center gap-3">
                              <h2 className="text-3xl font-black tracking-tighter uppercase">{activeReservation.id}</h2>
                              <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-black border border-white/20 uppercase">
                                 {activeReservation.vehicleType === VehicleType.NONE ? 'PIESZY' : 'POJAZD'}
                              </span>
                           </div>
                           <p className="text-white/70 font-bold mt-1 uppercase text-[10px] tracking-widest flex items-center gap-2">
                              <Calendar size={12}/> {activeReservation.bookingDate} • {activeReservation.routeId}
                           </p>
                        </div>
                        <button onClick={() => setActiveReservation(null)} className="p-1.5 hover:bg-white/20 rounded transition">
                           <X size={20}/>
                        </button>
                     </div>

                     <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        
                        {/* Security Alert if exists */}
                        {securityAlert && (
                           <div className="bg-red-50 border border-red-500 p-4 rounded animate-pulse">
                              <div className="flex items-center gap-4 text-red-700">
                                 <ShieldAlert size={36} className="shrink-0"/>
                                 <div>
                                    <h4 className="text-lg font-black uppercase tracking-tight">ALERT BEZPIECZEŃSTWA: BLACKLIST</h4>
                                    <p className="text-sm font-bold">Powód: {securityAlert.reason}</p>
                                    <p className="text-xs mt-0.5">Poziom: {securityAlert.severity} • Wymagany kontakt z nadzorem.</p>
                                 </div>
                              </div>
                           </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {/* Pax Info */}
                           <div className="space-y-4">
                              <div>
                                 <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Users size={12}/> Główny Pasażer
                                 </h4>
                                 <div className="bg-slate-50 p-4 rounded border border-slate-100 relative group">
                                    <div className="flex items-center gap-4">
                                       <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-black text-lg">
                                          {activeReservation.passengers[0]?.lastName?.[0] || '?'}
                                       </div>
                                       <div>
                                          <p className="text-xl font-black text-slate-800 leading-tight">
                                             {activeReservation.passengers[0]?.lastName || 'Brak'} {activeReservation.passengers[0]?.firstName || 'Danych'}
                                          </p>
                                          <p className="text-xs font-bold text-slate-500 flex items-center gap-2 mt-0.5">
                                             <Flag size={10}/> {activeReservation.passengers[0]?.nationality || 'PL'} • {activeReservation.passengers[0]?.documentNumber || 'Brak DOC'}
                                          </p>
                                       </div>
                                    </div>
                                 </div>
                              </div>

                              <div>
                                 <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Layers size={12}/> Zakwaterowanie
                                 </h4>
                                 <div className="bg-slate-50 p-4 rounded border border-slate-100">
                                    <div className="flex items-center gap-4">
                                       <div className="p-2 bg-indigo-100 text-indigo-600 rounded">
                                          {activeReservation.cabinType === CabinType.NONE ? <User size={20}/> : <Bed size={20}/>}
                                       </div>
                                       <div>
                                          <p className="text-base font-black text-slate-800 uppercase leading-none">
                                             {activeReservation.cabinType === CabinType.NONE ? 'Miejsce Pokładowe' : activeReservation.cabinType}
                                          </p>
                                          {activeReservation.cabinNumber && (
                                             <p className="text-xs font-black text-indigo-600 mt-1 uppercase tracking-widest">NR: {activeReservation.cabinNumber}</p>
                                          )}
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           {/* Transport / Vehicle Info */}
                           <div className="space-y-4">
                              <div>
                                 <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Truck size={12}/> Transport
                                 </h4>
                                 <div className="bg-slate-50 p-4 rounded border border-slate-100">
                                    <div className="flex items-center gap-4">
                                       <div className="p-2 bg-amber-100 text-amber-600 rounded">
                                          {activeReservation.vehicleType === VehicleType.CAR ? <Car size={20}/> : activeReservation.vehicleType === VehicleType.MOTORCYCLE ? <Ship size={20}/> : <User size={20}/>}
                                       </div>
                                       <div>
                                          <p className="text-base font-black text-slate-800 uppercase leading-none">
                                             {activeReservation.vehicleType === VehicleType.NONE ? 'PAX Pieszy' : activeReservation.vehicleType}
                                          </p>
                                          {activeReservation.vehicleReg && (
                                             <p className="font-mono text-lg font-black text-slate-800 tracking-widest mt-1 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-inner w-fit">{activeReservation.vehicleReg}</p>
                                          )}
                                       </div>
                                    </div>
                                 </div>
                              </div>

                              {/* Checklist */}
                              <div>
                                 <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <ListChecks size={12}/> Procedura Weryfikacji
                                 </h4>
                                 <div className="space-y-1.5">
                                    <button 
                                       onClick={() => setDocVerified(!docVerified)}
                                       className={`w-full p-3 rounded border flex items-center justify-between transition-all ${docVerified ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                                    >
                                       <span className="text-[11px] uppercase tracking-wide">Weryfikacja Tożsamości</span>
                                       {docVerified ? <CheckCircle size={16}/> : <div className="w-4 h-4 rounded-full border border-slate-200"></div>}
                                    </button>
                                    <button 
                                       onClick={() => setBoardingPassIssued(!boardingPassIssued)}
                                       className={`w-full p-3 rounded border flex items-center justify-between transition-all ${boardingPassIssued ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                                    >
                                       <span className="text-[11px] uppercase tracking-wide">Wydanie Karty / Klucza</span>
                                       {boardingPassIssued ? <CheckCircle size={16}/> : <div className="w-4 h-4 rounded-full border border-slate-200"></div>}
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Footer Actions */}
                     <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-3">
                        <button 
                           onClick={() => setActiveReservation(null)}
                           className="px-6 py-3 border border-slate-200 rounded font-black uppercase text-[10px] tracking-widest text-slate-500 hover:bg-slate-100 transition"
                        >
                           Anuluj
                        </button>
                        <button 
                           onClick={handleConfirmCheckIn}
                           disabled={isProcessing || !docVerified || !boardingPassIssued || !!securityAlert}
                           className="flex-1 bg-emerald-600 text-white py-3 rounded font-black uppercase tracking-[0.2em] text-[10px] hover:bg-emerald-700 transition shadow disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
                        >
                           {isProcessing ? <Loader2 className="animate-spin" size={16}/> : <><UserCheck size={18}/> ZATWIERDŹ ODPRAWĘ</>}
                        </button>
                     </div>

                  </div>
               ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg bg-white/50 p-10">
                     <div className="bg-white p-8 rounded shadow-md mb-6 relative">
                        <QrCode size={80} className="text-slate-100" />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <Search size={40} className="text-slate-200 animate-pulse" />
                        </div>
                     </div>
                     <div className="text-center">
                        <h3 className="text-lg font-black text-slate-300 uppercase tracking-widest">Oczekiwanie na identyfikację</h3>
                        <p className="text-xs font-bold text-slate-300 mt-2 max-w-xs mx-auto">Wpisz numer rezerwacji lub zeskanuj bilet pasażera, aby rozpocząć proces odprawy.</p>
                     </div>
                     
                     {/* Przykładowa odprawa (Quick Load) */}
                     <div className="mt-10 pt-10 border-t border-slate-200 w-full max-w-xs">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3 text-center">Funkcje demonstracyjne</p>
                        <button 
                          onClick={handleLoadDemo}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded border border-blue-100 hover:bg-blue-100 transition text-[10px] font-black uppercase tracking-widest"
                        >
                          <Play size={12}/> Zaladuj przykładowy bilet
                        </button>
                     </div>
                  </div>
               )}
            </div>
          </div>
        )}
        
        {activeTab === 'DASHBOARD' && (
          <div className="h-full max-w-7xl mx-auto flex flex-col gap-4 animate-in fade-in duration-500">
             {/* Key Stats Row */}
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow transition group relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:rotate-12 transition-transform"><Users size={48}/></div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Pasażerowie Boarded</p>
                   <div className="flex items-baseline gap-2 relative z-10">
                      <h3 className="text-3xl font-black text-slate-800">{stats.checkedInPax}</h3>
                      <span className="text-xs font-bold text-slate-400">/ {stats.totalPax}</span>
                   </div>
                   <div className="mt-3 w-full bg-slate-100 h-1.5 rounded overflow-hidden">
                      <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${stats.paxPercent}%` }}></div>
                   </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow transition group relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:-rotate-12 transition-transform text-red-500"><UserX size={48}/></div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Nieobecni (Expected)</p>
                   <h3 className="text-3xl font-black text-red-600 relative z-10">{stats.missingPax}</h3>
                   <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase">Weryfikacja Non-Show &rarr;</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow transition group relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:scale-110 transition-transform text-amber-500"><Car size={48}/></div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Pojazdy Odprawione</p>
                   <div className="flex items-baseline gap-2 relative z-10">
                      <h3 className="text-3xl font-black text-slate-800">{stats.checkedInVehicles}</h3>
                      <span className="text-xs font-bold text-slate-400">/ {stats.totalVehicles}</span>
                   </div>
                   <div className="mt-3 w-full bg-slate-100 h-1.5 rounded overflow-hidden">
                      <div className="bg-amber-500 h-full transition-all duration-1000" style={{ width: `${stats.vehiclePercent}%` }}></div>
                   </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow transition group relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:translate-x-2 transition-transform text-emerald-500"><Ship size={48}/></div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Wykorzystane mb Pasa</p>
                   <div className="flex items-baseline gap-2 relative z-10">
                      <h3 className="text-3xl font-black text-slate-800">{voyageData?.laneMetersBooked || 0}</h3>
                      <span className="text-xs font-bold text-slate-400">/ {voyageData?.laneMetersTotal || 1} m</span>
                   </div>
                   <div className="mt-3 w-full bg-slate-100 h-1.5 rounded overflow-hidden">
                      <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${Math.round((voyageData?.laneMetersBooked || 0) / (voyageData?.laneMetersTotal || 1) * 100)}%` }}></div>
                   </div>
                </div>
             </div>

             {/* Main Dashboard Grid */}
             <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
                
                {/* Manifest Table */}
                <div className="lg:col-span-8 flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                   <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                      <div className="flex items-center gap-6">
                         <h4 className="font-black text-slate-800 text-xs uppercase tracking-[0.2em]">Manifest Oczekujących</h4>
                         <div className="flex bg-white p-1 rounded border border-slate-200 shadow-inner gap-0.5">
                            <button 
                               onClick={() => setManifestView('ALL')}
                               className={`px-3 py-1 rounded text-[9px] font-black uppercase transition ${manifestView === 'ALL' ? 'bg-slate-900 text-white shadow' : 'text-slate-400 hover:bg-slate-50'}`}
                            >Wszyscy</button>
                            <button 
                               onClick={() => setManifestView('PAX')}
                               className={`px-3 py-1 rounded text-[9px] font-black uppercase transition ${manifestView === 'PAX' ? 'bg-slate-900 text-white shadow' : 'text-slate-400 hover:bg-slate-50'}`}
                            >Piesi</button>
                            <button 
                               onClick={() => setManifestView('CARGO')}
                               className={`px-3 py-1 rounded text-[9px] font-black uppercase transition ${manifestView === 'CARGO' ? 'bg-slate-900 text-white shadow' : 'text-slate-400 hover:bg-slate-50'}`}
                            >Pojazdy / Cargo</button>
                         </div>
                      </div>
                      <div className="text-slate-400">
                         <ListFilter size={18}/>
                      </div>
                   </div>

                   <div className="flex-1 overflow-y-auto">
                      <table className="w-full text-left text-sm">
                         <thead className="sticky top-0 bg-white border-b border-slate-100 z-10 shadow-sm">
                            <tr className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                               <th className="p-2">ID / Klient</th>
                               <th className="p-2">{manifestView === 'PAX' ? 'Osoba / Zakwaterowanie' : 'Typ / Jednostka'}</th>
                               <th className="p-2">Dokument / Narodowość</th>
                               <th className="p-2 text-right">Odprawa</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-50 text-[12px]">
                            {pendingReservations.length > 0 ? pendingReservations.map(res => (
                               <tr key={res.id} className="hover:bg-slate-50 transition group">
                                  <td className="p-2">
                                     <div className="font-black text-slate-800 text-[13px] tracking-tighter uppercase">{res.id}</div>
                                     <div className="text-[8px] font-black text-slate-400 uppercase tracking-tight truncate max-w-[150px]">{res.passengers[0]?.lastName || 'Brak'} {res.passengers[0]?.firstName || 'Danych'}</div>
                                  </td>
                                  <td className="p-2">
                                     {res.vehicleType !== VehicleType.NONE ? (
                                        <div className="flex items-center gap-2">
                                           <div className="p-1 bg-amber-50 rounded text-amber-600 border border-amber-100">
                                              {res.vehicleType === VehicleType.TRUCK ? <Truck size={12}/> : <Car size={12}/>}
                                           </div>
                                           <div>
                                              <p className="font-mono text-[10px] font-black text-slate-700 tracking-widest">{res.vehicleReg}</p>
                                              <p className="text-[7px] font-bold text-slate-400 uppercase">{res.vehicleType}</p>
                                           </div>
                                        </div>
                                     ) : (
                                        <div className="flex items-center gap-2">
                                           <div className="p-1 bg-blue-50 rounded text-blue-600 border border-blue-100">
                                              {res.cabinType === CabinType.NONE ? <User size={12}/> : <Bed size={12}/>}
                                           </div>
                                           <div>
                                              <p className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{res.cabinType === CabinType.NONE ? 'Miejsce Pokładowe' : `Kabina: ${res.cabinType}`}</p>
                                              {/* Fix: res does not have deck property */}
                                              {res.cabinNumber && <div className="text-[8px] font-mono font-bold text-slate-400">NR: {res.cabinNumber}</div>}
                                           </div>
                                        </div>
                                     )}
                                  </td>
                                  <td className="p-2">
                                     <div>
                                        <div className="font-mono text-[11px] text-slate-700 font-bold">{res.passengers[0]?.documentNumber || 'Brak DOC'}</div>
                                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                                           <Flag size={8} className="text-slate-300"/> {res.passengers[0]?.nationality || 'PL'}
                                        </div>
                                     </div>
                                  </td>
                                  <td className="p-2 text-right">
                                     <button 
                                        onClick={() => handleQuickCheckIn(res.id)}
                                        className="p-1.5 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-all active:scale-90"
                                     >
                                        <CheckCircle size={18}/>
                                     </button>
                                  </td>
                               </tr>
                            )) : (
                               <tr>
                                  <td colSpan={4} className="p-20 text-center text-slate-300">
                                     <Activity size={48} className="mx-auto mb-4 opacity-10" />
                                     <p className="text-[9px] font-black uppercase tracking-[0.3em]">Brak oczekujących</p>
                                  </td>
                               </tr>
                            )}
                         </tbody>
                      </table>
                   </div>
                </div>

                {/* Live Activity Stream */}
                <div className="lg:col-span-4 flex flex-col bg-slate-900 rounded-lg shadow-xl overflow-hidden text-white border border-slate-800">
                   <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/5">
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                         <h4 className="font-black text-[10px] uppercase tracking-widest">Boarding: Live</h4>
                      </div>
                      <span className="text-[8px] font-black bg-blue-600 px-2 py-0.5 rounded-full uppercase tracking-widest">T1</span>
                   </div>

                   <div className="flex-1 overflow-y-auto p-3 space-y-3">
                      {boardedReservations.slice(-10).reverse().map((res, i) => (
                         <div key={`${res.id}-${i}`} className="p-3 bg-white/5 rounded border border-white/5 flex items-center justify-between group hover:bg-white/10 transition animate-in slide-in-from-right-4" style={{ animationDelay: `${i * 100}ms` }}>
                            <div className="flex items-center gap-3">
                               <div className={`w-8 h-8 rounded flex items-center justify-center ${res.vehicleType !== VehicleType.NONE ? 'bg-amber-600/20 text-amber-500' : 'bg-blue-600/20 text-blue-500'}`}>
                                  {res.vehicleType !== VehicleType.NONE ? <Truck size={16}/> : <User size={16}/>}
                               </div>
                               <div>
                                  <div className="font-black text-[13px] uppercase tracking-tighter">{res.vehicleReg || res.id}</div>
                                  <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest truncate max-w-[100px]">{res.passengers[0]?.lastName || 'Brak'}</div>
                               </div>
                            </div>
                            <div className="text-right">
                               <div className="text-[9px] font-black text-slate-400 font-mono">12:4{i}</div>
                               <div className="text-[7px] font-black text-emerald-500 uppercase tracking-[0.2em] mt-0.5 bg-emerald-500/10 px-1.5 py-0.5 rounded">BOARDED</div>
                            </div>
                         </div>
                      ))}
                      {boardedReservations.length === 0 && (
                         <div className="h-full flex flex-col items-center justify-center opacity-20 text-center p-10">
                            <RefreshCw size={32} className="animate-spin-slow mb-4" />
                            <p className="text-[9px] font-black uppercase tracking-widest">Oczekiwanie...</p>
                         </div>
                      )}
                   </div>

                   <div className="p-4 bg-white/5 border-t border-white/5 flex justify-center">
                      <button className="text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition flex items-center gap-2">
                         Dziennik Zdarzeń <ChevronRight size={12}/>
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Custom icons not in main import
const ListChecks = ({ size, className }: { size: number, className?: string }) => (
   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>
);

export default CheckInModule;