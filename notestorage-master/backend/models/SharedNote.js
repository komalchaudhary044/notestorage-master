const mongoose = require("mongoose");

const SharedNoteSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  recipientEmail: {
    type: String,
    required: true,
  },
  title: String,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
//jsdjkdsjksdjkfjsdkfjdksjfkdsj 
module.exports = mongoose.model("SharedNote", SharedNoteSchema);
