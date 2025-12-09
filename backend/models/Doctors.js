const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  speciality: String,
  experience: Number,
  fees: Number,
  availableSlots: [String]
}, { timestamps: true });

module.exports = mongoose.model("Doctor", doctorSchema);
