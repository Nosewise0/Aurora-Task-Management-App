require('dotenv').config();

const express = require("express");
const app = express();
const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");

const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");

const authRoutes = require('./router/authRoutes')
const settingsRoutes = require('./router/settingsRoutes')
const calendarRoutes = require('./router/callendarRoutes')
const tasksRoutes = require('./router/taskRoutes')
const projectRoutes = require('./router/projectRoutes')
const teamRoutes = require('./router/teamRoutes')
const { isLoggedIn } = require('./middleware/auth')
const dashboardRoutes = require('./router/dashboardRoutes')
const notificationRoutes = require('./router/notificationRoutes')

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookie());

const JWT_SECRET = process.env.JWT_SECRET || "thisshouldbeasecret";

app.use((req, res, next) => {
  res.locals.path = req.path;
  res.locals.success = req.query.success || null;
  res.locals.error = req.query.error || null;
  const { token } = req.cookies;
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      res.locals.user = decoded;
    } catch (err) {
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
});

app.get('/', (req, res) => {
  res.render('frontPage');
});

app.get('/home', (req, res) => {
  res.render('frontPage');
});



app.use('/dashboard', isLoggedIn, dashboardRoutes)
app.use('/', authRoutes)
app.use('/tasks', isLoggedIn, tasksRoutes)
app.use('/projects', isLoggedIn, projectRoutes)
// app.use('/team', isLoggedIn, teamRoutes)
app.use('/calendar', isLoggedIn, calendarRoutes)
// app.use('/settings', isLoggedIn, settingsRoutes)
app.use('/notifications', isLoggedIn, notificationRoutes)

app.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.redirect("/home");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
