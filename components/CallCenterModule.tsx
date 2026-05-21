import React, { useState, useMemo } from 'react';
import { 
  PhoneCall, Search, User, CreditCard, Ticket, Clock, CheckCircle, Calendar, 
  Ship, MapPin, AlertCircle, FileText, Send, X, ThumbsDown, ThumbsUp, 
  History as HistoryIcon,
  // Added missing Award, ChevronRight, and Plus icons to imports
  DollarSign, Archive, LayoutList, Users, TrendingUp, Briefcase, Coffee, 
  Palmtree, Filter, Star, XCircle, Tag, MessageSquare, Mail, Bell, ShieldCheck, Zap, Edit, Gift,
  Award, ChevronRight, Plus
} from 'lucide-react';
import { MOCK_CLIENT, MOCK_RESERVATIONS, MOCK_CARNETS, MOCK_COMPLAINTS, MOCK_LOYALTY_MEMBERS } from '../services/mockData';
import { Carnet, ClientProfile, Reservation, BookingStatus, Complaint, ComplaintStatus, ComplaintCategory, LoyaltyTier } from '../types';

// Extended client type for segmentation logic
interface SegmentedClient extends ClientProfile {
  purpose: 'BIZNES' | 'WYPOCZYNEK' | 'PRACA';
  spendingLevel: 'WYSOKIE' | 'ŚREDNIE' | 'NISKIE';
  lastTrip: string;
  totalTrips: number;
  ltv: number; // Lifetime Value
  avgTicket: number;
  tags: string[];
  marketingAgreements: { email: boolean, sms: boolean, profiling: boolean };
}

