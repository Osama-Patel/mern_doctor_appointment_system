import React, { useState, useEffect } from "react";
import axios from "axios";

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({});
  const [alert, setAlert] = useState({ show: false, msg: "", type: "success" });

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    axios.get("http://localhost:3000/user/doctor").then((res) => setDoctors(res.data));
  }, []);

  const handleDoctorChange = async (e) => {
    const doctorId = e.target.value;
    setForm({ ...form, doctorId });
    const res = await axios.get(`http://localhost:3000/doctors/${doctorId}/slots`);
    setSlots(res.data.availableSlots);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/appointments", form, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      showAlert(res.data.message, "success");
    } catch (err) {
      showAlert(err.response?.data?.message || "Booking failed", "danger");
    }
  };

  const showAlert = (msg, type) => {
    setAlert({ show: true, msg, type });
    setTimeout(() => setAlert({ show: false, msg: "", type }), 3000);
  };

  return (
    <div className="container mt-4">
      <h3>Book Appointment</h3>

      {alert.show && (
        <div
          className={`alert alert-${alert.type} position-fixed top-0 start-50 translate-middle-x text-center shadow`}
          style={{
            minWidth: "350px",
            marginTop: "15px",
            zIndex: 9999,
          }}
        >
          {alert.msg}
          <div className={`progress mt-2`} style={{ height: "4px" }}>
            <div
              className={`progress-bar bg-${alert.type}`}
              style={{
                width: "100%",
                animation: "progressFade 3s linear forwards",
              }}
            ></div>
          </div>
        </div>
      )}

      <style>
        {`
        @keyframes progressFade {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}
      </style>

      <form onSubmit={handleSubmit}>
        <label>Date:</label>
        <input
          type="date"
          min={today}
          className="form-control mb-3"
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
        <label>Doctor:</label>
        <select className="form-control mb-3" onChange={handleDoctorChange} required>
          <option value="">Select Doctor</option>
          {doctors.map((d) => (
            <option key={d._id} value={d._id}>
              {d.userId?.name
                ? `${d.userId.name} — ${d.speciality} (₹${d.fees})`
                : `${d.speciality} (₹${d.fees})`}
            </option>
          ))}
        </select>
        <label>Available Slots:</label>
        <select
          className="form-control mb-3"
          onChange={(e) => setForm({ ...form, slot: e.target.value })}
          required
        >
          <option value="">Select Slot</option>
          {slots.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button className="btn btn-primary w-100">Book Appointment</button>
      </form>
    </div>
  );
}