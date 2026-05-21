
import React, { useState } from 'react';
import { Truck, Box, FileText, BarChart2, Plus, Filter, AlertTriangle, Scale, UserCheck, Package, Printer, Save, Landmark, Coins, CheckCircle, CreditCard, Users, Database, FileSignature, TrendingUp, Unlock, Download, PieChart, ShieldAlert, ArrowDownCircle, CheckSquare, XCircle, LayoutList, Clock, ArrowRight } from 'lucide-react';
import { MOCK_ROUTES, MOCK_CARGO_BOOKINGS, MOCK_FORWARDERS, MOCK_ALLOTMENTS, MOCK_BILLS_OF_LADING, MOCK_CARGO_INVOICES, MOCK_CARGO_DRIVERS, MOCK_CARGO_VEHICLES, MOCK_CARGO_CONTRACTS, MOCK_CARGO_PROGRESSIVE_DISCOUNTS, MOCK_BLACKLIST, MOCK_EDI_MESSAGES, MOCK_STANDARD_CARGO_PRICES } from '../services/mockData';
import { CargoBooking, VehicleType, CargoLoadType, CabinType, BookingStatus, BillOfLading, PackagingType, CargoDriver, CargoVehicle, BlacklistType, EDIMessage } from '../types';
import { useTranslation } from '../i18n';
import { calculateDynamicPrice } from '../services/pricingService';

