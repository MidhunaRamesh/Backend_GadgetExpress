const express = require("express");
const router = express.Router();
const Contact = require("../Models/contactModel"); // Create schema

router.post("/", async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({ message: "Message sent successfully", data: contact });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
