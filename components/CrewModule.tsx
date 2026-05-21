
import React, { useState } from 'react';
import { Users, FileBadge, Clock, AlertTriangle, ShieldCheck, UserCheck, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { MOCK_CREW, MOCK_CREW_CERTIFICATES, MOCK_WORK_LOGS } from '../services/mockData';
import { CrewMember, CrewRank, CrewCertificate } from '../types';

const CrewModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ROSTER' | 'CERTIFICATES' | 'WORK_REST'>('ROSTER');
  const [selectedCrew, setSelectedCrew] = useState<CrewMember | null>(null);

  // Stats
  const activeCrewCount = MOCK_CREW.filter(c => c.status === 'ON_BOARD').length;
  const expiredCertsCount = MOCK_CREW_CERTIFICATES.filter(c => c.status === 'EXPIRED' || c.status === 'WARNING').length;

  const getRankBadge = (rank: CrewRank) => {
     const colors: Record<string, string> = {
        'Kapitan': 'bg-slate-800 text-white',
        'Oficer': 'bg-blue-800 text-white',
        'Mechanik': 'bg-amber-700 text-white',
        'Kucharz': 'bg-white border text-slate-600',
        'Steward': 'bg-blue-100 text-blue-800'
     };
     return <span className={`px-2 py-1 rounded text-xs font-bold ${colors[rank] || 'bg-slate-100 text-slate-600'}`}>{rank}</span>;
  };

  const getCertStatusColor = (status: string) => {
     switch(status) {
        case 'VALID': return 'bg-green-100 text-green-700';
        case 'WARNING': return 'bg-amber-100 text-amber-700';
        case 'EXPIRED': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-600';
     }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-blue-600" /> Kadry Morskie (Crewing)
          </h2>
          <p className="text-xs text-slate-500">Etap 45: Kartoteki, Certyfikaty, Czas Pracy</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('ROSTER')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'ROSTER' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Lista Załogi
          </button>
          <button 
            onClick={() => setActiveTab('CERTIFICATES')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'CERTIFICATES' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Monitor Certyfikatów
          </button>
          <button 
            onClick={() => setActiveTab('WORK_REST')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'WORK_REST' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Czas Pracy (MLC)
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
         
         {/* DASHBOARD STATS */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
               <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Users size={24}/></div>
               <div>
                  <div className="text-2xl font-bold text-slate-800">{activeCrewCount} / {MOCK_CREW.length}</div>
                  <div className="text-xs text-slate-500 uppercase font-bold">Obecnie na Burcie</div>
               </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
               <div className="bg-amber-100 p-3 rounded-full text-amber-600"><FileBadge size={24}/></div>
               <div>
                  <div className="text-2xl font-bold text-slate-800">{expiredCertsCount}</div>
                  <div className="text-xs text-slate-500 uppercase font-bold">Wygasające Dokumenty</div>
               </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
               <div className="bg-red-100 p-3 rounded-full text-red-600"><Clock size={24}/></div>
               <div>
                  <div className="text-2xl font-bold text-slate-800">1</div>
                  <div className="text-xs text-slate-500 uppercase font-bold">Naruszenia Czasu Pracy (24h)</div>
               </div>
            </div>
         </div>

         {/* === TAB 1: ROSTER === */}
         {activeTab === 'ROSTER' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                     <h3 className="font-bold text-slate-800">Lista Marynarzy</h3>
                     <button className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-blue-700">+ Dodaj Osobę</button>
                  </div>
                  <table className="w-full text-left text-sm">
                     <thead className="bg-white text-slate-500 uppercase text-xs border-b border-slate-200">
                        <tr>
                           <th className="p-4">Nazwisko i Imię</th>
                           <th className="p-4">Stanowisko</th>
                           <th className="p-4">Dokument</th>
                           <th className="p-4">Status</th>
                           <th className="p-4 text-right">Akcje</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {MOCK_CREW.map(crew => (
                           <tr key={crew.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedCrew(crew)}>
                              <td className="p-4 font-bold text-slate-800">{crew.lastName} {crew.firstName}</td>
                              <td className="p-4">{getRankBadge(crew.rank)}</td>
                              <td className="p-4 font-mono text-slate-500">{crew.documentNumber}</td>
                              <td className="p-4">
                                 {crew.status === 'ON_BOARD' 
                                    ? <span className="text-green-600 font-bold flex items-center gap-1"><UserCheck size={14}/> NA STATKU</span> 
                                    : <span className="text-slate-400 font-bold">W DOMU</span>
                                 }
                              </td>
                              <td className="p-4 text-right">
                                 <button className="text-blue-600 hover:underline text-xs font-bold">Szczegóły</button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                     <ShieldCheck size={20} className="text-emerald-600"/> Przydział Alarmowy (Muster List)
                  </h3>
                  {selectedCrew ? (
                     <div className="space-y-4 animate-in fade-in">
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                           <div className="text-lg font-bold text-slate-800">{selectedCrew.lastName} {selectedCrew.firstName}</div>
                           <div className="text-sm text-slate-500">{selectedCrew.rank}</div>
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Alarm Pożarowy</label>
                           <select className="w-full border p-2 rounded text-sm bg-white">
                              <option>Grupa Pożarowa 1 (Dowódca)</option>
                              <option>Grupa Pożarowa 2</option>
                              <option>Zabezpieczenie techniczne</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Alarm Opuszczenia Statku</label>
                           <select className="w-full border p-2 rounded text-sm bg-white">
                              <option>Łódź Ratunkowa nr 1 (Sternik)</option>
                              <option>Tratwa nr 4</option>
                              <option>Muster Station A (Kontrola)</option>
                           </select>
                        </div>
                        <button className="w-full bg-emerald-600 text-white py-2 rounded font-bold text-sm hover:bg-emerald-700">Zapisz Przydział</button>
                     </div>
                  ) : (
                     <p className="text-slate-400 text-sm text-center py-8">Wybierz członka załogi z listy, aby edytować przydział alarmowy.</p>
                  )}
               </div>
            </div>
         )}

         {/* === TAB 2: CERTIFICATES === */}
         {activeTab === 'CERTIFICATES' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                     <FileBadge size={20} className="text-slate-500"/> Ewidencja Dokumentów (STCW)
                  </h3>
                  <div className="text-xs text-slate-500">System Traffic Lights: <span className="text-green-600 font-bold">OK</span> • <span className="text-amber-600 font-bold">Warning (90 dni)</span> • <span className="text-red-600 font-bold">Expired</span></div>
               </div>
               <table className="w-full text-left text-sm">
                  <thead className="bg-white text-slate-500 uppercase text-xs border-b border-slate-200">
                     <tr>
                        <th className="p-4">Osoba</th>
                        <th className="p-4">Dokument / Szkolenie</th>
                        <th className="p-4">Wydano</th>
                        <th className="p-4">Ważne Do</th>
                        <th className="p-4 text-center">Pozostało</th>
                        <th className="p-4 text-center">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {MOCK_CREW_CERTIFICATES.map(cert => {
                        const person = MOCK_CREW.find(c => c.id === cert.crewId);
                        const daysLeft = Math.ceil((new Date(cert.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                        const progress = Math.max(0, Math.min(100, (daysLeft / 1825) * 100)); // Approx 5 years max

                        return (
                           <tr key={cert.id} className="hover:bg-slate-50">
                              <td className="p-4 font-bold text-slate-700">{person?.lastName} {person?.firstName}</td>
                              <td className="p-4">
                                 <div>{cert.name}</div>
                                 <div className="text-[10px] text-slate-400 uppercase">{cert.type}</div>
                              </td>
                              <td className="p-4 text-slate-500">{cert.issueDate}</td>
                              <td className="p-4 font-mono">{cert.expiryDate}</td>
                              <td className="p-4 w-48">
                                 <div className="flex justify-between text-xs mb-1">
                                    <span>{daysLeft} dni</span>
                                 </div>
                                 <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div className={`h-2 rounded-full ${cert.status === 'VALID' ? 'bg-green-500' : cert.status === 'WARNING' ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${progress}%` }}></div>
                                 </div>
                              </td>
                              <td className="p-4 text-center">
                                 <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getCertStatusColor(cert.status)}`}>
                                    {cert.status}
                                 </span>
                              </td>
                           </tr>
                        )
                     })}
                  </tbody>
               </table>
            </div>
         )}

         {/* === TAB 3: WORK & REST HOURS (MLC) === */}
         {activeTab === 'WORK_REST' && (
            <div className="max-w-5xl mx-auto space-y-6">
               <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 flex justify-between items-center">
                  <div>
                     <h3 className="font-bold text-blue-900 text-lg flex items-center gap-2"><Clock size={24}/> Rejestr Czasu Pracy</h3>
                     <p className="text-sm text-blue-700 mt-1">Zgodność z konwencją MLC 2006 (Min. 10h odpoczynku w ciągu 24h).</p>
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-md">
                     Generuj Raport Miesięczny
                  </button>
               </div>

               <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-sm">
                     <thead className="bg-white text-slate-500 uppercase text-xs border-b border-slate-200">
                        <tr>
                           <th className="p-4">Data</th>
                           <th className="p-4">Marynarz</th>
                           <th className="p-4">Godziny Pracy</th>
                           <th className="p-4 text-right">Czas Pracy</th>
                           <th className="p-4 text-right">Czas Odpoczynku</th>
                           <th className="p-4 text-center">Zgodność MLC</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {MOCK_WORK_LOGS.map(log => {
                           const person = MOCK_CREW.find(c => c.id === log.crewId);
                           const workHours = 24 - log.restHours;
                           return (
                              <tr key={log.id} className="hover:bg-slate-50">
                                 <td className="p-4 text-slate-600">{log.date}</td>
                                 <td className="p-4 font-bold text-slate-800">{person?.lastName} {person?.firstName}</td>
                                 <td className="p-4 font-mono text-xs bg-slate-50 w-fit px-2 rounded">
                                    {log.workStart} - {log.workEnd}
                                 </td>
                                 <td className="p-4 text-right font-bold">{workHours}h</td>
                                 <td className="p-4 text-right font-bold text-blue-600">{log.restHours}h</td>
                                 <td className="p-4 text-center">
                                    {log.violation ? (
                                       <span className="flex items-center justify-center gap-1 text-red-600 font-bold text-xs bg-red-50 px-2 py-1 rounded">
                                          <AlertTriangle size={12}/> NARUSZENIE
                                       </span>
                                    ) : (
                                       <span className="flex items-center justify-center gap-1 text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded">
                                          <CheckCircle size={12}/> OK
                                       </span>
                                    )}
                                 </td>
                              </tr>
                           )
                        })}
                     </tbody>
                  </table>
               </div>
            </div>
         )}

      </div>
    </div>
  );
};

export default CrewModule;
