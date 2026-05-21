
import React from 'react';
import { Ship, LayoutDashboard, CalendarPlus, List, Anchor, Settings, LogOut, ShoppingCart, Briefcase, Users, Truck, Heart, Globe, PhoneCall, Server, AlertTriangle, Layers, Wallet, ClipboardList, PieChart, Network, ConciergeBell, Scan, Calendar, LifeBuoy, UserCheck, Package, Map } from 'lucide-react';
import { Language, SystemUser } from '../types';
import { MOCK_ROLE_PERMISSIONS } from '../services/mockData';
import { useTranslation } from '../i18n';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentUser: SystemUser;
  onLogout: () => void;
}

/* Fix: Pass LayoutProps to React.FC to define expected props, fixing errors where children, activeTab, and other props were not recognized on type '{}' */
const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, currentUser, onLogout }) => {
  const { language, setLanguage, t } = useTranslation();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const allMenuItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: <LayoutDashboard size={18} /> },
    { id: 'booking', label: t('nav.booking'), icon: <CalendarPlus size={18} /> },
    { id: 'reservations', label: t('nav.reservations'), icon: <List size={18} /> },
    { id: 'routes', label: t('nav.routes'), icon: <Map size={18} /> },
    { id: 'availability', label: t('nav.availability'), icon: <Calendar size={18} /> },
    { id: 'cargo', label: t('nav.cargo'), icon: <Truck size={18} /> }, 
    { id: 'resources', label: t('nav.resources'), icon: <Layers size={18} /> }, 
    { id: 'groups', label: t('nav.groups'), icon: <Users size={18} /> }, 
    { id: 'checkin', label: t('nav.checkin'), icon: <Anchor size={18} /> },
    { id: 'mobile_collector', label: t('nav.mobile_collector'), icon: <Scan size={18} /> },
    { id: 'reception', label: t('nav.reception'), icon: <ConciergeBell size={18} /> }, 
    { id: 'lost_found', label: t('nav.lost_found'), icon: <Package size={18} /> },
    { id: 'sales', label: t('nav.sales'), icon: <ShoppingCart size={18} /> },
    { id: 'shifts', label: t('nav.shifts'), icon: <ClipboardList size={18} /> }, 
    { id: 'finance', label: t('nav.finance'), icon: <Wallet size={18} /> }, 
    { id: 'agents', label: t('nav.agents'), icon: <Briefcase size={18} /> },
    { id: 'crew', label: t('nav.crew'), icon: <UserCheck size={18} /> },
    { id: 'marketing', label: t('nav.marketing'), icon: <Heart size={18} /> }, 
    { id: 'callcenter', label: t('nav.callcenter'), icon: <PhoneCall size={18} /> }, 
    { id: 'analytics', label: t('nav.analytics'), icon: <PieChart size={18} /> }, 
    { id: 'disruptions', label: t('nav.disruptions'), icon: <AlertTriangle size={18} /> }, 
    { id: 'operations', label: t('nav.operations'), icon: <Server size={18} /> }, 
    { id: 'infrastructure', label: t('nav.infrastructure'), icon: <Network size={18} /> }, 
    { id: 'admin', label: t('nav.admin'), icon: <Settings size={18} /> },
    { id: 'help', label: t('nav.help'), icon: <LifeBuoy size={18} /> },
  ];

  const allowedItems = MOCK_ROLE_PERMISSIONS[currentUser.role] || [];
  const visibleMenuItems = allMenuItems.filter(item => allowedItems.includes(item.id));

  const getLocale = (lang: Language) => {
    switch(lang) {
      case Language.PL: return 'pl-PL';
      case Language.SE: return 'sv-SE';
      case Language.DK: return 'da-DK';
      case Language.DE: return 'de-DE';
      default: return 'en-GB';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-sm">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-900 text-white flex flex-col shadow-xl z-20">
        <div className="p-4 flex flex-col gap-1 border-b border-slate-700">
          <img src="http://fiszer.app/polsca/files/ferros-logo.png" alt="FerrOS Logo" className="h-9 w-auto object-contain self-start" referrerPolicy="no-referrer" />
        </div>
        
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto sidebar-scroll">
          {visibleMenuItems.map(item => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium text-xs">{item.label}</span>
            </button>
          ))}

          <div className="mt-8 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {t('nav.extra_modules')}
          </div>
          {allowedItems.includes('reports') && (
            <button 
               onClick={() => onTabChange('reports')}
               className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm ${activeTab === 'reports' ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <span>{t('nav.reports')}</span>
            </button>
          )}
          {allowedItems.includes('client') && (
           <button 
              onClick={() => onTabChange('client')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm ${activeTab === 'client' ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
           >
            <span>{t('nav.client')}</span>
          </button>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 text-slate-400 hover:text-red-400 w-full px-4 py-2 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm">{t('nav.logout')} ({currentUser.username})</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm z-10">
          <h2 className="text-base font-semibold text-slate-800">
            {allMenuItems.find(i => i.id === activeTab)?.label || (activeTab === 'reports' ? t('nav.reports') : activeTab === 'client' ? t('nav.client') : '')}
          </h2>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                <Globe size={16} className="text-slate-500" />
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer"
                >
                   <option value="PL">PL</option>
                   <option value="EN">EN</option>
                   <option value="SE">SE</option>
                   <option value="DK">DK</option>
                   <option value="DE">DE</option>
                </select>
             </div>

             <div className="text-xs text-right hidden md:block">
                <div className="font-bold text-slate-700">{t('header.hq')}</div>
                <div className="text-slate-500">
                  {new Date().toLocaleDateString(getLocale(language), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
             </div>
             <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
                <div className="text-right hidden sm:block">
                   <div className="text-sm font-bold text-slate-800 leading-tight">{currentUser.fullName}</div>
                   <div className="text-xs text-slate-500">{currentUser.role}</div>
                </div>
                <div className="h-9 w-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm shadow-sm border border-blue-200">
                  {getInitials(currentUser.fullName)}
                </div>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-slate-50/50">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
