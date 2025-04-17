const express = require("express");
const router = express.Router();
const fetchuser = require("../Middleware/Fetchuser");
const Notebook = require("../models/NotebookModel");

router.post("/create", fetchuser, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Notebook name is required" });
    }

    const notebook = new Notebook({
      name,
      userId: req.user.id, // req.user is set by fetchuser middleware
    });

    await notebook.save();

    res.status(201).json({ success: true, notebook });
  } catch (error) {
    console.error("❌ Error creating notebook:", error); // 👈 LOG IT
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// 📥 GET all notebooks for the logged-in user
router.get("/getusernotebooks", fetchuser, async (req, res) => {
  try {
    const notebooks = await Notebook.find({ userId: req.user.id });
    res.status(200).json(notebooks);
  } catch (error) {
    console.error("❌ Error fetching notebooks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/gettrashednotebooks", fetchuser, async (req, res) => {
  try {
    const trashedNotebooks = await Notebook.find({
      userId: req.user.id,
      trashed: true,
    });
    res.json(trashedNotebooks);
  } catch (error) {
    console.error("❌ Error fetching trashed notebooks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
