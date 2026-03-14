const db = require("../config/database");
const { formatDate, getCategoryColor, getPriorityColor } = require("../utils/taskHelpers");
const { renderError } = require("../utils/errorHandler");

module.exports.getTasks = async (req, res) => {
    try {
        const user_id = req.user.id;
        const [tasks] = await db.execute(
            "SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date ASC",
            [user_id]
        );

        res.render("tasks", {
            todoTasks: tasks.filter((t) => t.status === "pending"),
            inProgressTasks: tasks.filter((t) => t.status === "in-progress"),
            reviewTasks: tasks.filter((t) => t.status === "review"),
            doneTasks: tasks.filter((t) => t.status === "completed"),
            formatDate,
            getCategoryColor,
            getPriorityColor,
        });
    } catch (e) {
        console.error(e);
        renderError(res, 500);
    }
};

module.exports.renderNewTask = (req, res) => {
    res.render("newtask");
};

module.exports.createTask = async (req, res) => {
    const { title, description, status, priority, due_date, category } = req.body;

    const validStatuses = ["pending", "completed", "in-progress", "review"];
    const validPriorities = ["low", "medium", "high", "urgent"];

    const safeStatus = validStatuses.includes(status?.toLowerCase().trim()) ? status.toLowerCase().trim() : "pending";
    const safePriority = validPriorities.includes(priority?.toLowerCase().trim()) ? priority.toLowerCase().trim() : "medium";

    try {
        await db.execute(
            `INSERT INTO tasks (title, description, status, priority, due_date, category, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [title || null, description || null, safeStatus, safePriority, due_date || null, category || null, req.user.id]
        );
        res.redirect("/tasks?success=Task created successfully!");
    } catch (e) {
        console.error(e);
        res.redirect("/tasks?error=Failed to create task. Please try again.");
    }
};

module.exports.getTaskById = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM tasks WHERE id = ?", [req.params.id]);
        if (!rows.length) return renderError(res, 404, "The task you're looking for doesn't exist.");
        if (rows[0].user_id !== req.user.id) return renderError(res, 403, "You don't have permission to view this task.");
        res.render("task-details", { task: rows[0], formatDate, getCategoryColor, getPriorityColor });
    } catch (e) {
        console.error(e);
        renderError(res, 500);
    }
};

module.exports.renderEditTask = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM tasks WHERE id = ?", [req.params.id]);
        if (!rows.length) return renderError(res, 404, "The task you're looking for doesn't exist.");
        if (rows[0].user_id !== req.user.id) return renderError(res, 403, "You don't have permission to edit this task.");
        res.render("edit-task", { task: rows[0] });
    } catch (e) {
        console.error(e);
        renderError(res, 500);
    }
};

module.exports.updateTask = async (req, res) => {
    const { title, description, status, priority, due_date, category } = req.body;
    const taskId = req.params.id;
    try {
        await db.execute(
            `UPDATE tasks
       SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, category = ?
       WHERE id = ?`,
            [title, description, status, priority, due_date || null, category, taskId]
        );
        res.redirect(`/tasks/${taskId}`);
    } catch (e) {
        console.error(e);
        res.redirect("/tasks?error=Failed to update task.");
    }
};

module.exports.deleteTask = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM tasks WHERE id = ? AND user_id = ?", [req.params.id, req.user.id]);
        if (!rows.length) return renderError(res, 403, "You can only delete your own tasks.");
        await db.execute("DELETE FROM tasks WHERE id = ? AND user_id = ?", [req.params.id, req.user.id]);
        res.redirect("/tasks?success=Task deleted");
    } catch (e) {
        console.error(e);
        res.redirect("/tasks?error=Failed to delete task");
    }
};
