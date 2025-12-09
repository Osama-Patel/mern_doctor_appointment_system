const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserRoutes=require('./controllers/UserController')
const AppointmentRoutes=require('./controllers/AppointmentController')
const DoctorRoutes=require('./controllers/DoctorController')

const app = express();

app.use(cors());
app.use(express.json());
app.use('/user',UserRoutes)
app.use('/appointments',AppointmentRoutes)
app.use('/doctors',DoctorRoutes)

mongoose.connect('mongodb://localhost:27017/doctor_appointment_db').then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.listen(3000, () => console.log(`Server running on port no.3000`));
