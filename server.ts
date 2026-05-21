import express from "express";
import { createServer as createViteServer } from "vite";
import { MOCK_ROUTES, MOCK_PRICING_RULES, MOCK_YIELD_BUCKETS, MOCK_VOYAGE_CAPACITIES, MOCK_RESERVATIONS } from "./services/mockData";
import fs from "fs";
import path from "path";

// Import routers
import authRouter from "./api/auth";
import pricingRouter, { setPricingData } from "./api/pricing";
import bookingRouter, { setBookingData } from "./api/bookings";
import routeRouter, { setRouteData } from "./api/routes";

const DATA_FILE = path.join(process.cwd(), "data.json");

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- Stateful Data ---
  let routes = [...MOCK_ROUTES];
  let pricingRules = [...MOCK_PRICING_RULES];
  let yieldBuckets = [...MOCK_YIELD_BUCKETS];
  let bookings = [...MOCK_RESERVATIONS];
  let voyageAvailability = [...MOCK_VOYAGE_CAPACITIES];

  // Load data from file if exists
  if (fs.existsSync(DATA_FILE)) {
    try {
      const savedData = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      if (savedData.routes) routes = savedData.routes;
      if (savedData.pricingRules) pricingRules = savedData.pricingRules;
      if (savedData.yieldBuckets) yieldBuckets = savedData.yieldBuckets;
      if (savedData.bookings) bookings = savedData.bookings;
      if (savedData.voyageAvailability) voyageAvailability = savedData.voyageAvailability;
      console.log("Data loaded from data.json");
    } catch (e) {
      console.error("Failed to load data.json", e);
    }
  }

  // Sync data with routers
  const syncData = () => {
    setRouteData(routes);
    setPricingData(routes, pricingRules, yieldBuckets);
    setBookingData(bookings, voyageAvailability);
  };

  const saveData = () => {
    try {
      const dataToSave = {
        routes,
        pricingRules,
        yieldBuckets,
        bookings,
        voyageAvailability
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(dataToSave, null, 2));
    } catch (e) {
      console.error("Failed to save data.json", e);
    }
  };

  // Initial sync
  syncData();

  // Middleware to save data after mutations (simple implementation)
  app.use((req, res, next) => {
    const originalJson = res.json;
    res.json = function(body) {
      const result = originalJson.call(this, body);
      if (req.method !== 'GET' && res.statusCode < 400) {
        saveData();
      }
      return result;
    };
    next();
  });

  // --- API Routes ---
  app.use("/api/auth", authRouter);
  app.use("/api/routes", routeRouter);
  app.use("/api/pricing", pricingRouter);
  app.use("/api/bookings", bookingRouter);

  // Availability endpoint (could be moved to its own router if needed)
  app.get("/api/availability", (req, res) => {
    res.json(voyageAvailability);
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
