const db = require("../config/database");

class User {
    static create(name, email, password, role, callback) {
        const query = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
        db.query(query, [name, email, password, role || 'member'], callback);
    }

    static findByEmail(email, callback) {
        const query = "SELECT * FROM users WHERE email = ?";
        db.query(query, [email], callback);
    }

    static findById(id, callback) {
        const query = "SELECT * FROM users WHERE user_id = ?";
        db.query(query, [id], callback);
    }
}

module.exports = User;