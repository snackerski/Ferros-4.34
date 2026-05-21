
import React, { useState, useEffect } from 'react';
import { Settings, Save, Calendar, DollarSign, AlertTriangle, Plus, Trash2, Anchor, TrendingUp, Info, Calculator, X } from 'lucide-react';
import { MOCK_ROUTES, MOCK_CABIN_PRICES } from '../services/mockData';
import { Route, PricingRule, CabinPriceDefinition, YieldBucket, VehicleType, CabinType } from '../types';
import { calculateDynamicPrice } from '../services/pricingService';

const PricingAdmin: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [cabinPrices, setCabinPrices] = useState<CabinPriceDefinition[]>(MOCK_CABIN_PRICES);
  const [yieldBuckets, setYieldBuckets] = useState<YieldBucket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [newRule, setNewRule] = useState<Partial<PricingRule>>({
    name: '',
    routeId: 'ALL',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
    priceMultiplier: 1.0,
    availabilityBlocked: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [routesRes, rulesRes, bucketsRes] = await Promise.all([
          fetch('/api/routes'),
          fetch('/api/pricing/rules'),
          fetch('/api/pricing/yield-buckets')
        ]);
        
        const [routesData, rulesData, bucketsData] = await Promise.all([
          routesRes.json(),
          rulesRes.json(),
          bucketsRes.json()
        ]);

        setRoutes(routesData);
        setPricingRules(rulesData);
        setYieldBuckets(bucketsData);
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Simulator State
  const [simParams, setSimParams] = useState({
    routeId: '',
    date: new Date().toISOString().split('T')[0],
    paxAdults: 1,
    paxChildren: 0,
    vehicleType: VehicleType.CAR,
    cabinType: CabinType.INSIDE_2,
    occupancy: 0.6
  });

  // Set initial route for simulator once routes are loaded
  useEffect(() => {
    if (routes.length > 0 && !simParams.routeId) {
      setSimParams(prev => ({ ...prev, routeId: routes[0].id }));
    }
  }, [routes]);

  const simRoute = routes.find(r => r.id === simParams.routeId) || routes[0];
  const simPrice = simRoute ? calculateDynamicPrice(simRoute, new Date(simParams.date), {
    paxAdults: simParams.paxAdults,
    paxChildren: simParams.paxChildren,
    petCount: 0,
    vehicleType: simParams.vehicleType,
    cabinType: simParams.cabinType,
    occupancyRate: simParams.occupancy
  } as any) : null;

  // Handlers for Route Base Prices
  const handleBasePriceChange = (routeId: string, newPrice: number) => {
    setRoutes(prev => prev.map(r => r.id === routeId ? { ...r, basePrice: newPrice } : r));
  };

  const saveRoutePrice = async (routeId: string, price: number) => {
    try {
      await fetch(`/api/routes/${routeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ basePrice: price })
      });
      alert("Cena bazowa zaktualizowana!");
    } catch (error) {
      console.error("Failed to save route price", error);
    }
  };

  // Handlers for Cabin Prices
  const handleCabinPriceChange = (type: string, newPrice: number) => {
    setCabinPrices(prev => prev.map(c => c.type === type ? { ...c, price: newPrice } : c));
  };

  // Handlers for Pricing Rules
  const handleDeleteRule = async (id: string) => {
    try {
      await fetch(`/api/pricing/rules/${id}`, { method: 'DELETE' });
      setPricingRules(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error("Failed to delete rule", error);
    }
  };

  const handleAddRule = async () => {
    if (!newRule.name) {
      alert("Podaj nazwę reguły");
      return;
    }

    try {
      const res = await fetch('/api/pricing/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRule)
      });
      const data = await res.json();
      setPricingRules(prev => [...prev, data]);
      setIsRuleModalOpen(false);
      setNewRule({
        name: '',
        routeId: 'ALL',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
        priceMultiplier: 1.0,
        availabilityBlocked: false
      });
    } catch (error) {
      console.error("Failed to add rule", error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <Settings className="text-sea-600" />
          Administracja Cenami i Dostępnością
        </h2>
        <p className="text-slate-500 mt-2">
          Realizacja Etapu 1.6: Definiowanie cen podstawowych, cen kabin oraz okresów dostępności.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SECTION 1: Base Prices per Route */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Anchor size={20} className="text-blue-500" /> Ceny Bazowe Rejsów
          </h3>
          <div className="space-y-4">
            {routes.map(route => (
              <div key={route.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <div className="font-bold text-slate-700">{route.origin} → {route.destination}</div>
                  <div className="text-xs text-slate-500">{route.shipName} (ID: {route.id})</div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-slate-600">Cena PLN:</label>
                  <input 
                    type="number" 
                    value={route.basePrice}
                    onChange={(e) => handleBasePriceChange(route.id, parseFloat(e.target.value))}
                    className="w-24 p-2 border border-slate-300 rounded text-right font-mono font-bold focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <button 
              onClick={() => routes.forEach(r => saveRoutePrice(r.id, r.basePrice))}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              <Save size={16} /> Zapisz Wszystkie Ceny
            </button>
          </div>
        </div>

        {/* SECTION 2: Yield Management Buckets */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-purple-500" /> Yield Management (Obłożenie)
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
              <span>Min %</span>
              <span>Max %</span>
              <span className="text-center">Mnożnik</span>
              <span className="text-right">Akcja</span>
            </div>
            {yieldBuckets.map((bucket) => (
              <div key={bucket.id} className="grid grid-cols-4 items-center gap-2 p-2 bg-slate-50 rounded border border-slate-100">
                <input type="number" value={bucket.occupancyMin} className="w-full p-1 border rounded text-xs" />
                <input type="number" value={bucket.occupancyMax} className="w-full p-1 border rounded text-xs" />
                <input type="number" step="0.1" value={bucket.priceMultiplier} className="w-full p-1 border rounded text-xs text-center font-bold text-purple-600" />
                <div className="text-right">
                  <button className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
            <button className="w-full py-2 border-2 border-dashed border-slate-200 rounded text-slate-400 text-xs font-bold hover:border-purple-300 hover:text-purple-500 transition">
              + Dodaj Próg Obłożenia
            </button>
          </div>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg flex gap-3">
             <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
             <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
               System automatycznie wybiera mnożnik na podstawie aktualnego poziomu rezerwacji dla danego odejścia.
             </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: Dynamic Pricing Simulator */}
      <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5">
           <Calculator size={200} />
        </div>
        <div className="relative z-10">
          <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
            <Calculator className="text-blue-400" /> Symulator Ceny Dynamicznej
          </h3>
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            {/* Controls */}
            <div className="space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Rejs</label>
                    <select 
                      value={simParams.routeId} 
                      onChange={e => setSimParams({...simParams, routeId: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm outline-none focus:border-blue-500"
                    >
                      {routes.map(r => <option key={r.id} value={r.id}>{r.origin} → {r.destination}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Data</label>
                    <input 
                      type="date" 
                      value={simParams.date}
                      onChange={e => setSimParams({...simParams, date: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex justify-between">
                    Obłożenie Statku <span>{(simParams.occupancy * 100).toFixed(0)}%</span>
                  </label>
                  <input 
                    type="range" min="0" max="1" step="0.01" 
                    value={simParams.occupancy}
                    onChange={e => setSimParams({...simParams, occupancy: parseFloat(e.target.value)})}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pojazd</label>
                    <select 
                      value={simParams.vehicleType}
                      onChange={e => setSimParams({...simParams, vehicleType: e.target.value as VehicleType})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm outline-none focus:border-blue-500"
                    >
                      {Object.values(VehicleType).map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kabina</label>
                    <select 
                      value={simParams.cabinType}
                      onChange={e => setSimParams({...simParams, cabinType: e.target.value as CabinType})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm outline-none focus:border-blue-500"
                    >
                      {Object.values(CabinType).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
               </div>
            </div>

            {/* Breakdown */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
               <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest border-b border-white/10 pb-3">Kalkulacja Składowa</h4>
               {simPrice ? (
                 <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Cena Bazowa:</span>
                      <span className="font-mono">{simPrice.basePrice} PLN</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mnożnik Dnia ({new Date(simParams.date).toLocaleDateString('pl-PL', {weekday: 'short'})}):</span>
                      <span className={`font-mono ${simPrice.dayMultiplier > 1 ? 'text-red-400' : 'text-green-400'}`}>x{simPrice.dayMultiplier.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mnożnik Obłożenia (Yield):</span>
                      <span className={`font-mono ${simPrice.occupancyMultiplier > 1 ? 'text-red-400' : 'text-green-400'}`}>x{simPrice.occupancyMultiplier.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mnożnik Reguł (Sezon):</span>
                      <span className={`font-mono ${simPrice.ruleMultiplier > 1 ? 'text-red-400' : 'text-green-400'}`}>x{simPrice.ruleMultiplier.toFixed(2)}</span>
                    </div>
                    <div className="pt-3 border-t border-white/5 flex justify-between">
                      <span className="text-slate-400">Dodatki (Pojazd + Kabina):</span>
                      <span className="font-mono">+{simPrice.vehicleAddon + simPrice.cabinAddon} PLN</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Dopłaty (BAF + ETS):</span>
                      <span className="font-mono">+{simPrice.baf + simPrice.ets} PLN</span>
                    </div>
                 </div>
               ) : (
                 <div className="text-slate-500 text-center py-10">Wybierz rejs aby zobaczyć kalkulację</div>
               )}
            </div>

            {/* Result */}
            <div className="flex flex-col justify-center items-center text-center bg-blue-600/20 rounded-2xl border border-blue-500/30 p-8">
               <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-2">Sugerowana Cena Brutto</div>
               <div className="text-6xl font-black tracking-tighter mb-2">
                  {simPrice?.grossTotal.toFixed(0) || '0'} <span className="text-xl opacity-50">PLN</span>
               </div>
               <div className="text-xs text-blue-300 font-medium">
                  W tym VAT (8%): {simPrice?.vat.toFixed(2) || '0.00'} PLN
               </div>
               <div className="mt-8 flex gap-2">
                  <div className="px-3 py-1 bg-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/30">
                    Netto: {simPrice?.netTotal.toFixed(0) || '0'}
                  </div>
                  <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                    Yield: {simPrice ? ((simPrice.dayMultiplier * simPrice.occupancyMultiplier * simPrice.ruleMultiplier - 1) * 100).toFixed(0) : '0'}%
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Availability & Seasonality Rules */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar size={20} className="text-amber-500" /> Reguły Dostępności i Sezonowości
          </h3>
          <button 
            onClick={() => setIsRuleModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 text-sm font-medium"
          >
            <Plus size={16} /> Dodaj Regułę
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
              <tr>
                <th className="p-3 border-b">Nazwa Reguły</th>
                <th className="p-3 border-b">Dotyczy Rejsu</th>
                <th className="p-3 border-b">Od Kiedy</th>
                <th className="p-3 border-b">Do Kiedy</th>
                <th className="p-3 border-b text-center">Modyfikator Ceny</th>
                <th className="p-3 border-b text-center">Status</th>
                <th className="p-3 border-b text-right">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {pricingRules.map(rule => (
                <tr key={rule.id} className="hover:bg-slate-50">
                  <td className="p-3 font-medium text-slate-800">{rule.name}</td>
                  <td className="p-3">
                    {rule.routeId === 'ALL' ? (
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 font-bold">WSZYSTKIE</span>
                    ) : rule.routeId}
                  </td>
                  <td className="p-3 font-mono text-slate-600">{rule.startDate}</td>
                  <td className="p-3 font-mono text-slate-600">{rule.endDate}</td>
                  <td className="p-3 text-center">
                    {rule.availabilityBlocked ? (
                      <span className="text-slate-300">-</span>
                    ) : (
                      <span className={`font-bold ${rule.priceMultiplier > 1 ? 'text-red-600' : 'text-green-600'}`}>
                        {(rule.priceMultiplier * 100).toFixed(0)}%
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {rule.availabilityBlocked ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                        <AlertTriangle size={12} /> ZABLOKOWANY
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">AKTYWNY</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button 
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pricingRules.length === 0 && (
            <div className="p-6 text-center text-slate-500">Brak zdefiniowanych reguł specjalnych.</div>
          )}
        </div>
      </div>
      {/* Modal for Adding Rule */}
      {isRuleModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
              <h3 className="font-bold text-xl flex items-center gap-2">
                <Plus size={24} className="text-blue-400"/> Nowa Reguła
              </h3>
              <button onClick={() => setIsRuleModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={24}/>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nazwa Reguły</label>
                <input 
                  type="text" 
                  value={newRule.name}
                  onChange={e => setNewRule({...newRule, name: e.target.value})}
                  className="w-full border p-2 rounded bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="np. Sezon Letni 2024"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Dotyczy Rejsu</label>
                <select 
                  value={newRule.routeId}
                  onChange={e => setNewRule({...newRule, routeId: e.target.value})}
                  className="w-full border p-2 rounded bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">Wszystkie Rejsy</option>
                  {routes.map(r => <option key={r.id} value={r.id}>{r.origin} - {r.destination}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Od Kiedy</label>
                  <input 
                    type="date" 
                    value={newRule.startDate}
                    onChange={e => setNewRule({...newRule, startDate: e.target.value})}
                    className="w-full border p-2 rounded bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Do Kiedy</label>
                  <input 
                    type="date" 
                    value={newRule.endDate}
                    onChange={e => setNewRule({...newRule, endDate: e.target.value})}
                    className="w-full border p-2 rounded bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mnożnik Ceny</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={newRule.priceMultiplier}
                    onChange={e => setNewRule({...newRule, priceMultiplier: parseFloat(e.target.value)})}
                    className="w-full border p-2 rounded bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2 mt-5">
                  <input 
                    type="checkbox" 
                    id="blocked"
                    checked={newRule.availabilityBlocked}
                    onChange={e => setNewRule({...newRule, availabilityBlocked: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <label htmlFor="blocked" className="text-sm font-bold text-slate-700">Blokuj Rejs</label>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  onClick={() => setIsRuleModalOpen(false)}
                  className="px-4 py-2 border rounded font-bold text-slate-600 hover:bg-slate-50"
                >
                  Anuluj
                </button>
                <button 
                  onClick={handleAddRule}
                  className="px-6 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 shadow-lg shadow-blue-100"
                >
                  Zapisz Regułę
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingAdmin;
