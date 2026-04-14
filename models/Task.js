const db = require("../config/database");

class Task {
    static create(project_id, task_title, description, assigned_to, due_date, status, callback) {
        const query = `
            INSERT INTO tasks (project_id, task_title, description, assigned_to, due_date, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(query, [project_id, task_title, description, assigned_to, due_date, status || 'Pending'], callback);
    }

    static findByProjectId(projectId, callback) {
        const query = "SELECT * FROM tasks WHERE project_id = ? ORDER BY task_id DESC";
        db.query(query, [projectId], callback);
    }

    static findByUserId(userId, callback) {
        const query = `
            SELECT tasks.*, projects.title AS project_title
            FROM tasks
            JOIN projects ON tasks.project_id = projects.project_id
            WHERE projects.created_by = ?
            ORDER BY tasks.task_id DESC
        `;
        db.query(query, [userId], callback);
    }

    static findById(taskId, callback) {
        const query = `
            SELECT tasks.*, projects.created_by
            FROM tasks
            JOIN projects ON tasks.project_id = projects.project_id
            WHERE task_id = ?
        `;
        db.query(query, [taskId], callback);
    }

    static update(taskId, task_title, description, due_date, status, callback) {
        const query = `
            UPDATE tasks
            SET task_title = ?, description = ?, due_date = ?, status = ?
            WHERE task_id = ?
        `;
        db.query(query, [task_title, description, due_date, status, taskId], callback);
    }

    static delete(taskId, callback) {
        const query = "DELETE FROM tasks WHERE task_id = ?";
        db.query(query, [taskId], callback);
    }

    static countByUserId(userId, callback) {
        const query = `
            SELECT COUNT(*) AS totalTasks 
            FROM tasks 
            WHERE project_id IN (SELECT project_id FROM projects WHERE created_by = ?)
        `;
        db.query(query, [userId], callback);
    }

    static countPendingByUserId(userId, callback) {
        const query = `
            SELECT COUNT(*) AS pendingTasks 
            FROM tasks 
            WHERE status = 'Pending' 
            AND project_id IN (SELECT project_id FROM projects WHERE created_by = ?)
        `;
        db.query(query, [userId], callback);
    }

    static countCompletedByUserId(userId, callback) {
        const query = `
            SELECT COUNT(*) AS completedTasks 
            FROM tasks 
            WHERE status = 'Completed' 
            AND project_id IN (SELECT project_id FROM projects WHERE created_by = ?)
        `;
        db.query(query, [userId], callback);
    }

    static countByProjectId(projectId, callback) {
        const query = "SELECT COUNT(*) AS total FROM tasks WHERE project_id = ?";
        db.query(query, [projectId], callback);
    }

    static countCompletedByProjectId(projectId, callback) {
        const query = "SELECT COUNT(*) AS completed FROM tasks WHERE project_id = ? AND status = 'Completed'";
        db.query(query, [projectId], callback);
    }
}

module.exports = Task;