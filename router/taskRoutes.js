const express = require("express");
const router = express.Router();
const taskController = require("../controller/taskController");

router.get("/", taskController.getTasks);
router.get("/new", taskController.renderNewTask);
router.post("/", taskController.createTask);

router.get("/:id", taskController.getTaskById);
router.get("/:id/edit", taskController.renderEditTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
