const express = require("express");
const router = express.Router();
const fetchuser = require("../Middleware/Fetchuser");
const SharedNote = require("../models/SharedNote");

// Get all shared notes for a user
router.get("/shared", fetchuser, async (req, res) => {
    try {
      const sharedNotes = await SharedNote.find({ sender: req.user.id }).sort({ createdAt: -1 });
      res.json(sharedNotes);
    } catch (err) {
      console.error("Error fetching shared notes:", err.message);
      res.status(500).json({ error: "Server error while fetching shared notes" });
    }
  });
  

module.exports = router;
