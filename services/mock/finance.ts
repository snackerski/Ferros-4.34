import { Product, ExchangeRate, SalesDocument, BankTransfer, CashierShift, VoyageReport, PricingRule, CabinPriceDefinition, FareClass, YieldBucket, Surcharge, CalendarDayPrice, CommissionNote } from '../../types';

export const MOCK_PRODUCTS: Product[] = [
  // --- BILETY I DOPŁATY (TICKETS) ---
  { id: 'T1', name: 'Bilet Normalny', category: 'TICKETS', pricePln: 250, taxRate: 0.08 },
  { id: 'T2', name: 'Bilet Ulgowy (Student/Senior)', category: 'TICKETS', pricePln: 150, taxRate: 0.08 },
  { id: 'T3', name: 'Przewóz Psa/Kota', category: 'TICKETS', pricePln: 50, taxRate: 0.08 },
  { id: 'T4', name: 'Przewóz Roweru', category: 'TICKETS', pricePln: 35, taxRate: 0.08 },
  { id: 'T5', name: 'Dopłata za nadbagaż', category: 'TICKETS', pricePln: 80, taxRate: 0.23 },

  // --- GASTRONOMIA (FOOD) ---
  { id: 'F1', name: 'Zestaw Obiad Dnia', category: 'FOOD', pricePln: 49, taxRate: 0.08 },
  { id: 'F2', name: 'Śniadanie Kontynentalne', category: 'FOOD', pricePln: 35, taxRate: 0.08 },
  { id: 'F3', name: 'Kawa Latte / Cappuccino', category: 'FOOD', pricePln: 16, taxRate: 0.23 },
  { id: 'F4', name: 'Piwo Lane 0.5L', category: 'FOOD', pricePln: 18, taxRate: 0.23 },
  { id: 'F5', name: 'Kanapka z łososiem', category: 'FOOD', pricePln: 22, taxRate: 0.08 },
  { id: 'F6', name: 'Woda Mineralna 0.5L', category: 'FOOD', pricePln: 8, taxRate: 0.23 },

  // --- SKLEP / DUTY FREE (SHOP) ---
  { id: 'S1', name: 'Perfumy Chanel No.5', category: 'SHOP', pricePln: 450, taxRate: 0.23 },
  { id: 'S2', name: 'Pamiątka: Magnes Prom', category: 'SHOP', pricePln: 15, taxRate: 0.23 },
  { id: 'S3', name: 'Czekolada Marabou 250g', category: 'SHOP', pricePln: 18, taxRate: 0.23 },
  { id: 'S4', name: 'Zestaw LEGO Technic', category: 'SHOP', pricePln: 299, taxRate: 0.23 },
  { id: 'S5', name: 'Wódka Wyborowa 0.5L', category: 'SHOP', pricePln: 45, taxRate: 0.23 },

  // --- USŁUGI (SERVICES) ---
  { id: 'SV1', name: 'Pakiet WiFi 24h', category: 'SERVICES', pricePln: 25, taxRate: 0.23 },
  { id: 'SV2', name: 'Business Lounge Entry', category: 'SERVICES', pricePln: 95, taxRate: 0.23 },
  { id: 'SV3', name: 'Masaż Relaksacyjny 30min', category: 'SERVICES', pricePln: 120, taxRate: 0.23 },
  { id: 'SV4', name: 'Priority Boarding', category: 'SERVICES', pricePln: 40, taxRate: 0.23 },
];

export const MOCK_EXCHANGE_RATES: ExchangeRate[] = [{ currency: 'EUR', rate: 4.65 }, { currency: 'SEK', rate: 0.41 }];

export const MOCK_SALES_HISTORY: SalesDocument[] = [
  { id: 'DOC-1001', type: 'RECEIPT', date: '2023-10-25 10:30', totalPln: 45.00 },
  { id: 'FV-2023/10/042', type: 'INVOICE', date: '2023-10-25 11:15', clientName: 'DHL Express Sp. z o.o.', totalPln: 2450.00 },
  { id: 'DOC-1003', type: 'RECEIPT', date: '2023-10-25 11:45', totalPln: 51.00 },
  { id: 'FV-2023/10/043', type: 'INVOICE', date: '2023-10-25 12:20', clientName: 'Janusz Biznesu - Usługi IT', totalPln: 380.00 },
  { id: 'DOC-1005', type: 'RECEIPT', date: '2023-10-25 13:05', totalPln: 450.00 },
  { id: 'DOC-1006', type: 'RECEIPT', date: '2023-10-25 14:40', totalPln: 250.00 },
];

