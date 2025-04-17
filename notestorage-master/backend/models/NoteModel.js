const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notebookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notebook',
    default: null
  },
  title: String,
  description: String,  // rich text HTML
  image: String,        // Base64 string or file URL
  file: String,         // Base64 string or file URL
  trashed: {
    type: Boolean,
    default: false       // 👈 This enables soft delete
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Note', NoteSchema);
