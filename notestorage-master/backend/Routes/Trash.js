const express = require("express");
const router = express.Router();
const fetchuser = require("../Middleware/Fetchuser");
const Notebook = require("../models/NotebookModel");

// Soft delete (trash) notebook
// Permanently delete trashed notebook


// Soft delete (move notebook to trash)
router.put("/trash/:id", fetchuser, async (req, res) => {
  try {
    const notebook = await Notebook.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { trashed: true },
      { new: true }
    );

    if (!notebook) {
      return res.status(404).json({ error: "Notebook not found or not authorized" });
    }

    res.json(notebook); // ✅ Always return JSON
  } catch (err) {
    console.error("Error trashing notebook:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.delete("/delete/:id", fetchuser, async (req, res) => {
    try {
      const notebook = await Notebook.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id,
        trashed: true,
      });
  
      if (!notebook) {
        return res.status(404).json({ error: "Notebook not found or not authorized" });
      }
  
      res.json({ message: "Notebook permanently deleted" });
    } catch (err) {
      console.error("Error deleting notebook permanently:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });



  
module.exports = router;
