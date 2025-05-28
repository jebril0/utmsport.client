"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NaveBar.css";

const NaveBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-logo">
          <Link to="/" className="navbar-brand">
            <img src="image/LOGO-UTM.png" alt="UTM Logo" className="navbar-logo-image" />
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
          <li>
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
              login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NaveBar;
