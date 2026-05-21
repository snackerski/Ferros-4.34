import React, { useState } from 'react';
import { Users, Clock, ArrowRight, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Reservation, BookingStatus, VehicleType, CabinType } from '../types';
import { useTranslation } from '../i18n';

interface WaitingListManagerProps {
  reservations: Reservation[];
  onPromote: (ids: string[]) => void;
  onReject: (ids: string[]) => void;
  onClose: () => void;
}

const WaitingListManager: React.FC<WaitingListManagerProps> = ({ reservations, onPromote, onReject, onClose }) => {
  const { t } = useTranslation();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Mock capacity status for route R003 (where we have waiting list items in mock data)
  const capacity = {
     routeId: 'R003',
     total: 450,
     booked: 445, // 5 slots free
     free: 5
  };

  const waitingList = reservations.filter(r => r.status === BookingStatus.WAITING_LIST);

  const toggleSelection = (id: string) => {
     if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter(sid => sid !== id));
     } else {
        setSelectedIds([...selectedIds, id]);
     }
  };

  const handlePromoteSelected = () => {
     if (selectedIds.length === 0) return;
     if (selectedIds.length > capacity.free) {
        if (!confirm(`Wybrano ${selectedIds.length} rezerwacji, a dostępnych miejsc jest tylko ${capacity.free}. Czy na pewno chcesz przepełnić rejs (Overbooking)?`)) {
           return;
        }
     }
     onPromote(selectedIds);
     setSelectedIds([]);
  };

  const handleRejectSelected = () => {
     if (selectedIds.length === 0) return;
     if (confirm(`Czy na pewno chcesz odrzucić ${selectedIds.length} rezerwacji? Zostaną wysłane powiadomienia o braku miejsc.`)) {
        onReject(selectedIds);
        setSelectedIds([]);
     }
  };

  const handleAutoProcess = () => {
     // Mock auto logic: take first N that fit
     const candidates = waitingList.slice(0, capacity.free).map(r => r.id);
     if (candidates.length > 0) {
        onPromote(candidates);
        alert(`System automatycznie przetworzył ${candidates.length} rezerwacji zgodnie z priorytetem daty zgłoszenia.`);
     } else {
        alert('Brak rezerwacji lub brak wolnych miejsc do automatycznego przetworzenia.');
     }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
         {/* Header */}
         <div className="bg-amber-600 text-white p-6 flex justify-between items-center">
            <div>
               <h2 className="text-xl font-bold flex items-center gap-2">
                  <Clock size={24} /> {t('res.queue')} (Etap 3.2)
               </h2>
               <p className="text-amber-100 text-sm mt-1">Zarządzanie kolejką rezerwacji oczekujących na potwierdzenie.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-amber-700 rounded-full transition">
               <XCircle size={24}/>
            </button>
         </div>

         {/* Capacity Info */}
         <div className="p-6 bg-amber-50 border-b border-amber-100 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm">
               <div className="text-xs text-slate-500 uppercase font-bold mb-1">Wybrano Rejs</div>
               <div className="text-2xl font-bold text-slate-800">{capacity.routeId}</div>
               <div className="text-xs text-slate-400">Świnoujście - Ystad</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm">
               <div className="text-xs text-slate-500 uppercase font-bold mb-1">Status Miejsc</div>
               <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-slate-800">{capacity.booked}</span>
                  <span className="text-sm text-slate-400 mb-1">/ {capacity.total}</span>
               </div>
               <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                  <div className="bg-amber-500 h-full" style={{ width: `${(capacity.booked / capacity.total) * 100}%` }}></div>
               </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm flex items-center justify-between">
               <div>
                  <div className="text-xs text-slate-500 uppercase font-bold mb-1">Wolne Miejsca</div>
                  <div className="text-2xl font-bold text-emerald-600">{capacity.free}</div>
               </div>
               <button 
                  onClick={handleAutoProcess}
                  className="bg-amber-100 text-amber-800 px-3 py-2 rounded-lg text-xs font-bold hover:bg-amber-200 flex items-center gap-1 transition"
               >
                  <RefreshCw size={14}/> Auto-Wypełnij
               </button>
            </div>
         </div>

         {/* List */}
         <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
            {waitingList.length > 0 ? (
               <table className="w-full text-left bg-white rounded-xl shadow-sm overflow-hidden">
                  <thead className="bg-slate-100 text-slate-500 text-xs uppercase">
                     <tr>
                        <th className="p-4 w-12"><input type="checkbox" onChange={(e) => setSelectedIds(e.target.checked ? waitingList.map(r => r.id) : [])} checked={selectedIds.length === waitingList.length && waitingList.length > 0}/></th>
                        <th className="p-4">{t('res.id_col')}</th>
                        <th className="p-4">Data Zgłoszenia</th>
                        <th className="p-4">{t('res.client_col')}</th>
                        <th className="p-4">Zasoby</th>
                        <th className="p-4 text-right">Priorytet</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                     {waitingList.map((res, idx) => (
                        <tr key={res.id} className="hover:bg-amber-50 transition cursor-pointer" onClick={() => toggleSelection(res.id)}>
                           <td className="p-4"><input type="checkbox" checked={selectedIds.includes(res.id)} onChange={() => toggleSelection(res.id)} /></td>
                           <td className="p-4 font-bold text-slate-700">{res.id}</td>
                           <td className="p-4 text-slate-500">{res.bookingDate}</td>
                           <td className="p-4">
                              <div className="font-medium">{res.passengers[0]?.lastName}</div>
                              <div className="text-xs text-slate-400">{res.contactEmail}</div>
                           </td>
                           <td className="p-4 text-xs text-slate-600">
                              {res.vehicleType !== VehicleType.NONE && <span className="block">{res.vehicleType}</span>}
                              {res.cabinType !== CabinType.NONE && <span className="block">{res.cabinType}</span>}
                           </td>
                           <td className="p-4 text-right">
                              <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${idx < capacity.free ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                 #{idx + 1}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <CheckCircle size={48} className="mb-4 text-emerald-500 opacity-50"/>
                  <p>Lista oczekujących jest pusta.</p>
               </div>
            )}
         </div>

         {/* Footer Actions */}
         <div className="p-6 bg-white border-t border-slate-200 flex justify-between items-center">
            <div className="text-sm text-slate-500">
               {t('res.queue.processed_count', { count: selectedIds.length })}
            </div>
            <div className="flex gap-3">
               <button 
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-bold text-slate-600 hover:bg-slate-50"
               >
                  {t('common.cancel')}
               </button>
               <button 
                  onClick={handleRejectSelected}
                  disabled={selectedIds.length === 0}
                  className="px-4 py-2 border border-red-200 bg-red-50 text-red-700 rounded-lg font-bold hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  Odrzuć i Usuń
               </button>
               <button 
                  onClick={handlePromoteSelected}
                  disabled={selectedIds.length === 0}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  <ArrowRight size={18}/> {t('common.confirm')}
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default WaitingListManager;
