import { Route, ShipConfig, SailingSchedule, SailingStatus, DeckDefinition, CabinResource, LaneResource, VoyageCapacity, CabinType, CabinStatus, CabinPool } from '../../types';

export const MOCK_SHIPS: ShipConfig[] = [
  // UNITY LINE
  { id: 'SHIP-POL', code: 'POL', name: 'm/f Polonia', paxCapacity: 918, laneMeters: 2200, maxSpeed: 20, buildYear: 1995 },
  { id: 'SHIP-SKA', code: 'SKA', name: 'm/f Skania', paxCapacity: 1397, laneMeters: 1740, maxSpeed: 27, buildYear: 1995 },
  { id: 'SHIP-EPS', code: 'EPS', name: 'm/f Epsilon', paxCapacity: 260, laneMeters: 2860, maxSpeed: 25, buildYear: 2011 },
  { id: 'SHIP-WOL', code: 'WOL', name: 'm/f Wolin', paxCapacity: 370, laneMeters: 1755, maxSpeed: 18, buildYear: 1986 },
  { id: 'SHIP-GRY', code: 'GRY', name: 'm/f Gryf', paxCapacity: 180, laneMeters: 1800, maxSpeed: 16, buildYear: 1991 },
  { id: 'SHIP-GAL', code: 'GAL', name: 'm/f Galileo', paxCapacity: 125, laneMeters: 1742, maxSpeed: 19, buildYear: 1992 },
  { id: 'SHIP-COP', code: 'COP', name: 'm/f Copernicus', paxCapacity: 126, laneMeters: 1830, maxSpeed: 18, buildYear: 1995 },
  
  // POLFERRIES
  { id: 'SHIP-VAR', code: 'VAR', name: 'm/v Varsovia', paxCapacity: 920, laneMeters: 2940, maxSpeed: 24, buildYear: 2024 },
  { id: 'SHIP-NOV', code: 'NOV', name: 'm/v Nova Star', paxCapacity: 1215, laneMeters: 1575, maxSpeed: 21, buildYear: 2011 },
  { id: 'SHIP-MAZ', code: 'MAZ', name: 'm/v Mazovia', paxCapacity: 1000, laneMeters: 2620, maxSpeed: 20, buildYear: 1996 },
  { id: 'SHIP-WAW', code: 'WAW', name: 'm/v Wawel', paxCapacity: 1000, laneMeters: 1490, maxSpeed: 19, buildYear: 1980 },
  { id: 'SHIP-CRA', code: 'CRA', name: 'm/v Cracovia', paxCapacity: 650, laneMeters: 2196, maxSpeed: 18, buildYear: 2002 },
];

export const MOCK_ROUTES: Route[] = [
  // LINIOWE PASAŻERSKIE & CARGO
  { id: 'R001', origin: 'Świnoujście', destination: 'Ystad', basePrice: 250, shipName: 'm/f Polonia', departureTime: '2023-10-25T13:00:00' },
  { id: 'R002', origin: 'Ystad', destination: 'Świnoujście', basePrice: 250, shipName: 'm/f Polonia', departureTime: '2023-10-25T22:30:00' },
  { id: 'R003', origin: 'Świnoujście', destination: 'Ystad', basePrice: 230, shipName: 'm/f Skania', departureTime: '2023-10-25T23:00:00' },
  { id: 'R004', origin: 'Ystad', destination: 'Świnoujście', basePrice: 230, shipName: 'm/f Skania', departureTime: '2023-10-25T11:00:00' },
  
  // POLFERRIES GDAŃSK
  { id: 'R101', origin: 'Gdańsk', destination: 'Nynäshamn', basePrice: 420, shipName: 'm/v Nova Star', departureTime: '2023-10-25T18:00:00' },
  { id: 'R102', origin: 'Gdańsk', destination: 'Nynäshamn', basePrice: 400, shipName: 'm/v Wawel', departureTime: '2023-10-25T11:00:00' },
  
  // NOWE TRASY DLA MAZOVIA I VARSOVIA
  { id: 'R103', origin: 'Świnoujście', destination: 'Ystad', basePrice: 260, shipName: 'm/v Mazovia', departureTime: '2023-10-25T09:00:00' },
  { id: 'R104', origin: 'Świnoujście', destination: 'Ystad', basePrice: 280, shipName: 'm/v Varsovia', departureTime: '2023-10-25T15:30:00' },
  
  // TRASY CARGO ŚWINOUJŚCIE - TRELLEBORG
  { id: 'R201', origin: 'Świnoujście', destination: 'Trelleborg', basePrice: 180, shipName: 'm/f Epsilon', departureTime: '2023-10-25T08:00:00' },
  { id: 'R202', origin: 'Świnoujście', destination: 'Trelleborg', basePrice: 190, shipName: 'm/f Wolin', departureTime: '2023-10-25T20:00:00' },
  { id: 'R203', origin: 'Świnoujście', destination: 'Trelleborg', basePrice: 170, shipName: 'm/f Gryf', departureTime: '2023-10-25T02:00:00' },
  { id: 'R204', origin: 'Świnoujście', destination: 'Trelleborg', basePrice: 175, shipName: 'm/f Galileo', departureTime: '2023-10-25T10:30:00' },
];

