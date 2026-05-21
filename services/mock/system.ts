import { ReportDefinition, ReportSchedule, BlacklistEntry, SystemConfig, NotificationTemplate, NotificationLog, HelpArticle, SupportTicket, SystemHealthStatus, CrewMember, VisitorLogEntry, BlacklistType, BlacklistSeverity, TicketPriority, TicketStatus, CrewRank, Complaint, ComplaintStatus, ComplaintCategory, CateringSummary, GateTelemetry, GateEvent } from '../../types';

export const MOCK_REPORTS: ReportDefinition[] = [
  { id: '1', name: 'Manifest Pasażerski', code: '11.1', category: 'PAX', description: 'Pełna lista pasażerów z podziałem na kabiny i status odprawy.' },
  { id: '2', name: 'Manifest Ładunkowy', code: '11.2', category: 'CARGO', description: 'Zestawienie pojazdów frachtowych, wag, długości i towarów niebezpiecznych ADR.' },
  { id: '3', name: 'Raport Waiting List', code: '11.5', category: 'PAX', description: 'Analiza rezerwacji oczekujących na zwolnienie miejsc.' },
  { id: '4', name: 'Raport Dostępności', code: '11.6', category: 'PAX', description: 'Aktualne obłożenie linii, statków i poszczególnych typów kabin.' },
  { id: '5', name: 'Raport Wykorzystania Karnetów', code: '11.7', category: 'PAX', description: 'Statystyki sprzedaży i użycia biletów wieloprzejazdowych.' },
  { id: '6', name: 'Raport Załadowanych Jednostek', code: '12.4', category: 'CARGO', description: 'Lista pojazdów, które faktycznie wjechały na pokład (Boarded).' },
  { id: '7', name: 'Raport Eksploatacyjny', code: '13.1', category: 'EXPLOITATION', description: 'Zużycie paliwa, prędkość i warunki pogodowe dla każdego rejsu.' },
  { id: '8', name: 'Bilety Niewykorzystane (Non-Show)', code: '13.3', category: 'PAX', description: 'Wykaz pasażerów i pojazdów, którzy nie stawili się na rejs.' },
  { id: '9', name: 'Sprzedaż Dzienna (Cashier)', code: '15.1', category: 'SALES', description: 'Zbiorczy raport utargu z kasy, terminali i sprzedaży online.' },
  { id: '10', name: 'Analiza Sprzedaży Produktów', code: '15.3', category: 'SALES', description: 'Breakdown sprzedaży usług pokładowych (gastronomia, sklep).' },
  { id: '11', name: 'Rejestr Zwrotów i Korekt', code: '15.6', category: 'SALES', description: 'Zestawienie wszystkich anulacji biletów i wypłaconych refundacji.' },
  { id: '12', name: 'Raport Wykorzystania Zniżek', code: '15.7', category: 'SALES', description: 'Efektywność kodów promocyjnych i kampanii marketingowych.' },
  { id: '13', name: 'Rozliczenia Interline', code: '15.8', category: 'SALES', description: 'Zestawienie sprzedaży biletów partnerów zewnętrznych.' },
  { id: '14', name: 'Ranking Agentów', code: '15.9', category: 'SALES', description: 'Wyniki sprzedaży poszczególnych biur podróży i prowizje.' }
];
export const MOCK_REPORT_SCHEDULES: ReportSchedule[] = [{ id: 'S1', reportId: '1', recipientEmail: 'pax@ferros.pl', frequency: 'DAILY', active: true }];
export const MOCK_BLACKLIST: BlacklistEntry[] = [{ id: 'BL-1', type: BlacklistType.PERSON, value: 'ABC123456', reason: 'Agresja', severity: BlacklistSeverity.BLOCK, dateAdded: '2023-09-01', active: true }];
export const MOCK_SYSTEM_CONFIG: SystemConfig[] = [{ key: 'system.currency.base', label: 'Waluta Bazowa', group: 'FINANCE', value: 'PLN' }];
export const MOCK_NOTIFICATION_TEMPLATES: NotificationTemplate[] = [{ id: 'TPL-1', name: 'Opóźnienie', type: 'SMS', contentPattern: 'Rejs {routeId} opóźniony o {delay} min.' }];
export const MOCK_NOTIFICATION_LOGS: NotificationLog[] = [{ id: 'NL-1', date: '2023-10-25 09:30', templateName: 'Opóźnienie 15min', contentPreview: 'Rejs opóźniony.', channel: 'SMS', status: 'SENT', recipientCount: 150 }];

