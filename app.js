import 'dotenv/config';

import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";

import db from "./config/database.js";

import authRoutes from "./router/authRoutes.js";
import settingsRoutes from "./router/settingsRoutes.js";
import calendarRoutes from "./router/calendarRoutes.js";
import tasksRoutes from "./router/taskRoutes.js";
import projectRoutes from "./router/projectRoutes.js";
import teamRoutes from "./router/teamRoutes.js";
import dashboardRoutes from "./router/dashboardRoutes.js";
import notificationRoutes from "./router/notificationRoutes.js";
import aiRoutes from "./router/aiRoutes.js";

import { isLoggedIn } from "./middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

const JWT_SECRET = process.env.JWT_SECRET || "thisshouldbeasecret";

app.use(async (req, res, next) => {
  res.locals.path = req.path;
  res.locals.success = req.query.success || null;
  res.locals.error = req.query.error || null;
  res.locals.unreadCount = 0;

  const { token } = req.cookies;
  if (token) {
    try {
      const decodedUser = jwt.verify(token, JWT_SECRET);

      const [userRows] = await db.execute("SELECT username, avatar_url, email FROM users WHERE id = ?", [decodedUser.id]);
      if (userRows.length > 0) {
        decodedUser.username = userRows[0].username;
        decodedUser.avatar_url = userRows[0].avatar_url;
        decodedUser.name = userRows[0].username;
        decodedUser.email = userRows[0].email;
      }
      res.locals.user = decodedUser;

      const [rows] = await db.execute(
        "SELECT COUNT(*) as count FROM invitations WHERE email = ? AND status = 'pending'",
        [res.locals.user.email]
      );
      res.locals.unreadCount = rows[0].count || 0;
    } catch {
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
});

app.get('/', (req, res) => res.render('frontPage'));

app.use('/', authRoutes);

app.use('/dashboard', isLoggedIn, dashboardRoutes);
app.use('/tasks', isLoggedIn, tasksRoutes);
app.use('/projects', isLoggedIn, projectRoutes);
app.use('/team', isLoggedIn, teamRoutes);

app.use('/settings', isLoggedIn, settingsRoutes);
app.use('/notifications', isLoggedIn, notificationRoutes);
app.use('/ai', isLoggedIn, aiRoutes);

app.use((req, res) => {
  res.status(404).render("error", {
    statusCode: 404,
    heading: "Page Not Found",
    message: "The page you're looking for doesn't exist or may have been moved.",
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", {
    statusCode: 500,
    heading: "Something Went Wrong",
    message: "An unexpected error occurred on our end. Please try again in a moment.",
  });
});

const PORT = process.env.PORT || 3306;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
