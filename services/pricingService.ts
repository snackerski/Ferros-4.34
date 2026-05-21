import { Route, VehicleType, CabinType, PricingRule, YieldBucket, SailingSchedule, CargoLoadType } from '../types';
import { MOCK_PRICING_RULES, MOCK_YIELD_BUCKETS, MOCK_SAILING_SCHEDULES } from './mockData';

// Constants from PRICING_POLICY.md
const DAY_MULTIPLIERS: Record<number, number> = {
  0: 1.45, // Sunday
  1: 1.00, // Monday
  2: 0.90, // Tuesday
  3: 0.90, // Wednesday
  4: 1.00, // Thursday
  5: 1.45, // Friday
  6: 1.25, // Saturday
};

const VEHICLE_ADDONS: Record<string, number> = {
  [VehicleType.CAR]: 180,
  [VehicleType.MOTORCYCLE]: 90,
  [VehicleType.BUS]: 650,
  [VehicleType.NONE]: 0,
};

const CABIN_ADDONS: Record<string, number> = {
  [CabinType.NONE]: 0,
  [CabinType.INSIDE_2]: 180,
  [CabinType.INSIDE_4]: 240,
  [CabinType.OUTSIDE_2]: 280,
  [CabinType.OUTSIDE_4]: 350,
  [CabinType.LUX]: 550,
};

const SURCHARGES = {
  BAF_PER_VEHICLE: 20,
  ETS_PER_PASSENGER: 5,
};

export interface PriceBreakdown {
  basePrice: number;
  dayMultiplier: number;
  occupancyMultiplier: number;
  ruleMultiplier: number;
  adultsCost: number;
  childrenCost: number;
  petsCost: number;
  vehicleAddon: number;
  cabinAddon: number;
  baf: number;
  ets: number;
  netTotal: number;
  vat: number;
  grossTotal: number;
  isCargo: boolean;
  cargoFreight?: number;
  adrSurcharge?: number;
}

