
import React, { useState } from 'react';
import { AlertTriangle, Clock, Calendar, MessageSquare, Mail, RefreshCw, Ship, UserX, ArrowRight, CheckCircle, Send, AlertOctagon, Anchor, Droplet, FileText, LayoutList, GripHorizontal } from 'lucide-react';
import { MOCK_SAILING_SCHEDULES, MOCK_NOTIFICATION_TEMPLATES } from '../services/mockData';
import { SailingSchedule, SailingStatus, NotificationTemplate } from '../types';

const DisruptionModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SCHEDULE' | 'NOTIFICATIONS'>('SCHEDULE');
  const [viewMode, setViewMode] = useState<'LIST' | 'TIMELINE'>('LIST');
  const [sailings, setSailings] = useState<SailingSchedule[]>(MOCK_SAILING_SCHEDULES);
  const [selectedSailing, setSelectedSailing] = useState<SailingSchedule | null>(null);
  const [modalType, setModalType] = useState<'STATUS' | 'NOTIFY' | 'REPROTECT' | 'PORT_REPORT' | null>(null);

  // Notification State
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [customMessage, setCustomMessage] = useState('');

  const getStatusColor = (status: SailingStatus) => {
     switch(status) {
        case SailingStatus.SCHEDULED: return 'bg-green-100 text-green-700 border-green-200';
        case SailingStatus.DELAYED: return 'bg-amber-100 text-amber-700 border-amber-200';
        case SailingStatus.CANCELLED: return 'bg-red-100 text-red-700 border-red-200';
        default: return 'bg-slate-100 text-slate-700 border-slate-200';
     }
  };

  const handleUpdateStatus = (newStatus: SailingStatus) => {
     if (!selectedSailing) return;
     setSailings(prev => prev.map(s => s.routeId === selectedSailing.routeId ? { ...s, status: newStatus } : s));
     setModalType(null);
     // In a real app, this would trigger Etap 23 automatic notifications if configured
  };

  const handleSendNotification = () => {
     alert(`Wysłano powiadomienia do ${selectedSailing?.paxCount} pasażerów.`);
     setModalType(null);
     setCustomMessage('');
     setSelectedTemplate(null);
  };

  const handleReprotection = () => {
     alert('Etap 22.1: Rezerwacje zostały przeniesione na następny dostępny rejs.');
     setModalType(null);
  };

  const handleSavePortReport = () => {
     alert('Etap 12.5: Raport Wejścia/Wyjścia został zapisany i wysłany do Kapitanatu Portu.');
     setModalType(null);
  }

  return (
    <div className="flex flex-col h-full bg-slate-100">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="text-amber-600" /> Zakłócenia i Zasoby
          </h2>
          <p className="text-xs text-slate-500">Etap 22: Zarządzanie Zasobami • Etap 24: Powiadomienia Pasażerskie</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('SCHEDULE')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'SCHEDULE' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Monitor Rejsów
          </button>
          <button 
            onClick={() => setActiveTab('NOTIFICATIONS')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'NOTIFICATIONS' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Szablony Powiadomień
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
         {activeTab === 'SCHEDULE' && (
            <div className="space-y-6">
               {/* View Switcher */}
               <div className="flex justify-end mb-4">
                  <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm flex">
                     <button 
                        onClick={() => setViewMode('LIST')}
                        className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition ${viewMode === 'LIST' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                     >
                        <LayoutList size={16}/> Lista
                     </button>
                     <button 
                        onClick={() => setViewMode('TIMELINE')}
                        className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition ${viewMode === 'TIMELINE' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                     >
                        <GripHorizontal size={16}/> Oś Czasu (Gantt)
                     </button>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: Sailing List / Timeline */}
                  <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
                     <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                        {viewMode === 'LIST' ? 'Najbliższe Odejścia' : 'Harmonogram Operacyjny (Etap 1.5)'}
                     </div>
                     
                     <div className="flex-1 overflow-y-auto p-2">
                        {viewMode === 'LIST' ? (
                           <div className="space-y-2">
                              {sailings.map(s => (
                                 <div 
                                    key={s.routeId} 
                                    onClick={() => setSelectedSailing(s)}
                                    className={`p-4 border rounded-lg cursor-pointer hover:bg-slate-50 transition ${selectedSailing?.routeId === s.routeId ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-200' : 'border-slate-100'}`}
                                 >
                                    <div className="flex justify-between items-center mb-2">
                                       <span className="font-bold text-slate-800">{s.routeId}</span>
                                       <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(s.status)}`}>
                                          {s.status}
                                       </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                                       <Ship size={14}/> {s.shipName}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                       <Calendar size={14}/> {new Date(s.originalDeparture).toLocaleString()}
                                    </div>
                                    {s.status === SailingStatus.DELAYED && (
                                       <div className="mt-2 text-xs font-bold text-amber-600 flex items-center gap-1 bg-amber-50 p-1 rounded">
                                          <Clock size={12}/> Nowy czas: {new Date(s.actualDeparture).toLocaleTimeString()}
                                       </div>
                                    )}
                                 </div>
                              ))}
                           </div>
                        ) : (
                           /* Visual Timeline Mockup */
                           <div className="space-y-4">
                              {['m/f Polonia', 'm/f Skania', 'm/f Wolin', 'm/f Epsilon', 'm/f Gryf', 'm/f Galileo'].map(ship => (
                                 <div key={ship} className="border border-slate-200 rounded-lg p-2 bg-slate-50">
                                    <div className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1"><Ship size={12}/> {ship}</div>
                                    <div className="relative h-12 bg-white border border-slate-200 rounded overflow-hidden">
                                       {/* Time markers */}
                                       <div className="absolute top-0 bottom-0 left-1/4 w-px bg-slate-100"></div>
                                       <div className="absolute top-0 bottom-0 left-2/4 w-px bg-slate-100"></div>
                                       <div className="absolute top-0 bottom-0 left-3/4 w-px bg-slate-100"></div>
                                       
                                       {/* Sailing Bars */}
                                       {sailings.filter(s => s.shipName === ship).map(s => (
                                          <div 
                                             key={s.routeId}
                                             onClick={() => setSelectedSailing(s)}
                                             className={`absolute top-2 bottom-2 rounded cursor-pointer flex items-center justify-center text-[10px] font-bold text-white shadow-sm hover:brightness-110 transition ${
                                                s.status === SailingStatus.CANCELLED ? 'bg-red-500' : 
                                                s.status === SailingStatus.DELAYED ? 'bg-amber-500' : 'bg-blue-500'
                                             }`}
                                             style={{ 
                                                left: '20%', 
                                                width: '40%', 
                                                // In real app, calculate left/width based on time
                                             }}
                                          >
                                             {s.routeId}
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              ))}
                              <div className="text-xs text-slate-400 text-center mt-4">
                                 Widok 24h. Linie pionowe oznaczają godziny 06:00, 12:00, 18:00.
                              </div>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Right: Detail & Actions */}
                  <div className="lg:col-span-2">
                     {selectedSailing ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                           {/* Info Card */}
                           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                              <div className="flex justify-between items-start mb-6">
                                 <div>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-1">{selectedSailing.routeId} - {selectedSailing.shipName}</h2>
                                    <p className="text-slate-500">Planowane: {new Date(selectedSailing.originalDeparture).toLocaleString()}</p>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Obłożenie</p>
                                    <div className="flex gap-4">
                                       <div>
                                          <span className="font-bold text-xl block">{selectedSailing.paxCount}</span>
                                          <span className="text-xs text-slate-400">PAX</span>
                                       </div>
                                       <div>
                                          <span className="font-bold text-xl block">{selectedSailing.cargoMeterCount}m</span>
                                          <span className="text-xs text-slate-400">CARGO</span>
                                       </div>
                                    </div>
                                 </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                 <button 
                                    onClick={() => setModalType('STATUS')}
                                    className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition flex flex-col items-center gap-2 bg-white group"
                                 >
                                    <div className="bg-blue-100 p-2 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition"><RefreshCw size={24}/></div>
                                    <span className="font-bold text-slate-700 text-sm">Status / Prom</span>
                                 </button>
                                 
                                 <button 
                                    onClick={() => setModalType('NOTIFY')}
                                    className="p-4 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50 transition flex flex-col items-center gap-2 bg-white group"
                                 >
                                    <div className="bg-amber-100 p-2 rounded-full text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition"><MessageSquare size={24}/></div>
                                    <span className="font-bold text-slate-700 text-sm">Powiadomienia</span>
                                 </button>

                                 <button 
                                    onClick={() => setModalType('REPROTECT')}
                                    disabled={selectedSailing.status !== SailingStatus.CANCELLED}
                                    className={`p-4 rounded-xl border transition flex flex-col items-center gap-2 bg-white group ${
                                       selectedSailing.status === SailingStatus.CANCELLED 
                                          ? 'border-slate-200 hover:border-red-400 hover:bg-red-50 cursor-pointer' 
                                          : 'opacity-50 cursor-not-allowed border-slate-100'
                                    }`}
                                 >
                                    <div className={`p-2 rounded-full transition ${selectedSailing.status === SailingStatus.CANCELLED ? 'bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white' : 'bg-slate-100 text-slate-400'}`}>
                                       <UserX size={24}/>
                                    </div>
                                    <span className="font-bold text-slate-700 text-sm">Reprotekcja</span>
                                 </button>

                                 <button 
                                    onClick={() => setModalType('PORT_REPORT')}
                                    className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition flex flex-col items-center gap-2 bg-white group"
                                 >
                                    <div className="bg-indigo-100 p-2 rounded-full text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition"><FileText size={24}/></div>
                                    <span className="font-bold text-slate-700 text-sm">Raport Portowy</span>
                                 </button>
                              </div>
                           </div>

                           {/* Operational Log Mockup */}
                           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                              <h3 className="font-bold text-slate-800 mb-4">Dziennik Operacyjny Rejsu</h3>
                              <div className="space-y-4">
                                 <div className="flex gap-4">
                                    <div className="text-xs font-mono text-slate-500 pt-1">10:00</div>
                                    <div className="pb-4 border-l-2 border-slate-100 pl-4 relative">
                                       <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-200 border-2 border-white"></div>
                                       <p className="text-sm font-bold text-slate-700">Utworzenie listy pasażerskiej</p>
                                       <p className="text-xs text-slate-500">System automatyczny</p>
                                    </div>
                                 </div>
                                 <div className="flex gap-4">
                                    <div className="text-xs font-mono text-slate-500 pt-1">12:30</div>
                                    <div className="pb-4 border-l-2 border-slate-100 pl-4 relative">
                                       <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-200 border-2 border-white"></div>
                                       <p className="text-sm font-bold text-slate-700">Otwarcie odprawy</p>
                                       <p className="text-xs text-slate-500">Maciej Fiszer (Manager)</p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                           <AlertOctagon size={48} className="mb-4 opacity-50"/>
                           <p>Wybierz rejs z listy lub osi czasu, aby zarządzać zakłóceniami.</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         )}

         {activeTab === 'NOTIFICATIONS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="font-bold text-slate-800 mb-4">Szablony Wiadomości (Etap 23.1)</h3>
                  <div className="space-y-3">
                     {MOCK_NOTIFICATION_TEMPLATES.map(tpl => (
                        <div key={tpl.id} className="p-4 border rounded-lg hover:bg-slate-50 cursor-pointer">
                           <div className="flex justify-between items-center mb-2">
                              <span className="font-bold text-sm text-slate-700">{tpl.name}</span>
                              <span className="text-[10px] uppercase font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-500">{tpl.type}</span>
                           </div>
                           <p className="text-xs text-slate-500 italic">"{tpl.contentPattern}"</p>
                        </div>
                     ))}
                     <button className="w-full py-2 border border-dashed border-slate-300 rounded text-slate-500 text-sm font-bold hover:bg-slate-50 hover:text-blue-600 transition">
                        + Dodaj Nowy Szablon
                     </button>
                  </div>
               </div>
               
               <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
                  <h3 className="font-bold text-blue-900 mb-4">Logi Wysłanych Powiadomień</h3>
                  <div className="text-sm text-blue-800 space-y-2">
                     <p>Brak ostatnich wysyłek masowych.</p>
                  </div>
               </div>
            </div>
         )}
      </div>

      {/* MODALS */}
      {modalType && selectedSailing && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg animate-in fade-in zoom-in duration-200">
               {modalType === 'STATUS' && (
                  <>
                     <h3 className="text-xl font-bold mb-4">Zmiana Statusu Rejsu</h3>
                     <div className="space-y-4">
                        <button onClick={() => handleUpdateStatus(SailingStatus.DELAYED)} className="w-full p-3 bg-amber-50 text-amber-700 border border-amber-200 rounded font-bold hover:bg-amber-100">
                           Zgłoś Opóźnienie
                        </button>
                        <button onClick={() => handleUpdateStatus(SailingStatus.CANCELLED)} className="w-full p-3 bg-red-50 text-red-700 border border-red-200 rounded font-bold hover:bg-red-100">
                           ANULUJ REJS
                        </button>
                        <button onClick={() => handleUpdateStatus(SailingStatus.SCHEDULED)} className="w-full p-3 bg-green-50 text-green-700 border border-green-200 rounded font-bold hover:bg-green-100">
                           Przywróć Planowy
                        </button>
                        <hr />
                        <button onClick={() => setModalType(null)} className="w-full p-2 text-slate-500 hover:text-slate-700">Anuluj</button>
                     </div>
                  </>
               )}

               {modalType === 'NOTIFY' && (
                  <>
                     <h3 className="text-xl font-bold mb-4">Wyślij Powiadomienia</h3>
                     <div className="space-y-4">
                        <div>
                           <label className="block text-sm font-bold text-slate-700 mb-1">Wybierz Szablon</label>
                           <select 
                              className="w-full border p-2 rounded bg-white"
                              onChange={(e) => {
                                 const tpl = MOCK_NOTIFICATION_TEMPLATES.find(t => t.id === e.target.value);
                                 setSelectedTemplate(tpl || null);
                                 setCustomMessage(tpl ? tpl.contentPattern.replace('{routeId}', selectedSailing.routeId).replace('{delay}', '60') : '');
                              }}
                           >
                              <option value="">-- Wybierz --</option>
                              {MOCK_NOTIFICATION_TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                           </select>
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-slate-700 mb-1">Treść Wiadomości</label>
                           <textarea 
                              className="w-full border p-2 rounded h-32 bg-white" 
                              value={customMessage}
                              onChange={e => setCustomMessage(e.target.value)}
                           ></textarea>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded text-xs text-yellow-800 border border-yellow-200">
                           Wyślesz wiadomość do <strong>{selectedSailing.paxCount}</strong> pasażerów.
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => setModalType(null)} className="flex-1 p-2 border rounded text-slate-600">Anuluj</button>
                           <button onClick={handleSendNotification} className="flex-1 p-2 bg-blue-600 text-white rounded font-bold flex items-center justify-center gap-2">
                              <Send size={16}/> Wyślij
                           </button>
                        </div>
                     </div>
                  </>
               )}
               
               {modalType === 'REPROTECT' && (
                  <>
                     <h3 className="text-xl font-bold mb-4">Reprotekcja Pasażerów</h3>
                     <p className="text-sm text-slate-500 mb-4">
                        Przenoszenie {selectedSailing.paxCount} pasażerów z anulowanego rejsu {selectedSailing.routeId}.
                     </p>
                     <div className="space-y-4">
                        <div className="p-4 border rounded bg-slate-50">
                           <span className="text-xs font-bold uppercase text-slate-400">Docelowy Rejs</span>
                           <div className="font-bold text-slate-800">R001 (Jutro, 18:00)</div>
                           <div className="text-green-600 text-xs font-bold mt-1">Dostępne miejsca: OK</div>
                        </div>
                        <button onClick={handleReprotection} className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700">
                           Potwierdź Przeniesienie
                        </button>
                        <button onClick={() => setModalType(null)} className="w-full py-2 text-slate-500">Anuluj</button>
                     </div>
                  </>
               )}

               {modalType === 'PORT_REPORT' && (
                  <>
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Raport Wejścia/Wyjścia (Etap 12.5)</h3>
                        <div className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded">Kapitanat Portu</div>
                     </div>
                     <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Czas Rzeczywisty (ATA/ATD)</label>
                              <input type="datetime-local" className="w-full border p-2 rounded text-sm" defaultValue={selectedSailing.actualDeparture.slice(0, 16)}/>
                           </div>
                           <div>
                              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Zanurzenie (Draft)</label>
                              <div className="flex items-center gap-2">
                                 <input type="number" className="w-full border p-2 rounded text-sm" defaultValue={5.8} step={0.1}/>
                                 <span className="text-xs text-slate-500">m</span>
                              </div>
                           </div>
                        </div>

                        <div className="bg-slate-50 p-3 rounded border border-slate-200">
                           <div className="font-bold text-sm text-slate-700 mb-2 flex items-center gap-2"><Droplet size={14}/> Stany Robocze</div>
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <label className="block text-xs text-slate-500 mb-1">Bunkier (HFO/MGO)</label>
                                 <input type="number" className="w-full border p-2 rounded text-sm bg-white" placeholder="Tony" defaultValue={150}/>
                              </div>
                              <div>
                                 <label className="block text-xs text-slate-500 mb-1">Woda Słodka</label>
                                 <input type="number" className="w-full border p-2 rounded text-sm bg-white" placeholder="Tony" defaultValue={40}/>
                              </div>
                           </div>
                        </div>

                        <div>
                           <label className="flex items-center gap-2 text-sm text-slate-700 mb-2 font-bold">
                              <input type="checkbox" className="w-4 h-4 text-indigo-600"/> Usługi Portowe
                           </label>
                           <div className="grid grid-cols-2 gap-2 text-sm ml-6">
                              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked/> Asysta Pilota</label>
                              <label className="flex items-center gap-2"><input type="checkbox"/> Holowniki</label>
                              <label className="flex items-center gap-2"><input type="checkbox"/> Odbiór śmieci</label>
                              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked/> Cumownicy</label>
                           </div>
                        </div>
                     </div>
                     <div className="mt-6 flex gap-2">
                        <button onClick={() => setModalType(null)} className="w-1/3 py-2 text-slate-500 hover:text-slate-700">Anuluj</button>
                        <button onClick={handleSavePortReport} className="w-2/3 bg-indigo-600 text-white py-2 rounded font-bold hover:bg-indigo-700 flex items-center justify-center gap-2">
                           <Send size={16}/> Wyślij Raport
                        </button>
                     </div>
                  </>
               )}
            </div>
         </div>
      )}
    </div>
  );
};

export default DisruptionModule;
