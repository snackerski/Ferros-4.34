import React, { useState, useMemo } from 'react';
import { X, Calendar, User, Truck, CreditCard, Clock, Save, AlertTriangle, FileText, CheckCircle, ArrowRight, History, Repeat, Ship, Bed, StickyNote, Hash } from 'lucide-react';
import { Reservation, BookingStatus, CabinType, VehicleType, CabinStatus } from '../types';
import { useTranslation } from '../i18n';
import { MOCK_CABIN_RESOURCES } from '../services/mockData';

interface ReservationManagementModalProps {
  reservation: Reservation;
  onClose: () => void;
  onUpdate: (updatedRes: Reservation) => void;
}

const ReservationManagementModal: React.FC<ReservationManagementModalProps> = ({ reservation, onClose, onUpdate }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'MODIFY' | 'RETURN' | 'CANCEL' | 'HISTORY'>('DETAILS');
  const [newDate, setNewDate] = useState(reservation.bookingDate);
  const [newCabin, setNewCabin] = useState(reservation.cabinType);
  const [newCabinNumber, setNewCabinNumber] = useState(reservation.cabinNumber || '');
  const [localNotes, setLocalNotes] = useState(reservation.notes || '');
  
  // Return Trip State (Etap 4.13)
  const [returnDate, setReturnDate] = useState('');
  const [returnCabin, setReturnCabin] = useState<CabinType>(reservation.cabinType);
  
  // Available Cabins based on selected type
  const availableCabins = useMemo(() => {
     return MOCK_CABIN_RESOURCES.filter(c => c.type === newCabin && c.status === CabinStatus.FREE);
  }, [newCabin]);

  // Mock calculation logic
  const originalPrice = reservation.totalPrice;
  const newPrice = newCabin !== reservation.cabinType ? (originalPrice + (newCabin === CabinType.LUX ? 400 : -100)) : originalPrice;
  const priceDiff = newPrice - originalPrice;
  const changeFee = 50; // Opłata manipulacyjna

  const handleSaveChanges = () => {
    onUpdate({
      ...reservation,
      bookingDate: newDate,
      cabinType: newCabin,
      cabinNumber: newCabinNumber,
      notes: localNotes,
      totalPrice: newPrice + changeFee,
      status: BookingStatus.CONFIRMED // Reset to confirmed if changed
    });
    alert(t('res.manage.modify.success', { amount: priceDiff + changeFee }));
    onClose();
  };

  const handleSaveNotes = () => {
     onUpdate({
        ...reservation,
        notes: localNotes
     });
     alert('Notatka została zapisana pomyślnie.');
  };

  const handleCancelReservation = () => {
    // Mock refund calculation (90% refund)
    const refundAmount = reservation.totalPrice * 0.9;
    onUpdate({
      ...reservation,
      status: BookingStatus.CANCELLED
    });
    alert(t('res.manage.cancel.success', { amount: refundAmount.toFixed(2) }));
    onClose();
  };

  const handleCreateReturn = () => {
     if (!returnDate) return;
     // In a real app, this would create a new reservation object and save it
     alert(t('res.manage.return.success', { date: returnDate }));
     // Simulate linking
     onUpdate({
        ...reservation,
        linkedBookingId: `RES-${Math.floor(Math.random()*10000)}` // Mock ID
     });
     onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              {t('res.manage.title')}: <span className="font-mono text-blue-300">{reservation.id}</span>
            </h2>
            <div className="flex gap-4 text-sm text-slate-400 mt-1">
               <span className="flex items-center gap-1"><Calendar size={14}/> {reservation.bookingDate}</span>
               <span className="flex items-center gap-1"><Truck size={14}/> {reservation.routeId}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition rounded-full p-1 hover:bg-slate-800">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto text-nowrap scrollbar-hide">
           <button 
             onClick={() => setActiveTab('DETAILS')}
             className={`flex-1 min-w-[100px] py-3 text-sm font-bold border-b-2 transition whitespace-nowrap ${activeTab === 'DETAILS' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
           >
             {t('res.manage.tabs.details')}
           </button>
           <button 
             onClick={() => setActiveTab('MODIFY')}
             disabled={reservation.status === BookingStatus.CANCELLED}
             className={`flex-1 min-w-[100px] py-3 text-sm font-bold border-b-2 transition whitespace-nowrap ${activeTab === 'MODIFY' ? 'border-amber-500 text-amber-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 disabled:opacity-50'}`}
           >
             {t('res.manage.tabs.modify')}
           </button>
           <button 
             onClick={() => setActiveTab('RETURN')}
             disabled={reservation.status === BookingStatus.CANCELLED}
             className={`flex-1 min-w-[100px] py-3 text-sm font-bold border-b-2 transition whitespace-nowrap ${activeTab === 'RETURN' ? 'border-indigo-500 text-indigo-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 disabled:opacity-50'}`}
           >
             {t('res.manage.tabs.return')}
           </button>
           <button 
             onClick={() => setActiveTab('CANCEL')}
             disabled={reservation.status === BookingStatus.CANCELLED}
             className={`flex-1 min-w-[100px] py-3 text-sm font-bold border-b-2 transition whitespace-nowrap ${activeTab === 'CANCEL' ? 'border-red-500 text-red-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 disabled:opacity-50'}`}
           >
             {t('res.manage.tabs.cancel')}
           </button>
           <button 
             onClick={() => setActiveTab('HISTORY')}
             className={`flex-1 min-w-[100px] py-3 text-sm font-bold border-b-2 transition whitespace-nowrap ${activeTab === 'HISTORY' ? 'border-purple-500 text-purple-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
           >
             {t('res.manage.tabs.history')}
           </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
           
           {activeTab === 'DETAILS' && (
              <div className="space-y-6 animate-fade-in">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                       <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2"><User size={18}/> {t('res.manage.pax_header')}</h3>
                       <div className="space-y-2 text-sm text-slate-600">
                          <p><span className="text-slate-400">{t('res.manage.main_pax')}:</span> <br/><span className="font-medium text-slate-800 text-lg">{reservation.passengers[0]?.firstName || 'Brak'} {reservation.passengers[0]?.lastName || 'Danych'}</span></p>
                          <p><span className="text-slate-400">{t('res.modal.email')}:</span> {reservation.contactEmail}</p>
                          <p><span className="text-slate-400">Dokument:</span> {reservation.passengers[0]?.documentNumber || 'Brak DOC'}</p>
                          <p><span className="text-slate-400">Liczba osób:</span> {reservation.passengers.length}</p>
                       </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                       <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2"><Truck size={18}/> {t('res.manage.vehicle_cabin')}</h3>
                       <div className="space-y-2 text-sm text-slate-600">
                          <p><span className="text-slate-400">Pojazd:</span> {reservation.vehicleType} {reservation.vehicleReg && `(${reservation.vehicleReg})`}</p>
                          <p><span className="text-slate-400">{t('res.manage.modify.cabin')}:</span> {reservation.cabinType}</p>
                          {reservation.cabinNumber && (
                             <p className="flex items-center gap-1.5"><Bed size={14} className="text-blue-500"/><span className="text-slate-400">{t('res.manage.modify.cabin_no')}:</span> <span className="font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">{reservation.cabinNumber}</span></p>
                          )}
                          <div className="border-t border-slate-100 pt-2 mt-2">
                             <p><span className="text-slate-400">{t('common.status')}:</span> 
                                <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                   reservation.status === 'Potwierdzona' || reservation.status === 'Opłacona' ? 'bg-emerald-100 text-emerald-700' : 
                                   reservation.status === 'Anulowana' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                                }`}>{reservation.status}</span>
                             </p>
                             <p className="mt-1"><span className="text-slate-400">Razem:</span> <span className="font-bold text-slate-800">{reservation.totalPrice} PLN</span></p>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* NOTATKI SEKRETARE (Etap 18.5) */}
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                       <h3 className="font-bold text-slate-700 flex items-center gap-2"><StickyNote size={18} className="text-amber-500"/> {t('res.manage.notes_title')}</h3>
                       <button 
                          onClick={handleSaveNotes}
                          className="text-[10px] bg-blue-600 text-white px-3 py-1 rounded font-black uppercase tracking-widest hover:bg-blue-700 transition flex items-center gap-1.5"
                       >
                          <Save size={12}/> {t('res.manage.notes_save')}
                       </button>
                    </div>
                    <textarea 
                       className="w-full border-2 border-slate-100 rounded-xl p-3 text-sm bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all h-24 resize-none font-medium text-slate-700"
                       placeholder={t('res.manage.notes_placeholder')}
                       value={localNotes}
                       onChange={e => setLocalNotes(e.target.value)}
                    ></textarea>
                 </div>
                 
                 {reservation.linkedBookingId && (
                    <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl flex items-center justify-between">
                       <div className="flex gap-3 items-center">
                          <Repeat className="text-indigo-600" size={20}/>
                          <div>
                             <h4 className="font-bold text-indigo-900 text-sm">Powiązana rezerwacja</h4>
                             <p className="text-indigo-700 text-xs">ID: {reservation.linkedBookingId}</p>
                          </div>
                       </div>
                       <button className="text-xs bg-white border border-indigo-200 px-3 py-1.5 rounded text-indigo-700 font-bold hover:bg-indigo-50">
                          {t('routes.list.details')}
                       </button>
                    </div>
                 )}
                 
                 <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                    <CheckCircle className="text-blue-600 mt-1" size={20}/>
                    <div className="text-sm text-blue-800">
                       <p className="font-bold">{t('res.manage.payment_status')}: OPŁACONA</p>
                       <p>Transakcja: TRX-998877 (Karta VISA) - 2023-10-20 14:30</p>
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'MODIFY' && (
              <div className="space-y-6 animate-fade-in">
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{t('res.manage.modify.date')}</label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
                            <input 
                               type="date" 
                               value={newDate}
                               onChange={(e) => setNewDate(e.target.value)}
                               className="w-full pl-10 border-2 border-slate-100 p-3 rounded-xl bg-slate-50 font-bold outline-none focus:border-amber-500 focus:bg-white transition-all shadow-inner text-sm" 
                            />
                          </div>
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{t('res.manage.modify.cabin')}</label>
                          <div className="relative">
                            <Bed className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
                            <select 
                               value={newCabin}
                               onChange={(e) => {
                                  const val = e.target.value as CabinType;
                                  setNewCabin(val);
                                  setNewCabinNumber(''); // Reset number on type change
                               }}
                               className="w-full pl-10 border-2 border-slate-100 p-3 rounded-xl bg-slate-50 font-bold outline-none focus:border-amber-500 focus:bg-white transition-all shadow-inner appearance-none cursor-pointer text-sm" 
                            >
                               {Object.values(CabinType).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                       </div>

                       <div className="col-span-1 md:col-span-2">
                          <div className="flex justify-between items-center mb-2 ml-1">
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Wybierz dostępny numer kabiny</label>
                             {newCabinNumber && <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">WYBRANO: {newCabinNumber}</span>}
                          </div>
                          <div className="bg-slate-50 rounded-2xl border-2 border-slate-100 p-4 min-h-[120px] shadow-inner">
                             {newCabin === CabinType.NONE ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 py-6">
                                   <User size={24} className="mb-2 opacity-30"/>
                                   <p className="text-xs font-medium italic">Bilet bez przypisanej kabiny (Miejsce pokładowe).</p>
                                </div>
                             ) : availableCabins.length > 0 ? (
                                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                                   {availableCabins.map(c => (
                                      <button 
                                         key={c.id}
                                         type="button"
                                         onClick={() => setNewCabinNumber(c.id)}
                                         className={`p-2 rounded-lg text-xs font-mono font-black border transition-all ${
                                            newCabinNumber === c.id 
                                            ? 'bg-amber-600 border-amber-600 text-white shadow-lg scale-105 z-10' 
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-amber-400 hover:text-amber-600'
                                         }`}
                                      >
                                         {c.id}
                                      </button>
                                   ))}
                                </div>
                             ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 py-6">
                                   <AlertTriangle size={32} className="mb-2 text-red-200"/>
                                   <p className="text-xs text-center font-bold px-8">Brak wolnych kabin tego typu na wybrany rejs.</p>
                                </div>
                             )}
                          </div>
                       </div>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-sm shadow-inner">
                       <div className="flex justify-between text-slate-500">
                          <span>{t('res.manage.modify.original')}:</span>
                          <span className="font-bold">{originalPrice.toFixed(2)} PLN</span>
                       </div>
                       <div className="flex justify-between text-slate-500">
                          <span>{t('res.manage.modify.new')}:</span>
                          <span className="font-bold">{newPrice.toFixed(2)} PLN</span>
                       </div>
                       <div className="flex justify-between text-slate-500">
                          <span>{t('res.manage.modify.fee')}:</span>
                          <span className="font-bold">{changeFee.toFixed(2)} PLN</span>
                       </div>
                       <div className="border-t border-slate-200 pt-3 mt-2 flex justify-between items-baseline">
                          <span className="font-black text-slate-800 uppercase text-xs">{t('res.manage.modify.to_pay')}:</span>
                          <span className={`text-2xl font-black ${priceDiff + changeFee > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                             {(priceDiff + changeFee).toFixed(2)} <span className="text-sm">PLN</span>
                          </span>
                       </div>
                    </div>

                    <button 
                       onClick={handleSaveChanges}
                       disabled={newCabin !== CabinType.NONE && !newCabinNumber}
                       className="w-full py-4 bg-amber-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-amber-700 flex items-center justify-center gap-3 transition-all shadow-xl shadow-amber-900/20 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                    >
                       <Save size={18}/> {t('res.manage.modify.btn')}
                    </button>
                 </div>
              </div>
           )}

           {/* --- ETAP 4.13: RETURN TRIP --- */}
           {activeTab === 'RETURN' && (
              <div className="space-y-6 animate-fade-in">
                 <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                       <div className="bg-indigo-100 p-2 rounded-full text-indigo-600"><Repeat size={24}/></div>
                       <div>
                          <h3 className="text-lg font-bold text-indigo-900">{t('res.manage.return.title')}</h3>
                          <p className="text-xs text-indigo-700">{t('res.manage.return.desc')}</p>
                       </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-indigo-100 space-y-4 shadow-sm">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{t('res.manage.return.route')}</label>
                             <div className="p-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 flex items-center gap-2 shadow-inner">
                                <Ship size={16} className="text-indigo-500"/>
                                {reservation.routeId === 'R001' ? 'Nynäshamn → Gdańsk' : 'Gdańsk → Nynäshamn'}
                             </div>
                          </div>
                          <div>
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{t('res.manage.return.date')}</label>
                             <input 
                                type="date" 
                                className="w-full border-2 border-slate-100 p-2.5 rounded-xl bg-white text-sm font-bold outline-none focus:border-indigo-500 shadow-sm"
                                value={returnDate}
                                onChange={e => setReturnDate(e.target.value)}
                             />
                          </div>
                          <div className="col-span-2">
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{t('res.manage.return.cabin')}</label>
                             <select 
                                className="w-full border-2 border-slate-100 p-2.5 rounded-xl bg-white text-sm font-bold outline-none focus:border-indigo-500 appearance-none cursor-pointer shadow-sm"
                                value={returnCabin}
                                onChange={e => setReturnCabin(e.target.value as CabinType)}
                             >
                                {Object.values(CabinType).map(c => <option key={c} value={c}>{c}</option>)}
                             </select>
                          </div>
                       </div>

                       <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                          <div>
                             <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest block mb-1">{t('res.manage.return.est_cost')}</span>
                             <span className="text-2xl font-black text-slate-800">{ (originalPrice * 0.9).toFixed(2) } <span className="text-sm font-bold">PLN</span></span>
                             <span className="text-xs text-green-600 ml-2 font-bold bg-green-50 px-2 py-0.5 rounded">{t('res.manage.return.discount_hint')}</span>
                          </div>
                          <button 
                             onClick={handleCreateReturn}
                             className="px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-xl shadow-indigo-200 transition-all active:scale-95"
                          >
                             <CheckCircle size={18}/> {t('res.manage.return.btn')}
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'CANCEL' && (
              <div className="space-y-6 text-center animate-fade-in">
                 <div className="bg-red-50 border border-red-100 p-8 rounded-2xl">
                    <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-red-100">
                       <AlertTriangle size={40} className="text-red-500 animate-pulse"/>
                    </div>
                    <h3 className="text-2xl font-black text-red-900 mb-2">{t('res.manage.cancel.title')}</h3>
                    <p className="text-red-700 text-sm max-w-md mx-auto mb-8 font-medium leading-relaxed">
                       {t('res.manage.cancel.desc')}
                    </p>
                    
                    <div className="bg-white p-6 rounded-2xl border border-red-100 text-left max-w-sm mx-auto mb-8 shadow-inner">
                       <div className="flex justify-between text-sm mb-2 text-slate-500">
                          <span className="font-bold">{t('res.manage.cancel.value')}:</span>
                          <span className="font-bold">{reservation.totalPrice.toFixed(2)} PLN</span>
                       </div>
                       <div className="flex justify-between text-sm mb-2 text-red-600">
                          <span className="font-bold">{t('res.manage.cancel.fee')}:</span>
                          <span className="font-bold">-{(reservation.totalPrice * 0.1).toFixed(2)} PLN</span>
                       </div>
                       <div className="border-t border-red-50 pt-3 mt-3 flex justify-between items-baseline font-black text-red-700">
                          <span className="uppercase text-xs tracking-widest">{t('res.manage.cancel.refund')}:</span>
                          <span className="text-3xl font-black">{(reservation.totalPrice * 0.9).toFixed(2)} <span className="text-sm">PLN</span></span>
                       </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                       <button onClick={() => setActiveTab('DETAILS')} className="px-8 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all active:scale-95">
                          {t('common.back')}
                       </button>
                       <button onClick={handleCancelReservation} className="px-8 py-3 bg-red-600 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-red-700 shadow-xl shadow-red-200 transition-all active:scale-95">
                          {t('res.manage.cancel.btn')}
                       </button>
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'HISTORY' && (
              <div className="space-y-4 animate-fade-in">
                 <div className="relative border-l-4 border-slate-100 ml-4 space-y-10 py-4">
                    <div className="relative pl-10">
                       <div className="absolute -left-[14px] top-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-md flex items-center justify-center">
                          <CheckCircle size={10} className="text-white"/>
                       </div>
                       <p className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">2023-10-20 14:30</p>
                       <h4 className="font-black text-slate-800 text-sm">Płatność Zaksięgowana</h4>
                       <p className="text-xs text-slate-500 mt-1">Transakcja: TRX-998877 (VISA). Status zmieniony na OPŁACONA.</p>
                    </div>
                    <div className="relative pl-10">
                       <div className="absolute -left-[14px] top-0 w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-md flex items-center justify-center">
                          <Save size={10} className="text-white"/>
                       </div>
                       <p className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">2023-10-20 14:25</p>
                       <h4 className="font-black text-slate-800 text-sm">Utworzenie Rezerwacji</h4>
                       <p className="text-xs text-slate-500 mt-1">System rezerwacyjny (Web). Utworzył: Maciej Fiszer.</p>
                    </div>
                 </div>
                 <div className="p-6 bg-slate-50 rounded-2xl text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border border-dashed border-slate-200">
                    {t('res.manage.history.end')}
                 </div>
              </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default ReservationManagementModal;