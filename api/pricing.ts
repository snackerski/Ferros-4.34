import { Router } from "express";
import { calculateDynamicPrice } from "../services/pricingService";

const router = Router();

// These will be passed from server.ts or handled via shared state
let pricingRules: any[] = [];
let yieldBuckets: any[] = [];
let routes: any[] = [];

export const setPricingData = (r: any[], pr: any[], yb: any[]) => {
  routes = r;
  pricingRules = pr;
  yieldBuckets = yb;
};

router.get("/rules", (req, res) => {
  res.json(pricingRules);
});

router.post("/rules", (req, res) => {
  const newRule = { ...req.body, id: `RULE-${Date.now()}` };
  pricingRules.push(newRule);
  res.json(newRule);
});

router.delete("/rules/:id", (req, res) => {
  const { id } = req.params;
  const index = pricingRules.findIndex(r => r.id === id);
  if (index !== -1) {
    pricingRules.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Rule not found" });
  }
});

router.get("/yield-buckets", (req, res) => {
  res.json(yieldBuckets);
});

router.post("/yield-buckets", (req, res) => {
  const newBucket = { ...req.body, id: `YB-${Date.now()}` };
  yieldBuckets.push(newBucket);
  res.status(201).json(newBucket);
});

router.delete("/yield-buckets/:id", (req, res) => {
  const { id } = req.params;
  const index = yieldBuckets.findIndex(b => b.id === id);
  if (index !== -1) {
    yieldBuckets.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Bucket not found" });
  }
});

router.post("/calculate", (req, res) => {
  const { routeId, date, params } = req.body;
  const route = routes.find(r => r.id === routeId);
  
  if (!route) {
    return res.status(404).json({ error: "Route not found" });
  }

  try {
    const breakdown = calculateDynamicPrice(route, new Date(date), {
      ...params,
      customRules: pricingRules,
      customYieldBuckets: yieldBuckets
    });
    res.json(breakdown);
  } catch (error) {
    res.status(500).json({ error: "Calculation failed" });
  }
});

export default router;
