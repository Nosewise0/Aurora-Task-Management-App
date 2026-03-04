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

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookie());

const JWT_SECRET = "thisshouldbeasecret";

app.use((req, res, next) => {
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

app.get('/', (req,res)=> {
  res.render('dashboard')
})

app.use('/tasks', tasksRoutes)
app.use('/projects', projectRoutes)
app.use('/team', teamRoutes)
app.use('/', authRoutes)
app.use('/calendar', calendarRoutes)
app.use('/settings', settingsRoutes)

app.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.redirect("/login");
});

app.use((req, res, next) => {
  res.locals.success = req.query.success;
  res.locals.error = req.query.error;
  next();
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
