const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  teamSize: { type: Number, required: true },
  files: [
    {
      name: { type: String, required: true },
      type: { type: String, required: true },
      size: { type: Number, required: true },
      path: { type: String, required: true },
      _id: false, // Prevent _id generation for each file object
    },
  ],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  joinCode: { type: String, required: true, unique: true },
  tasks: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      assignedTo: { type: String, required: true },
      status: { type: String, default: 'pending' },
      dueDate: Date,
      _id: false, // Prevent _id generation for each task object
    },
  ],
});

module.exports = mongoose.model('Project', projectSchema);