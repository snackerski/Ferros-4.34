
import { Reservation, CargoBooking, BookingStatus, VehicleType, CabinType, CargoLoadType, GroupBooking } from '../../types';

export const MOCK_RESERVATIONS: Reservation[] = [
  // --- ISTNIEJĄCE REZERWACJE ---
  { id: 'RES-P001', bookingDate: '2025-05-22', status: BookingStatus.PAID, routeId: 'R001', passengers: [{ id: 'P501', firstName: 'Anders', lastName: 'Svensson', documentNumber: 'SE12345', nationality: 'SE' }], vehicleType: VehicleType.NONE, cabinType: CabinType.INSIDE_2, cabinNumber: '5010', totalPrice: 380, contactEmail: 'anders@mail.se' },
  { id: 'RES-P002', bookingDate: '2025-05-22', status: BookingStatus.PAID, routeId: 'R001', passengers: [{ id: 'P502', firstName: 'Mette', lastName: 'Larsen', documentNumber: 'DK99887', nationality: 'DK' }], vehicleType: VehicleType.NONE, cabinType: CabinType.NONE, totalPrice: 250, contactEmail: 'mette@kobenhavn.dk' },
  { id: 'RES-V001', bookingDate: '2025-05-22', status: BookingStatus.CONFIRMED, routeId: 'R001', passengers: [{ id: 'P601', firstName: 'Piotr', lastName: 'Zieliński', documentNumber: 'PL9900', nationality: 'PL' }], vehicleType: VehicleType.CAR, vehicleReg: 'ZSW 12345', cabinType: CabinType.NONE, totalPrice: 410, contactEmail: 'piotr@napoli.pl' },

  // --- REZERWACJE DLA STREFY KLIENTA (Maciej Fiszer) ---
  { 
    id: 'RES-EX-SAMPLE', bookingDate: '2025-08-15', status: BookingStatus.PAID, routeId: 'R101', 
    passengers: [{ id: 'P-SAMPLE', firstName: 'Maciej', lastName: 'Fiszer', documentNumber: 'AA112233', nationality: 'PL' }], 
    vehicleType: VehicleType.CAR, vehicleReg: 'PO 12345', cabinType: CabinType.LUX, cabinNumber: '8008', totalPrice: 1250, contactEmail: 'maciej.fiszer@example.com' 
  },
  { 
    id: 'RES-10293', bookingDate: '2025-04-10', status: BookingStatus.PAID, routeId: 'R001', 
    passengers: [{ id: 'P-CLI-1', firstName: 'Maciej', lastName: 'Fiszer', documentNumber: 'AA112233', nationality: 'PL' }], 
    vehicleType: VehicleType.CAR, vehicleReg: 'PO 12345', cabinType: CabinType.INSIDE_2, cabinNumber: '5002', totalPrice: 420, contactEmail: 'maciej.fiszer@example.com' 
  },
  { 
    id: 'RES-W001', bookingDate: '2025-06-15', status: BookingStatus.PAID, routeId: 'R001', 
    passengers: [{ id: 'P-CLI-1', firstName: 'Maciej', lastName: 'Fiszer', documentNumber: 'AA112233', nationality: 'PL' }], 
    vehicleType: VehicleType.CAR, vehicleReg: 'PO 12345', cabinType: CabinType.OUTSIDE_2, cabinNumber: '6001', totalPrice: 580, contactEmail: 'maciej.fiszer@example.com' 
  },
  { 
    id: 'RES-W002', bookingDate: '2025-07-02', status: BookingStatus.CONFIRMED, routeId: 'R101', 
    passengers: [{ id: 'P-CLI-1', firstName: 'Maciej', lastName: 'Fiszer', documentNumber: 'AA112233', nationality: 'PL' }], 
    vehicleType: VehicleType.NONE, cabinType: CabinType.LUX, cabinNumber: '8005', totalPrice: 850, contactEmail: 'maciej.fiszer@example.com' 
  },

  // --- 10 NOWYCH REZERWACJI (ETAP 4.3 / 4.9) ---
  { 
    id: 'RES-N001', bookingDate: '2025-05-23', status: BookingStatus.PAID, routeId: 'R101', 
    passengers: [{ id: 'PN1', firstName: 'Marek', lastName: 'Jankowski', documentNumber: 'PL112233', nationality: 'PL' }], 
    vehicleType: VehicleType.CAR, vehicleReg: 'GD 7788A', cabinType: CabinType.INSIDE_2, cabinNumber: '5005', totalPrice: 620, contactEmail: 'm.jankowski@wp.pl' 
  },
  { 
    id: 'RES-N002', bookingDate: '2025-05-24', status: BookingStatus.CONFIRMED, routeId: 'R001', 
    passengers: [{ id: 'PN2', firstName: 'Elena', lastName: 'Kovalska', documentNumber: 'UA998877', nationality: 'UA' }], 
    vehicleType: VehicleType.NONE, cabinType: CabinType.OUTSIDE_2, cabinNumber: '6015', totalPrice: 450, contactEmail: 'elena.k@gmail.com' 
  },
  { 
    id: 'RES-N003', bookingDate: '2025-05-25', status: BookingStatus.WAITING_LIST, routeId: 'R003', 
    passengers: [{ id: 'PN3', firstName: 'Tomas', lastName: 'Larsson', documentNumber: 'SE776655', nationality: 'SE' }], 
    vehicleType: VehicleType.MOTORCYCLE, vehicleReg: 'STOK 1', cabinType: CabinType.NONE, totalPrice: 310, contactEmail: 't.larsson@outlook.se' 
  },
  { 
    id: 'RES-N004', bookingDate: '2025-05-26', status: BookingStatus.PAID, routeId: 'R201', 
    passengers: [{ id: 'PN4', firstName: 'Sarah', lastName: 'Jenkins', documentNumber: 'UK445566', nationality: 'UK' }], 
    vehicleType: VehicleType.NONE, cabinType: CabinType.INSIDE_4, totalPrice: 380, contactEmail: 'sarah.j@travel.co.uk' 
  },
  { 
    id: 'RES-N005', bookingDate: '2025-05-27', status: BookingStatus.CONFIRMED, routeId: 'R101', 
    passengers: [{ id: 'PN5', firstName: 'Olaf', lastName: 'Berg', documentNumber: 'NO112233', nationality: 'NO' }], 
    vehicleType: VehicleType.CAR, vehicleReg: 'OSLO 99', cabinType: CabinType.LUX, cabinNumber: '8001', totalPrice: 1150, contactEmail: 'o.berg@fjord.no' 
  },
  { 
    id: 'RES-N006', bookingDate: '2025-05-28', status: BookingStatus.PAID, routeId: 'R001', 
    passengers: [{ id: 'PN6', firstName: 'Karolina', lastName: 'Nowak', documentNumber: 'PL009988', nationality: 'PL' }], 
    vehicleType: VehicleType.NONE, cabinType: CabinType.NONE, totalPrice: 220, contactEmail: 'k.nowak@poczta.pl' 
  },
  { 
    id: 'RES-N007', bookingDate: '2025-05-29', status: BookingStatus.CONFIRMED, routeId: 'R202', 
    passengers: [{ id: 'PN7', firstName: 'Dmitry', lastName: 'Volkov', documentNumber: 'EST5544', nationality: 'EST' }], 
    vehicleType: VehicleType.TRUCK, vehicleReg: 'TALL 123', cabinType: CabinType.INSIDE_2, cabinNumber: '4012', totalPrice: 1850, contactEmail: 'd.volkov@logistics.ee' 
  },
  { 
    id: 'RES-N008', bookingDate: '2025-05-30', status: BookingStatus.WAITING_LIST, routeId: 'R002', 
    passengers: [{ id: 'PN8', firstName: 'Ingrid', lastName: 'Schmidt', documentNumber: 'DE334455', nationality: 'DE' }], 
    vehicleType: VehicleType.NONE, cabinType: CabinType.OUTSIDE_4, totalPrice: 520, contactEmail: 'i.schmidt@berlin.de' 
  },
  { 
    id: 'RES-N009', bookingDate: '2025-05-31', status: BookingStatus.PAID, routeId: 'R102', 
    passengers: [{ id: 'PN9', firstName: 'Piotr', lastName: 'Wiśniewski', documentNumber: 'PL776655', nationality: 'PL' }], 
    vehicleType: VehicleType.CAR, vehicleReg: 'ZS 99881', cabinType: CabinType.INSIDE_2, cabinNumber: '5022', totalPrice: 590, contactEmail: 'p.wisniewski@onet.pl' 
  },
  { 
    id: 'RES-N010', bookingDate: '2025-06-01', status: BookingStatus.CONFIRMED, routeId: 'R001', 
    passengers: [{ id: 'PN10', firstName: 'Hanna', lastName: 'Lindholm', documentNumber: 'FI443322', nationality: 'FI' }], 
    vehicleType: VehicleType.MOTORCYCLE, vehicleReg: 'HELS 01', cabinType: CabinType.NONE, totalPrice: 280, contactEmail: 'h.lindholm@mail.fi' 
  },
];