export const MOCK_SAILING_SCHEDULES: SailingSchedule[] = [
  // UNITY LINE - MONITOROWANE ODEJŚCIA 2023-10-25
  { routeId: 'R203', shipName: 'm/f Gryf', originalDeparture: '2023-10-25T02:00:00', actualDeparture: '2023-10-25T02:00:00', status: SailingStatus.SCHEDULED, paxCount: 120, cargoMeterCount: 1600 },
  { routeId: 'R201', shipName: 'm/f Epsilon', originalDeparture: '2023-10-25T08:00:00', actualDeparture: '2023-10-25T08:00:00', status: SailingStatus.SCHEDULED, paxCount: 210, cargoMeterCount: 2400 },
  { routeId: 'R103', shipName: 'm/v Mazovia', originalDeparture: '2023-10-25T09:00:00', actualDeparture: '2023-10-25T09:15:00', status: SailingStatus.DELAYED, paxCount: 850, cargoMeterCount: 2200 },
  { routeId: 'R204', shipName: 'm/f Galileo', originalDeparture: '2023-10-25T10:30:00', actualDeparture: '2023-10-25T10:30:00', status: SailingStatus.SCHEDULED, paxCount: 110, cargoMeterCount: 1700 },
  { routeId: 'R102', shipName: 'm/v Wawel', originalDeparture: '2023-10-25T11:00:00', actualDeparture: '2023-10-25T11:00:00', status: SailingStatus.SCHEDULED, paxCount: 600, cargoMeterCount: 1400 },
  { routeId: 'R004', shipName: 'm/f Skania', originalDeparture: '2023-10-25T11:00:00', actualDeparture: '2023-10-25T11:00:00', status: SailingStatus.SCHEDULED, paxCount: 1200, cargoMeterCount: 1500 },
  { routeId: 'R001', shipName: 'm/f Polonia', originalDeparture: '2023-10-25T13:00:00', actualDeparture: '2023-10-25T13:45:00', status: SailingStatus.DELAYED, paxCount: 750, cargoMeterCount: 1800 },
  { routeId: 'R104', shipName: 'm/v Varsovia', originalDeparture: '2023-10-25T15:30:00', actualDeparture: '2023-10-25T15:30:00', status: SailingStatus.SCHEDULED, paxCount: 450, cargoMeterCount: 2000 },
  { routeId: 'R101', shipName: 'm/v Nova Star', originalDeparture: '2023-10-25T18:00:00', actualDeparture: '2023-10-25T18:00:00', status: SailingStatus.SCHEDULED, paxCount: 900, cargoMeterCount: 1200 },
  { routeId: 'R202', shipName: 'm/f Wolin', originalDeparture: '2023-10-25T20:00:00', actualDeparture: '2023-10-25T20:00:00', status: SailingStatus.SCHEDULED, paxCount: 300, cargoMeterCount: 1700 },
  { routeId: 'R002', shipName: 'm/f Polonia', originalDeparture: '2023-10-25T22:30:00', actualDeparture: '2023-10-25T22:30:00', status: SailingStatus.SCHEDULED, paxCount: 400, cargoMeterCount: 1000 },
  { routeId: 'R003', shipName: 'm/f Skania', originalDeparture: '2023-10-25T23:00:00', actualDeparture: '2023-10-25T23:00:00', status: SailingStatus.SCHEDULED, paxCount: 1390, cargoMeterCount: 1740 },
];

