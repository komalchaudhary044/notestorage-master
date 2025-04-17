// routes/tasks.js
const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Task = require("../models/TaskModel");

router.post("/", fetchuser, async (req, res) => {
    try {
      const { name, description, dueDate } = req.body;
  
      const newTask = new Task({
        userId: req.user.id,
        name,
        description,
        dueDate,
      });
  
      const savedTask = await newTask.save();
      res.status(201).json(savedTask); // ✅ Send valid JSON
  
    } catch (error) {
      console.error("❌ Error creating task:", error);
      res.status(500).json({ error: "Server Error" }); // ✅ Always JSON
    }
  });

  router.get("/", fetchuser, async (req, res) => {
    try {
      const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
      res.status(200).json(tasks); // ✅ Send valid JSON
    } catch (error) {
      console.error("❌ Error fetching tasks:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;
