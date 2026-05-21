import React, { useState } from 'react';
import { User, LogOut, Ticket, Star, Settings, CreditCard, Ship, Calendar, MapPin, Printer, XCircle, QrCode, X, Clock, Navigation, Search, ArrowRight, CheckCircle, ChevronLeft, Truck, History, RotateCcw, Plus, Bed } from 'lucide-react';
import { MOCK_CLIENT, MOCK_RESERVATIONS, MOCK_ROUTES, MOCK_CABIN_PRICES } from '../services/mockData';
import { VehicleType, Reservation, BookingStatus, CabinType } from '../types';
import { useTranslation } from '../i18n';

const ClientPanel: React.FC = () => {
  const { t } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveTab] = useState<'TICKETS' | 'PROFILE' | 'NEW_BOOKING'>('TICKETS');
  const [viewTicket, setViewTicket] = useState<Reservation | null>(null);
  const [myReservations, setMyReservations] = useState<Reservation[]>([]);
  
  // Change Cabin State
  const [targetResForCabinChange, setTargetResForCabinChange] = useState<Reservation | null>(null);
  const [newCabinType, setNewCabinType] = useState<CabinType | null>(null);

  // Ticket Filter State
  const [ticketFilter, setTicketFilter] = useState<'UPCOMING' | 'HISTORY'>('UPCOMING');

  // Initialize with mock data on load
  React.useEffect(() => {
     setMyReservations(MOCK_RESERVATIONS.filter(r => MOCK_CLIENT.bookings.includes(r.id)));
  }, []);

  // --- NEW BOOKING WIZARD STATE ---
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
     origin: 'Świnoujście',
     destination: 'Ystad',
     date: new Date().toISOString().split('T')[0],
     pax: 1,
     vehicle: VehicleType.NONE,
     selectedRouteId: '',
     cabin: CabinType.NONE,
     passengerName: MOCK_CLIENT.lastName + ' ' + MOCK_CLIENT.firstName
  });

  // Login Simulation
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
          <div className="text-center mb-8">
            <div className="w-full flex justify-center mb-4">
              <img src="http://fiszer.app/polsca/files/ferros-logo.png" alt="FerrOS Logo" className="h-10 w-auto object-contain" referrerPolicy="no-referrer" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Strefa Klienta</h2>
            <p className="text-slate-500">Zaloguj się, aby zarządzać biletami</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" defaultValue="maciej.fiszer@example.com" className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hasło</label>
              <input type="password" defaultValue="password" className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <button 
              onClick={() => setIsLoggedIn(true)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
            >
              Zaloguj się
            </button>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-slate-500">lub</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
               <button className="flex items-center justify-center py-2 border rounded hover:bg-slate-50 text-sm font-medium text-slate-600 bg-white">Google</button>
               <button className="flex items-center justify-center py-2 border rounded hover:bg-slate-50 text-sm font-medium text-slate-600 bg-white">Facebook</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleStartBooking = () => {
     setActiveTab('NEW_BOOKING');
     setBookingStep(1);
     setBookingData({
        origin: 'Świnoujście',
        destination: 'Ystad',
        date: new Date().toISOString().split('T')[0],
        pax: 1,
        vehicle: VehicleType.NONE,
        selectedRouteId: '',
        cabin: CabinType.NONE,
        passengerName: MOCK_CLIENT.lastName + ' ' + MOCK_CLIENT.firstName
     });
  };

  const getAvailableRoutes = () => {
     return MOCK_ROUTES.filter(r => r.origin.includes(bookingData.origin) && (r.destination.includes(bookingData.destination)));
  };

  const calculateTotal = () => {
     const route = MOCK_ROUTES.find(r => r.id === bookingData.selectedRouteId);
     if (!route) return 0;
     let total = route.basePrice * bookingData.pax;
     if (bookingData.vehicle !== VehicleType.NONE) total += 150;
     if (bookingData.cabin !== CabinType.NONE) total += 200;
     return total;
  };

  const confirmBooking = () => {
     const newRes: Reservation = {
        id: `RES-WEB-${Date.now().toString().slice(-5)}`,
        bookingDate: bookingData.date,
        status: BookingStatus.PAID,
        routeId: bookingData.selectedRouteId,
        passengers: [{
           id: `P-${Date.now()}`,
           firstName: bookingData.passengerName.split(' ')[1] || '',
           lastName: bookingData.passengerName.split(' ')[0] || '',
           documentNumber: 'AA000000',
        }],
        vehicleType: bookingData.vehicle,
        cabinType: bookingData.cabin,
        totalPrice: calculateTotal(),
        contactEmail: MOCK_CLIENT.email,
        isCargo: false
     };
     setMyReservations([newRes, ...myReservations]);
     setActiveTab('TICKETS');
     setTicketFilter('UPCOMING');
     alert('Rezerwacja została opłacona i potwierdzona! Bilet jest gotowy do pobrania.');
  };

  const handleConfirmCabinChange = () => {
    if (!targetResForCabinChange || !newCabinType) return;
    
    // Simple logic: find old price and new price
    const oldCabinPrice = MOCK_CABIN_PRICES.find(cp => cp.type === targetResForCabinChange.cabinType)?.price || 0;
    const newCabinPrice = MOCK_CABIN_PRICES.find(cp => cp.type === newCabinType)?.price || 0;
    const diff = newCabinPrice - oldCabinPrice;

    setMyReservations(prev => prev.map(r => 
        r.id === targetResForCabinChange.id 
            ? { ...r, cabinType: newCabinType, totalPrice: r.totalPrice + diff } 
            : r
    ));
    
    setTargetResForCabinChange(null);
    setNewCabinType(null);
    alert(t('client.tickets.change_cabin_success'));
  };

  const today = new Date().toISOString().split('T')[0];
  const displayedTickets = myReservations.filter(r => {
     if (ticketFilter === 'UPCOMING') {
        return r.status !== BookingStatus.CANCELLED && r.bookingDate >= today;
     } else {
        return r.status === BookingStatus.CANCELLED || r.bookingDate < today;
     }
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
            <img src="http://fiszer.app/polsca/files/ferros-logo.png" alt="FerrOS Logo" className="h-8 w-auto object-contain" referrerPolicy="no-referrer" />
            <span className="text-slate-400 font-normal text-sm ml-2">Client Portal</span>
          </div>
          <div className="flex items-center gap-6">
             <nav className="hidden md:flex gap-6 text-sm font-medium">
                <button 
                  onClick={() => setActiveTab('TICKETS')}
                  className={`flex items-center gap-2 py-2 border-b-2 transition ${activeView === 'TICKETS' || activeView === 'NEW_BOOKING' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  <Ticket size={18} /> Moje Bilety
                </button>
                <button 
                   onClick={() => setActiveTab('PROFILE')}
                   className={`flex items-center gap-2 py-2 border-b-2 transition ${activeView === 'PROFILE' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  <User size={18} /> Mój Profil
                </button>
             </nav>
             <div className="h-6 w-px bg-slate-200"></div>
             <button onClick={() => setIsLoggedIn(false)} className="text-slate-500 hover:text-red-500 transition">
               <LogOut size={20} />
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        
        {activeView === 'TICKETS' && (
          <div className="space-y-6 animate-fade-in">
             <div className="flex flex-col md:flex-row justify-between items-end gap-4">
               <div>
                 <h1 className="text-2xl font-bold text-slate-800">Twoje Rezerwacje</h1>
                 <p className="text-slate-500">Zarządzaj swoimi podróżami i pobieraj bilety.</p>
               </div>
               <div className="flex gap-3">
                  <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm flex">
                     <button 
                        onClick={() => setTicketFilter('UPCOMING')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition flex items-center gap-2 ${ticketFilter === 'UPCOMING' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}
                     >
                        <Ticket size={16}/> Nadchodzące
                     </button>
                     <button 
                        onClick={() => setTicketFilter('HISTORY')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition flex items-center gap-2 ${ticketFilter === 'HISTORY' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}
                     >
                        <History size={16}/> Historia
                     </button>
                  </div>
                  <button 
                     onClick={handleStartBooking}
                     className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-md flex items-center gap-2 h-[42px]"
                  >
                     <Plus size={18} className="hidden sm:block"/> Nowa Rezerwacja
                  </button>
               </div>
             </div>

             <div className="grid gap-4">
               {displayedTickets.length > 0 ? displayedTickets.map(res => (
                 <div key={res.id} className={`bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition-shadow ${ticketFilter === 'HISTORY' ? 'opacity-80 grayscale-[0.5]' : ''}`}>
                    <div className="flex items-center gap-6 flex-1">
                       <div className={`p-4 rounded-xl hidden sm:block ${ticketFilter === 'HISTORY' ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-600'}`}>
                         <Calendar size={32} />
                       </div>
                       <div>
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Rezerwacja {res.id}</div>
                          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            {res.routeId === 'R004' || res.routeId === 'R005' ? 'Świnoujście' : (res.routeId === 'R001' ? 'Gdańsk' : 'Świnoujście')} 
                            <span className="text-slate-300">→</span> 
                            {res.routeId === 'R004' || res.routeId === 'R005' ? 'Trelleborg' : (res.routeId === 'R001' ? 'Nynäshamn' : 'Ystad')}
                          </h3>
                          <div className="text-sm text-slate-500 mt-1 flex gap-4">
                            <span className="flex items-center gap-1"><Calendar size={14}/> {res.bookingDate}</span>
                            <span className="flex items-center gap-1"><Ship size={14}/> {res.vehicleType === VehicleType.NONE ? 'Pieszy' : res.vehicleType}</span>
                            <span className="flex items-center gap-1"><Bed size={14}/> {res.cabinType}</span>
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1">
                       <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          res.status === 'Potwierdzona' || res.status === 'Opłacona' ? 'bg-emerald-100 text-emerald-700' : 
                          res.status === 'Anulowana' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                       }`}>
                         {res.status}
                       </span>
                       <span className="font-bold text-slate-700 mt-2">{res.totalPrice} PLN</span>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                       {ticketFilter === 'UPCOMING' ? (
                          <>
                             <button 
                                onClick={() => setViewTicket(res)}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium text-sm transition"
                             >
                               <Printer size={16}/> Bilet
                             </button>
                             <button 
                                onClick={() => setTargetResForCabinChange(res)}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 rounded text-indigo-700 font-medium text-sm transition"
                             >
                               <Bed size={16}/> {t('client.tickets.change_cabin')}
                             </button>
                             <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 rounded text-red-600 font-medium text-sm transition">
                               <XCircle size={16}/> Anuluj
                             </button>
                          </>
                       ) : (
                          <button 
                             onClick={() => handleStartBooking()}
                             className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-blue-200 text-blue-600 rounded font-medium text-sm hover:bg-blue-50 transition"
                          >
                             <RotateCcw size={16}/> Rezerwuj Ponownie
                          </button>
                       )}
                    </div>
                 </div>
               )) : (
                 <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                   <p className="text-slate-500">
                      {ticketFilter === 'UPCOMING' ? 'Nie masz nadchodzących rezerwacji.' : 'Brak historii rezerwacji.'}
                   </p>
                   {ticketFilter === 'UPCOMING' && (
                      <button onClick={handleStartBooking} className="mt-4 text-blue-600 font-bold hover:underline">Znajdź połączenie</button>
                   )}
                 </div>
               )}
             </div>
          </div>
        )}

        {/* --- MODAL: CHANGE CABIN --- */}
        {targetResForCabinChange && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in duration-200">
                <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                    <h3 className="text-xl font-bold flex items-center gap-2"><Bed size={24} className="text-indigo-400"/> {t('client.modal.change_cabin_title')}</h3>
                    <button onClick={() => setTargetResForCabinChange(null)} className="text-slate-400 hover:text-white"><X size={24}/></button>
                </div>
                <div className="p-8 space-y-6">
                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <p className="text-xs text-slate-400 font-bold uppercase mb-1">{t('client.modal.current_cabin')}</p>
                      <p className="font-bold text-slate-800 text-lg">{targetResForCabinChange.cabinType}</p>
                   </div>
                   
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3">{t('client.modal.new_cabin_select')}</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                         {MOCK_CABIN_PRICES.map(cp => {
                            const isCurrent = cp.type === targetResForCabinChange.cabinType;
                            const currentPrice = MOCK_CABIN_PRICES.find(x => x.type === targetResForCabinChange.cabinType)?.price || 0;
                            const diff = cp.price - currentPrice;

                            return (
                               <button 
                                  key={cp.type} 
                                  onClick={() => !isCurrent && setNewCabinType(cp.type as CabinType)}
                                  className={`p-4 rounded-xl border-2 text-left transition flex flex-col justify-between h-24 ${
                                     isCurrent ? 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed' :
                                     newCabinType === cp.type ? 'border-indigo-600 bg-indigo-50 shadow-md' :
                                     'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                                  }`}
                               >
                                  <span className={`font-bold text-sm ${newCabinType === cp.type ? 'text-indigo-700' : 'text-slate-700'}`}>{cp.type}</span>
                                  {!isCurrent && (
                                     <span className={`text-xs font-bold ${diff >= 0 ? 'text-emerald-600' : 'text-blue-600'}`}>
                                        {diff === 0 ? 'W tej samej cenie' : diff > 0 ? `+${diff} PLN` : `${diff} PLN`}
                                     </span>
                                  )}
                                  {isCurrent && <span className="text-xs text-slate-400 font-medium italic">Obecny wybór</span>}
                               </button>
                            )
                         })}
                      </div>
                   </div>

                   {newCabinType && (
                      <div className="pt-4 border-t border-slate-100 flex justify-between items-center animate-in slide-in-from-top-2">
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('client.modal.price_diff')}</p>
                            <p className={`text-xl font-bold ${
                               (MOCK_CABIN_PRICES.find(cp => cp.type === newCabinType)?.price || 0) - (MOCK_CABIN_PRICES.find(cp => cp.type === targetResForCabinChange.cabinType)?.price || 0) > 0 ? 'text-amber-600' : 'text-emerald-600'
                            }`}>
                               {(MOCK_CABIN_PRICES.find(cp => cp.type === newCabinType)?.price || 0) - (MOCK_CABIN_PRICES.find(cp => cp.type === targetResForCabinChange.cabinType)?.price || 0)} PLN
                            </p>
                         </div>
                         <button 
                            onClick={handleConfirmCabinChange}
                            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition"
                         >
                            {t('client.modal.confirm_change')}
                         </button>
                      </div>
                   )}
                </div>
             </div>
          </div>
        )}

        {/* --- NEW BOOKING WIZARD --- */}
        {activeView === 'NEW_BOOKING' && (
           <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-right-4">
              <div className="flex items-center gap-4 mb-6">
                 <button onClick={() => setActiveTab('TICKETS')} className="p-2 hover:bg-white rounded-full transition text-slate-500 hover:text-slate-700">
                    <ChevronLeft size={24}/>
                 </button>
                 <div>
                    <h1 className="text-2xl font-bold text-slate-800">Nowa Rezerwacja</h1>
                    <p className="text-sm text-slate-500">Krok {bookingStep} z 4</p>
                 </div>
              </div>

              {/* Progress Bar */}
              <div className="flex gap-2 mb-8">
                 {[1,2,3,4].map(s => (
                    <div key={s} className={`h-2 flex-1 rounded-full transition-all duration-500 ${s <= bookingStep ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                 ))}
              </div>

              {/* Step 1: Search */}
              {bookingStep === 1 && (
                 <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
                    <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2"><Search size={20} className="text-blue-500"/> Wyszukaj Połączenie</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Skąd</label>
                          <select 
                             className="w-full border p-3 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                             value={bookingData.origin}
                             onChange={e => setBookingData({...bookingData, origin: e.target.value})}
                          >
                             <option value="Świnoujście">Świnoujście (PL)</option>
                             <option value="Ystad">Ystad (SE)</option>
                             <option value="Trelleborg">Trelleborg (SE)</option>
                          </select>
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Dokąd</label>
                          <select 
                             className="w-full border p-3 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                             value={bookingData.destination}
                             onChange={e => setBookingData({...bookingData, destination: e.target.value})}
                          >
                             <option value="Świnoujście">Świnoujście (PL)</option>
                             <option value="Ystad">Ystad (SE)</option>
                             <option value="Trelleborg">Trelleborg (SE)</option>
                          </select>
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Data Podróży</label>
                          <input 
                             type="date" 
                             className="w-full border p-3 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                             value={bookingData.date}
                             onChange={e => setBookingData({...bookingData, date: e.target.value})}
                          />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="block text-sm font-bold text-slate-700 mb-2">Osoby</label>
                             <input 
                                type="number" 
                                min="1" max="9"
                                className="w-full border p-3 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={bookingData.pax}
                                onChange={e => setBookingData({...bookingData, pax: parseInt(e.target.value)})}
                             />
                          </div>
                          <div>
                             <label className="block text-sm font-bold text-slate-700 mb-2">Pojazd</label>
                             <select 
                                className="w-full border p-3 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                value={bookingData.vehicle}
                                onChange={e => setBookingData({...bookingData, vehicle: e.target.value as VehicleType})}
                             >
                                <option value={VehicleType.NONE}>Brak (Pieszy)</option>
                                <option value={VehicleType.CAR}>Osobowy</option>
                                <option value={VehicleType.MOTORCYCLE}>Motocykl</option>
                             </select>
                          </div>
                       </div>
                    </div>

                    <div className="pt-6 flex justify-end">
                       <button onClick={() => setBookingStep(2)} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition flex items-center gap-2">
                          Szukaj Rejsów <ArrowRight size={20}/>
                       </button>
                    </div>
                 </div>
              )}

              {/* Step 2: Select Route */}
              {bookingStep === 2 && (
                 <div className="space-y-4">
                    <h3 className="font-bold text-lg text-slate-700">Dostępne Połączenia</h3>
                    {getAvailableRoutes().map(route => (
                       <div 
                          key={route.id} 
                          onClick={() => {
                             setBookingData({...bookingData, selectedRouteId: route.id});
                             setBookingStep(3);
                          }}
                          className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-md transition cursor-pointer flex justify-between items-center group"
                       >
                          <div className="flex items-center gap-4">
                             <div className="bg-blue-50 text-blue-600 p-3 rounded-lg"><Ship size={24}/></div>
                             <div>
                                <h4 className="font-bold text-lg text-slate-800">{route.origin} &rarr; {route.destination}</h4>
                                <div className="text-sm text-slate-500 flex gap-3 mt-1">
                                   <span className="flex items-center gap-1"><Clock size={14}/> {new Date(route.departureTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
                                   <span>•</span>
                                   <span>{route.shipName}</span>
                                </div>
                             </div>
                          </div>
                          <div className="text-right">
                             <div className="text-sm text-slate-400">Cena od</div>
                             <div className="text-2xl font-bold text-blue-600 group-hover:scale-110 transition-transform">{route.basePrice} PLN</div>
                          </div>
                       </div>
                    ))}
                    {getAvailableRoutes().length === 0 && (
                       <div className="text-center py-12 text-slate-400">Brak dostępnych rejsów dla wybranych kryteriów.</div>
                    )}
                 </div>
              )}

              {/* Step 3: Details */}
              {bookingStep === 3 && (
                 <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
                    <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2"><Settings size={20} className="text-blue-500"/> Dane i Opcje</h3>
                    
                    <div className="space-y-4">
                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Dane Głównego Pasażera</label>
                          <input 
                             type="text" 
                             className="w-full border p-3 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                             value={bookingData.passengerName}
                             onChange={e => setBookingData({...bookingData, passengerName: e.target.value})}
                          />
                       </div>
                       
                       <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <label className="block text-sm font-bold text-slate-700 mb-3">Wybierz Kabinę</label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                             <button 
                                onClick={() => setBookingData({...bookingData, cabin: CabinType.NONE})}
                                className={`p-3 rounded-lg border text-sm font-medium transition ${bookingData.cabin === CabinType.NONE ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 hover:border-blue-300'}`}
                             >
                                Bez Kabiny <br/><span className="text-xs opacity-70">W cenie</span>
                             </button>
                             <button 
                                onClick={() => setBookingData({...bookingData, cabin: CabinType.INSIDE_4})}
                                className={`p-3 rounded-lg border text-sm font-medium transition ${bookingData.cabin === CabinType.INSIDE_4 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 hover:border-blue-300'}`}
                             >
                                Wewnętrzna 4-os <br/><span className="text-xs opacity-70">+200 PLN</span>
                             </button>
                             <button 
                                onClick={() => setBookingData({...bookingData, cabin: CabinType.LUX})}
                                className={`p-3 rounded-lg border text-sm font-medium transition ${bookingData.cabin === CabinType.LUX ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 hover:border-blue-300'}`}
                             >
                                Apartament LUX <br/><span className="text-xs opacity-70">+600 PLN</span>
                             </button>
                          </div>
                       </div>
                    </div>

                    <div className="pt-6 flex justify-between">
                       <button onClick={() => setBookingStep(2)} className="text-slate-500 font-bold hover:text-slate-700">Wstecz</button>
                       <button onClick={() => setBookingStep(4)} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition flex items-center gap-2">
                          Podsumowanie <ArrowRight size={20}/>
                       </button>
                    </div>
                 </div>
              )}

              {/* Step 4: Summary & Pay */}
              {bookingStep === 4 && (
                 <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
                    <div className="text-center mb-6">
                       <h3 className="text-2xl font-bold text-slate-800">Podsumowanie</h3>
                       <p className="text-slate-500">Sprawdź dane przed płatnością</p>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-xl space-y-3 text-sm border border-slate-200">
                       <div className="flex justify-between">
                          <span className="text-slate-500">Trasa:</span>
                          <span className="font-bold text-slate-700">{bookingData.origin} - {bookingData.destination}</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-slate-500">Data:</span>
                          <span className="font-bold text-slate-700">{bookingData.date}</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-slate-500">Pasażer:</span>
                          <span className="font-bold text-slate-700">{bookingData.passengerName}</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-slate-500">Pojazd:</span>
                          <span className="font-bold text-slate-700">{bookingData.vehicle}</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-slate-500">Kabina:</span>
                          <span className="font-bold text-slate-700">{bookingData.cabin}</span>
                       </div>
                       <div className="border-t border-slate-200 pt-3 mt-2 flex justify-between items-center">
                          <span className="font-bold text-lg text-slate-800">Do zapłaty:</span>
                          <span className="font-bold text-2xl text-blue-600">{calculateTotal()} PLN</span>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <button 
                          onClick={confirmBooking}
                          className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 shadow-xl shadow-green-100 transition flex justify-center items-center gap-2"
                       >
                          <CreditCard size={24}/> Zapłać Teraz (BLIK / Karta)
                       </button>
                       <button onClick={() => setBookingStep(3)} className="w-full text-slate-500 py-2 font-medium hover:text-slate-700">Wróć do edycji</button>
                    </div>
                 </div>
              )}
           </div>
        )}

        {/* PROFILE VIEW */}
        {activeView === 'PROFILE' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
             <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-2">
                    <Ship className="text-blue-400"/>
                    <span className="font-bold tracking-widest">FERRIES<span className="text-blue-400">CLUB</span></span>
                  </div>
                  <Star className="text-amber-400 fill-amber-400" />
                </div>
                <div className="mb-6">
                   <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Dostępne Punkty</p>
                   <h3 className="text-4xl font-bold">{MOCK_CLIENT.points} pkt</h3>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-slate-400 uppercase">Uczestnik</p>
                    <p className="font-medium">{MOCK_CLIENT.firstName} {MOCK_CLIENT.lastName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase">Status</p>
                    <p className="font-bold text-amber-400">GOLD</p>
                  </div>
                </div>
             </div>

             <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Settings size={20} className="text-slate-400" /> Dane Konta
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">Imię</label>
                     <input type="text" defaultValue={MOCK_CLIENT.firstName} className="w-full border p-2 rounded bg-white" />
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">Nazwisko</label>
                     <input type="text" defaultValue={MOCK_CLIENT.lastName} className="w-full border p-2 rounded bg-white" />
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                     <input type="email" defaultValue={MOCK_CLIENT.email} className="w-full border p-2 rounded bg-slate-50" disabled />
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">Telefon</label>
                     <input type="tel" defaultValue="+48 600 123 456" className="w-full border p-2 rounded bg-white" />
                   </div>
                   <div className="md:col-span-2">
                     <label className="block text-sm font-bold text-slate-700 mb-1">Adres</label>
                     <div className="flex gap-2 items-center border p-2 rounded bg-white">
                        <MapPin size={18} className="text-slate-400"/>
                        <input type="text" defaultValue="ul. Morska 5, 80-001 Gdańsk" className="w-full bg-transparent outline-none" />
                     </div>
                   </div>
                </div>
                <div className="mt-8 flex justify-end">
                   <button className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800">
                     Zapisz Zmiany
                   </button>
                </div>
             </div>
          </div>
        )}

        {/* TICKET MODAL */}
        {viewTicket && (
           <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-300 relative flex flex-col md:flex-row">
                 <button 
                    onClick={() => setViewTicket(null)} 
                    className="absolute top-4 right-4 text-white/80 hover:text-white z-10 bg-black/20 hover:bg-black/40 rounded-full p-2 transition"
                 >
                    <X size={24}/>
                 </button>

                 <div className="flex-1 p-8 bg-white relative">
                    <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
                       <div className="flex items-center gap-3">
                          
                          <div>
                             <img src="http://fiszer.app/polsca/files/ferros-logo.png" alt="FerrOS Logo" className="h-10 w-auto object-contain" referrerPolicy="no-referrer" />
                             <p className="text-xs text-slate-400 uppercase tracking-widest">Karta Pokładowa</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-xs font-bold text-slate-400 uppercase">Nr Rezerwacji</p>
                          <p className="text-xl font-mono font-black text-slate-800">{viewTicket.id}</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-10 mb-8">
                       <div>
                          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase mb-1">
                             <Navigation size={12}/> Z
                          </div>
                          <div className="text-3xl font-black text-slate-800">{viewTicket.routeId === 'R001' ? 'GDAŃSK' : 'ŚWINOUJŚCIE'}</div>
                          <div className="text-sm text-slate-500">Terminal Promowy A</div>
                       </div>
                       <div>
                          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase mb-1">
                             <Navigation size={12}/> Do
                          </div>
                          <div className="text-3xl font-black text-slate-800">{viewTicket.routeId === 'R004' || viewTicket.routeId === 'R005' ? 'TRELLEBORG' : (viewTicket.routeId === 'R001' ? 'NYNÄSHAMN' : 'YSTAD')}</div>
                          <div className="text-sm text-slate-500">Port Główny</div>
                       </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 grid grid-cols-2 md:grid-cols-3 gap-6">
                       <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Pasażer</p>
                          <p className="font-bold text-slate-800">{viewTicket.passengers[0]?.lastName || 'Brak'} {viewTicket.passengers[0]?.firstName?.charAt(0) || '?'}.</p>
                       </div>
                       <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Data</p>
                          <p className="font-bold text-slate-800">{viewTicket.bookingDate}</p>
                       </div>
                       <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Godzina</p>
                          <p className="font-bold text-slate-800">18:00</p>
                       </div>
                       <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Statek</p>
                          <p className="font-bold text-slate-800">m/f Polonia</p>
                       </div>
                       <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Pojazd</p>
                          <p className="font-bold text-slate-800">{viewTicket.vehicleType === VehicleType.NONE ? 'Brak' : viewTicket.vehicleType}</p>
                       </div>
                       <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Kabina</p>
                          <p className="font-bold text-slate-800">{viewTicket.cabinType === CabinType.NONE ? 'Pokład' : '5002'}</p>
                       </div>
                    </div>

                    <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
                       <Clock size={14}/>
                       <span>Bramki zamykane są 30 minut przed odejściem. Prosimy o punktualność.</span>
                    </div>
                 </div>

                 <div className="relative w-full h-4 md:w-4 md:h-auto bg-slate-100 flex items-center justify-center overflow-hidden">
                    <div className="absolute border-dashed border-slate-300 w-full h-full md:border-l-2 md:border-t-0 border-t-2"></div>
                    <div className="w-6 h-6 bg-slate-800 rounded-full absolute -left-3 md:left-auto md:-top-3"></div>
                    <div className="w-6 h-6 bg-slate-800 rounded-full absolute -right-3 md:right-auto md:-bottom-3"></div>
                 </div>

                 <div className="w-full md:w-80 bg-slate-800 p-8 text-white flex flex-col justify-between relative">
                    <div className="text-center">
                       <div className="bg-white p-4 rounded-xl inline-block mb-4 shadow-lg">
                          <QrCode size={120} className="text-slate-900"/>
                       </div>
                       <p className="font-mono text-sm tracking-widest text-slate-400">{viewTicket.id}</p>
                    </div>

                    <div className="space-y-4 my-6">
                       <div className="flex justify-between border-b border-slate-700 pb-2">
                          <span className="text-xs text-slate-400">Boarding</span>
                          <span className="font-bold">17:15</span>
                       </div>
                       <div className="flex justify-between border-b border-slate-700 pb-2">
                          <span className="text-xs text-slate-400">Gate</span>
                          <span className="font-bold text-xl">B2</span>
                       </div>
                       <div className="flex justify-between border-b border-slate-700 pb-2">
                          <span className="text-xs text-slate-400">Miejsce</span>
                          <span className="font-bold">5002</span>
                       </div>
                    </div>

                    <button 
                       onClick={() => window.print()}
                       className="w-full bg-white text-slate-900 py-3 rounded-lg font-bold hover:bg-blue-50 transition flex items-center justify-center gap-2"
                    >
                       <Printer size={18}/> Drukuj
                    </button>
                 </div>
              </div>
           </div>
        )}
      </main>
    </div>
  );
};

export default ClientPanel;
