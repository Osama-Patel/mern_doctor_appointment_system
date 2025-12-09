const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctors');

router.put('/:userId', async (req, res) => {
  try {
    const { speciality, experience, fees, availableSlots } = req.body;
    const updated = await Doctor.findOneAndUpdate(
      { userId: req.params.userId },
      { speciality, experience, fees, availableSlots },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Doctor not found" });
    res.json({ message: "Doctor profile updated", doctor: updated });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err });
  }
});

router.get('/:id/slots', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    res.json({ availableSlots: doctor.availableSlots });
  } catch (err) {
    res.status(500).json({ message: "Error fetching slots", error: err });
  }
});

module.exports = router;
