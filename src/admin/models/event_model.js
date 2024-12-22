const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  startDateTime: { type: Date, required: true }, // Start date and time
  endDateTime: { type: Date, required: true },   // End date and time
  location: { type: String, required: true },    // Location of the event
  pictures: [{ type: String }],                  // Array of picture URLs
  videos: [{ type: String }],                    // Array of video URLs
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
