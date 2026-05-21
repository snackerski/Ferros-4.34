import React, { useState, useEffect } from 'react';
import { Settings, Save, Calendar, DollarSign, AlertTriangle, Plus, Trash2, Anchor, Shield, User, Lock, Activity, Users, Search, Ban, Cpu, Clock, Sliders, Play, RotateCw, Tag, ShoppingBag, Percent, Layout, Upload, Download, FileSpreadsheet, TrendingUp, Layers, CheckSquare, Database, Calculator, FileText, Grid, CalendarDays, Ship, AlertOctagon, CheckCircle, RefreshCw, Terminal, HardDrive, Key, ListChecks, ArrowRight, Edit, Unlock, Loader, ArrowLeft, Check, X, FileWarning, Truck, Bed, UserPlus, Baby, Ticket, Printer, Gauge, Timer, BarChart3, Coins } from 'lucide-react';
import { MOCK_ROUTES, MOCK_PRICING_RULES, MOCK_CABIN_PRICES, MOCK_USERS, MOCK_BLACKLIST, MOCK_AUDIT_LOGS, MOCK_TIME_LIMIT_RULES, MOCK_SYSTEM_CONFIG, MOCK_DISCOUNT_CODES, MOCK_SYSTEM_JOBS, MOCK_SCHEDULE_DEFINITIONS, MOCK_PRODUCTS, MOCK_SURCHARGES, MOCK_REGULATORY_DISCOUNTS, MOCK_FARE_CLASSES, MOCK_YIELD_BUCKETS, MOCK_RESERVATIONS, MOCK_SHIPS, MOCK_API_LOGS, MOCK_ROLE_PERMISSIONS, MOCK_MENU_DEFINITIONS, MOCK_SAILING_SCHEDULES } from '../services/mockData';
import { Route, PricingRule, CabinPriceDefinition, SystemUser, BlacklistEntry, AuditLogEntry, BlacklistType, BlacklistSeverity, TimeLimitRule, SystemConfig, DiscountCode, SystemJob, ScheduleDefinition, Product, Surcharge, RegulatoryDiscount, FareClass, YieldBucket, BookingStatus, CabinType, VehicleType, ShipConfig, RolePermissionConfig, SailingSchedule, SailingStatus, DeckDefinition } from '../types';
import { useTranslation } from '../i18n';

