
export enum Language { PL = 'PL', EN = 'EN', SE = 'SE', DK = 'DK', DE = 'DE' }
export enum BookingStatus { CONFIRMED = 'Potwierdzona', PAID = 'Opłacona', CHECKED_IN = 'Odprawiona', CANCELLED = 'Anulowana', WAITING_LIST = 'Waiting List' }
export enum VehicleType { NONE = 'Brak (Pieszy)', CAR = 'Osobowy', BUS = 'Autobus', MOTORCYCLE = 'Motocykl', TRUCK = 'Ciężarówka', TRAILER = 'Naczepa' }
export enum CabinType { NONE = 'Bez kabiny', INSIDE_2 = 'Wew. 2-os', INSIDE_4 = 'Wew. 4-os', OUTSIDE_2 = 'Zew. 2-os', OUTSIDE_4 = 'Zew. 4-os', LUX = 'Apartament LUX' }
export enum CargoLoadType { STANDARD = 'Standard', ADR = 'ADR', OVERSIZED = 'Gabaryt', REFRIGERATED = 'Chłodnia' }
export enum TicketPriority { LOW = 'Niski', MEDIUM = 'Średni', HIGH = 'Wysoki', CRITICAL = 'Krytyczny' }
export enum TicketStatus { OPEN = 'Otwarty', IN_PROGRESS = 'W toku', RESOLVED = 'Rozwiązana', CLOSED = 'Zamknięty' }
export enum SailingStatus { SCHEDULED = 'Planowy', DELAYED = 'Opóźniony', CANCELLED = 'Anulowany' }
export enum CabinStatus { FREE = 'Wolna', OCCUPIED = 'Zajęta', DIRTY = 'Do sprzątania', OUT_OF_ORDER = 'Wyłączona' }
export enum CabinPool { PASSENGER = 'Pasażerska', DRIVER = 'Kierowcy' }
export enum PackagingType { PALLET = 'Paleta', BOX = 'Karton', ROLL = 'Rola', BULK = 'Luzem' }
export enum BlacklistType { PERSON = 'Osoba', VEHICLE = 'Pojazd', COMPANY = 'Firma' }
export enum BlacklistSeverity { WARNING = 'Ostrzeżenie', BLOCK = 'Blokada' }
export enum ComplaintStatus { NEW = 'Nowa', IN_PROGRESS = 'W toku', RESOLVED = 'Rozwiązana', REJECTED = 'Odrzucona' }
export enum ComplaintCategory { SERVICE = 'Obsługa', CLEANLINESS = 'Czystość', FOOD = 'Gastronomia', DELAY = 'Opóźnienie', OTHER = 'Inne' }
export enum CrewRank { CAPTAIN = 'Kapitan', OFFICER = 'Oficer', ENGINEER = 'Mechanik', CREW = 'Załoga', COOK = 'Kucharz', STEWARD = 'Steward' }
export enum SecurityLevel { LEVEL_1 = 'Poziom 1', LEVEL_2 = 'Poziom 2', LEVEL_3 = 'Poziom 3' }
export enum LoyaltyTier { SILVER = 'Silver', GOLD = 'Gold', PLATINUM = 'Platinum' }
export enum LostItemStatus { NEW = 'Nowe', STORED = 'W Magazynie', CLAIMED = 'Odebrane', DISPOSED = 'Zutylizowane' }
export enum LostItemCategory { ELECTRONICS = 'Elektronika', DOCUMENTS = 'Dokumenty', CLOTHING = 'Odzież', LUGGAGE = 'Bagaż', OTHER = 'Inne' }

export interface RolePermissionConfig {
  [role: string]: string[]; // role -> array of allowed menuIds
}

export interface SystemUser {
  id: string;
  username: string;
  fullName: string;
  role: 'ADMIN' | 'MANAGER' | 'CASHIER' | 'CHECKIN_AGENT' | 'MVP';
  email?: string;
}

export interface Route {
  id: string;
  origin: string;
  destination: string;
  basePrice: number;
  shipName: string;
  departureTime: string;
}

export interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
  documentNumber: string;
  isDriver?: boolean;
  birthDate?: string;
  nationality?: string;
}

export interface CargoDetails {
  length: number;
  weight: number;
  loadType: CargoLoadType;
  goodsDescription?: string;
  forwarderRef?: string;
}

export interface Reservation {
  id: string;
  bookingDate: string;
  status: BookingStatus;
  routeId: string;
  passengers: Passenger[];
  vehicleType: VehicleType;
  vehicleReg?: string;
  cabinType: CabinType;
  cabinNumber?: string;
  totalPrice: number;
  contactEmail: string;
  isCargo?: boolean;
  cargoDetails?: CargoDetails;
  linkedBookingId?: string;
  forwarderId?: string;
  validUntil?: string;
  notes?: string;
}