export const MOCK_BANK_TRANSFERS: BankTransfer[] = [{ id: 'TRX-1001', date: '2023-10-25', senderName: 'LKW WALTER INT', title: 'INV-CGO-100 Payment', amount: 15400, currency: 'PLN', status: 'NEW' }];
export const MOCK_ACTIVE_SHIFT: CashierShift = { id: 'SH-1', cashierName: 'Krzysztof Jerzy', openedAt: '2023-10-25 07:00', status: 'OPEN', expectedCash: { PLN: 1540, EUR: 320, SEK: 1500 } };

export const MOCK_SHIFT_HISTORY: CashierShift[] = [
  {
    id: 'SH-2023-10-24-A',
    cashierName: 'Anna Kowalska',
    openedAt: '2023-10-24 07:00',
    closedAt: '2023-10-24 15:00',
    status: 'CLOSED',
    expectedCash: { PLN: 2450.50, EUR: 120.00, SEK: 800.00 },
    declaredCash: { PLN: 2450.50, EUR: 120.00, SEK: 800.00 },
    difference: { PLN: 0, EUR: 0, SEK: 0 }
  },
  {
    id: 'SH-2023-10-24-B',
    cashierName: 'Marek Nowak',
    openedAt: '2023-10-24 15:00',
    closedAt: '2023-10-24 23:00',
    status: 'CLOSED',
    expectedCash: { PLN: 3120.00, EUR: 45.00, SEK: 200.00 },
    declaredCash: { PLN: 3115.50, EUR: 47.00, SEK: 200.00 },
    difference: { PLN: -4.50, EUR: 2.00, SEK: 0 }
  }
];

export const MOCK_COMMISSION_NOTES: CommissionNote[] = [
  { id: 'NOTE-2023-09-01', agentId: 'A-001', period: '2023-09', totalSales: 112000, calculatedCommission: 7840, status: 'PAID' },
  { id: 'NOTE-2023-09-02', agentId: 'A-003', period: '2023-09', totalSales: 54000, calculatedCommission: 5400, status: 'APPROVED' },
  { id: 'NOTE-2023-09-03', agentId: 'A-004', period: '2023-09', totalSales: 198000, calculatedCommission: 15840, status: 'DRAFT' }
];

export const MOCK_VOYAGE_REPORTS: VoyageReport[] = [{ id: 'REP-1', routeId: 'R001', departureDate: '2023-10-25', status: 'OPEN', bookedPax: 918, checkedInPax: 750, bookedCargo: 86, checkedInCargo: 80 }];

export const MOCK_PRICING_RULES: PricingRule[] = [{ id: 'PR-1', name: 'Sezon Wysoki', routeId: 'ALL', startDate: '2024-06-15', endDate: '2024-09-15', priceMultiplier: 1.5, availabilityBlocked: false }];
export const MOCK_CABIN_PRICES: CabinPriceDefinition[] = [{ type: 'Wew. 2-os', price: 200 }, { type: 'Apartament LUX', price: 600 }];
export const MOCK_FARE_CLASSES: FareClass[] = [{ id: 'FC-1', name: 'Economy', code: 'ECO', priceMultiplier: 1.0, description: 'Bilet bezzwrotny', isRefundable: false, isChangeable: true, includesMeal: false }];
export const MOCK_YIELD_BUCKETS: YieldBucket[] = [{ id: 'YB-1', routeId: 'R001', occupancyMin: 0, occupancyMax: 50, priceMultiplier: 1.0 }];
export const MOCK_SURCHARGES: Surcharge[] = [{ id: 'SUR-1', name: 'Opłata Paliwowa', amount: 20, type: 'FIXED' }];

export const MOCK_CALENDAR_PRICES: CalendarDayPrice[] = [
  { date: '2023-10-25', price: 250, available: true },
  { date: '2023-10-26', price: 250, available: true },
  { date: '2023-10-27', price: 280, available: true }
];