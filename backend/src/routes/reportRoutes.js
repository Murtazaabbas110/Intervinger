import express from "express";
import { getReports } from "../controllers/reportController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getReports);

export default router;