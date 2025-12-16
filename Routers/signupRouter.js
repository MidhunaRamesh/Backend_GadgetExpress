const express = require("express");
const router = express.Router();

const { signupUser } = require("../Controllers/signupController");

// POST /api/signup
router.post("/", signupUser);

module.exports = router;
