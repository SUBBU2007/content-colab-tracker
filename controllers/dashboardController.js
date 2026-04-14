const Project = require("../models/Project");
const Task = require("../models/Task");

exports.showDashboard = (req, res) => {
    const userId = req.session.user.id;

    Project.countByUserId(userId, (err, projectResult) => {
        if (err) return res.send("Database error");

        Task.countByUserId(userId, (err, taskResult) => {
            if (err) return res.send("Database error");

            Task.countPendingByUserId(userId, (err, pendingResult) => {
                if (err) return res.send("Database error");

                Task.countCompletedByUserId(userId, (err, completedResult) => {
                    if (err) return res.send("Database error");

                    const stats = {
                        totalProjects: projectResult[0].totalProjects,
                        totalTasks: taskResult[0].totalTasks,
                        pendingTasks: pendingResult[0].pendingTasks,
                        completedTasks: completedResult[0].completedTasks
                    };

                    res.render("dashboard", { 
                        user: req.session.user,
                        stats: stats
                    });
                });
            });
        });
    });
};