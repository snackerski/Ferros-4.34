
import React, { useState } from 'react';
import { Users, Briefcase, TrendingUp, DollarSign, FileText, CheckCircle, AlertCircle, Search, Plus, Filter } from 'lucide-react';
import { MOCK_AGENTS, MOCK_COMMISSION_NOTES } from '../services/mockData';
import { Agent, CommissionThreshold } from '../types';

const AgentModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'LIST' | 'COMMISSIONS' | 'SETTLEMENTS'>('LIST');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for Progressive Commission Simulation (Etap 5.2)
  const [thresholds, setThresholds] = useState<CommissionThreshold[]>([
    { thresholdAmount: 0, commissionRate: 0.05 },
    { thresholdAmount: 50000, commissionRate: 0.07 },
    { thresholdAmount: 100000, commissionRate: 0.10 },
  ]);

  const filteredAgents = MOCK_AGENTS.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-100">
      {/* Sub-navigation Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Briefcase className="text-blue-600" /> Moduł Agencyjny
          </h2>
          <p className="text-xs text-slate-500">Etap 5: Kartoteka, Prowizje, Rozliczenia</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('LIST')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'LIST' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Kartoteka Agentów
          </button>
          <button 
            onClick={() => setActiveTab('COMMISSIONS')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'COMMISSIONS' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Prowizje Progresywne
          </button>
          <button 
            onClick={() => setActiveTab('SETTLEMENTS')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'SETTLEMENTS' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Rozliczenia
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        
        {/* VIEW 1: AGENT LIST (Etap 5.1) */}
        {activeTab === 'LIST' && (
          <div className="space-y-6">
             <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
               <div className="relative w-96">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                   type="text" 
                   placeholder="Szukaj agenta (Nazwa, Kod)..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                 />
               </div>
               <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 flex items-center gap-2">
                 <Plus size={18} /> Dodaj Agenta
               </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredAgents.map(agent => (
                  <div key={agent.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                         <div className={`p-3 rounded-lg ${agent.type === 'INTERNAL' ? 'bg-slate-100 text-slate-600' : 'bg-blue-50 text-blue-600'}`}>
                           <Users size={24} />
                         </div>
                         <div>
                           <h3 className="font-bold text-slate-800">{agent.name}</h3>
                           <p className="text-xs text-slate-500 font-mono">{agent.code}</p>
                         </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${agent.type === 'INTERNAL' ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-600'}`}>
                        {agent.type === 'INTERNAL' ? 'Wewnętrzny' : 'Partner'}
                      </span>
                    </div>
                    
                    <div className="space-y-3 text-sm text-slate-600 mb-6">
                       <div className="flex justify-between border-b border-slate-50 pb-2">
                         <span>Osoba kontaktowa:</span>
                         <span className="font-medium">{agent.contactPerson}</span>
                       </div>
                       <div className="flex justify-between border-b border-slate-50 pb-2">
                         <span>Email:</span>
                         <span className="font-medium">{agent.email}</span>
                       </div>
                       <div className="flex justify-between border-b border-slate-50 pb-2">
                         <span>Prowizja bazowa:</span>
                         <span className="font-bold text-blue-600">{(agent.baseCommission * 100).toFixed(0)}%</span>
                       </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-3">
                       <div className="flex justify-between text-xs text-slate-500 mb-1">
                         <span>Sprzedaż w tym miesiącu</span>
                         <span className="font-bold text-slate-800">{agent.currentMonthSales.toLocaleString()} PLN</span>
                       </div>
                       <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full" 
                            style={{ width: `${Math.min(100, (agent.currentMonthSales / 150000) * 100)}%` }}
                          ></div>
                       </div>
                       <p className="text-[10px] text-slate-400 mt-1 text-right">Cel: 150,000 PLN</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                       <button className="flex-1 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded border border-slate-200 bg-white">
                         Edytuj
                       </button>
                       <button className="flex-1 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded border border-blue-200 bg-white">
                         Użytkownicy
                       </button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* VIEW 2: PROGRESSIVE COMMISSION (Etap 5.2) */}
        {activeTab === 'COMMISSIONS' && (
           <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex gap-4 items-start">
                 <TrendingUp className="text-blue-600 mt-1 flex-shrink-0" />
                 <div>
                    <h3 className="font-bold text-blue-900">Zasady Prowizji Progresywnej</h3>
                    <p className="text-sm text-blue-800 mt-1">
                      System automatycznie przydziela wyższą stawkę prowizyjną po przekroczeniu zdefiniowanych progów sprzedaży w danym miesiącu rozliczeniowym.
                    </p>
                 </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                 <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Progi Prowizyjne (Domyślne)</h3>
                    <button className="text-sm text-blue-600 font-medium hover:underline">+ Dodaj próg</button>
                 </div>
                 
                 <div className="divide-y divide-slate-100">
                    {thresholds.map((rule, idx) => (
                      <div key={idx} className="p-6 flex items-center gap-8 hover:bg-slate-50 transition">
                         <div className="flex-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                              {idx === 0 ? 'Prowizja Startowa' : `Próg #${idx}`}
                            </label>
                            <div className="text-xl font-bold text-slate-800 flex items-center gap-2">
                               {idx === 0 ? 'Od 0 PLN' : `Powyżej ${rule.thresholdAmount.toLocaleString()} PLN`}
                            </div>
                         </div>
                         <div className="flex items-center gap-4">
                            <div className="bg-white border border-slate-300 rounded-lg flex items-center px-3 py-2 shadow-sm">
                               <input 
                                 type="number" 
                                 value={rule.commissionRate * 100} 
                                 className="w-12 text-right font-bold text-lg outline-none bg-white"
                                 readOnly
                               />
                               <span className="text-slate-500 font-bold ml-1">%</span>
                            </div>
                         </div>
                         <div className="text-sm text-slate-500 w-48">
                            {idx === 0 
                              ? 'Stawka podstawowa dla każdego agenta.' 
                              : `Premia za przekroczenie ${rule.thresholdAmount} PLN obrotu.`}
                         </div>
                      </div>
                    ))}
                 </div>
                 <div className="bg-slate-50 p-6 flex justify-end">
                    <button className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800">
                       Zapisz Reguły
                    </button>
                 </div>
              </div>
           </div>
        )}

        {/* VIEW 3: SETTLEMENTS (Etap 5.3) */}
        {activeTab === 'SETTLEMENTS' && (
           <div className="space-y-6">
              <div className="flex justify-between items-center">
                 <h3 className="text-lg font-bold text-slate-800">Noty Prowizyjne</h3>
                 <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-emerald-700 flex items-center gap-2 shadow-sm">
                    <DollarSign size={16} /> Generuj Noty (09/2023)
                 </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 text-xs text-slate-500 uppercase border-b border-slate-200">
                       <tr>
                          <th className="p-4">Nr Noty</th>
                          <th className="p-4">Okres</th>
                          <th className="p-4">Agent</th>
                          <th className="p-4 text-right">Obrót (PLN)</th>
                          <th className="p-4 text-right">Prowizja (PLN)</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4 text-right">Akcje</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                       {MOCK_COMMISSION_NOTES.map(note => {
                          const agent = MOCK_AGENTS.find(a => a.id === note.agentId);
                          return (
                             <tr key={note.id} className="hover:bg-slate-50">
                                <td className="p-4 font-mono font-medium text-slate-700">{note.id}</td>
                                <td className="p-4 text-slate-600">{note.period}</td>
                                <td className="p-4 font-bold text-slate-800">{agent?.name}</td>
                                <td className="p-4 text-right font-mono">{note.totalSales.toLocaleString()}</td>
                                <td className="p-4 text-right font-mono font-bold text-emerald-600">{note.calculatedCommission.toLocaleString()}</td>
                                <td className="p-4 text-center">
                                   <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                      note.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                      note.status === 'APPROVED' ? 'bg-blue-100 text-blue-700' :
                                      'bg-amber-100 text-amber-700'
                                   }`}>
                                      {note.status === 'PAID' ? 'ZAPŁACONA' : note.status === 'APPROVED' ? 'ZATWIERDZONA' : 'SZKIC'}
                                   </span>
                                </td>
                                <td className="p-4 text-right">
                                   <button className="text-blue-600 hover:bg-blue-50 p-2 rounded" title="Podgląd">
                                      <FileText size={16} />
                                   </button>
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

export default AgentModule;
