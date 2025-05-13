const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  deleteTask,
  updateTask,
  updateTaskStatus,
} = require("../Controller/taskController");
const verifyToken = require("../middleware/userMiddleware"); // Token verification middleware

// Route to create a new task
router.post("/task", verifyToken, createTask);

// Route to get all tasks of the logged-in user
router.get("/tasks", verifyToken, getTasks);

// Route to delete a task by ID
router.delete("/task/:id", verifyToken, deleteTask);

// Route to update a task by ID
router.put("/task/:id", verifyToken, updateTask);

// Route to update only task status by ID
router.patch("/task/:id/status", verifyToken, updateTaskStatus);

module.exports = router;