export const MOCK_DECK_DEFINITIONS: DeckDefinition[] = [
  // POLONIA STRUCTURE
  { id: 'D-POL-3', shipId: 'SHIP-POL', number: 3, type: 'CARGO', capacity: 1100, details: 'Main Cargo Deck' },
  { id: 'D-POL-4', shipId: 'SHIP-POL', number: 4, type: 'CARGO', capacity: 900, details: 'Upper Cargo Deck' },
  { id: 'D-POL-5', shipId: 'SHIP-POL', number: 5, type: 'PAX', capacity: 25, details: 'Passenger Deck 5' },
  { id: 'D-POL-6', shipId: 'SHIP-POL', number: 6, type: 'PAX', capacity: 25, details: 'Passenger Deck 6' },
  
  // NOVA STAR
  { id: 'D-NOV-3', shipId: 'SHIP-NOV', number: 3, type: 'CARGO', capacity: 1575, details: 'Cargo Deck' },
];

// Generating 50 Cabins for m/f Polonia
const generatePoloniaCabins = (): CabinResource[] => {
  const cabins: CabinResource[] = [];
  
  // Deck 5 - 25 cabins
  for (let i = 1; i <= 25; i++) {
    const id = `50${i.toString().padStart(2, '0')}`;
    let type = CabinType.INSIDE_2;
    if (i > 15) type = CabinType.OUTSIDE_2;
    if (i > 22) type = CabinType.LUX;

    cabins.push({
      id,
      shipId: 'SHIP-POL',
      type,
      deck: 5,
      status: i % 7 === 0 ? CabinStatus.DIRTY : (i % 5 === 0 ? CabinStatus.OCCUPIED : CabinStatus.FREE),
      pool: i <= 5 ? CabinPool.DRIVER : CabinPool.PASSENGER
    });
  }

  // Deck 6 - 25 cabins
  for (let i = 1; i <= 25; i++) {
    const id = `60${i.toString().padStart(2, '0')}`;
    let type = CabinType.INSIDE_4;
    if (i > 10) type = CabinType.OUTSIDE_4;
    if (i > 20) type = CabinType.LUX;

    cabins.push({
      id,
      shipId: 'SHIP-POL',
      type,
      deck: 6,
      status: i % 8 === 0 ? CabinStatus.OUT_OF_ORDER : (i % 6 === 0 ? CabinStatus.OCCUPIED : CabinStatus.FREE),
      pool: i <= 3 ? CabinPool.DRIVER : CabinPool.PASSENGER
    });
  }

  return cabins;
};

export const MOCK_CABIN_RESOURCES: CabinResource[] = [
  ...generatePoloniaCabins(),
  { id: '8001', shipId: 'SHIP-NOV', type: CabinType.LUX, deck: 8, status: CabinStatus.FREE, pool: CabinPool.PASSENGER },
];

export const MOCK_LANE_RESOURCES: LaneResource[] = [
  // POLONIA - DECK 3 (5 Lanes)
  { id: 'POL-L3-1', shipId: 'SHIP-POL', name: 'Pas 3.1', deck: 3, totalLength: 220, occupiedLength: 180 },
  { id: 'POL-L3-2', shipId: 'SHIP-POL', name: 'Pas 3.2', deck: 3, totalLength: 220, occupiedLength: 150 },
  { id: 'POL-L3-3', shipId: 'SHIP-POL', name: 'Pas 3.3', deck: 3, totalLength: 220, occupiedLength: 210 },
  { id: 'POL-L3-4', shipId: 'SHIP-POL', name: 'Pas 3.4', deck: 3, totalLength: 220, occupiedLength: 45 },
  { id: 'POL-L3-5', shipId: 'SHIP-POL', name: 'Pas 3.5', deck: 3, totalLength: 220, occupiedLength: 0 },

  // POLONIA - DECK 4 (5 Lanes)
  { id: 'POL-L4-1', shipId: 'SHIP-POL', name: 'Pas 4.1', deck: 4, totalLength: 180, occupiedLength: 170 },
  { id: 'POL-L4-2', shipId: 'SHIP-POL', name: 'Pas 4.2', deck: 4, totalLength: 180, occupiedLength: 120 },
  { id: 'POL-L4-3', shipId: 'SHIP-POL', name: 'Pas 4.3', deck: 4, totalLength: 180, occupiedLength: 0 },
  { id: 'POL-L4-4', shipId: 'SHIP-POL', name: 'Pas 4.4', deck: 4, totalLength: 180, occupiedLength: 180 },
  { id: 'POL-L4-5', shipId: 'SHIP-POL', name: 'Pas 4.5', deck: 4, totalLength: 180, occupiedLength: 90 },
];

