import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Ship, Calendar, User, Truck, CheckCircle, 
  ArrowRight, Printer, ArrowLeftRight, ArrowRight as ArrowRightIcon, 
  Car, Bike, Check, Weight, Navigation, MapPin, Clock, 
  Users, ChevronRight, Info, CreditCard, Ticket, UserPlus, Baby, CalendarDays, ChevronLeft, X, QrCode
} from 'lucide-react';
import { MOCK_CALENDAR_PRICES, logAnalyticsEvent } from '../services/mockData';
import { Route, VehicleType, CabinType, CargoLoadType } from '../types';
import { useTranslation } from '../i18n';
import { calculateDynamicPrice } from '../services/pricingService';

interface BookingState {
  type: 'PAX' | 'CARGO';
  isRoundTrip: boolean;
  origin: string;
  destination: string;
  date: string;
  returnDate: string;
  paxCount: number;
  childCount: number;
  petCount: number;
  vehicle: VehicleType;
  cargoLength: number;
  cargoWeight: number;
  cargoDrivers: number;
  cargoLoadType: CargoLoadType;
  selectedRoute: Route | null;
  selectedReturnRoute: Route | null;
  passengerName: string;
  passengerDoc: string;
  cabin: CabinType;
}

const ALLOWED_CONNECTIONS: Record<string, string[]> = {
  'Świnoujście (PL)': ['Ystad (SE)', 'Trelleborg (SE)'],
  'Ystad (SE)': ['Świnoujście (PL)'],
  'Trelleborg (SE)': ['Świnoujście (PL)']
};

const INITIAL_STATE: BookingState = {
  type: 'PAX',
  isRoundTrip: false,
  origin: 'Świnoujście (PL)',
  destination: 'Ystad (SE)',
  date: new Date().toISOString().split('T')[0],
  returnDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
  paxCount: 1,
  childCount: 0,
  petCount: 0,
  vehicle: VehicleType.NONE,
  cargoLength: 16.5,
  cargoWeight: 24,
  cargoDrivers: 1,
  cargoLoadType: CargoLoadType.STANDARD,
  selectedRoute: null,
  selectedReturnRoute: null,
  passengerName: '',
  passengerDoc: '',
  cabin: CabinType.NONE
};

