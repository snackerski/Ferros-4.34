import React, { useState } from 'react';
import { 
  ConciergeBell, Search, User, Key, ArrowUpCircle, CreditCard, ShoppingBag, 
  Utensils, Beer, Receipt, FileText, Star, Gift, Crown, History, Heart, 
  Clock, AlertCircle, Calendar, Flag, Phone, ShieldCheck, ChevronRight, X, Printer, Download, Info, LayoutDashboard
} from 'lucide-react';
import { MOCK_RESERVATIONS, MOCK_ONBOARD_TRANSACTIONS, MOCK_LOYALTY_MEMBERS } from '../services/mockData';
import { BookingStatus, CabinType, Reservation, OnBoardTransaction, LoyaltyTier } from '../types';
import { useTranslation } from '../i18n';

const ReceptionModule: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activePassenger, setActivePassenger] = useState<Reservation | null>(null);
  const [passengerProfile, setPassengerProfile] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'BILLING'>('PROFILE');
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const handleSearch = () => {
    const found = MOCK_RESERVATIONS.find(r => 
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.passengers.some(p => p.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.cabinType !== CabinType.NONE && searchQuery === '5002') 
    );

    if (found) {
       setActivePassenger(found);
       
       const foundMember = MOCK_LOYALTY_MEMBERS.find(m => m.email === found.contactEmail);
       
       const extendedProfileDefaults = {
          tier: LoyaltyTier.GOLD,
          pointsBalance: 2450,
          joinDate: '2021-05-10',
          preferences: ['Wysokie piętro', 'Z dala od windy', 'Dieta Bezglutenowa'],
          tags: ['VIP', 'Business', 'High Spender'],
          nextTierPoints: 5000,
          nationality: 'PL',
          birthDate: '1980-05-15',
          docExpiry: '2028-05-15',
          iceContact: '+48 600 000 000 (Żona - Maria)'
       };

       if (foundMember) {
           setPassengerProfile({
               ...extendedProfileDefaults,
               ...foundMember,
               preferences: (foundMember as any).preferences || extendedProfileDefaults.preferences,
               tags: (foundMember as any).tags || extendedProfileDefaults.tags
           });
       } else {
           setPassengerProfile(extendedProfileDefaults);
       }
    } else {
       setActivePassenger(null);
       setPassengerProfile(null);
       if (searchQuery) alert(t('res.empty'));
    }
  };

  const handleIssueKey = () => {
     alert('Etap 7.2: RFID Duplication successful.');
  };

  const handleUpgrade = () => {
     if(!activePassenger) return;
     const upgradeCost = 250;
     const confirmUpgrade = confirm(`Upgrade: Apartament LUX (Deck 8).\nCost: ${upgradeCost} PLN.\n\nProceed?`);
     
     if(confirmUpgrade) {
        alert('Upgrade completed. Balance updated.');
     }
  };

  const getTransactionIcon = (location: string) => {
     switch(location) {
        case 'RESTAURANT': return <Utensils size={16}/>;
        case 'BAR': return <Beer size={16}/>;
        case 'SHOP': return <ShoppingBag size={16}/>;
        case 'SPA': return <User size={16}/>;
        default: return <CreditCard size={16}/>;
     }
  };

  const getTierColor = (tier: string) => {
     switch(tier) {
        case LoyaltyTier.PLATINUM: return 'bg-slate-900 text-white border-slate-700';
        case LoyaltyTier.GOLD: return 'bg-amber-100 text-amber-800 border-amber-300';
        default: return 'bg-slate-100 text-slate-600 border-slate-200';
     }
  };

  const passengerTransactions = activePassenger 
      ? (MOCK_ONBOARD_TRANSACTIONS.filter(t => t.reservationId === activePassenger.id).length > 0 
          ? MOCK_ONBOARD_TRANSACTIONS.filter(t => t.reservationId === activePassenger.id)
          : [
              { id: 'TX-1', reservationId: activePassenger.id, date: '2023-10-25 14:00', location: 'RESTAURANT', item: 'Chef Dinner', amount: 85, currency: 'PLN', status: 'PAID' },
              { id: 'TX-2', reservationId: activePassenger.id, date: '2023-10-25 16:30', location: 'SHOP', item: 'Chanel Parfum', amount: 350, currency: 'PLN', status: 'PAID' },
              { id: 'TX-3', reservationId: activePassenger.id, date: '2023-10-25 18:00', location: 'BAR', item: 'Welcome Drinks', amount: 60, currency: 'PLN', status: 'CHARGED_TO_ROOM' },
            ] as OnBoardTransaction[])
      : [];
      
  const totalSpent = passengerTransactions.reduce((acc, t) => acc + t.amount, 0);
  const unpaidBalance = passengerTransactions.filter(t => t.status === 'CHARGED_TO_ROOM').reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="flex flex-col h-full bg-slate-100">
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex justify-between items-center shadow-sm z-10">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ConciergeBell className="text-indigo-600" size={18} /> {t('recep.title')}
          </h2>
          <p className="text-[10px] text-slate-500">{t('recep.subtitle')}</p>
        </div>
      </div>

      <div className="flex-1 p-4 grid grid-cols-1 xl:grid-cols-4 gap-4 overflow-hidden">
         {/* LEFT COLUMN: Search & Recent */}
         <div className="xl:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 p-4 h-fit flex flex-col gap-4">
            <div>
               <h3 className="font-bold text-slate-700 mb-3 text-sm">{t('recep.search.title')}</h3>
               <div className="space-y-3">
                  <div>
                     <label className="block text-xs font-medium text-slate-700 mb-1">{t('recep.search.label')}</label>
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                        <input 
                           type="text" 
                           className="w-full pl-9 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition-all text-sm"
                           placeholder={t('recep.search.placeholder')}
                           value={searchQuery}
                           onChange={e => setSearchQuery(e.target.value)}
                           onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        />
                     </div>
                  </div>
                  <button onClick={handleSearch} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 text-xs">
                     <Search size={16}/> {t('recep.search.btn')}
                  </button>
               </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
               <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2"><Clock size={12}/> {t('recep.recent.title')}</h4>
               <div className="space-y-2">
                  <div className="p-3 rounded border border-slate-100 hover:bg-slate-50 cursor-pointer text-sm transition group">
                     <div className="font-bold text-slate-700 group-hover:text-indigo-600">Jan Kowalski</div>
                     <div className="text-xs text-slate-500">{t('recep.recent.cabin')} 5001 • {t('recep.recent.checkout')} 08:00</div>
                  </div>
                  <div className="p-3 rounded border border-slate-100 hover:bg-slate-50 cursor-pointer text-sm transition group">
                     <div className="font-bold text-slate-700 group-hover:text-indigo-600">Anna Nowak</div>
                     <div className="text-xs text-slate-500">{t('recep.recent.cabin')} 6012 • {t('recep.recent.wakeup')} 06:30</div>
                  </div>
               </div>
            </div>
         </div>

         {/* RIGHT COLUMN: Passenger Dossier */}
         <div className="xl:col-span-3 space-y-6 overflow-y-auto pr-2">
            {activePassenger && passengerProfile ? (
               <div className="animate-in fade-in slide-in-from-right-4">
                  {/* HEADER CARD - LOYALTY & STATUS */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 relative overflow-hidden mb-4">
                     <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                        <Crown size={140} />
                     </div>
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                        <div className="flex gap-4 items-center">
                           <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white shrink-0">
                              <User size={32}/>
                           </div>
                           <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                 <h2 className="text-2xl font-bold text-slate-800">
                                    {activePassenger.passengers[0]?.firstName || 'Brak'} {activePassenger.passengers[0]?.lastName || 'Danych'}
                                 </h2>
                                 <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${getTierColor(passengerProfile.tier)}`}>
                                    <Star size={10} className="fill-current"/> {passengerProfile.tier}
                                 </span>
                              </div>
                              <p className="text-slate-500 text-xs mt-0.5 flex gap-2 items-center">
                                 <span>{activePassenger.contactEmail}</span>
                                 <span className="text-slate-300">|</span>
                                 <span>{t('res.id_col')}: <span className="font-mono font-bold text-slate-700">{activePassenger.id}</span></span>
                                 <span className="text-slate-300">|</span>
                                 <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${activePassenger.status === BookingStatus.CHECKED_IN ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {activePassenger.status.toUpperCase()}
                                 </span>
                              </p>
                              <div className="flex gap-1.5 mt-2">
                                 {passengerProfile.tags && passengerProfile.tags.map((tag: string) => (
                                    <span key={tag} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border border-slate-200">
                                       {tag}
                                    </span>
                                 ))}
                              </div>
                           </div>
                        </div>
                        
                        {/* Points Dashboard */}
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 min-w-[180px]">
                           <div className="flex justify-between items-center mb-1.5">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">{t('recep.loyalty.points_balance')}</span>
                              <Gift size={14} className="text-purple-500"/>
                           </div>
                           <div className="text-xl font-bold text-slate-800 mb-0.5">{passengerProfile.pointsBalance} pkt</div>
                           <div className="w-full bg-slate-200 rounded-full h-1 mb-1">
                              <div className="bg-purple-500 h-1 rounded-full" style={{ width: '45%' }}></div>
                           </div>
                           <div className="text-[9px] text-slate-400 text-right">
                              {t('recep.loyalty.next_tier', { tier: 'PLATINUM', points: passengerProfile.nextTierPoints - passengerProfile.pointsBalance })}
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* TABS FOR CONTENT */}
                  <div className="flex gap-4 border-b border-slate-200 mb-6">
                     <button 
                        onClick={() => setActiveTab('PROFILE')}
                        className={`pb-3 px-2 text-sm font-bold border-b-2 transition ${activeTab === 'PROFILE' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                     >
                        {t('recep.tabs.profile')}
                     </button>
                     <button 
                        onClick={() => setActiveTab('BILLING')}
                        className={`pb-3 px-2 text-sm font-bold border-b-2 transition ${activeTab === 'BILLING' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                     >
                        {t('recep.tabs.billing')}
                     </button>
                  </div>

                  {activeTab === 'PROFILE' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left: Personal Data & Docs */}
                        <div className="space-y-6">
                           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                              <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                                 <FileText size={20} className="text-blue-500"/> {t('recep.profile.header')}
                              </h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                 <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold">{t('recep.profile.birth_date')}</p>
                                    <p className="font-medium flex items-center gap-2 mt-1">
                                       <Calendar size={14} className="text-slate-400"/> {passengerProfile.birthDate}
                                    </p>
                                 </div>
                                 <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold">{t('recep.profile.nationality')}</p>
                                    <p className="font-medium flex items-center gap-2 mt-1">
                                       <Flag size={14} className="text-slate-400"/> {passengerProfile.nationality}
                                    </p>
                                 </div>
                                 <div className="col-span-2 border-t border-dashed border-slate-200 pt-3 mt-1">
                                    <div className="flex justify-between">
                                       <div>
                                          <p className="text-xs text-slate-400 uppercase font-bold">{t('recep.profile.doc_id')}</p>
                                          <p className="font-mono font-medium mt-1">{activePassenger.passengers[0]?.documentNumber || 'Brak DOC'}</p>
                                       </div>
                                       <div className="text-right">
                                          <p className="text-xs text-slate-400 uppercase font-bold">{t('recep.profile.validity')}</p>
                                          <p className="font-medium flex items-center gap-1 text-green-600 justify-end mt-1">
                                             <ShieldCheck size={14}/> {passengerProfile.docExpiry}
                                          </p>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="col-span-2 bg-red-50 p-3 rounded border border-red-100 mt-2">
                                    <p className="text-xs text-red-500 uppercase font-bold">{t('recep.profile.ice')}</p>
                                    <p className="font-bold text-red-700 flex items-center gap-2 mt-1">
                                       <Phone size={14}/> {passengerProfile.iceContact}
                                    </p>
                                 </div>
                              </div>
                           </div>

                           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                              <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                                 <Heart size={20} className="text-red-500"/> {t('recep.pref.header')}
                              </h4>
                              <div className="flex flex-wrap gap-2 mb-4">
                                 {passengerProfile.preferences && passengerProfile.preferences.map((pref: string, idx: number) => (
                                    <span key={idx} className="bg-pink-50 text-pink-700 px-3 py-1.5 rounded-full text-xs font-bold border border-pink-100 flex items-center gap-1">
                                       {pref}
                                    </span>
                                 ))}
                              </div>
                              
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex gap-3 items-start">
                                 <FileText className="text-yellow-600 mt-0.5 flex-shrink-0" size={16}/>
                                 <div>
                                    <h4 className="font-bold text-yellow-800 text-xs uppercase mb-1">{t('recep.notes.header')}</h4>
                                    <p className="text-xs text-yellow-900 leading-relaxed">
                                       {t('recep.notes.default')}
                                    </p>
                                    <button className="text-xs font-bold text-yellow-700 underline mt-2 hover:text-yellow-900">{t('recep.notes.edit')}</button>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Right: Cabin Info */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit">
                           <div className="flex justify-between items-center mb-6">
                              <h4 className="font-bold text-slate-700 flex items-center gap-2">
                                 <Key size={20} className="text-amber-500"/> {t('recep.acc.header')}
                              </h4>
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase flex items-center gap-1">
                                 {t('recep.acc.on_board')}
                              </span>
                           </div>
                           
                           <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-6">
                              <div className="flex justify-between items-center mb-4">
                                 <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold">{t('recep.acc.current_cabin')}</p>
                                    <p className="text-xl font-bold text-slate-800">{activePassenger.cabinType}</p>
                                    <p className="text-sm text-slate-500 mt-1">{t('recep.acc.cabin_no')} <span className="font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border">5002</span> ({t('recep.acc.deck')} 5)</p>
                                 </div>
                              </div>
                              
                              <div className="pt-4 border-t border-slate-200">
                                 <div className="flex justify-between items-center">
                                    <div>
                                       <p className="text-xs font-bold text-amber-600 uppercase">{t('recep.acc.upgrade_avail')}</p>
                                       <p className="text-xs text-slate-500">Apartament LUX ({t('recep.acc.deck')} 8)</p>
                                    </div>
                                    <button 
                                       onClick={handleUpgrade}
                                       className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg text-xs font-bold shadow-md hover:from-amber-600 hover:to-amber-700 transition flex items-center gap-2"
                                    >
                                       <ArrowUpCircle size={14}/> {t('recep.acc.upgrade_btn')}
                                    </button>
                                 </div>
                              </div>
                           </div>

                           <div className="space-y-3">
                              <button 
                                 onClick={handleIssueKey}
                                 className="w-full py-3 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 text-sm font-bold text-slate-700 transition"
                              >
                                 <Key size={16}/> {t('recep.acc.duplicate_key')}
                              </button>
                              <button className="w-full py-3 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 text-sm font-bold text-slate-700 transition">
                                 <AlertCircle size={16}/> {t('recep.acc.report_issue')}
                              </button>
                           </div>
                        </div>
                     </div>
                  )}

                  {activeTab === 'BILLING' && (
                     <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-[500px]">
                        <div className="flex justify-between items-center mb-6">
                           <h4 className="font-bold text-slate-700 flex items-center gap-2">
                              <Receipt size={20} className="text-emerald-600"/> {t('recep.bill.header')}
                           </h4>
                           <span className="text-xs bg-slate-100 px-2 py-1 rounded font-mono text-slate-500 border">{t('recep.bill.acc_no')} ACC-{activePassenger.id.slice(-4)}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 space-y-3 mb-6">
                           {passengerTransactions.length > 0 ? passengerTransactions.map(tx => (
                              <div key={tx.id} className="flex justify-between items-center text-sm border-b border-slate-50 pb-3 last:border-0 hover:bg-slate-50 p-3 rounded transition">
                                 <div className="flex items-center gap-4">
                                    <div className="p-2 bg-slate-100 rounded-full text-slate-500">
                                       {getTransactionIcon(tx.location)}
                                    </div>
                                    <div>
                                       <div className="font-bold text-slate-700">{tx.item}</div>
                                       <div className="text-[10px] text-slate-400 flex gap-2 font-mono mt-0.5">
                                          <span>{tx.date}</span>
                                          <span>•</span>
                                          <span>{tx.location}</span>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <div className="font-bold text-slate-800">{tx.amount.toFixed(2)} {tx.currency}</div>
                                    <div className={`text-[10px] font-bold uppercase mt-0.5 ${tx.status === 'PAID' ? 'text-green-600' : 'text-amber-600'}`}>{tx.status}</div>
                                 </div>
                              </div>
                           )) : (
                              <div className="text-center py-12 text-slate-400 flex flex-col items-center">
                                 <ShoppingBag size={48} className="mb-4 opacity-20"/>
                                 <p className="text-sm font-medium">{t('recep.bill.empty')}</p>
                              </div>
                           )}
                        </div>

                        <div className="mt-auto bg-slate-50 p-5 rounded-xl border border-slate-200">
                           <div className="flex justify-between items-center mb-2 text-sm">
                              <span className="text-slate-500 font-medium">{t('recep.bill.total_spent')}</span>
                              <span className="font-bold text-slate-700">{totalSpent.toFixed(2)} PLN</span>
                           </div>
                           <div className="flex justify-between items-center mb-4 text-sm">
                              <span className="text-slate-500 font-medium">{t('recep.bill.unpaid')}</span>
                              <span className="font-bold text-red-600 text-lg">{unpaidBalance.toFixed(2)} PLN</span>
                           </div>
                           <div className="grid grid-cols-2 gap-3">
                              <button 
                                 onClick={() => setIsHistoryModalOpen(true)}
                                 className="py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 flex justify-center items-center gap-2 transition"
                              >
                                 <History size={14}/> {t('recep.bill.full_history')}
                              </button>
                              <button className="py-2.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 flex justify-center items-center gap-2 shadow-sm transition">
                                 <CreditCard size={14}/> {t('recep.bill.settle')}
                              </button>
                           </div>
                        </div>
                     </div>
                  )}
               </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/30">
                  <User size={64} className="mb-6 opacity-20"/>
                  <h3 className="text-lg font-bold text-slate-600">{t('recep.empty.title')}</h3>
                  <p className="text-sm max-w-xs text-center mt-2 text-slate-500">
                     {t('recep.empty.desc')}
                  </p>
                  <div className="mt-6 flex gap-2">
                     <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200 font-mono">RES-10293</span>
                     <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200 font-mono">Kowalski</span>
                  </div>
               </div>
            )}
         </div>
      </div>

      {/* FULL HISTORY MODAL (Etap 31.1 / Onboard Billing Detailed) */}
      {isHistoryModalOpen && activePassenger && (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
               {/* Modal Header */}
               <div className="bg-slate-900 text-white p-6 flex justify-between items-center shadow-lg">
                  <div className="flex items-center gap-4">
                     <div className="bg-indigo-600 p-2 rounded-lg">
                        <FileText size={24}/>
                     </div>
                     <div>
                        <h3 className="text-xl font-bold uppercase tracking-tight">Statement of Account</h3>
                        <p className="text-xs text-slate-400 font-mono">ACC-{activePassenger.id.slice(-4)} • {activePassenger.passengers[0]?.lastName || 'Brak'} {activePassenger.passengers[0]?.firstName || 'Danych'}</p>
                     </div>
                  </div>
                  <div className="flex gap-3">
                     <button onClick={() => window.print()} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition text-white">
                        <Printer size={20}/>
                     </button>
                     <button onClick={() => setIsHistoryModalOpen(false)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition text-white">
                        <X size={20}/>
                     </button>
                  </div>
               </div>

               {/* Modal Content */}
               <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
                  <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden mb-8">
                     <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                        <div className="p-6">
                           <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Informacje o rejsie</p>
                           <p className="font-bold text-slate-800">m/f Polonia</p>
                           <p className="text-sm text-slate-500">Route: {activePassenger.routeId}</p>
                           <p className="text-sm text-slate-500">Date: {activePassenger.bookingDate}</p>
                        </div>
                        <div className="p-6">
                           <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Zakwaterowanie</p>
                           <p className="font-bold text-slate-800">Cabin: 5002</p>
                           <p className="text-sm text-slate-500">Class: Premium Flex</p>
                           <p className="text-sm text-slate-500">Loyalty: {passengerProfile.tier}</p>
                        </div>
                        <div className="p-6 bg-slate-50/50">
                           <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Podsumowanie salda</p>
                           <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-slate-600">Suma transakcji:</span>
                              <span className="font-bold text-slate-800">{totalSpent.toFixed(2)} PLN</span>
                           </div>
                           <div className="flex justify-between items-center text-red-600 font-black">
                              <span className="text-sm uppercase">Do zapłaty:</span>
                              <span className="text-xl">{unpaidBalance.toFixed(2)} PLN</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Transaction Table */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                     <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                        <h4 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                           <LayoutDashboard size={16}/> Szczegóły Transakcji
                        </h4>
                        <div className="text-[10px] font-bold text-slate-400">WSZYSTKIE CENY BRUTTO (8/23% VAT)</div>
                     </div>
                     <table className="w-full text-left text-sm">
                        <thead className="bg-white text-slate-500 uppercase text-[10px] font-black border-b border-slate-200">
                           <tr>
                              <th className="p-4">Czas / Lokalizacja</th>
                              <th className="p-4">Nazwa Pozycji</th>
                              <th className="p-4">Typ Płatności</th>
                              <th className="p-4 text-center">VAT</th>
                              <th className="p-4 text-right">Kwota</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {passengerTransactions.map(tx => (
                              <tr key={tx.id} className="hover:bg-slate-50 transition">
                                 <td className="p-4">
                                    <div className="flex items-center gap-3">
                                       <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                          {getTransactionIcon(tx.location)}
                                       </div>
                                       <div>
                                          <div className="font-bold text-slate-800">{tx.location}</div>
                                          <div className="text-xs text-slate-400 font-mono">{tx.date}</div>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="p-4">
                                    <div className="font-medium text-slate-700">{tx.item}</div>
                                    <div className="text-[10px] text-slate-400 font-mono">ID: {tx.id}</div>
                                 </td>
                                 <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold border uppercase ${
                                       tx.status === 'PAID' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                                    }`}>
                                       {tx.status === 'PAID' ? 'Karta / Gotówka' : 'Rachunek Pokładowy'}
                                    </span>
                                 </td>
                                 <td className="p-4 text-center font-mono text-slate-400">
                                    {tx.location === 'RESTAURANT' ? '8%' : '23%'}
                                 </td>
                                 <td className="p-4 text-right font-black text-slate-800">
                                    {tx.amount.toFixed(2)} {tx.currency}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                        <tfoot className="bg-slate-50/50 border-t border-slate-200 font-black">
                           <tr>
                              <td colSpan={4} className="p-4 text-right text-slate-500 uppercase text-[10px]">SUMA DO ROZLICZENIA:</td>
                              <td className="p-4 text-right text-lg text-red-600 font-black">{unpaidBalance.toFixed(2)} PLN</td>
                           </tr>
                        </tfoot>
                     </table>
                  </div>

                  <div className="mt-8 flex gap-4 items-center p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-800">
                     <Info size={20} className="shrink-0"/>
                     <p className="text-sm">Wszystkie wydatki obciążające rachunek pokładowy muszą zostać uregulowane najpóźniej na 30 minut przed dotarciem do portu docelowego.</p>
                  </div>
               </div>

               {/* Modal Footer */}
               <div className="p-6 bg-white border-t border-slate-200 flex justify-end gap-3 rounded-b-2xl shadow-inner">
                  <button onClick={() => setIsHistoryModalOpen(false)} className="px-6 py-2.5 border border-slate-300 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition">
                     Zamknij
                  </button>
                  <button className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition flex items-center gap-2">
                     <Download size={18}/> Pobierz PDF
                  </button>
                  <button className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition flex items-center gap-2">
                     <CreditCard size={18}/> Rozlicz Teraz
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default ReceptionModule;
