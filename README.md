# Content Collaboration Tracker

A database-driven web application for managing collaborative projects, tasks, and team members efficiently.

### Problem Description

In academic and creative environments, students often collaborate on projects such as:
- YouTube video editing
- Coding projects and hackathons
- Mini assignments
- Event media work

However, tracking team members, assigned tasks, deadlines, and progress becomes difficult without a structured system. The **Content Collaboration Tracker** provides a database-driven solution to manage collaborative projects efficiently.

---

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling
- **Bootstrap 5** - Responsive UI framework
- **EJS** - Template engine

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework

### Database
- **MySQL** - Relational database management system

---

## 📊 Database Schema

### Tables

#### 1. **users**
```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'member') DEFAULT 'member',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. **projects**
```sql
CREATE TABLE projects (
    project_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    created_by INT NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deadline DATE,
    status ENUM('Active', 'Completed', 'Planning', 'On Hold') DEFAULT 'Active',
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE
);
```

#### 3. **project_members**
```sql
CREATE TABLE project_members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    role_in_project VARCHAR(50),
    joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

#### 4. **tasks**
```sql
CREATE TABLE tasks (
    task_id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    task_title VARCHAR(200) NOT NULL,
    description TEXT,
    assigned_to INT,
    due_date DATE,
    status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(user_id) ON DELETE SET NULL
);
```

### Relationships
- **Users → Projects**: One-to-Many (One user can create many projects)
- **Users ↔ Projects**: Many-to-Many via `project_members` (Users can be members of multiple projects)
- **Projects → Tasks**: One-to-Many (One project can have many tasks)
- **Users → Tasks**: One-to-Many (One user can be assigned many tasks)

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm (comes with Node.js)

### Step 1: Clone Repository
```bash
git clone https://github.com/SUBBU2007/content-colab-tracker.git
cd content-colab-tracker
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup Database

1. Open MySQL and create database:
```sql
CREATE DATABASE content_collaboration_tracker;
USE content_collaboration_tracker;
```

2. Run the SQL schema (copy all CREATE TABLE statements from above)

3. Insert sample data (optional):
```sql
INSERT INTO users (name, email, password, role) 
VALUES 
('Admin User', 'admin@example.com', 'admin123', 'admin'),
('John Doe', 'john@example.com', 'password123', 'member');
```

### Step 4: Configure Database Connection

Edit `config/database.js`:
```javascript
const db = mysql.createConnection({
    host: "localhost",
    user: "root",           // Your MySQL username
    password: "",           // Your MySQL password
    database: "content_collaboration_tracker"
});
```

### Step 5: Start Server
```bash
node server.js
```

Server will run on: `http://localhost:3000`

---

## 🤝 Contributing

This is an academic project for DBMS coursework.

---

## 📄 License

Educational project - VIT-AP University

---

## 👨‍💻 Author

**G.V.SUBBA RAO**  
Course: SWE2006 - Database Systems  
Institution: VIT-AP University
