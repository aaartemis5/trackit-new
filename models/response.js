// models/response.js
const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
  eventName: String,
  eventDate: String,
  deadline: String,
  details: String,
  emailAddress: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Response', ResponseSchema);
