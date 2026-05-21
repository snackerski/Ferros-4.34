
import React, { useState } from 'react';
import { Network, Server, Printer, Monitor, MapPin, Building, Anchor, CheckCircle, AlertTriangle, XCircle, Settings, RefreshCw, Cpu, Wifi } from 'lucide-react';
import { MOCK_ORG_UNITS, MOCK_WORKSTATIONS } from '../services/mockData';
import { OrgUnit, Workstation, PeripheralDevice } from '../types';

const InfrastructureModule: React.FC = () => {
  const [selectedUnit, setSelectedUnit] = useState<OrgUnit | null>(MOCK_ORG_UNITS[0]);
  const [selectedWorkstation, setSelectedWorkstation] = useState<Workstation | null>(null);

  // Helper to get icon for unit type
  const getUnitIcon = (type: string) => {
    switch (type) {
      case 'HQ': return <Building size={18} className="text-purple-600" />;
      case 'PORT': return <MapPin size={18} className="text-blue-600" />;
      case 'SHIP': return <Anchor size={18} className="text-teal-600" />;
      default: return <Network size={18} className="text-slate-500" />;
    }
  };

  // Helper to get icon for device type
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'PRINTER_FISCAL': return <Printer size={16} className="text-slate-600" />;
      case 'PRINTER_TICKET': return <FileTextIcon size={16} className="text-slate-600" />;
      case 'TERMINAL': return <CreditCardIcon size={16} className="text-slate-600" />;
      case 'SCANNER': return <ScanIcon size={16} className="text-slate-600" />;
      case 'RFID_ENCODER': return <Cpu size={16} className="text-slate-600" />;
      default: return <Settings size={16} className="text-slate-600" />;
    }
  };

  // Helper for status badge
  const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'ONLINE' || status === 'OK') {
      return <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100"><CheckCircle size={10} /> {status}</span>;
    }
    if (status === 'WARNING') {
      return <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100"><AlertTriangle size={10} /> {status}</span>;
    }
    return <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100"><XCircle size={10} /> {status}</span>;
  };

  const filteredWorkstations = selectedUnit 
    ? MOCK_WORKSTATIONS.filter(ws => ws.orgUnitId === selectedUnit.id)
    : [];

  return (
    <div className="flex flex-col h-full bg-slate-100">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Network className="text-indigo-600" /> Infrastruktura IT
          </h2>
          <p className="text-xs text-slate-500">Etap 2.5 (Struktura) & 2.6 (Urządzenia)</p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Organization Tree */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-700 text-sm">
            Struktura Organizacyjna
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {MOCK_ORG_UNITS.map(unit => (
              <div 
                key={unit.id}
                onClick={() => { setSelectedUnit(unit); setSelectedWorkstation(null); }}
                className={`p-3 rounded-lg border cursor-pointer transition flex items-center gap-3 ${selectedUnit?.id === unit.id ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-300' : 'bg-white border-slate-200 hover:border-indigo-200'}`}
              >
                <div className="bg-slate-50 p-2 rounded-md">
                  {getUnitIcon(unit.type)}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-800">{unit.name}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">{unit.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle: Workstations List */}
        <div className="flex-1 flex flex-col border-r border-slate-200 bg-slate-50/50">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Monitor size={20} className="text-slate-500"/> Stanowiska: {selectedUnit?.name}
            </h3>
            <button className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded font-bold hover:bg-indigo-700 transition">
              + Dodaj Stanowisko
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filteredWorkstations.length > 0 ? (
              filteredWorkstations.map(ws => (
                <div 
                  key={ws.id}
                  onClick={() => setSelectedWorkstation(ws)}
                  className={`bg-white p-4 rounded-xl border shadow-sm cursor-pointer transition relative overflow-hidden group ${selectedWorkstation?.id === ws.id ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200 hover:shadow-md'}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${ws.status === 'ONLINE' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                        <Monitor size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{ws.name}</h4>
                        <div className="text-xs text-slate-500 font-mono flex items-center gap-1">
                          <Wifi size={10}/> {ws.ipAddress}
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={ws.status} />
                  </div>
                  
                  <div className="border-t border-slate-100 pt-3">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Podłączone Urządzenia ({ws.devices.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {ws.devices.map(dev => (
                        <div key={dev.id} className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded text-xs text-slate-600" title={dev.name}>
                          {getDeviceIcon(dev.type)}
                          <span className={`w-2 h-2 rounded-full ${dev.status === 'OK' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 flex flex-col items-center justify-center h-64 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                <Server size={48} className="mb-4 opacity-30"/>
                <p>Brak zdefiniowanych stanowisk w tej jednostce.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Workstation Details */}
        {selectedWorkstation && (
          <div className="w-96 bg-white flex flex-col animate-in slide-in-from-right-4">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-slate-800">{selectedWorkstation.name}</h3>
                <button className="text-slate-400 hover:text-slate-600" onClick={() => setSelectedWorkstation(null)}>
                  <XCircle size={20} />
                </button>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Typ:</span>
                  <span className="font-bold bg-slate-100 px-2 rounded text-xs">{selectedWorkstation.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>IP:</span>
                  <span className="font-mono">{selectedWorkstation.ipAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span>ID:</span>
                  <span className="font-mono">{selectedWorkstation.id}</span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 flex justify-between items-center">
                Urządzenia Peryferyjne
                <button className="text-indigo-600 hover:underline flex items-center gap-1">
                  <RefreshCw size={12}/> Skanuj
                </button>
              </h4>
              
              <div className="space-y-4">
                {selectedWorkstation.devices.map(dev => (
                  <div key={dev.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
                        {getDeviceIcon(dev.type)}
                        {dev.name}
                      </div>
                      <StatusBadge status={dev.status} />
                    </div>
                    <div className="text-xs text-slate-500 mb-3">
                      Model: <span className="font-mono text-slate-700">{dev.model}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-1.5 border border-slate-200 bg-slate-50 rounded text-xs font-bold text-slate-600 hover:bg-white hover:border-slate-300">
                        Konfiguruj (Etap 2.6)
                      </button>
                      <button className="flex-1 py-1.5 border border-slate-200 bg-slate-50 rounded text-xs font-bold text-slate-600 hover:bg-white hover:border-slate-300">
                        Test (Etap 7.5)
                      </button>
                    </div>
                  </div>
                ))}
                
                <button className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-400 font-bold text-xs hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 transition">
                  + Dodaj Urządzenie
                </button>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-200 bg-white">
               <button className="w-full bg-slate-900 text-white py-2 rounded-lg font-bold text-sm hover:bg-slate-800">
                  Zapisz Konfigurację
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Icons not in main import
const FileTextIcon = ({ size, className }: { size: number, className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
);
const CreditCardIcon = ({ size, className }: { size: number, className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
);
const ScanIcon = ({ size, className }: { size: number, className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/></svg>
);

export default InfrastructureModule;
