const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { isAuthenticated } = require("../middleware/auth");

// GET routes
router.get("/tasks", isAuthenticated, taskController.getAllTasks);
router.get("/projects/:projectId/tasks/create", isAuthenticated, taskController.showCreateForm);
router.get("/tasks/:id/edit", isAuthenticated, taskController.showEditForm);

// POST routes
router.post("/projects/:projectId/tasks/create", isAuthenticated, taskController.createTask);
router.post("/tasks/:id/edit", isAuthenticated, taskController.updateTask);
router.post("/tasks/:id/delete", isAuthenticated, taskController.deleteTask);
router.post("/tasks/:id/toggle-status", isAuthenticated, taskController.toggleTaskStatus);

module.exports = router;