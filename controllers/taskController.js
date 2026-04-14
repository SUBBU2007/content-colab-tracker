const Task = require("../models/Task");
const Project = require("../models/Project");

// Show all tasks
exports.getAllTasks = (req, res) => {
    const userId = req.session.user.id;

    Task.findByUserId(userId, (err, tasks) => {
        if (err) return res.send("Database error");
        res.render("tasks/tasks", { tasks });
    });
};

// Show create task form
exports.showCreateForm = (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.session.user.id;

    Project.findById(projectId, (err, result) => {
        if (err) return res.send("Database error");
        if (result.length === 0) return res.send("Project not found");
        if (result[0].created_by !== userId) return res.send("Unauthorized");

        res.render("tasks/create-task", { project: result[0] });
    });
};

// Create new task
exports.createTask = (req, res) => {
    const projectId = req.params.projectId;
    const { task_title, description, due_date, status } = req.body;
    const userId = req.session.user.id;

    Task.create(projectId, task_title, description, userId, due_date, status, (err) => {
        if (err) return res.send("Task creation failed");
        res.redirect(`/projects/${projectId}`);
    });
};

// Show edit task form
exports.showEditForm = (req, res) => {
    const taskId = req.params.id;
    const userId = req.session.user.id;

    Task.findById(taskId, (err, result) => {
        if (err) return res.send("Database error");
        if (result.length === 0) return res.send("Task not found");
        if (result[0].created_by !== userId) return res.send("Unauthorized");

        res.render("tasks/edit-task", { task: result[0] });
    });
};

// Update task
exports.updateTask = (req, res) => {
    const taskId = req.params.id;
    const { task_title, description, due_date, status } = req.body;

    Task.update(taskId, task_title, description, due_date, status, (err) => {
        if (err) return res.send("Update failed");
        res.redirect(`/tasks`);
    });
};

// Delete task
exports.deleteTask = (req, res) => {
    const taskId = req.params.id;

    Task.delete(taskId, (err) => {
        if (err) return res.send("Delete failed");
        res.redirect(`/tasks`);
    });
};

// Toggle task status (for checkbox)
exports.toggleTaskStatus = (req, res) => {
    const taskId = req.params.id;

    // First get current status
    Task.findById(taskId, (err, result) => {
        if (err) return res.send("Database error");
        if (result.length === 0) return res.send("Task not found");

        const currentStatus = result[0].status;
        const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';

        // Update to new status
        const db = require("../config/database");
        const query = "UPDATE tasks SET status = ? WHERE task_id = ?";
        
        db.query(query, [newStatus, taskId], (err) => {
            if (err) return res.send("Update failed");
            res.redirect(`/tasks`);
        });
    });
};