const db = require("../config/database");

class Project {
    static create(title, description, created_by, deadline, status, callback) {
        const query = `
            INSERT INTO projects (title, description, created_by, deadline, status)
            VALUES (?, ?, ?, ?, ?)
        `;
        db.query(query, [title, description, created_by, deadline, status || 'Active'], callback);
    }

    static findByUserId(userId, callback) {
        const query = "SELECT * FROM projects WHERE created_by = ? ORDER BY project_id DESC";
        db.query(query, [userId], callback);
    }

    static findById(projectId, callback) {
        const query = "SELECT * FROM projects WHERE project_id = ?";
        db.query(query, [projectId], callback);
    }

    static update(projectId, title, description, deadline, status, callback) {
        const query = `
            UPDATE projects 
            SET title = ?, description = ?, deadline = ?, status = ?
            WHERE project_id = ?
        `;
        db.query(query, [title, description, deadline, status, projectId], callback);
    }

    static delete(projectId, callback) {
        const query = "DELETE FROM projects WHERE project_id = ?";
        db.query(query, [projectId], callback);
    }

    static countByUserId(userId, callback) {
        const query = "SELECT COUNT(*) AS totalProjects FROM projects WHERE created_by = ?";
        db.query(query, [userId], callback);
    }
}

module.exports = Project;