export const MOCK_HELP_ARTICLES: HelpArticle[] = [
  { 
    id: '1', 
    title: 'Procedura Odprawy Pasażerskiej', 
    category: 'PROCEDURES', 
    content: '1. Zweryfikuj dokument tożsamości z danymi w systemie.\n2. Sprawdź status płatności (musi być PAID).\n3. Wydaj kartę pokładową/kabnową.\n4. W przypadku pojazdu: wydaj naklejkę na szybę z numerem pasa.', 
    tags: ['checkin', 'pax', 'boarding'], 
    views: 1250, 
    lastUpdated: '2023-10-01' 
  },
  { 
    id: '2', 
    title: 'Obsługa ładunków ADR (Niebezpiecznych)', 
    category: 'CARGO', 
    content: 'Pojazdy z ładunkiem ADR wymagają specjalnego oznaczenia w manifeście ładunkowym (Etap 11.2). Należy sprawdzić numer UN towaru i upewnić się, że statek posiada odpowiednie certyfikaty klasowe dla danego rejsu.', 
    tags: ['adr', 'cargo', 'safety'], 
    views: 840, 
    lastUpdated: '2023-09-15' 
  },
  { 
    id: '3', 
    title: 'Rozliczanie Prowizji Agencyjnych', 
    category: 'SALES', 
    content: 'Noty prowizyjne są generowane automatycznie 1-go dnia miesiąca (Etap 5.3). Przed zatwierdzeniem sprawdź, czy wszystkie rezerwacje agenta z poprzedniego miesiąca mają status CHECKED_IN lub PAID.', 
    tags: ['agents', 'commissions', 'finance'], 
    views: 450, 
    lastUpdated: '2023-10-12' 
  },
  { 
    id: '4', 
    title: 'Konfiguracja Koderów RFID (HID Omnikey)', 
    category: 'TECHNICAL', 
    content: 'W przypadku błędów zapisu kart kabinowych: \n1. Odłącz koder od portu USB.\n2. Zrestartuj usługę FerrOS Device Bridge.\n3. Wykonaj test w module Infrastruktura (Etap 7.5).', 
    tags: ['rfid', 'hardware', 'technical'], 
    views: 310, 
    lastUpdated: '2023-10-20' 
  },
  { 
    id: '5', 
    title: 'Zasady Wykorzystania Karnetów', 
    category: 'PROCEDURES', 
    content: 'Karnety (Etap 4.11) są przypisane do numeru rejestracyjnego lub nazwiska. Jeden przejazd zdejmuje 1 jednostkę z puli. Karnety wygasają automatycznie po 12 miesiącach od daty zakupu.', 
    tags: ['carnets', 'tickets'], 
    views: 1100, 
    lastUpdated: '2023-08-20' 
  }
];

export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [
  { id: 'TKT-101', userId: 'U1', subject: 'Problem z drukarką fiskalną (BOK)', description: 'Błąd synchronizacji bufora fiskalnego. Drukarka wyświetla błąd 204.', category: 'HARDWARE', priority: TicketPriority.HIGH, status: TicketStatus.OPEN, createdAt: '2023-10-25 08:30', assignedTo: 'Admin_IT' },
  { id: 'TKT-105', userId: 'U3', subject: 'Wolne działanie modułu analityki', description: 'Dashboard ładuje się powyżej 10 sekund przy wyborze zakresu rocznego.', category: 'SOFTWARE', priority: TicketPriority.MEDIUM, status: TicketStatus.IN_PROGRESS, createdAt: '2023-10-24 14:20', assignedTo: 'BI_Team' },
  { id: 'TKT-108', userId: 'U4', subject: 'Dostęp do modułu PHICS', description: 'Proszę o nadanie uprawnień do wysyłki list pasażerów do SG.', category: 'ACCESS', priority: TicketPriority.LOW, status: TicketStatus.RESOLVED, createdAt: '2023-10-23 09:15', assignedTo: 'Sec_Manager' }
];

