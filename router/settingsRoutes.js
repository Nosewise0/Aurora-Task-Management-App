const express = require("express");
const router = express.Router();
const settingsController = require("../controller/settingsController");

router.get("/", settingsController.redirectToProfile);
router.get("/profile", settingsController.renderProfile);
router.get("/notifications", settingsController.renderNotifications);
router.get("/security", settingsController.renderSecurity);
router.get("/appearance", settingsController.renderAppearance);
router.get("/billing", settingsController.renderBilling);

router.post("/profile", settingsController.updateProfile);

module.exports = router;