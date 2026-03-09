const express = require("express");
const router = express.Router();
const db = require('../config/database')
const { isLoggedIn } = require('../middleware/auth')


router.get("/", isLoggedIn, async (req, res) => {
  try {

    const [invites] = await db.execute(
      "SELECT * FROM invitations WHERE email = ? AND status = 'pending'",
      [req.user.email]
    );

    const notifications = invites.map(invite => ({
      id: invite.id,
      title: "Workspace Invitation",
      body: `You were invited to join workspace ${invite.workspace}`,
      createdAt: invite.invited_at,
      read: false,
      type: "invite",
      token: invite.token
    }));

    res.render("notifications", { notifications });

  } catch (err) {
    console.error(err);
    res.send("Server error");
  }
});

router.post("/read/:id", isLoggedIn, async (req, res) => {
  try {
    const id = req.params.id;
    await db.execute("UPDATE invitations SET status='read' WHERE id=? AND email=?", [
      id,
      req.user.email,
    ]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

router.get("/accept/:token", isLoggedIn, async (req, res) => {
  try {
    const token = req.params.token;
    const [rows] = await db.execute(
      "SELECT * FROM invitations WHERE token=? AND status='pending' AND email=?",
      [token, req.user.email]
    );

    if (!rows.length) return res.send("Invalid or expired invite.");

    const invite = rows[0];

    await db.execute("UPDATE invitations SET status='accepted' WHERE id=?", [invite.id]);
    res.send(`You have joined workspace ${invite.workspace}!`);
  } catch (err) {
    console.error(err);
    res.send("Server error");
  }
});

module.exports = router;
