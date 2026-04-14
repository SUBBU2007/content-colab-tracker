const User = require("../models/User");

// Show login page
exports.showLogin = (req, res) => {
    res.render("auth/login", { error: null });
};

// Handle login
exports.login = (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, (err, result) => {
        if (err) {
            return res.render("auth/login", { error: "Database error occurred" });
        }

        if (result.length === 0) {
            return res.render("auth/login", { error: "Invalid email or password" });
        }

        const user = result[0];

        if (password !== user.password) {
            return res.render("auth/login", { error: "Invalid email or password" });
        }

        req.session.user = { 
            id: user.user_id, 
            name: user.name, 
            email: user.email 
        };
        
        res.redirect("/dashboard");
    });
};

// Show register page
exports.showRegister = (req, res) => {
    res.render("auth/register", { error: null });
};

// Handle registration
exports.register = (req, res) => {
    const { name, email, password, role } = req.body;

    User.findByEmail(email, (err, result) => {
        if (err) {
            return res.render("auth/register", { error: "Database error occurred" });
        }

        if (result.length > 0) {
            return res.render("auth/register", { error: "Email already registered" });
        }

        User.create(name, email, password, role, (err) => {
            if (err) {
                return res.render("auth/register", { error: "Registration failed" });
            }
            res.redirect("/login");
        });
    });
};

// Handle logout
exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect("/login");
};