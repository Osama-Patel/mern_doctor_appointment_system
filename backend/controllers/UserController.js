const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv=require('dotenv')
const User = require('../models/Users');
const Doctor = require('../models/Doctors');

dotenv.config()


router.get('/',async (req,res)=>{
    const data=await User.find()
    res.send(data)
})

router.get("/doctor", async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate("userId", "name email");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Error fetching doctors", error: err });
  }
});


router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, speciality, experience, fees, availableSlots } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashed, role });

    if (role === "doctor") {
      await Doctor.create({
        userId: newUser._id,
        speciality,
        experience,
        fees,
        availableSlots
      });
    }

    res.status(201).json({ message: `${role} registered successfully` });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
     process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err });
  }
});

module.exports = router;
