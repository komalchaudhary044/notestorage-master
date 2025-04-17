const express = require("express");
const cors = require("cors");
const Connection = require("./database/ConnectionTOMongo");
const notesRouter=require("./Routes/Note.js")
const shareRouter = require("./Routes/Share");
const taskRoutes = require('./Routes/Task');
const taskNoteRoutes = require('./Routes/TaskNote');
const contactRoutes = require("./Routes/Contact.js");
require("dotenv").config();

const app = express();
// const PORT = process.env.PORT || 5000;



// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// Routes
app.use("/api/auth", require("./Routes/Auth"));


// ✅ Import login routes separately
app.use("/api/auth", require("./Routes/Login"));  // Add this line

app.use("/api/notebooks", require("./Routes/Notebook.js")); 

app.use("/api/trash", require("./Routes/Trash.js"));

app.use('/api/notes', notesRouter);

app.use('/api/tasks', taskRoutes);

app.use("/api/shared", shareRouter);
app.use('/api/task-notes', taskNoteRoutes);
app.use("/api/contact", contactRoutes);
// Connect to MongoDB
Connection();

// Start Server
app.listen(process.env.Port, () => console.log(`Server running on port ${process.env.Port}`));