const CallCenterModule: React.FC = () => {
  // Call Center State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [identifiedClient, setIdentifiedClient] = useState<SegmentedClient | null>(null);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CARNETS' | 'COMPLAINTS' | 'CLIENTS'>('CLIENTS');
  const [carnets, setCarnets] = useState<Carnet[]>([]);
  
  // Clients Tab State
  const [clientSearch, setClientSearch] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<'ALL' | 'BIZNES' | 'WYPOCZYNEK' | 'PRACA'>('ALL');
  const [spendingFilter, setSpendingFilter] = useState<'ALL' | 'WYSOKIE' | 'ŚREDNIE' | 'NISKIE'>('ALL');

  // Complaints State
  const [complaints, setComplaints] = useState<Complaint[]>(MOCK_COMPLAINTS);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [newComplaint, setNewComplaint] = useState<Partial<Complaint>>({ category: ComplaintCategory.SERVICE, description: '' });
  const [isNewComplaintModalOpen, setIsNewComplaintModalOpen] = useState(false);

  // Mock Segmented Clients Data - Simulation of CRM data processing
  const segmentedClients: SegmentedClient[] = useMemo(() => {
    return MOCK_LOYALTY_MEMBERS.map((m, idx) => ({
      ...m,
      phone: '+48 600' + (123456 + idx),
      points: m.pointsBalance,
      bookings: [],
      purpose: idx % 3 === 0 ? 'BIZNES' : idx % 3 === 1 ? 'WYPOCZYNEK' : 'PRACA',
      spendingLevel: m.tier === LoyaltyTier.PLATINUM ? 'WYSOKIE' : m.tier === LoyaltyTier.GOLD ? 'ŚREDNIE' : 'NISKIE',
      lastTrip: '2023-10-10',
      totalTrips: idx + 5,
      ltv: (idx + 5) * 450,
      avgTicket: 450,
      tags: idx % 2 === 0 ? ['Frequent Traveler', 'Pet Owner'] : ['Business Class', 'Last Minute Buyer'],
      marketingAgreements: { email: true, sms: idx % 2 === 0, profiling: true }
    }));
  }, []);

  const filteredSegmentedClients = segmentedClients.filter(c => {
    const matchesSearch = c.lastName.toLowerCase().includes(clientSearch.toLowerCase()) || 
                          c.email.toLowerCase().includes(clientSearch.toLowerCase());
    const matchesSegment = segmentFilter === 'ALL' || c.purpose === segmentFilter;
    const matchesSpending = spendingFilter === 'ALL' || c.spendingLevel === spendingFilter;
    return matchesSearch && matchesSegment && matchesSpending;
  });

  const handleIdentify = (client?: SegmentedClient) => {
    if (client) {
      setIdentifiedClient(client);
      setCarnets(MOCK_CARNETS.filter(c => c.ownerId === client.id));
      setActiveTab('OVERVIEW');
      return;
    }

    const found = segmentedClients.find(c => c.phone.replace(/\s/g, '') === phoneNumber.replace(/\s/g, '') || phoneNumber === '123');
    if (found) {
       setIdentifiedClient(found);
       setCarnets(MOCK_CARNETS.filter(c => c.ownerId === found.id));
       setActiveTab('OVERVIEW');
    } else {
       alert('Nie znaleziono klienta o podanym numerze. (Spróbuj: 123 lub +48600123456)');
       setIdentifiedClient(null);
    }
  };

  const handleUseCarnet = (carnetId: string) => {
     setCarnets(prev => prev.map(c => {
        if (c.id === carnetId && c.usedRides < c.totalRides) {
           return { ...c, usedRides: c.usedRides + 1, status: c.usedRides + 1 >= c.totalRides ? 'DEPLETED' : 'ACTIVE' };
        }
        return c;
     }));
     alert(`Zarejestrowano przejazd z karnetu ${carnetId}.`);
  };

  const handleBuyCarnet = () => {
     const newCarnet: Carnet = {
        id: `CARNET-${Date.now()}`,
        ownerId: identifiedClient!.id,
        type: '10_RIDES',
        totalRides: 10,
        usedRides: 0,
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        routeId: 'R001',
        status: 'ACTIVE'
     };
     setCarnets([...carnets, newCarnet]);
     alert('Sprzedano nowy karnet 10-przejazdowy!');
  };

  const handleCreateComplaint = () => {
     if (!newComplaint.description) return;
     const complaint: Complaint = {
        ...newComplaint as Complaint,
        id: `CMP-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        dateFiled: new Date().toISOString().split('T')[0],
        status: ComplaintStatus.NEW,
        clientId: identifiedClient?.id,
        clientName: identifiedClient ? `${identifiedClient.firstName} ${identifiedClient.lastName}` : (newComplaint.clientName || 'Anonim'),
        email: identifiedClient?.email || newComplaint.email || '',
        phone: identifiedClient?.phone || newComplaint.phone || ''
     };
     setComplaints([complaint, ...complaints]);
     setIsNewComplaintModalOpen(false);
     setNewComplaint({ category: ComplaintCategory.SERVICE, description: '' });
     alert('Reklamacja została zarejestrowana.');
  };

  const handleResolveComplaint = (status: ComplaintStatus, resolution: string, compensation?: number, type?: 'REFUND' | 'VOUCHER') => {
     if (!selectedComplaint) return;
     const updated = {
        ...selectedComplaint,
        status,
        resolutionNote: resolution,
        compensationAmount: compensation,
        compensationType: type
     };
     setComplaints(complaints.map(c => c.id === selectedComplaint.id ? updated : c));
     setSelectedComplaint(null);
  };

  const clientBookings = identifiedClient 
    ? MOCK_RESERVATIONS.filter(r => identifiedClient.bookings.includes(r.id) || r.contactEmail === identifiedClient.email)
    : [];

  const displayedComplaints = identifiedClient 
    ? complaints.filter(c => c.clientId === identifiedClient.id || c.email === identifiedClient.email)
    : complaints;

  return (
    <div className="flex flex-col h-full bg-slate-100">
       <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-10 text-nowrap">
        <div className="flex-shrink-0 mr-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <PhoneCall className="text-purple-600" /> Call Center / BOK
          </h2>
          <p className="text-xs text-slate-500">Zarządzanie relacjami, segmentacja pasażerów i reklamacje</p>
        </div>
        <div className="flex gap-2">
           <button 
              onClick={() => setActiveTab('CLIENTS')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2 ${activeTab === 'CLIENTS' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
           >
              <Users size={16}/> Klienci
           </button>
           <button 
              onClick={() => setActiveTab('OVERVIEW')}
              disabled={!identifiedClient}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2 ${activeTab === 'OVERVIEW' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 disabled:opacity-30'}`}
           >
              <User size={16}/> Profil
           </button>
           <button 
              onClick={() => setActiveTab('CARNETS')}
              disabled={!identifiedClient}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2 ${activeTab === 'CARNETS' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 disabled:opacity-30'}`}
           >
              <Ticket size={16}/> Karnety
           </button>
           <button 
              onClick={() => setActiveTab('COMPLAINTS')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${activeTab === 'COMPLAINTS' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
           >
              <AlertCircle size={16}/> Reklamacje
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
         
         {/* === TAB: CLIENT SEGMENTATION === */}
         {activeTab === 'CLIENTS' && (
            <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
               
               {/* Quick Identification */}
               <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                     <PhoneCall size={20} />
                  </div>
                  <div className="flex-1 flex gap-2">
                     <input 
                        type="text" 
                        placeholder="Zidentyfikuj dzwoniącego (Nr telefonu)..." 
                        className="flex-1 border p-2 rounded-lg outline-none text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleIdentify()}
                     />
                     <button 
                        onClick={() => handleIdentify()}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-purple-700"
                     >
                        Szukaj
                     </button>
                  </div>
               </div>

               {/* Segment Summary Dashboard */}
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                     <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Segment: Biznes</p>
                     <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-slate-800">
                           {segmentedClients.filter(c => c.purpose === 'BIZNES').length}
                        </span>
                        <Briefcase className="text-blue-500" size={24}/>
                     </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                     <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Segment: Wypoczynek</p>
                     <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-slate-800">
                           {segmentedClients.filter(c => c.purpose === 'WYPOCZYNEK').length}
                        </span>
                        <Palmtree className="text-emerald-500" size={24}/>
                     </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                     <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Wysokie Wydatki</p>
                     <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-slate-800">
                           {segmentedClients.filter(c => c.spendingLevel === 'WYSOKIE').length}
                        </span>
                        <TrendingUp className="text-amber-500" size={24}/>
                     </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                     <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Aktywni (Loyalty)</p>
                     <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-slate-800">
                           {segmentedClients.filter(c => c.points > 1000).length}
                        </span>
                        <Star className="text-purple-500 fill-purple-500" size={24}/>
                     </div>
                  </div>
               </div>

               {/* Segmentation Controls & Table */}
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-4 items-center">
                     <div className="relative flex-1 min-w-[200px]">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                        <input 
                           type="text" 
                           placeholder="Szukaj po nazwisku lub e-mailu..." 
                           className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none text-sm bg-white"
                           value={clientSearch}
                           onChange={e => setClientSearch(e.target.value)}
                        />
                     </div>
                     
                     <div className="flex gap-2">
                        <select 
                           className="border rounded-lg text-xs font-bold p-2 bg-white outline-none"
                           value={segmentFilter}
                           onChange={e => setSegmentFilter(e.target.value as any)}
                        >
                           <option value="ALL">CEL PODRÓŻY: WSZYSTKIE</option>
                           <option value="BIZNES">BIZNES</option>
                           <option value="WYPOCZYNEK">WYPOCZYNEK</option>
                           <option value="PRACA">PRACA</option>
                        </select>
                        <select 
                           className="border rounded-lg text-xs font-bold p-2 bg-white outline-none"
                           value={spendingFilter}
                           onChange={e => setSpendingFilter(e.target.value as any)}
                        >
                           <option value="ALL">WYDATKI: WSZYSTKIE</option>
                           <option value="WYSOKIE">WYSOKIE</option>
                           <option value="ŚREDNIE">ŚREDNIE</option>
                           <option value="NISKIE">NISKIE</option>
                        </select>
                     </div>
                  </div>

                  <table className="w-full text-left text-sm">
                     <thead className="bg-white text-slate-500 uppercase text-[10px] font-black border-b border-slate-200">
                        <tr>
                           <th className="p-4">Pasażer</th>
                           <th className="p-4">Cel Podróży</th>
                           <th className="p-4">Profil Wydatków</th>
                           <th className="p-4">Lojalność</th>
                           <th className="p-4 text-right">Ost. Rejs</th>
                           <th className="p-4 text-right">Obsługa</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {filteredSegmentedClients.map(client => (
                           <tr key={client.id} className="hover:bg-slate-50 group">
                              <td className="p-4">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                                       {client.firstName[0]}{client.lastName[0]}
                                    </div>
                                    <div>
                                       <div className="font-bold text-slate-800">{client.lastName} {client.firstName}</div>
                                       <div className="text-[10px] text-slate-400">{client.email}</div>
                                    </div>
                                 </div>
                              </td>
                              <td className="p-4">
                                 <span className={`px-2 py-1 rounded text-[10px] font-black flex items-center gap-1.5 w-fit ${
                                    client.purpose === 'BIZNES' ? 'bg-blue-50 text-blue-700' :
                                    client.purpose === 'WYPOCZYNEK' ? 'bg-emerald-50 text-emerald-700' :
                                    'bg-orange-50 text-orange-700'
                                 }`}>
                                    {client.purpose === 'BIZNES' ? <Briefcase size={10}/> : client.purpose === 'WYPOCZYNEK' ? <Palmtree size={10}/> : <Coffee size={10}/>}
                                    {client.purpose}
                                 </span>
                              </td>
                              <td className="p-4">
                                 <span className={`px-2 py-1 rounded text-[10px] font-black flex items-center gap-1 w-fit ${
                                    client.spendingLevel === 'WYSOKIE' ? 'bg-amber-100 text-amber-800' :
                                    client.spendingLevel === 'ŚREDNIE' ? 'bg-blue-50 text-blue-600' :
                                    'bg-slate-100 text-slate-500'
                                 }`}>
                                    {client.spendingLevel}
                                 </span>
                              </td>
                              <td className="p-4">
                                 <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-500">{client.tier}</span>
                                    <div className="w-20 bg-slate-100 h-1 rounded-full overflow-hidden">
                                       <div className="bg-purple-500 h-full" style={{ width: `${Math.min(100, (client.points / 5000) * 100)}%` }}></div>
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-400">{client.points} pkt</span>
                                 </div>
                              </td>
                              <td className="p-4 text-right text-slate-500 font-mono text-xs">
                                 {client.lastTrip}
                                 <div className="text-[10px] text-slate-400 font-sans italic">Wyjazdów: {client.totalTrips}</div>
                              </td>
                              <td className="p-4 text-right">
                                 <button 
                                    onClick={() => handleIdentify(client)}
                                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all flex items-center gap-1 ml-auto shadow-sm"
                                 >
                                    <PhoneCall size={12}/> Otwórz Profil
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
                  {filteredSegmentedClients.length === 0 && (
                     <div className="p-12 text-center text-slate-400">
                        <Users size={48} className="mx-auto mb-4 opacity-20"/>
                        <p>Brak wyników spełniających wybrane kryteria segmentacji.</p>
                     </div>
                  )}
               </div>
            </div>
         )}

         {/* Identification Panel & Detailed Tabs - Visible when a client is active */}
         {identifiedClient && activeTab !== 'CLIENTS' && (
            <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
               <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 flex justify-between items-start relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-32 bg-purple-50 rounded-bl-full -mr-16 -mt-16 pointer-events-none opacity-50"></div>
                  
                  <div className="flex gap-6 items-center relative z-10">
                     <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl uppercase shadow-lg shadow-purple-900/20">
                        {identifiedClient.firstName[0]}{identifiedClient.lastName[0]}
                     </div>
                     <div>
                        <div className="flex items-center gap-3">
                           <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{identifiedClient.firstName} {identifiedClient.lastName}</h2>
                           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border-2 ${
                              identifiedClient.purpose === 'BIZNES' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                           }`}>
                              {identifiedClient.purpose === 'BIZNES' ? <Briefcase size={12}/> : <Palmtree size={12}/>} {identifiedClient.purpose}
                           </span>
                        </div>
                        <p className="text-slate-500 flex items-center gap-6 mt-1 font-medium">
                           <span className="flex items-center gap-1.5"><Mail size={14} className="text-slate-400"/> {identifiedClient.email}</span>
                           <span className="flex items-center gap-1.5"><PhoneCall size={14} className="text-slate-400"/> {identifiedClient.phone}</span>
                           <span className="flex items-center gap-1.5 text-xs font-mono bg-slate-100 px-2 py-0.5 rounded border">ID: {identifiedClient.id}</span>
                        </p>
                     </div>
                  </div>
                  <div className="flex gap-2 relative z-10">
                     <button className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition shadow-sm" title="Edytuj dane klienta">
                        <Edit size={20}/>
                     </button>
                     <button onClick={() => setIdentifiedClient(null)} className="p-2.5 bg-red-50 hover:bg-red-100 rounded-xl text-red-600 transition shadow-sm">
                        <XCircle size={20}/>
                     </button>
                  </div>
               </div>

               {activeTab === 'OVERVIEW' && (
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                     
                     {/* LEFT COLUMN: KPI & STATUS */}
                     <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none rotate-12 group-hover:rotate-45 transition-transform duration-700">
                              <Star size={120} />
                           </div>
                           <h4 className="font-black text-slate-400 text-[10px] uppercase mb-4 tracking-widest flex items-center gap-2">
                              <Award size={12}/> Status Lojalnościowy
                           </h4>
                           <div className="flex justify-between items-center mb-3">
                              <span className="text-sm font-bold text-slate-500">Program</span>
                              <span className={`font-black tracking-tighter uppercase px-3 py-1 rounded-lg text-xs border-2 ${
                                 identifiedClient.tier === LoyaltyTier.PLATINUM ? 'bg-slate-900 text-white border-slate-800' : 'bg-amber-100 text-amber-800 border-amber-200'
                              }`}>{identifiedClient.tier} MEMBER</span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-slate-500">Saldo</span>
                              <span className="font-black text-slate-900 text-2xl tracking-tighter">{identifiedClient.points} <span className="text-xs uppercase text-slate-400">pkt</span></span>
                           </div>
                           <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full shadow-[0_0_10px_rgba(124,58,237,0.3)]" style={{ width: '45%' }}></div>
                           </div>
                           <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-tighter">Brakuje 1200 pkt do PLATINUM</p>
                        </div>

                        <div className="bg-slate-900 p-6 rounded-2xl shadow-2xl text-white relative overflow-hidden group">
                           <h4 className="font-black text-slate-500 text-[10px] uppercase mb-4 tracking-widest relative z-10 flex items-center gap-2">
                              <TrendingUp size={12}/> Wartość Klienta (LTV)
                           </h4>
                           <div className="relative z-10">
                              <div className="flex items-baseline gap-1">
                                 <h3 className="text-4xl font-black text-amber-500 tracking-tighter">{identifiedClient.ltv.toLocaleString()}</h3>
                                 <span className="text-sm font-bold text-slate-500">PLN</span>
                              </div>
                              <div className="mt-6 space-y-3">
                                 <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                                    <span className="text-slate-400">Średni bilet:</span>
                                    <span className="font-black text-white">{identifiedClient.avgTicket} PLN</span>
                                 </div>
                                 <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Ilość rejsów:</span>
                                    <span className="font-black text-white">{identifiedClient.totalTrips}</span>
                                 </div>
                              </div>
                           </div>
                           <TrendingUp className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32 group-hover:scale-125 transition-transform duration-700" />
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                           <h4 className="font-black text-slate-400 text-[10px] uppercase mb-4 tracking-widest flex items-center gap-2">
                              <Tag size={12}/> Tagi Behawioralne
                           </h4>
                           <div className="flex flex-wrap gap-2">
                              {identifiedClient.tags.map(tag => (
                                 <span key={tag} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-black uppercase border border-blue-100 flex items-center gap-1.5 transition-colors hover:bg-blue-100">
                                    <div className="w-1 h-1 rounded-full bg-blue-400"></div> {tag}
                                 </span>
                              ))}
                              <button className="px-2.5 py-1 border-2 border-dashed border-slate-200 text-slate-400 rounded-lg text-[10px] font-bold uppercase hover:border-blue-400 hover:text-blue-600 transition-colors">
                                 + Zarządzaj
                              </button>
                           </div>
                        </div>
                     </div>

                     {/* MIDDLE COLUMN: PREFERENCES & CONTACT HISTORY */}
                     <div className="lg:col-span-2 space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
                              <h4 className="font-black text-slate-700 text-[10px] uppercase mb-4 tracking-widest flex items-center gap-2">
                                 <Bell size={14} className="text-blue-500"/> Zgody i Kontakt (RODO)
                              </h4>
                              <div className="space-y-3">
                                 <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition">
                                    <span className="text-sm font-bold text-slate-600">Marketing E-mail</span>
                                    {identifiedClient.marketingAgreements.email ? <div className="bg-green-100 p-1 rounded-full text-green-600"><CheckCircle size={16}/></div> : <XCircle size={16} className="text-slate-300"/>}
                                 </div>
                                 <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition">
                                    <span className="text-sm font-bold text-slate-600">Marketing SMS</span>
                                    {identifiedClient.marketingAgreements.sms ? <div className="bg-green-100 p-1 rounded-full text-green-600"><CheckCircle size={16}/></div> : <XCircle size={16} className="text-slate-300"/>}
                                 </div>
                                 <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition">
                                    <span className="text-sm font-bold text-slate-600">Profilowanie BI</span>
                                    {identifiedClient.marketingAgreements.profiling ? <div className="bg-green-100 p-1 rounded-full text-green-600"><CheckCircle size={16}/></div> : <XCircle size={16} className="text-slate-300"/>}
                                 </div>
                              </div>
                              <button className="w-full mt-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">Aktualizuj zgody systemowe</button>
                           </div>

                           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit flex flex-col">
                              <h4 className="font-black text-slate-700 text-[10px] uppercase mb-4 tracking-widest flex items-center gap-2">
                                 <Zap size={14} className="text-amber-500"/> Szybkie Notatki BOK
                              </h4>
                              <textarea 
                                 className="w-full h-32 border-none bg-slate-50 p-4 rounded-xl text-sm text-slate-600 italic outline-none focus:ring-2 focus:ring-amber-500/20 resize-none font-medium shadow-inner"
                                 placeholder="Wpisz ważną uwagę o kliencie (widoczna tylko dla BOK)..."
                                 defaultValue="Bardzo uprzejmy klient, preferuje kabiny z dala od maszynowni. Podróżuje z psem (Golden Retriever)."
                              ></textarea>
                              <div className="mt-3 text-right">
                                 <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Zapisz notatkę</button>
                              </div>
                           </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                           <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                              <h3 className="font-black text-slate-700 text-xs uppercase tracking-widest flex items-center gap-2">
                                 <HistoryIcon size={16} className="text-slate-400"/> Historia Interakcji (Ostatnie 30 dni)
                              </h3>
                              <button className="text-[10px] bg-slate-900 text-white px-3 py-1.5 rounded-lg font-black uppercase tracking-widest hover:bg-black transition shadow-sm">+ Log kontaktu</button>
                           </div>
                           <div className="divide-y divide-slate-100">
                              <div className="p-5 hover:bg-slate-50 transition flex gap-4">
                                 <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl h-fit shadow-sm"><PhoneCall size={18}/></div>
                                 <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                       <span className="font-black text-slate-800 text-xs uppercase tracking-tight">Rozmowa Przychodząca</span>
                                       <span className="text-[10px] text-slate-400 font-mono font-bold bg-white px-2 py-0.5 rounded border">2023-10-24 10:15</span>
                                    </div>
                                    <p className="text-sm text-slate-600 font-medium">Zapytanie o dostępność kabin LUX na grudzień. Przesłano ofertę e-mail.</p>
                                    <div className="mt-3 flex items-center gap-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                       <span className="flex items-center gap-1"><User size={10}/> Agent: m.fiszer</span>
                                       <span className="flex items-center gap-1"><Clock size={10}/> Czas: 4m 12s</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="p-5 hover:bg-slate-50 transition flex gap-4">
                                 <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl h-fit shadow-sm"><Mail size={18}/></div>
                                 <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                       <span className="font-black text-slate-800 text-xs uppercase tracking-tight">E-mail Wysłany (Auto)</span>
                                       <span className="text-[10px] text-slate-400 font-mono font-bold bg-white px-2 py-0.5 rounded border">2023-10-20 14:35</span>
                                    </div>
                                    <p className="text-sm text-slate-600 font-medium">Potwierdzenie płatności za rezerwację R001. System wygenerował bilet PDF.</p>
                                 </div>
                              </div>
                           </div>
                           <div className="p-3 bg-slate-50 text-center">
                              <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition">Załaduj całą historię &darr;</button>
                           </div>
                        </div>
                     </div>

                     {/* RIGHT COLUMN: LAST TRIP & QUICK ACTIONS */}
                     <div className="space-y-6">
                        <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                              <Ship size={100} />
                           </div>
                           <h4 className="font-black text-indigo-200 text-[10px] uppercase mb-4 tracking-widest flex items-center gap-2 relative z-10">
                              <Ship size={14}/> Ostatni Rejs
                           </h4>
                           {clientBookings.length > 0 ? (
                              <div className="text-sm relative z-10">
                                 <p className="font-mono font-black text-2xl tracking-tighter">{clientBookings[0].id}</p>
                                 <p className="font-black mt-1 uppercase tracking-tight text-white/90">{clientBookings[0].routeId}</p>
                                 <p className="text-xs mt-1 text-white/60 font-medium">{clientBookings[0].bookingDate}</p>
                                 <div className="mt-5 flex flex-wrap gap-2">
                                    <span className="text-[9px] bg-white/10 px-2 py-1 rounded-lg border border-white/10 font-black uppercase tracking-tighter">{clientBookings[0].vehicleType}</span>
                                    <span className="text-[9px] bg-white/10 px-2 py-1 rounded-lg border border-white/10 font-black uppercase tracking-tighter">{clientBookings[0].cabinType}</span>
                                 </div>
                              </div>
                           ) : (
                              <p className="text-sm text-indigo-300 italic">Brak rezerwacji w systemie</p>
                           )}
                           <button className="mt-8 w-full bg-white text-indigo-600 py-3 rounded-xl font-black text-xs hover:bg-indigo-50 uppercase tracking-widest shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                              Pełna Rezerwacja <ChevronRight size={14}/>
                           </button>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                           <h4 className="font-black text-slate-400 text-[10px] uppercase mb-4 tracking-widest flex items-center gap-2">
                              <LayoutList size={12}/> Narzędzia Consultanta
                           </h4>
                           <div className="space-y-2.5">
                              <button className="w-full py-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 text-[11px] font-black text-slate-700 flex items-center justify-center gap-2 transition active:scale-95 shadow-sm group">
                                 <Gift size={16} className="text-purple-500 group-hover:scale-110 transition-transform"/> Przyznaj Voucher Bonus
                              </button>
                              <button className="w-full py-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 text-[11px] font-black text-slate-700 flex items-center justify-center gap-2 transition active:scale-95 shadow-sm group">
                                 <Star size={16} className="text-amber-500 group-hover:scale-110 transition-transform"/> Zmień Tier Lojalnościowy
                              </button>
                              <button className="w-full py-3 bg-red-50 hover:bg-red-100 rounded-xl border border-red-100 text-[11px] font-black text-red-700 flex items-center justify-center gap-2 transition active:scale-95 shadow-sm group">
                                 <AlertCircle size={16} className="text-red-500 group-hover:animate-pulse"/> Oznacz: "Trudny Klient"
                              </button>
                           </div>
                        </div>
                     </div>

                  </div>
               )}

               {activeTab === 'CARNETS' && (
                  <div className="space-y-6 animate-fade-in">
                     <div className="flex justify-between items-center bg-purple-50 p-6 rounded-2xl border border-purple-100 shadow-inner">
                        <div className="flex gap-4 items-center">
                           <div className="bg-purple-600 text-white p-3 rounded-2xl shadow-lg shadow-purple-900/20">
                              <Ticket size={32} />
                           </div>
                           <div>
                              <h3 className="font-black text-purple-900 text-lg uppercase tracking-tight">Karnety (Multi-Ride)</h3>
                              <p className="text-sm text-purple-700 font-medium">Zarządzanie pakietami wieloprzejazdowymi przypisanymi do klienta.</p>
                           </div>
                        </div>
                        <button 
                           onClick={handleBuyCarnet}
                           className="bg-purple-600 text-white px-8 py-3 rounded-xl font-black text-xs hover:bg-purple-700 uppercase tracking-widest shadow-xl shadow-purple-900/20 transition-all active:scale-95 flex items-center gap-2"
                        >
                           <Plus size={16}/> Wystaw Nowy Karnet
                        </button>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {carnets.map(carnet => (
                           <div key={carnet.id} className={`bg-white rounded-2xl shadow-sm border p-6 relative overflow-hidden transition-all group ${
                              carnet.status === 'ACTIVE' ? 'border-purple-200 ring-2 ring-purple-50' : 'border-slate-200 opacity-75'
                           }`}>
                              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                                 <Ticket size={100} />
                              </div>
                              <div className="flex justify-between items-start mb-6 relative z-10">
                                 <div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ID Karnetu</div>
                                    <div className="font-mono font-black text-2xl text-slate-900 tracking-tighter">{carnet.id}</div>
                                    <div className="text-xs font-black text-purple-600 mt-1 uppercase tracking-widest flex items-center gap-2">
                                       <Ship size={12}/> Trasa: {carnet.routeId}
                                    </div>
                                 </div>
                                 <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border-2 ${
                                    carnet.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' : 
                                    'bg-red-50 text-red-700 border-red-200'
                                 }`}>
                                    {carnet.status === 'ACTIVE' ? 'Aktywny' : 'Wykorzystany'}
                                 </span>
                              </div>

                              <div className="mb-6 relative z-10">
                                 <div className="flex justify-between text-xs mb-2 font-black text-slate-700 uppercase tracking-tighter">
                                    <span>Wykorzystano jednostek: {carnet.usedRides} / {carnet.totalRides}</span>
                                    <span>{Math.round((carnet.usedRides / carnet.totalRides) * 100)}%</span>
                                 </div>
                                 <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner border">
                                    <div 
                                       className={`h-3 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(124,58,237,0.3)] ${carnet.status === 'ACTIVE' ? 'bg-purple-600' : 'bg-slate-400'}`} 
                                       style={{ width: `${(carnet.usedRides / carnet.totalRides) * 100}%` }}
                                    ></div>
                                 </div>
                              </div>

                              <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase border-t border-slate-100 pt-4 mb-4 tracking-widest">
                                 <span className="flex items-center gap-1.5"><Calendar size={12} className="text-slate-300"/> Ważność: {carnet.expiryDate}</span>
                              </div>

                              {carnet.status === 'ACTIVE' && (
                                 <button 
                                    onClick={() => handleUseCarnet(carnet.id)}
                                    className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-black text-xs hover:bg-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg active:scale-95"
                                 >
                                    <Ticket size={16} /> Rejestruj Przejazd (Zdejmij unit)
                                 </button>
                              )}
                           </div>
                        ))}
                        {carnets.length === 0 && (
                           <div className="col-span-2 text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
                              <Ticket size={64} className="mx-auto mb-4 opacity-10"/>
                              <p className="font-bold">Klient nie posiada aktywnych karnetów.</p>
                           </div>
                        )}
                     </div>
                  </div>
               )}

               {activeTab === 'COMPLAINTS' && (
                  <div className="space-y-6 animate-fade-in">
                     <div className="flex justify-between items-center bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-inner">
                        <div className="flex gap-4 items-center">
                           <div className="bg-amber-600 text-white p-3 rounded-2xl shadow-lg shadow-amber-900/20">
                              <AlertCircle size={32} />
                           </div>
                           <div>
                              <h3 className="font-black text-amber-900 text-lg uppercase tracking-tight">Reklamacje i Zgłoszenia</h3>
                              <p className="text-sm text-amber-700 font-medium">Pełna ewidencja i rozpatrywanie zgłoszonych problemów.</p>
                           </div>
                        </div>
                        <button 
                           onClick={() => setIsNewComplaintModalOpen(true)}
                           className="bg-amber-600 text-white px-8 py-3 rounded-xl font-black text-xs hover:bg-amber-700 uppercase tracking-widest shadow-xl shadow-amber-900/20 transition-all active:scale-95 flex items-center gap-2"
                        >
                           <Plus size={16}/> Nowa Reklamacja
                        </button>
                     </div>

                     <div className="grid gap-4">
                        {displayedComplaints.length > 0 ? displayedComplaints.map(complaint => (
                           <div key={complaint.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-xl transition-all group">
                              <div className="flex justify-between items-start mb-4">
                                 <div>
                                    <div className="flex items-center gap-3">
                                       <span className="font-mono font-black text-slate-800 text-xl tracking-tighter">{complaint.id}</span>
                                       <span className="text-[10px] bg-slate-100 px-3 py-1 rounded-full font-black text-slate-500 uppercase tracking-widest border border-slate-200">{complaint.category}</span>
                                    </div>
                                    <div className="text-[10px] font-black text-slate-400 mt-2 flex gap-4 uppercase tracking-widest">
                                       <span className="flex items-center gap-1.5"><Calendar size={12}/> Złożono: {complaint.dateFiled}</span>
                                       {complaint.bookingId && <span className="flex items-center gap-1.5"><Ticket size={12}/> Rezerwacja: {complaint.bookingId}</span>}
                                    </div>
                                 </div>
                                 <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 ${
                                    complaint.status === ComplaintStatus.RESOLVED ? 'bg-green-50 text-green-700 border-green-100' : 
                                    complaint.status === ComplaintStatus.REJECTED ? 'bg-red-50 text-red-700 border-red-100' : 
                                    'bg-amber-50 text-amber-700 border-amber-100'
                                 }`}>
                                    {complaint.status}
                                 </span>
                              </div>
                              
                              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-sm text-slate-700 mb-4 italic leading-relaxed shadow-inner">
                                 "{complaint.description}"
                              </div>

                              {complaint.resolutionNote && (
                                 <div className="mb-4 pl-6 border-l-4 border-green-500 py-1 animate-in slide-in-from-left-2">
                                    <p className="text-[10px] font-black text-green-600 uppercase mb-2 tracking-widest">Oficjalna Decyzja Systemowa</p>
                                    <p className="text-sm text-slate-600 font-bold leading-relaxed">{complaint.resolutionNote}</p>
                                    {complaint.compensationAmount && (
                                       <div className="mt-4 text-emerald-700 font-black text-xs flex items-center gap-2 bg-emerald-50 w-fit px-3 py-1.5 rounded-lg border border-emerald-100 shadow-sm">
                                          <DollarSign size={14}/> Rekompensata: {complaint.compensationAmount} PLN ({complaint.compensationType === 'VOUCHER' ? 'Voucher' : 'Przelew'})
                                       </div>
                                    )}
                                 </div>
                              )}

                              {complaint.status !== ComplaintStatus.RESOLVED && complaint.status !== ComplaintStatus.REJECTED && (
                                 <div className="flex justify-end pt-4 border-t border-slate-50">
                                    <button 
                                       onClick={() => setSelectedComplaint(complaint)}
                                       className="bg-slate-900 text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2"
                                    >
                                       Przejdź do rozpatrywania <ChevronRight size={14}/>
                                    </button>
                                 </div>
                              )}
                           </div>
                        )) : (
                           <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
                              <ThumbsUp size={64} className="mx-auto mb-4 opacity-10"/>
                              <p className="font-bold">Brak zgłoszonych reklamacji dla tego profilu.</p>
                           </div>
                        )}
                     </div>
                  </div>
               )}
            </div>
         )}

         {/* --- MODAL: NEW COMPLAINT --- */}
         {isNewComplaintModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
               <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in duration-200">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-3xl">
                     <h3 className="font-black text-xl text-slate-900 uppercase tracking-tighter">Zgłoszenie Reklamacji</h3>
                     <button onClick={() => setIsNewComplaintModalOpen(false)} className="text-slate-400 hover:text-red-500 transition"><X size={24}/></button>
                  </div>
                  <div className="p-8 space-y-6">
                     <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Kategoria Problemu</label>
                        <select 
                           className="w-full border-2 border-slate-100 p-3.5 rounded-2xl bg-slate-50 focus:bg-white transition-all text-sm font-bold outline-none focus:border-amber-500"
                           value={newComplaint.category}
                           onChange={e => setNewComplaint({...newComplaint, category: e.target.value as ComplaintCategory})}
                        >
                           {Object.values(ComplaintCategory).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                     </div>
                     <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Nr Rezerwacji (Powiązanie)</label>
                        <select 
                           className="w-full border-2 border-slate-100 p-3.5 rounded-2xl bg-slate-50 focus:bg-white transition-all text-sm font-bold outline-none focus:border-amber-500"
                           onChange={e => setNewComplaint({...newComplaint, bookingId: e.target.value})}
                        >
                           <option value="">Wybierz rezerwację...</option>
                           {clientBookings.map(r => <option key={r.id} value={r.id}>{r.id} ({r.routeId})</option>)}
                        </select>
                     </div>
                     <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Opis sytuacji</label>
                        <textarea 
                           className="w-full border-2 border-slate-100 p-4 rounded-2xl bg-slate-50 focus:bg-white transition-all text-sm font-medium h-32 resize-none outline-none focus:border-amber-500 shadow-inner"
                           placeholder="Wpisz treść reklamacji pasażera..."
                           value={newComplaint.description}
                           onChange={e => setNewComplaint({...newComplaint, description: e.target.value})}
                        ></textarea>
                     </div>
                     <button 
                        onClick={handleCreateComplaint}
                        className="w-full bg-amber-600 text-white py-5 rounded-2xl font-black text-xs hover:bg-amber-700 uppercase tracking-widest shadow-xl shadow-amber-900/20 transform transition-transform active:scale-95 flex justify-center items-center gap-2"
                     >
                        <Send size={18}/> Wyślij do Działu Reklamacji
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* --- MODAL: RESOLVE COMPLAINT --- */}
         {selectedComplaint && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
               <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white rounded-t-3xl">
                     <div>
                        <h3 className="font-black text-xl uppercase tracking-tighter">Rozpatrywanie: {selectedComplaint.id}</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{selectedComplaint.clientName} • {selectedComplaint.category}</p>
                     </div>
                     <button onClick={() => setSelectedComplaint(null)} className="text-slate-400 hover:text-white transition"><X size={24}/></button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50">
                     <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                        <p className="font-black text-slate-400 text-[10px] uppercase mb-2 tracking-widest">Treść reklamacji klienta:</p>
                        <p className="text-slate-800 italic text-sm leading-relaxed">"{selectedComplaint.description}"</p>
                     </div>

                     <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Decyzja i Uzasadnienie (Dla klienta)</label>
                        <textarea 
                           id="resolutionText"
                           className="w-full border-2 border-slate-200 p-4 rounded-2xl bg-white text-sm font-medium h-32 outline-none focus:border-purple-600 transition-all shadow-sm"
                           placeholder="Wpisz oficjalną treść odpowiedzi..."
                        ></textarea>
                     </div>

                     <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                           <DollarSign size={80}/>
                        </div>
                        <h4 className="font-black text-slate-400 text-[10px] uppercase mb-4 tracking-widest relative z-10 flex items-center gap-2">
                           <CreditCard size={14}/> Forma Rekompensaty
                        </h4>
                        <div className="grid grid-cols-2 gap-6 relative z-10">
                           <div>
                              <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Kwota (PLN)</label>
                              <input type="number" id="compAmount" className="w-full border-2 border-slate-100 p-3 rounded-xl text-sm bg-slate-50 font-mono font-black" placeholder="0.00"/>
                           </div>
                           <div>
                              <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Forma zwrotu</label>
                              <select id="compType" className="w-full border-2 border-slate-100 p-3 rounded-xl text-sm bg-slate-50 font-black">
                                 <option value="VOUCHER">Voucher Rabatowy</option>
                                 <option value="REFUND">Przelew (Refundacja)</option>
                              </select>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="p-8 border-t border-slate-100 bg-white rounded-b-3xl flex gap-4 justify-end shadow-inner">
                     <button 
                        onClick={() => {
                           const note = (document.getElementById('resolutionText') as HTMLTextAreaElement).value;
                           handleResolveComplaint(ComplaintStatus.REJECTED, note || 'Reklamacja odrzucona po weryfikacji faktów.');
                        }}
                        className="px-8 py-3.5 border-2 border-red-100 text-red-600 rounded-xl font-black text-xs hover:bg-red-50 flex items-center gap-2 uppercase tracking-widest transition-all"
                     >
                        <ThumbsDown size={18}/> Odrzuć
                     </button>
                     <button 
                        onClick={() => {
                           const note = (document.getElementById('resolutionText') as HTMLTextAreaElement).value;
                           const amount = parseFloat((document.getElementById('compAmount') as HTMLInputElement).value);
                           const type = (document.getElementById('compType') as HTMLSelectElement).value as any;
                           handleResolveComplaint(ComplaintStatus.RESOLVED, note || 'Rozpatrzono pozytywnie. Dziękujemy za cierpliwość.', amount, type);
                        }}
                        className="px-10 py-3.5 bg-emerald-600 text-white rounded-xl font-black text-xs hover:bg-emerald-700 flex items-center gap-2 uppercase tracking-widest shadow-xl shadow-emerald-900/20 transition-all active:scale-95"
                     >
                        <ThumbsUp size={18}/> Zatwierdź i Wyślij
                     </button>
                  </div>
               </div>
            </div>
         )}

      </div>
    </div>
  );
};

export default CallCenterModule;