const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const TaskNote = require("../models/TaskNoteModel");

router.post("/", fetchuser, async (req, res) => {
  try {
    const { taskId, name, content } = req.body;

    const taskNote = new TaskNote({
      taskId,
      userId: req.user.id,
      name,
      content,
    });

    const savedNote = await taskNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error saving task note:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
