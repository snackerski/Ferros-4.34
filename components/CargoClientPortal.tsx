
import React, { useState, useMemo } from 'react';
import { 
  Truck, LayoutDashboard, CalendarPlus, History, FileText, Settings, LogOut, 
  Search, ShieldCheck, Ship, ArrowRight, Navigation, Weight, Ruler, CheckCircle, 
  Clock, Info, Menu, X, Plus, User, Edit, Trash2, Phone, CreditCard as IdCard,
  Smartphone, UserCheck, CalendarDays, Download, Filter, ChevronLeft, ChevronRight, 
  AlertOctagon, ArrowUpRight, BarChart3, Wallet, Zap, Activity, TrendingUp, Percent,
  Calendar as CalendarIcon, List as ListIcon, MoreVertical, Hash, ExternalLink, Save,
  LayoutList
} from 'lucide-react';
import { 
  Forwarder, CargoBooking, BookingStatus, VehicleType, SailingStatus, CargoVehicle, CargoDriver, SailingSchedule 
} from '../types';
import { 
  MOCK_CARGO_BOOKINGS, MOCK_ROUTES, MOCK_SAILING_SCHEDULES, MOCK_ALLOTMENTS, 
  MOCK_CARGO_VEHICLES, MOCK_CARGO_DRIVERS, MOCK_CARGO_INVOICES 
} from '../services/mockData';
import { useTranslation } from '../i18n';

interface CargoClientPortalProps {
  client: Forwarder;
}

