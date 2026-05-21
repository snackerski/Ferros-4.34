import { Router } from "express";
import { MOCK_USERS, MOCK_FORWARDERS } from "../services/mockData";

const router = Router();

router.post("/login", (req, res) => {
  const { username, password, loginType } = req.body;
  
  if (loginType === 'STAFF') {
    const user = MOCK_USERS.find(u => u.username === username);
    if (user && password === 'demo123') {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: "Błędny login lub hasło." });
    }
  } else {
    // Cargo login logic
    const client = MOCK_FORWARDERS.find((f: any) => f.contractNumber === username);
    if (client && password === 'cargo123') {
      res.json({ success: true, client });
    } else {
      res.status(401).json({ success: false, message: "Błędny numer kontraktu lub hasło spedytora." });
    }
  }
});

export default router;
