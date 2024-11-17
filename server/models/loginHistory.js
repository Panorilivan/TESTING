const mongoose = require("mongoose");

const loginHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // Defaults to the current date
    required: true,
  },
  timeIn: {
    type: String, // Store time in as a string (e.g., "10:00 AM")
    required: true,
  },
  timeOut: {
    type: String, // Store time out as a string (e.g., "5:00 PM")
    required: false, // Optional for users still logged in
  },
  totalVisitHours: {
    type: String, // Store total visit duration as a string (e.g., "7 hours")
    required: false, // Calculated after the user logs out
  },
});

module.exports = mongoose.model("loginhistories", loginHistorySchema);
