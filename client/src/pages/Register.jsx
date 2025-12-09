import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("patient");
  const [form, setForm] = useState({});
  const [slots, setSlots] = useState([]);
  
  
  const allSlots = [
    "09:00 - 09:30", "09:30 - 10:00", "10:00 - 10:30",
    "10:30 - 11:00", "11:00 - 11:30", "02:00 - 02:30",
    "02:30 - 03:00", "03:00 - 03:30", "03:30 - 04:00"
  ];

  const toggleSlot = (slot) => {
    setSlots((prev) => prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, role, availableSlots: slots };
    await axios.post("http://localhost:3000/user/register", data);
    alert("Registration successfully");
    navigate("/");
  };

  return (
    <div className="container mt-4">
      <h3>Register</h3>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="form-control mb-2" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="form-control mb-2" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <select className="form-control mb-3" onChange={(e) => setRole(e.target.value)}>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>

        {role === "doctor" && (
          <>
            <input className="form-control mb-2" placeholder="Speciality" onChange={(e) => setForm({ ...form, speciality: e.target.value })} />
            <input className="form-control mb-2" placeholder="Experience (years)" onChange={(e) => setForm({ ...form, experience: e.target.value })} />
            <input className="form-control mb-2" placeholder="Fees (₹)" onChange={(e) => setForm({ ...form, fees: e.target.value })} />
            <label><b>Available Slots:</b></label>
            <div className="mb-3">
              {allSlots.map((s) => (
                <div key={s}><input type="checkbox" onChange={() => toggleSlot(s)} /> {s}</div>
              ))}
            </div>
          </> 
        )}
        <button className="btn btn-primary w-100">Register</button>
      </form>
      <p className="mt-2 text-center">Already Logged in? <Link to="/">Login</Link></p>

    </div>
  );
}
