const mongoose = require("mongoose");

const notebookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // or whatever your user model is named
    required: true,
  },
  trashed: {
  type: Boolean,
  default: false,
},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notebook", notebookSchema);
