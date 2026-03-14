const express = require("express");
const router = express.Router();
const notificationController = require("../controller/notificationController");

router.get("/", notificationController.getNotifications);
router.post("/read/:id", notificationController.markRead);
router.get("/accept/:token", notificationController.acceptInvite);

module.exports = router;
