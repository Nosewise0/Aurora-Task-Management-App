import db from "../config/database.js";
import { renderError } from "../utils/errorHandler.js";
import crypto from "crypto";

export const getTeam = async (req, res) => {
    try {
        const [invites] = await db.execute(
            `SELECT i.*, u.avatar_url, u.username 
             FROM invitations i 
             LEFT JOIN users u ON i.email = u.email 
             WHERE i.invited_by = ?`,
            [req.user.id]
        );
        res.render("team", { invites });
    } catch (err) {
        console.error(err);
        renderError(res, 500);
    }
};

export const getInviteById = async (req, res) => {
    try {
        const [rows] = await db.execute(
            "SELECT * FROM invitations WHERE id = ? AND invited_by = ?",
            [req.params.id, req.user.id]
        );
        if (!rows.length) return renderError(res, 403, "You don't have permission to view this invitation.");
        res.render("team-details", { invite: rows[0] });
    } catch (err) {
        console.error(err);
        renderError(res, 500);
    }
};

export const renderInvite = (req, res) => {
    res.render("invitemember");
};

export const sendInvite = async (req, res) => {
    try {
        const { email, role, workspace, note, project_id } = req.body;
        const invited_by = req.user.id;
        const token = crypto.randomBytes(32).toString("hex");

        await db.execute(
            `INSERT INTO invitations (email, project_id, role, workspace, note, invited_by, token, status, invited_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
            [email, project_id || null, role || null, workspace || null, note || null, invited_by, token]
        );
        res.redirect("/team?success=Invitation sent successfully!");
    } catch (err) {
        console.error(err);
        res.redirect("/team/invite?error=Failed to send invite. Please try again.");
    }
};

export const deleteInvite = async (req, res) => {
    try {
        const [rows] = await db.execute(
            "SELECT * FROM invitations WHERE id = ? AND invited_by = ?",
            [req.params.id, req.user.id]
        );
        if (!rows.length) return renderError(res, 403, "You can only remove invitations you sent.");

        await db.execute(
            "DELETE FROM invitations WHERE id = ? AND invited_by = ?",
            [req.params.id, req.user.id]
        );
        res.redirect("/team?success=Invitation deleted successfully.");
    } catch (err) {
        console.error(err);
        renderError(res, 500);
    }
};