const CargoModule: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'BOOKINGS' | 'ALLOTMENTS' | 'REPORTS' | 'GENERAL_CARGO' | 'SETTLEMENTS' | 'DICTIONARIES' | 'CONTRACTS' | 'EDI'>('BOOKINGS');
  const [bookings, setBookings] = useState<CargoBooking[]>(MOCK_CARGO_BOOKINGS);
  const [billsOfLading, setBillsOfLading] = useState<BillOfLading[]>(MOCK_BILLS_OF_LADING);
  const [allotments, setAllotments] = useState(MOCK_ALLOTMENTS);
  const [ediMessages, setEdiMessages] = useState<EDIMessage[]>(MOCK_EDI_MESSAGES);

  const [contractViewMode, setContractViewMode] = useState<'INDIVIDUAL' | 'STANDARD'>('INDIVIDUAL');
  const [reportType, setReportType] = useState<'MANIFEST' | 'CARRIER_STATS' | 'OPERATIONAL' | 'BLACKLIST'>('MANIFEST');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);

  const [newBooking, setNewBooking] = useState<Partial<CargoBooking>>({
     vehicleType: VehicleType.TRUCK,
     cargoDetails: { length: 16.5, weight: 0, loadType: CargoLoadType.STANDARD },
     passengers: []
  });

  const [selectedForwarder, setSelectedForwarder] = useState<string>('');
  const [newBOL, setNewBOL] = useState<Partial<BillOfLading>>({ senderName: '', receiverName: '', items: [], totalWeight: 0, totalVolume: 0 });
  const [bolItem, setBolItem] = useState({ desc: '', pack: PackagingType.PALLET, qty: 1, weight: 0, vol: 0, adr: false });

  const handleCreateBooking = () => {
     const bookingId = `CGO-${Math.floor(Math.random() * 10000)}`;
     const route = MOCK_ROUTES.find(r => r.id === newBooking.routeId) || MOCK_ROUTES[0];
     
     // Calculate dynamic price
     const priceBreakdown = calculateDynamicPrice(route, new Date(), {
        isCargo: true,
        vehicleType: newBooking.vehicleType,
        cargoDetails: newBooking.cargoDetails,
        paxAdults: newBooking.passengers?.length || 0,
        cabinType: newBooking.cabinType || CabinType.INSIDE_2,
        occupancyRate: 0.6 // Mock occupancy
     } as any);

     const newBookingObj: CargoBooking = {
        ...newBooking as CargoBooking,
        id: bookingId,
        bookingDate: new Date().toISOString().split('T')[0],
        status: BookingStatus.CONFIRMED,
        totalPrice: priceBreakdown.grossTotal, 
        isCargo: true,
        contactEmail: 'dispo@example.com',
        forwarderId: selectedForwarder || undefined
     };
     setBookings([newBookingObj, ...bookings]);
     alert(`Rezerwacja Cargo ${bookingId} utworzona! Cena: ${priceBreakdown.grossTotal.toFixed(2)} PLN`);
     setNewBooking({
         vehicleType: VehicleType.TRUCK,
         cargoDetails: { length: 16.5, weight: 0, loadType: CargoLoadType.STANDARD },
         passengers: []
     });
  };

  const handleSelectVehicle = (v: CargoVehicle) => {
     setNewBooking(prev => ({
        ...prev,
        vehicleReg: v.registrationNumber,
        vehicleType: v.type,
        cargoDetails: { ...prev.cargoDetails!, length: v.length, weight: v.weight }
     }));
  };

  const handleSelectDriver = (d: CargoDriver) => {
      const driverPax = { id: `P-${Date.now()}`, firstName: d.firstName, lastName: d.lastName, documentNumber: d.documentNumber, isDriver: true };
      setNewBooking(prev => ({ ...prev, passengers: [driverPax] }));
  };

  const handleAddBolItem = () => {
     if (!newBOL.items) newBOL.items = [];
     const updatedItems = [...newBOL.items, { 
        description: bolItem.desc, packaging: bolItem.pack, quantity: bolItem.qty, weight: bolItem.weight, volume: bolItem.vol, isADR: bolItem.adr 
     }];
     const totalW = updatedItems.reduce((acc, i) => acc + i.weight, 0);
     const totalV = updatedItems.reduce((acc, i) => acc + i.volume, 0);
     setNewBOL({ ...newBOL, items: updatedItems, totalWeight: totalW, totalVolume: totalV });
     setBolItem({ desc: '', pack: PackagingType.PALLET, qty: 1, weight: 0, vol: 0, adr: false });
  };

  const handleCreateBOL = () => {
     if (!newBOL.senderName || !newBOL.routeId || (newBOL.items?.length === 0)) return;
     const bol: BillOfLading = {
        ...newBOL as BillOfLading,
        id: `BOL-2023-${Math.floor(Math.random()*1000)}`,
        status: 'ISSUED',
        dateIssued: new Date().toISOString().split('T')[0],
        freightCost: (newBOL.totalWeight || 0) * 0.5 
     };
     setBillsOfLading([...billsOfLading, bol]);
     alert(`BOL ${bol.id} issued!`);
     setNewBOL({ senderName: '', receiverName: '', items: [], totalWeight: 0, totalVolume: 0 });
  };

  const handleReleaseAllotment = (altId: string) => {
     setAllotments(prev => prev.map(alt => {
        if(alt.id === altId) {
           const unused = alt.totalSpace - alt.usedSpace;
           return { ...alt, releasedSpace: unused };
        }
        return alt;
     }));
     alert('Unused space released to general inventory.');
  };

  const handleProcessEDI = (msg: EDIMessage) => {
     if (msg.status !== 'PENDING') return;
     if (msg.type === 'NEW_BOOKING') {
        const route = MOCK_ROUTES.find(r => r.id === msg.content.routeId) || MOCK_ROUTES[0];
        const priceBreakdown = calculateDynamicPrice(route, new Date(), {
           isCargo: true,
           vehicleType: VehicleType.TRUCK,
           cargoDetails: { length: msg.content.length, weight: msg.content.weight, loadType: CargoLoadType.STANDARD },
           paxAdults: 1,
           cabinType: CabinType.INSIDE_2,
           occupancyRate: 0.7 // Mock occupancy for EDI
        } as any);

        const newBookingFromEDI: CargoBooking = {
           id: `EDI-${Date.now()}`,
           bookingDate: msg.receivedAt.split(' ')[0],
           routeId: msg.content.routeId,
           status: BookingStatus.CONFIRMED,
           totalPrice: priceBreakdown.grossTotal, 
           isCargo: true,
           contactEmail: 'edi@partner.com',
           forwarderId: 'FWD-001', 
           vehicleType: VehicleType.TRUCK,
           vehicleReg: msg.content.vehicleReg,
           cabinType: CabinType.INSIDE_2, 
           cargoDetails: { length: msg.content.length, weight: msg.content.weight, loadType: CargoLoadType.STANDARD, forwarderRef: msg.content.refNumber },
           passengers: msg.content.driverName ? [{ id: `P-${Date.now()}`, firstName: msg.content.driverName.split(' ')[0], lastName: msg.content.driverName.split(' ')[1] || 'Driver', documentNumber: 'UNKNOWN', isDriver: true }] : []
        };
        setBookings([newBookingFromEDI, ...bookings]);
        alert(`Zlecenie EDI przetworzone. Rezerwacja ${newBookingFromEDI.id} utworzona. Cena: ${priceBreakdown.grossTotal.toFixed(2)} PLN`);
     }
     setEdiMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: 'PROCESSED' } : m));
  };

  const handleAuthorizeOverLimit = (bookingId: string) => {
     setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: BookingStatus.CONFIRMED } : b));
     alert('Rezerwacja autoryzowana.');
  };

  const handleIssueCreditTicket = (bookingId: string) => {
     setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: BookingStatus.CHECKED_IN } : b));
     alert('Bilet kredytowy wydany.');
  };

  const handleChangeValidity = (bookingId: string) => {
     alert('Procedura re-walidacji biletu (27.15).');
  };

  return (
    <div className="flex flex-col h-full bg-slate-100">
       <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-10 overflow-x-auto">
        <div className="flex-shrink-0 mr-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Truck className="text-amber-600" /> {t('nav.cargo')}
          </h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('BOOKINGS')} className={`px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'BOOKINGS' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
            {t('cargo.tabs.bookings')}
          </button>
          <button onClick={() => setActiveTab('EDI')} className={`px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'EDI' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
            {t('cargo.tabs.edi')}
          </button>
          <button onClick={() => setActiveTab('DICTIONARIES')} className={`px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'DICTIONARIES' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
            {t('cargo.tabs.dictionaries')}
          </button>
          <button onClick={() => setActiveTab('CONTRACTS')} className={`px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'CONTRACTS' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
            {t('cargo.tabs.contracts')}
          </button>
          <button onClick={() => setActiveTab('ALLOTMENTS')} className={`px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'ALLOTMENTS' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
            {t('cargo.tabs.allotments')}
          </button>
          <button onClick={() => setActiveTab('GENERAL_CARGO')} className={`px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'GENERAL_CARGO' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
            {t('cargo.tabs.general')}
          </button>
          <button onClick={() => setActiveTab('REPORTS')} className={`px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'REPORTS' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
            {t('cargo.tabs.reports')}
          </button>
           <button onClick={() => setActiveTab('SETTLEMENTS')} className={`px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'SETTLEMENTS' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
            {t('cargo.tabs.settlements')}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
         {activeTab === 'EDI' && (
            <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-center mb-6">
                     <div>
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                           <Database size={24} className="text-blue-600"/> {t('cargo.edi.title')}
                        </h3>
                        <p className="text-sm text-slate-500">{t('cargo.edi.subtitle')}</p>
                     </div>
                  </div>

                  <table className="w-full text-left text-sm">
                     <thead className="bg-slate-50 text-slate-500 uppercase text-xs border-b border-slate-200">
                        <tr>
                           <th className="p-4">{t('cargo.edi.received')}</th>
                           <th className="p-4">Nadawca (Spedytor)</th>
                           <th className="p-4">{t('cargo.edi.type')}</th>
                           <th className="p-4">{t('cargo.edi.ref')}</th>
                           <th className="p-4">{t('cargo.edi.details')}</th>
                           <th className="p-4 text-center">{t('cargo.edi.status')}</th>
                           <th className="p-4 text-right">Akcje</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {ediMessages.map(msg => (
                           <tr key={msg.id} className="hover:bg-slate-50">
                              <td className="p-4 text-slate-500 font-mono text-xs">{msg.receivedAt}</td>
                              <td className="p-4 font-bold text-slate-800">{msg.sender}</td>
                              <td className="p-4 text-xs font-bold uppercase">
                                 {msg.type === 'NEW_BOOKING' && <span className="text-green-600">{t('cargo.edi.msg.new')}</span>}
                                 {msg.type === 'MODIFY' && <span className="text-blue-600">{t('cargo.edi.msg.modify')}</span>}
                                 {msg.type === 'CANCEL' && <span className="text-red-600">{t('cargo.edi.msg.cancel')}</span>}
                              </td>
                              <td className="p-4 font-mono text-slate-600">{msg.content.refNumber}</td>
                              <td className="p-4">
                                 <div className="font-medium text-slate-700">{msg.content.vehicleReg}</div>
                                 <div className="text-xs text-slate-500">{msg.content.routeId} • {msg.content.length}m</div>
                              </td>
                              <td className="p-4 text-center">
                                 {msg.status === 'PENDING' ? (
                                    <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-[10px] font-bold uppercase">{t('cargo.edi.status.pending')}</span>
                                 ) : msg.status === 'PROCESSED' ? (
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold uppercase">{t('cargo.edi.status.processed')}</span>
                                 ) : (
                                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-bold uppercase">{t('cargo.edi.status.rejected')}</span>
                                 )}
                              </td>
                              <td className="p-4 text-right">
                                 {msg.status === 'PENDING' && (
                                    <div className="flex justify-end gap-2">
                                       <button onClick={() => handleProcessEDI(msg)} className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-blue-700 shadow-sm">
                                          <CheckSquare size={14}/> {t('cargo.edi.accept')}
                                       </button>
                                       <button className="flex items-center gap-1 bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded text-xs font-bold hover:bg-red-50">
                                          <XCircle size={14}/> {t('cargo.edi.reject')}
                                       </button>
                                    </div>
                                 )}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}

         {activeTab === 'BOOKINGS' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
               <div className="xl:col-span-2 space-y-4">
                  {bookings.map(booking => (
                     <div key={booking.id} className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition ${booking.status === BookingStatus.WAITING_LIST ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'}`}>
                        <div className="flex-1">
                           <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                 {booking.id} 
                                 {booking.cargoDetails.loadType !== CargoLoadType.STANDARD && (
                                    <span className="bg-red-100 text-red-600 text-[10px] px-2 py-1 rounded font-bold uppercase flex items-center gap-1">
                                       <AlertTriangle size={12}/> {booking.cargoDetails.loadType}
                                    </span>
                                 )}
                              </h3>
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                 booking.status === BookingStatus.CONFIRMED ? 'bg-green-100 text-green-700' : 
                                 booking.status === BookingStatus.WAITING_LIST ? 'bg-amber-100 text-amber-700' :
                                 'bg-blue-100 text-blue-700'
                              }`}>
                                 {booking.status}
                              </span>
                           </div>
                           <p className="text-sm text-slate-500 mb-4">{booking.contactEmail}</p>
                           
                           {booking.status === BookingStatus.WAITING_LIST && (
                              <div className="mb-4 bg-amber-50 p-3 rounded-lg border border-amber-200 flex gap-2 items-start">
                                 <AlertTriangle className="text-amber-600 flex-shrink-0" size={18}/>
                                 <div>
                                    <p className="text-xs font-bold text-amber-800 uppercase">{t('cargo.bookings.limit_exceeded')}</p>
                                    <p className="text-xs text-amber-700">{t('cargo.bookings.limit_desc')}</p>
                                 </div>
                              </div>
                           )}

                           <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-lg border border-slate-100">
                              <div>
                                 <span className="text-slate-400 text-xs uppercase block">{t('cargo.bookings.vehicle_label')}</span>
                                 <span className="font-bold text-slate-700">{booking.vehicleType}</span>
                                 <div className="text-slate-500">{booking.vehicleReg}</div>
                              </div>
                              <div>
                                 <span className="text-slate-400 text-xs uppercase block">{t('cargo.bookings.route_date')}</span>
                                 <span className="font-bold text-slate-700">{booking.cargoDetails.length}m / {booking.cargoDetails.weight}t</span>
                              </div>
                              <div className="col-span-2 border-t pt-2 mt-2">
                                 <span className="text-slate-400 text-xs uppercase block">Spedytor / Ref</span>
                                 <span className="font-medium text-slate-700">
                                    {MOCK_FORWARDERS.find(f => f.id === booking.forwarderId)?.name || t('cargo.bookings.individual')}
                                 </span>
                                 <div className="text-xs text-slate-500">{booking.cargoDetails.forwarderRef}</div>
                              </div>
                           </div>
                        </div>
                        <div className="flex flex-col justify-between items-end border-l border-slate-100 pl-6">
                           <div className="text-right">
                              <p className="text-xs text-slate-400 uppercase">Cena Frachtu</p>
                              <p className="text-xl font-bold text-slate-800">{booking.totalPrice.toLocaleString()} PLN</p>
                           </div>
                           
                           <div className="flex flex-col gap-2 mt-4 w-full">
                              {booking.status === BookingStatus.WAITING_LIST ? (
                                 <button onClick={() => handleAuthorizeOverLimit(booking.id)} className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 shadow-sm">
                                    <CheckCircle size={14}/> {t('cargo.bookings.auth_btn')}
                                 </button>
                              ) : booking.status === BookingStatus.CONFIRMED ? (
                                 <>
                                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold hover:bg-slate-50">
                                       <FileText size={14}/> {t('cargo.gen.goods')}
                                    </button>
                                    {booking.forwarderId && (
                                       <button onClick={() => handleIssueCreditTicket(booking.id)} className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 shadow-sm">
                                          <CreditCard size={14}/> {t('cargo.bookings.credit_btn')}
                                       </button>
                                    )}
                                 </>
                              ) : (
                                 <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 rounded-lg text-xs font-bold cursor-not-allowed">
                                    <CheckCircle size={14}/> {t('cargo.bookings.finished')}
                                 </button>
                              )}
                              
                              <button onClick={() => handleChangeValidity(booking.id)} className="text-xs text-blue-600 hover:underline flex items-center justify-end gap-1 mt-2">
                                 <Clock size={12}/> {t('cargo.bookings.validity_btn')}
                              </button>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>

               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                     <Plus size={20} className="text-amber-600"/> {t('cargo.bookings.new_booking')}
                  </h3>
                  
                  <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('cargo.bookings.forwarder_label')}</label>
                        <select className="w-full border p-2 rounded text-sm outline-none bg-white" value={selectedForwarder} onChange={(e) => setSelectedForwarder(e.target.value)}>
                           <option value="">{t('cargo.bookings.cash_only')}</option>
                           {MOCK_FORWARDERS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                     </div>

                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('cargo.bookings.route_date')}</label>
                        <select className="w-full border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-amber-500 bg-white">
                           {MOCK_ROUTES.map(r => <option key={r.id} value={r.id}>{r.origin} - {r.destination}</option>)}
                        </select>
                     </div>
                     
                     <div>
                        <div className="flex justify-between">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('cargo.bookings.vehicle_label')}</label>
                            <button className="text-[10px] text-blue-600 font-bold hover:underline" onClick={() => setActiveTab('DICTIONARIES')}>{t('cargo.bookings.dictionary_link')}</button>
                        </div>
                        <select className="w-full border p-2 rounded text-sm outline-none bg-white mb-2" onChange={(e) => {
                              const v = MOCK_CARGO_VEHICLES.find(v => v.id === e.target.value);
                              if(v) handleSelectVehicle(v);
                           }}>
                           <option value="">{t('cargo.bookings.select_list')}</option>
                           {MOCK_CARGO_VEHICLES.filter(v => selectedForwarder ? v.forwarderId === selectedForwarder : true).map(v => (
                              <option key={v.id} value={v.id}>{v.registrationNumber} ({v.type})</option>
                           ))}
                        </select>
                        
                        <div className="grid grid-cols-2 gap-2">
                           <button className={`p-2 border rounded text-sm font-bold ${newBooking.vehicleType === VehicleType.TRUCK ? 'bg-amber-50 border-amber-500 text-amber-700' : 'hover:bg-slate-50'}`} onClick={() => setNewBooking({...newBooking, vehicleType: VehicleType.TRUCK})}>
                              {t('cargo.bookings.lorry')}
                           </button>
                           <button className={`p-2 border rounded text-sm font-bold ${newBooking.vehicleType === VehicleType.TRAILER ? 'bg-amber-50 border-amber-500 text-amber-700' : 'hover:bg-slate-50'}`} onClick={() => setNewBooking({...newBooking, vehicleType: VehicleType.TRAILER})}>
                              {t('cargo.bookings.trailer')}
                           </button>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('cargo.bookings.length')}</label>
                           <input type="number" className="w-full border p-2 rounded text-sm bg-white" value={newBooking.cargoDetails?.length} onChange={e => setNewBooking({...newBooking, cargoDetails: {...newBooking.cargoDetails!, length: parseFloat(e.target.value)}})} />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('cargo.bookings.weight')}</label>
                           <input type="number" className="w-full border p-2 rounded text-sm bg-white" value={newBooking.cargoDetails?.weight} onChange={e => setNewBooking({...newBooking, cargoDetails: {...newBooking.cargoDetails!, weight: parseFloat(e.target.value)}})} />
                        </div>
                     </div>

                     <div>
                        <div className="flex justify-between">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('cargo.bookings.driver')}</label>
                            <button className="text-[10px] text-blue-600 font-bold hover:underline" onClick={() => setActiveTab('DICTIONARIES')}>{t('cargo.bookings.dictionary_link')}</button>
                        </div>
                        <select className="w-full border p-2 rounded text-sm outline-none bg-white mb-2" onChange={(e) => {
                              const d = MOCK_CARGO_DRIVERS.find(d => d.id === e.target.value);
                              if(d) handleSelectDriver(d);
                           }}>
                           <option value="">{t('cargo.bookings.select_list')}</option>
                           {MOCK_CARGO_DRIVERS.filter(d => selectedForwarder ? d.forwarderId === selectedForwarder : true).map(d => (
                              <option key={d.id} value={d.id}>{d.lastName} {d.firstName} ({d.documentNumber})</option>
                           ))}
                        </select>
                     </div>

                     <button onClick={handleCreateBooking} className="w-full bg-amber-600 text-white py-3 rounded-lg font-bold hover:bg-amber-700 mt-4">
                        {t('cargo.bookings.save_btn')}
                     </button>
                  </div>
               </div>
            </div>
         )}

         {activeTab === 'REPORTS' && (
            <div className="space-y-6 animate-fade-in">
               <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
                  <div className="flex gap-2">
                     <button onClick={() => setReportType('MANIFEST')} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${reportType === 'MANIFEST' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        {t('cargo.reports.manifest')}
                     </button>
                     <button onClick={() => setReportType('CARRIER_STATS')} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${reportType === 'CARRIER_STATS' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        {t('cargo.reports.carrier_stats')}
                     </button>
                     <button onClick={() => setReportType('OPERATIONAL')} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${reportType === 'OPERATIONAL' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        {t('cargo.reports.operational')}
                     </button>
                     <button onClick={() => setReportType('BLACKLIST')} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${reportType === 'BLACKLIST' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-red-50'}`}>
                        {t('cargo.reports.blacklist')}
                     </button>
                  </div>
                  <div className="flex gap-2 items-center">
                     <input type="date" value={reportDate} onChange={(e) => setReportDate(e.target.value)} className="border p-2 rounded text-sm bg-white"/>
                     <button className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded text-sm font-bold hover:bg-blue-700">
                        <Download size={16}/> {t('cargo.reports.export_pdf')}
                     </button>
                  </div>
               </div>

               {reportType === 'MANIFEST' && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                     <div className="p-6 border-b border-slate-200 bg-slate-50">
                        <h3 className="font-bold text-slate-800">{t('cargo.reports.manifest')}</h3>
                     </div>
                     <table className="w-full text-left text-sm">
                        <thead className="bg-white text-slate-500 uppercase text-xs border-b border-slate-200">
                           <tr>
                              <th className="p-4">{t('cargo.reports.pos')}</th>
                              <th className="p-4">{t('cargo.reports.reg_number')}</th>
                              <th className="p-4">{t('cargo.reports.type_374')}</th>
                              <th className="p-4 text-right">Długość</th>
                              <th className="p-4 text-right">Waga</th>
                              <th className="p-4">{t('cargo.reports.load')}</th>
                              <th className="p-4">{t('cargo.bookings.driver')}</th>
                              <th className="p-4">Spedytor</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                           {bookings.map((b, idx) => (
                              <tr key={b.id} className="hover:bg-slate-50">
                                 <td className="p-4 font-mono text-slate-400">{idx + 1}</td>
                                 <td className="p-4 font-bold">{b.vehicleReg}</td>
                                 <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${b.vehicleType === VehicleType.TRUCK ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                                       {b.vehicleType === VehicleType.TRUCK ? 'LORRY' : 'TRAILER'}
                                    </span>
                                 </td>
                                 <td className="p-4 text-right font-mono">{b.cargoDetails.length} m</td>
                                 <td className="p-4 text-right font-mono">{b.cargoDetails.weight} t</td>
                                 <td className="p-4">
                                    {b.cargoDetails.loadType !== CargoLoadType.STANDARD ? (
                                       <span className="text-red-600 font-bold flex items-center gap-1"><AlertTriangle size={14}/> {b.cargoDetails.loadType}</span>
                                    ) : (
                                       <span className="text-slate-500">{t('cargo.reports.standard')}</span>
                                    )}
                                 </td>
                                 <td className="p-4">{b.passengers.some(p => p.isDriver) ? t('cargo.contracts.yes') : '-'}</td>
                                 <td className="p-4 text-xs font-bold text-slate-700">{MOCK_FORWARDERS.find(f => f.id === b.forwarderId)?.name || 'CASH'}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               )}

               {reportType === 'CARRIER_STATS' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                           <h3 className="font-bold text-slate-800">{t('cargo.reports.carrier_title')}</h3>
                        </div>
                        <table className="w-full text-left text-sm">
                           <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                              <tr>
                                 <th className="p-4">Spedytor</th>
                                 <th className="p-4 text-right">{t('cargo.reports.trips_count')}</th>
                                 <th className="p-4 text-right">{t('cargo.reports.total_meters')}</th>
                                 <th className="p-4 text-right">{t('cargo.reports.revenue_est')}</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                              {MOCK_FORWARDERS.map(f => (
                                 <tr key={f.id} className="hover:bg-slate-50">
                                    <td className="p-4 font-bold text-slate-700">{f.name}</td>
                                    <td className="p-4 text-right">3</td>
                                    <td className="p-4 text-right font-mono">49.5 m</td>
                                    <td className="p-4 text-right font-mono text-emerald-600 font-bold">6,600 PLN</td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                     <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center text-center">
                        <PieChart size={64} className="text-amber-500 mb-4 opacity-80"/>
                        <h4 className="text-lg font-bold text-slate-700 mb-2">{t('cargo.reports.market_share')}</h4>
                        <p className="text-sm text-slate-500">{t('cargo.reports.market_desc')}</p>
                     </div>
                  </div>
               )}

               {reportType === 'OPERATIONAL' && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                     <h3 className="font-bold text-slate-800 mb-6">{t('cargo.reports.ops_title')}</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                           <p className="text-xs font-bold text-slate-400 uppercase mb-2">{t('cargo.reports.lane_usage')}</p>
                           <h4 className="text-3xl font-bold text-slate-800">1,450 m</h4>
                           <p className="text-sm text-slate-500 mt-1">{t('cargo.reports.lane_of', { total: 2200 })} (66%)</p>
                           <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                              <div className="bg-amber-500 h-2 rounded-full" style={{ width: '66%' }}></div>
                           </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                           <p className="text-xs font-bold text-slate-400 uppercase mb-2">{t('cargo.reports.units_count')}</p>
                           <h4 className="text-3xl font-bold text-slate-800">86 szt.</h4>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                           <p className="text-xs font-bold text-slate-400 uppercase mb-2">{t('cargo.reports.special_loads')}</p>
                           <h4 className="text-3xl font-bold text-slate-800">3</h4>
                        </div>
                     </div>
                  </div>
               )}

               {reportType === 'BLACKLIST' && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                     <div className="p-6 border-b border-slate-200 bg-red-50 flex gap-4 items-center">
                        <ShieldAlert className="text-red-600" size={24}/>
                        <div>
                           <h3 className="font-bold text-red-900">{t('cargo.reports.blacklist_title')}</h3>
                           <p className="text-xs text-red-700">{t('cargo.reports.blacklist_desc')}</p>
                        </div>
                     </div>
                     <table className="w-full text-left text-sm">
                        <thead className="bg-white text-slate-500 uppercase text-xs border-b border-slate-200">
                           <tr>
                              <th className="p-4">{t('cargo.edi.type')}</th>
                              <th className="p-4">Wartość</th>
                              <th className="p-4">{t('cargo.reports.blacklist_reason')}</th>
                              <th className="p-4">{t('cargo.reports.blacklist_date')}</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {MOCK_BLACKLIST.filter(b => b.type === BlacklistType.VEHICLE || b.type === BlacklistType.COMPANY).map(entry => (
                              <tr key={entry.id} className="hover:bg-red-50">
                                 <td className="p-4 font-bold text-slate-700">{entry.type}</td>
                                 <td className="p-4 font-mono">{entry.value}</td>
                                 <td className="p-4 text-red-700 italic">{entry.reason}</td>
                                 <td className="p-4 text-slate-500">{entry.dateAdded}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               )}
            </div>
         )}

         {activeTab === 'DICTIONARIES' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Truck size={20} className="text-slate-600"/> {t('cargo.dicts.vehicles_title')}
                     </h3>
                     <button className="text-xs bg-slate-100 px-2 py-1 rounded font-bold hover:bg-slate-200">{t('cargo.dicts.add_btn')}</button>
                  </div>
                  <table className="w-full text-left text-sm">
                     <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                        <tr>
                           <th className="p-2">{t('cargo.dicts.reg')}</th>
                           <th className="p-2">Typ</th>
                           <th className="p-2">{t('cargo.dicts.dimensions')}</th>
                           <th className="p-2">{t('cargo.dicts.company')}</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {MOCK_CARGO_VEHICLES.map(v => (
                           <tr key={v.id}>
                              <td className="p-2 font-bold">{v.registrationNumber}</td>
                              <td className="p-2">{v.type}</td>
                              <td className="p-2 text-slate-500">{v.length}m / {v.weight}t</td>
                              <td className="p-2 text-xs">{MOCK_FORWARDERS.find(f => f.id === v.forwarderId)?.name}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Users size={20} className="text-slate-600"/> {t('cargo.dicts.drivers_title')}
                     </h3>
                     <button className="text-xs bg-slate-100 px-2 py-1 rounded font-bold hover:bg-slate-200">{t('cargo.dicts.add_btn')}</button>
                  </div>
                  <table className="w-full text-left text-sm">
                     <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                        <tr>
                           <th className="p-2">{t('cargo.dicts.name')}</th>
                           <th className="p-2">{t('cargo.dicts.doc')}</th>
                           <th className="p-2">{t('cargo.dicts.phone')}</th>
                           <th className="p-2">{t('cargo.dicts.company')}</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {MOCK_CARGO_DRIVERS.map(d => (
                           <tr key={d.id}>
                              <td className="p-2 font-bold">{d.lastName} {d.firstName}</td>
                              <td className="p-2 font-mono text-xs">{d.documentNumber}</td>
                              <td className="p-2 text-xs">{d.phoneNumber}</td>
                              <td className="p-2 text-xs">{MOCK_FORWARDERS.find(f => f.id === d.forwarderId)?.name}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}

         {activeTab === 'CONTRACTS' && (
            <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
               <div className="flex justify-center mb-6">
                  <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm flex">
                     <button onClick={() => setContractViewMode('INDIVIDUAL')} className={`px-4 py-2 rounded-md text-sm font-bold transition ${contractViewMode === 'INDIVIDUAL' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}>
                        {t('cargo.contracts.individual_tab')}
                     </button>
                     <button onClick={() => setContractViewMode('STANDARD')} className={`px-4 py-2 rounded-md text-sm font-bold transition ${contractViewMode === 'STANDARD' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}>
                        {t('cargo.contracts.general_tab')}
                     </button>
                  </div>
               </div>
               
               {contractViewMode === 'INDIVIDUAL' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                           <div>
                              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                 <FileSignature size={20} className="text-blue-600"/> {t('cargo.contracts.title')}
                              </h3>
                              <p className="text-sm text-slate-500">{t('cargo.contracts.desc')}</p>
                           </div>
                           <button className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-bold hover:bg-blue-100">{t('cargo.contracts.new_btn')}</button>
                        </div>
                        <table className="w-full text-left text-sm">
                           <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                              <tr>
                                 <th className="p-2">{t('cargo.contracts.contract_no')}</th>
                                 <th className="p-2">Spedytor</th>
                                 <th className="p-2 text-right">{t('cargo.contracts.rate')}</th>
                                 <th className="p-2 text-center">{t('cargo.contracts.discount')}</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                              {MOCK_CARGO_CONTRACTS.map(contract => (
                                 <tr key={contract.id}>
                                    <td className="p-2 font-mono text-xs">{contract.id}</td>
                                    <td className="p-2 font-bold">{MOCK_FORWARDERS.find(f => f.id === contract.forwarderId)?.name}</td>
                                    <td className="p-2 text-right font-bold">{contract.ratePerMeter} PLN</td>
                                    <td className="p-2 text-center"><span className="text-green-600">-{contract.discountPercent}%</span></td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                     <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                           <div>
                              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                 <TrendingUp size={20} className="text-emerald-600"/> {t('cargo.contracts.progressive_title')}
                              </h3>
                              <p className="text-sm text-slate-500">{t('cargo.contracts.progressive_desc')}</p>
                           </div>
                           <button className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-bold hover:bg-emerald-100">{t('cargo.contracts.new_threshold')}</button>
                        </div>
                        <table className="w-full text-left text-sm">
                           <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                              <tr>
                                 <th className="p-2">Spedytor</th>
                                 <th className="p-2">{t('cargo.contracts.period')}</th>
                                 <th className="p-2 text-right">{t('cargo.contracts.threshold')}</th>
                                 <th className="p-2 text-center">{t('cargo.contracts.bonus')}</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                              {MOCK_CARGO_PROGRESSIVE_DISCOUNTS.map(prog => (
                                 <tr key={prog.id}>
                                    <td className="p-2 font-bold">{MOCK_FORWARDERS.find(f => f.id === prog.forwarderId)?.name}</td>
                                    <td className="p-2 text-xs">{prog.period}</td>
                                    <td className="p-2 text-right">&gt; {prog.thresholdMeters} m</td>
                                    <td className="p-2 text-center"><span className="text-emerald-600 font-bold">{prog.discountPercent}%</span></td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               )}

               {contractViewMode === 'STANDARD' && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fade-in">
                     <div className="flex justify-between items-center mb-6">
                        <div>
                           <h3 className="font-bold text-slate-800 flex items-center gap-2">
                              <LayoutList size={20} className="text-indigo-600"/> {t('cargo.contracts.general_title')}
                           </h3>
                           <p className="text-sm text-slate-500">{t('cargo.contracts.general_desc')}</p>
                        </div>
                        <button className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded font-bold hover:bg-indigo-100 flex items-center gap-1">
                           <Printer size={12}/> {t('cargo.contracts.print_btn')}
                        </button>
                     </div>
                     <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                           <tr>
                              <th className="p-3">{t('res.route')}</th>
                              <th className="p-3">{t('cargo.contracts.length_cat')}</th>
                              <th className="p-3 text-right">{t('cargo.contracts.rate_pm')}</th>
                              <th className="p-3 text-center">{t('cargo.contracts.driver_incl')}</th>
                              <th className="p-3 text-right">{t('cargo.contracts.est_cost')}</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {MOCK_STANDARD_CARGO_PRICES.map(price => (
                              <tr key={price.id}>
                                 <td className="p-3 font-bold text-slate-700">{price.routeId}</td>
                                 <td className="p-3"><span className="bg-slate-100 px-2 py-1 rounded text-xs">{price.lengthCategory}</span></td>
                                 <td className="p-3 text-right font-bold text-indigo-600">{price.pricePerMeter} PLN</td>
                                 <td className="p-3 text-center">{price.driverIncluded ? t('cargo.contracts.yes') : t('cargo.contracts.no_plus')}</td>
                                 <td className="p-3 text-right text-slate-600">{(price.pricePerMeter * 16.5).toFixed(2)} PLN</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               )}
            </div>
         )}

         {activeTab === 'ALLOTMENTS' && (
            <div className="max-w-4xl mx-auto space-y-6">
               <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                  <div>
                     <h3 className="font-bold text-slate-800">{t('cargo.allotments.title')}</h3>
                     <p className="text-sm text-slate-500">{t('cargo.allotments.route_info', { route: 'R001', from: 'Gdańsk', to: 'Nynäshamn', date: '2023-10-25' })}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-xs text-slate-400 uppercase">{t('cargo.allotments.total_occupancy')}</p>
                     <p className="font-bold text-xl text-slate-800">1450m / 2200m</p>
                  </div>
               </div>
               <div className="grid gap-4">
                  {allotments.map(alt => {
                     const forwarder = MOCK_FORWARDERS.find(f => f.id === alt.forwarderId);
                     const unusedSpace = alt.totalSpace - alt.usedSpace;
                     const percent = Math.round((alt.usedSpace / alt.totalSpace) * 100);
                     return (
                        <div key={alt.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                           <div className="flex justify-between items-center mb-4">
                              <h4 className="font-bold text-lg text-slate-800">{forwarder?.name}</h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${percent > 90 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                                 {percent}% {t('cargo.sets.limit_usage')}
                              </span>
                           </div>
                           <div className="relative pt-1">
                              <div className="flex mb-2 items-center justify-between">
                                 <div className="text-xs font-semibold inline-block text-amber-600 uppercase">{t('cargo.allotments.used')}: {alt.usedSpace}m</div>
                                 <div className="text-xs font-semibold inline-block text-slate-600 uppercase">{t('cargo.allotments.limit')}: {alt.totalSpace}m {alt.releasedSpace ? `(-${alt.releasedSpace}m ${t('cargo.allotments.released')})` : ''}</div>
                              </div>
                              <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-slate-100 border">
                                 <div style={{ width: `${percent}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500"></div>
                              </div>
                           </div>
                           <div className="flex justify-end gap-3 text-sm">
                              <button className="text-blue-600 hover:underline">{t('cargo.allotments.history')}</button>
                              <span className="text-slate-300">|</span>
                              {unusedSpace > 0 ? (
                                 <button onClick={() => handleReleaseAllotment(alt.id)} className="text-red-600 font-bold hover:underline flex items-center gap-1">
                                    <Unlock size={14}/> {t('cargo.allotments.release_btn', { unused: unusedSpace })}
                                 </button>
                              ) : (
                                 <span className="text-slate-400 italic">{t('cargo.allotments.no_space')}</span>
                              )}
                           </div>
                        </div>
                     )
                  })}
               </div>
            </div>
         )}

         {activeTab === 'GENERAL_CARGO' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
               <div className="xl:col-span-2 space-y-4">
                  <h3 className="font-bold text-slate-800 mb-2">{t('cargo.gen.bol_list')}</h3>
                  {billsOfLading.map(bol => (
                     <div key={bol.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition cursor-pointer">
                        <div className="flex justify-between items-start mb-4">
                           <div>
                              <h4 className="font-bold text-lg text-slate-800">{bol.id}</h4>
                              <p className="text-sm text-slate-500">{bol.dateIssued}</p>
                           </div>
                           <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold uppercase">{bol.status}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                           <div className="bg-slate-50 p-3 rounded border">
                              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">{t('cargo.gen.sender')}</span>
                              <span className="font-bold text-slate-700">{bol.senderName}</span>
                           </div>
                           <div className="bg-slate-50 p-3 rounded border">
                              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">{t('cargo.gen.receiver')}</span>
                              <span className="font-bold text-slate-700">{bol.receiverName}</span>
                           </div>
                        </div>
                        <button className="flex items-center gap-1 text-sm text-slate-600 hover:text-blue-600">
                           <Printer size={16}/> {t('cargo.gen.print_btn')}
                        </button>
                     </div>
                  ))}
               </div>
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                     <Package size={20} className="text-amber-600"/> {t('cargo.gen.new_bol')}
                  </h3>
                  <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('cargo.gen.sailing')}</label>
                        <select className="w-full border p-2 rounded text-sm outline-none bg-white" onChange={e => setNewBOL({...newBOL, routeId: e.target.value})}>
                           <option value="">{t('cargo.gen.select')}</option>
                           {MOCK_ROUTES.map(r => <option key={r.id} value={r.id}>{r.origin} - {r.destination}</option>)}
                        </select>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <input type="text" className="border p-2 rounded text-sm bg-white" placeholder={t('cargo.gen.sender')} value={newBOL.senderName} onChange={e => setNewBOL({...newBOL, senderName: e.target.value})} />
                        <input type="text" className="border p-2 rounded text-sm bg-white" placeholder={t('cargo.gen.receiver')} value={newBOL.receiverName} onChange={e => setNewBOL({...newBOL, receiverName: e.target.value})} />
                     </div>
                     <div className="bg-slate-50 p-3 rounded border space-y-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('cargo.gen.add_item')}</label>
                        <input type="text" placeholder={t('cargo.gen.goods_desc')} className="w-full border p-2 rounded text-xs bg-white" value={bolItem.desc} onChange={e => setBolItem({...bolItem, desc: e.target.value})}/>
                        <div className="grid grid-cols-2 gap-2">
                           <select className="border p-2 rounded text-xs bg-white" value={bolItem.pack} onChange={e => setBolItem({...bolItem, pack: e.target.value as PackagingType})}>
                              {Object.values(PackagingType).map(p => <option key={p} value={p}>{p}</option>)}
                           </select>
                           <input type="number" placeholder={t('cargo.gen.qty')} className="border p-2 rounded text-xs bg-white" value={bolItem.qty} onChange={e => setBolItem({...bolItem, qty: parseInt(e.target.value)})}/>
                        </div>
                        <div className="flex items-center gap-2">
                           <input type="checkbox" checked={bolItem.adr} onChange={e => setBolItem({...bolItem, adr: e.target.checked})} />
                           <span className="text-xs text-slate-600">{t('cargo.gen.adr_label')}</span>
                        </div>
                        <button onClick={handleAddBolItem} className="w-full bg-slate-200 text-slate-700 py-1 rounded text-xs font-bold hover:bg-slate-300">
                           {t('cargo.gen.add_to_list')}
                        </button>
                     </div>
                     <div className="space-y-1 text-sm">
                        <div className="flex justify-between"><span>{t('cargo.gen.items_count')}</span> <strong>{newBOL.items?.length || 0}</strong></div>
                        <div className="flex justify-between"><span>{t('cargo.gen.total_weight')}</span> <strong>{newBOL.totalWeight} kg</strong></div>
                     </div>
                     <button onClick={handleCreateBOL} className="w-full bg-amber-600 text-white py-3 rounded-lg font-bold hover:bg-amber-700">
                        <Save size={16} className="inline mr-2"/> {t('cargo.gen.issue_btn')}
                     </button>
                  </div>
               </div>
            </div>
         )}

         {activeTab === 'SETTLEMENTS' && (
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {MOCK_FORWARDERS.map(forwarder => (
                     <div key={forwarder.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="font-bold text-lg text-slate-800 mb-2">{forwarder.name}</h3>
                        <p className="text-xs text-slate-500 mb-4">{forwarder.contractNumber} • {forwarder.paymentType === 'PREPAID' ? t('cargo.sets.prepaid') : t('cargo.sets.invoice_term')}</p>
                        <div className="mb-4">
                           <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-500 uppercase">{t('cargo.sets.limit_usage')}</span>
                              <span className="font-bold">{(forwarder.currentBalance / forwarder.creditLimit * 100).toFixed(0)}%</span>
                           </div>
                           <div className="w-full bg-slate-100 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${forwarder.currentBalance / forwarder.creditLimit * 100}%` }}></div>
                           </div>
                           <div className="flex justify-between text-xs mt-1">
                              <span className="text-slate-400">{t('cargo.sets.balance')}: {forwarder.currentBalance.toLocaleString()} PLN</span>
                              <span className="text-slate-400">Limit: {forwarder.creditLimit.toLocaleString()} PLN</span>
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <button className="flex-1 py-2 bg-slate-50 text-slate-700 text-xs font-bold rounded border hover:bg-slate-100">{t('cargo.sets.invoice_btn')}</button>
                           <button className="flex-1 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded border hover:bg-blue-100">{t('cargo.sets.report_btn')}</button>
                        </div>
                     </div>
                  ))}
               </div>
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                     <h3 className="font-bold text-slate-800">{t('cargo.sets.bulk_title')}</h3>
                     <button className="px-3 py-1 bg-white border rounded text-sm hover:bg-slate-50">{t('cargo.sets.filter_btn')}</button>
                  </div>
                  <table className="w-full text-left text-sm">
                     <thead className="bg-white text-slate-500 uppercase border-b border-slate-200 text-xs">
                        <tr>
                           <th className="p-4">{t('cargo.sets.invoice_no')}</th>
                           <th className="p-4">{t('cargo.sets.contractor')}</th>
                           <th className="p-4">{t('cargo.sets.due_date')}</th>
                           <th className="p-4 text-right">{t('cargo.sets.amount')}</th>
                           <th className="p-4 text-center">{t('common.status')}</th>
                           <th className="p-4 text-right">Akcje</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {MOCK_CARGO_INVOICES.map(inv => (
                           <tr key={inv.id} className="hover:bg-slate-50">
                              <td className="p-4 font-mono font-medium text-slate-700">{inv.id}</td>
                              <td className="p-4 font-bold">{MOCK_FORWARDERS.find(f => f.id === inv.forwarderId)?.name}</td>
                              <td className="p-4 text-slate-500">{inv.dueDate}</td>
                              <td className="p-4 text-right font-mono font-bold">{inv.totalAmount.toLocaleString()} {inv.currency}</td>
                              <td className="p-4 text-center">
                                 <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                    inv.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                    inv.status === 'OVERDUE' ? 'bg-red-100 text-red-700' :
                                    'bg-blue-100 text-blue-700'
                                 }`}>
                                    {inv.status === 'PAID' ? t('cargo.sets.paid') : inv.status === 'OVERDUE' ? t('cargo.sets.overdue') : t('cargo.sets.issued')}
                                 </span>
                              </td>
                              <td className="p-4 text-right flex justify-end gap-2">
                                 <button className="text-emerald-600 hover:bg-emerald-50 p-2 rounded" title={t('cargo.sets.reg_payment')}><Coins size={16}/></button>
                                 <button className="text-slate-400 hover:text-blue-600 p-2 rounded" title={t('common.print')}><Printer size={16}/></button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default CargoModule;
