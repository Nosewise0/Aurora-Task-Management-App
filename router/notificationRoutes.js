import express from "express";
import * as notificationController from "../controller/notificationController.js";

const router = express.Router();

router.get("/", notificationController.getNotifications);
router.post("/read/:id", notificationController.markRead);
router.get("/accept/:token", notificationController.acceptInvite);

export default router;
