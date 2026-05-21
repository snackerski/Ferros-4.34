
import React, { useState } from 'react';
import { ClipboardList, Coins, Lock, Save, Anchor, Printer, AlertTriangle, CheckCircle, FileText, X, History, Calendar, UserX, UserCheck } from 'lucide-react';
import { MOCK_ACTIVE_SHIFT, MOCK_VOYAGE_REPORTS, MOCK_RESERVATIONS, MOCK_SHIFT_HISTORY } from '../services/mockData';
import { CashierShift, VoyageReport, BookingStatus } from '../types';

interface DiscrepancyModalProps {
   voyageId: string;
   onClose: () => void;
   onConfirm: (processedIds: string[]) => void;
}

const DiscrepancyModal: React.FC<DiscrepancyModalProps> = ({ voyageId, onClose, onConfirm }) => {
   // Logic: Find reservations for this voyage that are PAID/CONFIRMED but NOT Checked-In
   const nonShows = MOCK_RESERVATIONS.filter(r => 
      r.routeId === voyageId && 
      (r.status === BookingStatus.PAID || r.status === BookingStatus.CONFIRMED)
   );

   // Logic: Find checked-in but created last minute (Go-Show) - simulated by filter
   const goShows = MOCK_RESERVATIONS.filter(r =>
      r.routeId === voyageId &&
      r.status === BookingStatus.CHECKED_IN &&
      r.bookingDate === '2023-10-25' // Assume today
   );

   const [processedIds, setProcessedIds] = useState<string[]>([]);

   const handleProcessAll = () => {
      const ids = nonShows.map(r => r.id);
      onConfirm(ids);
   };

   return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
         <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-800 text-white p-6 flex justify-between items-center rounded-t-xl">
               <h3 className="font-bold text-xl flex items-center gap-2"><AlertTriangle className="text-amber-400"/> Raport Różnic Odprawy (Etap 12.2)</h3>
               <button onClick={onClose}><X size={24}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* NON-SHOWS */}
                  <div className="bg-white rounded-lg border border-red-200 shadow-sm overflow-hidden">
                     <div className="p-4 bg-red-50 border-b border-red-100 flex justify-between items-center">
                        <h4 className="font-bold text-red-800 flex items-center gap-2"><UserX size={18}/> Non-Show (Nie zgłosił się)</h4>
                        <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs font-bold">{nonShows.length}</span>
                     </div>
                     <div className="p-2 space-y-2 max-h-64 overflow-y-auto">
                        {nonShows.length > 0 ? nonShows.map(r => (
                           <div key={r.id} className="p-3 border rounded flex justify-between items-center hover:bg-slate-50">
                              <div>
                                 <div className="font-bold text-sm text-slate-800">{r.passengers[0]?.lastName}</div>
                                 <div className="text-xs text-slate-500">{r.id} • {r.vehicleType}</div>
                              </div>
                              <div className="text-right">
                                 <div className="font-bold text-sm text-slate-700">{r.totalPrice} PLN</div>
                                 <span className="text-[10px] text-red-600 font-bold uppercase">Brak Odprawy</span>
                              </div>
                           </div>
                        )) : (
                           <p className="text-center py-8 text-slate-400 text-sm">Brak pasażerów non-show.</p>
                        )}
                     </div>
                  </div>

                  {/* GO-SHOWS */}
                  <div className="bg-white rounded-lg border border-green-200 shadow-sm overflow-hidden">
                     <div className="p-4 bg-green-50 border-b border-green-100 flex justify-between items-center">
                        <h4 className="font-bold text-green-800 flex items-center gap-2"><UserCheck size={18}/> Go-Show (Odprawieni dodatkowo)</h4>
                        <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs font-bold">{goShows.length}</span>
                     </div>
                     <div className="p-2 space-y-2 max-h-64 overflow-y-auto">
                        {goShows.map(r => (
                           <div key={r.id} className="p-3 border rounded flex justify-between items-center hover:bg-slate-50">
                              <div>
                                 <div className="font-bold text-sm text-slate-800">{r.passengers[0]?.lastName}</div>
                                 <div className="text-xs text-slate-500">{r.id} • {r.vehicleType}</div>
                              </div>
                              <div className="text-right">
                                 <div className="font-bold text-sm text-slate-700">{r.totalPrice} PLN</div>
                                 <span className="text-[10px] text-green-600 font-bold uppercase">OK</span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-6 border-t border-slate-200 bg-white flex justify-end gap-3 rounded-b-xl">
               <button onClick={onClose} className="px-6 py-2 border border-slate-300 rounded-lg font-bold text-slate-600 hover:bg-slate-50">Zamknij</button>
               <button 
                  onClick={handleProcessAll}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 shadow-md disabled:opacity-50"
                  disabled={nonShows.length === 0}
               >
                  Zatwierdź Non-Show (Etap 37.9)
               </button>
            </div>
         </div>
      </div>
   );
};

const ShiftModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SHIFT' | 'VOYAGE' | 'HISTORY'>('SHIFT');
  const [shift, setShift] = useState<CashierShift>(MOCK_ACTIVE_SHIFT);
  const [declaredCash, setDeclaredCash] = useState({ PLN: '', EUR: '', SEK: '' });
  const [activeReport, setActiveReport] = useState<VoyageReport | null>(null);
  const [isDiscrepancyModalOpen, setIsDiscrepancyModalOpen] = useState(false);

  const calculateDifference = (currency: 'PLN' | 'EUR' | 'SEK') => {
    const declared = parseFloat(declaredCash[currency] || '0');
    const expected = shift.expectedCash[currency];
    return declared - expected;
  };

  const handleCloseShift = () => {
    const diffPLN = calculateDifference('PLN');
    const diffEUR = calculateDifference('EUR');
    const diffSEK = calculateDifference('SEK');
    
    // In a real app, send this to backend
    setShift({
       ...shift,
       status: 'CLOSED',
       closedAt: new Date().toLocaleString(),
       declaredCash: {
          PLN: parseFloat(declaredCash.PLN || '0'),
          EUR: parseFloat(declaredCash.EUR || '0'),
          SEK: parseFloat(declaredCash.SEK || '0')
       },
       difference: {
          PLN: diffPLN,
          EUR: diffEUR,
          SEK: diffSEK
       }
    });
    alert('Zmiana została zamknięta. Raport kasowy wygenerowany (Etap 14.1).');
  };

  const handleCloseVoyage = () => {
     if (!activeReport) return;
     // Mock update
     alert(`Rejs ${activeReport.routeId} został zamknięty. Manifest pasażerski i ładunkowy zablokowany (Etap 37.9/12.2).`);
  };

  const handleConfirmDiscrepancies = (ids: string[]) => {
     alert(`Zatwierdzono ${ids.length} rezerwacji jako NON-SHOW. Zwolniono zasoby.`);
     setIsDiscrepancyModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-100">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="text-slate-600" /> Rozliczenia Zmian
          </h2>
          <p className="text-xs text-slate-500">Etap 14 (Kasjer), 12 (Rejs) & 10.8 (Historia)</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('SHIFT')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'SHIFT' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Bieżąca Zmiana
          </button>
          <button 
            onClick={() => setActiveTab('HISTORY')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'HISTORY' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Archiwum Raportów
          </button>
          <button 
            onClick={() => setActiveTab('VOYAGE')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'VOYAGE' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Zamknięcie Rejsu
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        
        {/* === TAB 1: CASHIER SHIFT (Etap 14.1) === */}
        {activeTab === 'SHIFT' && (
           <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
              {shift.status === 'CLOSED' ? (
                 <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                    <CheckCircle size={48} className="text-green-500 mx-auto mb-4"/>
                    <h3 className="text-2xl font-bold text-green-900">Zmiana Zamknięta</h3>
                    <p className="text-green-700">Raport końcowy został wygenerowany.</p>
                    <button className="mt-4 px-6 py-2 bg-white border border-green-300 text-green-700 rounded font-bold hover:bg-green-100">
                       Drukuj Raport
                    </button>
                 </div>
              ) : (
                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                       <div>
                          <h3 className="font-bold text-slate-800">Rozliczenie Zmiany</h3>
                          <p className="text-xs text-slate-500">Kasjer: {shift.cashierName} • Start: {shift.openedAt}</p>
                       </div>
                       <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-bold uppercase">
                          AKTYWNA
                       </div>
                    </div>
                    
                    <div className="p-8">
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          {['PLN', 'EUR', 'SEK'].map((currency) => (
                             <div key={currency} className="space-y-4">
                                <div className="flex items-center gap-2 font-bold text-slate-700 border-b pb-2">
                                   <Coins size={20} className="text-slate-400"/> {currency}
                                </div>
                                
                                <div>
                                   <label className="block text-xs font-bold text-slate-400 uppercase mb-1">System (Sprzedaż)</label>
                                   <div className="text-xl font-mono text-slate-800">
                                      {shift.expectedCash[currency as keyof typeof shift.expectedCash].toFixed(2)}
                                   </div>
                                </div>

                                <div>
                                   <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Stan Kasy (Liczony)</label>
                                   <input 
                                      type="number" 
                                      className="w-full border-2 border-slate-200 rounded-lg p-2 text-right font-mono font-bold focus:border-blue-500 outline-none bg-white"
                                      placeholder="0.00"
                                      value={declaredCash[currency as keyof typeof declaredCash]}
                                      onChange={(e) => setDeclaredCash({...declaredCash, [currency]: e.target.value})}
                                   />
                                </div>

                                <div>
                                   <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Różnica</label>
                                   <div className={`text-right font-bold font-mono ${
                                      calculateDifference(currency as any) < 0 ? 'text-red-500' : 
                                      calculateDifference(currency as any) > 0 ? 'text-green-500' : 'text-slate-400'
                                   }`}>
                                      {calculateDifference(currency as any).toFixed(2)}
                                   </div>
                                </div>
                             </div>
                          ))}
                       </div>

                       <div className="mt-8 pt-8 border-t border-slate-100 flex justify-end gap-4">
                          <button className="px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-50 flex items-center gap-2">
                             <Printer size={18}/> Raport Cząstkowy
                          </button>
                          <button 
                             onClick={handleCloseShift}
                             className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 flex items-center gap-2 shadow-lg shadow-red-100"
                          >
                             <Lock size={18}/> Zamknij Zmianę
                          </button>
                       </div>
                    </div>
                 </div>
              )}
           </div>
        )}

        {/* === TAB 3: SHIFT HISTORY (Etap 10.8) === */}
        {activeTab === 'HISTORY' && (
           <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                 <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                       <History size={20} className="text-slate-500"/> Archiwum Raportów Kasowych
                    </h3>
                    <div className="flex gap-2">
                       <input type="date" className="border p-2 rounded text-sm bg-white"/>
                       <button className="bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded text-xs font-bold">Filtruj</button>
                    </div>
                 </div>
                 
                 <table className="w-full text-left text-sm">
                    <thead className="bg-white text-slate-500 uppercase text-xs border-b border-slate-200">
                       <tr>
                          <th className="p-4">Nr Zmiany</th>
                          <th className="p-4">Kasjer</th>
                          <th className="p-4">Otwarcie / Zamknięcie</th>
                          <th className="p-4 text-right">Utarg (PLN)</th>
                          <th className="p-4 text-right">Różnica</th>
                          <th className="p-4 text-right">Akcje</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {MOCK_SHIFT_HISTORY.map(shift => {
                          const diff = shift.difference?.PLN || 0;
                          return (
                             <tr key={shift.id} className="hover:bg-slate-50">
                                <td className="p-4 font-mono font-medium text-slate-600">{shift.id}</td>
                                <td className="p-4 font-bold text-slate-700">{shift.cashierName}</td>
                                <td className="p-4">
                                   <div className="text-xs text-slate-500 flex flex-col">
                                      <span className="flex items-center gap-1"><Calendar size={10}/> {shift.openedAt}</span>
                                      <span className="flex items-center gap-1"><Lock size={10}/> {shift.closedAt}</span>
                                   </div>
                                </td>
                                <td className="p-4 text-right font-mono">{shift.expectedCash.PLN.toLocaleString()} PLN</td>
                                <td className="p-4 text-right">
                                   {diff === 0 ? (
                                      <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded">OK</span>
                                   ) : (
                                      <span className={`text-xs font-bold px-2 py-1 rounded ${diff > 0 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                         {diff > 0 ? '+' : ''}{diff.toFixed(2)} PLN
                                      </span>
                                   )}
                                </td>
                                <td className="p-4 text-right">
                                   <button className="text-blue-600 hover:text-blue-800 p-2 rounded" title="Podgląd / Drukuj">
                                      <Printer size={16}/>
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

        {/* === TAB 2: VOYAGE CLOSURE (Etap 12.2, 37.9) === */}
        {activeTab === 'VOYAGE' && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Voyage List */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                 <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                    Aktywne Rejsy
                 </div>
                 <div className="divide-y divide-slate-100">
                    {MOCK_VOYAGE_REPORTS.map(rep => (
                       <div 
                          key={rep.id} 
                          onClick={() => setActiveReport(rep)}
                          className={`p-4 cursor-pointer hover:bg-slate-50 transition ${activeReport?.id === rep.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                       >
                          <div className="flex justify-between items-center mb-1">
                             <span className="font-bold text-slate-800">{rep.routeId}</span>
                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                rep.status === 'CLOSED' ? 'bg-slate-200 text-slate-600' : 'bg-green-100 text-green-700'
                             }`}>
                                {rep.status === 'CLOSED' ? 'ZAMKNIĘTY' : 'OTWARTY'}
                             </span>
                          </div>
                          <div className="text-xs text-slate-500">{rep.departureDate}</div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Right: Closure Dashboard */}
              <div className="lg:col-span-2">
                 {activeReport ? (
                    <div className="space-y-6">
                       <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                             <Anchor size={24} className="text-blue-600"/> Raport Odprawy: {activeReport.routeId}
                          </h3>
                          
                          {/* Stats Grid */}
                          <div className="grid grid-cols-2 gap-6 mb-8">
                             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <h4 className="font-bold text-slate-700 mb-2">Pasażerowie (PAX)</h4>
                                <div className="space-y-2 text-sm">
                                   <div className="flex justify-between">
                                      <span>Zarezerwowani:</span>
                                      <span className="font-bold">{activeReport.bookedPax}</span>
                                   </div>
                                   <div className="flex justify-between text-green-600">
                                      <span>Odprawieni (OK):</span>
                                      <span className="font-bold">{activeReport.checkedInPax}</span>
                                   </div>
                                   <div className="flex justify-between text-red-500 border-t pt-2 mt-2">
                                      <span>Różnica / Non-Show:</span>
                                      <span className="font-bold">{activeReport.bookedPax - activeReport.checkedInPax}</span>
                                   </div>
                                </div>
                             </div>
                             
                             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <h4 className="font-bold text-slate-700 mb-2">Cargo (Jednostki)</h4>
                                <div className="space-y-2 text-sm">
                                   <div className="flex justify-between">
                                      <span>Zarezerwowane:</span>
                                      <span className="font-bold">{activeReport.bookedCargo}</span>
                                   </div>
                                   <div className="flex justify-between text-amber-600">
                                      <span>Odprawione (OK):</span>
                                      <span className="font-bold">{activeReport.checkedInCargo}</span>
                                   </div>
                                   <div className="flex justify-between text-red-500 border-t pt-2 mt-2">
                                      <span>Różnica / Non-Show:</span>
                                      <span className="font-bold">{activeReport.bookedCargo - activeReport.checkedInCargo}</span>
                                   </div>
                                </div>
                             </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-4">
                             <button className="flex items-center justify-center gap-2 p-3 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 font-bold text-sm">
                                <FileText size={18}/> Drukuj Listę Non-Show (Etap 37.9)
                             </button>
                             <button 
                                onClick={() => setIsDiscrepancyModalOpen(true)}
                                className="flex items-center justify-center gap-2 p-3 bg-white border border-amber-300 rounded-lg hover:bg-amber-50 text-amber-800 font-bold text-sm shadow-sm"
                             >
                                <AlertTriangle size={18}/> Przetwarzaj Różnice (Etap 12.2)
                             </button>
                          </div>

                          {activeReport.status !== 'CLOSED' && (
                             <button 
                                onClick={handleCloseVoyage}
                                className="w-full mt-6 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 flex items-center justify-center gap-2 shadow-lg"
                             >
                                <Lock size={20}/> ZATWIERDŹ I ZAMKNIJ REJS
                             </button>
                          )}
                       </div>
                    </div>
                 ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                       <Anchor size={48} className="mb-4 opacity-50"/>
                       <p>Wybierz rejs aby rozpocząć procedurę zamknięcia.</p>
                    </div>
                 )}
              </div>
           </div>
        )}

        {/* Discrepancy Modal */}
        {isDiscrepancyModalOpen && activeReport && (
           <DiscrepancyModal 
              voyageId={activeReport.routeId} 
              onClose={() => setIsDiscrepancyModalOpen(false)}
              onConfirm={handleConfirmDiscrepancies}
           />
        )}
      </div>
    </div>
  );
};

export default ShiftModule;
