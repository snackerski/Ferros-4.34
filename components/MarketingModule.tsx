
import React, { useState } from 'react';
import { Heart, Search, Star, Award, Gift, MessageCircle, BarChart, Send, User, PlusCircle, MinusCircle, Tag, CheckSquare, Trash2, Edit, Globe, Lock, Shield, ShoppingCart, AlertCircle, RefreshCw, Link, MousePointer, DollarSign, Mail } from 'lucide-react';
import { MOCK_LOYALTY_MEMBERS, MOCK_LOYALTY_TRANSACTIONS, MOCK_SURVEYS, MOCK_SURVEY_FEEDBACK, MOCK_SPECIAL_OFFERS, MOCK_WEB_ACCOUNTS, MOCK_ABANDONED_CARTS, MOCK_WEB_AFFILIATES } from '../services/mockData';
import { LoyaltyMember, LoyaltyTier, SpecialOffer, WebAccount, AbandonedCart, WebAffiliate } from '../types';

const MarketingModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'LOYALTY' | 'SURVEYS' | 'CMS' | 'WEB_USERS'>('LOYALTY');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<LoyaltyMember | null>(null);
  
  // CMS / E-Commerce State
  const [ecommerceTab, setEcommerceTab] = useState<'OFFERS' | 'CARTS' | 'AFFILIATES'>('OFFERS');
  const [offers, setOffers] = useState<SpecialOffer[]>(MOCK_SPECIAL_OFFERS);
  const [newOffer, setNewOffer] = useState<Partial<SpecialOffer>>({ title: '', description: '', discountCode: '', imageColor: 'bg-blue-500' });
  const [carts, setCarts] = useState<AbandonedCart[]>(MOCK_ABANDONED_CARTS);
  const [affiliates, setAffiliates] = useState<WebAffiliate[]>(MOCK_WEB_AFFILIATES);

  // Web Users State (Etap 18.1)
  const [webAccounts, setWebAccounts] = useState<WebAccount[]>(MOCK_WEB_ACCOUNTS);

  const filteredMembers = MOCK_LOYALTY_MEMBERS.filter(m => 
    m.lastName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.cardNumber.includes(searchQuery)
  );

  const getTierColor = (tier: LoyaltyTier) => {
    switch(tier) {
      case LoyaltyTier.PLATINUM: return 'bg-slate-800 text-white border-slate-600';
      case LoyaltyTier.GOLD: return 'bg-amber-100 text-amber-800 border-amber-300';
      case LoyaltyTier.SILVER: return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  const handleAdjustPoints = (amount: number) => {
    if (!selectedMember) return;
    alert(`Symulacja: Zmieniono saldo punktów dla ${selectedMember.firstName} ${selectedMember.lastName} o ${amount} pkt.`);
  };

  const handleAddOffer = () => {
     if (!newOffer.title || !newOffer.discountCode) return;
     const offer: SpecialOffer = {
        ...newOffer as SpecialOffer,
        id: `OFFER-${Date.now()}`
     };
     setOffers([...offers, offer]);
     setNewOffer({ title: '', description: '', discountCode: '', imageColor: 'bg-blue-500' });
  };

  const handleRemoveOffer = (id: string) => {
     setOffers(offers.filter(o => o.id !== id));
  };

  // Etap 20.1 Actions
  const handleRecoverCart = (id: string) => {
     setCarts(prev => prev.map(c => c.id === id ? { ...c, status: 'RECOVERED', recoveryEmailSent: true } : c));
     alert('Wysłano e-mail przypominający o koszyku z kodem rabatowym.');
  };

  // Etap 18.1 Actions
  const handleResetPassword = (email: string) => {
     alert(`Wysłano link do resetu hasła na adres: ${email}`);
  };

  const handleToggleBlock = (id: string) => {
     setWebAccounts(prev => prev.map(acc => acc.id === id ? { ...acc, status: acc.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED' } : acc));
  };

  return (
    <div className="flex flex-col h-full bg-slate-100">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Heart className="text-red-500" /> Marketing & CRM
          </h2>
          <p className="text-xs text-slate-500">Etap 34 (Lojalność), 35 (Ankiety), 20/40 (E-Commerce)</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('LOYALTY')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'LOYALTY' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Lojalność
          </button>
          <button 
            onClick={() => setActiveTab('SURVEYS')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'SURVEYS' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Ankiety
          </button>
          <button 
            onClick={() => setActiveTab('WEB_USERS')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'WEB_USERS' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Klienci Web
          </button>
          <button 
            onClick={() => setActiveTab('CMS')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'CMS' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            E-Commerce / CMS
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        
        {/* === TAB 1: LOYALTY PROGRAM === */}
        {activeTab === 'LOYALTY' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Left: Member List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
               <div className="p-4 border-b border-slate-100">
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                     <input 
                       type="text" 
                       placeholder="Szukaj (Nazwisko / Nr Karty)" 
                       value={searchQuery}
                       onChange={e => setSearchQuery(e.target.value)}
                       className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                     />
                  </div>
               </div>
               <div className="flex-1 overflow-y-auto">
                  {filteredMembers.map(member => (
                     <div 
                       key={member.id}
                       onClick={() => setSelectedMember(member)}
                       className={`p-4 border-b border-slate-50 cursor-pointer transition hover:bg-slate-50 ${selectedMember?.id === member.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
                     >
                        <div className="flex justify-between items-start">
                           <div>
                              <h4 className="font-bold text-slate-800">{member.firstName} {member.lastName}</h4>
                              <p className="text-xs text-slate-500 font-mono">{member.cardNumber}</p>
                           </div>
                           <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getTierColor(member.tier)}`}>
                              {member.tier}
                           </span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Right: Member Details */}
            <div className="lg:col-span-2">
               {selectedMember ? (
                 <div className="space-y-6">
                    {/* Header Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex justify-between items-center relative overflow-hidden">
                       <div className="relative z-10 flex gap-4 items-center">
                          <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                             <User size={32} />
                          </div>
                          <div>
                             <h2 className="text-2xl font-bold text-slate-800">{selectedMember.firstName} {selectedMember.lastName}</h2>
                             <p className="text-slate-500 flex items-center gap-2">
                               {selectedMember.email} • Członek od: {selectedMember.joinDate}
                             </p>
                          </div>
                       </div>
                       <div className="text-right relative z-10">
                          <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Dostępne Punkty</p>
                          <h3 className="text-4xl font-bold text-blue-600">{selectedMember.pointsBalance}</h3>
                       </div>
                       {/* Background decoration */}
                       <Award className="absolute -right-6 -bottom-6 text-slate-50 opacity-50 w-48 h-48 rotate-12" />
                    </div>

                    {/* Actions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="bg-white p-6 rounded-xl border border-slate-200">
                          <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                             <Gift size={20} className="text-purple-500"/> Zarządzanie Punktami
                          </h4>
                          <div className="flex gap-2">
                             <button 
                                onClick={() => handleAdjustPoints(100)}
                                className="flex-1 py-3 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-100 hover:bg-emerald-100 flex items-center justify-center gap-2"
                             >
                                <PlusCircle size={18}/> Dodaj (Korekta)
                             </button>
                             <button 
                                onClick={() => handleAdjustPoints(-100)}
                                className="flex-1 py-3 bg-red-50 text-red-700 font-bold rounded-lg border border-red-100 hover:bg-red-100 flex items-center justify-center gap-2"
                             >
                                <MinusCircle size={18}/> Odejmij (Nagroda)
                             </button>
                          </div>
                       </div>
                       
                       <div className="bg-white p-6 rounded-xl border border-slate-200">
                          <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                             <Star size={20} className="text-amber-500"/> Status
                          </h4>
                          <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                             <div className="bg-amber-400 h-2 rounded-full" style={{ width: '65%' }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-slate-500">
                             <span>Obecny: {selectedMember.tier}</span>
                             <span>Następny: PLATINUM (brakuje 750 pkt)</span>
                          </div>
                       </div>
                    </div>

                    {/* Transaction History */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                       <div className="p-4 border-b border-slate-100 font-bold text-slate-700">
                          Historia Transakcji
                       </div>
                       <table className="w-full text-left text-sm">
                          <thead className="bg-slate-50 text-slate-500">
                             <tr>
                                <th className="p-3">Data</th>
                                <th className="p-3">Typ</th>
                                <th className="p-3">Opis</th>
                                <th className="p-3 text-right">Punkty</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {MOCK_LOYALTY_TRANSACTIONS.filter(t => t.memberId === selectedMember.id).map(tx => (
                                <tr key={tx.id}>
                                   <td className="p-3 font-mono text-slate-600">{tx.date}</td>
                                   <td className="p-3">
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${tx.type === 'EARN' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                         {tx.type}
                                      </span>
                                   </td>
                                   <td className="p-3 text-slate-800">{tx.description}</td>
                                   <td className={`p-3 text-right font-bold ${tx.points > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                      {tx.points > 0 ? '+' : ''}{tx.points}
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                    <User size={64} className="mb-4 text-slate-200"/>
                    <p>Wybierz uczestnika programu z listy</p>
                 </div>
               )}
            </div>
          </div>
        )}

        {/* === TAB 4: WEB CLIENTS (Etap 18.1) === */}
        {activeTab === 'WEB_USERS' && (
           <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                 <div>
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                       <Globe size={20} className="text-blue-600"/> Zarządzanie Kontami Web (Etap 18.1)
                    </h3>
                    <p className="text-sm text-slate-500">Wsparcie dla użytkowników portalu klienta (rejestracja, logowanie, hasła).</p>
                 </div>
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                    <input type="text" placeholder="Szukaj email..." className="pl-10 pr-4 py-2 border rounded-lg bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500"/>
                 </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                 <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs border-b border-slate-200">
                       <tr>
                          <th className="p-4">Email</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Ostatnie Logowanie</th>
                          <th className="p-4">Nieudane Próby</th>
                          <th className="p-4">Powiązane Konto</th>
                          <th className="p-4 text-right">Akcje</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {webAccounts.map(account => (
                          <tr key={account.id} className="hover:bg-slate-50">
                             <td className="p-4 font-bold text-slate-700">{account.email}</td>
                             <td className="p-4">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                   account.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                   account.status === 'LOCKED' ? 'bg-red-100 text-red-700' :
                                   'bg-amber-100 text-amber-700'
                                }`}>
                                   {account.status}
                                </span>
                             </td>
                             <td className="p-4 text-slate-500">{account.lastLogin}</td>
                             <td className="p-4">
                                {account.failedLoginAttempts > 0 ? <span className="text-red-600 font-bold">{account.failedLoginAttempts}</span> : '0'}
                             </td>
                             <td className="p-4">
                                {account.linkedClientId ? <span className="text-blue-600 font-mono text-xs">{account.linkedClientId}</span> : <span className="text-slate-400 italic">Brak</span>}
                             </td>
                             <td className="p-4 text-right flex justify-end gap-2">
                                <button 
                                   onClick={() => handleResetPassword(account.email)}
                                   className="text-slate-600 hover:bg-slate-100 p-2 rounded text-xs font-bold border border-slate-200 flex items-center gap-1"
                                >
                                   <Lock size={12}/> Reset Hasła
                                </button>
                                <button 
                                   onClick={() => handleToggleBlock(account.id)}
                                   className={`text-xs font-bold p-2 rounded border flex items-center gap-1 ${
                                      account.status === 'LOCKED' 
                                      ? 'text-green-700 bg-green-50 border-green-200 hover:bg-green-100' 
                                      : 'text-red-700 bg-red-50 border-red-200 hover:bg-red-100'
                                   }`}
                                >
                                   <Shield size={12}/> {account.status === 'LOCKED' ? 'Odblokuj' : 'Blokuj'}
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}

        {/* === TAB 2: SURVEYS & NPS === */}
        {activeTab === 'SURVEYS' && (
           <div className="space-y-6">
              {/* Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {MOCK_SURVEYS.map(survey => (
                    <div key={survey.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
                       <div className="relative z-10">
                          <h3 className="font-bold text-slate-700 mb-1">{survey.title}</h3>
                          <p className="text-xs text-slate-500 mb-4">Grupa docelowa: {survey.targetGroup}</p>
                          <div className="flex items-end gap-2">
                             <span className={`text-4xl font-bold ${survey.npsScore > 50 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {survey.npsScore}
                             </span>
                             <span className="text-sm font-bold text-slate-400 mb-2">NPS</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-2">Na podstawie {survey.responseCount} odpowiedzi</p>
                       </div>
                       <div className={`absolute right-0 top-0 w-24 h-full opacity-10 ${survey.npsScore > 50 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                    </div>
                 ))}
                 
                 <div className="bg-blue-600 p-6 rounded-xl shadow-md text-white flex flex-col justify-between">
                    <div>
                       <h3 className="font-bold text-lg mb-2">Wyślij nową ankietę</h3>
                       <p className="text-blue-100 text-sm">Automatyczna wysyłka po zakończeniu rejsu.</p>
                    </div>
                    <button className="bg-white text-blue-700 py-2 rounded-lg font-bold text-sm hover:bg-blue-50 flex items-center justify-center gap-2 mt-4">
                       <Send size={16}/> Konfiguruj wysyłkę
                    </button>
                 </div>
              </div>

              {/* Feedback List */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                 <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                       <MessageCircle size={20} className="text-blue-500"/> Ostatnie Opinie Pasażerów
                    </h3>
                    <div className="flex gap-2 text-sm">
                       <button className="px-3 py-1 bg-slate-100 rounded-full text-slate-600 font-medium">Wszystkie</button>
                       <button className="px-3 py-1 hover:bg-slate-50 rounded-full text-slate-500">Promotorzy (9-10)</button>
                       <button className="px-3 py-1 hover:bg-slate-50 rounded-full text-slate-500">Krytycy (0-6)</button>
                    </div>
                 </div>
                 <div className="divide-y divide-slate-100">
                    {MOCK_SURVEY_FEEDBACK.map(feedback => (
                       <div key={feedback.id} className="p-6 hover:bg-slate-50 transition">
                          <div className="flex justify-between mb-2">
                             <div className="flex items-center gap-2">
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                   feedback.score >= 9 ? 'bg-emerald-500' : feedback.score <= 6 ? 'bg-red-500' : 'bg-amber-500'
                                }`}>
                                   {feedback.score}
                                </span>
                                <span className="font-bold text-slate-800">{feedback.passengerName || 'Anonim'}</span>
                             </div>
                             <span className="text-xs text-slate-400">{feedback.date}</span>
                          </div>
                          <p className="text-slate-600 ml-10 text-sm italic">"{feedback.comment}"</p>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {/* === TAB 3: E-COMMERCE DASHBOARD (Etap 20/40) === */}
        {activeTab === 'CMS' && (
           <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
              {/* Sub-navigation */}
              <div className="flex justify-center mb-4">
                 <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm flex gap-1">
                    <button 
                       onClick={() => setEcommerceTab('OFFERS')}
                       className={`px-4 py-2 rounded-md font-bold text-sm transition ${ecommerceTab === 'OFFERS' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                       Oferty Specjalne
                    </button>
                    <button 
                       onClick={() => setEcommerceTab('CARTS')}
                       className={`px-4 py-2 rounded-md font-bold text-sm transition ${ecommerceTab === 'CARTS' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                       Porzucone Koszyki (20.1)
                    </button>
                    <button 
                       onClick={() => setEcommerceTab('AFFILIATES')}
                       className={`px-4 py-2 rounded-md font-bold text-sm transition ${ecommerceTab === 'AFFILIATES' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                       Program Partnerski (40.3)
                    </button>
                 </div>
              </div>

              {/* SECTION: OFFERS */}
              {ecommerceTab === 'OFFERS' && (
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Create Form */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                       <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <PlusCircle size={20} className="text-blue-600"/> Dodaj Ofertę (Web)
                       </h3>
                       <div className="space-y-4">
                          <div>
                             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tytuł Oferty</label>
                             <input 
                                type="text" 
                                className="w-full border p-2 rounded text-sm bg-white"
                                value={newOffer.title}
                                onChange={e => setNewOffer({...newOffer, title: e.target.value})}
                             />
                          </div>
                          <div>
                             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Opis (Max 100 znaków)</label>
                             <textarea 
                                className="w-full border p-2 rounded text-sm bg-white h-20 resize-none"
                                value={newOffer.description}
                                onChange={e => setNewOffer({...newOffer, description: e.target.value})}
                             />
                          </div>
                          <div>
                             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kod Rabatowy</label>
                             <input 
                                type="text" 
                                className="w-full border p-2 rounded text-sm bg-white"
                                value={newOffer.discountCode}
                                onChange={e => setNewOffer({...newOffer, discountCode: e.target.value})}
                             />
                          </div>
                          <div>
                             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kolor Tła (Klasa CSS)</label>
                             <select 
                                className="w-full border p-2 rounded text-sm bg-white"
                                value={newOffer.imageColor}
                                onChange={e => setNewOffer({...newOffer, imageColor: e.target.value})}
                             >
                                <option value="bg-blue-500">Niebieski</option>
                                <option value="bg-green-500">Zielony</option>
                                <option value="bg-red-500">Czerwony</option>
                                <option value="bg-orange-500">Pomarańczowy</option>
                                <option value="bg-purple-500">Fioletowy</option>
                             </select>
                          </div>
                          <button 
                             onClick={handleAddOffer}
                             className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 mt-2"
                          >
                             Publikuj Ofertę
                          </button>
                       </div>
                    </div>

                    {/* Preview Grid */}
                    <div className="lg:col-span-2">
                       <h3 className="font-bold text-slate-800 mb-4">Aktywne Oferty (Podgląd)</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {offers.map(offer => (
                             <div key={offer.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition group relative">
                                <div className={`h-24 ${offer.imageColor} flex items-center justify-center`}>
                                   <Tag className="text-white opacity-80" size={40} />
                                </div>
                                <div className="p-4">
                                   <h4 className="font-bold text-slate-800">{offer.title}</h4>
                                   <p className="text-xs text-slate-500 mt-1 h-8">{offer.description}</p>
                                   <div className="mt-4 flex justify-between items-center">
                                      <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 font-mono">{offer.discountCode}</span>
                                      <span className="text-xs font-bold text-green-600 flex items-center gap-1"><CheckSquare size={12}/> Aktywna</span>
                                   </div>
                                </div>
                                
                                {/* Overlay Actions */}
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                   <button className="bg-white p-1 rounded-full text-slate-500 hover:text-blue-600 shadow"><Edit size={14}/></button>
                                   <button onClick={() => handleRemoveOffer(offer.id)} className="bg-white p-1 rounded-full text-slate-500 hover:text-red-600 shadow"><Trash2 size={14}/></button>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              )}

              {/* SECTION: ABANDONED CARTS (Etap 20.1) */}
              {ecommerceTab === 'CARTS' && (
                 <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                          <div className="bg-amber-100 p-3 rounded-full text-amber-600"><ShoppingCart size={24}/></div>
                          <div>
                             <p className="text-xs font-bold text-slate-400 uppercase">Utracone Rezerwacje</p>
                             <h3 className="text-2xl font-bold text-slate-800">{carts.filter(c => c.status === 'NEW').length}</h3>
                          </div>
                       </div>
                       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                          <div className="bg-green-100 p-3 rounded-full text-green-600"><RefreshCw size={24}/></div>
                          <div>
                             <p className="text-xs font-bold text-slate-400 uppercase">Odzyskane</p>
                             <h3 className="text-2xl font-bold text-slate-800">{carts.filter(c => c.status === 'RECOVERED').length}</h3>
                          </div>
                       </div>
                       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                          <div className="bg-blue-100 p-3 rounded-full text-blue-600"><DollarSign size={24}/></div>
                          <div>
                             <p className="text-xs font-bold text-slate-400 uppercase">Potencjał (PLN)</p>
                             <h3 className="text-2xl font-bold text-slate-800">
                                {carts.filter(c => c.status === 'NEW').reduce((sum, c) => sum + c.value, 0).toLocaleString()} PLN
                             </h3>
                          </div>
                       </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                       <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700 flex justify-between">
                          <span>Lista Porzuconych Koszyków (24h)</span>
                          <button className="text-xs text-blue-600 hover:underline flex items-center gap-1"><RefreshCw size={12}/> Odśwież</button>
                       </div>
                       <table className="w-full text-left text-sm">
                          <thead className="bg-white text-slate-500 uppercase text-xs">
                             <tr>
                                <th className="p-4">Data</th>
                                <th className="p-4">Email Klienta</th>
                                <th className="p-4">Trasa</th>
                                <th className="p-4 text-right">Wartość</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-right">Akcja</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {carts.map(cart => (
                                <tr key={cart.id} className="hover:bg-slate-50">
                                   <td className="p-4 text-slate-500">{cart.date}</td>
                                   <td className="p-4 font-medium">{cart.customerEmail}</td>
                                   <td className="p-4 text-xs font-mono bg-slate-50 w-fit px-2 py-1 rounded inline-block">{cart.routeId}</td>
                                   <td className="p-4 text-right font-bold text-slate-700">{cart.value} PLN</td>
                                   <td className="p-4 text-center">
                                      {cart.status === 'NEW' && <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">NOWY</span>}
                                      {cart.status === 'RECOVERED' && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">ODZYSKANY</span>}
                                      {cart.status === 'LOST' && <span className="bg-slate-200 text-slate-600 px-2 py-1 rounded text-xs font-bold">UTRACONY</span>}
                                   </td>
                                   <td className="p-4 text-right">
                                      {cart.status === 'NEW' && (
                                         <button 
                                            onClick={() => handleRecoverCart(cart.id)}
                                            disabled={cart.recoveryEmailSent}
                                            className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-bold ${
                                               cart.recoveryEmailSent 
                                               ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                               : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                         >
                                            <Mail size={12}/> {cart.recoveryEmailSent ? 'Wysłano' : 'Przypomnij'}
                                         </button>
                                      )}
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
              )}

              {/* SECTION: AFFILIATES (Etap 40.3) */}
              {ecommerceTab === 'AFFILIATES' && (
                 <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                       <div>
                          <h3 className="font-bold text-slate-800 flex items-center gap-2">
                             <Link size={20} className="text-purple-600"/> Partnerzy Web (Affiliates)
                          </h3>
                          <p className="text-sm text-slate-500">Zarządzanie programem partnerskim i prowizjami za ruch z blogów/stron.</p>
                       </div>
                       <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-purple-700 flex items-center gap-2">
                          <PlusCircle size={16}/> Dodaj Partnera
                       </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {affiliates.map(aff => (
                          <div key={aff.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition">
                             <div>
                                <div className="flex justify-between items-start mb-4">
                                   <div>
                                      <h4 className="font-bold text-slate-800">{aff.name}</h4>
                                      <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-mono border border-purple-100">
                                         Kod: {aff.referralCode}
                                      </span>
                                   </div>
                                   <div className="p-2 bg-slate-50 rounded-full text-slate-400">
                                      <Globe size={20}/>
                                   </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                   <div>
                                      <span className="text-xs text-slate-400 uppercase font-bold flex items-center gap-1"><MousePointer size={10}/> Wizyty</span>
                                      <div className="font-bold text-slate-700">{aff.visits}</div>
                                   </div>
                                   <div>
                                      <span className="text-xs text-slate-400 uppercase font-bold flex items-center gap-1"><CheckSquare size={10}/> Konwersje</span>
                                      <div className="font-bold text-slate-700">{aff.conversions}</div>
                                   </div>
                                </div>
                                
                                <div className="p-3 bg-green-50 border border-green-100 rounded-lg flex justify-between items-center">
                                   <span className="text-xs font-bold text-green-800 uppercase">Prowizja</span>
                                   <span className="text-lg font-bold text-green-700">{aff.commissionEarned} PLN</span>
                                </div>
                             </div>
                             
                             <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                                <button className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-50 rounded hover:bg-slate-100">Szczegóły</button>
                                <button className="flex-1 py-2 text-xs font-bold text-purple-600 bg-white border border-purple-200 rounded hover:bg-purple-50">Wypłać</button>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              )}
           </div>
        )} 

      </div>
    </div>
  );
};

export default MarketingModule;
