import { Router } from "express";
import { health, summary, typesDistribution, topManufacturers, yoy, qoq } from "../controllers/analyticsController.js";

const router = Router();

router.get("/health", health);

router.get("/api/registrations/summary", summary);
router.get("/api/types/distribution", typesDistribution);
router.get("/api/manufacturers/top", topManufacturers);
router.get("/api/registrations/yoy", yoy);
router.get("/api/registrations/qoq", qoq);

export default router;
