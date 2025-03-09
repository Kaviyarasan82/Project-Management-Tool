const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true }, // Add username
  history: [{ type: String, default: [] }], // Store action history
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);