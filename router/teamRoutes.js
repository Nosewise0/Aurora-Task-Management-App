const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");
const db = require("../config/database");
const crypto = require("crypto");

router.get("/", isLoggedIn, async (req, res) => {
  try {
    const [invites] = await db.execute(
      "SELECT * FROM invitations WHERE invited_by = ?",
      [req.user.id],
    );
    res.render("team", { invites });
  } catch (e) {
    console.log(e);
    res.send("Server error");
  }
});

router.get("/invite", isLoggedIn, async (req, res) => {
  res.render("invitemember");
});

router.post("/invite", isLoggedIn, async (req, res) => {
  try {
    const { email, role, workspace, note } = req.body;
    const invited_by = req.user.id;

    const token = crypto.randomBytes(32).toString("hex");

    await db.execute(
      `INSERT INTO invitations 
      (email, role, workspace, note, invited_by, token)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [email, role, workspace, note || null, invited_by, token],
    );
    console.log(req.body)
    res.redirect("/team");
  } catch (err) {
    console.error(err);
    res.send("Invite failed");
  }
});

router.delete("/:id", isLoggedIn, async (req, res) => {});

module.exports = router;
