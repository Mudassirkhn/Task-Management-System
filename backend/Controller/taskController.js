const Task = require("../Models/taskSchema");

// Create Task
exports.createTask = async (req, res) => {
  try {
    // console.log("its check");
    const { taskName, taskDesc } = req.body;
    // console.log(req.body);
    const userId = req.user._id; // Getting user ID from the JWT token
    // console.log(req.body);
    const newTask = new Task({ taskName, taskDesc, userId });
    await newTask.save();

    res.status(201).json({ message: "Task Created Successfully", newTask });
  } catch (error) {
    console.error("Task creation error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all tasks for the logged-in user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete task by ID
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Task delete error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update task details
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { taskName, taskDesc, status } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { taskName, taskDesc, status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task Updated Successfully", updatedTask });
  } catch (error) {
    console.error("Task update error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update only task status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task Status Updated", updatedTask });
  } catch (error) {
    console.error("Status update error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
