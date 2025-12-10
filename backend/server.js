const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv=require('dotenv')
const UserRoutes=require('./controllers/UserController')
const AppointmentRoutes=require('./controllers/AppointmentController')
const DoctorRoutes=require('./controllers/DoctorController')

dotenv.config()
const app = express();

app.use(cors());
app.use(express.json());
app.use('/user',UserRoutes)
app.use('/appointments',AppointmentRoutes)
app.use('/doctors',DoctorRoutes)

mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const PORT=process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
