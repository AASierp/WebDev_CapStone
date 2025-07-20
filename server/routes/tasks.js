import express from "express";
import db from "../db/db.js";
import { requireLogin } from "./auth.js";

//creates the router
const router = express.Router();

//handles get requests from the front end /tasks
router.get("/tasks", requireLogin, async (req, res) => {
  try {
    //stores a statement in variable to avoid explicitly declaring sensitive information.
    const prepared = db.prepare("SELECT * FROM tasks WHERE userId = ?");
    //we pass said information, the userId in this case, as a param to the statement.
    const getTask = prepared.all(req.session.userId);
    res.json(getTask);
  } catch (error) {
    res.status(500).json("server error");
  }
});

router.post("/tasks", requireLogin, (req, res) => {
  const { title, description = "", status = "backlog" } = req.body;
  if (!title) {
    return res.status(400).json("Title is a required field");
  }

  try {
    const prepared = db.prepare(
      "INSERT INTO tasks (userId, title, description, status) VALUES(?, ?, ?, ?)"
    );
    const task = prepared.run(req.session.userId, title, description, status);
    res.status(201).json({ id: task.lastInsertRowid, title, status });
  } catch (error) {
    console.log(error);
    res.status(500).json("server unreachable");
  }
});

router.put("/tasks/:id", requireLogin, (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    const prepared = db.prepare(
      "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND userId = ?"
    );
    const update = prepared.run(
      title,
      description,
      status,
      id,
      req.session.userId
    );

    if (update.changes === 0) {
      return res.status(400).json("Task not found");
    }

    res.json("Task updated");
  } catch (error) {
    console.error(error);
    res.status(500).json("server unreachable");
  }
});

router.delete("/tasks/:id", requireLogin, (req, res) => {
  const { id } = req.params;

  try {
    const prepared = db.prepare(
      "DELETE FROM tasks WHERE id = ? AND userId = ?"
    );

    const deleted = prepared.run(id, req.session.userId);

    if (deleted.changes === 0) {
      return res.status(400).json("Task not found");
    }
    res.json("task deleted");
  } catch (error) {
    console.error(error);
    res.status(500).json("server unreachable");
  }
});

export default router;
