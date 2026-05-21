import { AnalyticsTrend, SpendingAnalysis, RoutePerformance, BookingPaceData, FuelStat, DemographicData } from '../../types';

export const MOCK_CHART_DATA = [
  { name: 'Pn', passengers: 400, cargo: 24, revenue: 15000, prevRevenue: 14000 },
  { name: 'Wt', passengers: 300, cargo: 18, revenue: 12000, prevRevenue: 13000 },
  { name: 'Śr', passengers: 550, cargo: 32, revenue: 18000, prevRevenue: 16500 },
  { name: 'Cz', passengers: 480, cargo: 28, revenue: 16000, prevRevenue: 15000 },
  { name: 'Pt', passengers: 700, cargo: 45, revenue: 25000, prevRevenue: 22000 },
  { name: 'Sb', passengers: 850, cargo: 12, revenue: 29000, prevRevenue: 27000 },
  { name: 'Nd', passengers: 600, cargo: 15, revenue: 21000, prevRevenue: 19000 }
];

export const MOCK_REVENUE_TRENDS: AnalyticsTrend[] = [
  { date: '2023-10-19', value: 42000, previousValue: 38000 },
  { date: '2023-10-20', value: 48000, previousValue: 41000 },
  { date: '2023-10-21', value: 55000, previousValue: 49000 },
  { date: '2023-10-22', value: 39000, previousValue: 40000 },
  { date: '2023-10-23', value: 45000, previousValue: 42000 },
  { date: '2023-10-24', value: 51000, previousValue: 44000 },
  { date: '2023-10-25', value: 52000, previousValue: 43000 }
];

export const MOCK_SPENDING_ANALYSIS: SpendingAnalysis[] = [
  { category: 'Bilety', amount: 45000 },
  { category: 'Gastronomia', amount: 18500 },
  { category: 'Sklep (Duty Free)', amount: 12000 },
  { category: 'Usługi (WiFi/SPA)', amount: 4500 },
  { category: 'Pojazdy / Cargo', amount: 32000 }
];

export const MOCK_ROUTE_PERFORMANCE: RoutePerformance[] = [
  { routeId: 'Świnoujście - Ystad', averageLoadFactorPax: 85, averageLoadFactorCargo: 92, onTimePerformance: 98 },
  { routeId: 'Gdańsk - Nynäshamn', averageLoadFactorPax: 78, averageLoadFactorCargo: 88, onTimePerformance: 94 },
  { routeId: 'Świnoujście - Trelleborg', averageLoadFactorPax: 62, averageLoadFactorCargo: 95, onTimePerformance: 99 }
];

export const MOCK_BOOKING_PACE: BookingPaceData[] = [
  { daysBeforeDeparture: 60, currentYear: 5, previousYear: 4 },
  { daysBeforeDeparture: 45, currentYear: 12, previousYear: 10 },
  { daysBeforeDeparture: 30, currentYear: 25, previousYear: 20 },
  { daysBeforeDeparture: 21, currentYear: 38, previousYear: 32 },
  { daysBeforeDeparture: 14, currentYear: 55, previousYear: 48 },
  { daysBeforeDeparture: 7, currentYear: 75, previousYear: 70 },
  { daysBeforeDeparture: 3, currentYear: 88, previousYear: 85 },
  { daysBeforeDeparture: 1, currentYear: 96, previousYear: 94 },
  { daysBeforeDeparture: 0, currentYear: 100, previousYear: 98 }
];

export const MOCK_FUEL_STATS: FuelStat[] = [
  { date: 'Pn', speed: 18.5, consumption: 40 },
  { date: 'Wt', speed: 19.2, consumption: 42 },
  { date: 'Śr', speed: 17.8, consumption: 38 },
  { date: 'Cz', speed: 18.0, consumption: 39 },
  { date: 'Pt', speed: 20.5, consumption: 48 },
  { date: 'Sb', speed: 21.0, consumption: 51 },
  { date: 'Nd', speed: 19.5, consumption: 43 }
];

export const MOCK_DEMOGRAPHICS: DemographicData[] = [
  { name: 'Polska', value: 65, color: '#3b82f6' },
  { name: 'Szwecja', value: 25, color: '#10b981' },
  { name: 'Niemcy', value: 7, color: '#f59e0b' },
  { name: 'Inne', value: 3, color: '#94a3b8' }
];

export const MOCK_LOYALTY_STATS = [
  { name: 'Standard', value: 1200, color: '#cbd5e1' },
  { name: 'Silver', value: 650, color: '#94a3b8' },
  { name: 'Gold', value: 320, color: '#fbbf24' },
  { name: 'Platinum', value: 110, color: '#1e293b' }
];