export const calculateDynamicPrice = (
  route: Route,
  date: Date,
  params: {
    paxAdults: number;
    paxChildren: number;
    petCount: number;
    vehicleType: VehicleType;
    cabinType: CabinType;
    isRoundTrip?: boolean;
    isCargo?: boolean;
    cargoLength?: number;
    cargoDrivers?: number;
    cargoLoadType?: CargoLoadType;
  }
): PriceBreakdown => {
  const {
    paxAdults = 1,
    paxChildren = 0,
    petCount = 0,
    vehicleType = VehicleType.NONE,
    cabinType = CabinType.NONE,
    isRoundTrip = false,
    isCargo = false,
    cargoLength = 0,
    cargoDrivers = 1,
    cargoLoadType = CargoLoadType.STANDARD
  } = params;

  // 1. Day of Week Multiplier
  const dayOfWeek = date.getDay();
  const dayMultiplier = DAY_MULTIPLIERS[dayOfWeek] || 1.0;

  // 2. Occupancy Multiplier (Yield Management)
  // In a real system, we'd fetch actual occupancy for this specific sailing.
  // Here we'll mock it based on the route and date.
  const sailing = MOCK_SAILING_SCHEDULES.find(s => s.routeId === route.id);
  // Simple mock occupancy calculation
  const occupancyRate = sailing ? (sailing.paxCount / 1000) : 0.4; // fallback to 40%
  
  let occupancyMultiplier = 1.0;
  const bucket = MOCK_YIELD_BUCKETS.find(b => 
    (b.routeId === 'ALL' || b.routeId === route.id) && 
    (occupancyRate * 100) >= b.occupancyMin && 
    (occupancyRate * 100) <= b.occupancyMax
  );
  
  if (bucket) {
    occupancyMultiplier = bucket.priceMultiplier;
  } else {
    // Fallback logic if no bucket found
    if (occupancyRate > 0.9) occupancyMultiplier = 2.0;
    else if (occupancyRate > 0.75) occupancyMultiplier = 1.5;
    else if (occupancyRate > 0.5) occupancyMultiplier = 1.2;
  }

  // 3. Custom Pricing Rules (Seasonality etc)
  const dateStr = date.toISOString().split('T')[0];
  const activeRule = MOCK_PRICING_RULES.find(rule => 
    (rule.routeId === 'ALL' || rule.routeId === route.id) &&
    dateStr >= rule.startDate &&
    dateStr <= rule.endDate
  );
  const ruleMultiplier = activeRule ? activeRule.priceMultiplier : 1.0;

  // Combined Multiplier for Base Price
  const totalBaseMultiplier = dayMultiplier * occupancyMultiplier * ruleMultiplier;

  if (isCargo) {
    // Cargo Calculation: Sum = [Długość_Zestawu * (45 PLN * Mnożnik_Dnia) + (Liczba_Kierowców - 1) * 120 PLN] * Mnożnik_Powrotny
    const baseCargoRate = 45;
    let cargoFreight = (cargoLength || 0) * (baseCargoRate * dayMultiplier * occupancyMultiplier);
    
    // ADR Surcharge (+25%)
    let adrSurcharge = 0;
    if (cargoLoadType === CargoLoadType.ADR) {
        adrSurcharge = cargoFreight * 0.25;
    }

    const extraDriversCost = Math.max(0, (cargoDrivers || 1) - 1) * 120;
    
    let netTotal = (cargoFreight + adrSurcharge + extraDriversCost);
    if (isRoundTrip) netTotal *= 0.9; // 10% discount for round trip

    const vat = netTotal * 0.23; // 23% VAT for cargo

    return {
      basePrice: route.basePrice,
      dayMultiplier,
      occupancyMultiplier,
      ruleMultiplier,
      adultsCost: 0,
      childrenCost: 0,
      petsCost: 0,
      vehicleAddon: 0,
      cabinAddon: 0,
      baf: 0,
      ets: 0,
      isCargo: true,
      cargoFreight,
      adrSurcharge,
      netTotal,
      vat,
      grossTotal: netTotal + vat
    };
  }

  // Passenger Calculation
  // Sum = [(Cena_Bazowa * Mnożnik_Dnia * Liczba_Dorosłych) + (Cena_Bazowa * Mnożnik_Dnia * 0.5 * Liczba_Dzieci) + (50 PLN * Zwierzęta) + Dodatek_Pojazd + Dodatek_Kabina] * Mnożnik_Powrotny
  const adultsCost = (route.basePrice * totalBaseMultiplier) * paxAdults;
  const childrenCost = (route.basePrice * totalBaseMultiplier * 0.5) * paxChildren;
  const petsCost = petCount * 50;
  const vehicleAddon = VEHICLE_ADDONS[vehicleType] || 0;
  const cabinAddon = CABIN_ADDONS[cabinType] || 0;

  let netTotal = (adultsCost + childrenCost + petsCost + vehicleAddon + cabinAddon);
  
  // Round Trip Discount (1.8x for both ways = 10% off total per leg)
  if (isRoundTrip) {
    netTotal = netTotal * 0.9;
  }

  // Mandatory Surcharges
  const baf = vehicleType !== VehicleType.NONE ? SURCHARGES.BAF_PER_VEHICLE : 0;
  const ets = (paxAdults + paxChildren) * SURCHARGES.ETS_PER_PASSENGER;

  const finalNetPrice = netTotal + baf + ets;
  const vat = finalNetPrice * 0.08; // 8% VAT for pax

  return {
    basePrice: route.basePrice,
    dayMultiplier,
    occupancyMultiplier,
    ruleMultiplier,
    adultsCost,
    childrenCost,
    petsCost,
    vehicleAddon,
    cabinAddon,
    baf,
    ets,
    isCargo: false,
    netTotal: finalNetPrice,
    vat,
    grossTotal: finalNetPrice + vat
  };
};
