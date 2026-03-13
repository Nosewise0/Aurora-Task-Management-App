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
  try {
    const [projects] = await db.execute(
      `
      SELECT DISTINCT p.*
      FROM projects p
      LEFT JOIN project_shares ps
      ON p.id = ps.project_id
      WHERE p.user_id = ?
      OR ps.user_id = ?
      ORDER BY p.created_at DESC
      `,
      [req.user.id, req.user.id],
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

  try {
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
      return res.status(403).send("Access denied");
    }

    res.render("project-details", { project: rows[0] });
  } catch (e) {
    console.log(e);
    res.status(500).send("Database error");
  }
});

router.get("/:id/edit", isLoggedIn, async (req, res) => {
  const projectId = req.params.id;

  try {
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
      return res.status(403).send("Access denied");
    }

    res.render("project-edit", { project: rows[0] });
  } catch (e) {
    console.log(e);
    res.status(500).send("Database error");
  }
});

router.post("/:id/edit", isLoggedIn, async (req, res) => {
  const projectId = req.params.id;

  let { title, description, status, start_date, end_date, due_days, tags } =
    req.body;

  const validStatuses = ["active", "planning", "on-hold"];
  status = status ? status.toLowerCase().trim() : "planning";
  if (!validStatuses.includes(status)) {
    status = "planning";
  }

  title = title || null;
  description = description || null;
  status = status || null;
  start_date = start_date || null;
  end_date = end_date || null;
  due_days = due_days || null;
  tags = tags || null;

  try {
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
      return res.status(403).send("Access denied");
    }

    await db.execute(
      `UPDATE projects
       SET title = ?, description = ?, status = ?, start_date = ?, end_date = ?, due_days = ?, tags = ?
       WHERE id = ?`,
      [
        title,
        description,
        status,
        start_date,
        end_date,
        due_days,
        tags,
        projectId,
      ],
    );

    res.redirect(`/projects/${projectId}`);
  } catch (e) {
    console.log(e);
    res.status(500).send("Database error");
  }
});

router.get("/:id/delete", isLoggedIn, async (req, res) => {
  const projectId = req.params.id;

  try {
    const [rows] = await db.execute(
      `
      SELECT p.*
      FROM projects p
      LEFT JOIN project_shares ps
      ON p.id = ps.project_id
      WHERE p.id = ?
      AND p.user_id = ?
      `,
      [projectId, req.user.id],
    );

    if (!rows.length) {
      return res.status(403).send("Access denied");
    }

    await db.execute("DELETE FROM projects WHERE id = ?", [projectId]);

    res.redirect("/projects");
  } catch (e) {
    console.log(e);
    res.status(500).send("Database error");
  }
});

router.get("/accept-invite/:token", isLoggedIn, async (req, res) => {
  try {
    const token = req.params.token;

    const [inviteRows] = await db.execute(
      "SELECT * FROM invitations WHERE token = ? AND status = 'pending'",
      [token],
    );

    if (!inviteRows.length) {
      return res.send("Invalid invite");
    }

    const invite = inviteRows[0];

    await db.execute(
      `INSERT IGNORE INTO project_shares 
       (project_id, user_id, role, invited_by)
       VALUES (?, ?, ?, ?)`,
      [
        invite.project_id,
        req.user.id,
        invite.role || "viewer",
        invite.invited_by,
      ],
    );

    await db.execute("UPDATE invitations SET status='accepted' WHERE id=?", [
      invite.id,
    ]);

    res.redirect("/projects");
  } catch (e) {
    console.log(e);
    res.send("Error accepting invite");
  }
});

module.exports = router;
