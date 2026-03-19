const db = require("../config/database");
const { renderError } = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");

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
    res.redirect("/settings/profile?success=Profile updated successfully");
  } catch (e) {
    console.log(e);
    res.redirect("/settings/profile?error=Failed to update profile");
  }
};

module.exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.redirect("/settings/profile?error=Please select an image file");
    }

    const avatarUrl = "/uploads/avatars/" + req.file.filename;

    await db.execute("UPDATE users SET avatar_url = ? WHERE id = ?", [
      avatarUrl,
      req.user.id,
    ]);

    const [row] = await db.execute("SELECT * FROM users WHERE id = ?", [
      req.user.id,
    ]);
    const updatedUser = row[0];

    const token = jwt.sign(
      {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        role: updatedUser.role,
        avatar_url: updatedUser.avatar_url,
      },
      process.env.JWT_SECRET || "thisshouldbeasecret",
      { expiresIn: "6h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 6 * 60 * 60 * 1000,
    });

    res.redirect("/settings/profile?success=Avatar updated successfully");
  } catch (e) {
    console.log(e);
    res.redirect("/settings/profile?error=Failed to upload avatar");
  }
};
