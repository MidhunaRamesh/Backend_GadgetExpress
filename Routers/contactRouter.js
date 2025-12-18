const express = require("express");
const router = express.Router();
const { createContact, getAllContacts, deleteContact } = require("../Controllers/contactController");

// POST /api/contact - Create contact
router.post("/", createContact);

// GET /api/contact - Get all contacts (Admin)
router.get("/", getAllContacts);

// DELETE /api/contact/:id - Delete contact (Admin)
router.delete("/:id", deleteContact);

module.exports = router;
