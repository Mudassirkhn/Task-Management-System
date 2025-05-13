const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserDB" },  // Correct reference
  taskName: { type: String, required: true },
  taskDesc: { type: String },
  status: {
    type: String,
    enum: ["Progress", "Completed", "Pending", "Cancel", "New Task"],
    default: "New Task",
  },
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model("Tasks", TaskSchema);

module.exports = Task;
