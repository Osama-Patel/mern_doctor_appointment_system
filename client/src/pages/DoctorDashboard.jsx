import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);

  const load = async () => {
    try {
      const res = await axios.get("http://localhost:3000/appointments", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error("Error loading appointments:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to load appointments");
    }
  };

  const handleStatus = async (id, status) => {
    const confirmMsg =
      status === "Approved"
        ? "Are you sure you want to APPROVE this appointment?"
        : "Are you sure you want to REJECT this appointment?";

    const confirmed = window.confirm(confirmMsg);

    if (!confirmed) return;

    try {
      const res = await axios.put(
        `http://localhost:3000/appointments/${id}/status`,
        { status },
        { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
      );
      alert(res.data.message || "Status updated");
      load();
    } catch (err) {
      console.error("Error updating status:",err.message);
      alert("Failed to update status");
    }
  };


  useEffect(() => {
    load();
  }, []);


  return (
    <div className="container mt-4">
      <h3>Doctor Dashboard</h3>
      <table className="table table-striped">
        <thead className="table-dark">
          <tr>
            <th>Patient</th>
            <th>Date</th>
            <th>Slot</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length > 0 ? (
            appointments.map((a) => (
              <tr key={a._id}>
                <td>{a.patientId?.name}</td>
                <td>{new Date(a.date).toLocaleDateString()}</td>
                <td>{a.slot}</td>
                <td>{a.status}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => handleStatus(a._id, "Approved")}
                    disabled={a.status !== "Pending"}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleStatus(a._id, "Rejected")}
                    disabled={a.status !== "Pending"}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                No appointments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
