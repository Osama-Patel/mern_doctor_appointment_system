const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Appointment = require('../models/Appointments');
const Doctor = require('../models/Doctors');
const dotenv=require('dotenv')

dotenv.config()

function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;
   
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

function doctorMiddleware(req, res, next) {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ message: "Access denied — Doctors only 🚫" });
  }
  next();
}

function patientMiddleware(req, res, next) {
  if (req.user.role !== "patient") {
    return res.status(403).json({ message: "Access denied — Patients only 🚫" });
  }
  next();
}

router.post('/', authMiddleware, patientMiddleware, async (req, res) => {
  try {
    const { doctorId, date, slot } = req.body;

    // Normalize the date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Check if slot already booked for this date
    const existing = await Appointment.findOne({
      doctorId,
      date: { $gte: startOfDay, $lt: endOfDay },
      slot
    });

    if (existing) {
      return res.json({ message: "Slot already booked for this date!" });
    }

    // Create appointment
    const newApp = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      date: startOfDay,
      slot
    });

    res.status(201).json({ message: "Appointment booked successfully", appointment: newApp });
  } catch (err) {
    res.status(500).json({ message: "Error booking appointment", error: err.message });
  }
});


router.get('/', authMiddleware, async (req, res) => {
  try {
    let data;
    if (req.user.role === "doctor") {
      const doctor = await Doctor.findOne({ userId: req.user.id });
      data = await Appointment.find({ doctorId: doctor._id })
        .populate("patientId", "name email");
    } else {
       data = await Appointment.find({ patientId: req.user.id })
        .populate({
          path: "doctorId",
          populate: { path: "userId", select: "name email" }, 
          select: "speciality fees userId"
        });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching appointments", error: err });
  }
});



router.put('/:id/status', authMiddleware, doctorMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!updated) return res.status(404).json({ message: "Appointment not found" });
    res.json({ message: "Status updated", appointment: updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating status", error: err });
  }
});

module.exports = router;
