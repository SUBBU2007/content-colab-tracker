const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const db = require("./config/db");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "secret-01",
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

function isAuthenticated(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    next();
}

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.log(err);
      return res.send("Database error");
    }

    if (results.length > 0) {
      // req.session.user = results[0];
      // console.log(results);
      req.session.user = {
        id: results[0].user_id,
        name: results[0].name,
        email: results[0].email,
      };
      //console.log("User after saving:", req.session.user);
      res.redirect("/dashboard");
    } else {
      res.send("Invalid email or password");
    }
  });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      console.log(err);
      res.send("Error inserting user");
    } else {
      res.redirect("/login");
    }
  });
});

app.get("/dashboard",isAuthenticated, (req, res) => {

  const userId = req.session.user.id;

  const totalProjectsQuery =
    "SELECT COUNT(*) AS total FROM projects WHERE created_by = ?";

  db.query(totalProjectsQuery, [userId], (err, projectsResult) => {
    if (err) {
      console.log("Projects Query Error:", err);
      return res.send("Database error");
    }

    const totalTasksQuery =
      "SELECT COUNT(*) AS total FROM tasks WHERE assigned_to = ?";

    db.query(totalTasksQuery, [userId], (err, tasksResult) => {
      if (err) {
        console.log("Tasks Query Error:", err);
        return res.send("Database error");
      }

      const pendingTasksQuery =
        "SELECT COUNT(*) AS total FROM tasks WHERE assigned_to = ? AND status = 'Pending'";

      db.query(pendingTasksQuery, [userId], (err, pendingResult) => {
        if (err) {
          console.log("Pending Query Error:", err);
          return res.send("Database error");
        }

        const completedTasksQuery =
          "SELECT COUNT(*) AS total FROM tasks WHERE assigned_to = ? AND status = 'Completed'";

        db.query(completedTasksQuery, [userId], (err, completedResult) => {
          if (err) {
            console.log("Completed Query Error:", err);
            return res.send("Database error");
          }

          res.render("dashboard", {
            user: req.session.user,
            totalProjects: projectsResult[0].total,
            totalTasks: tasksResult[0].total,
            pendingTasks: pendingResult[0].total,
            completedTasks: completedResult[0].total,
          });
        });
      });
    });
  });
});

app.get("/projects", isAuthenticated,(req, res) => {

  const userId = req.session.user.id;

  const query =
    "SELECT * FROM projects WHERE created_by = ? ORDER BY created_date DESC";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.log(err);
      return res.send("Database error");
    }

    res.render("projects", { projects: results });
  });
});

app.post("/projects/:id/delete", isAuthenticated, (req, res) => {

    const projectId = req.params.id;
    const userId = req.session.user.id;

    const query = `
        DELETE FROM projects 
        WHERE project_id = ? AND created_by = ?
    `;

    db.query(query, [projectId, userId], (err, result) => {

        if (err) return res.send("Error deleting project");

        res.redirect("/projects");
    });
});

app.get("/projects/create", isAuthenticated,(req, res) => {

  res.render("create-project");
});

app.post("/projects/create", isAuthenticated,(req, res) => {
  const { title, description, deadline } = req.body;
  const createdBy = req.session.user.id;

  const query = `
        INSERT INTO projects (title, description, created_by, created_date, deadline, status)
        VALUES (?, ?, ?, CURDATE(), ?, 'Active')
    `;

  if (!title || title.trim() === "") {
    return res.send("Project title is required");
  }

  db.query(query, [title, description, createdBy, deadline], (err, result) => {
    if (err) {
      console.log("Insert Project Error:", err);
      return res.send("Database error");
    }

    res.redirect("/projects");
  });
});

app.get("/projects/:id/edit", isAuthenticated, (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.id;

    const query = `
        SELECT * FROM projects
        WHERE project_id = ? AND created_by = ?
    `;
    db.query(query, [projectId, userId], (err, results) => {

        if (err) return res.send("Database error");

        if (results.length === 0) {
          return res.send("Project not found or unauthorized");
        }

        res.render("edit-project", { project: results[0] });
    });
});

app.post("/projects/:id/edit", isAuthenticated, (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.id;

    const { title, description, deadline, status } = req.body;

    if (!title || title.trim() === "") {
        return res.send("Title is required");
    }

    const query = `
        UPDATE projects
        SET title = ?, description = ?, deadline = ?, status = ?
        WHERE project_id = ? AND created_by = ?
    `;

    db.query(query, 
        [title, description, deadline || null, status, projectId, userId], 
        (err, result) => {
            if (err) return res.send("Update error");
            res.redirect("/projects");
        }
    );
});

