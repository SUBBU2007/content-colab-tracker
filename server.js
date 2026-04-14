const express = require("express");
const session = require("express-session");
const path = require("path");

// Initialize Express
const app = express();

// Import Routes
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Session Configuration
app.use(
    session({
        secret: "your-secret-key-here",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
    })
);

// View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Home Route
app.get("/", (req, res) => {
    if (req.session.user) {
        return res.redirect("/dashboard");
    }
    res.render("index");
});

// Use Routes
app.use("/", authRoutes);
app.use("/", dashboardRoutes);
app.use("/", projectRoutes);
app.use("/", taskRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).send("Page not found");
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});