"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../../api/usersApi";
import "./NaveBar.css";

const NaveBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        setIsAuthenticated(true);
        // Type guard to ensure user has a 'role' property
        if (user && typeof user === "object" && "role" in user) {
          setUserRole((user as { role: string }).role);
        } else {
          setUserRole(null);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
        setUserRole(null);
      });
  }, [location]);

  const handleLogout = async () => {
    await logoutUser();
    setIsAuthenticated(false);
    setUserRole(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-logo">
          <Link to="/" className="navbar-brand">
            <img
              src="image/LOGO-UTM.png"
              alt="UTM Logo"
              className="navbar-logo-image"
            />
            <span className="brand-text">Sports Facility</span>
          </Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="menu-toggle" onClick={toggleMenu}>
          <div className={`hamburger ${isMenuOpen ? "active" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {/* Navigation Links */}
        <ul className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
          <li>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/booking" onClick={() => setIsMenuOpen(false)}>
              Booking
            </Link>
          </li>
          <li>
            <Link to="/StudentDashboard" onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </Link>
          </li>
          {userRole === "staff" && (
            <li>
              <Link to="/StaffDashboard" onClick={() => setIsMenuOpen(false)}>
                Staff Page
              </Link>
            </li>
          )}
          {userRole === "admin" && (
            <li>
              <Link to="/Admin" onClick={() => setIsMenuOpen(false)}>
                Admin Page
              </Link>
            </li>
          )}
          {isAuthenticated && (
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NaveBar;
