
import React, { useState } from 'react';
import { Wallet, Upload, RefreshCw, CheckCircle, AlertTriangle, Link, FileText, Download, ArrowRight, XCircle } from 'lucide-react';
import { MOCK_BANK_TRANSFERS, MOCK_RESERVATIONS, MOCK_CARGO_INVOICES } from '../services/mockData';
import { BankTransfer, Reservation, BookingStatus } from '../types';

const FinanceModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'MATCHING' | 'EXPORT'>('MATCHING');
  const [transfers, setTransfers] = useState<BankTransfer[]>(MOCK_BANK_TRANSFERS);
  const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS);
  const [selectedTransfer, setSelectedTransfer] = useState<BankTransfer | null>(null);

  // Filter only unpaid reservations or invoices
  const unpaidReservations = reservations.filter(r => r.status !== BookingStatus.PAID && r.status !== BookingStatus.CANCELLED);
  
  const handleAutoMatch = () => {
    let matchedCount = 0;
    const updatedTransfers = transfers.map(trx => {
      if (trx.status !== 'NEW' && trx.status !== 'MANUAL_REQUIRED') return trx;

      // Simple logic: check if booking ID is in title
      const matchedRes = unpaidReservations.find(r => trx.title.includes(r.id));
      const matchedInv = MOCK_CARGO_INVOICES.find(inv => trx.title.includes(inv.id));

      if (matchedRes && Math.abs(matchedRes.totalPrice - trx.amount) < 1) { // Allow small difference
        matchedCount++;
        // Update reservation status in local state mock
        setReservations(prev => prev.map(r => r.id === matchedRes.id ? { ...r, status: BookingStatus.PAID } : r));
        return { ...trx, status: 'MATCHED' as const, matchedBookingId: matchedRes.id };
      }
      
      if (matchedInv && Math.abs(matchedInv.totalAmount - trx.amount) < 1) {
          matchedCount++;
          return { ...trx, status: 'MATCHED' as const, matchedBookingId: matchedInv.id };
      }

      return trx;
    });

    setTransfers(updatedTransfers);
    alert(`Automatyczne parowanie zakończone. Dopasowano: ${matchedCount} przelewów.`);
  };

  const handleManualMatch = (resId: string) => {
    if (!selectedTransfer) return;
    
    // Update Transfer
    setTransfers(prev => prev.map(t => t.id === selectedTransfer.id ? { ...t, status: 'MATCHED', matchedBookingId: resId } : t));
    
    // Update Reservation
    setReservations(prev => prev.map(r => r.id === resId ? { ...r, status: BookingStatus.PAID } : r));
    
    setSelectedTransfer(null);
    alert(`Ręcznie sparowano przelew ${selectedTransfer.id} z rezerwacją ${resId}`);
  };

  const handleImportFile = () => {
    alert('Etap 24.1: Symulacja importu pliku MT940/CSV z banku. Dodano nowe transakcje do listy.');
    // In real app, parse file and add to state
  };

  return (
    <div className="flex flex-col h-full bg-slate-100">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Wallet className="text-emerald-600" /> Finanse / Rozliczenia
          </h2>
          <p className="text-xs text-slate-500">Etap 24, 25, 27: Import Przelewów i Cash Matching</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('MATCHING')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'MATCHING' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Rozliczanie Płatności
          </button>
          <button 
            onClick={() => setActiveTab('EXPORT')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'EXPORT' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Eksport do Księgowości
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'MATCHING' && (
          <div className="h-full flex flex-col space-y-4">
             {/* Toolbar */}
             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 justify-between items-center">
                <div className="flex gap-2">
                   <button 
                      onClick={handleImportFile}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-emerald-700 flex items-center gap-2 shadow-sm"
                   >
                      <Upload size={16}/> Importuj Wyciąg (MT940)
                   </button>
                   <select className="border border-slate-300 rounded-lg text-sm p-2 bg-white">
                      <option>PKO BP (PLN)</option>
                      <option>SEB Bank (SEK)</option>
                      <option>Nordea (EUR)</option>
                   </select>
                </div>
                <div className="flex gap-2">
                   <button 
                      onClick={handleAutoMatch}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 flex items-center gap-2 shadow-sm"
                   >
                      <RefreshCw size={16}/> Auto-Match (Po tytule)
                   </button>
                </div>
             </div>

             {/* Matching Split View */}
             <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                
                {/* Left: Bank Transfers */}
                <div className="bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
                   <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700 flex justify-between items-center">
                      <span>Nierozliczone Przelewy</span>
                      <span className="text-xs bg-slate-200 px-2 py-1 rounded text-slate-600">{transfers.filter(t => t.status !== 'MATCHED').length}</span>
                   </div>
                   <div className="flex-1 overflow-y-auto p-2 space-y-2">
                      {transfers.filter(t => t.status !== 'MATCHED').map(trx => (
                         <div 
                           key={trx.id} 
                           onClick={() => setSelectedTransfer(trx)}
                           className={`p-3 rounded-lg border cursor-pointer transition flex flex-col gap-1 ${
                              selectedTransfer?.id === trx.id ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-slate-100 hover:border-blue-300'
                           }`}
                         >
                            <div className="flex justify-between items-start">
                               <span className="font-bold text-slate-800 text-sm">{trx.senderName}</span>
                               <span className="font-mono text-sm font-bold text-emerald-600">{trx.amount.toFixed(2)} {trx.currency}</span>
                            </div>
                            <div className="text-xs text-slate-500 truncate" title={trx.title}>{trx.title}</div>
                            <div className="flex justify-between items-center mt-1">
                               <span className="text-[10px] text-slate-400">{trx.date}</span>
                               {trx.status === 'MANUAL_REQUIRED' && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">SPRAWDŹ</span>}
                            </div>
                         </div>
                      ))}
                      {transfers.filter(t => t.status !== 'MATCHED').length === 0 && (
                         <div className="p-8 text-center text-slate-400 text-sm">Brak nowych przelewów</div>
                      )}
                   </div>
                </div>

                {/* Right: Unpaid Bookings */}
                <div className="bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
                   <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700 flex justify-between items-center">
                      <span>Nieopłacone Rezerwacje / Faktury</span>
                      <div className="flex gap-2 text-xs">
                         <span className="bg-white border px-2 py-1 rounded cursor-pointer">PAX</span>
                         <span className="bg-white border px-2 py-1 rounded cursor-pointer">CARGO</span>
                      </div>
                   </div>
                   <div className="flex-1 overflow-y-auto p-2 space-y-2">
                      {/* Show active matching hint */}
                      {selectedTransfer && (
                         <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-2 animate-pulse">
                            <div className="text-xs text-blue-800 font-bold mb-1">Wybierz rezerwację do sparowania z:</div>
                            <div className="text-sm font-medium">{selectedTransfer.senderName} - {selectedTransfer.amount} {selectedTransfer.currency}</div>
                         </div>
                      )}

                      {unpaidReservations.map(res => (
                         <div key={res.id} className="p-3 bg-white rounded-lg border border-slate-100 hover:border-emerald-300 transition flex justify-between items-center group">
                            <div>
                               <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm text-slate-800">{res.id}</span>
                                  {res.isCargo && <span className="text-[10px] bg-amber-100 text-amber-800 px-1 rounded font-bold">CARGO</span>}
                               </div>
                               <div className="text-xs text-slate-500">{res.contactEmail}</div>
                               <div className="text-[10px] text-slate-400">{res.bookingDate} • {res.routeId}</div>
                            </div>
                            <div className="text-right">
                               <div className="font-bold text-slate-700 text-sm">{res.totalPrice.toFixed(2)} PLN</div>
                               {selectedTransfer && (
                                  <button 
                                    onClick={() => handleManualMatch(res.id)}
                                    className="mt-1 text-xs bg-emerald-600 text-white px-2 py-1 rounded font-bold opacity-0 group-hover:opacity-100 transition"
                                  >
                                     <Link size={12} className="inline mr-1"/> POWIĄŻ
                                  </button>
                               )}
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* === EXPORT TAB (Etap 33.1) === */}
        {activeTab === 'EXPORT' && (
           <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                 <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-blue-600"/> Eksport Dokumentów Sprzedaży (XML/Jpk)
                 </h3>
                 <p className="text-sm text-slate-500 mb-6">
                    Wybierz system docelowy oraz zakres dat, aby wygenerować paczkę z fakturami do systemu finansowo-księgowego.
                 </p>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">System Docelowy</label>
                       <select className="w-full border p-2 rounded bg-white">
                          <option>Macrologic (PL)</option>
                          <option>Pyramid (SE)</option>
                          <option>Symfonia (FK)</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">Format</label>
                       <select className="w-full border p-2 rounded bg-white">
                          <option>XML (Standard)</option>
                          <option>CSV (Rozszerzony)</option>
                          <option>JPK_VAT (PL)</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">Data Od</label>
                       <input type="date" className="w-full border p-2 rounded bg-white" />
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">Data Do</label>
                       <input type="date" className="w-full border p-2 rounded bg-white" />
                    </div>
                 </div>

                 <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                    <button 
                       onClick={() => alert('Wyeksportowano 142 dokumenty do pliku export_202310.xml')}
                       className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-100"
                    >
                       <Download size={18}/> Generuj i Pobierz
                    </button>
                 </div>
              </div>

              {/* Export History */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                 <div className="p-4 bg-slate-50 font-bold text-slate-700 border-b border-slate-200">
                    Ostatnie Eksporty
                 </div>
                 <table className="w-full text-left text-sm">
                    <thead className="bg-white text-slate-500 uppercase text-xs">
                       <tr>
                          <th className="p-4">Data</th>
                          <th className="p-4">System</th>
                          <th className="p-4">Zakres</th>
                          <th className="p-4 text-center">Ilość dok.</th>
                          <th className="p-4 text-center">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       <tr>
                          <td className="p-4 text-slate-500">2023-10-25 09:00</td>
                          <td className="p-4 font-bold">Macrologic</td>
                          <td className="p-4">2023-10-01 - 2023-10-24</td>
                          <td className="p-4 text-center font-mono">145</td>
                          <td className="p-4 text-center"><span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded">SUKCES</span></td>
                       </tr>
                       <tr>
                          <td className="p-4 text-slate-500">2023-10-24 16:30</td>
                          <td className="p-4 font-bold">Pyramid</td>
                          <td className="p-4">2023-10-01 - 2023-10-24</td>
                          <td className="p-4 text-center font-mono">88</td>
                          <td className="p-4 text-center"><span className="text-amber-600 font-bold text-xs bg-amber-50 px-2 py-1 rounded">BŁĘDY</span></td>
                       </tr>
                    </tbody>
                 </table>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default FinanceModule;
