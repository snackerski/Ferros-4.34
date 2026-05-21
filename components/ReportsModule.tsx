import React, { useState } from 'react';
import { FileText, Download, Filter, Printer, BarChart3, PieChart, Calendar, Clock, Mail, CheckCircle, XCircle, Plus, Ticket, Users, FileWarning, ShoppingCart, Globe, FileCheck, Droplet, Ship, List, Truck, ShieldAlert, TrendingUp, AlertCircle, DollarSign, Activity, Gauge, Percent, Briefcase, RotateCcw, CreditCard, Banknote, Tag, Package, LayoutList, Coins } from 'lucide-react';
import { MOCK_REPORTS, MOCK_CHART_DATA, MOCK_REPORT_SCHEDULES, MOCK_CARNETS, MOCK_CLIENT, MOCK_AGENTS, MOCK_UNUSED_TICKETS, MOCK_REFUND_ITEMS, MOCK_DISCOUNT_ITEMS, MOCK_BOARDED_VEHICLES, MOCK_SALES_BREAKDOWN, MOCK_INTERLINE_SALES, MOCK_EXPLOITATION_DATA, MOCK_RESERVATIONS, MOCK_COMPLAINTS, MOCK_SHIFT_HISTORY, MOCK_VOYAGE_CAPACITIES, MOCK_FORWARDERS } from '../services/mockData';
import { ReportDefinition, ReportSchedule, BookingStatus, CargoLoadType } from '../types';

const ReportsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'REPORTS' | 'SCHEDULE'>('REPORTS');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedReport, setSelectedReport] = useState<ReportDefinition | null>(null);
  const [schedules, setSchedules] = useState<ReportSchedule[]>(MOCK_REPORT_SCHEDULES);

  const categories = [
    { id: 'ALL', label: 'Wszystkie' },
    { id: 'PAX', label: 'Pasażerskie' },
    { id: 'CARGO', label: 'Cargo / Fracht' },
    { id: 'SALES', label: 'Sprzedaż / Kasa' },
    { id: 'EXPLOITATION', label: 'Eksploatacyjne' },
  ];

  const filteredReports = MOCK_REPORTS.filter(r => 
    selectedCategory === 'ALL' || r.category === selectedCategory
  );

  const handleToggleSchedule = (id: string) => {
     setSchedules(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const renderReportContent = (reportCode: string) => {
     switch (reportCode) {
        case '11.1':
           const manifestPax = MOCK_RESERVATIONS.filter(r => !r.isCargo && r.routeId === 'R001');
           return (
              <div className="space-y-6">
                 <div className="flex items-center gap-2 mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100 text-blue-800 font-bold">
                    <span className="flex items-center gap-2"><Users size={20}/></span>
                    <span>Manifest Pasażerski - Rejs R001 (Etap 11.1)</span>
                 </div>
                 <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 uppercase text-xs text-gray-500">
                       <tr>
                          <th className="py-3 px-2">Lp.</th>
                          <th className="py-3 px-2">Nazwisko i Imię</th>
                          <th className="py-3 px-2">Dokument</th>
                          <th className="py-3 px-2">Narodowość</th>
                          <th className="py-3 px-2">Kabina</th>
                          <th className="py-3 px-2 text-center">Odprawiony</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       {manifestPax.flatMap((r, ridx) => r.passengers.map((p, pidx) => (
                          <tr key={`${r.id}-${p.id}`} className="hover:bg-gray-50">
                             <td className="py-2 px-2 text-gray-400">{ridx + 1}.{pidx + 1}</td>
                             <td className="py-2 px-2 font-bold text-gray-800">{p.lastName} {p.firstName}</td>
                             <td className="py-2 px-2 font-mono">{p.documentNumber}</td>
                             <td className="py-2 px-2">PL</td>
                             <td className="py-2 px-2">{r.cabinType}</td>
                             <td className="py-2 px-2 text-center">
                                {r.status === BookingStatus.CHECKED_IN 
                                   ? <span className="text-green-600 font-bold">TAK</span>
                                   : <span className="text-red-300">NIE</span>
                                }
                             </td>
                          </tr>
                       )))}
                    </tbody>
                 </table>
              </div>
           );

        case '11.2':
           const manifestCargo = MOCK_RESERVATIONS.filter(r => r.isCargo && r.routeId === 'R001');
           return (
              <div className="space-y-6">
                 <div className="flex items-center gap-2 mb-4 p-4 bg-amber-50 rounded-lg border border-amber-100 text-amber-800 font-bold">
                    <span className="flex items-center gap-2"><Truck size={20}/></span>
                    <span>Manifest Ładunkowy - Rejs R001 (Etap 11.2)</span>
                 </div>
                 <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 uppercase text-xs text-gray-500">
                       <tr>
                          <th className="py-3 px-2">Nr Rej.</th>
                          <th className="py-3 px-2">Typ</th>
                          <th className="py-3 px-2 text-right">Długość</th>
                          <th className="py-3 px-2 text-right">Waga</th>
                          <th className="py-3 px-2">Opis Ładunku</th>
                          <th className="py-3 px-2">Kierowca</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       {manifestCargo.map((r, idx) => (
                          <tr key={r.id} className="hover:bg-slate-50">
                             <td className="py-2 px-2 font-bold">{r.vehicleReg}</td>
                             <td className="py-2 px-2">{r.vehicleType}</td>
                             <td className="py-2 px-2 text-right font-mono">{(r as any).cargoDetails?.length}m</td>
                             <td className="py-2 px-2 text-right font-mono">{(r as any).cargoDetails?.weight}t</td>
                             <td className="py-2 px-2 text-xs">{(r as any).cargoDetails?.goodsDescription || 'Towar mieszany'}</td>
                             <td className="py-2 px-2 text-xs">{r.passengers[0]?.lastName}</td>
                          </tr>
                       ))}
                    </tbody>
                    <tfoot className="bg-gray-50 font-bold border-t border-gray-200">
                       <tr>
                          <td colSpan={2} className="py-2 px-2 text-right uppercase text-[10px]">Łącznie:</td>
                          <td className="py-2 px-2 text-right">{manifestCargo.reduce((acc, r) => acc + ((r as any).cargoDetails?.length || 0), 0)}m</td>
                          <td className="py-2 px-2 text-right">{manifestCargo.reduce((acc, r) => acc + ((r as any).cargoDetails?.weight || 0), 0)}t</td>
                          <td colSpan={2}></td>
                       </tr>
                    </tfoot>
                 </table>
              </div>
           );

        case '11.7':
           return (
              <div className="space-y-6">
                 <div className="flex items-center gap-2 mb-4 p-4 bg-purple-50 rounded-lg border border-purple-100 text-purple-800 font-bold">
                    <span className="flex items-center gap-2"><Ticket size={20}/></span>
                    <span>Raport Wykorzystania Karnetów (Etap 11.7)</span>
                 </div>
                 <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 uppercase text-[10px] font-black">
                       <tr>
                          <th className="p-3">ID Karnetu</th>
                          <th className="p-3">Właściciel (ID)</th>
                          <th className="p-3">Typ</th>
                          <th className="p-3 text-center">Wykorzystanie</th>
                          <th className="p-3">Ważność</th>
                          <th className="p-3">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       {MOCK_CARNETS.map(c => (
                          <tr key={c.id}>
                             <td className="p-3 font-mono font-bold">{c.id}</td>
                             <td className="p-3 text-slate-500">{c.ownerId}</td>
                             <td className="p-3 font-medium">{c.type}</td>
                             <td className="p-3">
                                <div className="flex items-center gap-2">
                                   <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden min-w-[80px]">
                                      <div className="bg-purple-500 h-full" style={{ width: `${(c.usedRides/c.totalRides)*100}%` }}></div>
                                   </div>
                                   <span className="text-[10px] font-bold">{c.usedRides}/{c.totalRides}</span>
                                </div>
                             </td>
                             <td className="p-3 text-xs">{c.expiryDate}</td>
                             <td className="p-3">
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded ${c.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.status}</span>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           );

        case '12.4':
           return (
              <div className="space-y-6">
                 <div className="flex items-center gap-2 mb-4 p-4 bg-emerald-50 rounded-lg border border-emerald-100 text-emerald-800 font-bold">
                    <span className="flex items-center gap-2"><Truck size={20}/></span>
                    <span>Raport Jednostek Załadowanych - Final Boarding (Etap 12.4)</span>
                 </div>
                 <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 uppercase text-[10px] font-black">
                       <tr>
                          <th className="p-3">Nr Rej.</th>
                          <th className="p-3">Typ</th>
                          <th className="p-3">Pas (Lane)</th>
                          <th className="p-3">Kierowca</th>
                          <th className="p-3">Godzina Wjazdu</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y">
                       {MOCK_BOARDED_VEHICLES.length > 0 ? MOCK_BOARDED_VEHICLES.map((v, i) => (
                          <tr key={i}>
                             <td className="p-3 font-black">{v.regNumber}</td>
                             <td className="p-3">{v.type}</td>
                             <td className="p-3 font-mono font-bold text-blue-600">{v.lane}</td>
                             <td className="p-3">{v.driverName}</td>
                             <td className="p-3 text-slate-400 font-mono text-xs">{v.checkInTime}</td>
                          </tr>
                       )) : (
                          <tr><td colSpan={5} className="p-12 text-center text-slate-400 italic">Brak danych - rejs w trakcie odprawy.</td></tr>
                       )}
                    </tbody>
                 </table>
              </div>
           );

        case '13.1':
           return (
              <div className="space-y-6">
                 <div className="flex items-center gap-2 mb-4 p-4 bg-slate-900 rounded-lg border border-slate-700 text-white font-bold">
                    <span className="flex items-center gap-2"><Droplet size={20} className="text-blue-400"/></span>
                    <span>Raport Eksploatacyjny i Zużycia Paliwa (Etap 13.1)</span>
                 </div>
                 <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 uppercase text-[10px] font-black">
                       <tr>
                          <th className="p-3">Data</th>
                          <th className="p-3">Jednostka</th>
                          <th className="p-3 text-right">Dystans (nm)</th>
                          <th className="p-3 text-right">Zużycie HFO (t)</th>
                          <th className="p-3 text-right">Prędkość śr.</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y">
                       {MOCK_EXPLOITATION_DATA.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                             <td className="p-3 font-mono">{row.date}</td>
                             <td className="p-3 font-bold">{row.shipName}</td>
                             <td className="p-3 text-right">{row.distanceSailed}</td>
                             <td className="p-3 text-right font-bold text-blue-600">{row.fuelConsumedHFO}</td>
                             <td className="p-3 text-right">{row.avgSpeed} kn</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
                 <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-xs italic">
                    Dane pogodowe dla okresu: {MOCK_EXPLOITATION_DATA[0].weather}
                 </div>
              </div>
           );

        case '15.1':
           return (
              <div className="space-y-6">
                 <div className="flex items-center gap-2 mb-4 p-4 bg-slate-100 rounded-lg border border-slate-200 text-slate-800 font-bold">
                    <span className="flex items-center gap-2"><Banknote size={20} className="text-emerald-600"/></span>
                    <span>Dzienny Raport Sprzedaży (Etap 15.1)</span>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Suma Brutto (PLN)</p>
                       <h3 className="text-2xl font-black text-emerald-600">45,230.00</h3>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Formy Płatności</p>
                       <div className="flex gap-4 text-xs font-bold mt-2">
                          <span className="flex items-center gap-1 text-slate-600"><CreditCard size={12}/> 75%</span>
                          <span className="flex items-center gap-1 text-slate-600"><Coins size={12}/> 25%</span>
                       </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Ilość transakcji</p>
                       <h3 className="text-2xl font-black text-slate-800">142</h3>
                    </div>
                 </div>
                 <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-bold">Breakdown wg kanałów</div>
                    <div className="p-4 space-y-3">
                       <div className="flex justify-between text-sm"><span>Sprzedaż Online (B2C)</span><span className="font-bold">28,500 PLN</span></div>
                       <div className="flex justify-between text-sm"><span>Kasa Terminal (BOK)</span><span className="font-bold">12,430 PLN</span></div>
                       <div className="flex justify-between text-sm"><span>Aplikacja Mobilna</span><span className="font-bold">4,300 PLN</span></div>
                    </div>
                 </div>
              </div>
           );

        case '15.3':
           return (
              <div className="space-y-6">
                 <div className="flex items-center gap-2 mb-4 p-4 bg-slate-100 rounded-lg border border-slate-200 text-slate-800 font-bold">
                    <span className="flex items-center gap-2"><ShoppingCart size={20} className="text-blue-600"/></span>
                    <span>Analiza Sprzedaży Produktów Onboard (Etap 15.3)</span>
                 </div>
                 <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 uppercase text-[10px] font-black">
                       <tr>
                          <th className="p-3">Kategoria</th>
                          <th className="p-3">Nazwa Pozycji</th>
                          <th className="p-3 text-center">Ilość (Szt)</th>
                          <th className="p-3 text-right">Netto (PLN)</th>
                          <th className="p-3 text-right">Vat (PLN)</th>
                          <th className="p-3 text-right">Brutto (PLN)</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y">
                       {MOCK_SALES_BREAKDOWN.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                             <td className="p-3"><span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase">{row.category}</span></td>
                             <td className="p-3 font-bold text-slate-700">{row.itemName}</td>
                             <td className="p-3 text-center font-mono">{row.quantity}</td>
                             <td className="p-3 text-right">{row.netTotal.toFixed(2)}</td>
                             <td className="p-3 text-right text-slate-400">{row.vatTotal.toFixed(2)}</td>
                             <td className="p-3 text-right font-black">{row.grossTotal.toFixed(2)}</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           );

        case '15.6':
           return (
              <div className="space-y-6">
                 <div className="flex items-center gap-2 mb-4 p-4 bg-red-50 rounded-lg border border-red-100 text-red-800 font-bold">
                    <RotateCcw size={20}/>
                    <span>Rejestr Zwrotów i Korekt (Etap 15.6)</span>
                 </div>
                 <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 uppercase text-[10px] font-black">
                       <tr>
                          <th className="p-3">Nr Korekty</th>
                          <th className="p-3">Dotyczy Dok.</th>
                          <th className="p-3">Powód</th>
                          <th className="p-3">Kasjer</th>
                          <th className="p-3 text-right">Kwota Zwrotu</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y">
                       {MOCK_REFUND_ITEMS.map((refund, i) => (
                          <tr key={i}>
                             <td className="p-3 font-mono font-bold text-red-600">{refund.docId}</td>
                             <td className="p-3 font-mono">{refund.originalDocId}</td>
                             <td className="p-3 text-xs">{refund.reason}</td>
                             <td className="p-3 font-medium">{refund.cashier}</td>
                             <td className="p-3 text-right font-black">-{refund.amount.toFixed(2)} PLN</td>
                          </tr>
                       ))}
                    </tbody>
                    <tfoot className="bg-red-50 font-bold text-red-800">
                       <tr>
                          <td colSpan={4} className="p-3 text-right uppercase text-[10px]">Suma wypłaconych refundacji:</td>
                          <td className="p-3 text-right">{MOCK_REFUND_ITEMS.reduce((a,b) => a + b.amount, 0).toFixed(2)} PLN</td>
                       </tr>
                    </tfoot>
                 </table>
              </div>
           );

        case '15.7':
            return (
               <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4 p-4 bg-emerald-50 rounded-lg border border-emerald-100 text-emerald-800 font-bold">
                     <span className="flex items-center gap-2"><Percent size={20}/></span>
                     <span>Analiza Wykorzystania Zniżek i Promocji (Etap 15.7)</span>
                  </div>
                  <table className="w-full text-sm text-left">
                     <thead className="bg-gray-50 border-b border-gray-200 uppercase text-[10px] font-black">
                        <tr>
                           <th className="p-3">Kod Promocji</th>
                           <th className="p-3">Nr Rezerwacji</th>
                           <th className="p-3 text-right">Cena Bazowa</th>
                           <th className="p-3 text-right">Rabat</th>
                           <th className="p-3 text-right">Cena Końcowa</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y">
                        {MOCK_DISCOUNT_ITEMS.map((item, i) => (
                           <tr key={i}>
                              <td className="p-3"><span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold text-xs uppercase">{item.codeUsed}</span></td>
                              <td className="p-3 font-mono">{item.bookingId}</td>
                              <td className="p-3 text-right text-slate-400">{item.originalPrice.toFixed(2)}</td>
                              <td className="p-3 text-right font-bold text-red-500">-{item.discountAmount.toFixed(2)}</td>
                              <td className="p-3 text-right font-black text-slate-800">{item.finalPrice.toFixed(2)} PLN</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            );

        case '11.6':
           return (
              <div className="space-y-6">
                 <div className="flex items-center gap-2 mb-4 p-4 bg-emerald-50 rounded-lg border border-emerald-100 text-emerald-800 font-bold">
                    <span className="flex items-center gap-2"><Activity size={20}/></span>
                    <span>Raport Dostępności Miejsc i Obłożenia Linii (Etap 11.6)</span>
                 </div>
                 <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 uppercase text-[10px] font-black">
                       <tr>
                          <th className="py-3 px-2">Rejs / Data</th>
                          <th className="py-3 px-2">Statek</th>
                          <th className="py-3 px-2 text-center">Obłożenie PAX</th>
                          <th className="py-3 px-2 text-center">Obłożenie Kabin</th>
                          <th className="py-3 px-2 text-center">Obłożenie Cargo</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       {MOCK_VOYAGE_CAPACITIES.map(voy => {
                          const paxP = Math.round((voy.paxBooked / voy.paxTotal) * 100);
                          const cabP = Math.round((voy.cabinBooked / voy.cabinTotal) * 100);
                          const carP = Math.round((voy.laneMetersBooked / voy.laneMetersTotal) * 100);
                          return (
                             <tr key={voy.routeId}>
                                <td className="py-4 px-2 font-bold">{voy.routeId}<br/><span className="font-normal text-xs text-slate-500">{voy.departureTime.split('T')[0]}</span></td>
                                <td className="py-4 px-2 text-slate-600">{voy.shipName}</td>
                                <td className="py-4 px-2">
                                   <div className="flex flex-col gap-1">
                                      <div className="flex justify-between text-[10px] font-bold"><span>{voy.paxBooked}/{voy.paxTotal}</span><span>{paxP}%</span></div>
                                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                         <div className="bg-blue-500 h-full" style={{ width: `${paxP}%` }}></div>
                                      </div>
                                   </div>
                                </td>
                                <td className="py-4 px-2">
                                   <div className="flex flex-col gap-1">
                                      <div className="flex justify-between text-[10px] font-bold"><span>{voy.cabinBooked}/{voy.cabinTotal}</span><span>{cabP}%</span></div>
                                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                         <div className="bg-indigo-500 h-full" style={{ width: `${cabP}%` }}></div>
                                      </div>
                                   </div>
                                </td>
                                <td className="py-4 px-2">
                                   <div className="flex flex-col gap-1">
                                      <div className="flex justify-between text-[10px] font-bold"><span>{voy.laneMetersBooked}/{voy.laneMetersTotal}m</span><span>{carP}%</span></div>
                                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                         <div className="bg-amber-500 h-full" style={{ width: `${carP}%` }}></div>
                                      </div>
                                   </div>
                                </td>
                             </tr>
                          );
                       })}
                    </tbody>
                 </table>
              </div>
           );

        default:
           return (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                 <PieChart size={48} className="mb-4 text-slate-300" />
                 <p>Podgląd danych szczegółowych dla raportu: {selectedReport?.name}</p>
                 <p className="text-xs mt-2 italic">Widok jest generowany dynamicznie na podstawie bazy danych FerrOS.</p>
              </div>
           );
     }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="text-blue-600" /> Raporty i Zestawienia
          </h2>
          <p className="text-xs text-slate-500">Moduły Operacyjne, Sprzedażowe i Analityczne BI</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('REPORTS')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'REPORTS' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Katalog Raportów
          </button>
          <button 
            onClick={() => setActiveTab('SCHEDULE')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'SCHEDULE' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Harmonogram Wysyłki (30.1)
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {activeTab === 'REPORTS' && (
           <>
            <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
               <div className="p-4 border-b border-slate-100 bg-slate-50">
                  <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs font-black uppercase tracking-widest bg-white text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
               </div>

               <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {filteredReports.map(report => (
                  <button
                     key={report.id}
                     onClick={() => setSelectedReport(report)}
                     className={`w-full text-left p-4 rounded-xl border transition-all ${
                        selectedReport?.id === report.id
                        ? 'bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-500'
                        : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
                     }`}
                  >
                     <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-slate-700 text-sm leading-tight">{report.name}</span>
                        <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-mono font-bold">
                        {report.code}
                        </span>
                     </div>
                     <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter mt-1">{report.category}</p>
                     <p className="text-[11px] text-slate-500 line-clamp-2 mt-2 leading-relaxed">{report.description}</p>
                  </button>
                  ))}
                  {filteredReports.length === 0 && (
                     <div className="text-center py-12 text-slate-300 flex flex-col items-center">
                        <FileWarning size={32} className="mb-2 opacity-50"/>
                        <span className="text-xs font-bold uppercase tracking-widest">Brak raportów</span>
                     </div>
                  )}
               </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
               {selectedReport ? (
                  <>
                  <div className="bg-white p-6 border-b border-slate-200 flex justify-between items-center shadow-sm z-10">
                     <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600">
                           <FileCheck size={24}/>
                        </div>
                        <div>
                           <h3 className="font-bold text-xl text-slate-800 tracking-tight">{selectedReport.name}</h3>
                           <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">
                              Dokument: REP/{selectedReport.code}/{new Date().toISOString().slice(0,10)}
                           </p>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-sm font-bold border border-slate-200 transition">
                        <Filter size={16} /> Filtry
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-sm font-bold border border-slate-200 transition">
                        <Printer size={16} /> Drukuj
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition shadow-lg shadow-blue-900/20">
                        <Download size={16} /> Pobierz PDF
                        </button>
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 bg-slate-100/50">
                     <div className="bg-white shadow-xl border border-slate-200 min-h-[1000px] p-16 max-w-5xl mx-auto rounded-xl relative overflow-hidden">
                        {/* Letterhead background element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-16 -mt-16 pointer-events-none opacity-50"></div>
                        
                        <div className="text-center mb-12 border-b-2 border-slate-900 pb-8">
                           <div className="flex justify-between items-start">
                              <div className="text-left">
                                 <img src="http://fiszer.app/polsca/files/ferros-logo.png" alt="FerrOS Logo" className="h-12 w-auto object-contain" referrerPolicy="no-referrer" />
                              </div>
                              <div className="text-right">
                                 <p className="text-[10px] font-black text-slate-900 uppercase">Data Wygenerowania</p>
                                 <p className="text-lg font-mono font-bold text-slate-700">{new Date().toLocaleString()}</p>
                              </div>
                           </div>
                           <h2 className="text-2xl mt-10 font-black text-slate-800 uppercase tracking-tighter border-t pt-8 inline-block border-slate-100 px-12">{selectedReport.name}</h2>
                        </div>

                        {renderReportContent(selectedReport.code)}

                        <div className="mt-20 pt-8 border-t border-slate-200 flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                           <div className="flex flex-col gap-1">
                              <span>Wygenerował: System FerrOS BI (ID: 0021-AUTO)</span>
                              <span>Oddział: HQ Szczecin, PL</span>
                           </div>
                           <div className="text-right">
                              <span>Dokument poufny - Tylko do użytku służbowego</span>
                              <div className="mt-1">Strona 1 z 1</div>
                           </div>
                        </div>
                     </div>
                  </div>
                  </>
               ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                     <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center gap-6">
                        <BarChart3 size={80} className="text-slate-200" />
                        <div className="text-center">
                           <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">Katalog Raportów</h3>
                           <p className="max-w-xs text-center text-sm mt-2 text-slate-400 font-medium">
                           Wybierz dokument z listy po lewej stronie, aby przejść do generowania i podglądu danych.
                           </p>
                        </div>
                     </div>
                  </div>
               )}
            </div>
           </>
        )}

        {activeTab === 'SCHEDULE' && (
           <div className="flex-1 p-8 overflow-y-auto">
              <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
                 <div className="bg-blue-600 rounded-2xl p-8 text-white flex justify-between items-center shadow-xl shadow-blue-900/20 relative overflow-hidden">
                    <div className="relative z-10">
                       <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                          <Clock size={32}/> Automatyczna Dystrybucja (Etap 30.1)
                       </h3>
                       <p className="mt-2 opacity-80 max-w-xl font-medium">
                          Skonfiguruj cykliczne raportowanie dla działów finansowych, operacyjnych i partnerów zewnętrznych. Raporty są wysyłane automatycznie w formatach PDF, CSV lub XML.
                       </p>
                    </div>
                    <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-95 shadow-lg relative z-10">
                       Nowe Zadanie
                    </button>
                    <Clock className="absolute -right-8 -bottom-8 w-64 h-64 text-white opacity-5 pointer-events-none" />
                 </div>

                 <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                       <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Harmonogram Wysyłek</h3>
                       <div className="flex gap-2">
                          <button className="text-[10px] font-black text-slate-400 uppercase hover:text-slate-600 tracking-widest">Logi Wysyłki</button>
                       </div>
                    </div>
                    
                    <table className="w-full text-left text-sm">
                       <thead className="bg-white text-slate-500 uppercase text-[10px] font-black border-b border-slate-200">
                          <tr>
                             <th className="p-5">Zadanie / Raport</th>
                             <th className="p-5">Odbiorca (E-mail / FTP)</th>
                             <th className="p-5">Częstotliwość</th>
                             <th className="p-5">Format</th>
                             <th className="p-5 text-center">Status</th>
                             <th className="p-5 text-right">Zarządzaj</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          {schedules.map(sch => {
                             const report = MOCK_REPORTS.find(r => r.id === sch.reportId);
                             return (
                                <tr key={sch.id} className="hover:bg-slate-50 transition-colors group">
                                   <td className="p-5">
                                      <div className="font-bold text-slate-800 text-base">{report?.name}</div>
                                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{report?.category} • KOD {report?.code}</div>
                                   </td>
                                   <td className="p-5 flex items-center gap-3">
                                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition">
                                         <Mail size={16}/> 
                                      </div>
                                      <span className="font-bold text-slate-600">{sch.recipientEmail}</span>
                                   </td>
                                   <td className="p-5">
                                      <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-[10px] font-black text-slate-600 border border-slate-200 uppercase tracking-widest">
                                         {sch.frequency}
                                      </span>
                                   </td>
                                   <td className="p-5 font-mono text-xs font-bold text-slate-400">PDF, CSV</td>
                                   <td className="p-5 text-center">
                                      <button 
                                         onClick={() => handleToggleSchedule(sch.id)}
                                         className={`flex items-center justify-center gap-1.5 text-[10px] font-black px-4 py-1.5 rounded-full transition uppercase tracking-widest border-2 ${
                                            sch.active ? 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100' : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                                         }`}
                                      >
                                         {sch.active ? <><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> AKTYWNY</> : <><div className="w-2 h-2 rounded-full bg-slate-400"></div> WSTRZYMANY</>}
                                      </button>
                                   </td>
                                   <td className="p-5 text-right">
                                      <button className="p-2 text-slate-300 hover:text-blue-600 transition rounded-lg hover:bg-white border border-transparent hover:border-slate-100">
                                         <Plus size={20} className="rotate-45" />
                                      </button>
                                   </td>
                                </tr>
                             )
                          })}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default ReportsModule;