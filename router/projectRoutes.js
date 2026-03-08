const express = require("express");
const router = express.Router();
const db = require("../config/database");

function isLoggedIn(req, res, next) {
  if (!req.user) {
    return res.redirect("/login?error=You must be logged in");
  }
  next();
}

router.get("/", isLoggedIn, async (req, res) => {
  const user_id = req.user.id;

  try {
    const [projects] = await db.execute(
      "SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC",
      [user_id],
    );

    res.render("projects", { projects });
  } catch (e) {
    console.log(e);
    res.status(500).send("Database error");
  }
});

router.get("/new", isLoggedIn, (req, res) => {
  res.render("newproject");
});

router.post("/new", isLoggedIn, async (req, res) => {
  let { title, description, status, start_date, end_date, due_days, tags } =
    req.body;
  const user_id = req.user.id;

  title = title || null;
  description = description || null;
  status = status || null;
  start_date = start_date || null;
  end_date = end_date || null;
  due_days = due_days || null;
  tags = tags || null;

  try {
    await db.execute(
      `INSERT INTO projects
       (title, description, status, start_date, end_date, due_days, tags, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        status,
        start_date,
        end_date,
        due_days,
        tags,
        user_id,
      ],
    );

    res.redirect("/projects");
  } catch (e) {
    console.log(e);
    res.status(500).send("Database error");
  }
});

router.get("/:id", isLoggedIn, async (req, res) => {
  const projectId = req.params.id;
  const user_id = req.user.id;

  try {
    const [rows] = await db.execute(
      "SELECT * FROM projects WHERE id = ? AND user_id = ?",
      [projectId, user_id],
    );

    if (rows.length === 0) return res.status(404).send("Project not found");
    const project = rows[0];
    res.render("project-details", { project });
  } catch (e) {
    console.log(e);
    res.status(500).send("Database error");
  }
});

router.get("/:id/edit", isLoggedIn, async (req, res) => {
  const projectId = req.params.id;
  const user_id = req.user.id;

  try {
    const [rows] = await db.execute(
      "SELECT * FROM projects WHERE id = ? AND user_id = ?",
      [projectId, user_id],
    );

    if (rows.length === 0) return res.status(403).send("Access denied");
    const project = rows[0];
    res.render("project-edit", { project });
  } catch (e) {
    console.log(e);
    res.status(500).send("Database error");
  }
});

router.post("/:id/edit", isLoggedIn, async (req, res) => {
  const projectId = req.params.id;
  const user_id = req.user.id;
  let { title, description, status, start_date, end_date, due_days, tags } =
    req.body;
    
  const validStatuses = ["active", "planning", "on-hold"];
  status = status?.toLowerCase()?.trim();
  status = validStatuses.includes(status) ? status : "planning";

  title = title || null;
  description = description || null;
  status = status || null;
  start_date = start_date || null;
  end_date = end_date || null;
  due_days = due_days || null;
  tags = tags || null;

  try {
    const [result] = await db.execute(
      `UPDATE projects
       SET title = ?, description = ?, status = ?, start_date = ?, end_date = ?, due_days = ?, tags = ?
       WHERE id = ? AND user_id = ?`,
      [
        title,
        description,
        status,
        start_date,
        end_date,
        due_days,
        tags,
        projectId,
        user_id,
      ],
    );

    if (result.affectedRows === 0) return res.status(403).send("Access denied");
    res.redirect(`/projects/${projectId}`);
  } catch (e) {
    console.log(e);
    res.status(500).send("Database error");
  }
});

router.get("/:id/delete", isLoggedIn, async (req, res) => {
  const projectId = req.params.id;
  const user_id = req.user.id;

  try {
    const [result] = await db.execute(
      "DELETE FROM projects WHERE id = ? AND user_id = ?",
      [projectId, user_id],
    );

    if (result.affectedRows === 0) return res.status(403).send("Access denied");
    res.redirect("/projects");
  } catch (e) {
    console.log(e);
    res.status(500).send("Database error");
  }
});

module.exports = router;