const BookingWizard: React.FC = () => {
  const { t, language } = useTranslation();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<BookingState>(INITIAL_STATE);
  const [apiRoutes, setApiRoutes] = useState<Route[]>([]);
  
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [generatedBookingId, setGeneratedBookingId] = useState(`RES-${Math.floor(100000 + Math.random() * 900000)}`);

  useEffect(() => {
    fetch('/api/routes')
      .then(res => res.json())
      .then(data => setApiRoutes(data))
      .catch(err => console.error("Failed to fetch routes", err));
  }, []);

  const updateData = (updates: Partial<BookingState>) => {
    setData(prev => {
      const newState = { ...prev, ...updates };
      if (updates.origin && !ALLOWED_CONNECTIONS[updates.origin].includes(newState.destination)) {
        newState.destination = ALLOWED_CONNECTIONS[updates.origin][0];
      }
      return newState;
    });
  };

  const filteredRoutes = apiRoutes.filter(route => 
     data.origin.includes(route.origin.split(' ')[0]) && data.destination.includes(route.destination.split(' ')[0])
  );

  // --- Dynamic Pricing Logic ---

  const calculateTotalPrice = (route: Route, dateStr?: string) => {
    const date = new Date(dateStr || data.date);
    const breakdown = calculateDynamicPrice(route, date, {
      paxAdults: data.paxCount,
      paxChildren: data.childCount,
      petCount: data.petCount,
      vehicleType: data.vehicle,
      cabinType: data.cabin,
      isRoundTrip: data.isRoundTrip,
      isCargo: data.type === 'CARGO',
      cargoLength: data.cargoLength,
      cargoDrivers: data.cargoDrivers,
      cargoLoadType: data.cargoLoadType
    });
    return breakdown.grossTotal;
  };

  const getPriceForDate = (dateStr: string) => {
    // Find a route to use for preview pricing
    const route = filteredRoutes[0] || apiRoutes[0];
    if (!route) return 0;
    return calculateTotalPrice(route, dateStr);
  };

  const next14DepartureDays = useMemo(() => {
    const days = [];
    const start = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      days.push({
        date: iso,
        label: d.toLocaleDateString(language === 'PL' ? 'pl-PL' : 'en-US', { day: 'numeric', month: 'short' }),
        dayName: d.toLocaleDateString(language === 'PL' ? 'pl-PL' : 'en-US', { weekday: 'short' }),
        price: getPriceForDate(iso)
      });
    }
    return days;
  }, [language, data.type, data.vehicle, data.cabin, data.petCount, data.cargoLength, data.cargoDrivers, data.paxCount, data.childCount, data.isRoundTrip]);

  const handleConfirmBooking = async () => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      setGeneratedBookingId(result.id);
      setStep(4);
    } catch (error) {
      console.error("Booking failed", error);
      setStep(4); // Fallback to show UI anyway
    }
  };

  const handleSearch = () => {
    logAnalyticsEvent('search_routes', { ...data });
    setStep(2);
  };

  const steps = [
    { num: 1, label: t('book.search'), description: t('book.step1_desc'), icon: <Search size={10} /> },
    { num: 2, label: t('book.select'), description: t('book.step2_desc'), icon: <Ship size={10} /> },
    { num: 3, label: t('book.details'), description: t('book.step3_desc'), icon: <User size={10} /> },
    { num: 4, label: t('book.final'), description: t('book.step4_desc'), icon: <CheckCircle size={10} /> }
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto font-sans min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Steps Wrapper */}
        <div className="lg:col-span-3">
          <div className="sticky top-8 space-y-6">
            {/* Przebieg Rezerwacji */}
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 px-4 py-8 overflow-hidden">
              <div className="mb-8 pl-1">
                <h3 className="font-black text-slate-400 text-[8px] uppercase tracking-[0.35em] flex items-center gap-2">
                  Status Rezerwacji
                </h3>
              </div>
              <div className="flex flex-col relative">
                  <div className="absolute left-[11px] top-6 bottom-6 w-px bg-slate-100 z-0"></div>

                  {steps.map((s) => {
                    const isCurrent = step === s.num;
                    const isCompleted = step > s.num;
                    return (
                      <button
                        key={s.num}
                        onClick={() => s.num < step && setStep(s.num)}
                        className={`group flex items-start gap-4 py-4 pl-0 pr-1 rounded-xl transition-all text-left relative z-10 ${isCurrent ? 'translate-x-0.5' : 'text-slate-500 hover:bg-slate-50'}`}
                      >
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border transition-all duration-500 ${
                          isCurrent 
                            ? 'bg-blue-950 text-white border-blue-950 scale-110 shadow-lg shadow-blue-900/20' 
                            : isCompleted 
                              ? 'bg-emerald-50 text-emerald-500 border-emerald-100' 
                              : 'bg-white border-slate-100 text-slate-300'
                        }`}>
                          {isCompleted ? <Check size={12} strokeWidth={4} /> : s.icon}
                        </div>
                        <div className="flex flex-col pt-0.5">
                          <span className={`font-black text-[12px] block leading-none tracking-tight transition-colors ${isCurrent ? 'text-blue-950' : 'text-slate-700 group-hover:text-blue-900'}`}>{s.label}</span>
                          <span className={`text-[8.5px] block leading-tight mt-1.5 font-medium transition-colors ${isCurrent ? 'text-blue-600' : 'text-slate-400'}`}>{s.description}</span>
                        </div>
                        {isCurrent && (
                          <div className="ml-auto opacity-40 pr-1">
                            <ChevronRight size={12} className="text-blue-950" />
                          </div>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Twój Wybór - Sidebar Info */}
            {step > 1 && step < 4 && (
                <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-2xl shadow-slate-900/40 animate-in slide-in-from-left-4 duration-500 relative overflow-hidden">
                  <div className="absolute -right-8 -bottom-8 opacity-10">
                      <Ship size={100} />
                  </div>
                  <h4 className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-5 border-b border-white/10 pb-3">Twój Wybór</h4>
                  <div className="space-y-3 text-[12px]">
                      <div className="mb-3">
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Trasa</div>
                        <div className="font-black text-sm text-white uppercase tracking-tight">
                          {data.origin.split(' ')[0]} — {data.destination.split(' ')[0]}
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-slate-400">
                        <span className="font-bold flex items-center gap-2"><Calendar size={12}/> Data</span>
                        <span className="font-black text-white">{data.date}</span>
                      </div>
                      {data.selectedRoute && (
                        <div className="flex justify-between items-end pt-6 border-t border-white/10 mt-4">
                            <div>
                              <span className="text-blue-300 font-black uppercase text-[9px] block mb-0.5">Cena</span>
                              <span className="font-black text-xl text-white tracking-tighter">
                                {calculateTotalPrice(data.selectedRoute).toFixed(0)} <span className="text-xs font-bold text-blue-300">PLN</span>
                              </span>
                            </div>
                            <div className="bg-blue-900/30 p-2 rounded-lg">
                              <Ticket size={16} className="text-blue-300"/>
                            </div>
                        </div>
                      )}
                  </div>
                </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9">
          <div className="bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden flex flex-col min-h-[600px] transition-all duration-500">
            
            {step === 1 && (
              <div className="p-5 md:p-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6">
                  <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Zaplanuj Rejs</h1>
                    <p className="text-slate-500 font-medium">Wybierz parametry podróży, aby sprawdzić dostępność.</p>
                  </div>
                  <div className="bg-slate-100 p-1.5 rounded-xl flex border border-slate-200 shadow-inner">
                      <button 
                        onClick={() => updateData({ type: 'PAX' })} 
                        className={`flex items-center gap-3 px-6 py-2.5 rounded-xl font-black transition-all text-[12px] uppercase tracking-wider ${data.type === 'PAX' ? 'bg-white text-blue-950 shadow-xl border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <User size={16}/> Pasażer
                      </button>
                      <button 
                        onClick={() => updateData({ type: 'CARGO' })} 
                        className={`flex items-center gap-3 px-6 py-2.5 rounded-xl font-black transition-all text-[12px] uppercase tracking-wider ${data.type === 'CARGO' ? 'bg-white text-amber-600 shadow-xl border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <Truck size={16}/> Cargo
                      </button>
                  </div>
                </div>

                <div className="space-y-6">
                    {/* Ports Selection */}
                    <div className="bg-slate-50 p-6 md:p-6 rounded-xl border border-slate-200 space-y-6 relative">
                        <div className="grid grid-cols-1 md:grid-cols-11 gap-6 items-end relative z-10">
                            <div className="md:col-span-5 space-y-3">
                                <label className="text-[11px] font-black text-slate-400 uppercase ml-2 tracking-[0.15em]">Port Wyjściowy</label>
                                <div className="relative group">
                                  <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-950 transition-colors" size={20}/>
                                  <select 
                                    value={data.origin} 
                                    onChange={(e) => updateData({ origin: e.target.value })} 
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 bg-white font-bold text-lg outline-none focus:ring-4 focus:ring-blue-950/5 focus:border-blue-950 transition-all appearance-none cursor-pointer shadow-sm text-slate-800"
                                  >
                                      {Object.keys(ALLOWED_CONNECTIONS).map(port => <option key={port} value={port}>{port}</option>)}
                                  </select>
                                </div>
                            </div>
                            <div className="md:col-span-1 flex justify-center pb-2">
                                <button 
                                  onClick={() => {
                                      const oldOrigin = data.origin;
                                      const oldDest = data.destination;
                                      if (ALLOWED_CONNECTIONS[oldDest]?.includes(oldOrigin)) updateData({ origin: oldDest, destination: oldOrigin });
                                  }} 
                                  className="bg-white p-3.5 rounded-xl border-2 border-slate-200 text-slate-400 hover:text-blue-900 hover:border-blue-200 shadow-lg shadow-slate-200 transition-all hover:scale-110 active:scale-95"
                                >
                                    <ArrowLeftRight size={22} strokeWidth={2.5}/>
                                </button>
                            </div>
                            <div className="md:col-span-5 space-y-3">
                                <label className="text-[11px] font-black text-slate-400 uppercase ml-2 tracking-[0.15em]">Port Docelowy</label>
                                <div className="relative group">
                                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-950 transition-colors" size={20}/>
                                  <select 
                                    value={data.destination} 
                                    onChange={(e) => updateData({ destination: e.target.value })} 
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 bg-white font-bold text-lg outline-none focus:ring-4 focus:ring-blue-950/5 focus:border-blue-950 transition-all appearance-none cursor-pointer shadow-sm text-slate-800"
                                  >
                                      {ALLOWED_CONNECTIONS[data.origin].map(port => <option key={port} value={port}>{port}</option>)}
                                  </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-200/60">
                            <div className="flex justify-between items-end px-2">
                                <div>
                                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] block mb-1">Wybór Daty i Najniższe Ceny</label>
                                   <p className="text-slate-400 text-[10px] font-medium uppercase tracking-tight">Ceny dynamiczne zależne od dnia tygodnia</p>
                                </div>
                                <div className="flex items-center gap-3">
                                   <div className="bg-white p-1 rounded-xl border-2 border-slate-200 flex text-[10px] font-black uppercase shadow-inner">
                                     <button onClick={() => updateData({ isRoundTrip: false })} className={`px-4 py-1.5 rounded-lg transition-all ${!data.isRoundTrip ? 'bg-blue-950 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>
                                       {t('book.one_way')}
                                     </button>
                                     <button onClick={() => updateData({ isRoundTrip: true })} className={`px-4 py-1.5 rounded-lg transition-all ${data.isRoundTrip ? 'bg-blue-950 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>
                                       {t('book.return')}
                                     </button>
                                   </div>
                                </div>
                            </div>

                            {/* 14-Day Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                                {next14DepartureDays.map((day) => {
                                    const isSelected = data.date === day.date;
                                    return (
                                        <button 
                                            key={day.date}
                                            onClick={() => updateData({ date: day.date })}
                                            className={`group relative p-2 rounded-xl border-2 transition-all flex flex-col items-center justify-center min-h-[60px] ${isSelected ? 'bg-blue-950 border-blue-950 text-white shadow-lg scale-[1.02] z-10' : 'bg-white border-slate-100 text-slate-600 hover:border-blue-950/30 hover:bg-slate-50'}`}
                                        >
                                            <span className={`text-[8px] font-black uppercase mb-0.5 tracking-tighter ${isSelected ? 'text-blue-300' : 'text-slate-400 group-hover:text-blue-900'}`}>{day.dayName}</span>
                                            <span className="text-sm font-black tracking-tighter leading-none mb-1">{day.label.split(' ')[0]} {day.label.split(' ')[1]}</span>
                                            <div className={`mt-0.5 font-black text-[10px] py-0.5 px-1.5 rounded-xl transition-colors ${isSelected ? 'bg-white/10 text-white' : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100'}`}>
                                               {Math.round(day.price)} <span className="text-[8px] font-bold">zł</span>
                                            </div>
                                            {isSelected && (
                                               <div className="absolute -top-1 -right-1 bg-white text-blue-950 rounded-full shadow-md border border-blue-50 p-0.5">
                                                  <Check size={10} strokeWidth={4}/>
                                               </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* CONFIG PANEL */}
                    <div className="bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-sm">
                        {data.type === 'PAX' ? (
                          <div className="flex flex-col xl:flex-row items-center gap-8 justify-between">
                            {/* PAX counters */}
                            <div className="flex gap-8 xl:border-r border-slate-100 pb-0 xl:pr-8 shrink-0 w-full xl:w-auto justify-center">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><User size={12}/> Dorosły</span>
                                    <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 p-0.5 shadow-inner">
                                        <button onClick={() => updateData({ paxCount: Math.max(1, data.paxCount - 1) })} className="w-9 h-9 flex items-center justify-center hover:bg-white hover:shadow-lg rounded-xl text-lg font-bold text-slate-400 transition-all active:scale-90">-</button>
                                        <span className="w-10 text-center text-base font-black text-slate-800">{data.paxCount}</span>
                                        <button onClick={() => updateData({ paxCount: Math.min(9, data.paxCount + 1) })} className="w-9 h-9 flex items-center justify-center hover:bg-white hover:shadow-lg rounded-xl text-lg font-bold text-slate-400 transition-all active:scale-90">+</button>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Baby size={12}/> Dziecko</span>
                                    <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 p-0.5 shadow-inner">
                                        <button onClick={() => updateData({ childCount: Math.max(0, data.childCount - 1) })} className="w-9 h-9 flex items-center justify-center hover:bg-white hover:shadow-lg rounded-xl text-lg font-bold text-slate-400 transition-all active:scale-90">-</button>
                                        <span className="w-10 text-center text-base font-black text-slate-800">{data.childCount}</span>
                                        <button onClick={() => updateData({ childCount: Math.min(9, data.childCount + 1) })} className="w-9 h-9 flex items-center justify-center hover:bg-white hover:shadow-lg rounded-xl text-lg font-bold text-slate-400 transition-all active:scale-90">+</button>
                                    </div>
                                </div>
                            </div>

                            {/* Vehicle Selection */}
                            <div className="flex-1 w-full min-w-0">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Środek Transportu</span>
                                <div className="flex gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200 shadow-inner overflow-hidden">
                                    {[
                                        { type: VehicleType.NONE, icon: <User size={16} />, label: t('book.foot') },
                                        { type: VehicleType.CAR, icon: <Car size={18} />, label: t('book.car') },
                                        { type: VehicleType.MOTORCYCLE, icon: <Bike size={18} />, label: t('book.moto') }
                                    ].map(v => (
                                        <button 
                                          key={v.type} 
                                          onClick={() => updateData({ vehicle: v.type })} 
                                          className={`flex-1 min-w-0 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 border-2 ${data.vehicle === v.type ? 'bg-white text-blue-950 border-blue-950 shadow-lg font-black' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50 border-transparent'}`}
                                        >
                                            <div className="shrink-0">{v.icon}</div>
                                            <span className="text-[10px] md:text-[11px] uppercase tracking-tighter truncate">{v.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase block ml-1 tracking-widest">Długość Zestawu (m)</label>
                                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/10 focus-within:bg-white transition-all shadow-inner">
                                    <ArrowLeftRight size={18} className="text-slate-400 mr-3" />
                                    <input type="number" step="0.1" value={data.cargoLength} onChange={(e) => updateData({ cargoLength: parseFloat(e.target.value) })} className="bg-transparent font-black text-lg outline-none w-full text-slate-800"/>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase block ml-1 tracking-widest">Masa Całkowita (t)</label>
                                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/10 focus-within:bg-white transition-all shadow-inner">
                                    <Weight size={18} className="text-slate-400 mr-3" />
                                    <input type="number" step="0.5" value={data.cargoWeight} onChange={(e) => updateData({ cargoWeight: parseFloat(e.target.value) })} className="bg-transparent font-black text-lg outline-none w-full text-slate-800"/>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase block ml-1 tracking-widest">Liczba Kierowców</label>
                                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-0.5 h-[52px] shadow-inner">
                                    <button onClick={() => updateData({ cargoDrivers: Math.max(1, data.cargoDrivers - 1) })} className="w-10 h-10 flex items-center justify-center hover:bg-white hover:shadow-lg rounded-xl text-slate-400 font-bold transition-all">-</button>
                                    <span className="text-lg font-black text-slate-800">{data.cargoDrivers}</span>
                                    <button onClick={() => updateData({ cargoDrivers: Math.min(2, data.cargoDrivers + 1) })} className="w-10 h-10 flex items-center justify-center hover:bg-white hover:shadow-lg rounded-xl text-slate-400 font-bold transition-all">+</button>
                                </div>
                            </div>
                          </div>
                        )}
                    </div>

                    <div className="flex justify-center pt-2">
                        <button 
                          onClick={handleSearch} 
                          className={`px-10 py-3.5 rounded-xl font-black text-white shadow-2xl transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest hover:translate-y-[-2px] active:translate-y-1 ${data.type === 'CARGO' ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-200/50' : 'bg-blue-950 hover:bg-black shadow-blue-950/50'}`}
                        >
                            Sprawdź Dostępność <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
                 <div className="p-10 md:p-12 border-b border-slate-100 bg-white flex flex-col md:flex-row justify-between md:items-center gap-8 shadow-sm relative z-10">
                    <div>
                       <div className="flex items-center gap-5 text-slate-800 mb-1">
                          <h2 className="font-black text-3xl uppercase tracking-tighter">{data.origin.split(' ')[0]}</h2>
                          <ArrowRightIcon size={28} className="text-slate-300"/>
                          <h2 className="font-black text-3xl uppercase tracking-tighter">{data.destination.split(' ')[0]}</h2>
                       </div>
                       <p className="text-[13px] text-slate-400 font-black uppercase tracking-[0.2em]">{data.date}</p>
                    </div>
                    <button onClick={() => setStep(1)} className="px-10 py-3.5 border-2 border-slate-100 rounded-xl text-[11px] font-black text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all uppercase tracking-widest">Powrót do Wyszukiwarki</button>
                 </div>
                 
                 <div className="p-10 md:p-12 flex-1 overflow-y-auto space-y-8 bg-slate-50/50">
                    {filteredRoutes.map(route => {
                       const price = calculateTotalPrice(route);
                       return (
                          <div 
                             key={route.id} 
                             onClick={() => { updateData({ selectedRoute: route }); setStep(3); }} 
                             className="bg-white p-10 rounded-xl border border-slate-200 shadow-sm hover:border-blue-950 hover:shadow-2xl hover:shadow-blue-950/10 transition-all cursor-pointer flex flex-col md:flex-row justify-between items-center group relative overflow-hidden"
                          >
                             <div className="flex flex-col md:flex-row items-center gap-12 w-full md:w-auto">
                                <div className="text-center md:text-left min-w-[120px]">
                                  <div className="text-[11px] text-slate-400 font-black uppercase mb-1.5 tracking-widest flex items-center gap-1 justify-center md:justify-start">
                                    <Clock size={12}/> Odejście
                                  </div>
                                  <div className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{new Date(route.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                </div>
                                <div className="h-14 w-px bg-slate-100 hidden md:block"></div>
                                <div className="text-center md:text-left">
                                   <div className="font-black text-lg text-slate-800 mb-1">{route.shipName}</div>
                                   <div className="flex items-center gap-4 text-[11px] text-slate-400 uppercase font-black tracking-widest">
                                      <span className="flex items-center gap-1"><Clock size={14}/> Czas: 7h 30m</span>
                                   </div>
                                </div>
                             </div>
                             <div className="flex items-center gap-10 mt-8 md:mt-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-6 md:pt-0 border-slate-100">
                                <div className="text-right">
                                   <div className={`text-4xl font-black tracking-tighter ${data.type === 'CARGO' ? 'text-amber-600' : 'text-blue-950'}`}>
                                      {price.toFixed(0)} <span className="text-lg font-bold ml-1 opacity-70">PLN</span>
                                   </div>
                                   <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Cena dnia (zależna od terminu)</div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-full text-slate-300 group-hover:text-white group-hover:bg-blue-950 transition-all shadow-inner group-hover:shadow-blue-950/40">
                                   <ArrowRight size={28} className="group-hover:translate-x-1 transition-transform"/>
                                </div>
                             </div>
                          </div>
                       );
                    })}
                 </div>
              </div>
            )}

            {step === 3 && (
               <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="p-12 md:p-16 flex-1 overflow-y-auto space-y-12">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                           <label className="text-[11px] font-black text-slate-400 uppercase ml-2 tracking-widest">Imię i Nazwisko Pasażera</label>
                           <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20}/>
                              <input 
                                type="text" 
                                className="w-full pl-12 pr-6 py-5 border-2 border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-blue-950 focus:bg-white font-bold text-lg transition-all shadow-inner" 
                                value={data.passengerName} 
                                onChange={e => updateData({ passengerName: e.target.value })} 
                                placeholder="Jan Kowalski"
                              />
                           </div>
                        </div>
                        <div className="space-y-3">
                           <label className="text-[11px] font-black text-slate-400 uppercase ml-2 tracking-widest">Numer Dokumentu (Paszport/ID)</label>
                           <div className="relative">
                              <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20}/>
                              <input 
                                type="text" 
                                className="w-full pl-12 pr-6 py-5 border-2 border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-blue-950 focus:bg-white font-mono font-black text-lg transition-all shadow-inner uppercase" 
                                value={data.passengerDoc} 
                                onChange={e => updateData({ passengerDoc: e.target.value })} 
                                placeholder="ABC 123456"
                              />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-8 pt-6 border-t border-slate-100">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Wybór Zakwaterowania</h3>
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Opcjonalnie</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                           {[
                              { type: CabinType.NONE, label: 'Bez Kabiny', desc: 'Miejsce pokładowe w fotelu lotniczym', price: 0 },
                              { type: CabinType.INSIDE_2, label: 'Wew. 2-osobowa', desc: 'Bez okna, łazienka, klimatyzacja', price: 180 },
                              { type: CabinType.LUX, label: 'Apartament LUX', desc: 'Widok na morze, mini-bar, balkon', price: 550 }
                           ].map(opt => (
                              <button 
                                key={opt.type} 
                                onClick={() => updateData({ cabin: opt.type })} 
                                className={`p-8 rounded-xl border-2 text-left transition-all relative overflow-hidden group shadow-sm ${data.cabin === opt.type ? 'border-blue-950 bg-blue-50/50 shadow-2xl shadow-blue-950/10 scale-[1.02] z-10' : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50'}`}
                              >
                                 <div className="font-black text-slate-800 text-xl mb-1.5">{opt.label}</div>
                                 <div className="text-[12px] text-slate-400 leading-relaxed font-medium mb-6">{opt.desc}</div>
                                 <div className={`text-[13px] font-black mt-auto flex items-center justify-between transition-colors ${data.cabin === opt.type ? 'text-blue-950' : 'text-slate-500'}`}>
                                    <span>{opt.price === 0 ? 'W CENIE BILETU' : `+${opt.price} PLN`}</span>
                                    {data.cabin === opt.type ? <CheckCircle size={24} className="text-blue-950 animate-in zoom-in"/> : <ChevronRight size={20} className="text-slate-200 group-hover:text-slate-400"/>}
                                 </div>
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>
                  <div className="p-10 md:p-12 border-t border-slate-100 flex flex-col items-center gap-6 bg-slate-50/50">
                     <button 
                        onClick={handleConfirmBooking} 
                        className="px-12 py-4 bg-blue-950 text-white rounded-xl font-black text-base uppercase tracking-widest shadow-2xl shadow-blue-950/30 hover:bg-black hover:translate-y-[-2px] active:translate-y-1 transition-all flex items-center gap-4"
                     >
                        Sfinalizuj Rezerwację <ArrowRight size={20}/>
                     </button>
                     <button 
                        onClick={() => setStep(2)} 
                        className="text-[12px] font-black text-slate-400 uppercase hover:text-slate-800 transition-all tracking-widest active:scale-95"
                     >
                        Wróć do Wyboru Rejsu
                     </button>
                  </div>
               </div>
            )}

            {step === 4 && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 text-center animate-in zoom-in duration-700 overflow-y-auto">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border-4 border-emerald-100 shadow-2xl shadow-emerald-500/10 animate-bounce">
                  <CheckCircle size={56} className="text-emerald-500"/>
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">Bilet Wystawiony!</h2>
                <p className="text-sm text-slate-500 mb-8 max-w-lg mx-auto leading-relaxed font-medium">Rezerwacja została pomyślnie przetworzona i zsynchronizowana z systemem portowym. Potwierdzenie wysłano na e-mail pasażera.</p>
                
                <div className="bg-blue-50 px-10 py-6 rounded-xl border border-blue-100 mb-10 shadow-inner relative group cursor-default">
                   <div className="absolute -top-3 -left-3 bg-blue-950 text-white p-2 rounded-xl group-hover:rotate-12 transition-transform">
                      <Ticket size={24}/>
                   </div>
                   <span className="text-[10px] font-black text-blue-800 uppercase tracking-[0.3em] block mb-2">Kod Rezerwacji Systemowej</span>
                   <span className="font-mono font-black text-3xl md:text-4xl text-blue-950 tracking-[0.2em]">{generatedBookingId}</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                  <button 
                    onClick={() => setShowPrintPreview(true)} 
                    className="px-6 py-3 bg-white border-2 border-slate-200 rounded-xl font-black text-[12px] text-slate-800 hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center justify-center gap-3 uppercase tracking-widest shadow-xl shadow-slate-200/40 active:scale-95"
                  >
                      <Printer size={20} className="text-slate-400"/> Wydrukuj Kartę Pokładową
                  </button>
                  <button 
                    onClick={() => { setStep(1); setData(INITIAL_STATE); }} 
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[12px] hover:bg-black transition-all uppercase tracking-widest shadow-2xl shadow-slate-900/30 active:scale-95 flex items-center justify-center gap-3"
                  >
                      Nowa Podróż <ArrowRight size={20}/>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PRINT PREVIEW MODAL */}
      {showPrintPreview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in duration-300 relative flex flex-col md:flex-row">
            <button 
              onClick={() => setShowPrintPreview(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-red-500 z-10 p-2 transition bg-white/50 rounded-full hover:bg-red-50"
            >
              <X size={28}/>
            </button>

            {/* Left Side: Ticket Main */}
            <div className="flex-1 p-10 bg-white relative">
              <div className="flex justify-between items-start mb-10 border-b border-slate-100 pb-8">
                <div className="flex items-center gap-4">
                  <div>
                    <img src="http://fiszer.app/polsca/files/ferros-logo.png" alt="FerrOS Logo" className="h-10 w-auto object-contain" referrerPolicy="no-referrer" />
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.3em] mt-2">Karta Pokładowa / Boarding Pass</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rezerwacja / ID</p>
                  <p className="text-2xl font-mono font-black text-slate-900 tracking-tighter">{generatedBookingId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12 mb-12">
                <div className="relative">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase mb-2 tracking-widest">
                    <Navigation size={14} className="text-blue-950"/> Port Wyjścia
                  </div>
                  <div className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{data.origin.split(' ')[0]}</div>
                  <div className="text-sm text-slate-400 font-medium mt-1">Terminal Promowy Świnoujście</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase mb-2 tracking-widest">
                    <MapPin size={14} className="text-red-500"/> Port Docelowy
                  </div>
                  <div className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{data.destination.split(' ')[0]}</div>
                  <div className="text-sm text-slate-400 font-medium mt-1">Port Główny {data.destination.split(' ')[0]}</div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-8 border border-slate-100 grid grid-cols-2 md:grid-cols-3 gap-8 mb-8 shadow-inner">
                <div>
                  <p className="text-[9px] uppercase font-black text-slate-400 mb-1 tracking-widest">Pasażer</p>
                  <p className="font-black text-slate-800 text-lg">{data.passengerName || 'Jan Kowalski'}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{data.passengerDoc || 'ABC 123456'}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase font-black text-slate-400 mb-1 tracking-widest">Data / Godzina</p>
                  <p className="font-black text-slate-800 text-lg">{data.date}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{data.selectedRoute ? new Date(data.selectedRoute.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '18:00'}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase font-black text-slate-400 mb-1 tracking-widest">Prom / Statek</p>
                  <p className="font-black text-slate-800 text-lg">{data.selectedRoute?.shipName || 'm/f Polonia'}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase font-black text-slate-400 mb-1 tracking-widest">Pojazd</p>
                  <p className="font-black text-slate-800 text-lg uppercase">{data.vehicle === VehicleType.NONE ? 'Pieszy' : data.vehicle}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase font-black text-slate-400 mb-1 tracking-widest">Zakwaterowanie</p>
                  <p className="font-black text-slate-800 text-lg">{data.cabin === CabinType.NONE ? 'Miejsca Pokładowe' : data.cabin}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase font-black text-slate-400 mb-1 tracking-widest">Klasa / Taryfa</p>
                  <p className="font-black text-blue-950 text-lg">PREMIUM FLEX</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 bg-white border border-slate-100 p-4 rounded-xl">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Clock size={20}/></div>
                <p className="font-medium leading-relaxed">
                  Odprawa biletowa zamykana jest 30 minut przed odejściem promu. Prosimy o przygotowanie dokumentu tożsamości wskazanego na karcie.
                </p>
              </div>
            </div>

            {/* Stub divider */}
            <div className="relative w-full h-6 md:w-6 md:h-auto bg-slate-50 flex items-center justify-center">
              <div className="absolute border-dashed border-slate-300 w-full h-full md:border-l-2 md:border-t-0 border-t-2"></div>
              <div className="w-8 h-8 bg-black rounded-full absolute -left-4 md:left-auto md:-top-4"></div>
              <div className="w-8 h-8 bg-black rounded-full absolute -right-4 md:right-auto md:-bottom-4"></div>
            </div>

            {/* Right Side: QR Stub */}
            <div className="w-full md:w-80 bg-slate-900 p-10 text-white flex flex-col justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
              
              <div className="text-center relative z-10 w-full">
                <div className="bg-white p-6 rounded-xl inline-block mb-6 shadow-2xl shadow-black/50">
                  <QrCode size={140} className="text-slate-900"/>
                </div>
                <p className="font-mono text-xs tracking-[0.4em] text-slate-500 uppercase">{generatedBookingId}</p>
                <div className="mt-8 space-y-4">
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Brama</span>
                    <span className="font-black text-xl text-blue-300">GATE B1</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pirs</span>
                    <span className="font-black text-xl">W9</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-3">
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kierunek</span>
                     <span className="font-black text-sm uppercase">{data.destination.split(' ')[0]}</span>
                  </div>
                </div>
              </div>

              <div className="w-full mt-10 space-y-3 relative z-10">
                <button 
                  onClick={() => window.print()}
                  className="w-full bg-blue-950 text-white py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-black transition shadow-xl shadow-blue-950/50 flex items-center justify-center gap-3"
                >
                  <Printer size={20}/> Wydrukuj
                </button>
                <button 
                  onClick={() => setShowPrintPreview(false)}
                  className="w-full bg-white/10 text-white py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition flex items-center justify-center gap-3"
                >
                   Zamknij Podgląd
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingWizard;