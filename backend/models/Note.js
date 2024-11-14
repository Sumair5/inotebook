const { type } = require('@testing-library/user-event/dist/type');
const mongoose = require('mongoose');
const user = require('./User');
const { Schema } = mongoose;

// Define the Note schema
const NoteSchema = new Schema({
user:{
type: mongoose.Schema.Types.ObjectId,
ref:'User'
},

  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default: "General",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Export the model
module.exports = mongoose.model('Note', NoteSchema);
