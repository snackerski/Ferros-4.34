
import { Forwarder, Allotment, BillOfLading, CargoInvoice, CargoDriver, CargoVehicle, VehicleType, CargoContract, CargoProgressiveDiscount, EDIMessage, StandardCargoPrice } from '../../types';

export const MOCK_FORWARDERS: Forwarder[] = [
  { id: 'FWD-1', name: 'LKW WALTER', contractNumber: 'CTR-2023-01', paymentType: 'INVOICE', currentBalance: 32450, creditLimit: 150000 },
  { id: 'FWD-2', name: 'DSV Road', contractNumber: 'CTR-2023-02', paymentType: 'INVOICE', currentBalance: 85000, creditLimit: 200000 },
  { id: 'FWD-3', name: 'ADAMPOL S.A.', contractNumber: 'CTR-2023-05', paymentType: 'PREPAID', currentBalance: -1200, creditLimit: 50000 }
];

export const MOCK_ALLOTMENTS: Allotment[] = [
  { id: 'AL-1', forwarderId: 'FWD-1', totalSpace: 500, usedSpace: 450 },
  { id: 'AL-2', forwarderId: 'FWD-2', totalSpace: 300, usedSpace: 120 }
];

export const MOCK_BILLS_OF_LADING: BillOfLading[] = [
  { id: 'BOL-2023-881', routeId: 'R001', senderName: 'Bosch GmbH', receiverName: 'Castorama Polska', items: [], totalWeight: 12500, totalVolume: 45, status: 'ISSUED', dateIssued: '2023-10-24', freightCost: 2400 },
  { id: 'BOL-2023-882', routeId: 'R101', senderName: 'IKEA SE', receiverName: 'IKEA PL', items: [], totalWeight: 8400, totalVolume: 60, status: 'ISSUED', dateIssued: '2023-10-25', freightCost: 3100 }
];

export const MOCK_CARGO_INVOICES: CargoInvoice[] = [
  // Faktury dla LKW WALTER (FWD-1)
  { id: 'INV/2023/10/01', forwarderId: 'FWD-1', periodStart: '2023-09-01', periodEnd: '2023-09-15', dueDate: '2023-09-30', totalAmount: 15400.00, currency: 'PLN', status: 'PAID' },
  { id: 'INV/2023/10/45', forwarderId: 'FWD-1', periodStart: '2023-09-16', periodEnd: '2023-09-30', dueDate: '2023-10-15', totalAmount: 12850.50, currency: 'PLN', status: 'PAID' },
  { id: 'INV/2023/11/12', forwarderId: 'FWD-1', periodStart: '2023-10-01', periodEnd: '2023-10-15', dueDate: '2023-10-30', totalAmount: 18200.00, currency: 'PLN', status: 'ISSUED' },
  { id: 'INV/2023/11/99', forwarderId: 'FWD-1', periodStart: '2023-10-16', periodEnd: '2023-10-31', dueDate: '2023-11-15', totalAmount: 22400.00, currency: 'PLN', status: 'ISSUED' },
  { id: 'INV/OVERDUE/01', forwarderId: 'FWD-1', periodStart: '2023-08-01', periodEnd: '2023-08-31', dueDate: '2023-09-10', totalAmount: 4500.00, currency: 'PLN', status: 'OVERDUE' },
  
  // Faktury dla DSV (FWD-2)
  { id: 'INV/DSV/2023/01', forwarderId: 'FWD-2', periodStart: '2023-10-01', periodEnd: '2023-10-31', dueDate: '2023-11-20', totalAmount: 45600.00, currency: 'PLN', status: 'ISSUED' }
];

