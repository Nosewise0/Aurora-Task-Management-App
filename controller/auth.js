import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/database.js";

const JWT_SECRET = process.env.JWT_SECRET || "thisshouldbeasecret";

export const renderRegister = (req, res) => {
    res.render("register");
};

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const renderLogin = (req, res) => {
    res.render("login");
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    const user = rows[0];

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, name: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
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
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
};