import { Router } from "express";

const router = Router();

let routes: any[] = [];

export const setRouteData = (r: any[]) => {
  routes = r;
};

router.get("/", (req, res) => {
  res.json(routes);
});

router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { basePrice } = req.body;
  const route = routes.find(r => r.id === id);
  if (route) {
    route.basePrice = basePrice;
    res.json(route);
  } else {
    res.status(404).json({ error: "Route not found" });
  }
});

export default router;
