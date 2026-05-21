import { LostItem, LostItemCategory, LostItemStatus, CrewCertificate, WorkRestLog } from '../types';

export * from './mock/infrastructure';
export * from './mock/admin';
export * from './mock/sailings';
export * from './mock/bookings';
export * from './mock/cargo';
export * from './mock/finance';
export * from './mock/marketing';
export * from './mock/system';
export * from './mock/analytics';

// Pozostałe eksporty pomocnicze
export const MOCK_ONBOARD_TRANSACTIONS = [];
export const MOCK_COLLECTOR_SCANS = [];

export const MOCK_CREW_CERTIFICATES: CrewCertificate[] = [
  { id: 'CERT-1', crewId: 'CRW-1', name: 'Dyplom Kapitana Ż.W.', type: 'COMPETENCY', issueDate: '2020-01-15', expiryDate: '2025-01-15', status: 'VALID' },
  { id: 'CERT-2', crewId: 'CRW-1', name: 'Świadectwo Zdrowia', type: 'MEDICAL', issueDate: '2023-09-10', expiryDate: '2025-09-10', status: 'VALID' },
  { id: 'CERT-3', crewId: 'CRW-2', name: 'Dyplom Oficera Wachtowego', type: 'COMPETENCY', issueDate: '2019-05-20', expiryDate: '2024-05-20', status: 'WARNING' },
  { id: 'CERT-4', crewId: 'CRW-3', name: 'Bezpieczeństwo Zbiorowe', type: 'TRAINING', issueDate: '2018-10-12', expiryDate: '2023-10-12', status: 'EXPIRED' },
  { id: 'CERT-5', crewId: 'CRW-4', name: 'HACCP w Gastronomii Morskiej', type: 'TRAINING', issueDate: '2022-03-01', expiryDate: '2027-03-01', status: 'VALID' },
  { id: 'CERT-6', crewId: 'CRW-5', name: 'Świadectwo Zdrowia', type: 'MEDICAL', issueDate: '2023-01-01', expiryDate: '2025-01-01', status: 'VALID' },
];

export const MOCK_WORK_LOGS: WorkRestLog[] = [
  { id: 'LOG-1', crewId: 'CRW-1', date: '2023-10-24', workStart: '08:00', workEnd: '20:00', restHours: 12, violation: false },
  { id: 'LOG-2', crewId: 'CRW-2', date: '2023-10-24', workStart: '04:00', workEnd: '16:00', restHours: 12, violation: false },
  { id: 'LOG-3', crewId: 'CRW-3', date: '2023-10-24', workStart: '00:00', workEnd: '18:00', restHours: 6, violation: true },
  { id: 'LOG-4', crewId: 'CRW-4', date: '2023-10-24', workStart: '06:00', workEnd: '18:00', restHours: 12, violation: false },
  { id: 'LOG-5', crewId: 'CRW-5', date: '2023-10-24', workStart: '10:00', workEnd: '22:00', restHours: 12, violation: false },
];

export const MOCK_WORK_LOGS_LEGACY = [];
export const MOCK_CARNETS = [];
export const MOCK_UNUSED_TICKETS = [];
export const MOCK_REFUND_ITEMS = [];
export const MOCK_DISCOUNT_ITEMS = [];
export const MOCK_BOARDED_VEHICLES = [];
export const MOCK_SALES_BREAKDOWN = [];
export const MOCK_INTERLINE_SALES = [];
export const MOCK_EXPLOITATION_DATA = [];
export const MOCK_AGENTS_LEGACY = [];
export const MOCK_INTEGRATION_TASKS = [];
export const MOCK_EXTERNAL_CHANNELS = [];
export const MOCK_PHICS_TRANSACTIONS = [];
export const MOCK_SYSTEM_DOCUMENTS = [];
export const MOCK_PORT_GATES = [];
export const MOCK_TIME_LIMIT_RULES = [];
export const MOCK_DISCOUNT_CODES = [];
export const MOCK_SYSTEM_JOBS = [];
export const MOCK_SCHEDULE_DEFINITIONS = [];
export const MOCK_REGULATORY_DISCOUNTS = [];

export const MOCK_LOST_ITEMS: LostItem[] = [
  {
    id: 'LF-2023-001',
    dateFound: '2023-10-24',
    locationFound: 'Kabina 5012',
    category: LostItemCategory.ELECTRONICS,
    description: 'Smartfon iPhone 13 Pro (Niebieski)',
    foundBy: 'Steward Adam',
    status: LostItemStatus.STORED,
    storageLocation: 'Sejf Recepcja',
    imagePlaceholderColor: 'bg-blue-200'
  },
  {
    id: 'LF-2023-002',
    dateFound: '2023-10-25',
    locationFound: 'Restauracja "Nova"',
    category: LostItemCategory.DOCUMENTS,
    description: 'Paszport obywatela Szwecji',
    foundBy: 'Kelnerka Anna',
    status: LostItemStatus.NEW,
    storageLocation: 'Szuflada B1 (Reception)',
    imagePlaceholderColor: 'bg-amber-200'
  }
];

export const logAnalyticsEvent = (e: string, d: any) => console.log(e, d);