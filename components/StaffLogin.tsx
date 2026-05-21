import React, { useState } from 'react';
import { Ship, Lock, User, ArrowRight, AlertCircle, Truck, ShieldCheck, Info } from 'lucide-react';
import { MOCK_USERS, MOCK_FORWARDERS } from '../services/mockData';
import { SystemUser, Forwarder } from '../types';
import { useTranslation } from '../i18n';

interface StaffLoginProps {
  onLogin: (user: SystemUser) => void;
  onCargoLogin: (client: Forwarder) => void;
}

const StaffLogin: React.FC<StaffLoginProps> = ({ onLogin, onCargoLogin }) => {
  const { t } = useTranslation();
  const [loginType, setLoginType] = useState<'STAFF' | 'CARGO'>('STAFF');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, loginType })
      });

      if (res.ok) {
        const data = await res.json();
        if (loginType === 'STAFF') {
          onLogin(data.user);
        } else {
          onCargoLogin(data.client);
        }
      } else {
        const data = await res.json();
        setError(data.message || t('login.error'));
      }
    } catch (err) {
      setError("Błąd połączenia z serwerem.");
    } finally {
      setIsLoading(false);
    }
  };

  const quickFill = (user: string, pass: string, type: 'STAFF' | 'CARGO') => {
    setLoginType(type);
    setUsername(user);
    setPassword(pass);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
         <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden z-10 relative flex flex-col md:flex-row min-h-[600px]">
         {/* Left Side: Branding & Quick Login */}
         <div className={`hidden md:flex md:w-[45%] p-10 flex-col justify-between relative overflow-hidden transition-colors duration-500 ${loginType === 'STAFF' ? 'bg-slate-900' : 'bg-slate-800'}`}>
            <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }}></div>
            
            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-8">
                  <img src="http://fiszer.app/polsca/files/ferros-logo.png" alt="FerrOS Logo" className="h-10 w-auto object-contain" referrerPolicy="no-referrer" />
               </div>
               <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                  {loginType === 'STAFF' ? 'Wydajność na każdym węźle.' : 'Logistyka bez granic.'}
               </h2>
               <p className="text-slate-400 text-sm">
                  Centralny System Rezerwacyjny
               </p>
            </div>

            {/* Quick Access List */}
            <div className="relative z-10 mt-8 space-y-6">
               <div>
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                     <Info size={12}/> Przykładowe Konta (Demo)
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                     <button 
                        onClick={() => quickFill('mfiszer', 'demo123', 'STAFF')}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left group"
                     >
                        <div>
                           <div className="text-xs font-bold text-white">mfiszer</div>
                           <div className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter">Administrator</div>
                        </div>
                        <ArrowRight size={14} className="text-slate-600 group-hover:text-blue-400 transition-colors"/>
                     </button>
                     <button 
                        onClick={() => quickFill('kjerzy', 'demo123', 'STAFF')}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left group"
                     >
                        <div>
                           <div className="text-xs font-bold text-white">kjerzy</div>
                           <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-tighter">Kasjer / Sprzedaż</div>
                        </div>
                        <ArrowRight size={14} className="text-slate-600 group-hover:text-emerald-400 transition-colors"/>
                     </button>
                     <button 
                        onClick={() => quickFill('agent1', 'demo123', 'STAFF')}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left group"
                     >
                        <div>
                           <div className="text-xs font-bold text-white">agent1</div>
                           <div className="text-[10px] text-purple-400 font-bold uppercase tracking-tighter">Agent Odprawy</div>
                        </div>
                        <ArrowRight size={14} className="text-slate-600 group-hover:text-purple-400 transition-colors"/>
                     </button>
                     <button 
                        onClick={() => quickFill('CTR-2023-01', 'cargo123', 'CARGO')}
                        className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all text-left group"
                     >
                        <div>
                           <div className="text-xs font-bold text-amber-500">CTR-2023-01</div>
                           <div className="text-[10px] text-amber-600 font-bold uppercase tracking-tighter">Spedytor (LKW WALTER)</div>
                        </div>
                        <Truck size={16} className="text-amber-600 group-hover:scale-110 transition-transform"/>
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* Right Side: Form */}
         <div className="flex-1 p-8 md:p-12 bg-white flex flex-col justify-center">
            <div className="mb-10 text-center md:text-left">
               <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                  {loginType === 'STAFF' ? 'Zaloguj się' : 'Portal Spedytora'}
               </h1>
               <p className="text-slate-500 mt-2">Wybierz rodzaj konta i wprowadź dane dostępowe.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">
                     {loginType === 'STAFF' ? t('login.user') : 'Nr Kontraktu / Login Spedytora'}
                  </label>
                  <div className="relative">
                     {loginType === 'STAFF' ? <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} /> : <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>}
                     <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-2xl outline-none transition-all font-bold text-slate-700 bg-slate-50 focus:bg-white ${loginType === 'STAFF' ? 'focus:border-blue-500' : 'focus:border-amber-500'}`}
                        placeholder={loginType === 'STAFF' ? "Login" : "CTR-XXXX-XX"}
                        autoFocus
                     />
                  </div>
               </div>
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">{t('login.pass')}</label>
                  <div className="relative">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                     <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-2xl outline-none transition-all font-bold text-slate-700 bg-slate-50 focus:bg-white ${loginType === 'STAFF' ? 'focus:border-blue-500' : 'focus:border-amber-500'}`}
                        placeholder="••••••••"
                     />
                  </div>
               </div>

               {error && (
                  <div className="flex items-center gap-3 text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-100 animate-shake">
                     <AlertCircle size={20} /> <span className="font-bold">{error}</span>
                  </div>
               )}

               <button 
                  type="submit" 
                  disabled={isLoading}
                  className={`w-full text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98] ${loginType === 'STAFF' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-900/20' : 'bg-amber-600 hover:bg-amber-700 shadow-amber-900/20'}`}
               >
                  {isLoading ? t('login.logging') : <><span className="text-lg uppercase tracking-tighter">{t('login.btn')}</span> <ArrowRight size={22}/></>}
               </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
               <span>v4.02 © {new Date().getFullYear()}</span>
               <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
               </span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default StaffLogin;