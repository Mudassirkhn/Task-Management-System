// Routes/myProfileRoutes.js
const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../Controller/userController");
const authenticate = require("../middleware/userMiddleware");

// Route to get profile
router.get("/profile", authenticate, getProfile);

// Route to update profile
router.put("/profile", authenticate, updateProfile);

module.exports = router; // Exporting the router