app.get("/projects/:id", isAuthenticated, (req, res) => {

    const projectId = req.params.id;
    const userId = req.session.user.id;

    const projectQuery = `
        SELECT * FROM projects
        WHERE project_id = ? AND created_by = ?
    `;

    db.query(projectQuery, [projectId, userId], (err, projectResult) => {

        if (err) {
            console.log(err);
            return res.send("Database error");
        }

        if (projectResult.length === 0) {
            return res.send("Project not found or unauthorized");
        }

        const tasksQuery = `
            SELECT * FROM tasks
            WHERE project_id = ?
            ORDER BY task_id DESC
        `;

        db.query(tasksQuery, [projectId], (err, tasksResult) => {

            if (err) {
                console.log(err);
                return res.send("Task fetch error");
            }

            const totalTasks = tasksResult.length;
            const completedTasks = tasksResult.filter(
                t => t.status === "Completed"
            ).length;

            const progress = totalTasks === 0
                ? 0
                : Math.round((completedTasks / totalTasks) * 100);

            res.render("project-details", {
                project: projectResult[0],
                tasks: tasksResult,
                totalTasks,
                completedTasks,
                progress
            });
        });
    });
});

app.get("/projects/:id/tasks/create", isAuthenticated, (req, res) => {

    const projectId = req.params.id;
    const userId = req.session.user.id;

    const query = `
        SELECT * FROM projects
        WHERE project_id = ? AND created_by = ?
    `;

    db.query(query, [projectId, userId], (err, result) => {

        if (err) return res.send("Database error");

        if (result.length === 0) {
            return res.send("Project not found or unauthorized");
        }

        res.render("create-task", {
            project: result[0]
        });
    });
});

app.post("/projects/:id/tasks/create", isAuthenticated, (req, res) => {

    const projectId = req.params.id;
    const userId = req.session.user.id;

    const { task_title, description, due_date, status } = req.body;

    // First verify project belongs to user
    const checkQuery = `
        SELECT * FROM projects
        WHERE project_id = ? AND created_by = ?
    `;

    db.query(checkQuery, [projectId, userId], (err, result) => {

        if (err) return res.send("Database error");

        if (result.length === 0) {
            return res.send("Unauthorized");
        }

        const insertQuery = `
            INSERT INTO tasks
            (project_id, assigned_to, task_title, description, due_date, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(
            insertQuery,
            [projectId, userId, task_title, description, due_date || null, status],
            (err) => {

                if (err) {
                    console.log(err);
                    return res.send("Insert error");
                }

                res.redirect(`/projects/${projectId}`);
            }
        );
    });
});

app.post("/tasks/:id/toggle", isAuthenticated, (req, res) => {
    const taskId = req.params.id;
    const userId = req.session.user.id;

    // First get the task
    const getQuery = `
        SELECT tasks.*, projects.created_by 
        FROM tasks
        JOIN projects ON tasks.project_id = projects.project_id
        WHERE task_id = ?
    `;

    db.query(getQuery, [taskId], (err, result) => {

        if (err) return res.send("Database error");

        if (result.length === 0) {
            return res.send("Task not found");
        }

        // Ownership check
        if (result[0].created_by !== userId) {
            return res.send("Unauthorized");
        }

        const currentStatus = result[0].status;

        const newStatus = currentStatus === "Completed"
            ? "Pending"
            : "Completed";

        const updateQuery = `
            UPDATE tasks
            SET status = ?
            WHERE task_id = ?
        `;

        db.query(updateQuery, [newStatus, taskId], (err) => {

            if (err) return res.send("Update error");

            res.redirect(`/projects/${result[0].project_id}`);
        });
    });
});

app.get("/tasks/:id/edit", isAuthenticated, (req, res) => {

    const taskId = req.params.id;
    const userId = req.session.user.id;

    const query = `
        SELECT tasks.*, projects.created_by
        FROM tasks
        JOIN projects ON tasks.project_id = projects.project_id
        WHERE task_id = ?
    `;

    db.query(query, [taskId], (err, result) => {

        if (err) return res.send("Database error");

        if (result.length === 0) {
            return res.send("Task not found");
        }

        if (result[0].created_by !== userId) {
            return res.send("Unauthorized");
        }

        res.render("edit-task", { task: result[0] });
    });
});

app.post("/tasks/:id/edit", isAuthenticated, (req, res) => {

    const taskId = req.params.id;
    const { task_title, description, due_date, status } = req.body;

    const updateQuery = `
        UPDATE tasks
        SET task_title = ?, description = ?, due_date = ?, status = ?
        WHERE task_id = ?
    `;

    db.query(updateQuery, [task_title, description, due_date,status, taskId], (err,result) => {

        if (err) return res.send("Update error");

        res.redirect(`/projects`);
    });
});

app.post("/tasks/:id/delete", isAuthenticated, (req, res) => {

    const taskId = req.params.id;
    const userId = req.session.user.id;

    const query = `
        SELECT tasks.project_id, projects.created_by
        FROM tasks
        JOIN projects ON tasks.project_id = projects.project_id
        WHERE tasks.task_id = ?
    `;

    db.query(query, [taskId], (err, result) => {

        if (err) return res.send("Database error");

        if (result.length === 0) {
            return res.send("Task not found");
        }

        if (result[0].created_by !== userId) {
            return res.send("Unauthorized");
        }

        const deleteQuery = `
            DELETE FROM tasks WHERE task_id = ?
        `;

        db.query(deleteQuery, [taskId], (err) => {

            if (err) return res.send("Delete error");

            res.redirect(`/projects/${result[0].project_id}`);
        });
    });
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
