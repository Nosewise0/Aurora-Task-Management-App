
const express = require('express')
const app = express();
const ejsMate = require('ejs-mate')
const path = require('path')
const methodOverride = require('method-override')

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("register", async (req, res) => {
    res.render('home')
})

app.get("/tasks", (req, res) => {
    res.render("tasks");
});

app.get("/projects", (req, res) => {
    res.render("projects");
});

app.get("/team", (req, res) => {
    res.render("team");
});

app.get("/calendar", (req, res) => {
    res.render("calendar");
});

app.get("/settings", (req, res) => {
    res.render("settings");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
