const express = require("express");
const db = require('../config/database')
const { isLoggedIn } = require('../middleware/auth')

module.exports.renderNotifications = isLoggedIn, async (req, res) => {
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
};
