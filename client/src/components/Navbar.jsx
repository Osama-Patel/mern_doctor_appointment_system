import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { role, logout, token } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = () => {
    logout();
    navigate("/");
  };

  if (!token) return null;

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <Link className="navbar-brand text-danger" to="/">DoctorApp</Link>
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
            <button type="button" className="btn btn-outline-light btn-sm ms-2" onClick={() => setShowLogoutModal(true)}>
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {showLogoutModal && (
        <>
          <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true" aria-labelledby="logout-modal-title">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="logout-modal-title">Log out?</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowLogoutModal(false)} />
                </div>
                <div className="modal-body">
                  <p className="mb-0">Are you sure you want to logout?</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowLogoutModal(false)}>No</button>
                  <button type="button" className="btn btn-danger" onClick={confirmLogout}>Yes</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show" />
        </>
      )}
    </>
  );
}
