const db = require("../config/database");
const { renderError } = require("../utils/errorHandler");

module.exports.getNotifications = async (req, res) => {
    try {
        const [invites] = await db.execute(
            "SELECT * FROM invitations WHERE email = ? AND status = 'pending'",
            [req.user.email]
        );

        const notifications = invites.map((invite) => ({
            id: invite.id,
            title: "Workspace Invitation",
            body: `You were invited to join workspace ${invite.workspace}`,
            createdAt: invite.invited_at,
            read: false,
            type: "invite",
            token: invite.token,
        }));

        res.render("notifications", { notifications });
    } catch (err) {
        console.error(err);
        renderError(res, 500);
    }
};

module.exports.markRead = async (req, res) => {
    try {
        await db.execute(
            "UPDATE invitations SET status='read' WHERE id = ? AND email = ?",
            [req.params.id, req.user.email]
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};

module.exports.acceptInvite = async (req, res) => {
    try {
        const [rows] = await db.execute(
            "SELECT * FROM invitations WHERE token = ? AND status = 'pending' AND email = ?",
            [req.params.token, req.user.email]
        );
        if (!rows.length) return renderError(res, 403, "Invalid or expired invite.");

        const invite = rows[0];
        await db.execute("UPDATE invitations SET status='accepted' WHERE id = ?", [invite.id]);
        res.redirect("/projects?success=You have joined the workspace!");
    } catch (err) {
        console.error(err);
        renderError(res, 500);
    }
};
