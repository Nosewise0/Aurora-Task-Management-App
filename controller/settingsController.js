const db = require("../config/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports.redirectToProfile = (req, res) => {
  res.redirect("/settings/profile");
};

module.exports.renderProfile = async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [
    req.user.id,
  ]);

  res.render("settings", {
    section: "profile",
    user: rows[0],
  });
};

module.exports.renderNotifications = (req, res) => {
  res.render("settings", {
    section: "notifications",
    user: res.locals.user,
  });
};

module.exports.renderSecurity = (req, res) => {
  res.render("settings", {
    section: "security",
    user: res.locals.user,
  });
};

module.exports.renderAppearance = (req, res) => {
  res.render("settings", {
    section: "appearance",
    user: res.locals.user,
  });
};

module.exports.renderBilling = (req, res) => {
  res.render("settings", {
    section: "billing",
    user: res.locals.user,
  });
};

module.exports.updateProfile = async (req, res) => {
  try {
    const { username, email, bio } = req.body;
    const userId = req.user.id;

     const [existing] = await db.execute(
      "SELECT id FROM users WHERE username = ? AND id != ?",
      [username, userId]
    );
    
     if (existing.length > 0) {
      return res.status(400).send("Username already taken");
    }

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
      return res.redirect(
        "/settings/profile?error=Please select an image file",
      );
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
      { expiresIn: "6h" },
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

module.exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  try {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.redirect("/settings/security?error=All fields are required");
    }

    if (!newPassword || newPassword.length < 8) {
      return res.redirect("/settings/security?error=Password must be at least 8 characters");
    }

    if (newPassword !== confirmPassword) {
      return res.redirect("/settings/security?error=Passwords do not match");
    }

    if (newPassword === currentPassword) {
      return res.redirect("/settings/security?error=New password must be different from current password");
    }

    const [rows] = await db.execute(
      "SELECT password FROM users WHERE id = ?",
      [req.user.id]
    );

    if (!rows.length) {
      return res.redirect("/settings/security?error=User not found");
    }

    const user = rows[0];

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.redirect("/settings/security?error=Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.execute(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, req.user.id]
    );

    res.redirect("/settings/security?success=Password updated successfully");

  } catch (e) {
    console.log(e);
    res.redirect("/settings/security?error=Something went wrong");
  }
};