export const MOCK_CARGO_DRIVERS: CargoDriver[] = [
  { id: 'DRV-1', firstName: 'Adam', lastName: 'Nowak', documentNumber: 'AAB 123456', phoneNumber: '+48 600 111 222', forwarderId: 'FWD-1' },
  { id: 'DRV-2', firstName: 'Robert', lastName: 'Mazur', documentNumber: 'CCA 998877', phoneNumber: '+48 505 444 333', forwarderId: 'FWD-1' },
  { id: 'DRV-3', firstName: 'Tomasz', lastName: 'Kot', documentNumber: 'PL 44556677', phoneNumber: '+48 700 888 999', forwarderId: 'FWD-1' },
  { id: 'DRV-4', firstName: 'Marek', lastName: 'Lewandowski', documentNumber: 'E-PASP-001', phoneNumber: '+48 660 330 220', forwarderId: 'FWD-1' },
  { id: 'DRV-5', firstName: 'Sven', lastName: 'Larsson', documentNumber: 'SE 990011', phoneNumber: '+46 70 123 45 67', forwarderId: 'FWD-2' }
];

export const MOCK_CARGO_VEHICLES: CargoVehicle[] = [
  { id: 'VEH-1', name: 'Scania R450 Next Gen', registrationNumber: 'WA 12345', type: VehicleType.TRUCK, length: 16.5, weight: 24, forwarderId: 'FWD-1' },
  { id: 'VEH-2', name: 'Volvo FH16 Globetrotter', registrationNumber: 'WA 55443', type: VehicleType.TRUCK, length: 18.5, weight: 26, forwarderId: 'FWD-1' },
  { id: 'VEH-3', name: 'Krone Cool Liner', registrationNumber: 'WA 99881', type: VehicleType.TRAILER, length: 13.6, weight: 18, forwarderId: 'FWD-1' },
  { id: 'VEH-4', name: 'MAN TGX 18.500', registrationNumber: 'WB 11223', type: VehicleType.TRUCK, length: 16.5, weight: 22, forwarderId: 'FWD-1' },
  { id: 'VEH-5', name: 'Mercedes-Benz Actros', registrationNumber: 'DW 8877G', type: VehicleType.TRUCK, length: 17.0, weight: 25, forwarderId: 'FWD-2' }
];

export const MOCK_CARGO_CONTRACTS: CargoContract[] = [
  { id: 'CTR-1', forwarderId: 'FWD-1', ratePerMeter: 105, discountPercent: 8 },
  { id: 'CTR-2', forwarderId: 'FWD-2', ratePerMeter: 115, discountPercent: 5 }
];

export const MOCK_CARGO_PROGRESSIVE_DISCOUNTS: CargoProgressiveDiscount[] = [
  { id: 'PROG-1', forwarderId: 'FWD-1', period: '2023', thresholdMeters: 5000, discountPercent: 2 },
  { id: 'PROG-2', forwarderId: 'FWD-1', period: '2023', thresholdMeters: 10000, discountPercent: 5 }
];

export const MOCK_EDI_MESSAGES: EDIMessage[] = [
  { id: 'EDI-1', receivedAt: '2023-10-25 08:30:00', sender: 'LKW WALTER', type: 'NEW_BOOKING', content: {refNumber: 'W-998877', vehicleReg: 'WA 12345', routeId: 'R001', length: 16.5, weight: 24, driverName: 'Adam Nowak'}, status: 'PROCESSED' },
  { id: 'EDI-2', receivedAt: '2023-10-25 11:15:00', sender: 'LKW WALTER', type: 'NEW_BOOKING', content: {refNumber: 'W-998880', vehicleReg: 'WA 55443', routeId: 'R001', length: 18.5, weight: 26, driverName: 'Robert Mazur'}, status: 'PENDING' }
];

export const MOCK_STANDARD_CARGO_PRICES: StandardCargoPrice[] = [
  { id: 'SCP-1', routeId: 'R001', lengthCategory: 'Standard < 17m', pricePerMeter: 125, driverIncluded: true },
  { id: 'SCP-2', routeId: 'R001', lengthCategory: 'Gabaryt > 17m', pricePerMeter: 155, driverIncluded: true },
  { id: 'SCP-3', routeId: 'R101', lengthCategory: 'Standard < 17m', pricePerMeter: 140, driverIncluded: true }
];
