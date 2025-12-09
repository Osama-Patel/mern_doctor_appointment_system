import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { role, logout, token } = useAuth();
  const navigate = useNavigate();

  if (!token) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">DoctorApp</Link>
      <ul className="navbar-nav ms-auto">
        {role === "doctor" && (
          <li className="nav-item">
            <Link className="nav-link" to="/doctor">Dashboard</Link>
          </li>
        )}
        {role === "patient" && (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/patient">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/book">Book</Link>
            </li>
          </>
        )}
        <li className="nav-item">
          <button className="btn btn-outline-light btn-sm ms-2" onClick={() => { logout(); navigate("/"); }}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
