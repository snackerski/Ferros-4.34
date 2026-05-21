import React, { useState, useEffect } from 'react';
import { Server, Activity, FileText, Anchor, Database, RefreshCw, Upload, Download, CheckCircle, AlertTriangle, AlertCircle, PlayCircle, StopCircle, HardDrive, Globe, Zap, Flag, Send, Camera, Shield, Unlock, Lock, Users, LogIn, LogOut, Clock, BadgeCheck, Code, Truck, User, Droplet, Video, Power, Minus, X, UserX, Printer } from 'lucide-react';
import { MOCK_PORT_GATES, MOCK_INTEGRATION_TASKS, MOCK_SYSTEM_DOCUMENTS, MOCK_ROUTES, MOCK_EXTERNAL_CHANNELS, MOCK_PHICS_TRANSACTIONS, MOCK_GATE_TELEMETRY, MOCK_GATE_EVENTS, MOCK_CREW, MOCK_VISITORS, MOCK_API_LOGS, MOCK_SAILING_SCHEDULES, MOCK_RESERVATIONS } from '../services/mockData';
import { PortGate, IntegrationTask, SystemDocument, PHICSTransaction, GateTelemetry, GateEvent, CrewMember, VisitorLogEntry, SecurityLevel, CrewRank, ApiLogEntry, SailingSchedule, SailingStatus, BookingStatus } from '../types';
import { useTranslation } from '../i18n';

