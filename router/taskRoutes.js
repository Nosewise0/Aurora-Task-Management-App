import express from "express";
import * as taskController from "../controller/taskController.js";

const router = express.Router();

router.get("/", taskController.getTasks);
router.get("/new", taskController.renderNewTask);
router.post("/", taskController.createTask);

router.get("/:id", taskController.getTaskById);
router.get("/:id/edit", taskController.renderEditTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

export default router;