export interface CargoBooking extends Reservation {}

export interface Product {
  id: string;
  name: string;
  category: 'TICKETS' | 'FOOD' | 'SHOP' | 'SERVICES' | 'ALL';
  pricePln: number;
  taxRate: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface SalesDocument {
  id: string;
  type: 'RECEIPT' | 'INVOICE';
  date: string;
  clientName?: string;
  totalPln: number;
}

export interface ExchangeRate {
  currency: string;
  rate: number;
}

export interface ClientProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  points: number;
  bookings: string[];
  tier: LoyaltyTier;
}

export interface LoyaltyMember {
  id: string;
  firstName: string;
  lastName: string;
  cardNumber: string;
  email: string;
  joinDate: string;
  pointsBalance: number;
  tier: LoyaltyTier;
}

export interface LoyaltyTransaction {
  id: string;
  memberId: string;
  date: string;
  type: 'EARN' | 'REDEEM';
  description: string;
  points: number;
}

export interface Survey {
  id: string;
  title: string;
  targetGroup: string;
  npsScore: number;
  responseCount: number;
}

export interface SurveyFeedback {
  id: string;
  surveyId: string;
  score: number;
  comment: string;
  passengerName?: string;
  date: string;
}

export interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  discountCode: string;
  imageColor: string;
}

export interface WebAccount {
  id: string;
  email: string;
  status: 'ACTIVE' | 'LOCKED';
  lastLogin: string;
  failedLoginAttempts: number;
  linkedClientId?: string;
}

export interface AbandonedCart {
  id: string;
  date: string;
  customerEmail: string;
  routeId: string;
  value: number;
  status: 'NEW' | 'RECOVERED' | 'LOST';
  recoveryEmailSent: boolean;
}

export interface WebAffiliate {
  id: string;
  name: string;
  referralCode: string;
  visits: number;
  conversions: number;
  commissionEarned: number;
}

export interface HelpArticle {
  id: string;
  title: string;
  category: 'PROCEDURES' | 'TECHNICAL' | 'SALES' | 'CARGO';
  content: string;
  tags: string[];
  views: number;
  lastUpdated: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  category: 'HARDWARE' | 'SOFTWARE' | 'ACCESS';
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  assignedTo?: string;
}

export interface SystemHealthStatus {
  serviceName: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'OUTAGE';
  uptime: number;
  lastCheck: string;
}

export interface ReportDefinition {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
}

export interface ReportSchedule {
  id: string;
  reportId: string;
  recipientEmail: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  active: boolean;
}

export interface Agent {
  id: string;
  name: string;
  code: string;
  type: 'INTERNAL' | 'EXTERNAL' | 'PARTNER';
  contactPerson: string;
  email: string;
  baseCommission: number;
  currentMonthSales: number;
}

export interface CommissionNote {
  id: string;
  agentId: string;
  period: string;
  totalSales: number;
  calculatedCommission: number;
  status: 'DRAFT' | 'APPROVED' | 'PAID';
}

export interface CommissionThreshold {
  thresholdAmount: number;
  commissionRate: number;
}

export interface GroupPassenger extends Passenger {
  cabinType: CabinType;
}

export interface GroupPayment {
  id: string;
  date: string;
  amount: number;
  method: string;
  type: 'DEPOSIT' | 'FINAL';
}

export interface GroupBooking {
  id: string;
  name: string;
  routeId: string;
  departureDate: string;
  paxCount: number;
  status: 'OFFER' | 'CONFIRMED' | 'PAID';
  totalPrice: number;
  cabinAllocation: {type: CabinType, count: number}[];
  passengers: GroupPassenger[];
  payments: GroupPayment[];
  agencyName?: string;
  leaderName?: string;
  leaderPhone?: string;
}

export interface CateringSummary {
  id: string;
  routeId: string;
  date: string;
  totalGroups: number;
  totalPax: number;
  breakfasts: number;
  lunches: number;
  dinners: number;
  specialDiets: number;
  status: 'DRAFT' | 'SENT_TO_SHIP';
}

export interface Forwarder {
  id: string;
  name: string;
  contractNumber: string;
  paymentType: 'PREPAID' | 'INVOICE';
  currentBalance: number;
  creditLimit: number;
}

export interface Allotment {
  id: string;
  forwarderId: string;
  totalSpace: number;
  usedSpace: number;
  releasedSpace?: number;
}

