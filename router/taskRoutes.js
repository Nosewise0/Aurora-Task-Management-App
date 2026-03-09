const express = require("express");
const router = express.Router();
const db = require("../config/database");
const {
    formatDate,
    getCategoryColor,
    getPriorityColor,
} = require("../utils/taskHelpers");

router.get("/", async (req, res) => {
    try {
        const user_id = req.user.id;
        const [tasks] = await db.execute(
            "SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date ASC",
            [user_id],
        );

        const todoTasks = tasks.filter((t) => t.status === "pending");
        const inProgressTasks = tasks.filter((t) => t.status === "in-progress");
        const reviewTasks = tasks.filter((t) => t.status === "review");
        const doneTasks = tasks.filter((t) => t.status === "completed");

        res.render("tasks", {
            todoTasks,
            inProgressTasks,
            reviewTasks,
            doneTasks,
            formatDate,
            getCategoryColor,
            getPriorityColor,
        });
    } catch (e) {
        console.log(e);
        res.status(500).send("Error fetching tasks");
    }
});

router.get("/new", (req, res) => {
    res.render("newtask");
});

router.post("/", async (req, res) => {
    const { title, description, status, priority, due_date, category } = req.body;

    const validStatuses = ["pending", "completed", "in-progress", "review"];
    const validPriorities = ["low", "medium", "high", "urgent"];

    const priorityInput = priority?.toLowerCase().trim();
    const statusInput = status?.toLowerCase().trim();

    const safePriority = validPriorities.includes(priorityInput)
        ? priorityInput
        : "medium";
    const safeStatus = validStatuses.includes(statusInput)
        ? statusInput
        : "pending";

    const user_id = req.user.id;

    try {
        const [newtaks] = await db.execute(
            `INSERT INTO tasks (title, description, status,priority, due_date, category, user_id) VALUES (?,?,?,?,?,?,?)`,
            [
                title || null,
                description || null,
                safeStatus,
                safePriority,
                due_date || null,
                category || null,
                user_id,
            ],
        );

        res.redirect("/tasks?success=Task created successfully!");
    } catch (e) {
        console.log(e);
        res.redirect("/tasks?error=Failed to create task. Please try again.");
    }
});

router.get("/:id", async (req, res) => {
    const taskId = req.params.id;

    try {
        const [rows] = await db.execute("SELECT * FROM tasks WHERE id = ?", [
            taskId,
        ]);

        if (rows.length === 0) {
            return res.status(404).send("Task not found");
        }

        const task = rows[0];

        res.render("task-details", {
            task,
            formatDate,
            getCategoryColor,
            getPriorityColor,
        });
    } catch (e) {
        console.log(e);
        res.status(500).send("Server error");
    }
});

router.get("/:id/edit", async (req, res) => {
    const taksId = req.params.id;

    try {
        const [rows] = await db.execute("SELECT * FROM tasks WHERE id = ?", [taksId]);

        const task = rows[0]

        res.render('edit-task', { task })
    } catch (e) {
        console.log(e)
        res.redirect("/tasks")
    }
});

router.put("/:id", async (req, res) => {

    const { title, description, status, priority, due_date, category } = req.body;
    const taskId = req.params.id;

    try {

        await db.execute(
            `UPDATE tasks 
            SET title=?, description=?, status=?, priority=?, due_date=?, category=?
            WHERE id=?`,
            [title, description, status, priority, due_date || null, category, taskId]
        );

        res.redirect(`/tasks/${taskId}`);

    } catch (e) {
        console.log(e);
        res.redirect("/tasks");
    }
});

router.delete("/:id", async (req, res) => {
    const taskId = req.params.id;
    const user_Id = req.user.id

    try {
        await db.execute(
            "DELETE FROM tasks WHERE id = ? AND user_id = ?",
            [taskId, user_Id]
        );

        res.redirect("/tasks?success=Task deleted");

    } catch (e) {
        console.log(e);
        res.redirect("/tasks?error=Failed to delete task");
    }
});

module.exports = router;
