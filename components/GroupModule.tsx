
import React, { useState } from 'react';
import { Users, Plus, Calendar, Ship, FileText, CheckCircle, Phone, Edit, Trash2, Save, UserPlus, Grid, Upload, FileSpreadsheet, Download, RefreshCw, ArrowLeft, DollarSign, CreditCard, Ticket, Utensils, Send, Bed, Info, ChevronRight, UserCheck } from 'lucide-react';
import { MOCK_GROUPS, MOCK_ROUTES, MOCK_CATERING_SUMMARIES } from '../services/mockData';
import { GroupBooking, CabinType, GroupPassenger, GroupPayment, CateringSummary } from '../types';
import { useTranslation } from '../i18n';

const GroupModule: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'LIST' | 'CREATE' | 'IMPORTS' | 'DETAILS' | 'LOGISTICS'>('LIST');
  
  // Rozszerzone dane testowe dla lepszej wizualizacji typów kabin
  const [groups, setGroups] = useState<GroupBooking[]>([
    { 
      id: 'GRP-2025-001', 
      name: 'Konferencja TechMors', 
      routeId: 'R001', 
      departureDate: '2025-05-22', 
      paxCount: 28, 
      status: 'CONFIRMED', 
      totalPrice: 15400, 
      cabinAllocation: [
        { type: CabinType.LUX, count: 4 },
        { type: CabinType.OUTSIDE_2, count: 10 }
      ], 
      passengers: Array(12).fill({}), // Symulacja częściowego wypełnienia
      payments: [], 
      leaderName: 'Marek Web', 
      leaderPhone: '+48 500 100 200' 
    },
    { 
      id: 'GRP-2025-002', 
      name: 'Wycieczka Szkolna - SP 12', 
      routeId: 'R003', 
      departureDate: '2025-05-24', 
      paxCount: 52, 
      status: 'PAID', 
      totalPrice: 8900, 
      cabinAllocation: [
        { type: CabinType.INSIDE_4, count: 13 }
      ], 
      passengers: Array(52).fill({}), // Pełna lista
      payments: [], 
      leaderName: 'mgr Anna Nowak', 
      leaderPhone: '+48 600 200 300' 
    },
    { 
      id: 'GRP-2025-003', 
      name: 'Klub Seniora "Złoty Wiek"', 
      routeId: 'R101', 
      departureDate: '2025-06-02', 
      paxCount: 15, 
      status: 'OFFER', 
      totalPrice: 4200, 
      cabinAllocation: [
        { type: CabinType.INSIDE_2, count: 8 }
      ], 
      passengers: [], 
      payments: [], 
      leaderName: 'Jan Kowalski', 
      leaderPhone: '+48 700 800 900' 
    }
  ]);

  const [selectedGroup, setSelectedGroup] = useState<GroupBooking | null>(null);
  const [cateringSummaries, setCateringSummaries] = useState<CateringSummary[]>(MOCK_CATERING_SUMMARIES);
  const [detailTab, setDetailTab] = useState<'OVERVIEW' | 'ROOMING_LIST' | 'FINANCE'>('OVERVIEW');

  const [newGroup, setNewGroup] = useState<Partial<GroupBooking>>({
    name: '',
    paxCount: 0,
    status: 'OFFER',
    cabinAllocation: [],
    passengers: [],
    payments: []
  });

  const [newPax, setNewPax] = useState<Partial<GroupPassenger>>({
     firstName: '', lastName: '', birthDate: '', nationality: 'PL', documentNumber: '', cabinType: CabinType.INSIDE_2
  });

  const getCabinBadgeStyle = (type: CabinType) => {
    switch(type) {
      case CabinType.LUX: return 'bg-amber-50 text-amber-700 border-amber-200';
      case CabinType.OUTSIDE_2:
      case CabinType.OUTSIDE_4: return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const handleCreateGroup = () => {
    if (!newGroup.name || !newGroup.routeId) return;
    const group: GroupBooking = {
      ...newGroup as GroupBooking,
      id: `GRP-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
      status: 'OFFER',
      totalPrice: 0,
      passengers: [],
      payments: []
    };
    setGroups([...groups, group]);
    setActiveTab('LIST');
  };

  const handleSelectGroup = (group: GroupBooking) => {
     setSelectedGroup(group);
     setActiveTab('DETAILS');
     setDetailTab('OVERVIEW');
  };

  const handleAddCabin = (type: CabinType, count: number) => {
    const currentAllocation = newGroup.cabinAllocation || [];
    const existing = currentAllocation.find(c => c.type === type);
    if (existing) {
       setNewGroup({
         ...newGroup,
         cabinAllocation: currentAllocation.map(c => c.type === type ? { ...c, count: c.count + count } : c)
       });
    } else {
       setNewGroup({
         ...newGroup,
         cabinAllocation: [...currentAllocation, { type, count }]
       });
    }
  };

  const handleAddPassenger = () => {
     if (!selectedGroup || !newPax.lastName) return;
     const passenger: GroupPassenger = {
        ...newPax as GroupPassenger,
        id: `GP-${Date.now()}`
     };
     const updatedGroup = {
        ...selectedGroup,
        passengers: [...selectedGroup.passengers, passenger]
     };
     setSelectedGroup(updatedGroup);
     setGroups(groups.map(g => g.id === selectedGroup.id ? updatedGroup : g));
     setNewPax({ firstName: '', lastName: '', birthDate: '', nationality: 'PL', documentNumber: '', cabinType: CabinType.INSIDE_2 });
  };

  const handleRemovePassenger = (id: string) => {
     if (!selectedGroup) return;
     const updatedGroup = {
        ...selectedGroup,
        passengers: selectedGroup.passengers.filter(p => p.id !== id)
     };
     setSelectedGroup(updatedGroup);
     setGroups(groups.map(g => g.id === selectedGroup.id ? updatedGroup : g));
  };

  const handleRegisterPayment = () => {
     if (!selectedGroup) return;
     const payment: GroupPayment = {
        id: `PAY-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        amount: 5000, 
        method: 'TRANSFER',
        type: 'FINAL'
     };
     const updatedGroup = {
        ...selectedGroup,
        payments: [...selectedGroup.payments, payment],
        status: 'PAID' as const
     };
     setSelectedGroup(updatedGroup);
     setGroups(groups.map(g => g.id === selectedGroup.id ? updatedGroup : g));
     alert('Płatność została zarejestrowana.');
  };

  const handleIssueTicket = () => {
     alert('Bilet grupowy został wygenerowany i wysłany do lidera.');
  };

  const handleImportFile = () => {
     alert('Zaimportowano listę pasażerów z pliku CSV. 45 osób dodanych do listy.');
  };

  const handleTourOperatorSync = () => {
     alert('Pobrano dane z systemu touroperatorskiego. Zaktualizowano 3 rezerwacje.');
  };

  const handleSendToShip = (id: string) => {
     setCateringSummaries(prev => prev.map(s => s.id === id ? { ...s, status: 'SENT_TO_SHIP' } : s));
     alert('Zamówienie gastronomiczne wysłane na statek.');
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 font-sans">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-10 overflow-x-auto">
        <div className="flex-shrink-0 mr-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-blue-600" /> {t('groups.list.title')}
          </h2>
          <p className="text-xs text-slate-500">{t('groups.list.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('LIST')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'LIST' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {t('groups.tabs.list')}
          </button>
          <button 
            onClick={() => setActiveTab('CREATE')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'CREATE' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {t('groups.tabs.create')}
          </button>
          <button 
            onClick={() => setActiveTab('IMPORTS')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'IMPORTS' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {t('groups.tabs.imports')}
          </button>
          <button 
            onClick={() => setActiveTab('LOGISTICS')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'LOGISTICS' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {t('groups.tabs.logistics')}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'LIST' && (
          <div className="max-w-7xl mx-auto grid grid-cols-1 gap-6">
             {groups.map(group => {
               const roomingProgress = (group.passengers.length / group.paxCount) * 100;
               return (
                 <div key={group.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                   <div className="p-6 flex flex-col lg:flex-row gap-8">
                      {/* Left: Basic Info */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                           <div className="flex items-center gap-3">
                              <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-200">
                                <Users size={24} />
                              </div>
                              <div>
                                 <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{group.name}</h3>
                                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Ref: {group.id}</div>
                              </div>
                           </div>
                           <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${
                             group.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                             group.status === 'PAID' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                             'bg-amber-50 text-amber-700 border-amber-100'
                           }`}>
                             {group.status}
                           </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-6">
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-tighter">{t('book.date')}</p>
                              <p className="text-sm font-bold text-slate-700 flex items-center gap-2"><Calendar size={14} className="text-blue-500"/> {group.departureDate}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-tighter">Trasa / Linia</p>
                              <p className="text-sm font-bold text-slate-700 flex items-center gap-2"><Ship size={14} className="text-blue-500"/> {group.routeId}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-tighter">{t('groups.card.pax_count')}</p>
                              <p className="text-sm font-bold text-slate-700 flex items-center gap-2"><Users size={14} className="text-blue-500"/> {group.paxCount} os.</p>
                           </div>
                        </div>

                        {/* Rooming Progress Bar */}
                        <div className="mt-8">
                           <div className="flex justify-between items-end mb-2">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                 <UserCheck size={12} className="text-emerald-500"/> Status Rooming Listy
                              </span>
                              <span className="text-[10px] font-black text-slate-700">{group.passengers.length} / {group.paxCount} pasażerów</span>
                           </div>
                           <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden shadow-inner">
                              <div className={`h-full transition-all duration-1000 ${roomingProgress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${roomingProgress}%` }}></div>
                           </div>
                        </div>
                      </div>

                      {/* Right: Cabin Types Structure */}
                      <div className="lg:w-80 bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
                         <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest flex items-center gap-2 border-b border-slate-100 pb-2">
                            <Bed size={14} className="text-indigo-500"/> Struktura Zakwaterowania
                         </h4>
                         <div className="space-y-2.5">
                            {group.cabinAllocation.map((cabin, idx) => (
                              <div key={idx} className={`flex items-center justify-between p-2.5 rounded-xl border-2 transition-all ${getCabinBadgeStyle(cabin.type as CabinType)}`}>
                                 <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 bg-white/50 rounded-lg shadow-sm">
                                       <Bed size={14} />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-tighter">{cabin.type}</span>
                                 </div>
                                 <span className="text-sm font-black bg-white/40 px-2.5 py-0.5 rounded-lg border border-current/10">
                                    {cabin.count} <span className="text-[9px] font-bold opacity-70">szt.</span>
                                 </span>
                              </div>
                            ))}
                            {group.cabinAllocation.length === 0 && (
                               <div className="py-8 text-center">
                                  <Info size={24} className="mx-auto text-slate-300 mb-2 opacity-50"/>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase">{t('groups.card.no_cabins')}</p>
                               </div>
                            )}
                         </div>

                         <div className="mt-6 pt-4 border-t border-slate-200/60 flex justify-between items-center text-slate-500">
                            <span className="text-[10px] font-black uppercase tracking-widest">Suma łóżek:</span>
                            <span className="text-sm font-black text-slate-700">
                               {group.cabinAllocation.reduce((acc, c) => {
                                  const seats = c.type.includes('4') ? 4 : c.type.includes('2') ? 2 : 1;
                                  return acc + (c.count * seats);
                               }, 0)} os.
                            </span>
                         </div>
                      </div>

                      {/* Actions Sidebar */}
                      <div className="lg:w-48 flex flex-col justify-between border-l border-slate-100 lg:pl-6">
                         <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cena Całkowita</p>
                            <h4 className="text-2xl font-black text-slate-900 tracking-tighter">{group.totalPrice.toLocaleString()} <span className="text-xs font-bold text-slate-400">PLN</span></h4>
                         </div>

                         <div className="space-y-2.5 mt-8 lg:mt-0">
                            <button 
                               onClick={() => handleSelectGroup(group)}
                               className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 active:scale-95"
                            >
                               <Edit size={14}/> Zarządzaj Grupą
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 py-3 bg-white border-2 border-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                               <FileText size={14}/> Drukuj PDF
                            </button>
                         </div>
                      </div>
                   </div>
                 </div>
               );
             })}
          </div>
        )}

        {activeTab === 'DETAILS' && selectedGroup && (
           <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
              <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-start">
                 <div className="flex items-center gap-4">
                    <button onClick={() => setActiveTab('LIST')} className="p-2 hover:bg-slate-200 rounded-full">
                       <ArrowLeft size={20}/>
                    </button>
                    <div>
                       <h2 className="text-2xl font-bold text-slate-800">{selectedGroup.name}</h2>
                       <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                          <span className="font-mono bg-white border px-2 py-0.5 rounded">{selectedGroup.id}</span>
                          <span>{selectedGroup.departureDate}</span>
                          <span>•</span>
                          <span>{selectedGroup.routeId}</span>
                       </div>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <button className={`px-4 py-2 rounded-lg text-sm font-bold border transition ${detailTab === 'OVERVIEW' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`} onClick={() => setDetailTab('OVERVIEW')}>{t('groups.details.tab.overview')}</button>
                    <button className={`px-4 py-2 rounded-lg text-sm font-bold border transition ${detailTab === 'ROOMING_LIST' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`} onClick={() => setDetailTab('ROOMING_LIST')}>{t('groups.details.tab.rooming')}</button>
                    <button className={`px-4 py-2 rounded-lg text-sm font-bold border transition ${detailTab === 'FINANCE' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`} onClick={() => setDetailTab('FINANCE')}>{t('groups.details.tab.finance')}</button>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                 {detailTab === 'OVERVIEW' && (
                    <div className="space-y-6">
                       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                          <div className="flex justify-between items-center mb-4">
                             <h3 className="font-bold text-slate-800 flex items-center gap-2"><Edit size={18}/> {t('groups.details.edit_title')}</h3>
                             <button className="text-blue-600 text-sm font-bold hover:underline">{t('groups.details.save_changes')}</button>
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                             <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('groups.details.group_name')}</label>
                                <input type="text" defaultValue={selectedGroup.name} className="w-full border p-2 rounded bg-white"/>
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('book.date')}</label>
                                <input type="date" defaultValue={selectedGroup.departureDate} className="w-full border p-2 rounded bg-white"/>
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('groups.card.pax_count')}</label>
                                <input type="number" defaultValue={selectedGroup.paxCount} className="w-full border p-2 rounded bg-white"/>
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('groups.card.leader')}</label>
                                <input type="text" defaultValue={selectedGroup.leaderName} className="w-full border p-2 rounded bg-white"/>
                             </div>
                          </div>
                       </div>

                       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                          <h3 className="font-bold text-slate-800 mb-4">{t('groups.details.resources_title')}</h3>
                          <div className="space-y-2">
                             {selectedGroup.cabinAllocation.map((alloc, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-100">
                                   <span className="font-medium text-slate-700">{alloc.type}</span>
                                   <div className="flex items-center gap-4">
                                      <input type="number" defaultValue={alloc.count} className="w-16 border rounded p-1 text-center bg-white" />
                                      <button className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                                   </div>
                                </div>
                             ))}
                             <button className="mt-2 text-sm text-blue-600 font-bold hover:underline">{t('groups.details.add_cabin_type')}</button>
                          </div>
                       </div>
                    </div>
                 )}

                 {detailTab === 'ROOMING_LIST' && (
                    <div className="space-y-6">
                       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
                             <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <UserPlus size={18} className="text-emerald-600"/> {t('groups.rooming.add_pax')}
                             </h3>
                             <div className="space-y-4">
                                <input 
                                   type="text" 
                                   placeholder={t('groups.rooming.first_name')} 
                                   className="w-full border p-2 rounded bg-white text-sm"
                                   value={newPax.firstName}
                                   onChange={e => setNewPax({...newPax, firstName: e.target.value})}
                                />
                                <input 
                                   type="text" 
                                   placeholder={t('groups.rooming.last_name')} 
                                   className="w-full border p-2 rounded bg-white text-sm"
                                   value={newPax.lastName}
                                   onChange={e => setNewPax({...newPax, lastName: e.target.value})}
                                />
                                <div className="grid grid-cols-2 gap-2">
                                   <input 
                                      type="date" 
                                      className="w-full border p-2 rounded bg-white text-sm"
                                      value={newPax.birthDate}
                                      onChange={e => setNewPax({...newPax, birthDate: e.target.value})}
                                   />
                                   <input 
                                      type="text" 
                                      placeholder={t('groups.rooming.doc_number')} 
                                      className="w-full border p-2 rounded bg-white text-sm"
                                      value={newPax.documentNumber}
                                      onChange={e => setNewPax({...newPax, documentNumber: e.target.value})}
                                   />
                                </div>
                                <div>
                                   <label className="block text-xs font-bold text-slate-500 mb-1">{t('groups.rooming.cabin_assign')}</label>
                                   <select 
                                      className="w-full border p-2 rounded bg-white text-sm"
                                      value={newPax.cabinType}
                                      onChange={e => setNewPax({...newPax, cabinType: e.target.value as CabinType})}
                                   >
                                      {selectedGroup.cabinAllocation.map(c => <option key={c.type} value={c.type}>{c.type}</option>)}
                                   </select>
                                </div>
                                <button 
                                   onClick={handleAddPassenger}
                                   className="w-full bg-emerald-600 text-white py-2 rounded font-bold hover:bg-emerald-700"
                                >
                                   {t('groups.rooming.add_btn')}
                                </button>
                             </div>
                             
                             <div className="mt-6 pt-6 border-t border-slate-100">
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">{t('groups.rooming.mass_import')}</h4>
                                <button className="w-full border border-dashed border-slate-300 py-3 rounded text-slate-500 text-sm hover:bg-slate-50 flex justify-center items-center gap-2" onClick={handleImportFile}>
                                   <Upload size={16}/> {t('groups.rooming.excel_btn')}
                                </button>
                             </div>
                          </div>

                          <div className="lg:col-span-2 space-y-4">
                             {selectedGroup.cabinAllocation.map(alloc => {
                                const passengersInType = selectedGroup.passengers.filter(p => p.cabinType === alloc.type);
                                const capacity = alloc.count * (alloc.type === CabinType.OUTSIDE_4 ? 4 : alloc.type === CabinType.INSIDE_2 ? 2 : 1);
                                
                                return (
                                   <div key={alloc.type} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                      <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                                         <span className="font-bold text-slate-700">{alloc.type}</span>
                                         <span className="text-xs bg-white border px-2 py-1 rounded text-slate-500">
                                            {t('groups.rooming.occupied')}: {passengersInType.length} / {capacity} {t('groups.rooming.seats')}
                                         </span>
                                      </div>
                                      <div className="divide-y divide-slate-100">
                                         {passengersInType.length > 0 ? passengersInType.map(p => (
                                            <div key={p.id} className="p-3 flex justify-between items-center hover:bg-slate-50">
                                               <div className="text-sm">
                                                  <span className="font-bold text-slate-800">{p.lastName} {p.firstName}</span>
                                                  <span className="text-slate-400 mx-2">|</span>
                                                  <span className="text-slate-500 font-mono text-xs">{p.birthDate} • {p.documentNumber}</span>
                                               </div>
                                               <button onClick={() => handleRemovePassenger(p.id)} className="text-red-400 hover:text-red-600">
                                                  <Trash2 size={16}/>
                                               </button>
                                            </div>
                                         )) : (
                                            <div className="p-4 text-center text-slate-400 text-xs italic">{t('groups.rooming.empty_list')}</div>
                                         )}
                                      </div>
                                   </div>
                                )
                             })}
                          </div>
                       </div>
                    </div>
                 )}

                 {detailTab === 'FINANCE' && (
                    <div className="space-y-6">
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                             <p className="text-xs font-bold text-slate-400 uppercase mb-1">{t('groups.finance.total_cost')}</p>
                             <h3 className="text-3xl font-bold text-slate-800">{selectedGroup.totalPrice.toLocaleString()} PLN</h3>
                          </div>
                          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                             <p className="text-xs font-bold text-slate-400 uppercase mb-1">{t('groups.finance.paid')}</p>
                             <h3 className="text-3xl font-bold text-emerald-600">
                                {selectedGroup.payments.reduce((acc, p) => acc + p.amount, 0).toLocaleString()} PLN
                             </h3>
                          </div>
                          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                             <p className="text-xs font-bold text-slate-400 uppercase mb-1">{t('groups.finance.to_pay')}</p>
                             <h3 className="text-3xl font-bold text-red-600">
                                {(selectedGroup.totalPrice - selectedGroup.payments.reduce((acc, p) => acc + p.amount, 0)).toLocaleString()} PLN
                             </h3>
                          </div>
                       </div>

                       <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                          <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-700">{t('groups.finance.history')}</div>
                          <table className="w-full text-left text-sm">
                             <thead className="bg-white text-slate-500 text-xs uppercase">
                                <tr>
                                   <th className="p-4">{t('common.date')}</th>
                                   <th className="p-4">Typ</th>
                                   <th className="p-4">Metoda</th>
                                   <th className="p-4 text-right">Kwota</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-100">
                                {selectedGroup.payments.map(pay => (
                                   <tr key={pay.id}>
                                      <td className="p-4 text-slate-600">{pay.date}</td>
                                      <td className="p-4"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold">{pay.type}</span></td>
                                      <td className="p-4 text-slate-600">{pay.method}</td>
                                      <td className="p-4 text-right font-bold text-emerald-600">{pay.amount.toLocaleString()} PLN</td>
                                   </tr>
                                ))}
                                {selectedGroup.payments.length === 0 && (
                                   <tr><td colSpan={4} className="p-8 text-center text-slate-400">{t('groups.finance.no_payments')}</td></tr>
                                )}
                             </tbody>
                          </table>
                       </div>

                       <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
                          <button 
                             onClick={handleRegisterPayment}
                             className="px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-50 flex items-center gap-2"
                          >
                             <CreditCard size={18}/> {t('groups.finance.reg_btn')}
                          </button>
                          <button 
                             onClick={handleIssueTicket}
                             disabled={selectedGroup.totalPrice > selectedGroup.payments.reduce((acc, p) => acc + p.amount, 0)}
                             className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                             <Ticket size={18}/> {t('groups.finance.ticket_btn')}
                          </button>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        )}

        {activeTab === 'CREATE' && (
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="bg-slate-50 p-4 border-b border-slate-200">
                <h3 className="font-bold text-slate-700">Kreator Rezerwacji Grupowej</h3>
             </div>
             
             <div className="p-8 space-y-8">
                <div>
                   <h4 className="text-sm font-bold text-blue-600 uppercase mb-4 border-b pb-2">1. Dane Podstawowe</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="col-span-2">
                         <label className="block text-sm font-medium text-slate-700 mb-1">{t('groups.details.group_name')}</label>
                         <input 
                           type="text" 
                           className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
                           placeholder="np. Wycieczka Szkolna..."
                           value={newGroup.name}
                           onChange={e => setNewGroup({...newGroup, name: e.target.value})}
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Trasa</label>
                         <select 
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            onChange={e => setNewGroup({...newGroup, routeId: e.target.value})}
                         >
                            <option value="">Wybierz rejs...</option>
                            {MOCK_ROUTES.map(r => <option key={r.id} value={r.id}>{r.origin} - {r.destination}</option>)}
                         </select>
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
                         <input type="date" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white" />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">{t('groups.card.agency')}</label>
                         <input type="text" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white" placeholder="Opcjonalnie" />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">{t('groups.card.pax_count')} (szacunkowa)</label>
                         <input 
                            type="number" 
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
                            value={newGroup.paxCount}
                            onChange={e => setNewGroup({...newGroup, paxCount: parseInt(e.target.value) || 0})}
                         />
                      </div>
                   </div>
                </div>

                <div>
                   <h4 className="text-sm font-bold text-blue-600 uppercase mb-4 border-b pb-2">2. {t('groups.details.resources_title')}</h4>
                   <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="flex gap-2 mb-4">
                         {Object.values(CabinType).filter(t => t !== CabinType.NONE).map(type => (
                            <button 
                              key={type}
                              onClick={() => handleAddCabin(type, 1)}
                              className="px-3 py-1 bg-white border border-slate-300 rounded text-xs font-medium hover:bg-blue-50 hover:border-blue-300 transition"
                            >
                               + {type}
                            </button>
                         ))}
                      </div>
                      
                      <div className="space-y-2">
                         {newGroup.cabinAllocation?.length === 0 ? (
                            <p className="text-sm text-slate-400 italic">Brak dodanych kabin. Pasażerowie zostaną przypisani jako "Deck".</p>
                         ) : (
                            newGroup.cabinAllocation?.map((alloc, idx) => (
                               <div key={idx} className="flex justify-between items-center bg-white p-2 rounded border border-slate-200">
                                  <span className="text-sm font-medium">{alloc.type}</span>
                                  <div className="flex items-center gap-3">
                                     <span className="font-bold text-slate-700">{alloc.count} szt.</span>
                                     <button className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                                  </div>
                               </div>
                            ))
                         )}
                      </div>
                   </div>
                </div>

                <div className="pt-6 border-t border-slate-200 flex justify-end gap-4">
                   <button onClick={() => setActiveTab('LIST')} className="px-6 py-2 text-slate-600 hover:text-slate-800 font-medium">{t('common.cancel')}</button>
                   <button onClick={handleCreateGroup} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2">
                      <Save size={18} /> {t('groups.details.save_changes')}
                   </button>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'IMPORTS' && (
           <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                       <FileSpreadsheet size={24} className="text-emerald-600"/> {t('groups.imports.file_title')}
                    </h3>
                    <p className="text-sm text-slate-500 mb-6">{t('groups.imports.file_desc')}</p>
                    
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 bg-slate-50 hover:bg-blue-50 hover:border-blue-400 transition cursor-pointer" onClick={handleImportFile}>
                       <Upload size={32} className="mb-2"/>
                       <span className="font-medium text-sm">{t('groups.imports.drop_zone')}</span>
                       <span className="text-xs mt-1">{t('groups.imports.max_size')}</span>
                    </div>

                    <div className="mt-6 flex justify-between items-center text-xs text-slate-500">
                       <button className="flex items-center gap-1 hover:text-blue-600"><Download size={12}/> {t('groups.imports.csv_template')}</button>
                       <button className="flex items-center gap-1 hover:text-blue-600"><Download size={12}/> {t('groups.imports.excel_template')}</button>
                    </div>
                 </div>

                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                       <RefreshCw size={24} className="text-blue-600"/> {t('groups.imports.b2b_title')}
                    </h3>
                    <p className="text-sm text-slate-500 mb-6">{t('groups.imports.b2b_desc')}</p>

                    <div className="space-y-4">
                       <div className="border border-slate-200 rounded-lg p-3 flex justify-between items-center">
                          <span className="text-sm font-bold text-slate-700">TUI Poland API</span>
                          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">POŁĄCZONO</span>
                       </div>
                       <div className="border border-slate-200 rounded-lg p-3 flex justify-between items-center">
                          <span className="text-sm font-bold text-slate-700">Itaka Sync</span>
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold">ROZŁĄCZONO</span>
                       </div>
                    </div>

                    <button 
                       onClick={handleTourOperatorSync}
                       className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                       <RefreshCw size={16}/> {t('groups.imports.sync_now')}
                    </button>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'LOGISTICS' && (
           <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <div className="flex justify-between items-center mb-6">
                    <div>
                       <h3 className="font-bold text-slate-800 flex items-center gap-2">
                          <Utensils size={24} className="text-amber-600"/> {t('groups.logistics.catering_title')}
                       </h3>
                       <p className="text-sm text-slate-500">{t('groups.logistics.catering_desc')}</p>
                    </div>
                    <div className="flex gap-2">
                       <input type="date" className="border p-2 rounded text-sm bg-white" />
                       <button className="bg-slate-100 text-slate-700 px-3 py-2 rounded text-sm font-bold hover:bg-slate-200">{t('groups.logistics.filter_btn')}</button>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {cateringSummaries.map(summary => (
                       <div key={summary.id} className="border border-slate-200 rounded-xl p-6 bg-slate-50">
                          <div className="flex justify-between items-start mb-4">
                             <div>
                                <h4 className="font-bold text-lg text-slate-800">{summary.routeId}</h4>
                                <div className="text-sm text-slate-500">{summary.date}</div>
                             </div>
                             <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                summary.status === 'SENT_TO_SHIP' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                             }`}>
                                {summary.status === 'SENT_TO_SHIP' ? t('groups.logistics.status.sent') : t('groups.logistics.status.draft')}
                             </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-6">
                             <div className="bg-white p-3 rounded border border-slate-200">
                                <div className="text-xs text-slate-400 uppercase font-bold">{t('groups.logistics.groups_count')}</div>
                                <div className="text-xl font-bold text-slate-800">{summary.totalGroups}</div>
                             </div>
                             <div className="bg-white p-3 rounded border border-slate-200">
                                <div className="text-xs text-slate-400 uppercase font-bold">{t('groups.logistics.pax_total')}</div>
                                <div className="text-xl font-bold text-slate-800">{summary.totalPax}</div>
                             </div>
                          </div>

                          <div className="space-y-2 text-sm mb-6">
                             <div className="flex justify-between border-b border-slate-200 pb-1">
                                <span className="text-slate-600">{t('groups.logistics.breakfast')}:</span>
                                <span className="font-bold">{summary.breakfasts}</span>
                             </div>
                             <div className="flex justify-between border-b border-slate-200 pb-1">
                                <span className="text-slate-600">{t('groups.logistics.lunch')}:</span>
                                <span className="font-bold">{summary.lunches}</span>
                             </div>
                             <div className="flex justify-between border-b border-slate-200 pb-1">
                                <span className="text-slate-600">{t('groups.logistics.dinner')}:</span>
                                <span className="font-bold">{summary.dinners}</span>
                             </div>
                             <div className="flex justify-between pt-1">
                                <span className="text-amber-600 font-bold">{t('groups.logistics.special_diets')}:</span>
                                <span className="font-bold text-amber-600">{summary.specialDiets}</span>
                             </div>
                          </div>

                          <div className="flex justify-end gap-2">
                             <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 flex items-center gap-2">
                                <FileText size={16}/> PDF
                             </button>
                             {summary.status !== 'SENT_TO_SHIP' && (
                                <button 
                                   onClick={() => handleSendToShip(summary.id)}
                                   className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2"
                                >
                                   <Send size={16}/> {t('groups.logistics.send_btn')}
                                </button>
                             )}
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default GroupModule;
