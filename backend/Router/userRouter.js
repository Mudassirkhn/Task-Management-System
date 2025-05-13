const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  updateProfile,
  getProfile,
  updatePassword,
} = require("../Controller/userController"); // Ensure the path is correct

const verifyToken = require("../middleware/userMiddleware"); // Ensure auth middleware is implemented correctly

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected routes
router.get("/me", verifyToken, getProfile); // Gets the current user's profile
router.put("/profile", verifyToken, updateProfile); // Updates user profile

// Password update route (protected)
router.put("/password", verifyToken, updatePassword); // Handles password update

module.exports = router;
