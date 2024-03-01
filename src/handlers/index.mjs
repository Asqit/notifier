import { router as notifyRouter } from "./notify.mjs";
import { Router } from "express";

export const router = Router();

// bind all other routers
router.use("/api/notify", notifyRouter);
