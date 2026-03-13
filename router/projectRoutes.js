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

router.get("/accept-invite/:token", isLoggedIn, async (req, res) => {
  try {
    const token = req.params.token;

    const [invite] = await db.execute(
      "SELECT * FROM invitations WHERE token = ?",
      [token],
    );

    if (!invite.length) {
      return res.send("Invalid invite");
    }

    const data = invite[0];

    console.log(data); // debug

    const project_id = data.project_id || null;
    const user_id = req.user?.id || null;
    const invited_by = data.invited_by || null;

    await db.execute(
      `INSERT INTO project_shares 
       (project_id, user_id, role, invited_by)
       VALUES (?, ?, ?, ?)`,
      [project_id, user_id, "viewer", invited_by],
    );

    res.redirect("/projects");
  } catch (e) {
    console.log(e);
    res.send("Error accepting invite");
  }
});

router.get("/", async (req, res) => {
  const [projects] = await db.execute(
    `
    SELECT DISTINCT p.*
    FROM projects p
    LEFT JOIN project_shares ps
    ON p.id = ps.project_id
    WHERE p.owner_id = ?
    OR ps.user_id = ?
  `,
    [req.user.id, req.user.id],
  );

  res.render("projects", { projects });
});

router.get("/:id", isLoggedIn, async (req, res) => {
  const projectId = req.params.id;

  const [rows] = await db.execute(
    `
    SELECT p.*
    FROM projects p
    LEFT JOIN project_shares ps
    ON p.id = ps.project_id
    WHERE p.id = ?
    AND (p.user_id = ? OR ps.user_id = ?)
    `,
    [projectId, req.user.id, req.user.id],
  );

  if (!rows.length) {
    return res.send("Access denied");
  }

  res.render("project-details", { projects: rows[0] });
});

module.exports = router;
