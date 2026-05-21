import { Router } from "express";
import { BookingStatus } from "../types";

const router = Router();

let bookings: any[] = [];
let voyageAvailability: any[] = [];

export const setBookingData = (b: any[], va: any[]) => {
  bookings = b;
  voyageAvailability = va;
};

router.get("/", (req, res) => {
  res.json(bookings);
});

router.post("/", (req, res) => {
  const booking = {
    id: `RES-${Math.floor(100000 + Math.random() * 900000)}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  bookings.push(booking);
  
  // Update voyage occupancy
  const voyage = voyageAvailability.find(v => v.routeId === booking.routeId);
  if (voyage) {
    const paxCount = (booking.passengers?.length || 1);
    voyage.paxBooked += paxCount;
    
    // Simple price level logic
    const occupancy = voyage.paxBooked / voyage.paxTotal;
    if (occupancy >= 1) voyage.priceLevel = 'SOLD_OUT';
    else if (occupancy > 0.8) voyage.priceLevel = 'HIGH';
    else if (occupancy > 0.4) voyage.priceLevel = 'STANDARD';
    else voyage.priceLevel = 'LOW';
  }

  res.status(201).json(booking);
});

export default router;
