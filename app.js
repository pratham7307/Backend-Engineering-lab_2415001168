const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const app = express();

const path = require("path");
app.use(express.static(path.join(__dirname, "route")));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to Student Exam Portal");
});

app.post("/login", (req, res) => {
  const { username, role } = req.body;

  if (!username || !role) {
    return res.send("Username and role required");
  }
  req.session.user = { username, role };
  res.cookie("role", role);

  res.send(`Logged in as ${username} (${role})`);
});

app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.send("Please login first");
  }

  const { username, role } = req.session.user;

  res.send(`Welcome ${username}, you are logged in as ${role}`);
});

app.get("/admin", (req, res) => {
  if (!req.session.user) {
    return res.send("Please login first");
  }

  if (req.session.user.role !== "admin") {
    return res.send("Access Denied: Admin only");
  }

  res.send("Welcome to admin Page");
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("role");
    res.send("Logout successful");
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
