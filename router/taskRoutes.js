const express = require("express");
const router = express.Router();
const db = require("../config/database");
const { formatDate, getCategoryColor, getPriorityColor } = require("../utils/taskHelpers");

router.get("/", async (req, res) => {
    try {
        const [tasks] = await db.execute(
            "SELECT * FROM tasks ORDER BY due_date ASC",
        );

        const todoTasks = tasks.filter(t => t.status === 'pending');
        const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
        const reviewTasks = tasks.filter(t => t.status === 'review');
        const doneTasks = tasks.filter(t => t.status === 'completed');

        res.render("tasks", {
            todoTasks,
            inProgressTasks,
            reviewTasks,
            doneTasks,
            formatDate,
            getCategoryColor,
            getPriorityColor
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
    const validPriorities = ["low", "medium", "high"];

    const safePriority = validPriorities.includes(priority) ? priority : "medium";
    const safeStatus = validStatuses.includes(status) ? status : "pending";

    try {
        const [newtaks] = await db.execute(
            `INSERT INTO tasks (title, description, status,priority, due_date, category) VALUES (?,?,?,?,?,?)`,
            [
                title || null,
                description || null,
                safeStatus,
                safePriority,
                due_date || null,
                category || null,
            ],
        );

        res.redirect("/tasks?success=Task created successfully!");
    } catch (e) {
        console.log(e);
        res.redirect("/tasks?error=Failed to create task. Please try again.");
    }
});

router.get("/:id", (req, res) => {
    res.send("Task details stub");
});

router.get("/:id/edit", (req, res) => {
    res.send("Edit task form stub");
});

router.put("/:id", (req, res) => {
    res.redirect("/tasks");
});

router.delete("/:id", (req, res) => {
    res.redirect("/tasks");
});

module.exports = router;
