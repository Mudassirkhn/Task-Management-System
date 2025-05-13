require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
require("./Models/DBConnection"); // Connect to database

const app = express();

// Import routes
const userApi = require("./Router/userRouter");
const taskApi = require("./Router/taskRouter");
const myProfileRoutes = require("./Router/myProfileRoutes");

// Middleware
app.use(express.json());
app.use(cors());

// Mount routes
app.use("/api/user", userApi); // ✅ user signup/login/protected
app.use("/api", taskApi); // ✅ for task-related routes
app.use("/api/user", myProfileRoutes); // ✅ profile-related routes

// Start server
const PORT = process.env.PORT || 4000;
app
  .listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  })
  .on("error", (err) => {
    console.error("Error starting server:", err);
  });
