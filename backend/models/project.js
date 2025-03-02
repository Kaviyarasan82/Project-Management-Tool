const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  teamSize: { type: Number, required: true },
  files: [
    {
      name: { type: String, required: true },
      size: { type: Number, required: true },
      type: { type: String, required: true },
      path: { type: String, required: true }, // Store file path after upload
    },
  ],
  joinCode: { type: String, unique: true, required: true }, // Unique join code for each project
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Project', ProjectSchema);