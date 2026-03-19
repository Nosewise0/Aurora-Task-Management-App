const db = require("../config/database");
const { renderError } = require("../utils/errorHandler");

module.exports.redirectToProfile = (req, res) => {
  res.redirect("/settings/profile");
};

module.exports.renderProfile = async (req, res) => {
  const [rows] = await db.execute(
    "SELECT * FROM users WHERE id = ?",
    [req.user.id]
  );

  res.render("settings", {
    section: "profile",
    user: rows[0],
  });
};

module.exports.renderNotifications = (req, res) => {
  res.render("settings", {
    section: "notifications",
    user: req.user,
  });
};

module.exports.renderSecurity = (req, res) => {
  res.render("settings", {
    section: "security",
    user: req.user,
  });
};

module.exports.renderAppearance = (req, res) => {
  res.render("settings", {
    section: "appearance",
    user: req.user,
  });
};

module.exports.renderBilling = (req, res) => {
  res.render("settings", {
    section: "billing",
    user: req.user,
  });
};

module.exports.updateProfile = async (req, res) => {
  try {
    const { username, email, bio } = req.body;

    await db.execute(
      "UPDATE users SET username = ?, email = ?, bio = ? WHERE id = ?",
      [username, email, bio, req.user.id],
    );

    const [row] = await db.execute("SELECT * FROM users WHERE id = ?", [
      req.user.id,
    ]);

    req.user = row[0];

     console.log(req.body);
    res.redirect("/settings/profile");
  } catch (e) {
    console.log(e);
  }
};
