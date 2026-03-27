import express from "express";
import * as teamController from "../controller/teamController.js";

const router = express.Router();

router.get("/", teamController.getTeam);
router.get("/invite", teamController.renderInvite);
router.post("/invite", teamController.sendInvite);
router.get("/:id", teamController.getInviteById);
router.delete("/:id", teamController.deleteInvite);

export default router;
