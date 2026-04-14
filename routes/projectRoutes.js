const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const { isAuthenticated } = require("../middleware/auth");

// GET routes
router.get("/projects", isAuthenticated, projectController.getAllProjects);
router.get("/projects/create", isAuthenticated, projectController.showCreateForm);
router.get("/projects/:id", isAuthenticated, projectController.getProjectDetails);
router.get("/projects/:id/edit", isAuthenticated, projectController.showEditForm);

// POST routes
router.post("/projects/create", isAuthenticated, projectController.createProject);
router.post("/projects/:id/edit", isAuthenticated, projectController.updateProject);
router.post("/projects/:id/delete", isAuthenticated, projectController.deleteProject);

module.exports = router;