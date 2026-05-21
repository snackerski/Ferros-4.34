
import React, { useState } from 'react';
import { Package, Search, Plus, Filter, Tag, MapPin, User, Archive, CheckCircle, Trash2, Camera, FileText } from 'lucide-react';
import { MOCK_LOST_ITEMS } from '../services/mockData';
import { LostItem, LostItemCategory, LostItemStatus } from '../types';
import { useTranslation } from '../i18n';

const LostAndFoundModule: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'LIST' | 'REGISTER'>('LIST');
  const [items, setItems] = useState<LostItem[]>(MOCK_LOST_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  
  // New Item Form State
  const [newItem, setNewItem] = useState<Partial<LostItem>>({
     dateFound: new Date().toISOString().split('T')[0],
     status: LostItemStatus.NEW,
     category: LostItemCategory.OTHER
  });

  const filteredItems = items.filter(item => {
     const matchesSearch = item.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.id.toLowerCase().includes(searchQuery.toLowerCase());
     const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
     return matchesSearch && matchesCategory;
  });

  const handleRegisterItem = () => {
     if (!newItem.description || !newItem.locationFound) return;
     const item: LostItem = {
        ...newItem as LostItem,
        id: `LF-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        foundBy: 'System User', // In real app: current user
        storageLocation: newItem.storageLocation || 'Reception (Temp)',
        imagePlaceholderColor: 'bg-slate-200'
     };
     setItems([item, ...items]);
     setActiveTab('LIST');
     setNewItem({ dateFound: new Date().toISOString().split('T')[0], status: LostItemStatus.NEW, category: LostItemCategory.OTHER });
     alert(`${t('lost.item.claim_success')} ID: ${item.id}`);
  };

  const handleClaimItem = (id: string) => {
     const owner = prompt(t('lost.item.claim_prompt'));
     if (owner) {
        setItems(prev => prev.map(i => i.id === id ? { ...i, status: LostItemStatus.CLAIMED, ownerName: owner, claimDate: new Date().toISOString().split('T')[0] } : i));
        alert(t('lost.item.claim_success'));
     }
  };

  const handleArchiveItem = (id: string) => {
     if(confirm(t('lost.item.archive_confirm'))) {
        setItems(prev => prev.map(i => i.id === id ? { ...i, status: LostItemStatus.DISPOSED } : i));
     }
  };

  const getStatusBadge = (status: LostItemStatus) => {
     switch(status) {
        case LostItemStatus.NEW: return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">{t('lost.status.new')}</span>;
        case LostItemStatus.STORED: return <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">{t('lost.status.stored')}</span>;
        case LostItemStatus.CLAIMED: return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">{t('lost.status.claimed')}</span>;
        case LostItemStatus.DISPOSED: return <span className="bg-slate-200 text-slate-600 px-2 py-1 rounded text-xs font-bold">{t('lost.status.disposed')}</span>;
     }
  };

  const getCategoryLabel = (cat: string) => {
      switch(cat) {
          case LostItemCategory.ELECTRONICS: return t('lost.cat.electronics');
          case LostItemCategory.DOCUMENTS: return t('lost.cat.documents');
          case LostItemCategory.CLOTHING: return t('lost.cat.clothing');
          case LostItemCategory.LUGGAGE: return t('lost.cat.luggage');
          default: return t('lost.cat.other');
      }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Package className="text-amber-600" /> {t('lost.title')}
          </h2>
          <p className="text-xs text-slate-500">{t('lost.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('LIST')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'LIST' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {t('lost.tab.list')}
          </button>
          <button 
            onClick={() => setActiveTab('REGISTER')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'REGISTER' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {t('lost.tab.register')}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
         
         {/* DASHBOARD STATS */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
               <div className="text-xs font-bold text-slate-400 uppercase mb-1">{t('lost.stats.found_month')}</div>
               <div className="text-2xl font-bold text-slate-800">{items.length}</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
               <div className="text-xs font-bold text-slate-400 uppercase mb-1">{t('lost.stats.awaiting')}</div>
               <div className="text-2xl font-bold text-blue-600">{items.filter(i => i.status === LostItemStatus.NEW || i.status === LostItemStatus.STORED).length}</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
               <div className="text-xs font-bold text-slate-400 uppercase mb-1">{t('lost.stats.returned')}</div>
               <div className="text-2xl font-bold text-green-600">{items.filter(i => i.status === LostItemStatus.CLAIMED).length}</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
               <div className="text-xs font-bold text-slate-400 uppercase mb-1">{t('lost.stats.efficiency')}</div>
               <div className="text-2xl font-bold text-slate-800">
                  {Math.round((items.filter(i => i.status === LostItemStatus.CLAIMED).length / Math.max(1, items.length)) * 100)}%
               </div>
            </div>
         </div>

         {activeTab === 'LIST' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap gap-4 justify-between items-center">
                  <div className="relative flex-1">
                     <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                     <input 
                        type="text" 
                        placeholder={t('lost.filter.search')} 
                        className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none text-sm bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                     />
                  </div>
                  <select 
                     className="border rounded-lg text-sm p-2 bg-white outline-none"
                     value={categoryFilter}
                     onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                     <option value="ALL">{t('lost.filter.all_cats')}</option>
                     {Object.values(LostItemCategory).map(c => <option key={c} value={c}>{getCategoryLabel(c)}</option>)}
                  </select>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
                  {filteredItems.map(item => (
                     <div key={item.id} className="border border-slate-200 rounded-xl p-4 flex flex-col hover:shadow-md transition bg-white">
                        <div className="flex justify-between items-start mb-4">
                           <div className={`w-16 h-16 rounded-lg ${item.imagePlaceholderColor || 'bg-slate-200'} flex items-center justify-center text-slate-400`}>
                              <Package size={32}/>
                           </div>
                           <div className="flex flex-col items-end gap-2">
                              {getStatusBadge(item.status)}
                              <span className="text-xs text-slate-400 font-mono">{item.id}</span>
                           </div>
                        </div>
                        
                        <div className="flex-1 mb-4">
                           <h4 className="font-bold text-slate-800 text-lg mb-1">{item.description}</h4>
                           <div className="flex flex-wrap gap-2 mb-2">
                              <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 font-bold">{getCategoryLabel(item.category)}</span>
                           </div>
                           <div className="text-sm text-slate-500 space-y-1">
                              <p className="flex items-center gap-2"><MapPin size={14}/> {t('lost.item.found_at')} {item.locationFound}</p>
                              <p className="flex items-center gap-2"><Archive size={14}/> {t('lost.item.storage')} {item.storageLocation}</p>
                              <p className="text-xs text-slate-400 mt-2">{t('mobile.dash.recent')}: {item.dateFound} {t('common.all')} {item.foundBy}</p>
                           </div>
                        </div>

                        {item.status === LostItemStatus.CLAIMED && (
                           <div className="bg-green-50 p-3 rounded border border-green-100 text-xs text-green-800 mb-4">
                              <p className="font-bold">{t('lost.status.claimed')}: {item.claimDate}</p>
                              <p>{t('dash.notif.to')} {item.ownerName}</p>
                           </div>
                        )}

                        <div className="border-t pt-4 flex justify-between gap-2">
                           <button className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-50 rounded hover:bg-slate-100 border border-slate-200 flex items-center justify-center gap-1">
                              <FileText size={14}/> {t('lost.item.details_btn')}
                           </button>
                           {item.status !== LostItemStatus.CLAIMED && item.status !== LostItemStatus.DISPOSED && (
                              <>
                                 <button 
                                    onClick={() => handleClaimItem(item.id)}
                                    className="flex-1 py-2 text-xs font-bold text-green-700 bg-green-50 rounded hover:bg-green-100 border border-green-200 flex items-center justify-center gap-1"
                                 >
                                    <CheckCircle size={14}/> {t('lost.item.claim_btn')}
                                 </button>
                                 <button 
                                    onClick={() => handleArchiveItem(item.id)}
                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                                    title={t('lost.item.archive_btn')}
                                 >
                                    <Trash2 size={16}/>
                                 </button>
                              </>
                           )}
                        </div>
                     </div>
                  ))}
                  {filteredItems.length === 0 && (
                     <div className="col-span-full py-12 text-center text-slate-400">
                        <Package size={48} className="mx-auto mb-4 opacity-50"/>
                        <p>{t('res.empty')}</p>
                     </div>
                  )}
               </div>
            </div>
         )}

         {activeTab === 'REGISTER' && (
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8 animate-fade-in">
               <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Plus size={24} className="text-amber-600"/> {t('lost.reg.title')}
               </h3>
               
               <div className="space-y-6">
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">{t('lost.reg.desc_label')}</label>
                     <input 
                        type="text" 
                        className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                        placeholder={t('lost.reg.desc_placeholder')}
                        value={newItem.description}
                        onChange={e => setNewItem({...newItem, description: e.target.value})}
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">{t('lost.reg.cat_label')}</label>
                        <select 
                           className="w-full border p-3 rounded-lg bg-white"
                           value={newItem.category}
                           onChange={e => setNewItem({...newItem, category: e.target.value as LostItemCategory})}
                        >
                           {Object.values(LostItemCategory).map(c => <option key={c} value={c}>{getCategoryLabel(c)}</option>)}
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">{t('lost.reg.date_label')}</label>
                        <input 
                           type="date" 
                           className="w-full border p-3 rounded-lg bg-white"
                           value={newItem.dateFound}
                           onChange={e => setNewItem({...newItem, dateFound: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">{t('lost.reg.loc_label')}</label>
                        <input 
                           type="text" 
                           className="w-full border p-3 rounded-lg bg-white"
                           placeholder={t('lost.reg.loc_placeholder')}
                           value={newItem.locationFound}
                           onChange={e => setNewItem({...newItem, locationFound: e.target.value})}
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">{t('lost.reg.store_label')}</label>
                        <input 
                           type="text" 
                           className="w-full border p-3 rounded-lg bg-white"
                           placeholder={t('lost.reg.store_placeholder')}
                           value={newItem.storageLocation}
                           onChange={e => setNewItem({...newItem, storageLocation: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 cursor-pointer transition">
                     <Camera size={32} className="mb-2"/>
                     <span className="font-bold text-sm">{t('lost.reg.photo_label')}</span>
                  </div>

                  <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                     <button onClick={() => setActiveTab('LIST')} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-lg">{t('common.cancel')}</button>
                     <button onClick={handleRegisterItem} className="px-8 py-3 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 shadow-md">
                        {t('lost.reg.save_btn')}
                     </button>
                  </div>
               </div>
            </div>
         )}

      </div>
    </div>
  );
};

export default LostAndFoundModule;