export const MOCK_VOYAGE_CAPACITIES: VoyageCapacity[] = [
  { 
    routeId: 'R001', 
    departureTime: '2023-10-25T13:00:00', 
    shipName: 'm/f Polonia', 
    paxTotal: 918, 
    paxBooked: 850, 
    cabinTotal: 212, 
    cabinBooked: 195, 
    laneMetersTotal: 2200, 
    laneMetersBooked: 2100, 
    priceLevel: 'HIGH', 
    cabinBreakdown: [
      { type: 'INSIDE_2', total: 100, booked: 98 },
      { type: 'OUTSIDE_2', total: 80, booked: 79 },
      { type: 'LUX', total: 32, booked: 18 }
    ] 
  },
  { 
    routeId: 'R003', 
    departureTime: '2023-10-25T23:00:00', 
    shipName: 'm/f Skania', 
    paxTotal: 1397, 
    paxBooked: 1397, 
    cabinTotal: 190, 
    cabinBooked: 190, 
    laneMetersTotal: 1740, 
    laneMetersBooked: 1740, 
    priceLevel: 'SOLD_OUT', 
    cabinBreakdown: [
      { type: 'INSIDE_4', total: 120, booked: 120 },
      { type: 'OUTSIDE_4', total: 60, booked: 60 },
      { type: 'LUX', total: 10, booked: 10 }
    ] 
  },
  { 
    routeId: 'R103', 
    departureTime: '2023-10-25T09:00:00', 
    shipName: 'm/v Mazovia', 
    paxTotal: 920, 
    paxBooked: 450, 
    cabinTotal: 230, 
    cabinBooked: 110, 
    laneMetersTotal: 2940, 
    laneMetersBooked: 1800, 
    priceLevel: 'STANDARD', 
    cabinBreakdown: [
      { type: 'INSIDE_2', total: 150, booked: 80 },
      { type: 'OUTSIDE_2', total: 60, booked: 20 },
      { type: 'LUX', total: 20, booked: 10 }
    ] 
  },
  { 
    routeId: 'R104', 
    departureTime: '2023-10-25T15:30:00', 
    shipName: 'm/v Varsovia', 
    paxTotal: 920, 
    paxBooked: 220, 
    cabinTotal: 230, 
    cabinBooked: 45, 
    laneMetersTotal: 2940, 
    laneMetersBooked: 1100, 
    priceLevel: 'LOW', 
    cabinBreakdown: [
      { type: 'INSIDE_2', total: 150, booked: 30 },
      { type: 'OUTSIDE_2', total: 60, booked: 10 },
      { type: 'LUX', total: 20, booked: 5 }
    ] 
  },
  { 
    routeId: 'R101', 
    departureTime: '2023-10-25T18:00:00', 
    shipName: 'm/v Nova Star', 
    paxTotal: 1215, 
    paxBooked: 120, 
    cabinTotal: 155, 
    cabinBooked: 15, 
    laneMetersTotal: 1575, 
    laneMetersBooked: 400, 
    priceLevel: 'LOW', 
    cabinBreakdown: [
      { type: 'INSIDE_4', total: 100, booked: 10 },
      { type: 'OUTSIDE_4', total: 40, booked: 2 },
      { type: 'LUX', total: 15, booked: 3 }
    ] 
  },
  { 
    routeId: 'R201', 
    departureTime: '2023-10-25T08:00:00', 
    shipName: 'm/f Epsilon', 
    paxTotal: 260, 
    paxBooked: 210, 
    cabinTotal: 65, 
    cabinBooked: 58, 
    laneMetersTotal: 2860, 
    laneMetersBooked: 2750, 
    priceLevel: 'HIGH', 
    cabinBreakdown: [
      { type: 'INSIDE_2', total: 50, booked: 45 },
      { type: 'OUTSIDE_2', total: 15, booked: 13 }
    ] 
  }
];