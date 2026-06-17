import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { saveActivity } from "../controllers/interviewActivityController.js";

const router = express.Router();

router.post("/", protectRoute, saveActivity);

export default router;