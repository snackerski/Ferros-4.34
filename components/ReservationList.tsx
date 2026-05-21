import React, { useState, useEffect } from 'react';
import { MOCK_RESERVATIONS, MOCK_ROUTES } from '../services/mockData';
import { BookingStatus, Reservation, VehicleType, CabinType } from '../types';
import { Filter, Printer, Edit, Truck, Clock, Search, X, Calendar, MapPin, Plus, User, Ship, Save } from 'lucide-react';
import ReservationManagementModal from './ReservationManagementModal';
import WaitingListManager from './WaitingListManager';
import { useTranslation } from '../i18n';

const ReservationList: React.FC = () => {
  const { t } = useTranslation();
  // Advanced Search State (Etap 4.3)
  const [filters, setFilters] = useState({
    query: '',
    status: 'ALL',
    route: 'ALL',
    dateFrom: '',
    dateTo: ''
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [localReservations, setLocalReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResForEdit, setSelectedResForEdit] = useState<Reservation | null>(null);
  const [isWaitingListOpen, setIsWaitingListOpen] = useState(false);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await fetch('/api/bookings');
        const data = await res.json();
        // Merge with mock data for initial view if empty, or just use data
        setLocalReservations(data.length > 0 ? data : MOCK_RESERVATIONS);
      } catch (error) {
        console.error("Failed to fetch reservations", error);
        setLocalReservations(MOCK_RESERVATIONS);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  // Create New Reservation State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newResData, setNewResData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    routeId: MOCK_ROUTES[0].id,
    date: new Date().toISOString().split('T')[0],
    vehicleType: VehicleType.NONE,
    cabinType: CabinType.NONE
  });

  // Filter Logic
  const filtered = localReservations.filter(r => {
    const matchesQuery = !filters.query || 
       r.id.toLowerCase().includes(filters.query.toLowerCase()) ||
       r.passengers.some(p => p.lastName.toLowerCase().includes(filters.query.toLowerCase())) ||
       (r.vehicleReg && r.vehicleReg.toLowerCase().includes(filters.query.toLowerCase()));
    
    const matchesStatus = filters.status === 'ALL' || r.status === filters.status;
    const matchesRoute = filters.route === 'ALL' || r.routeId === filters.route;
    
    const rDate = new Date(r.bookingDate);
    const matchesFrom = !filters.dateFrom || rDate >= new Date(filters.dateFrom);
    const matchesTo = !filters.dateTo || rDate <= new Date(filters.dateTo);

    return matchesQuery && matchesStatus && matchesRoute && matchesFrom && matchesTo;
  });

  const waitingCount = localReservations.filter(r => r.status === BookingStatus.WAITING_LIST).length;

  const handleUpdateReservation = (updatedRes: Reservation) => {
    setLocalReservations(prev => prev.map(r => r.id === updatedRes.id ? updatedRes : r));
  };

  const handleCreateReservation = () => {
    if (!newResData.lastName || !newResData.firstName) {
        alert(t('res.msg.create_error_pax'));
        return;
    }

    const routePrice = MOCK_ROUTES.find(r => r.id === newResData.routeId)?.basePrice || 200;
    const totalPrice = routePrice + (newResData.vehicleType !== VehicleType.NONE ? 150 : 0) + (newResData.cabinType !== CabinType.NONE ? 200 : 0);

    const newReservation: Reservation = {
        id: `RES-${Date.now().toString().slice(-6)}`,
        bookingDate: newResData.date,
        status: BookingStatus.CONFIRMED,
        routeId: newResData.routeId,
        passengers: [{
            id: `P-${Date.now()}`,
            firstName: newResData.firstName,
            lastName: newResData.lastName,
            documentNumber: ''
        }],
        vehicleType: newResData.vehicleType,
        cabinType: newResData.cabinType,
        totalPrice: totalPrice,
        contactEmail: newResData.email,
        isCargo: false
    };

    setLocalReservations([newReservation, ...localReservations]);
    setIsCreateModalOpen(false);
    setNewResData({
        firstName: '',
        lastName: '',
        email: '',
        routeId: MOCK_ROUTES[0].id,
        date: new Date().toISOString().split('T')[0],
        vehicleType: VehicleType.NONE,
        cabinType: CabinType.NONE
    });
    alert(t('res.msg.create_success', { id: newReservation.id }));
  };

  const handleWLPromote = (ids: string[]) => {
     setLocalReservations(prev => prev.map(r => ids.includes(r.id) ? { ...r, status: BookingStatus.CONFIRMED } : r));
     alert(t('res.msg.promote_success', { count: ids.length }));
     setIsWaitingListOpen(false);
  };

  const handleWLReject = (ids: string[]) => {
     setLocalReservations(prev => prev.map(r => ids.includes(r.id) ? { ...r, status: BookingStatus.CANCELLED } : r));
     alert(t('res.msg.reject_success', { count: ids.length }));
     setIsWaitingListOpen(false);
  };

  const clearFilters = () => {
     setFilters({ query: '', status: 'ALL', route: 'ALL', dateFrom: '', dateTo: '' });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800">{t('res.title')}</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsWaitingListOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition shadow-sm text-xs"
          >
            <Clock size={16} className={waitingCount > 0 ? "text-amber-500" : "text-slate-400"}/>
            <span>{t('res.queue')}</span>
            {waitingCount > 0 && (
              <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-amber-200">
                {waitingCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition text-xs ${isFiltersOpen ? 'bg-slate-800 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'}`}
          >
            <Filter size={16}/> {t('res.filter')}
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-sea-600 text-white px-3 py-1.5 rounded-lg hover:bg-sea-700 font-medium flex items-center gap-2 shadow-sm text-xs"
          >
            <Plus size={16}/> {t('res.new')}
          </button>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      {isFiltersOpen && (
         <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-4 animate-in slide-in-from-top-2">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
               <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t('res.search_placeholder')}</label>
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14}/>
                     <input 
                        type="text" 
                        value={filters.query}
                        onChange={e => setFilters({...filters, query: e.target.value})}
                        className="w-full pl-9 border p-1.5 rounded bg-white outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                        placeholder="..."
                     />
                  </div>
               </div>
               <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t('res.status')}</label>
                  <select 
                     value={filters.status}
                     onChange={e => setFilters({...filters, status: e.target.value})}
                     className="w-full border p-1.5 rounded bg-white outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  >
                     <option value="ALL">{t('common.all')}</option>
                     {Object.values(BookingStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
               </div>
               <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t('res.route')}</label>
                  <div className="relative">
                     <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14}/>
                     <select 
                        value={filters.route}
                        onChange={e => setFilters({...filters, route: e.target.value})}
                        className="w-full pl-9 border p-1.5 rounded bg-white outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-xs"
                     >
                        <option value="ALL">{t('common.all')}</option>
                        {MOCK_ROUTES.map(r => <option key={r.id} value={r.id}>{r.origin} - {r.destination}</option>)}
                     </select>
                  </div>
               </div>
               <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t('res.date_range')}</label>
                  <div className="flex gap-2">
                     <input 
                        type="date" 
                        value={filters.dateFrom}
                        onChange={e => setFilters({...filters, dateFrom: e.target.value})}
                        className="w-full border p-1.5 rounded bg-white outline-none text-[10px]"
                     />
                     <input 
                        type="date" 
                        value={filters.dateTo}
                        onChange={e => setFilters({...filters, dateTo: e.target.value})}
                        className="w-full border p-1.5 rounded bg-white outline-none text-[10px]"
                     />
                  </div>
               </div>
            </div>
            <div className="flex justify-end mt-3">
               <button 
                  onClick={clearFilters}
                  className="text-slate-500 text-[10px] hover:text-red-500 flex items-center gap-1 font-bold uppercase"
               >
                  <X size={12}/> {t('res.clear')}
               </button>
            </div>
         </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-semibold">
            <tr>
              <th className="p-2 border-b border-slate-200">{t('res.id_col')}</th>
              <th className="p-2 border-b border-slate-200">{t('res.status')}</th>
              <th className="p-2 border-b border-slate-200">{t('res.date_col')}</th>
              <th className="p-2 border-b border-slate-200">{t('res.client_col')}</th>
              <th className="p-2 border-b border-slate-200">{t('res.type_col')}</th>
              <th className="p-2 border-b border-slate-200">{t('res.amount_col')}</th>
              <th className="p-2 border-b border-slate-200 text-right">{t('res.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(res => (
              <tr 
                key={res.id} 
                onClick={() => setSelectedResForEdit(res)}
                className="hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <td className="p-2">
                   <div className="font-mono font-medium text-sea-700 text-xs">{res.id}</div>
                </td>
                <td className="p-2">
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    res.status === BookingStatus.CONFIRMED || res.status === BookingStatus.PAID ? 'bg-emerald-100 text-emerald-700' :
                    res.status === BookingStatus.WAITING_LIST ? 'bg-amber-100 text-amber-700' :
                    res.status === BookingStatus.CHECKED_IN ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {res.status}
                  </span>
                </td>
                <td className="p-2 text-slate-600 text-xs">
                   <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-slate-400"/> {res.bookingDate}
                   </div>
                   <div className="text-[10px] text-slate-400 pl-5">{res.routeId}</div>
                </td>
                <td className="p-2">
                  <div className="font-medium text-slate-800 text-xs">{res.passengers[0]?.lastName || 'Brak'} {res.passengers[0]?.firstName || 'Danych'}</div>
                  <div className="text-[10px] text-slate-400">{res.contactEmail}</div>
                </td>
                <td className="p-2 text-[11px]">
                   {res.isCargo ? (
                      <span className="flex items-center gap-1 text-amber-700 font-medium bg-amber-50 px-1.5 py-0.5 rounded w-fit">
                         <Truck size={12}/> {t('book.cargo')}
                      </span>
                   ) : (
                      <span className="text-slate-600">PAX</span>
                   )}
                </td>
                <td className="p-2 font-medium text-slate-700 text-xs">{res.totalPrice.toLocaleString()} PLN</td>
                <td className="p-2 text-right">
                  <div className="flex justify-end gap-1">
                    <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded inline-block"
                    >
                      <Printer size={14} />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
            <div className="p-12 text-center text-slate-500 border-t border-slate-100">
               <Search size={48} className="mx-auto mb-4 opacity-20"/>
               <p>{t('res.empty')}</p>
            </div>
        )}
      </div>
      
      {/* Waiting List processing indicator */}
      {waitingCount > 0 && (
         <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3">
               <div className="bg-amber-100 p-2 rounded-full text-amber-700">
                  <Clock size={24}/>
               </div>
               <div>
                  <h4 className="font-bold text-amber-900">{t('res.queue')} ({waitingCount})</h4>
                  <p className="text-sm text-amber-800">{t('res.queue.info')}</p>
               </div>
            </div>
            <button 
               onClick={() => setIsWaitingListOpen(true)}
               className="px-6 py-2 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 text-sm shadow-sm transition"
            >
               {t('res.queue')}
            </button>
         </div>
      )}

      {selectedResForEdit && (
        <ReservationManagementModal 
          reservation={selectedResForEdit}
          onClose={() => setSelectedResForEdit(null)}
          onUpdate={handleUpdateReservation}
        />
      )}

      {isWaitingListOpen && (
         <WaitingListManager 
            reservations={localReservations}
            onClose={() => setIsWaitingListOpen(false)}
            onPromote={handleWLPromote}
            onReject={handleWLReject}
         />
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                    <h3 className="font-bold text-xl flex items-center gap-2">
                        <Plus size={24} className="text-blue-400"/> {t('res.modal.new_title')}
                    </h3>
                    <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white transition">
                        <X size={24}/>
                    </button>
                </div>
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-slate-700 mb-1">{t('res.route')}</label>
                            <div className="relative">
                                <Ship className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                                <select 
                                    className="w-full pl-10 border p-2.5 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newResData.routeId}
                                    onChange={e => setNewResData({...newResData, routeId: e.target.value})}
                                >
                                    {MOCK_ROUTES.map(r => <option key={r.id} value={r.id}>{r.origin} - {r.destination}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-slate-700 mb-1">{t('book.date')}</label>
                            <input 
                                type="date" 
                                className="w-full border p-2.5 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                value={newResData.date}
                                onChange={e => setNewResData({...newResData, date: e.target.value})}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">{t('res.modal.first_name')}</label>
                            <input 
                                type="text" 
                                className="w-full border p-2.5 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="..."
                                value={newResData.firstName}
                                onChange={e => setNewResData({...newResData, firstName: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">{t('res.modal.last_name')}</label>
                            <input 
                                type="text" 
                                className="w-full border p-2.5 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="..."
                                value={newResData.lastName}
                                onChange={e => setNewResData({...newResData, lastName: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200 flex justify-end gap-3">
                        <button 
                            onClick={() => setIsCreateModalOpen(false)}
                            className="px-6 py-2.5 border border-slate-300 rounded-lg font-bold text-slate-600 hover:bg-slate-50"
                        >
                            {t('common.cancel')}
                        </button>
                        <button 
                            onClick={handleCreateReservation}
                            className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-100"
                        >
                            <Save size={18}/> {t('common.save')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ReservationList;
