const express = require("express");
const router = express.Router();
const teamController = require("../controller/teamController");

router.get("/", teamController.getTeam);
router.get("/invite", teamController.renderInvite);
router.post("/invite", teamController.sendInvite);
router.get("/:id", teamController.getInviteById);
router.delete("/:id", teamController.deleteInvite);

module.exports = router;
