const express = require("express");
const router = express.Router();
const projectController = require("../controller/projectController");

router.get("/", projectController.getProjects);
router.get("/new", projectController.renderNewProject);
router.post("/new", projectController.createProject);

router.get("/accept-invite/:token", projectController.acceptProjectInvite);

router.get("/:id", projectController.getProjectById);
router.get("/:id/edit", projectController.renderEditProject);
router.post("/:id/edit", projectController.updateProject);
router.get("/:id/delete", projectController.deleteProject);

module.exports = router;
