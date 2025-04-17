const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Create Contact model
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Contact = mongoose.model("Contact", contactSchema);

// POST /api/contact
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res.status(201).json({ success: true, message: "Query submitted successfully" });
  } catch (error) {
    console.error("Error saving contact query:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;