export interface BillOfLading {
  id: string;
  routeId: string;
  senderName: string;
  receiverName: string;
  items: {description: string, packaging: PackagingType, quantity: number, weight: number, volume: number, isADR: boolean}[];
  totalWeight: number;
  totalVolume: number;
  status: 'ISSUED' | 'DRAFT';
  dateIssued: string;
  freightCost: number;
}

export interface CargoInvoice {
  id: string;
  forwarderId: string;
  periodStart: string;
  periodEnd: string;
  dueDate: string;
  totalAmount: number;
  currency: string;
  status: 'ISSUED' | 'PAID' | 'OVERDUE';
}

export interface CargoDriver {
  id: string;
  firstName: string;
  lastName: string;
  documentNumber: string;
  phoneNumber: string;
  forwarderId?: string;
}

export interface CargoVehicle {
  id: string;
  registrationNumber: string;
  name?: string;
  type: VehicleType;
  length: number;
  weight: number;
  forwarderId?: string;
}

export interface CargoContract {
  id: string;
  forwarderId: string;
  ratePerMeter: number;
  discountPercent: number;
}

export interface CargoProgressiveDiscount {
  id: string;
  forwarderId: string;
  period: string;
  thresholdMeters: number;
  discountPercent: number;
}

export interface StandardCargoPrice {
  id: string;
  routeId: string;
  lengthCategory: string;
  pricePerMeter: number;
  driverIncluded: boolean;
}

export interface EDIMessage {
  id: string;
  receivedAt: string;
  sender: string;
  type: 'NEW_BOOKING' | 'MODIFY' | 'CANCEL';
  content: {refNumber: string, vehicleReg?: string, routeId: string, length?: number, weight?: number, driverName?: string};
  status: 'PENDING' | 'PROCESSED' | 'REJECTED';
}

export interface PricingRule {
  id: string;
  name: string;
  routeId: string;
  startDate: string;
  endDate: string;
  priceMultiplier: number;
  availabilityBlocked: boolean;
}

export interface CabinPriceDefinition {
  type: string;
  price: number;
}

export interface FareClass {
  id: string;
  name: string;
  code: string;
  priceMultiplier: number;
  description: string;
  isRefundable: boolean;
  isChangeable: boolean;
  includesMeal: boolean;
}

export interface YieldBucket {
  id: string;
  routeId: string;
  occupancyMin: number;
  occupancyMax: number;
  priceMultiplier: number;
}

export interface TimeLimitRule {
  id: string;
  name: string;
  condition: string;
  durationHours: number;
  action: 'CANCEL' | 'NOTIFY';
}

export interface SystemConfig {
  key: string;
  label: string;
  group: string;
  value: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  discountPercent: number;
  validFrom: string;
  validUntil: string;
  active: boolean;
}

export interface SystemJob {
  id: string;
  name: string;
  status: 'IDLE' | 'RUNNING';
  lastRun: string;
  nextRun: string;
}

export interface ScheduleDefinition {
  id: string;
  routeId: string;
  daysOfWeek: number[];
  departureTime: string;
  arrivalTime: string;
  shipId: string;
}

export interface Surcharge {
  id: string;
  name: string;
  amount: number;
  type: 'FIXED' | 'PERCENT';
}

export interface RegulatoryDiscount {
  id: string;
  name: string;
  percentage: number;
  type: string;
}

export interface ShipConfig {
  id: string;
  code: string;
  name: string;
  paxCapacity: number;
  laneMeters: number;
  maxSpeed: number;
  buildYear: number;
}

export interface DeckDefinition {
  id: string;
  shipId: string;
  number: number;
  type: 'CARGO' | 'PAX' | 'MIXED';
  capacity: number; // Lane meters or Pax count
  details: string;
}

export interface Complaint {
  id: string;
  dateFiled: string;
  status: ComplaintStatus;
  clientId?: string;
  clientName?: string;
  email: string;
  phone?: string;
  category: ComplaintCategory;
  description: string;
  bookingId?: string;
  resolutionNote?: string;
  compensationAmount?: number;
  compensationType?: 'REFUND' | 'VOUCHER';
}

export interface PortGate {
  id: string;
  name: string;
  type: 'PAX' | 'CARGO';
  status: 'OPEN' | 'CLOSED';
}

export interface IntegrationTask {
  id: string;
  systemName: string;
  direction: 'IMPORT' | 'EXPORT';
  lastSync: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  message: string;
}

export interface SystemDocument {
  id: string;
  name: string;
  category: string;
  size: string;
  uploadDate: string;
  author: string;
}