const OperationsModule: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'PORT_OPS' | 'SMART_GATES' | 'INTEGRATIONS' | 'DMS' | 'PHICS' | 'CREW_ISPS'>('PORT_OPS');
  const [checkInStatus, setCheckInStatus] = useState<Record<string, boolean>>({ 'R001': true, 'R002': false });
  const [phicsTransactions, setPhicsTransactions] = useState<PHICSTransaction[]>(MOCK_PHICS_TRANSACTIONS);
  const [selectedSailingForReport, setSelectedSailingForReport] = useState<SailingSchedule | null>(null);
  
  // Etap 7.9: Check-in Closure State
  const [routeForClosure, setRouteForClosure] = useState<string | null>(null);
  const [closureStats, setClosureStats] = useState({ booked: 0, checkedIn: 0, nonShow: 0 });

  // SmartGate State
  const [gateTelemetry, setGateTelemetry] = useState<GateTelemetry[]>(MOCK_GATE_TELEMETRY);
  const [gateEvents, setGateEvents] = useState<GateEvent[]>(MOCK_GATE_EVENTS);

  // Crew & ISPS State (Etap 38)
  const [crewList, setCrewList] = useState<CrewMember[]>(MOCK_CREW);
  const [visitorLog, setVisitorLog] = useState<VisitorLogEntry[]>(MOCK_VISITORS);
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>(SecurityLevel.LEVEL_1);
  const [newVisitor, setNewVisitor] = useState<Partial<VisitorLogEntry>>({ firstName: '', lastName: '', company: '', purpose: '', idCardNumber: '' });

  // Etap 43.4: API Logs State
  const [apiLogs, setApiLogs] = useState<ApiLogEntry[]>(MOCK_API_LOGS);

  const handleCheckInAction = (routeId: string) => {
    const isOpen = checkInStatus[routeId];
    
    if (isOpen) {
       // Proceed to Close Logic (Open Modal)
       const routeRes = MOCK_RESERVATIONS.filter(r => r.routeId === routeId && r.status !== BookingStatus.CANCELLED);
       const checkedIn = routeRes.filter(r => r.status === BookingStatus.CHECKED_IN).length;
       setClosureStats({
          booked: routeRes.length,
          checkedIn: checkedIn,
          nonShow: routeRes.length - checkedIn
       });
       setRouteForClosure(routeId);
    } else {
       // Just Open
       setCheckInStatus(prev => ({ ...prev, [routeId]: true }));
       alert(t('ops.port.status.open') + `: ${routeId}.`);
    }
  };

  const confirmClosure = () => {
     if (routeForClosure) {
        setCheckInStatus(prev => ({ ...prev, [routeForClosure]: false }));
        alert(t('ops.port.status.closed') + `: ${routeForClosure}.`);
        setRouteForClosure(null);
     }
  };

  const handleSendPHICS = (routeId: string) => {
     const newTx: PHICSTransaction = {
        id: `PHICS-${Date.now()}`,
        voyageId: routeId,
        submissionDate: new Date().toISOString(),
        paxCount: 450, // Mock
        crewCount: crewList.filter(c => c.status === 'ON_BOARD').length,
        status: 'SENT'
     };
     setPhicsTransactions([newTx, ...phicsTransactions]);
     alert(t('ops.phics.send_btn') + `: ${routeId}.`);
  };

  const handleGateControl = (gateId: string, action: 'OPEN' | 'CLOSE' | 'AUTO') => {
     setGateTelemetry(prev => prev.map(g => {
        if (g.gateId === gateId) {
           const updatedSensors = g.sensors.map(s => {
              if (s.type === 'BARRIER') return { ...s, value: action === 'OPEN' ? 'OPEN' : 'CLOSED' };
              return s;
           });
           return { 
              ...g, 
              mode: action === 'AUTO' ? 'AUTO' : (action === 'OPEN' ? 'MANUAL_OPEN' : 'MANUAL_CLOSE'),
              sensors: updatedSensors
           };
        }
        return g;
     }));
  };

  // Etap 38 Logic
  const handleCheckInVisitor = () => {
     if (!newVisitor.firstName || !newVisitor.lastName) return;
     const visitor: VisitorLogEntry = {
        ...newVisitor as VisitorLogEntry,
        id: `VIS-${Date.now()}`,
        checkInTime: new Date().toLocaleString(),
        status: 'ON_BOARD'
     };
     setVisitorLog([visitor, ...visitorLog]);
     setNewVisitor({ firstName: '', lastName: '', company: '', purpose: '', idCardNumber: '' });
  };

  const handleCheckOutVisitor = (id: string) => {
     setVisitorLog(prev => prev.map(v => v.id === id ? { ...v, status: 'CHECKED_OUT', checkOutTime: new Date().toLocaleString() } : v));
  };

  const getISPSDescription = (level: SecurityLevel) => {
      switch(level) {
          case SecurityLevel.LEVEL_1: return t('ops.isps.level1_desc');
          case SecurityLevel.LEVEL_2: return t('ops.isps.level2_desc');
          case SecurityLevel.LEVEL_3: return t('ops.isps.level3_desc');
          default: return "";
      }
  };

  const handleChangeSecurityLevel = (level: SecurityLevel) => {
     if (level === securityLevel) return;
     if (confirm(t('ops.isps.confirm_change', { level }))) {
        setSecurityLevel(level);
     }
  };

  const handleSavePortReport = () => {
     alert(t('ops.port.port_report') + " - " + t('ops.phics.data_complete') + " 100%.");
     setSelectedSailingForReport(null);
  }

  // Etap 43.4: Simulate API Call
  const handleSimulateApiCall = (channelName: string) => {
     const newLog: ApiLogEntry = {
        id: `API-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        channel: channelName,
        method: 'POST',
        endpoint: '/api/v2/booking/create',
        status: 201,
        latency: Math.floor(Math.random() * 300) + 50,
        payloadSnippet: `{"route": "R001", "pax": ${Math.floor(Math.random() * 4) + 1}}`
     };
     setApiLogs([newLog, ...apiLogs]);
  };

  return (
    <div className="flex flex-col h-full bg-slate-100">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-10 overflow-x-auto">
        <div className="flex-shrink-0 mr-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Server className="text-slate-600" /> {t('ops.title')}
          </h2>
          <p className="text-xs text-slate-500">{t('ops.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('PORT_OPS')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'PORT_OPS' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {t('ops.tabs.port')}
          </button>
          <button 
            onClick={() => setActiveTab('CREW_ISPS')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'CREW_ISPS' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {t('ops.tabs.crew_isps')}
          </button>
          <button 
            onClick={() => setActiveTab('SMART_GATES')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'SMART_GATES' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {t('ops.tabs.smart_gates')}
          </button>
          <button 
            onClick={() => setActiveTab('INTEGRATIONS')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'INTEGRATIONS' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {t('ops.tabs.integrations')}
          </button>
          <button 
            onClick={() => setActiveTab('PHICS')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'PHICS' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {t('ops.tabs.phics')}
          </button>
          <button 
            onClick={() => setActiveTab('DMS')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'DMS' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {t('ops.tabs.dms')}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        
        {/* === TAB 1: PORT OPERATIONS (Etap 7.9) === */}
        {activeTab === 'PORT_OPS' && (
          <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                   <Anchor size={20} className="text-blue-600"/> {t('ops.port.checkin_sessions')}
                </h3>
                <div className="space-y-4">
                   {MOCK_ROUTES.map(route => {
                      const isCheckInOpen = checkInStatus[route.id];
                      const totalPax = 900;
                      const checkedIn = isCheckInOpen ? Math.floor(Math.random() * 200) + 100 : 0;
                      const progress = (checkedIn / totalPax) * 100;

                      return (
                        <div key={route.id} className={`flex flex-col md:flex-row justify-between items-center p-4 border rounded-xl transition shadow-sm ${isCheckInOpen ? 'bg-white border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                           <div className="flex-1 w-full md:w-auto mb-4 md:mb-0">
                              <div className="flex items-center gap-3">
                                 <span className="font-black text-xl text-slate-800">{route.id}</span>
                                 <span className="text-slate-600 font-medium">{route.shipName}</span>
                                 <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${isCheckInOpen ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                    {isCheckInOpen ? t('ops.port.status.open') : t('ops.port.status.closed')}
                                 </span>
                              </div>
                              <div className="text-xs text-slate-400 mt-1 flex gap-3">
                                 <span>{t('book.departure')}: {new Date(route.departureTime).toLocaleString()}</span>
                                 <span>•</span>
                                 <span>{t('res.route')}: {route.origin} - {route.destination}</span>
                              </div>
                              
                              {isCheckInOpen && (
                                 <div className="mt-3 w-full max-w-md">
                                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                       <span>{t('ops.port.progress')}</span>
                                       <span>{checkedIn} / {totalPax}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                       <div className="bg-green-500 h-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                                    </div>
                                 </div>
                              )}
                           </div>

                           <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                              <button 
                                 onClick={() => setSelectedSailingForReport(MOCK_SAILING_SCHEDULES.find(s => s.routeId === route.id) || null)}
                                 className="text-xs font-bold text-slate-600 hover:text-blue-600 bg-white border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 transition flex items-center gap-2"
                              >
                                 <FileText size={14}/> {t('ops.port.port_report')}
                              </button>
                              
                              <button 
                                 onClick={() => handleCheckInAction(route.id)}
                                 className={`px-4 py-2 rounded-lg text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95 ${
                                    isCheckInOpen 
                                    ? 'bg-red-600 hover:bg-red-700' 
                                    : 'bg-green-600 hover:bg-green-700'
                                 }`}
                              >
                                 {isCheckInOpen ? (
                                    <><Lock size={16}/> {t('ops.port.close_checkin')}</>
                                 ) : (
                                    <><Unlock size={16}/> {t('ops.port.open_checkin')}</>
                                 )}
                              </button>
                           </div>
                        </div>
                      );
                   })}
                </div>
             </div>
          </div>
        )}

        {/* --- MODAL: CHECK-IN CLOSURE (Etap 7.9) --- */}
        {routeForClosure && (
           <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in duration-200 overflow-hidden flex flex-col">
                 <div className="bg-red-600 text-white p-6 flex justify-between items-center">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                       <AlertTriangle size={24} className="text-red-200"/> {t('ops.port.closure_title')}
                    </h3>
                    <button onClick={() => setRouteForClosure(null)} className="text-red-200 hover:text-white transition"><X size={24}/></button>
                 </div>
                 
                 <div className="p-8 space-y-6">
                    <div className="text-center">
                       <p className="text-slate-500 uppercase text-xs font-bold mb-1">Zamykasz rejs</p>
                       <h2 className="text-3xl font-black text-slate-800">{routeForClosure}</h2>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-3">
                       <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">{t('ops.port.closure_booked')}</span>
                          <span className="font-bold text-slate-800">{closureStats.booked}</span>
                       </div>
                       <div className="flex justify-between items-center text-green-700">
                          <span className="font-medium flex items-center gap-2"><CheckCircle size={16}/> {t('ops.port.closure_checked')}</span>
                          <span className="font-bold">{closureStats.checkedIn}</span>
                       </div>
                       <div className="border-t border-slate-200 my-2"></div>
                       <div className="flex justify-between items-center text-red-600">
                          <span className="font-bold flex items-center gap-2"><UserX size={16}/> {t('ops.port.closure_nonshow')}</span>
                          <span className="font-bold text-xl">{closureStats.nonShow}</span>
                       </div>
                    </div>

                    {closureStats.nonShow > 0 && (
                       <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-3 text-amber-800 text-sm">
                          <AlertCircle size={20} className="shrink-0 mt-0.5"/>
                          <p>{t('ops.port.closure_warning')}</p>
                       </div>
                    )}

                    <div className="space-y-3">
                       <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition">
                          <input type="checkbox" className="w-5 h-5 text-red-600 rounded" defaultChecked />
                          <div className="text-sm">
                             <span className="font-bold text-slate-700 block">{t('ops.port.closure_report_check')}</span>
                             <span className="text-slate-500 text-xs">{t('ops.port.closure_report_desc')}</span>
                          </div>
                          <Printer size={16} className="ml-auto text-slate-400"/>
                       </label>
                    </div>

                    <div className="flex gap-3 pt-2">
                       <button 
                          onClick={() => setRouteForClosure(null)}
                          className="flex-1 py-3 border border-slate-300 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition"
                       >
                          {t('common.cancel')}
                       </button>
                       <button 
                          onClick={confirmClosure}
                          className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition flex items-center justify-center gap-2"
                       >
                          <Lock size={18}/> {t('ops.port.confirm_closure')}
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* Port Report Modal */}
        {selectedSailingForReport && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
               <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg animate-in fade-in zoom-in duration-200">
                  <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">{t('ops.port.port_report')}</h3>
                        <div className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded">Kapitanat Portu</div>
                  </div>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">{t('ops.port.ata_atd')}</label>
                              <input type="datetime-local" className="w-full border p-2 rounded text-sm bg-white" defaultValue={selectedSailingForReport.actualDeparture.slice(0, 16)}/>
                           </div>
                           <div>
                              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">{t('ops.port.draft')}</label>
                              <div className="flex items-center gap-2">
                                 <input type="number" className="w-full border p-2 rounded text-sm bg-white" defaultValue={5.8} step={0.1}/>
                                 <span className="text-xs text-slate-500">m</span>
                              </div>
                           </div>
                        </div>

                        <div className="bg-slate-50 p-3 rounded border border-slate-200">
                           <div className="font-bold text-sm text-slate-700 mb-2 flex items-center gap-2"><Droplet size={14}/> Stany Robocze</div>
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <label className="block text-xs text-slate-500 mb-1">{t('ops.port.bunker')}</label>
                                 <input type="number" className="w-full border p-2 rounded text-sm bg-white" placeholder="Tony" defaultValue={150}/>
                              </div>
                              <div>
                                 <label className="block text-xs text-slate-500 mb-1">{t('ops.port.fresh_water')}</label>
                                 <input type="number" className="w-full border p-2 rounded text-sm bg-white" placeholder="Tony" defaultValue={40}/>
                              </div>
                           </div>
                        </div>

                        <div>
                           <label className="flex items-center gap-2 text-sm text-slate-700 mb-2 font-bold">
                              <input type="checkbox" className="w-4 h-4 text-indigo-600"/> {t('ops.port.services')}
                           </label>
                           <div className="grid grid-cols-2 gap-2 text-sm ml-6">
                              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked/> {t('ops.port.pilot')}</label>
                              <label className="flex items-center gap-2"><input type="checkbox"/> {t('ops.port.tugs')}</label>
                              <label className="flex items-center gap-2"><input type="checkbox"/> {t('ops.port.waste')}</label>
                              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked/> {t('ops.port.mooring')}</label>
                           </div>
                        </div>
                  </div>
                  <div className="mt-6 flex gap-2">
                        <button onClick={() => setSelectedSailingForReport(null)} className="w-1/3 py-2 text-slate-500 hover:text-slate-700">{t('common.cancel')}</button>
                        <button onClick={handleSavePortReport} className="w-2/3 bg-indigo-600 text-white py-2 rounded font-bold hover:bg-indigo-700 flex items-center justify-center gap-2">
                           <Send size={16}/> {t('ops.port.send_report')}
                        </button>
                  </div>
               </div>
            </div>
        )}

        {/* === TAB 2: CREW & ISPS (Etap 38) === */}
        {activeTab === 'CREW_ISPS' && (
           <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6">
                 <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                       <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                          <Shield size={28} className={
                             securityLevel === SecurityLevel.LEVEL_1 ? 'text-green-600' :
                             securityLevel === SecurityLevel.LEVEL_2 ? 'text-amber-500' : 'text-red-600'
                          }/> {t('ops.isps.title')}
                       </h3>
                       <p className="text-sm text-slate-500">{t('ops.isps.subtitle')}</p>
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                       {[SecurityLevel.LEVEL_1, SecurityLevel.LEVEL_2, SecurityLevel.LEVEL_3].map((lvl) => (
                          <button 
                             key={lvl}
                             onClick={() => handleChangeSecurityLevel(lvl)}
                             className={`px-6 py-2 rounded-md font-bold text-sm transition-all ${
                                securityLevel === lvl 
                                ? (lvl === SecurityLevel.LEVEL_1 ? 'bg-green-600 text-white shadow-md' : 
                                   lvl === SecurityLevel.LEVEL_2 ? 'bg-amber-500 text-white shadow-md' : 
                                   'bg-red-600 text-white shadow-md animate-pulse')
                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
                             }`}
                          >
                             {lvl === SecurityLevel.LEVEL_1 ? t('ops.isps.level1') : lvl === SecurityLevel.LEVEL_2 ? t('ops.isps.level2') : t('ops.isps.level3')}
                          </button>
                       ))}
                    </div>
                 </div>
                 
                 <div className={`p-4 rounded-lg border ${
                    securityLevel === SecurityLevel.LEVEL_1 ? 'bg-green-50 border-green-200 text-green-800' :
                    securityLevel === SecurityLevel.LEVEL_2 ? 'bg-amber-50 border-amber-200 text-amber-800' :
                    'bg-red-50 border-red-200 text-red-800'
                 } transition-colors duration-300`}>
                    <div className="flex items-start gap-3">
                       <AlertCircle className="mt-0.5 shrink-0" size={20}/>
                       <div>
                          <h4 className="font-bold text-sm uppercase mb-1">Status: {securityLevel}</h4>
                          <p className="text-sm opacity-90">{getISPSDescription(securityLevel)}</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700 flex justify-between items-center">
                       <span>{t('ops.crew.roster')}</span>
                       <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">{crewList.filter(c => c.status === 'ON_BOARD').length} {t('ops.crew.on_board')}</span>
                    </div>
                    <table className="w-full text-left text-sm">
                       <thead className="bg-white text-slate-500 uppercase text-xs border-b border-slate-200">
                          <tr>
                             <th className="p-3">{t('ops.crew.name')}</th>
                             <th className="p-3">{t('ops.crew.rank')}</th>
                             <th className="p-3 text-center">{t('common.status')}</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          {crewList.map(crew => (
                             <tr key={crew.id} className="hover:bg-slate-50">
                                <td className="p-3 font-bold text-slate-700">{crew.lastName} {crew.firstName}</td>
                                <td className="p-3 text-slate-500">{crew.rank}</td>
                                <td className="p-3 text-center">
                                   {crew.status === 'ON_BOARD' ? (
                                      <span className="text-green-600 font-bold text-xs">{t('ops.crew.status_onboard')}</span>
                                   ) : (
                                      <span className="text-slate-400 text-xs">{t('ops.crew.status_home')}</span>
                                   )}
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>

                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                       {t('ops.visitor.title')}
                    </div>
                    
                    <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-2">
                       <div className="grid grid-cols-2 gap-2">
                          <input type="text" placeholder={t('res.modal.first_name')} className="border p-2 rounded text-sm bg-white" value={newVisitor.firstName} onChange={e => setNewVisitor({...newVisitor, firstName: e.target.value})}/>
                          <input type="text" placeholder={t('res.modal.last_name')} className="border p-2 rounded text-sm bg-white" value={newVisitor.lastName} onChange={e => setNewVisitor({...newVisitor, lastName: e.target.value})}/>
                          <input type="text" placeholder={t('ops.visitor.company')} className="border p-2 rounded text-sm bg-white" value={newVisitor.company} onChange={e => setNewVisitor({...newVisitor, company: e.target.value})}/>
                          <input type="text" placeholder={t('ops.visitor.purpose')} className="border p-2 rounded text-sm bg-white" value={newVisitor.purpose} onChange={e => setNewVisitor({...newVisitor, purpose: e.target.value})}/>
                       </div>
                       <button onClick={handleCheckInVisitor} className="w-full bg-blue-600 text-white py-2 rounded font-bold text-sm hover:bg-blue-700">{t('ops.visitor.reg_entry')}</button>
                    </div>

                    <div className="max-h-64 overflow-y-auto">
                       <table className="w-full text-left text-sm">
                          <thead className="bg-white text-slate-500 uppercase text-xs">
                             <tr>
                                <th className="p-3">Gość</th>
                                <th className="p-3">{t('ops.visitor.checkin_time')}</th>
                                <th className="p-3 text-right">Akcja</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {visitorLog.map(visitor => (
                                <tr key={visitor.id} className="hover:bg-slate-50">
                                   <td className="p-3">
                                      <div className="font-bold text-slate-700">{visitor.lastName} {visitor.firstName}</div>
                                      <div className="text-xs text-slate-500">{visitor.company}</div>
                                   </td>
                                   <td className="p-3 text-xs text-slate-500">{visitor.checkInTime}</td>
                                   <td className="p-3 text-right">
                                      {visitor.status === 'ON_BOARD' ? (
                                         <button onClick={() => handleCheckOutVisitor(visitor.id)} className="text-red-600 font-bold text-xs hover:underline">{t('ops.visitor.checkout')}</button>
                                      ) : (
                                         <span className="text-slate-400 text-xs">Wyszdedł: {visitor.checkOutTime}</span>
                                      )}
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* === TAB 3: SMART GATES === */}
        {activeTab === 'SMART_GATES' && (
           <div className="h-full flex flex-col gap-6 animate-fade-in">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 shrink-0">
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                       <p className="text-xs font-bold text-slate-400 uppercase">{t('ops.gates.active')}</p>
                       <h3 className="text-2xl font-bold text-slate-800">3 <span className="text-sm font-normal text-slate-400">/ 4</span></h3>
                    </div>
                    <div className="bg-green-100 p-2 rounded-lg text-green-600"><Power size={20}/></div>
                 </div>
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                       <p className="text-xs font-bold text-slate-400 uppercase">{t('ops.gates.throughput')}</p>
                       <h3 className="text-2xl font-bold text-slate-800">120 <span className="text-sm font-normal text-slate-400">poj/h</span></h3>
                    </div>
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Activity size={20}/></div>
                 </div>
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                       <p className="text-xs font-bold text-slate-400 uppercase">{t('ops.gates.alerts')}</p>
                       <h3 className="text-2xl font-bold text-slate-800">2</h3>
                    </div>
                    <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><AlertTriangle size={20}/></div>
                 </div>
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                       <p className="text-xs font-bold text-slate-400 uppercase">{t('ops.gates.lpr_acc')}</p>
                       <h3 className="text-2xl font-bold text-slate-800">98.5%</h3>
                    </div>
                    <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><Camera size={20}/></div>
                 </div>
              </div>

              <div className="flex-1 flex gap-6 overflow-hidden">
                 <div className="flex-1 overflow-y-auto grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {gateTelemetry.map(gate => {
                       const lprData = gate.sensors.find(s => s.type === 'CAMERA_LPR');
                       const barrierData = gate.sensors.find(s => s.type === 'BARRIER');
                       const loopData = gate.sensors.find(s => s.type === 'LOOP');
                       const opticalData = gate.sensors.find(s => s.type === 'OPTICAL');

                       return (
                          <div key={gate.gateId} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <div className="flex items-center gap-3">
                                   <div className={`w-3 h-3 rounded-full ${gate.status === 'OK' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                   <h4 className="font-bold text-slate-800">{gate.gateId}</h4>
                                </div>
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${gate.mode === 'AUTO' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                                   Tryb: {gate.mode}
                                </span>
                             </div>

                             <div className="p-6 grid grid-cols-2 gap-6 flex-1">
                                <div className="bg-black rounded-lg relative overflow-hidden flex items-center justify-center min-h-[140px]">
                                   <Video className="text-slate-700 absolute top-2 right-2" size={16}/>
                                   {lprData?.value && lprData.value !== '-' ? (
                                       <div className="text-center">
                                          <Truck size={48} className="text-slate-500 mx-auto opacity-50"/>
                                          <div className="text-xs text-green-400 font-mono mt-2">{t('ops.gates.lpr_detected')}</div>
                                       </div>
                                   ) : (
                                       <div className="text-slate-600 text-xs">{t('ops.gates.lpr_idle')}</div>
                                   )}
                                   
                                   <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 flex justify-between items-center">
                                       <div className="flex gap-2 text-[10px] text-white font-mono">
                                          <span>CAM-01</span>
                                          <span className="text-green-400">REC</span>
                                       </div>
                                       <Activity size={12} className="text-green-500"/>
                                   </div>
                                </div>

                                <div className="flex flex-col justify-between gap-4">
                                   <div className="bg-slate-100 border-2 border-slate-300 rounded-lg p-3 text-center relative shadow-inner">
                                       <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-[9px] px-2 py-0.5 rounded uppercase font-bold">
                                          LPR / ANPR
                                       </div>
                                       {lprData?.value && lprData.value !== '-' ? (
                                          <div className="font-mono text-2xl font-black text-slate-800 tracking-widest">{lprData.value}</div>
                                       ) : (
                                          <div className="font-mono text-xl font-bold text-slate-300 tracking-widest">-- --- --</div>
                                       )}
                                   </div>

                                   <div className="flex items-center gap-3 bg-slate-50 p-2 rounded border border-slate-100">
                                       <div className={`p-2 rounded-full ${barrierData?.value === 'OPEN' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                          {barrierData?.value === 'OPEN' ? <Unlock size={18}/> : <Lock size={18}/>}
                                       </div>
                                       <div>
                                          <div className="text-[10px] text-slate-400 uppercase font-bold">{t('ops.gates.barrier')}</div>
                                          <div className="font-bold text-sm">{barrierData?.value === 'OPEN' ? t('ops.gates.barrier_open') : t('ops.gates.barrier_closed')}</div>
                                       </div>
                                   </div>

                                   <div className="grid grid-cols-2 gap-2 text-[10px]">
                                      <div className={`flex items-center gap-1 p-1 rounded ${loopData?.value === 'DETECTED' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400'}`}>
                                         <div className={`w-2 h-2 rounded-full ${loopData?.value === 'DETECTED' ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
                                         {t('ops.gates.sensor_loop')}
                                      </div>
                                      <div className={`flex items-center gap-1 p-1 rounded ${opticalData?.value === 'BLOCKED' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-400'}`}>
                                         <div className={`w-2 h-2 rounded-full ${opticalData?.value === 'BLOCKED' ? 'bg-red-500' : 'bg-slate-300'}`}></div>
                                         {t('ops.gates.sensor_photo')}
                                      </div>
                                   </div>
                                </div>
                             </div>

                             <div className="p-3 bg-slate-50 border-t border-slate-200 grid grid-cols-3 gap-2">
                                <button onClick={() => handleGateControl(gate.gateId, 'AUTO')} className={`py-2 rounded text-xs font-bold transition ${gate.mode === 'AUTO' ? 'bg-blue-600 text-white shadow' : 'bg-white border text-slate-600 hover:bg-slate-100'}`}>
                                   {t('ops.gates.mode_auto')}
                                </button>
                                <button onClick={() => handleGateControl(gate.gateId, 'OPEN')} className={`py-2 rounded text-xs font-bold transition ${gate.mode === 'MANUAL_OPEN' ? 'bg-green-600 text-white shadow' : 'bg-white border text-green-700 hover:bg-green-50'}`}>
                                   {t('ops.gates.mode_open')}
                                </button>
                                <button onClick={() => handleGateControl(gate.gateId, 'CLOSE')} className={`py-2 rounded text-xs font-bold transition ${gate.mode === 'MANUAL_CLOSE' ? 'bg-red-600 text-white shadow' : 'bg-white border text-red-700 hover:bg-red-50'}`}>
                                   {t('ops.gates.mode_close')}
                                </button>
                             </div>
                          </div>
                       );
                    })}
                 </div>

                 <div className="w-80 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-200 font-bold text-slate-700 flex justify-between items-center bg-slate-50">
                       <span>{t('ops.gates.live_events')}</span>
                       <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                          <span className="text-[10px] text-slate-400 uppercase">Real-time</span>
                       </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                       {gateEvents.map(event => (
                          <div key={event.id} className="p-3 rounded border border-slate-100 bg-white hover:bg-slate-50 transition text-xs">
                             <div className="flex justify-between text-slate-400 mb-1">
                                <span>{event.timestamp.split(' ')[1]}</span>
                                <span className="font-bold text-slate-500">{event.gateId}</span>
                             </div>
                             <div className="font-medium text-slate-800 mb-1">{event.description}</div>
                             <div className="flex items-center gap-1">
                                {event.severity === 'INFO' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
                                {event.severity === 'WARNING' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
                                {event.severity === 'CRITICAL' && <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>}
                                <span className={`text-[10px] uppercase font-bold ${
                                   event.severity === 'INFO' ? 'text-blue-500' :
                                   event.severity === 'WARNING' ? 'text-amber-500' : 'text-red-500'
                                }`}>{event.type}</span>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* === TAB 2: INTEGRATIONS === */}
        {activeTab === 'INTEGRATIONS' && (
           <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-slate-500 text-xs font-bold uppercase mb-2">{t('ops.integrations.external')}</div>
                    <div className="flex items-center gap-3">
                       <Database className="text-blue-500" size={24}/>
                       <span className="text-2xl font-bold text-slate-800">7</span>
                    </div>
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-slate-500 text-xs font-bold uppercase mb-2">{t('ops.integrations.api_traffic')}</div>
                    <div className="flex items-center gap-3">
                       <Activity className="text-green-500" size={24}/>
                       <span className="text-2xl font-bold text-slate-800">12.5k Req</span>
                    </div>
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-slate-500 text-xs font-bold uppercase mb-2">{t('ops.integrations.overall')}</div>
                    <div className="flex items-center gap-3">
                       <CheckCircle className="text-green-500" size={24}/>
                       <span className="text-2xl font-bold text-slate-800">Operational</span>
                    </div>
                 </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                 <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                       <Globe size={20} className="text-indigo-600"/> {t('ops.integrations.channels')}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{t('ops.integrations.channels_desc')}</p>
                 </div>
                 <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {MOCK_EXTERNAL_CHANNELS.map(channel => (
                       <div key={channel.id} className="border border-slate-200 rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition">
                          <div className="flex justify-between items-start mb-3">
                             <div className="font-bold text-slate-800">{channel.name}</div>
                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                channel.status === 'ONLINE' ? 'bg-green-100 text-green-700' : 
                                channel.status === 'MAINTENANCE' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                             }`}>
                                {channel.status}
                             </span>
                          </div>
                          <div className="space-y-2 text-sm text-slate-600 mb-4">
                             <div className="flex justify-between">
                                <span>{t('ops.integrations.today_res')}</span>
                                <span className="font-bold">{channel.bookingsToday}</span>
                             </div>
                             <div className="flex justify-between">
                                <span>{t('ops.integrations.api_ver')}</span>
                                <span className="font-mono text-xs bg-slate-100 px-1 rounded">{channel.apiVersion}</span>
                             </div>
                             <div className="flex justify-between text-xs text-slate-400">
                                <span>{t('ops.integrations.last_sync')}</span>
                                <span>{channel.lastSync.split(' ')[1]}</span>
                             </div>
                          </div>
                          <div className="flex gap-2">
                             <button className="flex-1 py-1.5 border border-slate-200 rounded text-xs font-bold hover:bg-slate-50 text-slate-600">
                                {t('admin.tabs.audit')}
                             </button>
                             <button 
                                onClick={() => handleSimulateApiCall(channel.name)}
                                className="flex-1 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs font-bold hover:bg-blue-100 flex items-center justify-center gap-1"
                             >
                                <Zap size={12}/> {t('ops.integrations.test_btn')}
                             </button>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                 <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                       <Code size={20} className="text-slate-500"/> {t('ops.integrations.monitor')}
                    </h3>
                    <span className="text-xs font-mono bg-slate-800 text-green-400 px-2 py-1 rounded">
                       STATUS: LISTENING
                    </span>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm font-mono">
                       <thead className="bg-slate-900 text-slate-400 text-xs">
                          <tr>
                             <th className="p-3">Time</th>
                             <th className="p-3">Channel</th>
                             <th className="p-3">Method</th>
                             <th className="p-3">Endpoint</th>
                             <th className="p-3">Status</th>
                             <th className="p-3 text-right">Latency</th>
                             <th className="p-3">Payload (Snippet)</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          {apiLogs.map(log => (
                             <tr key={log.id} className="hover:bg-slate-50 transition animate-in fade-in slide-in-from-left-2">
                                <td className="p-3 text-slate-500">{log.timestamp.split(',')[1]}</td>
                                <td className="p-3 font-bold text-slate-700">{log.channel}</td>
                                <td className="p-3">
                                   <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${log.method === 'POST' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{log.method}</span>
                                </td>
                                <td className="p-3 text-slate-600">{log.endpoint}</td>
                                <td className="p-3">
                                   <span className={`text-[10px] font-bold ${log.status >= 400 ? 'text-red-600' : 'text-green-600'}`}>
                                      {log.status}
                                   </span>
                                </td>
                                <td className="p-3 text-right text-slate-500">{log.latency}ms</td>
                                <td className="p-3 text-xs text-slate-400 truncate max-w-xs">{log.payloadSnippet}</td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                 <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">{t('ops.integrations.sync_batch')}</h3>
                    <button className="flex items-center gap-2 bg-white border border-slate-300 px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-50 hover:border-blue-300 transition">
                       <RefreshCw size={14}/> {t('ops.integrations.force_sync')}
                    </button>
                 </div>
                 <table className="w-full text-left text-sm">
                    <thead className="bg-white text-slate-500 uppercase text-xs border-b border-slate-200">
                       <tr>
                          <th className="p-4">Zadanie ID</th>
                          <th className="p-4">System Zewnętrzny</th>
                          <th className="p-4">Kierunek</th>
                          <th className="p-4">Czas Wykonania</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Komunikat</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {MOCK_INTEGRATION_TASKS.map(task => (
                          <tr key={task.id} className="hover:bg-slate-50">
                             <td className="p-4 font-mono text-slate-600">{task.id}</td>
                             <td className="p-4 font-bold text-slate-800">{task.systemName}</td>
                             <td className="p-4">
                                {task.direction === 'IMPORT' 
                                   ? <span className="flex items-center gap-1 text-blue-600 text-xs font-bold"><Download size={12}/> IMPORT</span> 
                                   : <span className="flex items-center gap-1 text-purple-600 text-xs font-bold"><Upload size={12}/> EXPORT</span>
                                }
                             </td>
                             <td className="p-4 text-slate-500">{task.lastSync}</td>
                             <td className="p-4">
                                {task.status === 'SUCCESS' && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">SUKCES</span>}
                                {task.status === 'FAILED' && <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">BŁĄD</span>}
                                {task.status === 'PENDING' && <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold">W TOKU</span>}
                             </td>
                             <td className="p-4 text-slate-600 italic text-xs truncate max-w-xs" title={task.message}>
                                {task.message}
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}

        {activeTab === 'PHICS' && (
           <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                 <div>
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                       <Flag size={24} className="text-red-600"/> {t('ops.phics.title')}
                    </h3>
                    <p className="text-sm text-slate-500">{t('ops.phics.desc')}</p>
                 </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h4 className="font-bold text-slate-700 mb-4">{t('ops.phics.gen_report')}</h4>
                    <div className="space-y-4">
                       <div>
                          <label className="block text-sm font-bold text-slate-600 mb-1">{t('ops.phics.sailing_select')}</label>
                          <select className="w-full border p-2 rounded text-sm bg-white">
                             {MOCK_ROUTES.map(r => <option key={r.id} value={r.id}>{r.id} - {r.shipName} ({r.departureTime})</option>)}
                          </select>
                       </div>
                       
                       <div className="bg-slate-50 p-4 rounded border border-slate-200 text-sm space-y-2">
                          <div className="flex justify-between"><span>{t('ops.phics.pax_count')}</span> <strong>450</strong></div>
                          <div className="flex justify-between"><span>{t('ops.phics.crew_count')}</span> <strong>{crewList.filter(c => c.status === 'ON_BOARD').length}</strong></div>
                          <div className="flex justify-between text-green-600"><span>{t('ops.phics.data_complete')}</span> <strong>100%</strong></div>
                       </div>

                       <button 
                          onClick={() => handleSendPHICS('R001')}
                          className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 flex items-center justify-center gap-2"
                       >
                          <Send size={18}/> {t('ops.phics.send_btn')}
                       </button>
                    </div>
                 </div>
                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-700">
                       {t('ops.phics.history')}
                    </div>
                    <div className="divide-y divide-slate-100">
                       {phicsTransactions.map(tx => (
                          <div key={tx.id} className="p-4 hover:bg-slate-50">
                             <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-slate-800">{tx.voyageId}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                   tx.status === 'ACKNOWLEDGED' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                                }`}>
                                   {tx.status}
                                </span>
                             </div>
                             <div className="text-xs text-slate-500 flex justify-between">
                                <span>{tx.submissionDate}</span>
                                {tx.ackReference && <span className="font-mono">{tx.ackReference}</span>}
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'DMS' && (
           <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                 <div>
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                       <HardDrive className="text-slate-500" size={20}/> {t('ops.dms.title')}
                    </h3>
                    <p className="text-sm text-slate-500">{t('ops.dms.subtitle')}</p>
                 </div>
                 <div className="flex gap-2">
                    <input type="text" placeholder={t('ops.dms.search')} className="border p-2 rounded text-sm bg-white" />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded font-bold text-sm flex items-center gap-2">
                       <Upload size={16}/> {t('ops.dms.add_btn')}
                    </button>
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {MOCK_SYSTEM_DOCUMENTS.map(doc => (
                    <div key={doc.id} className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition group">
                       <div className="flex justify-between items-start mb-4">
                          <div className="bg-slate-100 p-3 rounded-lg text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition">
                             <FileText size={24}/>
                          </div>
                          <button className="text-slate-400 hover:text-blue-600"><Download size={18}/></button>
                       </div>
                       <h4 className="font-bold text-slate-800 text-sm mb-1 truncate" title={doc.name}>{doc.name}</h4>
                       <div className="flex justify-between items-center mt-4 text-xs text-slate-500">
                          <span className="bg-slate-100 px-2 py-0.5 rounded uppercase font-bold text-slate-600">{doc.category}</span>
                          <span>{doc.size}</span>
                       </div>
                       <div className="border-t border-slate-100 mt-3 pt-2 text-[10px] text-slate-400 flex justify-between">
                          <span>{doc.uploadDate}</span>
                          <span>Autor: {doc.author}</span>
                       </div>
                    </div>
                 ))}
                 
                 <div className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-6 text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition cursor-pointer">
                    <Upload size={32} className="mb-2"/>
                    <span className="text-sm font-bold">{t('ops.dms.drop')}</span>
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default OperationsModule;