const CargoClientPortal: React.FC<CargoClientPortalProps> = ({ client }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'BOOK' | 'CALENDAR' | 'HISTORY' | 'FINANCE' | 'DRIVERS' | 'VEHICLES'>('DASHBOARD');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [calendarViewMode, setCalendarViewMode] = useState<'MONTH' | 'LIST'>('MONTH');
  
  // --- STATE DLA PODGLĄDU REZERWACJI ---
  const [selectedBookingForPreview, setSelectedBookingForPreview] = useState<CargoBooking | null>(null);

  // --- STATE DLA HISTORII I FILTRÓW ---
  const [historySearch, setHistorySearch] = useState('');
  const [selectedDate, setSelectedDate] = useState('2025-05-22');

  const myBookings = useMemo(() => 
    MOCK_CARGO_BOOKINGS.filter(b => b.forwarderId === client.id), [client.id]);

  const filteredHistory = useMemo(() => 
    myBookings.filter(b => 
      b.id.toLowerCase().includes(historySearch.toLowerCase()) || 
      b.vehicleReg?.toLowerCase().includes(historySearch.toLowerCase()) ||
      b.cargoDetails?.forwarderRef?.toLowerCase().includes(historySearch.toLowerCase())
    ), [myBookings, historySearch]);

  // --- STATE DLA ZASOBÓW ---
  const [myVehicles] = useState<CargoVehicle[]>(MOCK_CARGO_VEHICLES.filter(v => v.forwarderId === client.id));
  const [myDrivers] = useState<CargoDriver[]>(MOCK_CARGO_DRIVERS.filter(d => d.forwarderId === client.id));

  // --- STATE DLA KREATORA ---
  const [bookingStep, setBookingStep] = useState(1);
  const [newBooking, setNewBooking] = useState<Partial<CargoBooking>>({
    routeId: '',
    bookingDate: new Date().toISOString().split('T')[0],
    vehicleType: VehicleType.TRUCK,
    cargoDetails: { length: 16.5, weight: 24, loadType: 0 as any }
  });

  // --- LOGIKA DOSTĘPNOŚCI DLA KREATORA (Etap 42.1) ---
  const availabilityStrip = useMemo(() => {
    const start = new Date(newBooking.bookingDate || new Date());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + (i - 2)); // Pokazujemy 2 dni wstecz i 4 do przodu
      const iso = d.toISOString().split('T')[0];
      const isWeekend = [0, 6].includes(d.getDay());
      // Symulacja obłożenia allotmentu
      const occupancy = isWeekend ? 92 : (25 + (i * 14) % 65);
      return {
        date: iso,
        label: d.toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric' }),
        occupancy
      };
    });
  }, [newBooking.bookingDate]);

  // --- KALENDARZ LOGIKA ---
  const daysInMonth = 31;
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `2025-05-${day.toString().padStart(2, '0')}`;
    const dayBookings = myBookings.filter(b => b.bookingDate === dateStr);
    const usedMeters = dayBookings.reduce((acc, b) => acc + (b.cargoDetails?.length || 0), 0);
    const totalAllotment = MOCK_ALLOTMENTS.find(a => a.forwarderId === client.id)?.totalSpace || 100;
    const isWeekend = [3, 4, 10, 11, 17, 18, 24, 25, 31].includes(day);
    const baseOccupancy = isWeekend ? 85 : (day % 7) * 12;
    const occupancy = Math.max(baseOccupancy, (usedMeters / totalAllotment) * 100);
    const sailingsCount = 2; // Always show at least 2 sailings in calendar dots
    return { day, dateStr, occupancy, sailingsCount, bookings: dayBookings };
  });

  const dailySailings = useMemo(() => {
    const real = MOCK_SAILING_SCHEDULES.filter(s => s.originalDeparture.startsWith(selectedDate));
    if (real.length > 0) return real;

    // Przykładowa lista rejsów, gdy brak danych w mockach dla konkretnej daty
    return [
      {
        routeId: 'R001',
        shipName: 'm/f Polonia',
        originalDeparture: `${selectedDate}T13:00:00`,
        actualDeparture: `${selectedDate}T13:00:00`,
        status: SailingStatus.SCHEDULED,
        paxCount: 450,
        cargoMeterCount: 1200
      },
      {
        routeId: 'R003',
        shipName: 'm/f Skania',
        originalDeparture: `${selectedDate}T23:00:00`,
        actualDeparture: `${selectedDate}T23:00:00`,
        status: SailingStatus.SCHEDULED,
        paxCount: 800,
        cargoMeterCount: 1500
      }
    ] as SailingSchedule[];
  }, [selectedDate]);

  const menuItems = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'BOOK', label: 'Nowy Fracht', icon: <CalendarPlus size={20} /> },
    { id: 'CALENDAR', label: 'Harmonogram', icon: <CalendarDays size={20} /> },
    { id: 'HISTORY', label: 'Lista Rezerwacji', icon: <History size={20} /> },
    { id: 'VEHICLES', label: 'Flota', icon: <Truck size={20} /> },
    { id: 'DRIVERS', label: 'Kierowcy', icon: <User size={20} /> },
    { id: 'FINANCE', label: 'Rozliczenia', icon: <Wallet size={20} /> },
  ];

  const getStatusColor = (status: BookingStatus) => {
    switch(status) {
      case BookingStatus.PAID: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case BookingStatus.CONFIRMED: return 'bg-blue-100 text-blue-700 border-blue-200';
      case BookingStatus.CHECKED_IN: return 'bg-slate-800 text-white border-slate-900';
      case BookingStatus.WAITING_LIST: return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden text-slate-800">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex flex-col gap-1 border-b border-white/10">
          <img src="http://fiszer.app/polsca/files/ferros-logo.png" alt="FerrOS Logo" className="h-9 w-auto object-contain self-start" referrerPolicy="no-referrer" />
          <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mt-1">Cargo Portal</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto sidebar-scroll">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id as any); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              {item.icon} <span className="font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-white/5">
           <button onClick={() => window.location.reload()} className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-400 transition-colors text-sm font-bold">
              <LogOut size={18} /> Wyloguj
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-500"><Menu/></button>
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">{menuItems.find(i => i.id === activeTab)?.label}</h2>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right">
                <p className="text-sm font-black text-slate-800 leading-none">{client.name}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Contract: {client.contractNumber}</p>
             </div>
             <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 border border-slate-200"><ShieldCheck size={20}/></div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-8">
          
          {/* === DASHBOARD TAB === */}
          {activeTab === 'DASHBOARD' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition group">
                  <div className="bg-amber-100 p-3 rounded-lg w-fit text-amber-600 mb-4 group-hover:scale-110 transition-transform"><Truck size={24}/></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aktywne Rezerwacje</p>
                    <h3 className="text-3xl font-black text-slate-800">{myBookings.length}</h3>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition group">
                  <div className="bg-blue-100 p-3 rounded-lg w-fit text-blue-600 mb-4 group-hover:scale-110 transition-transform"><Ruler size={24}/></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Suma mb (Maj)</p>
                    <h3 className="text-3xl font-black text-slate-800">
                        {myBookings.reduce((acc, b) => acc + (b.cargoDetails?.length || 0), 0).toFixed(1)} m
                    </h3>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition group">
                  <div className="bg-emerald-100 p-3 rounded-lg w-fit text-emerald-600 mb-4 group-hover:scale-110 transition-transform"><ShieldCheck size={24}/></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Limit Kredytowy</p>
                    <h3 className="text-3xl font-black text-slate-800">{client.currentBalance.toLocaleString()} / {client.creditLimit.toLocaleString()} <span className="text-sm">PLN</span></h3>
                  </div>
                </div>
                <div className="bg-slate-900 p-6 rounded-lg shadow-xl flex flex-col justify-between text-white overflow-hidden relative group">
                  <Activity className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32 group-hover:scale-110 transition-transform duration-700"/>
                  <div className="bg-white/10 p-3 rounded-lg w-fit text-amber-500 mb-4"><Zap size={24}/></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Wykorzystany Allotment</p>
                    <h3 className="text-3xl font-black">74%</h3>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Nadchodzące rejsy</h3>
                    <button onClick={() => setActiveTab('HISTORY')} className="text-[10px] font-black text-blue-600 uppercase hover:underline">Pełna lista</button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {myBookings.filter(b => b.status === BookingStatus.CONFIRMED).slice(0, 5).map(b => (
                      <div key={b.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition group">
                        <div className="flex items-center gap-4">
                          <div className="bg-slate-900 px-3 py-1.5 rounded border border-slate-800 text-white font-mono font-bold text-xs tracking-widest shadow-sm group-hover:border-amber-500 transition-colors">
                            {b.vehicleReg}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{b.routeId}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{b.bookingDate}</p>
                          </div>
                        </div>
                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded text-[10px] font-black uppercase border border-blue-100">Potwierdzona</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 flex flex-col justify-center items-center text-center relative overflow-hidden group">
                   <TrendingUp className="absolute -left-8 -bottom-8 text-slate-50 w-64 h-64 pointer-events-none group-hover:scale-110 transition-transform duration-1000"/>
                   <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-4 border-2 border-amber-100 relative z-10">
                      <Percent size={28}/>
                   </div>
                   <h3 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-tighter relative z-10">Próg Rabatowy Maj</h3>
                   <p className="text-sm text-slate-500 max-w-xs mb-6 relative z-10 font-medium">Brakuje Ci <span className="font-black text-slate-800">160 m</span> w tym miesiącu do aktywacji <span className="font-black text-emerald-600">ekstra 2.5% rabatu progresywnego</span>.</p>
                   <button onClick={() => setActiveTab('BOOK')} className="px-8 py-3 bg-slate-900 text-white rounded-lg font-black uppercase text-xs tracking-widest hover:bg-amber-600 transition-all shadow-lg active:scale-95 relative z-10">Rezerwuj Nowy Fracht</button>
                </div>
              </div>
            </div>
          )}

          {/* === BOOKING TAB (WIZARD) === */}
          {activeTab === 'BOOK' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
              <div className="flex gap-2 mb-8">
                 {[1,2,3].map(s => (
                    <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${s <= bookingStep ? 'bg-amber-600 shadow-sm' : 'bg-slate-200'}`}></div>
                 ))}
              </div>

              {bookingStep === 1 && (
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden p-8 animate-in slide-in-from-right-4 duration-500">
                  <h3 className="text-xl font-black text-slate-800 mb-8 uppercase tracking-tight flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded flex items-center justify-center text-amber-600 text-sm">1</div>
                    Konfiguracja Trasy
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Kierunek / Relacja</label>
                      <select 
                        className="w-full border-2 border-slate-100 p-4 rounded-xl bg-slate-50 font-black text-slate-700 outline-none focus:border-amber-500 transition-all shadow-inner cursor-pointer"
                        onChange={e => setNewBooking({...newBooking, routeId: e.target.value})}
                      >
                        <option value="">Wybierz trasę...</option>
                        {MOCK_ROUTES.map(r => <option key={r.id} value={r.id}>{r.origin} → {r.destination}</option>)}
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Data Podróży</label>
                      <input 
                        type="date" 
                        className="w-full border-2 border-slate-100 p-4 rounded-xl bg-slate-50 font-black text-slate-700 outline-none focus:border-amber-500 transition-all shadow-inner"
                        value={newBooking.bookingDate}
                        onChange={e => setNewBooking({...newBooking, bookingDate: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* PASEK DOSTĘPNOŚCI W RÓŻNYCH DNIACH (Etap 42.1) */}
                  <div className="mb-10">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1 mb-3 flex items-center gap-2">
                        <Activity size={14} className="text-amber-500"/> Podgląd dostępności allotmentu
                     </label>
                     <div className="grid grid-cols-7 gap-2">
                        {availabilityStrip.map((day) => (
                           <button 
                              key={day.date}
                              onClick={() => setNewBooking({...newBooking, bookingDate: day.date})}
                              className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 group ${
                                 newBooking.bookingDate === day.date 
                                 ? 'border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-500/10' 
                                 : 'border-slate-100 hover:bg-slate-50'
                              }`}
                           >
                              <span className={`text-[9px] font-black uppercase leading-none ${newBooking.bookingDate === day.date ? 'text-amber-600' : 'text-slate-400'}`}>
                                 {day.label.split(' ')[0]}
                              </span>
                              <span className={`text-sm font-black font-mono leading-none ${newBooking.bookingDate === day.date ? 'text-slate-900' : 'text-slate-600'}`}>
                                 {day.label.split(' ')[1]}
                              </span>
                              <div className="w-full h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                                 <div 
                                    className={`h-full transition-all duration-1000 ${day.occupancy > 90 ? 'bg-red-500' : day.occupancy > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                    style={{ width: `${day.occupancy}%` }}
                                 ></div>
                              </div>
                              <span className={`text-[8px] font-bold mt-0.5 ${day.occupancy > 90 ? 'text-red-500' : 'text-slate-400'}`}>
                                 {day.occupancy}%
                              </span>
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="mt-12 flex justify-end">
                    <button onClick={() => setBookingStep(2)} className="px-10 py-4 bg-slate-900 text-white rounded-lg font-black uppercase text-sm tracking-widest flex items-center gap-4 hover:bg-amber-600 transition-all active:scale-95 shadow-lg">
                      Dalej <ArrowRight size={20}/>
                    </button>
                  </div>
                </div>
              )}

              {bookingStep === 2 && (
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden p-8 animate-in slide-in-from-right-4 duration-500">
                  <h3 className="text-xl font-black text-slate-800 mb-8 uppercase tracking-tight flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded flex items-center justify-center text-amber-600 text-sm">2</div>
                    Pojazd i Obsada
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Zidentyfikuj Pojazd z bazy</label>
                       <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 scrollbar-hide">
                          {myVehicles.map(v => (
                             <button 
                               key={v.id}
                               onClick={() => setNewBooking({...newBooking, vehicleReg: v.registrationNumber, cargoDetails: {...newBooking.cargoDetails!, length: v.length, weight: v.weight}})}
                               className={`w-full p-4 border-2 rounded-xl text-left transition-all ${newBooking.vehicleReg === v.registrationNumber ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/10' : 'border-slate-100 hover:bg-slate-50'}`}
                             >
                                <div className="flex justify-between items-center">
                                   <div className="flex flex-col">
                                      <span className="font-mono font-black text-lg text-slate-800 tracking-widest">{v.registrationNumber}</span>
                                      {v.name && <span className="text-[9px] font-bold text-slate-500 uppercase">{v.name}</span>}
                                   </div>
                                   <span className="text-[9px] font-black uppercase bg-white border px-2 py-0.5 rounded shadow-sm">{v.type}</span>
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight">{v.length}m • {v.weight}t dmc</p>
                             </button>
                          ))}
                       </div>
                    </div>
                    <div className="space-y-6">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Wybierz Kierowcę</label>
                       <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 scrollbar-hide">
                          {myDrivers.map(d => (
                             <button 
                               key={d.id}
                               onClick={() => setNewBooking({...newBooking, passengers: [{id: d.id, firstName: d.firstName, lastName: d.lastName, documentNumber: d.documentNumber, isDriver: true}]})}
                               className={`w-full p-4 border-2 rounded-xl text-left transition-all ${newBooking.passengers?.[0]?.id === d.id ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/10' : 'border-slate-100 hover:bg-slate-50'}`}
                             >
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center text-slate-500 font-black uppercase">{d.lastName[0]}{d.firstName[0]}</div>
                                   <div>
                                      <p className="font-black text-slate-800 text-sm leading-tight uppercase">{d.lastName} {d.firstName}</p>
                                      <p className="text-[10px] text-slate-400 font-mono font-bold mt-0.5 uppercase tracking-tighter">{d.documentNumber}</p>
                                   </div>
                                </div>
                             </button>
                          ))}
                       </div>
                    </div>
                  </div>
                  <div className="mt-12 flex justify-between">
                    <button onClick={() => setBookingStep(1)} className="px-8 py-4 border border-slate-200 rounded-lg font-black uppercase text-xs text-slate-400 hover:bg-slate-50 transition-all">Wstecz</button>
                    <button onClick={() => setBookingStep(3)} className="px-10 py-4 bg-slate-900 text-white rounded-lg font-black uppercase text-sm tracking-widest flex items-center gap-4 hover:bg-amber-600 transition-all active:scale-95 shadow-lg">
                      Podsumowanie <ArrowRight size={20}/>
                    </button>
                  </div>
                </div>
              )}

              {bookingStep === 3 && (
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden p-8 animate-in zoom-in duration-500">
                  <div className="text-center mb-10">
                     <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-50">
                        <CheckCircle size={32}/>
                     </div>
                     <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Weryfikacja Końcowa</h3>
                     <p className="text-slate-500 mt-1 font-medium">Sprawdź parametry frachtu przed wysłaniem do systemu portowego.</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl border border-slate-100 p-8 space-y-8 shadow-inner">
                     <div className="grid grid-cols-2 gap-y-8">
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Trasa i Termin</p>
                           <p className="font-black text-slate-800 text-lg uppercase">{newBooking.routeId} • {newBooking.bookingDate}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Specyfikacja (m/t)</p>
                           <p className="font-black text-slate-800 text-lg">{newBooking.cargoDetails?.length} m / {newBooking.cargoDetails?.weight} t</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pojazd (Nr Rej)</p>
                           <p className="font-mono font-black text-amber-600 text-xl tracking-widest bg-white inline-block px-4 py-1 rounded border border-slate-200 shadow-sm">{newBooking.vehicleReg}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Obsada Kierowców</p>
                           <p className="font-black text-slate-800 text-lg uppercase">{newBooking.passengers?.[0]?.lastName} {newBooking.passengers?.[0]?.firstName}</p>
                        </div>
                     </div>
                     <div className="border-t border-slate-200 pt-6 mt-6 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Szacowany koszt frachtu (netto)</p>
                           <p className="text-4xl font-black text-slate-900 tracking-tighter">{( (newBooking.cargoDetails?.length || 0) * 105).toFixed(2)} <span className="text-base font-bold text-slate-400">PLN</span></p>
                        </div>
                        <div className="bg-emerald-50 text-emerald-700 px-6 py-3 rounded-lg text-xs font-black uppercase border border-emerald-100 shadow-sm flex items-center gap-2">
                           <ShieldCheck size={18}/> Dostępność Allotmentu: OK
                        </div>
                     </div>
                  </div>

                  <div className="mt-12 flex gap-4">
                    <button onClick={() => setBookingStep(2)} className="flex-1 py-5 border border-slate-200 rounded-lg font-black uppercase text-xs text-slate-400 hover:bg-slate-50 transition-all shadow-sm">Popraw dane</button>
                    <button 
                       onClick={() => {
                          alert("Rezerwacja Cargo została wysłana do systemu FerrOS. Status: POTWIERDZONA (EDI-ACK).");
                          setActiveTab('HISTORY');
                          setBookingStep(1);
                       }} 
                       className="flex-[2] py-5 bg-emerald-600 text-white rounded-lg font-black uppercase text-sm tracking-widest shadow-xl hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                       <Save size={20}/> Zapisz w Systemie Portowym
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* === CALENDAR TAB === */}
          {activeTab === 'CALENDAR' && (
            <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
              <div className="flex flex-col md:flex-row justify-between items-end gap-4 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                 <div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3 uppercase">
                       <CalendarDays className="text-amber-500"/> Harmonogram Transportów
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">Monitoring obłożenia Twojego allotmentu w Maju 2025.</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-inner">
                        <button 
                            onClick={() => setCalendarViewMode('MONTH')}
                            className={`px-4 py-2 rounded text-xs font-black uppercase transition flex items-center gap-2 ${calendarViewMode === 'MONTH' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'}`}
                        >
                            <CalendarIcon size={14}/> Miesiąc
                        </button>
                        <button 
                            onClick={() => setCalendarViewMode('LIST')}
                            className={`px-4 py-2 rounded text-xs font-black uppercase transition flex items-center gap-2 ${calendarViewMode === 'LIST' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'}`}
                        >
                            <ListIcon size={14}/> Lista Dnia
                        </button>
                    </div>
                 </div>
              </div>

              {calendarViewMode === 'MONTH' ? (
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
                    <div className="bg-slate-900 p-5 text-white flex flex-col md:flex-row justify-between items-center gap-4">
                        <h4 className="font-black uppercase text-base tracking-widest flex items-center gap-3">
                           <ChevronLeft size={20} className="text-slate-500 cursor-pointer hover:text-white"/>
                           Maj 2025
                           <ChevronRight size={20} className="text-slate-500 cursor-pointer hover:text-white"/>
                        </h4>
                        <div className="flex flex-wrap justify-center gap-4 text-[9px] font-black uppercase tracking-widest">
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-sm bg-emerald-500"></div> Wolne</span>
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-sm bg-amber-500"></div> 70%+</span>
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-sm bg-red-500"></div> Allotment Full</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">
                        {['Pon', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'].map(d => (
                            <div key={d} className="p-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100 last:border-r-0">{d}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={`empty-${i}`} className="h-36 border-b border-r border-slate-100 bg-slate-50/40"></div>
                        ))}
                        {monthDays.map(day => (
                            <div 
                                key={day.day} 
                                onClick={() => { setSelectedDate(day.dateStr); setCalendarViewMode('LIST'); }}
                                className={`h-36 border-b border-r border-slate-100 p-2.5 flex flex-col justify-between hover:bg-amber-50/50 transition-all cursor-pointer relative group ${selectedDate === day.dateStr ? 'bg-amber-50/20' : ''}`}
                            >
                                <div className="flex justify-between items-start">
                                    <span className={`text-xs font-black font-mono leading-none ${day.day === 22 ? 'text-amber-600' : 'text-slate-400'}`}>{day.day}</span>
                                    {day.sailingsCount > 0 && (
                                       <div className="flex gap-0.5">
                                          {Array.from({length: day.sailingsCount}).map((_, i) => (
                                             <div key={i} className={`w-1 h-1 rounded-full ${day.occupancy > 90 ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                          ))}
                                       </div>
                                    )}
                                </div>

                                <div className="flex-1 mt-2 overflow-hidden space-y-1">
                                   {day.bookings.slice(0, 2).map(b => (
                                      <button 
                                        key={b.id} 
                                        onClick={(e) => { e.stopPropagation(); setSelectedBookingForPreview(b); }}
                                        className="w-full bg-slate-900 text-white text-[8px] font-mono px-1 py-1 rounded flex items-center justify-between tracking-tighter opacity-80 hover:opacity-100 hover:bg-amber-600 transition-all border border-slate-800"
                                      >
                                         <span className="truncate">{b.vehicleReg}</span>
                                         <span>{b.cargoDetails?.length}m</span>
                                      </button>
                                   ))}
                                   {day.bookings.length > 2 && (
                                      <div className="text-[7px] font-black text-slate-400 uppercase text-center">+ {day.bookings.length - 2} WIĘCEJ</div>
                                   )}
                                </div>

                                <div className="mt-2">
                                   <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden shadow-inner">
                                       <div 
                                           className={`h-full transition-all duration-1000 ${day.occupancy > 90 ? 'bg-red-500' : day.occupancy > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                                           style={{ width: `${Math.min(100, day.occupancy)}%` }}
                                       ></div>
                                   </div>
                                </div>
                                <div className="absolute inset-0 border border-transparent group-hover:border-amber-400/20 pointer-events-none transition-colors"></div>
                            </div>
                        ))}
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={`empty-end-${i}`} className="h-36 border-b border-r border-slate-100 bg-slate-50/40"></div>
                        ))}
                    </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center justify-between">
                        <button onClick={() => setCalendarViewMode('MONTH')} className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-blue-600 text-[10px] font-black uppercase flex items-center gap-2 hover:bg-slate-50 shadow-sm transition">
                            <ChevronLeft size={16}/> Powrót do miesiąca
                        </button>
                        <h4 className="font-black text-slate-800 text-lg uppercase tracking-widest font-mono">{selectedDate}</h4>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {dailySailings.length > 0 ? dailySailings.map((sailing, idx) => {
                            const route = MOCK_ROUTES.find(r => r.id === sailing.routeId);
                            const bookingsOnThisSailing = myBookings.filter(b => b.routeId === sailing.routeId && b.bookingDate === selectedDate);
                            const usedInAllotment = bookingsOnThisSailing.reduce((acc, b) => acc + (b.cargoDetails?.length || 0), 0);
                            const allotmentTotal = MOCK_ALLOTMENTS.find(a => a.forwarderId === client.id)?.totalSpace || 100;
                            const allotmentPercent = Math.min(100, (usedInAllotment / allotmentTotal) * 100);

                            return (
                                <div key={idx} className="bg-white rounded-lg border border-slate-200 shadow-sm hover:border-amber-400 transition-all overflow-hidden flex flex-col group">
                                    <div className="flex flex-col md:flex-row">
                                       <div className="w-full md:w-48 bg-slate-900 p-6 flex flex-col justify-center items-center text-center border-r border-slate-800 shrink-0">
                                          <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Odejście</div>
                                          <div className="text-3xl font-black text-white tracking-tighter font-mono">
                                                {new Date(sailing.originalDeparture).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                          </div>
                                          <div className={`text-[9px] font-black uppercase mt-3 px-2 py-0.5 rounded border ${sailing.status === SailingStatus.SCHEDULED ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                                {sailing.status}
                                          </div>
                                       </div>
                                       
                                       <div className="flex-1 p-6 flex flex-col md:flex-row justify-between items-center gap-8">
                                          <div className="flex-1">
                                                <div className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-3 mb-2">
                                                   {route?.origin || 'Port A'} <ArrowRight size={16} className="text-slate-300"/> {route?.destination || 'Port B'}
                                                </div>
                                                <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                   <span className="flex items-center gap-1.5"><Ship size={14} className="text-blue-500"/> {sailing.shipName}</span>
                                                   <span className="text-slate-200">|</span>
                                                   <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400"/> Rejs: 7.5h</span>
                                                </div>
                                          </div>

                                          <div className="w-full md:w-72 bg-slate-50 p-4 rounded-lg border border-slate-100 shadow-inner">
                                                <div className="flex justify-between items-end mb-2">
                                                   <div>
                                                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Twój Allotment</p>
                                                      <p className={`text-sm font-black ${allotmentPercent > 90 ? 'text-red-600' : 'text-slate-800'}`}>
                                                            {usedInAllotment.toFixed(1)}m <span className="text-slate-400">/ {allotmentTotal}m</span>
                                                      </p>
                                                   </div>
                                                   <span className={`text-[10px] font-black ${allotmentPercent > 90 ? 'text-red-600' : 'text-blue-600'}`}>{allotmentPercent.toFixed(0)}%</span>
                                                </div>
                                                <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                                                   <div className={`h-full transition-all duration-1000 ${allotmentPercent > 85 ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${allotmentPercent}%` }}></div>
                                                </div>
                                          </div>

                                          <button onClick={() => { setActiveTab('BOOK'); }} className="bg-slate-900 text-white px-6 py-3 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-amber-600 transition-all flex items-center gap-2 shadow-sm active:scale-95">
                                                <Plus size={16}/> Rezerwuj
                                          </button>
                                       </div>
                                    </div>

                                    {/* LISTA TWOICH REZERWACJI NA TEN REJS */}
                                    <div className="bg-slate-50/50 p-6 border-t border-slate-100">
                                       <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                          <LayoutList size={14}/> Twoje Rezerwacje na ten rejs ({bookingsOnThisSailing.length})
                                       </h5>
                                       {bookingsOnThisSailing.length > 0 ? (
                                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                             {bookingsOnThisSailing.map(booking => (
                                                <div key={booking.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:border-amber-400 transition-colors">
                                                   <div className="flex justify-between items-start mb-3">
                                                      <div className="bg-slate-900 text-white px-3 py-1.5 rounded font-mono font-black text-xs tracking-widest">
                                                         {booking.vehicleReg}
                                                      </div>
                                                      <div className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${getStatusColor(booking.status)}`}>
                                                         {booking.status}
                                                      </div>
                                                   </div>
                                                   <div className="space-y-1 mb-4">
                                                      <div className="flex justify-between text-[10px]">
                                                         <span className="text-slate-400 font-bold uppercase">Ref:</span>
                                                         <span className="font-black text-slate-700">{booking.cargoDetails?.forwarderRef || '-'}</span>
                                                      </div>
                                                      <div className="flex justify-between text-[10px]">
                                                         <span className="text-slate-400 font-bold uppercase">Wymiary:</span>
                                                         <span className="font-black text-slate-700">{booking.cargoDetails?.length}m / {booking.cargoDetails?.weight}t</span>
                                                      </div>
                                                   </div>
                                                   <div className="flex gap-2 border-t border-slate-50 pt-3">
                                                      <button 
                                                        onClick={() => setSelectedBookingForPreview(booking)}
                                                        className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 rounded text-[9px] font-black text-slate-600 uppercase transition"
                                                      >Szczegóły</button>
                                                      <button className="p-1.5 text-slate-400 hover:text-blue-600 transition"><Download size={14}/></button>
                                                   </div>
                                                </div>
                                             ))}
                                          </div>
                                       ) : (
                                          <div className="py-4 text-center text-[11px] text-slate-400 italic">Brak aktywnych rezerwacji spedytora na to odejście statku.</div>
                                       )}
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="bg-white p-20 rounded-lg border-2 border-dashed border-slate-200 text-center text-slate-400">
                                <Ship size={48} className="mx-auto mb-4 opacity-20"/>
                                <p className="font-bold text-sm uppercase tracking-widest">Brak rejsów w wybranym dniu</p>
                            </div>
                        )}
                    </div>
                </div>
              )}
            </div>
          )}

          {/* === LISTA REZERWACJI (HISTORY) === */}
          {activeTab === 'HISTORY' && (
            <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
               <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                     <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                        <input 
                           type="text" 
                           placeholder="Szukaj po NR REJ, ID lub Twoim Ref..." 
                           className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-lg outline-none focus:border-amber-500 focus:bg-white transition-all font-bold text-sm"
                           value={historySearch}
                           onChange={e => setHistorySearch(e.target.value)}
                        />
                     </div>
                     <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase text-slate-600 hover:bg-slate-100 transition flex items-center gap-2">
                           <Filter size={14}/> Filtry
                        </button>
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase text-slate-600 hover:bg-slate-100 transition flex items-center gap-2">
                           <Download size={14}/> CSV
                        </button>
                     </div>
                  </div>

                  <div className="overflow-x-auto">
                     <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                           <tr>
                              <th className="p-5">ID Zlecenia / Ref</th>
                              <th className="p-5">Data / Trasa</th>
                              <th className="p-5">Pojazd</th>
                              <th className="p-5 text-right">Specyfikacja</th>
                              <th className="p-5 text-center">Status</th>
                              <th className="p-5 text-right">Fracht</th>
                              <th className="p-5 text-right">Akcje</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[13px]">
                           {filteredHistory.map(res => (
                              <tr key={res.id} className="hover:bg-slate-50 transition-colors group">
                                 <td className="p-5">
                                    <div className="font-mono font-black text-slate-800 group-hover:text-amber-600 transition-colors">{res.id}</div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{res.cargoDetails?.forwarderRef || '-'}</div>
                                 </td>
                                 <td className="p-5">
                                    <div className="font-bold text-slate-700">{res.bookingDate}</div>
                                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{res.routeId}</div>
                                 </td>
                                 <td className="p-5">
                                    <div className="bg-slate-900 px-3 py-1 rounded text-white font-mono font-bold text-xs inline-block tracking-[0.1em] shadow-sm">
                                       {res.vehicleReg}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{res.vehicleType}</div>
                                 </td>
                                 <td className="p-5 text-right font-black text-slate-700">
                                    {res.cargoDetails?.length} m • {res.cargoDetails?.weight} t
                                    <div className="text-[9px] font-bold text-slate-400 uppercase">{res.cargoDetails?.loadType}</div>
                                 </td>
                                 <td className="p-5 text-center">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-2 ${getStatusColor(res.status)}`}>
                                       {res.status}
                                    </span>
                                 </td>
                                 <td className="p-5 text-right font-black text-slate-800">
                                    {res.totalPrice.toLocaleString()} <span className="text-[10px] text-slate-400 font-bold">PLN</span>
                                 </td>
                                 <td className="p-5 text-right">
                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                       <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Pobierz PDF">
                                          <Download size={16}/>
                                       </button>
                                       {res.status !== BookingStatus.CHECKED_IN && (
                                          <button className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition" title="Edytuj">
                                             <Edit size={16}/>
                                          </button>
                                       )}
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
          )}

          {/* === VEHICLES TAB (FLOTA) === */}
          {activeTab === 'VEHICLES' && (
            <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                  <div className="flex-1 w-full md:max-w-md relative">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                     <input 
                        type="text" 
                        placeholder="Szukaj po nr rejestracyjnym..." 
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-lg outline-none focus:border-amber-500 focus:bg-white transition-all font-bold text-slate-700"
                     />
                  </div>
                  <button className="w-full md:w-auto px-6 py-3 bg-slate-900 text-white rounded-lg font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-amber-600 transition-all shadow-lg active:scale-95">
                    <Plus size={18}/> Dodaj Pojazd
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {myVehicles.map(v => (
                    <div key={v.id} className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all group overflow-hidden flex flex-col">
                       <div className="p-6 flex-1">
                          <div className="flex justify-between items-start mb-6">
                             <div className="flex flex-col gap-1">
                                <div className="bg-slate-900 px-4 py-2 rounded border-2 border-slate-800 shadow-inner group-hover:border-amber-500 transition-colors">
                                   <p className="font-mono text-xl font-black text-white tracking-[0.2em]">{v.registrationNumber}</p>
                                </div>
                                {v.name && <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{v.name}</p>}
                             </div>
                             <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${v.type === VehicleType.TRUCK ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                                {v.type === VehicleType.TRUCK ? 'LORRY' : 'TRAILER'}
                             </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-3">
                                <Ruler size={18} className="text-slate-400"/>
                                <div>
                                   <p className="text-[9px] font-black text-slate-400 uppercase">Długość</p>
                                   <p className="text-lg font-black text-slate-800">{v.length}m</p>
                                </div>
                             </div>
                             <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-3">
                                <Weight size={18} className="text-slate-400"/>
                                <div>
                                   <p className="text-[9px] font-black text-slate-400 uppercase">Waga max</p>
                                   <p className="text-lg font-black text-slate-800">{v.weight}t</p>
                                </div>
                             </div>
                          </div>
                       </div>
                       <div className="bg-slate-50 p-3 border-t border-slate-100 flex gap-2">
                          <button className="flex-1 py-2 bg-white border border-slate-200 rounded text-[10px] font-black uppercase text-slate-600 hover:bg-amber-50 transition-all">Edytuj</button>
                          <button className="flex-1 py-2 bg-white border border-slate-200 rounded text-[10px] font-black uppercase text-red-400 hover:bg-red-50 transition-all">Usuń</button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* === DRIVERS TAB (KIEROWCY) === */}
          {activeTab === 'DRIVERS' && (
             <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                  <div className="flex-1 w-full md:max-w-md relative">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                     <input 
                        type="text" 
                        placeholder="Szukaj po nazwisku..." 
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-lg outline-none focus:border-amber-500 transition-all font-bold text-slate-700"
                     />
                  </div>
                  <button className="w-full md:w-auto px-6 py-3 bg-slate-900 text-white rounded-lg font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-amber-600 transition-all shadow-lg active:scale-95">
                    <Plus size={18}/> Dodaj Kierowcę
                  </button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {myDrivers.map(d => (
                    <div key={d.id} className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 hover:shadow-xl hover:border-amber-400 transition-all group flex flex-col items-center text-center">
                       <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 mb-4 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors shadow-inner font-black text-2xl uppercase">
                          {d.firstName[0]}{d.lastName[0]}
                       </div>
                       <h3 className="font-black text-lg text-slate-800 leading-tight">{d.lastName} {d.firstName}</h3>
                       <div className="mt-6 w-full space-y-2">
                          <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                             <IdCard size={16} className="text-slate-400"/>
                             <span className="text-[11px] font-mono font-bold text-slate-700 uppercase tracking-tighter">{d.documentNumber}</span>
                          </div>
                          <a href={`tel:${d.phoneNumber}`} className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100 hover:bg-blue-50 transition-colors group/phone">
                             <Smartphone size={16} className="text-slate-400 group-hover/phone:text-blue-500"/>
                             <span className="text-[11px] font-bold text-slate-700">{d.phoneNumber}</span>
                          </a>
                       </div>
                       <div className="mt-4 pt-4 border-t border-slate-100 w-full flex justify-center gap-4">
                          <button className="text-[10px] font-black text-slate-400 uppercase hover:text-amber-600 transition-colors">Edytuj</button>
                          <button className="text-[10px] font-black text-slate-400 uppercase hover:text-red-500 transition-colors">Usuń</button>
                       </div>
                    </div>
                  ))}
               </div>
             </div>
          )}

          {/* === FINANCE TAB (ROZLICZENIA) === */}
          {activeTab === 'FINANCE' && (
             <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                   <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm p-8">
                      <div className="flex justify-between items-center mb-8">
                         <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                            <Wallet className="text-blue-500"/> Status Salda
                         </h3>
                         <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 uppercase tracking-widest">Płatność: 14 dni</span>
                      </div>
                      <div className="space-y-6">
                         <div>
                            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                               <span>Wykorzystanie Limitu</span>
                               <span className="text-slate-800 font-black">{ (client.currentBalance / client.creditLimit * 100).toFixed(0) }%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                               <div className="bg-amber-500 h-full transition-all duration-1000" style={{ width: `${(client.currentBalance / client.creditLimit * 100)}%` }}></div>
                            </div>
                            <div className="flex justify-between text-xs mt-3 font-bold">
                               <div className="text-slate-500">Saldo: <span className="text-slate-800 font-black">{client.currentBalance.toLocaleString()} PLN</span></div>
                               <div className="text-slate-500">Limit: <span className="text-slate-400 font-black">{client.creditLimit.toLocaleString()} PLN</span></div>
                            </div>
                         </div>

                         <div className="bg-slate-50 rounded-lg p-5 border border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className="bg-blue-100 p-3 rounded-lg text-blue-600 shadow-sm"><Percent size={20}/></div>
                               <div>
                                  <p className="text-xs font-black text-slate-700 uppercase tracking-tighter leading-none">Stawka Kontraktowa</p>
                                  <p className="text-[10px] text-slate-400 mt-1">Podstawa: 105.00 PLN / mb</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-sm font-black text-blue-600 tracking-tighter">-8% RABATU STAŁEGO</p>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="bg-slate-900 rounded-lg shadow-xl p-8 text-white relative overflow-hidden flex flex-col justify-between group">
                      <BarChart3 className="absolute -right-8 -bottom-8 text-white/5 w-56 h-56 group-hover:scale-110 transition-transform duration-700"/>
                      <div className="relative z-10">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">Faktury do zapłaty</p>
                        <h3 className="text-5xl font-black text-amber-500 tracking-tighter leading-none">
                           {MOCK_CARGO_INVOICES.filter(i => i.forwarderId === client.id && i.status === 'ISSUED').reduce((acc, i) => acc + i.totalAmount, 0).toLocaleString()} 
                        </h3>
                        <p className="text-lg font-bold text-slate-400 mt-2">PLN BRUTTO</p>
                      </div>
                      <button className="relative z-10 w-full py-4 bg-white text-slate-900 rounded-lg font-black uppercase text-xs tracking-widest hover:bg-amber-50 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 mt-8">
                         Pobierz Wyciąg <Download size={16}/>
                      </button>
                   </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                   <div className="p-6 border-b border-slate-100 font-black text-slate-800 uppercase text-[11px] tracking-[0.2em] flex items-center justify-between bg-slate-50/50">
                      Historia Dokumentów Finansowych
                      <button className="text-blue-600 hover:underline">Eksport XML</button>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                         <thead className="bg-white text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                            <tr>
                               <th className="p-5">Numer Faktury</th>
                               <th className="p-5">Okres Rozliczeniowy</th>
                               <th className="p-5">Termin</th>
                               <th className="p-5 text-right">Kwota Brutto</th>
                               <th className="p-5 text-center">Status</th>
                               <th className="p-5 text-right">Pliki</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100 text-[13px]">
                            {MOCK_CARGO_INVOICES.filter(i => i.forwarderId === client.id).map(inv => (
                               <tr key={inv.id} className="hover:bg-slate-50 transition-colors group">
                                  <td className="p-5 font-mono font-black text-slate-700">{inv.id}</td>
                                  <td className="p-5 text-slate-500 font-medium">{inv.periodStart} — {inv.periodEnd}</td>
                                  <td className="p-5 font-bold text-slate-700">{inv.dueDate}</td>
                                  <td className="p-5 text-right font-black text-slate-900">{inv.totalAmount.toLocaleString()} {inv.currency}</td>
                                  <td className="p-5 text-center">
                                     <span className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest border-2 ${
                                        inv.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                        inv.status === 'OVERDUE' ? 'bg-red-50 text-red-700 border-red-100 animate-pulse' :
                                        'bg-blue-50 text-blue-700 border-blue-100'
                                     }`}>
                                        {inv.status}
                                     </span>
                                  </td>
                                  <td className="p-5 text-right">
                                     <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded transition shadow-sm border border-transparent hover:border-slate-200" title="PDF">
                                        <FileText size={16}/>
                                     </button>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>
             </div>
          )}
          
        </div>
      </main>

      {/* === MODAL: PODGLĄD REZERWACJI (DETALE Z KALENDARZA) === */}
      {selectedBookingForPreview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col">
              <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                 <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter">Szczegóły Frachtu</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">ID Systemowe: {selectedBookingForPreview.id}</p>
                 </div>
                 <button 
                   onClick={() => setSelectedBookingForPreview(null)}
                   className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                 >
                    <X size={24}/>
                 </button>
              </div>

              <div className="p-8 bg-slate-50 flex-1 overflow-y-auto space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Operacyjny</p>
                       <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border-2 ${getStatusColor(selectedBookingForPreview.status)}`}>
                          {selectedBookingForPreview.status}
                       </span>
                       <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-600">
                          <CheckCircle size={14} className="text-emerald-500"/> EDI-ACK (Potwierdzone)
                       </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-right">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Koszt Frachtu</p>
                       <p className="text-2xl font-black text-slate-800">{selectedBookingForPreview.totalPrice.toLocaleString()} <span className="text-xs">PLN</span></p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">VAT 23%: {(selectedBookingForPreview.totalPrice * 0.23).toFixed(2)} PLN</p>
                    </div>
                 </div>

                 <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
                    <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">Specyfikacja Transportu</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Nr Rejestracyjny</p>
                          <p className="font-mono font-black text-xl text-slate-800 tracking-widest bg-slate-100 px-2 py-1 rounded inline-block">
                             {selectedBookingForPreview.vehicleReg}
                          </p>
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Typ Jednostki</p>
                          <p className="font-bold text-slate-700 uppercase">{selectedBookingForPreview.vehicleType}</p>
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Długość / Waga</p>
                          <p className="font-bold text-slate-700">{selectedBookingForPreview.cargoDetails?.length}m / {selectedBookingForPreview.cargoDetails?.weight}t</p>
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Kierowca</p>
                          <p className="font-bold text-slate-700 uppercase">
                             {selectedBookingForPreview.passengers?.[0]?.lastName} {selectedBookingForPreview.passengers?.[0]?.firstName || '-'}
                          </p>
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Twoja Referencja</p>
                          <p className="font-bold text-blue-600 font-mono">{selectedBookingForPreview.cargoDetails?.forwarderRef || '-'}</p>
                       </div>
                    </div>
                 </div>

                 <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center gap-4">
                    <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm"><Ship size={20}/></div>
                    <div>
                       <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest">Zaplanowany Rejs</p>
                       <p className="font-bold text-slate-700">{selectedBookingForPreview.routeId} • {selectedBookingForPreview.bookingDate}</p>
                    </div>
                 </div>
              </div>

              <div className="p-6 bg-white border-t border-slate-100 flex gap-3">
                 <button 
                   onClick={() => setSelectedBookingForPreview(null)}
                   className="px-6 py-3 border border-slate-200 rounded-lg font-black uppercase text-[10px] tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
                 >
                    Zamknij
                 </button>
                 <button className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2">
                    <Download size={16}/> Pobierz PDF
                 </button>
                 <button 
                   onClick={() => { setActiveTab('BOOK'); setSelectedBookingForPreview(null); }}
                   className="flex-1 bg-slate-900 text-white py-3 rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-amber-600 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                 >
                    <Edit size={16}/> Edytuj Fracht
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CargoClientPortal;
