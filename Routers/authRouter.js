const express = require("express");
const router = express.Router();
const { loginUser } = require("../Controllers/userController");

// POST /api/auth/login
router.post("/login", loginUser);

module.exports = router;