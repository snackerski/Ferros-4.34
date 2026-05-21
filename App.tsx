import React, { useState } from 'react';
import Layout from './components/Layout';
import StaffLogin from './components/StaffLogin';
import Dashboard from './components/Dashboard';
import BookingWizard from './components/BookingWizard';
import RoutesModule from './components/RoutesModule';
import ReservationList from './components/ReservationList';
import CheckInModule from './components/CheckInModule';
import SalesModule from './components/SalesModule';
import ReportsModule from './components/ReportsModule';
import ClientPanel from './components/ClientPanel';
import AgentModule from './components/AgentModule';
import GroupModule from './components/GroupModule';
import CargoModule from './components/CargoModule';
import MarketingModule from './components/MarketingModule';
import AdministrationModule from './components/AdministrationModule';
import CallCenterModule from './components/CallCenterModule';
import OperationsModule from './components/OperationsModule';
import DisruptionModule from './components/DisruptionModule';
import ResourceModule from './components/ResourceModule';
import FinanceModule from './components/FinanceModule';
import ShiftModule from './components/ShiftModule';
import AnalyticsModule from './components/AnalyticsModule';
import InfrastructureModule from './components/InfrastructureModule';
import ReceptionModule from './components/ReceptionModule';
import MobileCollector from './components/MobileCollector';
import VoyageAvailability from './components/VoyageAvailability';
import HelpModule from './components/HelpModule';
import CrewModule from './components/CrewModule';
import LostAndFoundModule from './components/LostAndFoundModule';
import CargoClientPortal from './components/CargoClientPortal';
import { SystemUser, Forwarder } from './types';
import { LanguageProvider } from './i18n';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<SystemUser | null>(null);
  const [cargoClient, setCargoClient] = useState<Forwarder | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogin = (user: SystemUser) => {
    setCurrentUser(user);
    setCargoClient(null);
    setActiveTab('dashboard');
  };

  const handleCargoLogin = (client: Forwarder) => {
    setCargoClient(client);
    setCurrentUser(null);
    setActiveTab('cargo_dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCargoClient(null);
  };

  const renderContent = () => {
    if (cargoClient) {
        return <CargoClientPortal client={cargoClient} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard currentUser={currentUser} />;
      case 'booking':
        return <BookingWizard />;
      case 'routes':
        return <RoutesModule />;
      case 'availability':
        return <VoyageAvailability />;
      case 'reservations':
        return <ReservationList />;
      case 'callcenter':
        return <CallCenterModule />;
      case 'groups':
        return <GroupModule />;
      case 'cargo':
        return <CargoModule />;
      case 'checkin':
        return <CheckInModule />;
      case 'mobile_collector':
        return <MobileCollector />;
      case 'reception':
        return <ReceptionModule />;
      case 'lost_found':
        return <LostAndFoundModule />;
      case 'sales':
        return <SalesModule />;
      case 'shifts':
        return <ShiftModule />;
      case 'finance':
        return <FinanceModule />;
      case 'agents':
        return <AgentModule />;
      case 'marketing':
        return <MarketingModule />;
      case 'analytics':
        return <AnalyticsModule currentUser={currentUser} />;
      case 'disruptions':
        return <DisruptionModule />;
      case 'resources':
        return <ResourceModule />;
      case 'operations':
        return <OperationsModule />;
      case 'infrastructure':
        return <InfrastructureModule />;
      case 'admin':
        return <AdministrationModule />;
      case 'reports':
        return <ReportsModule />;
      case 'client':
        return <ClientPanel />;
      case 'help':
        return <HelpModule />;
      case 'crew':
        return <CrewModule />;
      default:
        return <Dashboard currentUser={currentUser} />;
    }
  };

  return (
    <LanguageProvider>
      {!currentUser && !cargoClient ? (
        <StaffLogin onLogin={handleLogin} onCargoLogin={handleCargoLogin} />
      ) : (
        cargoClient ? (
            renderContent()
        ) : (
            <Layout 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
              currentUser={currentUser!} 
              onLogout={handleLogout}
            >
              {renderContent()}
            </Layout>
        )
      )}
    </LanguageProvider>
  );
};

export default App;