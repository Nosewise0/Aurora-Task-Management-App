const express = require("express");
const app = express();
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");

const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const { name } = require("ejs");

const JWT_SECRET = "thisshouldbeasecret";

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookie());

let db;

async function connectDB() {
  db = await mysql.createConnection({
    host: "localhost",
    user: "paul",
    password: "1234",
    database: "aurora",
  });
  console.log("sucess");
}

connectDB();

app.use((req, res, next) => {
  const token = req.cookies.token;
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

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword],
    );

    res.redirect('/login')
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async(req, res) => {
    const {email, password} = req.body;

    try {
        const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email,])
        const user = rows[0]
        if(!user) {
            return res.status(400).json({message: "user not found"})
        }

         const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({id: user.id, name: user.username, email: user.email}, JWT_SECRET, { expiresIn: '1h' });

         res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 3600000 // 1 HR EXPIRATION
        });
         res.redirect('/')
    }catch (err) {
        console.log(err)
        res.status(400).json({message: 'server error'})
    }
});


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
app.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.redirect("/login"); // redirect user after logout
});

const verifyAuthToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(403).json({ message: 'Token is missing.' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
