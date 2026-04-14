const Project = require("../models/Project");
const Task = require("../models/Task");

// Show all projects
exports.getAllProjects = (req, res) => {
    const userId = req.session.user.id;

    Project.findByUserId(userId, (err, projects) => {
        if (err) return res.send("Database error");
        res.render("projects/projects", { projects });
    });
};

// Show create project form
exports.showCreateForm = (req, res) => {
    res.render("projects/create-project");
};

// Create new project
exports.createProject = (req, res) => {
    const { title, description, deadline, status } = req.body;
    const userId = req.session.user.id;

    Project.create(title, description, userId, deadline, status, (err) => {
        if (err) return res.send("Project creation failed");
        res.redirect("/projects");
    });
};

// Show project details
exports.getProjectDetails = (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.id;

    Project.findById(projectId, (err, projectResult) => {
        if (err) return res.send("Database error");
        if (projectResult.length === 0) return res.send("Project not found");
        if (projectResult[0].created_by !== userId) return res.send("Unauthorized");

        const project = projectResult[0];

        Task.findByProjectId(projectId, (err, tasks) => {
            if (err) return res.send("Database error");

            Task.countByProjectId(projectId, (err, totalResult) => {
                if (err) return res.send("Database error");

                Task.countCompletedByProjectId(projectId, (err, completedResult) => {
                    if (err) return res.send("Database error");

                    const totalTasks = totalResult[0].total;
                    const completedTasks = completedResult[0].completed;
                    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                    res.render("projects/project-details", {
                        project,
                        tasks,
                        totalTasks,
                        completedTasks,
                        progress
                    });
                });
            });
        });
    });
};

// Show edit project form
exports.showEditForm = (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.id;

    Project.findById(projectId, (err, result) => {
        if (err) return res.send("Database error");
        if (result.length === 0) return res.send("Project not found");
        if (result[0].created_by !== userId) return res.send("Unauthorized");

        res.render("projects/edit-project", { project: result[0] });
    });
};

// Update project
exports.updateProject = (req, res) => {
    const projectId = req.params.id;
    const { title, description, deadline, status } = req.body;

    Project.update(projectId, title, description, deadline, status, (err) => {
        if (err) return res.send("Update failed");
        res.redirect(`/projects/${projectId}`);
    });
};

// Delete project
exports.deleteProject = (req, res) => {
    const projectId = req.params.id;

    // First delete all tasks in this project
    const deleteTasksQuery = "DELETE FROM tasks WHERE project_id = ?";
    const db = require("../config/database");
    
    db.query(deleteTasksQuery, [projectId], (err) => {
        if (err) return res.send("Error deleting tasks");

        Project.delete(projectId, (err) => {
            if (err) return res.send("Delete failed");
            res.redirect("/projects");
        });
    });
};