export const MOCK_CARGO_BOOKINGS: CargoBooking[] = [
  // --- DZISIAJ (Zakładając maj 2025) ---
  { 
    id: 'CGO-1001', 
    bookingDate: '2025-05-22', 
    status: BookingStatus.CONFIRMED, 
    routeId: 'R001', 
    totalPrice: 2200, 
    isCargo: true, 
    contactEmail: 'dispo@walter.com', 
    forwarderId: 'FWD-1', 
    vehicleType: VehicleType.TRUCK, 
    vehicleReg: 'WA 12345', 
    cabinType: CabinType.INSIDE_2, 
    passengers: [{ id: 'P-DRV-1', firstName: 'Adam', lastName: 'Nowak', documentNumber: 'AAB123456', isDriver: true }], 
    cargoDetails: { length: 16.5, weight: 24, loadType: CargoLoadType.STANDARD, forwarderRef: 'REF-W-001' } 
  },
  { 
    id: 'CGO-1002', 
    bookingDate: '2025-05-22', 
    status: BookingStatus.PAID, 
    routeId: 'R101', 
    totalPrice: 4800, 
    isCargo: true, 
    contactEmail: 'dispo@walter.com', 
    forwarderId: 'FWD-1', 
    vehicleType: VehicleType.TRUCK, 
    vehicleReg: 'WA 55443', 
    cabinType: CabinType.INSIDE_2, 
    passengers: [{ id: 'P-DRV-2', firstName: 'Robert', lastName: 'Mazur', documentNumber: 'CCA998877', isDriver: true }], 
    cargoDetails: { length: 18.5, weight: 26, loadType: CargoLoadType.ADR, goodsDescription: 'Materiały łatwopalne', forwarderRef: 'REF-W-002' } 
  },
  
  // --- KOLEJNE DNI ---
  { 
    id: 'CGO-1010', 
    bookingDate: '2025-05-23', 
    status: BookingStatus.CONFIRMED, 
    routeId: 'R001', 
    totalPrice: 2200, 
    isCargo: true, 
    contactEmail: 'dispo@walter.com', 
    forwarderId: 'FWD-1', 
    vehicleType: VehicleType.TRUCK, 
    vehicleReg: 'WA 77661', 
    cabinType: CabinType.INSIDE_2, 
    passengers: [], 
    cargoDetails: { length: 16.5, weight: 24, loadType: CargoLoadType.STANDARD, forwarderRef: 'REF-W-400' } 
  },
  { 
    id: 'CGO-1020', 
    bookingDate: '2025-05-25', 
    status: BookingStatus.CONFIRMED, 
    routeId: 'R201', 
    totalPrice: 2400, 
    isCargo: true, 
    contactEmail: 'dispo@walter.com', 
    forwarderId: 'FWD-1', 
    vehicleType: VehicleType.TRUCK, 
    vehicleReg: 'WB 99112', 
    cabinType: CabinType.INSIDE_2, 
    passengers: [], 
    cargoDetails: { length: 18.0, weight: 22, loadType: CargoLoadType.STANDARD, forwarderRef: 'REF-W-500' } 
  },
  { 
    id: 'CGO-1021', 
    bookingDate: '2025-05-25', 
    status: BookingStatus.WAITING_LIST, 
    routeId: 'R202', 
    totalPrice: 2400, 
    isCargo: true, 
    contactEmail: 'dispo@walter.com', 
    forwarderId: 'FWD-1', 
    vehicleType: VehicleType.TRAILER, 
    vehicleReg: 'WA 00991', 
    cabinType: CabinType.NONE, 
    passengers: [], 
    cargoDetails: { length: 13.6, weight: 18, loadType: CargoLoadType.STANDARD, forwarderRef: 'REF-W-501' } 
  },

  // --- PRZESZŁOŚĆ ---
  { 
    id: 'CGO-0900', 
    bookingDate: '2025-05-10', 
    status: BookingStatus.CHECKED_IN, 
    routeId: 'R001', 
    totalPrice: 2150, 
    isCargo: true, 
    contactEmail: 'dispo@walter.com', 
    forwarderId: 'FWD-1', 
    vehicleType: VehicleType.TRUCK, 
    vehicleReg: 'WA 11223', 
    cabinType: CabinType.INSIDE_2, 
    passengers: [], 
    cargoDetails: { length: 16.5, weight: 22, loadType: CargoLoadType.STANDARD, forwarderRef: 'REF-W-900' } 
  },
];

export const MOCK_GROUPS: GroupBooking[] = [
  { id: 'GRP-1', name: 'Wycieczka SP 5', routeId: 'R001', departureDate: '2025-05-22', paxCount: 45, status: 'CONFIRMED', totalPrice: 12500, cabinAllocation: [], passengers: [], payments: [], leaderName: 'Anna N.', leaderPhone: '500' },
];