export interface ExternalSalesChannel {
  id: string;
  name: string;
  status: 'ONLINE' | 'MAINTENANCE' | 'OFFLINE';
  bookingsToday: number;
  apiVersion: string;
  lastSync: string;
}

export interface PHICSTransaction {
  id: string;
  voyageId: string;
  submissionDate: string;
  paxCount: number;
  crewCount: number;
  status: 'SENT' | 'ACKNOWLEDGED' | 'ERROR';
  ackReference?: string;
}

export interface GateTelemetry {
  gateId: string;
  mode: 'AUTO' | 'MANUAL_OPEN' | 'MANUAL_CLOSE';
  status: 'OK' | 'ERROR';
  sensors: {type: string, value: string}[];
}

export interface GateEvent {
  id: string;
  gateId: string;
  timestamp: string;
  type: 'ENTRY' | 'EXIT' | 'ALARM';
  description: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface CrewMember {
  id: string;
  firstName: string;
  lastName: string;
  rank: CrewRank;
  documentNumber: string;
  status: 'ON_BOARD' | 'OFF_DUTY';
}

export interface CrewCertificate {
  id: string;
  crewId: string;
  name: string; // e.g., "STCW Basic Safety", "Medical", "Seaman Book"
  type: 'MEDICAL' | 'COMPETENCY' | 'TRAINING';
  issueDate: string;
  expiryDate: string;
  status: 'VALID' | 'WARNING' | 'EXPIRED';
}

export interface WorkRestLog {
  id: string;
  crewId: string;
  date: string;
  workStart: string; // HH:mm
  workEnd: string; // HH:mm
  restHours: number;
  violation: boolean;
}

export interface VisitorLogEntry {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  purpose: string;
  idCardNumber: string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'ON_BOARD' | 'CHECKED_OUT';
}

export interface ApiLogEntry {
  id: string;
  timestamp: string;
  channel: string;
  method: string;
  endpoint: string;
  status: number;
  latency: number;
  payloadSnippet: string;
}

export interface SailingSchedule {
  routeId: string;
  shipName: string;
  originalDeparture: string;
  actualDeparture: string;
  status: SailingStatus;
  paxCount: number;
  cargoMeterCount: number;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: 'SMS' | 'EMAIL' | 'PUSH';
  contentPattern: string;
}

export interface NotificationLog {
  id: string;
  date: string;
  templateName: string;
  contentPreview: string;
  channel: 'SMS' | 'EMAIL' | 'PUSH';
  status: 'SENT' | 'FAILED';
  recipientCount: number;
}

export interface CabinResource {
  id: string;
  shipId: string; // Linked to ShipConfig.id
  type: CabinType;
  deck: number;
  status: CabinStatus;
  pool: CabinPool;
}

export interface LaneResource {
  id: string;
  shipId: string; // Linked to ShipConfig.id
  name: string;
  deck: number;
  totalLength: number;
  occupiedLength: number;
}

export interface BankTransfer {
  id: string;
  date: string;
  senderName: string;
  title: string;
  amount: number;
  currency: 'PLN' | 'EUR' | 'SEK';
  status: 'NEW' | 'MATCHED' | 'MANUAL_REQUIRED';
  matchedBookingId?: string;
}

export interface CashierShift {
  id: string;
  cashierName: string;
  openedAt: string;
  closedAt?: string;
  status: 'OPEN' | 'CLOSED';
  expectedCash: {PLN: number, EUR: number, SEK: number};
  declaredCash?: {PLN: number, EUR: number, SEK: number};
  difference?: {PLN: number, EUR: number, SEK: number};
}

export interface VoyageReport {
  id: string;
  routeId: string;
  departureDate: string;
  status: 'OPEN' | 'CLOSED';
  bookedPax: number;
  checkedInPax: number;
  bookedCargo: number;
  checkedInCargo: number;
}

export interface AnalyticsTrend {
  // Fix: added index signature to satisfy Recharts ChartDataInput requirement
  [key: string]: any;
  date: string;
  value: number;
  previousValue?: number;
}

export interface SpendingAnalysis {
  // Fix: added index signature to satisfy Recharts ChartDataInput requirement
  [key: string]: any;
  amount: number;
  category?: string;
}

export interface RoutePerformance {
  routeId: string;
  averageLoadFactorPax: number;
  averageLoadFactorCargo: number;
  onTimePerformance: number;
}

export interface OrgUnit {
  id: string;
  name: string;
  type: 'HQ' | 'PORT' | 'SHIP';
}

export interface Workstation {
  id: string;
  name: string;
  orgUnitId: string;
  type: 'DESK' | 'GATE' | 'MOBILE';
  ipAddress: string;
  status: 'ONLINE' | 'OFFLINE' | 'WARNING';
  devices: PeripheralDevice[];
}

export interface PeripheralDevice {
  id: string;
  name: string;
  type: 'PRINTER_FISCAL' | 'PRINTER_TICKET' | 'SCANNER' | 'TERMINAL' | 'RFID_ENCODER';
  model: string;
  status: 'OK' | 'ERROR';
}

export interface Carnet {
  id: string;
  ownerId: string;
  type: '10_RIDES' | 'MONTHLY';
  totalRides: number;
  usedRides: number;
  issueDate: string;
  expiryDate: string;
  routeId: string;
  status: 'ACTIVE' | 'DEPLETED' | 'EXPIRED';
}

export interface UnusedTicket {
  bookingId: string;
  originalDate: string;
  routeId: string;
  passengerName: string;
  reason: 'NON_SHOW' | 'EXPIRED';
  amount: number;
}

export interface RefundReportItem {
  docId: string;
  originalDocId: string;
  date: string;
  reason: string;
  cashier: string;
  amount: number;
}

export interface DiscountReportItem {
  codeUsed: string;
  bookingId: string;
  date: string;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
}

export interface BoardedVehicleItem {
  regNumber: string;
  type: string;
  lane: string;
  driverName: string;
  checkInTime: string;
}

export interface SalesBreakdownItem {
  category: string;
  itemName: string;
  quantity: number;
  netTotal: number;
  vatTotal: number;
  grossTotal: number;
}

export interface InterlineSale {
  partnerName: string;
  route: string;
  issueDate: string;
  ticketNumber: string;
  amount: number;
  commission: number;
}

export interface ExploitationReportItem {
  date: string;
  voyageId: string;
  shipName: string;
  fuelConsumedHFO: number;
  fuelConsumedMGO: number;
  distanceSailed: number;
  avgSpeed: number;
  weather: string;
}

export interface BlacklistEntry {
  id: string;
  type: BlacklistType;
  value: string;
  reason: string;
  severity: BlacklistSeverity;
  dateAdded: string;
  active: boolean;
}

export interface AuditLogEntry {
  id: string;
  date: string;
  user: string;
  action: string;
  details: string;
}

export interface CalendarDayPrice {
  date: string;
  price: number;
  available: boolean;
}

export interface SalesReportData {}

export interface OnBoardTransaction {
  id: string;
  reservationId: string;
  date: string;
  location: 'RESTAURANT' | 'BAR' | 'SHOP' | 'SPA';
  item: string;
  amount: number;
  currency: string;
  status: 'PAID' | 'CHARGED_TO_ROOM';
}

export interface CollectorScan {
  id: string;
  barcode: string;
  timestamp: string;
  status: 'SYNCED' | 'PENDING';
  decision: 'BOARDED' | 'DENIED' | 'CHECK_DOCS';
  details: string;
  operator: string;
  reservation?: Reservation;
}

export interface VoyageCapacity {
  routeId: string;
  departureTime: string;
  shipName: string;
  paxTotal: number;
  paxBooked: number;
  cabinTotal: number;
  cabinBooked: number;
  laneMetersTotal: number;
  laneMetersBooked: number;
  priceLevel: 'LOW' | 'STANDARD' | 'HIGH' | 'SOLD_OUT';
  cabinBreakdown: {type: string, total: number, booked: number}[];
}

export interface AnalyticsEvent {
  eventName: string;
  properties: any;
}

export interface FreightNote {
  id: string;
  date: string;
  amount: number;
}

// --- Etap 46: Lost & Found Types ---

export interface LostItem {
  id: string;
  dateFound: string;
  locationFound: string; // e.g., "Cabin 5002", "Restaurant"
  category: LostItemCategory;
  description: string;
  foundBy: string; // Staff name
  status: LostItemStatus;
  storageLocation: string; // e.g., "Box A-12"
  ownerName?: string;
  claimDate?: string;
  imagePlaceholderColor?: string;
}

// --- New Analytics Types ---

export interface BookingPaceData {
  // Fix: added index signature to satisfy Recharts ChartDataInput requirement
  [key: string]: any;
  daysBeforeDeparture: number;
  currentYear: number;
  previousYear: number;
}

export interface FuelStat {
  // Fix: added index signature to satisfy Recharts ChartDataInput requirement
  [key: string]: any;
  speed: number;
  consumption: number;
  date: string;
}

export interface DemographicData {
  // Fix: added index signature to satisfy Recharts ChartDataInput requirement
  [key: string]: any;
  name: string;
  value: number;
  color: string;
}
