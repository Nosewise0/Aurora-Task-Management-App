require('dotenv').config();

const express = require("express");
const app = express();
const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");
const db = require("./config/database");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");

const authRoutes = require('./router/authRoutes');
const settingsRoutes = require('./router/settingsRoutes');
const calendarRoutes = require('./router/calendarRoutes');
const tasksRoutes = require('./router/taskRoutes');
const projectRoutes = require('./router/projectRoutes');
const teamRoutes = require('./router/teamRoutes');
const dashboardRoutes = require('./router/dashboardRoutes');
const notificationRoutes = require('./router/notificationRoutes');
const { isLoggedIn } = require('./middleware/auth');

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookie());

const JWT_SECRET = process.env.JWT_SECRET || "thisshouldbeasecret";

app.use(async (req, res, next) => {
  res.locals.path = req.path;
  res.locals.success = req.query.success || null;
  res.locals.error = req.query.error || null;
  res.locals.unreadCount = 0;

  const { token } = req.cookies;
  if (token) {
    try {
      res.locals.user = jwt.verify(token, JWT_SECRET);

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
app.use('/calendar', isLoggedIn, calendarRoutes);
app.use('/settings', isLoggedIn, settingsRoutes);
app.use('/notifications', isLoggedIn, notificationRoutes);

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
