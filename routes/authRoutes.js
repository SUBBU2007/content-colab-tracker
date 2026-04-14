const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// GET routes
router.get("/login", authController.showLogin);
router.get("/register", authController.showRegister);
router.get("/logout", authController.logout);

// POST routes
router.post("/login", authController.login);
router.post("/register", authController.register);

module.exports = router;