export const MOCK_SYSTEM_STATUS: SystemHealthStatus[] = [
  { serviceName: 'Główna Baza Danych (FerrOS DB)', status: 'OPERATIONAL', uptime: 99.99, lastCheck: '1 min temu' },
  { serviceName: 'API Kursów NBP', status: 'OPERATIONAL', uptime: 98.50, lastCheck: '5 min temu' },
  { serviceName: 'System Fiskalizacji Online', status: 'DEGRADED', uptime: 94.20, lastCheck: '10 min temu' },
  { serviceName: 'Bramki SmartGate LPR (Świnoujście)', status: 'OPERATIONAL', uptime: 99.10, lastCheck: '2 min temu' },
  { serviceName: 'Bramki SmartGate LPR (Ystad)', status: 'OUTAGE', uptime: 82.00, lastCheck: '30 sek temu' },
  { serviceName: 'Serwer Raportowania PHICS', status: 'OPERATIONAL', uptime: 100.00, lastCheck: '15 min temu' }
];

export const MOCK_CREW: CrewMember[] = [
  { id: 'CRW-1', firstName: 'Jan', lastName: 'Kapitański', rank: CrewRank.CAPTAIN, documentNumber: 'SEA-001', status: 'ON_BOARD' },
  { id: 'CRW-2', firstName: 'Marek', lastName: 'Wachowy', rank: CrewRank.OFFICER, documentNumber: 'SEA-042', status: 'ON_BOARD' },
  { id: 'CRW-3', firstName: 'Andrzej', lastName: 'Smarowny', rank: CrewRank.ENGINEER, documentNumber: 'SEA-088', status: 'ON_BOARD' },
  { id: 'CRW-4', firstName: 'Robert', lastName: 'Kucharz', rank: CrewRank.COOK, documentNumber: 'SEA-101', status: 'ON_BOARD' },
  { id: 'CRW-5', firstName: 'Anna', lastName: 'Kelnerska', rank: CrewRank.STEWARD, documentNumber: 'SEA-205', status: 'ON_BOARD' },
  { id: 'CRW-6', firstName: 'Piotr', lastName: 'Zmiennik', rank: CrewRank.OFFICER, documentNumber: 'SEA-045', status: 'OFF_DUTY' },
  { id: 'CRW-7', firstName: 'Krzysztof', lastName: 'Kotłowy', rank: CrewRank.ENGINEER, documentNumber: 'SEA-090', status: 'OFF_DUTY' },
];

export const MOCK_VISITORS: VisitorLogEntry[] = [{ id: 'VIS-1', firstName: 'Tomasz', lastName: 'Inspektor', company: 'PRS', purpose: 'Inspekcja', idCardNumber: 'ABC 123', checkInTime: '2023-10-25 09:00', status: 'ON_BOARD' }];
export const MOCK_COMPLAINTS: Complaint[] = [{ id: 'CMP-1', dateFiled: '2023-10-20', status: ComplaintStatus.NEW, clientName: 'Janusz Kowalski', email: 'janusz@example.com', category: ComplaintCategory.SERVICE, description: 'Błąd.' }];
export const MOCK_CATERING_SUMMARIES: CateringSummary[] = [{ id: 'CAT-1', routeId: 'R001', date: '2023-11-15', totalGroups: 2, totalPax: 105, breakfasts: 105, lunches: 105, dinners: 60, specialDiets: 12, status: 'DRAFT' }];

export const MOCK_GATE_TELEMETRY: GateTelemetry[] = [
  {
    gateId: 'GATE-A1',
    mode: 'AUTO',
    status: 'OK',
    sensors: [
      { type: 'CAMERA_LPR', value: 'GD 12345' },
      { type: 'BARRIER', value: 'CLOSED' },
      { type: 'LOOP', value: 'DETECTED' },
      { type: 'OPTICAL', value: 'CLEAR' }
    ]
  },
  {
    gateId: 'GATE-A2',
    mode: 'AUTO',
    status: 'OK',
    sensors: [
      { type: 'CAMERA_LPR', value: '-' },
      { type: 'BARRIER', value: 'CLOSED' },
      { type: 'LOOP', value: 'IDLE' },
      { type: 'OPTICAL', value: 'CLEAR' }
    ]
  }
];

export const MOCK_GATE_EVENTS: GateEvent[] = [
  { id: 'EV-1', gateId: 'GATE-A1', timestamp: '2023-10-25 12:40:00', type: 'ENTRY', description: 'Pojazd zidentyfikowany: GD 12345', severity: 'INFO' },
  { id: 'EV-2', gateId: 'GATE-A1', timestamp: '2023-10-25 12:40:05', type: 'ENTRY', description: 'Otwarcie bariery', severity: 'INFO' }
];