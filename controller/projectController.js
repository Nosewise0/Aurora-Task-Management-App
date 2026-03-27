import db from "../config/database.js";
import { renderError } from "../utils/errorHandler.js";

export const getProjects = async (req, res) => {
    try {
        const [projects] = await db.execute(
            `SELECT DISTINCT p.*
       FROM projects p
       LEFT JOIN project_shares ps ON p.id = ps.project_id
       WHERE p.user_id = ? OR ps.user_id = ?
       ORDER BY p.created_at DESC`,
            [req.user.id, req.user.id]
        );
        res.render("projects", { projects });
    } catch (e) {
        console.error(e);
        renderError(res, 500);
    }
};

export const renderNewProject = (req, res) => {
    res.render("newproject");
};

export const createProject = async (req, res) => {
    let { title, description, status, start_date, end_date, due_days, tags } = req.body;
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
            `INSERT INTO projects (title, description, status, start_date, end_date, due_days, tags, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, description, status, start_date, end_date, due_days, tags, user_id]
        );
        res.redirect("/projects");
    } catch (e) {
        console.error(e);
        renderError(res, 500);
    }
};

async function fetchAccessibleProject(projectId, userId) {
    const [rows] = await db.execute(
        `SELECT p.*
     FROM projects p
     LEFT JOIN project_shares ps ON p.id = ps.project_id
     WHERE p.id = ? AND (p.user_id = ? OR ps.user_id = ?)`,
        [projectId, userId, userId]
    );
    return rows[0] || null;
}

export const getProjectById = async (req, res) => {
    try {
        const project = await fetchAccessibleProject(req.params.id, req.user.id);
        if (!project) return renderError(res, 403);
        res.render("project-details", { project });
    } catch (e) {
        console.error(e);
        renderError(res, 500);
    }
};

export const renderEditProject = async (req, res) => {
    try {
        const project = await fetchAccessibleProject(req.params.id, req.user.id);
        if (!project) return renderError(res, 403);
        res.render("project-edit", { project });
    } catch (e) {
        console.error(e);
        renderError(res, 500);
    }
};

export const updateProject = async (req, res) => {
    const projectId = req.params.id;
    let { title, description, status, start_date, end_date, due_days, tags } = req.body;

    const validStatuses = ["active", "planning", "on-hold"];
    status = status ? status.toLowerCase().trim() : "planning";
    if (!validStatuses.includes(status)) status = "planning";

    title = title || null;
    description = description || null;
    start_date = start_date || null;
    end_date = end_date || null;
    due_days = due_days || null;
    tags = tags || null;

    try {
        const project = await fetchAccessibleProject(projectId, req.user.id);
        if (!project) return renderError(res, 403);

        await db.execute(
            `UPDATE projects
       SET title = ?, description = ?, status = ?, start_date = ?, end_date = ?, due_days = ?, tags = ?
       WHERE id = ?`,
            [title, description, status, start_date, end_date, due_days, tags, projectId]
        );
        res.redirect(`/projects/${projectId}`);
    } catch (e) {
        console.error(e);
        renderError(res, 500);
    }
};

export const deleteProject = async (req, res) => {
    const projectId = req.params.id;
    try {
        const [rows] = await db.execute(
            `SELECT p.* FROM projects p WHERE p.id = ? AND p.user_id = ?`,
            [projectId, req.user.id]
        );
        if (!rows.length) return renderError(res, 403, "You can only delete projects you own.");

        await db.execute("DELETE FROM projects WHERE id = ?", [projectId]);
        res.redirect("/projects");
    } catch (e) {
        console.error(e);
        renderError(res, 500);
    }
};

export const acceptProjectInvite = async (req, res) => {
    try {
        const token = req.params.token;
        const [inviteRows] = await db.execute(
            "SELECT * FROM invitations WHERE token = ? AND status = 'pending'",
            [token]
        );
        if (!inviteRows.length) return renderError(res, 403, "This invite link is invalid or has already been used.");

        const invite = inviteRows[0];

        await db.execute(
            `INSERT IGNORE INTO project_shares (project_id, user_id, role, invited_by)
       VALUES (?, ?, ?, ?)`,
            [invite.project_id, req.user.id, invite.role || "viewer", invite.invited_by]
        );
        await db.execute("UPDATE invitations SET status='accepted' WHERE id=?", [invite.id]);

        res.redirect("/projects");
    } catch (e) {
        console.error(e);
        renderError(res, 500);
    }
};
