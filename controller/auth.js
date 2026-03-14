const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/database");
const { renderError } = require("../utils/errorHandler");

const JWT_SECRET = process.env.JWT_SECRET || "thisshouldbeasecret";

module.exports.renderRegister = (req, res) => {
  res.render('register')
};

module.exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length > 0) {
      return res.redirect("/register?error=An account with that email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword],
    );

    res.redirect("/login?success=Account created! Please sign in.");
  } catch (error) {
    console.error(error);
    renderError(res, 500);
  }
};

module.exports.renderLogin = (req, res) => {
  res.render('login')
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];

    if (!user) {
      return res.redirect("/login?error=No account found with that email address.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.redirect("/login?error=Incorrect password. Please try again.");
    }

    const token = jwt.sign(
      { id: user.id, name: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3600000,
    });
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    renderError(res, 500);
  }
};

module.exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.redirect("/home");
};
