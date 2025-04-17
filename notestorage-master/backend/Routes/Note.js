const express = require("express");
const fetchuser = require("../Middleware/Fetchuser");
const nodemailer = require("nodemailer");
const SharedNote=require("../models/SharedNote")
const Note=require("../models/NoteModel")
const router = express.Router();

//Creating the notes 
router.post('/create', fetchuser, async (req, res) => {
      try {
        const { title, description, image, file, notebookId } = req.body;
    
        const note = new Note({
          user: req.user.id,
          title,
          description,
          image,
          file,
          notebookId: notebookId || null
        });
    
        const savedNote = await note.save();
        res.json(savedNote);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
      }
  });
  //geting the notes from the database.
 // GET notes, optionally filter by notebookId
router.get("/", fetchuser, async (req, res) => {
  try {
    const { notebookId } = req.query;

    let query = { user: req.user.id };
    if (notebookId) {
      query.notebookId = notebookId;
    }

    const notes = await Note.find(query).sort({ createdAt: -1 });
    res.json(notes); // ✅ Always send proper JSON
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server Error" }); // ✅ Use JSON instead of res.send()
  }
});


// GET only note titles
router.get('/onlytitles', fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).select('title');
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// GET only files and images
router.get('/onlyfiles', fetchuser, async (req, res) => {
  try {
    const notes = await Note.find(
      { user: req.user.id },
      { file: 1, image: 1 } // Only select file and image fields
    );
    const files = notes
      .map(note => ({
        file: note.file,
        image: note.image
      }))
      .filter(item => item.file || item.image); // Filter notes with actual file or image

    res.json(files);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//Updating the notes in the database,
// PUT route to update a note

// Inside your backend Notes routes (e.g., Notes.js)

router.put('/:id', fetchuser, async (req, res) => {
  const { title, description, image, file, notebookId } = req.body;
  try {
    let note = await Note.findById(req.params.id);  // Find the note by ID
    if (!note) {
      return res.status(404).send("Note not found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Unauthorized");
    }
    const updatedNote = { title, description, image, file, notebookId: notebookId || null };
    const updatedFields = {};
if (title !== undefined) updatedFields.title = title;
if (description !== undefined) updatedFields.description = description;

// Allow clearing image/file by setting empty string or null
updatedFields.image = image === undefined ? note.image : image;
updatedFields.file = file === undefined ? note.file : file;

updatedFields.notebookId = notebookId === undefined ? note.notebookId : notebookId;

    // Perform the update
    note = await Note.findByIdAndUpdate(req.params.id, { $set: updatedNote }, { new: true });

    res.json(note);  // Return updated note

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// Soft delete (move to trash)

router.put('/trash/:id', fetchuser, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).send("Note not found");

    if (note.user.toString() !== req.user.id)
      return res.status(401).send("Unauthorized");

    note.trashed = true;
    await note.save();

    res.json({ success: true, message: "Moved to Trash" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// Permanent delete notes
router.delete('/delete/:id', fetchuser, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).send("Note not found");

    if (note.user.toString() !== req.user.id)
      return res.status(401).send("Unauthorized");

    await Note.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted from database" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//Sharing the email for notes

router.post('/share', fetchuser, async (req, res) => {
  const { email, title, description, createdAt } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sonikumar12345abc@gmail.com",
        pass: "hdys ydee zhsa ekoe",
      },
    });

    const mailOptions = {
      from: "sonikumar12345abc@gmail.com",
      to: email,
      subject: `Shared Note: ${title}`,
      html: `
        <h3>${title}</h3>
        <p>${description}</p>
        <p><small>Created on: ${new Date(createdAt).toLocaleDateString()}</small></p>
      `,
    };

    await transporter.sendMail(mailOptions);


   // 2. Save to MongoDB
    const sharedNote = new SharedNote({
      sender: req.user.id,
      recipientEmail: email,
      title,
      description,
      createdAt,
    });

    await sharedNote.save();

    res.json({ success: true, message: "Email sent and note saved!" });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: "Failed to send email or save note" });
  }
  
});







  module.exports = router;