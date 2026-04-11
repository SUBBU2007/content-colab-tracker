CREATE DATABASE collab_tracker;
USE collab_tracker;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'member') DEFAULT 'member'
);

CREATE TABLE projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    created_by INT,
    created_date DATE,
    deadline DATE,
    status ENUM('Active', 'Completed') DEFAULT 'Active',
    FOREIGN KEY (created_by) REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE project_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    user_id INT,
    role_in_project VARCHAR(50),
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
        ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    assigned_to INT,
    task_title VARCHAR(150),
    description TEXT,
    due_date DATE,
    status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
        ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(user_id)
        ON DELETE SET NULL
);

SELECT * FROM users;
SELECT * FROM projects;
SELECT * FROM tasks;