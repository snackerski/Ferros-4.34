import { SystemUser, RolePermissionConfig, AuditLogEntry, ApiLogEntry, Agent } from '../../types';

export const MOCK_MENU_DEFINITIONS = [
  { id: 'dashboard', label: 'Kokpit' },
  { id: 'booking', label: 'Nowa Rezerwacja' },
  { id: 'reservations', label: 'Lista Rezerwacji' },
  { id: 'routes', label: 'Rozkład Rejsów' },
  { id: 'availability', label: 'Dostępność' },
  { id: 'cargo', label: 'Cargo / Fracht' },
  { id: 'resources', label: 'Plan Pokładów' },
  { id: 'groups', label: 'Grupy' },
  { id: 'checkin', label: 'Odprawa / Ops' },
  { id: 'mobile_collector', label: 'Terminal Mobilny' },
  { id: 'reception', label: 'Recepcja (Prom)' },
  { id: 'lost_found', label: 'Biuro Rzeczy' },
  { id: 'sales', label: 'Sprzedaż / Kasa' },
  { id: 'shifts', label: 'Rozliczenia Zmian' },
  { id: 'finance', label: 'Księgowość' },
  { id: 'agents', label: 'Agenci' },
  { id: 'crew', label: 'Kadry / Crewing' },
  { id: 'marketing', label: 'Marketing (CRM)' },
  { id: 'callcenter', label: 'Call Center / BOK' },
  { id: 'analytics', label: 'Analityka / BI' },
  { id: 'disruptions', label: 'Zakłócenia / Zasoby' },
  { id: 'operations', label: 'Operacje / IT' },
  { id: 'infrastructure', label: 'Infrastruktura' },
  { id: 'admin', label: 'Administracja' },
  { id: 'help', label: 'Pomoc' },
  { id: 'reports', label: 'Raporty' },
  { id: 'client', label: 'Strefa Klienta' }
];

export const MOCK_ROLE_PERMISSIONS: RolePermissionConfig = {
  'ADMIN': ['dashboard', 'booking', 'reservations', 'routes', 'availability', 'cargo', 'resources', 'groups', 'checkin', 'mobile_collector', 'reception', 'lost_found', 'sales', 'shifts', 'finance', 'agents', 'crew', 'marketing', 'callcenter', 'analytics', 'disruptions', 'operations', 'infrastructure', 'admin', 'help', 'reports', 'client'],
  'MANAGER': ['dashboard', 'booking', 'reservations', 'routes', 'availability', 'cargo', 'resources', 'groups', 'checkin', 'reception', 'lost_found', 'sales', 'shifts', 'finance', 'agents', 'crew', 'callcenter', 'analytics', 'disruptions', 'operations', 'help', 'reports'],
  'CASHIER': ['dashboard', 'booking', 'sales', 'shifts', 'checkin', 'reception', 'help'],
  'MVP': ['dashboard', 'booking', 'reservations', 'checkin', 'sales', 'reports', 'client', 'infrastructure', 'operations']
};

export const MOCK_USERS: SystemUser[] = [
  { id: 'U1', username: 'mfiszer', fullName: 'Maciej Fiszer', role: 'ADMIN' },
  { id: 'U3', username: 'kjerzy', fullName: 'Krzysztof Jerzy', role: 'CASHIER' },
  { id: 'U4', username: 'agent1', fullName: 'Agent Odprawy', role: 'CHECKIN_AGENT' }
];

export const MOCK_AGENTS: Agent[] = [
  { 
    id: 'A-001', 
    name: 'TravelPlanet Sp. z o.o.', 
    code: 'TP-POL-01', 
    type: 'EXTERNAL', 
    contactPerson: 'Monika Kwiatkowska', 
    email: 'booking@travelplanet.pl', 
    baseCommission: 0.07, 
    currentMonthSales: 124500 
  },
  { 
    id: 'A-002', 
    name: 'BOK Świnoujście - Terminal', 
    code: 'BOK-SWI-01', 
    type: 'INTERNAL', 
    contactPerson: 'Robert Dąbrowski', 
    email: 'bok.swinoujscie@ferros.pl', 
    baseCommission: 0.03, 
    currentMonthSales: 489000 
  },
  { 
    id: 'A-003', 
    name: 'Viking Reizen SE', 
    code: 'VK-SWE-99', 
    type: 'PARTNER', 
    contactPerson: 'Sven Larsson', 
    email: 'b2b@vikingreizen.se', 
    baseCommission: 0.10, 
    currentMonthSales: 67200 
  },
  { 
    id: 'A-004', 
    name: 'TUI Poland', 
    code: 'TUI-PL-CORP', 
    type: 'EXTERNAL', 
    contactPerson: 'Anna Nowak', 
    email: 'ferry.desk@tui.pl', 
    baseCommission: 0.08, 
    currentMonthSales: 215000 
  }
];

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 'LOG-1', date: '2023-10-25 10:00:00', user: 'mfiszer', action: 'LOGIN', details: 'Zalogowano do systemu' },
  { id: 'LOG-2', date: '2023-10-25 10:05:00', user: 'mfiszer', action: 'MODIFY_PRICE', details: 'Zmiana ceny bazowej R001: 250 -> 260' }
];

export const MOCK_API_LOGS: ApiLogEntry[] = [
  { id: 'API-1', timestamp: '2023-10-25, 10:00:01', channel: 'Direct Ferries', method: 'POST', endpoint: '/api/v1/booking', status: 201, latency: 120, payloadSnippet: '{"route": "R001"}' }
];