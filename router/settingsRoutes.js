const express = require("express");
const router = express.Router();
const settingsController = require("../controller/settingsController");
const uploadAvatar = require("../middleware/upload");
router.get("/", settingsController.redirectToProfile);
router.get("/profile", settingsController.renderProfile);
router.get("/notifications", settingsController.renderNotifications);
router.get("/security", settingsController.renderSecurity);
router.get("/appearance", settingsController.renderAppearance);
router.get("/billing", settingsController.renderBilling);

router.post("/profile", settingsController.updateProfile);
router.post("/avatar", uploadAvatar.single("avatar"), settingsController.uploadAvatar);

module.exports = router;