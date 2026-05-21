
import React, { useState, useEffect } from 'react';
import { QrCode, Wifi, Battery, User, CheckCircle, XCircle, RefreshCw, Key, ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react';
import { MOCK_RESERVATIONS, MOCK_COLLECTOR_SCANS, MOCK_BLACKLIST } from '../services/mockData';
import { BookingStatus, BlacklistType, CollectorScan, VehicleType, CabinType } from '../types';
import { useTranslation } from '../i18n';

const MobileCollector: React.FC = () => {
  const { t } = useTranslation();
  const [activeScreen, setActiveScreen] = useState<'DASHBOARD' | 'SCAN' | 'RESULT'>('DASHBOARD');
  const [barcode, setBarcode] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);
  const [scans, setScans] = useState<CollectorScan[]>(MOCK_COLLECTOR_SCANS);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [syncStatus, setSyncStatus] = useState<'SYNCED' | 'PENDING'>('SYNCED');

  // Simulate barcode entry (physical button or camera)
  const handleScan = () => {
    if (!barcode) return;

    const reservation = MOCK_RESERVATIONS.find(r => r.id === barcode);
    let decision: 'BOARDED' | 'DENIED' | 'CHECK_DOCS' = 'BOARDED';
    let details = '';

    if (reservation) {
        // Check Blacklist
        const blacklistMatch = MOCK_BLACKLIST.find(b => 
            (b.type === BlacklistType.PERSON && reservation.passengers.some(p => p.documentNumber === b.value)) ||
            (b.type === BlacklistType.VEHICLE && b.value === reservation.vehicleReg)
        );

        if (blacklistMatch && blacklistMatch.active) {
            decision = 'DENIED';
            details = t('mobile.error.blacklist', { reason: blacklistMatch.reason });
        } else if (reservation.status === BookingStatus.CANCELLED) {
            decision = 'DENIED';
            details = t('mobile.error.cancelled');
        } else if (reservation.status === BookingStatus.CHECKED_IN) {
            decision = 'CHECK_DOCS';
            details = t('mobile.error.checked_in');
        } else {
            details = `${reservation.vehicleType !== VehicleType.NONE ? reservation.vehicleType : 'Pieszy'}`;
        }
    } else {
        decision = 'DENIED';
        details = t('mobile.error.unknown');
    }

    const newScan: CollectorScan = {
        id: `SCAN-${Date.now()}`,
        barcode,
        timestamp: new Date().toLocaleTimeString(),
        status: 'PENDING',
        decision,
        details,
        operator: 'user'
    };

    setScans([newScan, ...scans]);
    setScanResult({ ...newScan, reservation });
    setSyncStatus('PENDING');
    setActiveScreen('RESULT');
    setBarcode('');
  };

  const handleSync = () => {
      // Etap 7.8: Export data from collector
      setSyncStatus('SYNCED');
      setScans(prev => prev.map(s => ({ ...s, status: 'SYNCED' })));
      alert(t('mobile.dash.ready'));
  };

  const handleIssueKey = () => {
      alert(t('recep.acc.duplicate_key'));
  };

  return (
    <div className="flex items-center justify-center h-full p-2 bg-slate-800">
      {/* Handheld Device Frame */}
      <div className="w-[320px] h-[640px] bg-black rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-700 relative flex flex-col overflow-hidden">
         {/* Status Bar */}
         <div className="h-6 flex justify-between items-center px-4 text-white text-[10px] font-mono">
            <span className="flex items-center gap-1"><Wifi size={12}/> {t('mobile.status.lte')}</span>
            <span>12:45</span>
            <span className="flex items-center gap-1">{batteryLevel}% <Battery size={12}/></span>
         </div>

         {/* Screen Content */}
         <div className="flex-1 bg-slate-900 rounded-xl overflow-hidden flex flex-col relative text-white">
            
            {activeScreen === 'DASHBOARD' && (
                <div className="flex-1 p-4 flex flex-col">
                    <div className="mb-6">
                        <h2 className="text-lg font-bold">{t('mobile.dash.welcome')}</h2>
                        <p className="text-slate-400 text-xs">{t('mobile.dash.station')}</p>
                    </div>

                    <div className="bg-slate-800 p-3 rounded-xl mb-3 border border-slate-700">
                        <p className="text-[10px] text-slate-400 uppercase">{t('mobile.dash.current_voyage')}</p>
                        <h3 className="text-xl font-bold text-blue-400">R001</h3>
                        <p className="text-xs">Nova Star - 18:00</p>
                    </div>

                    <button 
                        onClick={() => setActiveScreen('SCAN')}
                        className="bg-blue-600 w-full py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/50 hover:bg-blue-500 transition mb-3 flex flex-col items-center gap-1"
                    >
                        <QrCode size={28}/> {t('mobile.dash.btn_scan')}
                    </button>

                    <div className="flex-1 overflow-y-auto">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-slate-500 uppercase">{t('mobile.dash.recent')}</span>
                            <button onClick={handleSync} className={`text-xs font-bold flex items-center gap-1 ${syncStatus === 'PENDING' ? 'text-amber-500 animate-pulse' : 'text-green-500'}`}>
                                <RefreshCw size={12}/> {syncStatus === 'PENDING' ? t('mobile.dash.sync') : t('mobile.dash.ready')}
                            </button>
                        </div>
                        <div className="space-y-2">
                            {scans.slice(0, 5).map(scan => (
                                <div key={scan.id} className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex justify-between items-center">
                                    <div>
                                        <div className="font-mono font-bold text-sm">{scan.barcode}</div>
                                        <div className="text-[10px] text-slate-400">{scan.timestamp}</div>
                                    </div>
                                    <div className={`w-3 h-3 rounded-full ${scan.decision === 'BOARDED' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeScreen === 'SCAN' && (
                <div className="flex-1 flex flex-col p-6">
                    <button onClick={() => setActiveScreen('DASHBOARD')} className="text-slate-400 mb-4 flex items-center gap-1"><ChevronLeft/> {t('mobile.scan.back')}</button>
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="w-64 h-64 border-2 border-blue-500 rounded-2xl flex items-center justify-center relative mb-8 bg-black/50">
                            <div className="absolute w-full h-0.5 bg-red-500 top-1/2 animate-pulse shadow-[0_0_10px_red]"></div>
                            <QrCode size={128} className="text-slate-700 opacity-20"/>
                        </div>
                        <p className="text-center text-slate-300 mb-4">{t('mobile.scan.hint')}</p>
                        
                        <input 
                            type="text" 
                            autoFocus
                            value={barcode}
                            onChange={(e) => setBarcode(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                            className="bg-slate-800 border border-slate-600 text-white p-4 rounded-xl w-full text-center font-mono text-lg outline-none focus:border-blue-500"
                            placeholder={t('mobile.scan.manual')}
                        />
                        <button onClick={handleScan} className="w-full bg-slate-700 py-3 rounded-xl font-bold mt-2">{t('mobile.scan.confirm')}</button>
                    </div>
                </div>
            )}

            {activeScreen === 'RESULT' && scanResult && (
                <div className={`flex-1 flex flex-col p-6 ${scanResult.decision === 'BOARDED' ? 'bg-green-900/20' : scanResult.decision === 'CHECK_DOCS' ? 'bg-amber-900/20' : 'bg-red-900/20'}`}>
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        {scanResult.decision === 'BOARDED' && <CheckCircle size={96} className="text-green-500 mb-4"/>}
                        {scanResult.decision === 'DENIED' && <XCircle size={96} className="text-red-500 mb-4"/>}
                        {scanResult.decision === 'CHECK_DOCS' && <ShieldAlert size={96} className="text-amber-500 mb-4"/>}

                        <h2 className={`text-3xl font-black uppercase mb-2 ${
                            scanResult.decision === 'BOARDED' ? 'text-green-400' : 
                            scanResult.decision === 'CHECK_DOCS' ? 'text-amber-400' : 'text-red-500'
                        }`}>
                            {scanResult.decision === 'BOARDED' ? t('mobile.result.ok') : scanResult.decision === 'CHECK_DOCS' ? t('mobile.result.check') : t('mobile.result.denied')}
                        </h2>
                        
                        <p className="text-xl font-bold mb-6">{scanResult.details}</p>

                        {scanResult.reservation && (
                            <div className="bg-black/40 p-4 rounded-xl w-full text-left space-y-2 mb-6 border border-white/10">
                                <p className="text-xs text-slate-400 uppercase">{t('mobile.result.pax')}</p>
                                <p className="font-bold text-lg">{scanResult.reservation.passengers[0]?.firstName || 'Brak'} {scanResult.reservation.passengers[0]?.lastName || 'Danych'}</p>
                                <p className="text-xs text-slate-400 uppercase mt-2">{t('mobile.result.cabin')}</p>
                                <p className="font-bold text-lg">{scanResult.reservation.cabinType}</p>
                            </div>
                        )}

                        {scanResult.reservation?.cabinType !== CabinType.NONE && scanResult.decision === 'BOARDED' && (
                            <button onClick={handleIssueKey} className="w-full bg-blue-600 py-4 rounded-xl font-bold mb-2 flex items-center justify-center gap-2">
                                <Key size={20}/> {t('mobile.result.btn_key')}
                            </button>
                        )}
                        
                        <button onClick={() => setActiveScreen('SCAN')} className="w-full bg-slate-700 py-4 rounded-xl font-bold mt-auto">
                            {t('mobile.result.btn_next')}
                        </button>
                    </div>
                </div>
            )}

         </div>

         {/* Physical Button Mock */}
         <div className="h-16 flex justify-center items-center gap-8 mt-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center cursor-pointer active:scale-95" onClick={() => setActiveScreen('DASHBOARD')}>
                <div className="w-4 h-4 bg-slate-400 rounded-sm"></div>
            </div>
            <div className="w-16 h-16 rounded-full bg-yellow-600 border-4 border-yellow-800 shadow-inner flex items-center justify-center cursor-pointer active:scale-95" onClick={() => setActiveScreen('SCAN')}>
                <QrCode className="text-yellow-950"/>
            </div>
            <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center cursor-pointer active:scale-95">
                <ChevronLeft className="text-slate-400"/>
            </div>
         </div>
      </div>
    </div>
  );
};

export default MobileCollector;
