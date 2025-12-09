import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const load = async () => {
     const res = await axios.get("http://localhost:3000/appointments", {
  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
});
      setAppointments(res.data);
    };
    load();
  }, []);

  return (
    
    <div className="container mt-4">
      <br />
      <center>
      <h3>My Appointments</h3>
      </center>
      <br />
      {appointments.length==0?<><h3>No Data</h3></>:<>
      <table className="table">
        <thead>
          <tr><th>Doctor</th><th>Date</th><th>Slot</th><th>Status</th></tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a._id}>
              <td>{a.doctorId.userId.name}-{a.doctorId?.speciality}</td>
              <td>{new Date(a.date).toLocaleDateString('en-IN')}</td>
              <td>{a.slot}</td>
              <td>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </>
      }
    </div>
  );
}
