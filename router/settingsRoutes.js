import express from "express";
import * as settingsController from "../controller/settingsController.js";
import uploadAvatar from "../middleware/upload.js";

const router = express.Router();

router.get("/", settingsController.redirectToProfile);
router.get("/profile", settingsController.renderProfile);
router.get("/notifications", settingsController.renderNotifications);
router.get("/security", settingsController.renderSecurity);
router.get("/appearance", settingsController.renderAppearance);
router.get("/billing", settingsController.renderBilling);

router.post("/profile", settingsController.updateProfile);
router.post("/avatar", uploadAvatar.single("avatar"), settingsController.uploadAvatar);
router.post("/security", settingsController.updatePassword);

export default router;