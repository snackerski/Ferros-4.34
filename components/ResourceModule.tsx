
import React, { useState, useEffect } from 'react';
import { Layers, Truck, User, PenTool, Layout, Box, RefreshCw, AlertTriangle, CheckCircle, Plus, Trash2, Save, X, Ship } from 'lucide-react';
import { MOCK_CABIN_RESOURCES, MOCK_LANE_RESOURCES, MOCK_SHIPS, MOCK_DECK_DEFINITIONS } from '../services/mockData';
import { CabinResource, CabinStatus, CabinPool, LaneResource, ShipConfig, DeckDefinition } from '../types';
import { useTranslation } from '../i18n';

const ResourceModule: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'CABINS' | 'DECKS'>('CABINS');
  const [cabins, setCabins] = useState<CabinResource[]>(MOCK_CABIN_RESOURCES);
  const [lanes] = useState<LaneResource[]>(MOCK_LANE_RESOURCES);
  const [selectedCabin, setSelectedCabin] = useState<CabinResource | null>(null);

  // Ship Selection State
  const [activeShip, setActiveShip] = useState<ShipConfig>(MOCK_SHIPS[0]); // Default first ship

  // Get Deck Definitions for active ship
  const shipDecks = MOCK_DECK_DEFINITIONS.filter(d => d.shipId === activeShip.id).sort((a,b) => a.number - b.number);

  // Deck Config State (Modal)
  const [selectedShipForConfig, setSelectedShipForConfig] = useState<ShipConfig | null>(null);
  const [decksConfig, setDecksConfig] = useState<DeckDefinition[]>([]);
  const [newDeck, setNewDeck] = useState<Partial<DeckDefinition>>({ number: 0, type: 'CARGO', capacity: 0, details: '' });

  // Update config state when modal opens
  useEffect(() => {
     if (selectedShipForConfig) {
        setDecksConfig(MOCK_DECK_DEFINITIONS.filter(d => d.shipId === selectedShipForConfig.id).sort((a,b) => a.number - b.number));
     }
  }, [selectedShipForConfig]);

  // Filters
  const [deckFilter, setDeckFilter] = useState<number | 'ALL'>('ALL');

  // Filter resources by currently selected ship
  const shipCabins = cabins.filter(c => c.shipId === activeShip.id);
  const filteredCabins = shipCabins.filter(c => deckFilter === 'ALL' || c.deck === deckFilter);
  const shipLanes = lanes.filter(l => l.shipId === activeShip.id);

  const handleStatusChange = (status: CabinStatus) => {
     if (!selectedCabin) return;
     setCabins(prev => prev.map(c => c.id === selectedCabin.id ? { ...c, status } : c));
     setSelectedCabin(null);
  };

  const handlePoolChange = (pool: CabinPool) => {
     if (!selectedCabin) return;
     setCabins(prev => prev.map(c => c.id === selectedCabin.id ? { ...c, pool } : c));
     setSelectedCabin(null);
  };

  const handleAddDeck = () => {
      if (!newDeck.number || !newDeck.capacity || !selectedShipForConfig) return;
      const deck: DeckDefinition = {
         id: `D-${Date.now()}`,
         shipId: selectedShipForConfig.id,
         number: newDeck.number,
         type: newDeck.type as 'CARGO' | 'PAX' | 'MIXED',
         capacity: newDeck.capacity,
         details: newDeck.details || ''
      };
      setDecksConfig([...decksConfig, deck].sort((a, b) => a.number - b.number));
      setNewDeck({ number: 0, type: 'CARGO', capacity: 0, details: '' });
  };

  const handleDeleteDeck = (id: string) => {
      setDecksConfig(decksConfig.filter(d => d.id !== id));
  };

  const getCabinColor = (status: CabinStatus, pool: CabinPool) => {
     if (status === CabinStatus.OUT_OF_ORDER) return 'bg-gray-300 border-gray-400 text-gray-600 opacity-70';
     if (status === CabinStatus.OCCUPIED) return 'bg-red-100 border-red-300 text-red-700';
     if (status === CabinStatus.DIRTY) return 'bg-amber-100 border-amber-300 text-amber-700';
     
     // Free cabins colored by pool
     if (pool === CabinPool.DRIVER) return 'bg-blue-100 border-blue-300 text-blue-700';
     if (pool === CabinPool.PASSENGER) return 'bg-emerald-100 border-emerald-300 text-emerald-700';
     return 'bg-white border-slate-200';
  };

  return (
    <div className="flex flex-col h-full bg-slate-100">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Layers className="text-indigo-600" /> {t('resrc.title')}
          </h2>
          <p className="text-xs text-slate-500">{t('resrc.subtitle')}</p>
        </div>
        <div className="flex gap-4 items-center">
          {/* Ship Selector */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
             <Ship size={16} className="ml-2 text-slate-500"/>
             <select 
               className="bg-transparent text-sm font-bold text-slate-700 outline-none p-1 cursor-pointer"
               value={activeShip.id}
               onChange={(e) => {
                  const ship = MOCK_SHIPS.find(s => s.id === e.target.value);
                  if (ship) {
                     setActiveShip(ship);
                     setDeckFilter('ALL'); // Reset filter on ship change
                     setSelectedCabin(null);
                  }
               }}
             >
                {MOCK_SHIPS.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
             </select>
          </div>

          <div className="h-6 w-px bg-slate-200"></div>

          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('CABINS')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'CABINS' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {t('resrc.tab.cabins')}
            </button>
            <button 
              onClick={() => setActiveTab('DECKS')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'DECKS' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {t('resrc.tab.decks')}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
         {activeTab === 'CABINS' && (
            <div className="flex h-full gap-6">
               <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
                  {/* Toolbar */}
                  <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                     <div className="flex gap-2">
                        <button onClick={() => setDeckFilter('ALL')} className={`px-3 py-1 rounded text-xs font-bold ${deckFilter === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-white border hover:bg-slate-50'}`}>{t('resrc.deck.all')}</button>
                        {Array.from(new Set(shipCabins.map(c => c.deck))).sort((a: number, b: number) => a - b).map(deckNum => (
                           <button key={deckNum} onClick={() => setDeckFilter(deckNum)} className={`px-3 py-1 rounded text-xs font-bold ${deckFilter === deckNum ? 'bg-indigo-600 text-white' : 'bg-white border hover:bg-slate-50'}`}>{t('resrc.deck.num', { num: deckNum })}</button>
                        ))}
                     </div>
                     <div className="flex gap-4 text-xs font-bold">
                        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-100 border border-emerald-300 rounded-sm"></span> {t('resrc.legend.pax')}</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-100 border border-blue-300 rounded-sm"></span> {t('resrc.legend.drivers')}</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-100 border border-red-300 rounded-sm"></span> {t('resrc.legend.occupied')}</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-300 border border-gray-400 rounded-sm"></span> {t('resrc.legend.tech')}</span>
                     </div>
                  </div>

                  {/* Grid */}
                  <div className="flex-1 p-6 overflow-y-auto">
                     {filteredCabins.length > 0 ? (
                        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                           {filteredCabins.map(cabin => (
                              <div 
                                 key={cabin.id}
                                 onClick={() => setSelectedCabin(cabin)}
                                 className={`aspect-square rounded-lg border-2 p-2 flex flex-col justify-between cursor-pointer transition hover:scale-105 shadow-sm ${getCabinColor(cabin.status, cabin.pool)} ${selectedCabin?.id === cabin.id ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
                              >
                                 <div className="flex justify-between items-start">
                                    <span className="font-bold text-sm">{cabin.id}</span>
                                    <span className="text-[10px] opacity-70">P{cabin.deck}</span>
                                 </div>
                                 <div className="text-center text-xs font-medium opacity-80 mt-1">
                                    {cabin.type.split(' ')[0]}
                                 </div>
                                 <div className="mt-auto flex justify-between items-end text-[10px] font-bold uppercase">
                                    <span>{cabin.status === CabinStatus.FREE ? t('resrc.legend.free') : cabin.status}</span>
                                    {cabin.pool === CabinPool.DRIVER && <Truck size={12}/>}
                                 </div>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                           <Box size={48} className="mb-4 opacity-30"/>
                           <p>{t('res.empty')}</p>
                        </div>
                     )}
                  </div>
               </div>

               {/* Sidebar Controls */}
               <div className="w-80 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                     <PenTool size={20} className="text-indigo-600"/> {t('resrc.cabin.management')}
                  </h3>
                  {selectedCabin ? (
                     <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                           <div className="text-sm text-slate-500 uppercase font-bold mb-1">{t('resrc.cabin.selected')}</div>
                           <div className="text-3xl font-bold text-slate-800 mb-1">{selectedCabin.id}</div>
                           <div className="text-sm text-slate-600">{selectedCabin.type}</div>
                           <div className="text-xs text-slate-400 mt-2">{t('routes.timeline.ship')}: {activeShip.name}</div>
                        </div>

                        <div>
                           <label className="block text-xs font-bold text-slate-400 uppercase mb-2">{t('resrc.cabin.status_change')}</label>
                           <div className="space-y-2">
                              <button onClick={() => handleStatusChange(CabinStatus.FREE)} className="w-full text-left px-4 py-2 rounded border border-slate-200 hover:bg-emerald-50 text-sm font-medium flex items-center gap-2">
                                 <div className="w-3 h-3 rounded-full bg-emerald-500"></div> {t('resrc.status.free')}
                              </button>
                              <button onClick={() => handleStatusChange(CabinStatus.DIRTY)} className="w-full text-left px-4 py-2 rounded border border-slate-200 hover:bg-amber-50 text-sm font-medium flex items-center gap-2">
                                 <div className="w-3 h-3 rounded-full bg-amber-500"></div> {t('resrc.status.dirty')}
                              </button>
                              <button onClick={() => handleStatusChange(CabinStatus.OUT_OF_ORDER)} className="w-full text-left px-4 py-2 rounded border border-slate-200 hover:bg-gray-100 text-sm font-medium flex items-center gap-2">
                                 <div className="w-3 h-3 rounded-full bg-gray-500"></div> {t('resrc.status.out_of_order')}
                              </button>
                           </div>
                        </div>

                        <div>
                           <label className="block text-xs font-bold text-slate-400 uppercase mb-2">{t('resrc.cabin.pool_change')}</label>
                           <div className="grid grid-cols-2 gap-2">
                              <button 
                                 onClick={() => handlePoolChange(CabinPool.PASSENGER)}
                                 className={`p-2 border rounded text-xs font-bold ${selectedCabin.pool === CabinPool.PASSENGER ? 'bg-indigo-600 text-white' : 'hover:bg-slate-50'}`}
                              >
                                 {t('resrc.legend.pax')}
                              </button>
                              <button 
                                 onClick={() => handlePoolChange(CabinPool.DRIVER)}
                                 className={`p-2 border rounded text-xs font-bold ${selectedCabin.pool === CabinPool.DRIVER ? 'bg-indigo-600 text-white' : 'hover:bg-slate-50'}`}
                              >
                                 {t('resrc.legend.drivers')}
                              </button>
                           </div>
                        </div>
                     </div>
                  ) : (
                     <div className="h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-lg">
                        <Box size={32} className="mb-2 opacity-50"/>
                        <p className="text-sm text-center">Wybierz kabinę z planu,<br/>aby edytować jej status.</p>
                     </div>
                  )}
               </div>
            </div>
         )}

         {activeTab === 'DECKS' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-5xl mx-auto">
               <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                  <div>
                     <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Truck className="text-amber-600"/> {t('resrc.deck.title')}
                     </h3>
                     <p className="text-sm text-slate-500 mt-1">{t('routes.timeline.ship')}: <span className="font-bold">{activeShip.name}</span></p>
                  </div>
                  <button 
                     onClick={() => setSelectedShipForConfig(activeShip)} 
                     className="text-sm font-bold text-blue-600 border border-blue-200 bg-blue-50 px-3 py-2 rounded hover:bg-blue-100"
                  >
                     {t('resrc.deck.config_btn')}
                  </button>
               </div>

               <div className="p-8 space-y-8 bg-slate-50">
                  {shipDecks.length > 0 ? (
                     <>
                        {shipDecks.filter(d => d.type === 'CARGO' || d.type === 'MIXED').map(deck => (
                           <div key={deck.id}>
                              <h4 className="font-bold text-slate-700 mb-4 border-b border-slate-200 pb-2 flex justify-between">
                                 <span>{t('resrc.deck.num', { num: deck.number })} <span className="text-sm font-normal text-slate-500">({deck.details})</span></span>
                                 <span className="text-xs bg-slate-200 px-2 py-1 rounded">{deck.type}</span>
                              </h4>
                              <div className="space-y-6">
                                 {shipLanes.filter(l => l.deck === deck.number).map(lane => (
                                    <div key={lane.id}>
                                       <div className="flex justify-between text-sm mb-1 font-bold text-slate-600">
                                          <span>{lane.name}</span>
                                          <span>{lane.occupiedLength}m / {lane.totalLength}m</span>
                                       </div>
                                       <div className="h-12 w-full bg-slate-200 rounded border border-slate-300 relative overflow-hidden flex">
                                          {/* Occupied Part */}
                                          <div 
                                             className="h-full bg-amber-500 border-r border-amber-600 relative group flex items-center justify-center shadow-inner"
                                             style={{ width: `${(lane.occupiedLength / lane.totalLength) * 100}%` }}
                                          >
                                             {lane.occupiedLength > 0 && <span className="text-white text-xs font-bold drop-shadow-md opacity-0 group-hover:opacity-100 transition">{t('resrc.legend.occupied')}</span>}
                                          </div>
                                          {/* Markers */}
                                          <div className="absolute inset-0 flex justify-between px-2 pointer-events-none">
                                             {[...Array(10)].map((_, i) => (
                                                <div key={i} className="h-full w-px bg-slate-400/20"></div>
                                             ))}
                                          </div>
                                       </div>
                                    </div>
                                 ))}
                                 {shipLanes.filter(l => l.deck === deck.number).length === 0 && (
                                    <p className="text-xs text-slate-400 italic p-2 border border-dashed rounded text-center">Brak zdefiniowanych pasów ładunkowych na tym pokładzie.</p>
                                 )}
                              </div>
                           </div>
                        ))}
                     </>
                  ) : (
                     <div className="text-center py-12 text-slate-400">
                        <Truck size={48} className="mx-auto mb-4 opacity-30"/>
                        <p>Brak skonfigurowanych pokładów dla tego statku.</p>
                     </div>
                  )}
               </div>

               <div className="p-6 bg-white border-t border-slate-200 flex justify-between items-center">
                  <div className="flex gap-4 text-sm text-slate-600">
                     <div className="flex items-center gap-2"><div className="w-4 h-4 bg-amber-500 rounded"></div> {t('nav.cargo')}</div>
                     <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-500 rounded"></div> {t('book.car')}</div>
                     <div className="flex items-center gap-2"><div className="w-4 h-4 bg-slate-200 border border-slate-300 rounded"></div> {t('avail.legend.available')}</div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded font-bold text-sm text-slate-700">
                     <RefreshCw size={16}/> {t('mobile.dash.sync')}
                  </button>
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default ResourceModule;