const AdministrationModule: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'PRICING' | 'OFFER' | 'USERS' | 'BLACKLIST' | 'AUDIT' | 'MIGRATION' | 'FLEET' | 'PERMISSIONS' | 'STATUS'>('PRICING');

  return (
    <div className="flex flex-col h-full bg-slate-100">
      {/* Admin Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-10 overflow-x-auto text-nowrap">
        <div className="flex-shrink-0 mr-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="text-slate-600" /> {t('admin.title')}
          </h2>
          <p className="text-xs text-slate-500">{t('admin.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('STATUS')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap flex items-center gap-2 ${activeTab === 'STATUS' ? 'bg-blue-600 text-white' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
          >
            <ListChecks size={16}/> {t('admin.tabs.status')}
          </button>
          <div className="w-px h-8 bg-slate-300 mx-2"></div>
          <button 
            onClick={() => setActiveTab('FLEET')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'FLEET' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {t('admin.tabs.fleet')}
          </button>
          <button 
            onClick={() => setActiveTab('PRICING')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'PRICING' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {t('admin.tabs.pricing')}
          </button>
          <button 
            onClick={() => setActiveTab('OFFER')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'OFFER' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {t('admin.tabs.offer')}
          </button>
          <button 
            onClick={() => setActiveTab('USERS')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'USERS' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {t('admin.tabs.users')}
          </button>
          <button 
            onClick={() => setActiveTab('PERMISSIONS')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'PERMISSIONS' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {t('admin.tabs.permissions')}
          </button>
          <button 
            onClick={() => setActiveTab('BLACKLIST')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'BLACKLIST' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {t('admin.tabs.blacklist')}
          </button>
          <button 
            onClick={() => setActiveTab('MIGRATION')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'MIGRATION' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {t('admin.tabs.migration')}
          </button>
          <button 
            onClick={() => setActiveTab('AUDIT')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'AUDIT' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {t('admin.tabs.audit')}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'STATUS' && <ProjectStatusTab />}
        {activeTab === 'FLEET' && <FleetTab />}
        {activeTab === 'PRICING' && <PricingTab />}
        {activeTab === 'OFFER' && <OfferTab />}
        {activeTab === 'USERS' && <UsersTab />}
        {activeTab === 'PERMISSIONS' && <PermissionsTab />}
        {activeTab === 'BLACKLIST' && <BlacklistTab />}
        {activeTab === 'MIGRATION' && <MigrationTab />}
        {activeTab === 'AUDIT' && <AuditTab />}
      </div>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const YieldTab: React.FC = () => {
    const { t } = useTranslation();
    const [buckets, setBuckets] = useState<YieldBucket[]>(MOCK_YIELD_BUCKETS);
    const [fareClasses, setFareClasses] = useState<FareClass[]>(MOCK_FARE_CLASSES);
    const [surcharges, setSurcharges] = useState<Surcharge[]>(MOCK_SURCHARGES);

    const yieldKpis = [
        { label: t('yield.kpi.avg_pax'), value: '312 PLN', icon: <Users size={18}/>, color: 'text-indigo-600', trend: '+4.2%' },
        { label: t('yield.kpi.avg_cargo'), value: '45 PLN/m', icon: <Truck size={18}/>, color: 'text-amber-600', trend: '+1.5%' },
        { label: t('yield.kpi.load_factor'), value: '76.4%', icon: <Gauge size={18}/>, color: 'text-emerald-600', trend: 'OPTIMAL' },
        { label: 'Revenue Forecast', value: '1.2M PLN', icon: <TrendingUp size={18}/>, color: 'text-blue-600', trend: '+12%' },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
            {/* Yield KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {yieldKpis.map((kpi, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition group">
                        <div className="flex justify-between items-start mb-3">
                            <div className={`p-2 rounded-xl bg-slate-50 ${kpi.color} group-hover:scale-110 transition-transform`}>
                                {kpi.icon}
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.trend}</span>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{kpi.label}</p>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tighter">{kpi.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* PROGI YIELD (BUCKETS) */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <h3 className="font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                                <BarChart3 size={20} className="text-indigo-500"/> {t('yield.buckets.title')}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">{t('yield.buckets.desc')}</p>
                        </div>
                        <button className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                            <Plus size={16}/>
                        </button>
                    </div>
                    <div className="p-6 space-y-6">
                        {buckets.map((bucket, idx) => (
                            <div key={bucket.id} className="relative group">
                                <div className="flex justify-between items-end mb-2">
                                    <div className="text-sm font-bold text-slate-700">
                                        {t('yield.buckets.occupancy')}: {bucket.occupancyMin}% - {bucket.occupancyMax}%
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-black text-indigo-600">x{bucket.priceMultiplier.toFixed(2)}</span>
                                        <button className="text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"><Trash2 size={14}/></button>
                                    </div>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                    <div className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" style={{ marginLeft: `${bucket.occupancyMin}%`, width: `${bucket.occupancyMax - bucket.occupancyMin}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* DOPŁATY (SURCHARGES) */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <h3 className="font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                                <Coins size={20} className="text-amber-500"/> {t('yield.surcharges.title')}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">{t('yield.surcharges.desc')}</p>
                        </div>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <tr>
                                    <th className="p-4">Opłata</th>
                                    <th className="p-4 text-right">{t('yield.surcharges.amount')}</th>
                                    <th className="p-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {surcharges.map(s => (
                                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-bold text-slate-700">{s.name}</td>
                                        <td className="p-4 text-right">
                                            <input 
                                                type="number" 
                                                defaultValue={s.amount} 
                                                className="w-20 text-right border-none bg-slate-100 p-1.5 rounded-lg font-mono font-bold text-slate-800 focus:ring-2 focus:ring-amber-500"
                                            />
                                            <span className="text-[10px] text-slate-400 ml-2 font-bold">{s.type === 'FIXED' ? 'PLN' : '%'}</span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="w-10 h-5 bg-emerald-500 rounded-full relative mx-auto cursor-pointer">
                                                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* KLASY TARYFOWE */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                        <Tag size={20} className="text-blue-500"/> {t('yield.classes.title')}
                    </h3>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center gap-2">
                        <Plus size={14}/> Nowa Klasa
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                            <tr>
                                <th className="p-5">{t('yield.classes.name')}</th>
                                <th className="p-5 text-center">Mnożnik x</th>
                                <th className="p-5 text-center">{t('yield.classes.refund')}</th>
                                <th className="p-5 text-center">{t('yield.classes.change')}</th>
                                <th className="p-5">Korzyści (Wartość dodana)</th>
                                <th className="p-5 text-right">Akcje</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {fareClasses.map(fc => (
                                <tr key={fc.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="p-5">
                                        <div className="font-black text-slate-800">{fc.name}</div>
                                        <div className="text-[10px] font-mono text-slate-400">{fc.code}</div>
                                    </td>
                                    <td className="p-5 text-center">
                                        <span className="font-black text-blue-600">x{fc.priceMultiplier.toFixed(2)}</span>
                                    </td>
                                    <td className="p-5 text-center">
                                        {fc.isRefundable ? <Check size={18} className="text-emerald-500 mx-auto" strokeWidth={3}/> : <X size={18} className="text-red-300 mx-auto"/>}
                                    </td>
                                    <td className="p-5 text-center">
                                        {fc.isChangeable ? <Check size={18} className="text-emerald-500 mx-auto" strokeWidth={3}/> : <X size={18} className="text-red-300 mx-auto"/>}
                                    </td>
                                    <td className="p-5">
                                        <div className="flex gap-2">
                                            {fc.includesMeal && <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-100">Posiłek</span>}
                                            <span className="bg-slate-50 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-100">Priority Boarding</span>
                                        </div>
                                    </td>
                                    <td className="p-5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit size={16}/></button>
                                            <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={16}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4 items-start">
                <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20}/>
                <div className="text-sm">
                    <h4 className="font-black text-amber-900 uppercase tracking-tight text-xs mb-1 italic">Uwaga: Zmiany w klasach taryfowych</h4>
                    <p className="text-amber-800/80 leading-relaxed">Aktualizacja klas taryfowych wpłynie na cenę wszystkich nowych rezerwacji natychmiast po zapisaniu. Rezerwacje istniejące zachowają pierwotne warunki cenowe.</p>
                </div>
            </div>
        </div>
    );
};

const OfferTab: React.FC = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  const handlePriceChange = (id: string, newPrice: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, pricePln: newPrice } : p));
  };

  const handleTaxChange = (id: string, newTax: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, taxRate: newTax } : p));
  };

  const handleSave = () => {
    alert(t('admin.pricing.save'));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800 text-xl flex items-center gap-2">
            <ShoppingBag size={20} className="text-blue-600"/> {t('admin.offer.title')}
        </h3>
        <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-sm"
        >
            <Save size={18}/> {t('admin.pricing.save')}
        </button>
      </div>
      
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200">
          <tr>
            <th className="p-3">{t('sales.custom.name')}</th>
            <th className="p-3">{t('lost.reg.cat_label')}</th>
            <th className="p-3 text-right">{t('sales.custom.price')} (Net)</th>
            <th className="p-3">{t('sales.custom.tax')}</th>
            <th className="p-3 text-right">{t('sales.cart.total')} (Gross)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map(p => (
            <tr key={p.id} className="hover:bg-slate-50">
              <td className="p-3 font-medium text-slate-800">{p.name}</td>
              <td className="p-3">
                <span className="text-xs bg-slate-100 px-2 py-1 rounded border border-slate-200">{p.category}</span>
              </td>
              <td className="p-3 text-right">
                <div className="flex justify-end items-center gap-2">
                    <input 
                        type="number" 
                        value={p.pricePln}
                        onChange={(e) => handlePriceChange(p.id, parseFloat(e.target.value))}
                        className="w-24 border border-slate-300 rounded p-1 text-right font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        step="0.01"
                    />
                </div>
              </td>
              <td className="p-3">
                <select 
                    value={p.taxRate}
                    onChange={(e) => handleTaxChange(p.id, parseFloat(e.target.value))}
                    className="border border-slate-300 rounded p-1 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                    <option value="0.23">23%</option>
                    <option value="0.08">8%</option>
                    <option value="0.05">5%</option>
                    <option value="0">0% (ZW)</option>
                </select>
              </td>
              <td className="p-3 text-right font-bold text-slate-700">
                {(p.pricePln * (1 + p.taxRate)).toFixed(2)} PLN
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const FleetTab: React.FC = () => {
   const { t } = useTranslation();
   const [ships, setShips] = useState<ShipConfig[]>(MOCK_SHIPS);
   const [selectedShip, setSelectedShip] = useState<ShipConfig | null>(null);
   
   const [decks, setDecks] = useState<DeckDefinition[]>([
      { id: 'D1', number: 3, shipId: 'SHIP-1', type: 'CARGO', capacity: 1200, details: 'Main Deck' },
      { id: 'D2', number: 4, shipId: 'SHIP-1', type: 'CARGO', capacity: 800, details: 'Upper Deck' },
      { id: 'D3', number: 5, shipId: 'SHIP-1', type: 'PAX', capacity: 250, details: 'Cabins' },
      { id: 'D4', number: 7, shipId: 'SHIP-1', type: 'PAX', capacity: 150, details: 'Crew' },
   ]);

   const [newDeck, setNewDeck] = useState<Partial<DeckDefinition>>({
      number: 0,
      type: 'CARGO',
      capacity: 0,
      details: ''
   });

   const handleAddDeck = () => {
      if (!newDeck.number || !newDeck.capacity || !selectedShip) return;
      const deck: DeckDefinition = {
         id: `D-${Date.now()}`,
         shipId: selectedShip.id,
         number: newDeck.number,
         type: newDeck.type as 'CARGO' | 'PAX' | 'MIXED',
         capacity: newDeck.capacity,
         details: newDeck.details || ''
      };
      setDecks([...decks, deck].sort((a, b) => a.number - b.number));
      setNewDeck({ number: 0, type: 'CARGO', capacity: 0, details: '' });
   };

   const handleDeleteDeck = (id: string) => {
      setDecks(decks.filter(d => d.id !== id));
   };

   return (
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
         <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div>
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Ship size={24} className="text-blue-600"/> {t('admin.fleet.title')}
               </h3>
               <p className="text-sm text-slate-500">{t('admin.fleet.desc')}</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 flex items-center gap-2">
               <Plus size={18}/> {t('admin.fleet.add')}
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ships.map(ship => (
               <div key={ship.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <div className="text-xs text-slate-400 font-bold uppercase">{ship.code}</div>
                        <h4 className="text-xl font-bold text-slate-800">{ship.name}</h4>
                     </div>
                     <span className="bg-slate-100 px-2 py-1 rounded text-slate-500 font-mono text-xs">{ship.id}</span>
                  </div>

                  <div className="space-y-3 mb-6">
                     <div className="flex justify-between text-sm border-b border-slate-50 pb-2">
                        <span className="text-slate-500">{t('admin.fleet.pax')}</span>
                        <span className="font-bold text-slate-700">{ship.paxCapacity}</span>
                     </div>
                     <div className="flex justify-between text-sm border-b border-slate-50 pb-2">
                        <span className="text-slate-500">{t('admin.fleet.lane')}</span>
                        <span className="font-bold text-slate-700">{ship.laneMeters} m</span>
                     </div>
                     <div className="flex justify-between text-sm border-b border-slate-50 pb-2">
                        <span className="text-slate-500">{t('admin.fleet.speed')}</span>
                        <span className="font-bold text-slate-700">{ship.maxSpeed} kn</span>
                     </div>
                     <div className="flex justify-between text-sm border-b border-slate-50 pb-2">
                        <span className="text-slate-500">{t('admin.fleet.year')}</span>
                        <span className="font-bold text-slate-700">{ship.buildYear}</span>
                     </div>
                  </div>

                  <div className="flex gap-2">
                     <button className="flex-1 py-2 bg-white border border-slate-200 text-slate-600 rounded text-sm font-bold hover:bg-slate-50">
                        {t('admin.fleet.edit')}
                     </button>
                     <button 
                        onClick={() => setSelectedShip(ship)}
                        className="flex-1 py-2 bg-blue-50 border border-blue-100 text-blue-600 rounded text-sm font-bold hover:bg-blue-100 flex justify-center items-center gap-1"
                     >
                        <Layers size={14}/> {t('admin.fleet.config_decks')}
                     </button>
                  </div>
               </div>
            ))}
         </div>

         {selectedShip && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
               <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
                  <div className="bg-slate-900 text-white p-6 rounded-t-xl flex justify-between items-center">
                     <div>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                           <Layers size={24} className="text-blue-400"/> {t('admin.fleet.config_decks')}
                        </h3>
                        <p className="text-slate-400 text-xs mt-1">{t('routes.timeline.ship')}: <span className="font-bold text-white">{selectedShip.name}</span></p>
                     </div>
                     <button onClick={() => setSelectedShip(null)} className="text-slate-400 hover:text-white">
                        <X size={24}/>
                     </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                     <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                           <h4 className="font-bold text-slate-700 mb-3 text-sm flex items-center gap-2">
                              <Plus size={16}/> {t('admin.fleet.add')}
                           </h4>
                           <div className="grid grid-cols-4 gap-3 items-end">
                              <div>
                                 <label className="block text-xs font-bold text-slate-500 mb-1">{t('resrc.deck.num', {num: ''})}</label>
                                 <input 
                                    type="number" 
                                    className="w-full border p-2 rounded text-sm bg-white"
                                    placeholder="np. 3"
                                    value={newDeck.number || ''}
                                    onChange={e => setNewDeck({...newDeck, number: parseInt(e.target.value)})}
                                 />
                              </div>
                              <div>
                                 <label className="block text-xs font-bold text-slate-500 mb-1">{t('sales.history.col_type')}</label>
                                 <select 
                                    className="w-full border p-2 rounded text-sm bg-white"
                                    value={newDeck.type}
                                    onChange={e => setNewDeck({...newDeck, type: e.target.value as any})}
                                 >
                                    <option value="CARGO">Cargo</option>
                                    <option value="PAX">Pax</option>
                                    <option value="MIXED">Mixed</option>
                                 </select>
                              </div>
                              <div>
                                 <label className="block text-xs font-bold text-slate-500 mb-1">Capacity</label>
                                 <input 
                                    type="number" 
                                    className="w-full border p-2 rounded text-sm bg-white"
                                    placeholder="..."
                                    value={newDeck.capacity || ''}
                                    onChange={e => setNewDeck({...newDeck, capacity: parseInt(e.target.value)})}
                                 />
                              </div>
                              <button 
                                 onClick={handleAddDeck}
                                 className="bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700 text-sm h-[38px]"
                              >
                                 {t('common.confirm')}
                              </button>
                           </div>
                        </div>

                        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                           <table className="w-full text-left text-sm">
                              <thead className="bg-slate-50 text-slate-500 uppercase text-xs border-b border-slate-200">
                                 <tr>
                                    <th className="p-3">{t('resrc.deck.num', {num: ''})}</th>
                                    <th className="p-3">{t('sales.history.col_type')}</th>
                                    <th className="p-3 text-right">Capacity</th>
                                    <th className="p-3 text-right">Actions</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                 {decks.map(deck => (
                                    <tr key={deck.id}>
                                       <td className="p-3 font-bold">{deck.number}</td>
                                       <td className="p-3">{deck.type}</td>
                                       <td className="p-3 text-right">{deck.capacity}</td>
                                       <td className="p-3 text-right">
                                          <button onClick={() => handleDeleteDeck(deck.id)} className="text-red-500 hover:text-red-700">
                                             <Trash2 size={16}/>
                                          </button>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

const ProjectStatusTab: React.FC = () => {
   const { t } = useTranslation();
   const stages = [
      { id: '1.4', category: 'Admin', name: 'Zarządzanie Flotą', status: 'DONE' },
      { id: '1.5', category: 'Admin', name: 'Generator Rozkładu', status: 'DONE' },
      { id: '1.6', category: 'Admin', name: 'Cenniki Bazowe i Sezonowość', status: 'DONE' },
      { id: '1.9', category: 'Admin', name: 'Kody Rabatowe', status: 'DONE' },
      { id: '1.11', category: 'Admin', name: 'Klasy Cenowe (Yield)', status: 'DONE' },
      { id: '1.12', category: 'Admin', name: 'Reguły Time Limit', status: 'DONE' },
      { id: '1.13', category: 'Admin', name: 'Konfiguracja Systemowa', status: 'DONE' },
      { id: '1.14', category: 'Zasoby', name: 'Plan Pokładów (Car Deck)', status: 'DONE' },
      { id: '1.15', category: 'Zasoby', name: 'Alokacja Kabin', status: 'DONE' },
      { id: '2.3', category: 'Admin', name: 'Powiadomienia Systemowe', status: 'DONE' },
      { id: '2.5', category: 'Infra', name: 'Struktura Organizacyjna', status: 'DONE' },
      { id: '2.6', category: 'Infra', name: 'Konfiguracja Urządzeń', status: 'DONE' },
      { id: '3.2', category: 'Rezerwacje', name: 'Obsługa Waiting Listy', status: 'DONE' },
      { id: '4.1', category: 'Rezerwacje', name: 'Symulator Cenowy', status: 'DONE' },
      { id: '4.3', category: 'Rezerwacje', name: 'Wyszukiwanie Zaawansowane', status: 'DONE' },
      { id: '4.5', category: 'Rezerwacje', name: 'Historia Zmian', status: 'DONE' },
      { id: '4.7', category: 'Rezerwacje', name: 'Wydruki Biletów', status: 'DONE' },
      { id: '4.9', category: 'Rezerwacje', name: 'Edycja Rezerwacji', status: 'DONE' },
      { id: '4.10', category: 'Rezerwacje', name: 'Anulacje', status: 'DONE' },
      { id: '4.11', category: 'Rezerwacje', name: 'Karnety (Sprzedaż)', status: 'DONE' },
      { id: '4.13', category: 'Rezerwacje', name: 'Rezerwacje Powrotne', status: 'DONE' },
      { id: '4.15', category: 'Rezerwacje', name: 'Wykorzystanie Karnetów', status: 'DONE' },
      { id: '5.1', category: 'Agenci', name: 'Kartoteka Agentów', status: 'DONE' },
      { id: '5.2', category: 'Agenci', name: 'Prowizje Progresywne', status: 'DONE' },
      { id: '5.3', category: 'Agenci', name: 'Rozliczenia / Noty', status: 'DONE' },
      { id: '6.2', category: 'Grupy', name: 'Zarządzanie Grupami', status: 'DONE' },
      { id: '6.3', category: 'Grupy', name: 'Bilety Grupowe i Płatności', status: 'DONE' },
      { id: '6.4', category: 'Grupy', name: 'Alokacja Kabin Grupowych', status: 'DONE' },
      { id: '7.1', category: 'Odprawa', name: 'Proces Odprawy (Check-in)', status: 'DONE' },
      { id: '7.2', category: 'Odprawa', name: 'Kodowanie Kart Kabinowych', status: 'DONE' },
      { id: '7.3', category: 'Odprawa', name: 'Wydawanie RFID', status: 'DONE' },
      { id: '7.4', category: 'Odprawa', name: 'Karty Pokładowe', status: 'DONE' },
      { id: '7.5', category: 'Odprawa', name: 'Test Urządzeń', status: 'DONE' },
      { id: '7.6', category: 'Odprawa', name: 'Cofnięcie Odprawy', status: 'DONE' },
      { id: '7.8', category: 'Odprawa', name: 'Sync Kolektorów', status: 'DONE' },
      { id: '7.9', category: 'Odprawa', name: 'Zamykanie Odprawy', status: 'DONE' },
      { id: '8.1', category: 'Sprzedaż', name: 'Kursy Walut (NBP)', status: 'DONE' },
      { id: '8.3', category: 'Sprzedaż', name: 'Katalog Produktów', status: 'DONE' },
      { id: '8.4', category: 'Sprzedaż', name: 'Konfiguracja Dokumentów', status: 'DONE' },
      { id: '9.1', category: 'Sprzedaż', name: 'Koszyk Zakupowy (POS)', status: 'DONE' },
      { id: '9.3', category: 'Sprzedaż', name: 'Płatności Wielowalutowe', status: 'DONE' },
      { id: '9.4', category: 'Sprzedaż', name: 'Sprzedaż Uniwersalna', status: 'DONE' },
      { id: '10.1', category: 'Sprzedaż', name: 'Paragony Fiskalne', status: 'DONE' },
      { id: '10.3', category: 'Sprzedaż', name: 'Faktury VAT', status: 'DONE' },
      { id: '10.5', category: 'Sprzedaż', name: 'Dane Kontrahenta', status: 'DONE' },
      { id: '10.6', category: 'Sprzedaż', name: 'Korekty', status: 'DONE' },
      { id: '10.7', category: 'Sprzedaż', name: 'Historia Sprzedaży', status: 'DONE' },
      { id: '10.8', category: 'Sprzedaż', name: 'Archiwum Zmian', status: 'DONE' },
      { id: '11.1', category: 'Raporty', name: 'Manifest Pasażerski', status: 'DONE' },
      { id: '11.2', category: 'Raporty', name: 'Manifest Ładunkowy', status: 'DONE' },
      { id: '11.5', category: 'Raporty', name: 'Raport Waiting List', status: 'DONE' },
      { id: '11.6', category: 'Raporty', name: 'Raport Dostępności', status: 'DONE' },
      { id: '11.7', category: 'Raporty', name: 'Raport Karnetów', status: 'DONE' },
      { id: '12.1', category: 'Odprawa', name: 'Dashboard Operacyjny', status: 'DONE' },
      { id: '12.2', category: 'Odprawa', name: 'Rozliczanie Różnic (Non-Show)', status: 'DONE' },
      { id: '12.4', category: 'Raporty', name: 'Raport Załadowanych', status: 'DONE' },
      { id: '12.5', category: 'Odprawa', name: 'Raport Portowy', status: 'DONE' },
      { id: '13.1', category: 'Raporty', name: 'Raport Eksploatacyjny', status: 'DONE' },
      { id: '13.3', category: 'Raporty', name: 'Bilety Niewykorzystane', status: 'DONE' },
      { id: '14.1', category: 'Finanse', name: 'Raport Zmianowy Kasjera', status: 'DONE' },
      { id: '15.1', category: 'Raporty', name: 'Raport Sprzedaży Dziennej', status: 'DONE' },
      { id: '15.3', category: 'Raporty', name: 'Sprzedaż Produktów', status: 'DONE' },
      { id: '15.6', category: 'Raporty', name: 'Raport Zwrotów', status: 'DONE' },
      { id: '15.7', category: 'Raporty', name: 'Raport Zniżek', status: 'DONE' },
      { id: '15.8', category: 'Raporty', name: 'Sprzedaż Interline', status: 'DONE' },
      { id: '15.9', category: 'Raporty', name: 'Sprzedaż Agencyjna', status: 'DONE' },
      { id: '15.10', category: 'Raporty', name: 'Rejestr Potwierdzeń', status: 'DONE' },
      { id: '18.1', category: 'CRM', name: 'Konta Web (User Management)', status: 'DONE' },
      { id: '18.5', category: 'CRM', name: 'Dane Osobowe Klienta', status: 'DONE' },
      { id: '19', category: 'CRM', name: 'Moje Rezerwacje (Client Portal)', status: 'DONE' },
      { id: '20.1', category: 'CRM', name: 'Porzucone Koszyki', status: 'DONE' },
      { id: '21.4', category: 'Admin', name: 'Migracja Danych Legacy', status: 'DONE' },
      { id: '22.1', category: 'Ops', name: 'Reprotekcja Pasażerów', status: 'DONE' },
      { id: '23.1', category: 'Ops', name: 'Szablony Powiadomień', status: 'DONE' },
      { id: '24.1', category: 'Finanse', name: 'Import Wyciągów (MT940)', status: 'DONE' },
      { id: '24.4', category: 'Odprawa', name: 'Alert Czarnej Listy', status: 'DONE' },
      { id: '25.1', category: 'Grupy', name: 'Import List Pasażerów (CSV)', status: 'DONE' },
      { id: '25.4', category: 'Grupy', name: 'Integracja Touroperatorów', status: 'DONE' },
      { id: '25.6', category: 'Grupy', name: 'Rooming List', status: 'DONE' },
      { id: '25.7', category: 'Grupy', name: 'Logistyka / Catering', status: 'DONE' },
      { id: '26.2', category: 'Cargo', name: 'Zarządzanie Allotmentami', status: 'DONE' },
      { id: '26.3', category: 'Cargo', name: 'Cennik Ogólny Cargo', status: 'DONE' },
      { id: '26.4', category: 'Cargo', name: 'Umowy Indywidualne', status: 'DONE' },
      { id: '26.5', category: 'Cargo', name: 'Rabaty Progresywne', status: 'DONE' },
      { id: '26.11', category: 'Cargo', name: 'Słownik Pojazdów', status: 'DONE' },
      { id: '26.12', category: 'Cargo', name: 'Słownik Kierowców', status: 'DONE' },
      { id: '26.14', category: 'Cargo', name: 'Zwalnianie Allotmentów', status: 'DONE' },
      { id: '27.13', category: 'Cargo', name: 'Bilety Kredytowe', status: 'DONE' },
      { id: '27.15', category: 'Cargo', name: 'Zmiana Ważności Biletu', status: 'DONE' },
      { id: '28', category: 'Cargo', name: 'Drobnica / Konosamenty', status: 'DONE' },
      { id: '29.5', category: 'Cargo', name: 'Autoryzacja Nadlimitów', status: 'DONE' },
      { id: '29.6', category: 'Cargo', name: 'Fakturowanie Zbiorcze', status: 'DONE' },
      { id: '29.9', category: 'Cargo', name: 'EDI / API', status: 'DONE' },
      { id: '30.1', category: 'Raporty', name: 'Harmonogram Raportów', status: 'DONE' },
      { id: '30.2', category: 'Ops', name: 'Smart Gates Monitor', status: 'DONE' },
      { id: '31.1', category: 'Ops', name: 'Rachunek Pokładowy (Onboard)', status: 'DONE' },
      { id: '33.1', category: 'Finanse', name: 'Eksport do Księgowości', status: 'DONE' },
      { id: '34', category: 'CRM', name: 'Program Lojalnościowy', status: 'DONE' },
      { id: '35.3', category: 'CRM', name: 'Ankiety NPS', status: 'DONE' },
      { id: '36', category: 'CRM', name: 'Moduł Reklamacji', status: 'DONE' },
      { id: '37.2', category: 'Cargo', name: 'Raport Operacyjny Cargo', status: 'DONE' },
      { id: '37.3', category: 'Cargo', name: 'Manifest Ładunkowy', status: 'DONE' },
      { id: '37.5', category: 'Cargo', name: 'Statystyki Przewoźników', status: 'DONE' },
      { id: '37.10', category: 'Admin', name: 'Czarne Listy', status: 'DONE' },
      { id: '38.3', category: 'Ops', name: 'Poziomy ISPS', status: 'DONE' },
      { id: '39.1', category: 'Ops', name: 'Raportowanie PHICS', status: 'DONE' },
      { id: '39.2', category: 'Analizy', name: 'Analiza Wydatków', status: 'DONE' },
      { id: '40.1', category: 'Sprzedaż', name: 'Oferty Specjalne', status: 'DONE' },
      { id: '40.3', category: 'CRM', name: 'Program Partnerski (Affiliates)', status: 'DONE' },
      { id: '42.1', category: 'Sprzedaż', name: 'Rezerwacja Cargo (Wizard)', status: 'DONE' },
      { id: '43.1', category: 'CallCenter', name: 'Identyfikacja Klienta (CTI)', status: 'DONE' },
      { id: '43.2', category: 'Admin', name: 'Konfiguracja Analytics', status: 'DONE' },
      { id: '43.4', category: 'Ops', name: 'Monitor API / Kanały Zew.', status: 'DONE' },
      { id: '43.5', category: 'Help', name: 'Helpdesk / Baza Wiedzy', status: 'DONE' },
      { id: '44', category: 'Ops', name: 'Kadry Morskie (Crewing)', status: 'DONE' },
      { id: '45', category: 'Ops', name: 'Biuro Rzeczy Znalezionych', status: 'DONE' },
   ];

   const categories = Array.from(new Set(stages.map(s => s.category)));
   const doneCount = stages.filter(s => s.status === 'DONE').length;

   return (
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
               <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-4 rounded-full text-green-600">
                     <CheckCircle size={32}/>
                  </div>
                  <div>
                     <h3 className="text-2xl font-bold text-slate-800">{t('admin.status.title')}</h3>
                     <p className="text-sm text-slate-500">{t('admin.status.desc')}</p>
                  </div>
               </div>
               <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">{Math.round((doneCount / stages.length) * 100)}%</div>
                  <div className="text-xs font-bold text-slate-400 uppercase">DONE ({doneCount}/{stages.length})</div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {categories.map(cat => (
                  <div key={cat} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                     <div className="p-3 bg-slate-100 border-b border-slate-200 font-bold text-slate-700 text-sm flex justify-between">
                        <span>{cat}</span>
                        <span className="text-xs bg-white px-2 py-0.5 rounded border">{stages.filter(s => s.category === cat).length}</span>
                     </div>
                     <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                        {stages.filter(s => s.category === cat).map(stage => (
                           <div key={stage.id} className="p-3 flex justify-between items-center text-sm hover:bg-white transition">
                              <div className="flex gap-2">
                                 <span className="font-mono font-bold text-slate-500 text-xs w-10">{stage.id}</span>
                                 <span className="text-slate-700">{stage.name}</span>
                              </div>
                              <CheckCircle size={14} className="text-green-500"/>
                           </div>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

const PermissionsTab: React.FC = () => {
   const { t } = useTranslation();
   const [permissions, setPermissions] = useState<RolePermissionConfig>(MOCK_ROLE_PERMISSIONS);
   const roles = ['ADMIN', 'MVP', 'MANAGER', 'CASHIER', 'CHECKIN_AGENT'];

   const togglePermission = (role: string, menuId: string) => {
      setPermissions(prev => {
         const rolePerms = prev[role] || [];
         if (rolePerms.includes(menuId)) {
            return { ...prev, [role]: rolePerms.filter(id => id !== menuId) };
         } else {
            return { ...prev, [role]: [...rolePerms, menuId] };
         }
      });
   };

   const handleSave = () => {
      Object.assign(MOCK_ROLE_PERMISSIONS, permissions);
      alert(t('admin.permissions.save'));
   };

   return (
      <div className="max-w-6xl mx-auto animate-fade-in space-y-6">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
               <div>
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                     <Lock size={24} className="text-slate-600"/> {t('admin.permissions.title')}
                  </h3>
                  <p className="text-sm text-slate-500">{t('admin.permissions.desc')}</p>
               </div>
               <button 
                  onClick={handleSave}
                  className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 flex items-center gap-2"
               >
                  <Save size={18}/> {t('admin.permissions.save')}
               </button>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm border-collapse">
                  <thead>
                     <tr className="bg-slate-100 border-b border-slate-200">
                        <th className="p-4 font-bold text-slate-600 uppercase text-xs w-1/3">{t('admin.permissions.module')}</th>
                        {roles.map(role => (
                           <th key={role} className="p-4 text-center font-bold text-slate-600 uppercase text-xs border-l border-slate-200">
                              {role.replace('_', ' ')}
                           </th>
                        ))}
                     </tr>
                  </thead>
                  <tbody>
                     {MOCK_MENU_DEFINITIONS.map(menuItem => (
                        <tr key={menuItem.id} className="hover:bg-slate-50 border-b border-slate-100">
                           <td className="p-4">
                              <div className="font-bold text-slate-700">{menuItem.label}</div>
                              <div className="text-xs text-slate-400 font-mono">{menuItem.id}</div>
                           </td>
                           {roles.map(role => {
                              const isAllowed = permissions[role]?.includes(menuItem.id);
                              return (
                                 <td key={`${role}-${menuItem.id}`} className="p-4 text-center border-l border-slate-100">
                                    <input 
                                       type="checkbox" 
                                       checked={isAllowed}
                                       onChange={() => togglePermission(role, menuItem.id)}
                                       disabled={role === 'ADMIN'}
                                       className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                                    />
                                 </td>
                              );
                           })}
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
};

const PricingSimulator: React.FC = () => {
  const { t } = useTranslation();
  const [simRouteId, setSimRouteId] = useState('R001');
  const [simDate, setSimDate] = useState(new Date().toISOString().split('T')[0]);
  const [simAdults, setSimAdults] = useState(1);
  const [simChildren, setSimChildren] = useState(0);
  const [simVehicle, setSimVehicle] = useState<VehicleType>(VehicleType.NONE);
  const [simCabin, setSimCabin] = useState<CabinType>(CabinType.NONE);
  const [simFareClass, setSimFareClass] = useState('ECO');
  const [simDiscountCode, setSimDiscountCode] = useState('');
  const [calculation, setCalculation] = useState<any>(null);

  const handleSimulate = () => {
    const route = MOCK_ROUTES.find(r => r.id === simRouteId);
    if (!route) return;

    // 1. Base Transport Costs
    const adultCost = route.basePrice * simAdults;
    const childCost = (route.basePrice * 0.5) * simChildren;
    
    // 2. Vehicle Cost
    let vehicleCost = 0;
    if (simVehicle === VehicleType.CAR) vehicleCost = 200;
    if (simVehicle === VehicleType.BUS) vehicleCost = 800;
    if (simVehicle === VehicleType.MOTORCYCLE) vehicleCost = 100;
    if (simVehicle === VehicleType.TRUCK) vehicleCost = 1200;

    // 3. Cabin Cost
    const cabinDef = MOCK_CABIN_PRICES.find(c => c.type === simCabin);
    const cabinCost = cabinDef ? cabinDef.price : 0;

    // 4. Seasonality & Rules
    const simDateObj = new Date(simDate);
    const activeRules = MOCK_PRICING_RULES.filter(rule => {
        const start = new Date(rule.startDate);
        const end = new Date(rule.endDate);
        const routeMatch = rule.routeId === 'ALL' || rule.routeId === simRouteId;
        return routeMatch && simDateObj >= start && simDateObj <= end;
    });

    let seasonalMultiplier = 1.0;
    activeRules.forEach(r => seasonalMultiplier *= r.priceMultiplier);

    // 5. Fare Class Multiplier
    const fareClass = MOCK_FARE_CLASSES.find(fc => fc.code === simFareClass);
    const classMultiplier = fareClass ? fareClass.priceMultiplier : 1.0;

    // 6. Surcharges (ETS, BAF)
    const etsSurcharge = MOCK_SURCHARGES.find(s => s.id === 'SUR-2')?.amount || 5;
    const bafSurcharge = MOCK_SURCHARGES.find(s => s.id === 'SUR-1')?.amount || 20;
    const totalSurcharges = etsSurcharge + bafSurcharge;

    // 7. Base Calculation
    const subtotal = (adultCost + childCost + vehicleCost) * seasonalMultiplier * classMultiplier;
    const totalBeforeDiscount = subtotal + cabinCost + totalSurcharges;

    // 8. Discount Code
    let discountAmount = 0;
    const discountDef = MOCK_DISCOUNT_CODES.find(d => d.code === simDiscountCode && d.active);
    if (discountDef) {
       discountAmount = totalBeforeDiscount * (discountDef.discountPercent / 100);
    }

    const finalTotal = totalBeforeDiscount - discountAmount;

    setCalculation({
        route: `${route.origin} - ${route.destination}`,
        ship: route.shipName,
        adultCost,
        childCost,
        vehicleCost,
        cabinCost,
        seasonalMultiplier,
        classMultiplier,
        etsSurcharge,
        bafSurcharge,
        discountAmount,
        totalBeforeDiscount,
        finalTotal,
        rules: activeRules.map(r => r.name),
        fareClass: fareClass?.name
    });
  };

  return (
     <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
           <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3 mb-8">
              <Calculator size={28} className="text-blue-600"/> {t('admin.pricing.sim_tab')}
           </h3>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {/* Kolumna 1: Trasa i Pasażerowie */}
              <div className="space-y-4">
                 <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest border-b border-blue-50 pb-2 flex items-center gap-2">
                    <Anchor size={14}/> Trasa i PAX
                 </h4>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">{t('res.route')}</label>
                    <select className="w-full border p-2.5 rounded-lg text-sm bg-white font-bold text-slate-700 shadow-sm" value={simRouteId} onChange={e => setSimRouteId(e.target.value)}>
                       {MOCK_ROUTES.map(r => <option key={r.id} value={r.id}>{r.origin} - {r.destination}</option>)}
                    </select>
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">{t('admin.pricing.sim.adults')}</label>
                        <div className="flex items-center border rounded-lg bg-slate-50 p-1">
                           <button onClick={() => setSimAdults(Math.max(1, simAdults - 1))} className="w-8 h-8 font-bold">-</button>
                           <span className="flex-1 text-center font-bold">{simAdults}</span>
                           <button onClick={() => setSimAdults(simAdults + 1)} className="w-8 h-8 font-bold">+</button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">{t('admin.pricing.sim.children')}</label>
                        <div className="flex items-center border rounded-lg bg-slate-50 p-1">
                           <button onClick={() => setSimChildren(Math.max(0, simChildren - 1))} className="w-8 h-8 font-bold">-</button>
                           <span className="flex-1 text-center font-bold">{simChildren}</span>
                           <button onClick={() => setSimChildren(simChildren + 1)} className="w-8 h-8 font-bold">+</button>
                        </div>
                    </div>
                 </div>
              </div>

              {/* Kolumna 2: Transport i Kabina */}
              <div className="space-y-4">
                 <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest border-b border-amber-50 pb-2 flex items-center gap-2">
                    <Truck size={14}/> Pojazd i Kabina
                 </h4>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">{t('admin.pricing.sim.vehicle')}</label>
                    <select className="w-full border p-2.5 rounded-lg text-sm bg-white font-bold text-slate-700 shadow-sm" value={simVehicle} onChange={e => setSimVehicle(e.target.value as VehicleType)}>
                       <option value={VehicleType.NONE}>Brak (Pieszy)</option>
                       <option value={VehicleType.CAR}>Osobowy</option>
                       <option value={VehicleType.MOTORCYCLE}>Motocykl</option>
                       <option value={VehicleType.BUS}>Autobus</option>
                       <option value={VehicleType.TRUCK}>Ciężarówka / Cargo</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">{t('admin.pricing.sim.cabin')}</label>
                    <select className="w-full border p-2.5 rounded-lg text-sm bg-white font-bold text-slate-700 shadow-sm" value={simCabin} onChange={e => setSimCabin(e.target.value as CabinType)}>
                       {MOCK_CABIN_PRICES.map(c => <option key={c.type} value={c.type}>{c.type}</option>)}
                    </select>
                 </div>
              </div>

              {/* Kolumna 3: Yield i Rabaty */}
              <div className="space-y-4">
                 <h4 className="text-xs font-black text-purple-600 uppercase tracking-widest border-b border-purple-50 pb-2 flex items-center gap-2">
                    <Tag size={14}/> Yield i Promocje
                 </h4>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">{t('admin.users.role')} (Yield)</label>
                    <select className="w-full border p-2.5 rounded-lg text-sm bg-white font-bold text-slate-700 shadow-sm" value={simFareClass} onChange={e => setSimFareClass(e.target.value)}>
                       {MOCK_FARE_CLASSES.map(fc => <option key={fc.id} value={fc.code}>{fc.name} (x{fc.priceMultiplier})</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">{t('admin.pricing.sim.promo')}</label>
                    <div className="relative">
                       <input 
                         type="text" 
                         className="w-full border p-2.5 rounded-lg text-sm bg-white font-mono outline-none focus:ring-2 focus:ring-purple-500 shadow-sm uppercase" 
                         placeholder="KOD123..."
                         value={simDiscountCode}
                         onChange={e => setSimDiscountCode(e.target.value)}
                       />
                       <Ticket size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300"/>
                    </div>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="flex flex-col gap-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data Podróży (Sezonowość)</label>
                  <input type="date" className="w-full border p-2.5 rounded-lg text-sm bg-white font-bold shadow-sm" value={simDate} onChange={e => setSimDate(e.target.value)} />
               </div>
               <div className="flex items-end">
                  <button onClick={handleSimulate} className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 flex items-center justify-center gap-3 shadow-xl shadow-blue-100 transition-all active:scale-95">
                     <Play size={20}/> Przelicz Cenę
                  </button>
               </div>
           </div>
        </div>

        {calculation && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in slide-in-from-bottom-4 duration-500">
              {/* Breakdown Table */}
              <div className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                 <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <h4 className="font-black text-slate-700 text-xs uppercase tracking-widest">{t('admin.pricing.sim.breakdown')}</h4>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">{calculation.ship}</span>
                 </div>
                 <div className="p-6 space-y-4 text-sm">
                    <div className="flex justify-between border-b pb-2">
                       <span className="text-slate-500">Bilety Dorosły ({simAdults}x)</span>
                       <span className="font-bold">{calculation.adultCost.toFixed(2)} PLN</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                       <span className="text-slate-500">Bilety Dziecko ({simChildren}x)</span>
                       <span className="font-bold">{calculation.childCost.toFixed(2)} PLN</span>
                    </div>
                    {calculation.vehicleCost > 0 && (
                       <div className="flex justify-between border-b pb-2">
                          <span className="text-slate-500">Pojazd ({simVehicle})</span>
                          <span className="font-bold">{calculation.vehicleCost.toFixed(2)} PLN</span>
                       </div>
                    )}
                    <div className="flex justify-between border-b pb-2 text-blue-600 font-medium italic">
                       <span className="flex items-center gap-2"><Sliders size={14}/> Mnożnik Yield / Klasa ({calculation.fareClass})</span>
                       <span>x{calculation.classMultiplier}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2 text-amber-600 font-medium italic">
                       <span className="flex items-center gap-2"><Calendar size={14}/> Mnożnik Sezonowy ({calculation.rules.join(', ') || 'Brak'})</span>
                       <span>x{calculation.seasonalMultiplier}</span>
                    </div>
                    {calculation.cabinCost > 0 && (
                       <div className="flex justify-between border-b pb-2">
                          <span className="text-slate-500">Kabina ({simCabin})</span>
                          <span className="font-bold">{calculation.cabinCost.toFixed(2)} PLN</span>
                       </div>
                    )}
                    <div className="flex justify-between border-b pb-2 text-slate-400">
                       <span>Dopłaty ETS + BAF</span>
                       <span>{(calculation.etsSurcharge + calculation.bafSurcharge).toFixed(2)} PLN</span>
                    </div>
                    {calculation.discountAmount > 0 && (
                       <div className="flex justify-between border-b pb-2 text-red-600 font-bold">
                          <span className="flex items-center gap-2"><Percent size={14}/> Rabat (Kod: {simDiscountCode})</span>
                          <span>-{calculation.discountAmount.toFixed(2)} PLN</span>
                       </div>
                    )}
                 </div>
              </div>

              {/* Total Result Card */}
              <div className="lg:col-span-4 bg-slate-900 rounded-xl shadow-xl p-8 text-white flex flex-col justify-center relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-10">
                    <DollarSign size={120} />
                 </div>
                 <div className="relative z-10">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">{t('admin.pricing.sim.result')}</p>
                    <div className="flex items-baseline gap-2 mb-2">
                       <h3 className="text-6xl font-black tracking-tighter text-blue-400">{Math.floor(calculation.finalTotal)}</h3>
                       <span className="text-2xl font-bold text-blue-500">.{(calculation.finalTotal % 1).toFixed(2).split('.')[1]}</span>
                       <span className="text-2xl font-black text-slate-500 ml-2">PLN</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="bg-slate-800 text-[10px] font-bold px-2 py-1 rounded text-slate-400 border border-slate-700">NETTO: {(calculation.finalTotal / 1.08).toFixed(2)}</span>
                        <span className="bg-slate-800 text-[10px] font-bold px-2 py-1 rounded text-slate-400 border border-slate-700">VAT (8%): {(calculation.finalTotal - (calculation.finalTotal / 1.08)).toFixed(2)}</span>
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-slate-800 flex gap-3">
                       <button className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2">
                          <Printer size={14}/> Kwotacja PDF
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        )}
     </div>
  );
};

const PricingTab: React.FC = () => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'BASE' | 'YIELD' | 'SIMULATOR'>('BASE');
  const [routes, setRoutes] = useState<Route[]>(MOCK_ROUTES);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>(MOCK_PRICING_RULES);
  const [cabinPrices, setCabinPrices] = useState<CabinPriceDefinition[]>(MOCK_CABIN_PRICES);

  const handleBasePriceChange = (routeId: string, newPrice: number) => {
    setRoutes(prev => prev.map(r => r.id === routeId ? { ...r, basePrice: newPrice } : r));
  };

  const handleCabinPriceChange = (type: string, newPrice: number) => {
    setCabinPrices(prev => prev.map(c => c.type === type ? { ...c, price: newPrice } : c));
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      <div className="flex justify-center">
         <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm flex gap-1">
            <button onClick={() => setViewMode('BASE')} className={`px-6 py-2 rounded-md font-bold text-sm transition ${viewMode === 'BASE' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}>{t('admin.pricing.base_tab')}</button>
            <button onClick={() => setViewMode('YIELD')} className={`px-6 py-2 rounded-md font-bold text-sm transition ${viewMode === 'YIELD' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}>{t('admin.pricing.yield_tab')}</button>
            <button onClick={() => setViewMode('SIMULATOR')} className={`px-6 py-2 rounded-md font-bold text-sm transition ${viewMode === 'SIMULATOR' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}>{t('admin.pricing.sim_tab')}</button>
         </div>
      </div>

      {viewMode === 'BASE' && (
         <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Anchor size={20} className="text-blue-500" /> {t('admin.pricing.routes_title')}</h3>
                  <div className="space-y-4">
                     {routes.map(route => (
                        <div key={route.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                           <div className="font-bold">{route.origin} → {route.destination}</div>
                           <div className="flex items-center gap-2">
                              <input type="number" value={route.basePrice} onChange={(e) => handleBasePriceChange(route.id, parseFloat(e.target.value))} className="w-24 border p-2 rounded text-right bg-white" />
                              <span className="text-sm">PLN</span>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><DollarSign size={20} className="text-green-500" /> {t('admin.pricing.desc')}</h3>
                  <div className="space-y-3">
                     {cabinPrices.map((cabin) => (
                        <div key={cabin.type} className="flex items-center justify-between p-3 border-b border-slate-100">
                           <span className="text-sm">{cabin.type}</span>
                           <div className="flex items-center gap-2">
                              <input type="number" value={cabin.price} onChange={(e) => handleCabinPriceChange(cabin.type, parseFloat(e.target.value))} className="w-24 border p-2 rounded text-right bg-white" />
                              <span className="text-sm">PLN</span>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2"><Calendar size={20}/> {t('admin.pricing.title')}</h3>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded font-bold text-sm hover:bg-blue-700">+ {t('admin.pricing.add_rule')}</button>
               </div>
               <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 uppercase text-xs text-slate-500">
                     <tr>
                        <th className="p-3">{t('admin.pricing.rule_name')}</th>
                        <th className="p-3">{t('admin.pricing.applies_to')}</th>
                        <th className="p-3">{t('admin.pricing.from_to')}</th>
                        <th className="p-3 text-center">{t('admin.pricing.modifier')}</th>
                        <th className="p-3 text-right">{t('admin.pricing.status')}</th>
                     </tr>
                  </thead>
                  <tbody>
                     {pricingRules.map(rule => (
                        <tr key={rule.id} className="border-b">
                           <td className="p-3 font-bold">{rule.name}</td>
                           <td className="p-3">{rule.routeId}</td>
                           <td className="p-3">{rule.startDate} - {rule.endDate}</td>
                           <td className="p-3 text-center font-mono font-bold text-green-600">{Math.round(rule.priceMultiplier*100)}%</td>
                           <td className="p-3 text-right">
                              <span className={`px-2 py-1 rounded text-[10px] font-bold ${rule.availabilityBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                 {rule.availabilityBlocked ? t('admin.pricing.blocked') : t('admin.pricing.active')}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </>
      )}
      {viewMode === 'YIELD' && <YieldTab />}
      {viewMode === 'SIMULATOR' && <PricingSimulator />}
    </div>
  );
};

const UsersTab: React.FC = () => {
   const { t } = useTranslation();
   const [users, setUsers] = useState(MOCK_USERS.map(u => ({ ...u, status: 'ACTIVE' })));
   return (
      <div className="max-w-6xl mx-auto animate-fade-in">
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
               <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Users size={24}/> {t('admin.users.title')}</h3>
               <button className="bg-slate-900 text-white px-4 py-2 rounded font-bold text-sm hover:bg-slate-800">+ {t('admin.users.add')}</button>
            </div>
            <table className="w-full text-left">
               <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                  <tr>
                     <th className="p-4">{t('admin.users.username')}</th>
                     <th className="p-4">{t('admin.users.fullname')}</th>
                     <th className="p-4">{t('admin.users.role')}</th>
                     <th className="p-4 text-center">{t('admin.users.status')}</th>
                     <th className="p-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y text-sm">
                  {users.map(user => (
                     <tr key={user.id} className="hover:bg-slate-50 transition">
                        <td className="p-4 font-mono font-bold">{user.username}</td>
                        <td className="p-4">{user.fullName}</td>
                        <td className="p-4">{user.role}</td>
                        <td className="p-4 text-center">
                           <span className={`px-2 py-1 rounded text-xs font-bold ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {user.status === 'ACTIVE' ? t('admin.users.active') : t('admin.users.blocked')}
                           </span>
                        </td>
                        <td className="p-4 text-right">
                           <button className="text-blue-600 hover:bg-blue-50 p-2 rounded"><Edit size={16}/></button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
};

const BlacklistTab: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800 flex items-center gap-2"><Ban size={20} className="text-red-600"/> {t('admin.blacklist.title')}</h3>
        <button className="bg-red-600 text-white px-4 py-2 rounded font-bold text-sm hover:bg-red-700">+ {t('admin.blacklist.add')}</button>
      </div>
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
          <tr>
            <th className="p-3">{t('admin.blacklist.type')}</th>
            <th className="p-3">{t('admin.blacklist.value')}</th>
            <th className="p-3">{t('admin.blacklist.reason')}</th>
            <th className="p-3">{t('admin.blacklist.severity')}</th>
            <th className="p-3 text-right">{t('admin.blacklist.date')}</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {MOCK_BLACKLIST.map(entry => (
            <tr key={entry.id} className="hover:bg-slate-50">
              <td className="p-3 font-bold">{entry.type}</td>
              <td className="p-3 font-mono">{entry.value}</td>
              <td className="p-3 text-slate-600 italic">"{entry.reason}"</td>
              <td className="p-3"><span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold uppercase">{entry.severity}</span></td>
              <td className="p-3 text-right font-mono text-slate-500">{entry.dateAdded}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const MigrationTab: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Database size={20} className="text-blue-600"/> {t('admin.migration.title')}</h3>
      <p className="text-sm text-slate-500 mb-6">{t('admin.migration.desc')}</p>
      <div className="space-y-4 max-w-2xl">
        <div className="p-4 border rounded-lg bg-slate-50 flex justify-between items-center">
          <div className="font-bold text-slate-700">Legacy SQL Server (FerryLegacy)</div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded font-bold text-sm hover:bg-blue-700">{t('admin.migration.run')}</button>
        </div>
      </div>
    </div>
  );
};

const AuditTab: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2"><ListChecks size={20}/> {t('admin.audit.title')}</h3>
        <button className="text-blue-600 text-sm font-bold hover:underline">Export CSV</button>
      </div>
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 uppercase text-xs text-slate-500">
          <tr>
            <th className="p-3">{t('admin.audit.date')}</th>
            <th className="p-3">{t('admin.audit.user')}</th>
            <th className="p-3">{t('admin.audit.action')}</th>
            <th className="p-3">{t('admin.audit.details')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {MOCK_AUDIT_LOGS.map(log => (
            <tr key={log.id}>
              <td className="p-3 font-mono text-xs">{log.date}</td>
              <td className="p-3 font-bold">{log.user}</td>
              <td className="p-3 font-medium text-blue-600">{log.action}</td>
              <td className="p-3 text-slate-500 italic">"{log.details}"</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdministrationModule;
