

import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./StudentDashboard.css"
import { Calendar, Clock, MapPin, Plus, ChevronRight, Bell, User, LogOut, CheckCircle } from 'lucide-react'

// Mock data for upcoming bookings
const upcomingBookings = [
  {
    id: 1,
    facility: "Basketball Court",
    date: "2023-11-15",
    time: "14:00 - 16:00",
    location: "Sports Complex",
    status: "confirmed"
  },
  {
    id: 2,
    facility: "Tennis Court",
    date: "2023-11-18",
    time: "10:00 - 12:00",
    location: "East Campus",
    status: "pending"
  }
]

// Mock data for notifications
const notifications = [
  {
    id: 1,
    message: "Your booking for Basketball Court has been confirmed",
    time: "2 hours ago",
    read: false
  },
  {
    id: 2,
    message: "Maintenance scheduled for Swimming Pool on Nov 20",
    time: "1 day ago",
    read: true
  },
  {
    id: 3,
    message: "New badminton courts now available for booking",
    time: "3 days ago",
    read: true
  }
]

// Mock data for facility availability
const facilityAvailability = [
  { name: "Basketball Courts", available: 3, total: 4 },
  { name: "Tennis Courts", available: 2, total: 6 },
  { name: "Football Fields", available: 1, total: 2 },
  { name: "Swimming Lanes", available: 0, total: 8 }
]

const StudentDashboard: React.FC = () => {
  const [userName, setUserName] = useState("Ahmad")
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(1)

  // Get current date in a readable format
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  })

  // Mark all notifications as read
  const markAllAsRead = () => {
    setUnreadNotifications(0)
  }

  return (
    <div className="dashboard-container">
      {/* Header with user info and notifications */}
      <header className="dashboard-header">
        <div className="user-welcome">
          <h1>
            Welcome back, <span className="user-name">{userName}</span>
          </h1>
          <p className="current-date">{currentDate}</p>
        </div>
        <div className="header-actions">
          <div className="notification-wrapper">
            <button
              className="notification-button"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadNotifications > 0 && <span className="notification-badge">{unreadNotifications}</span>}
            </button>
            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h3>Notifications</h3>
                  {unreadNotifications > 0 && (
                    <button className="mark-read-button" onClick={markAllAsRead}>
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="notifications-list">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`notification-item ${!notification.read ? "unread" : ""}`}>
                      <p>{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                  ))}
                </div>
                <Link to="/notifications" className="view-all-link">
                  View all notifications
                </Link>
              </div>
            )}
          </div>
          <div className="user-menu">
            <Link to="/profile" className="profile-link">
              <User size={20} />
              <span>Profile</span>
            </Link>
            <Link to="/logout" className="logout-link">
              <LogOut size={20} />
              <span>Logout</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main dashboard content */}
      <div className="dashboard-content">
        {/* Quick actions section */}
        <section className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            <Link to="/booking/new" className="quick-action-card">
              <div className="quick-action-icon">
                <Plus />
              </div>
              <h3>New Booking</h3>
              <p>Book a sports facility</p>
            </Link>
            <Link to="/bookings" className="quick-action-card">
              <div className="quick-action-icon">
                <Calendar />
              </div>
              <h3>My Bookings</h3>
              <p>View all your bookings</p>
            </Link>
            <Link to="/facilities" className="quick-action-card">
              <div className="quick-action-icon">
                <MapPin />
              </div>
              <h3>Facilities</h3>
              <p>Browse available facilities</p>
            </Link>
            <Link to="/help" className="quick-action-card">
              <div className="quick-action-icon">
                <Bell />
              </div>
              <h3>Support</h3>
              <p>Get help with bookings</p>
            </Link>
          </div>
        </section>

        {/* Dashboard grid layout for main content */}
        <div className="dashboard-grid">
          {/* Upcoming bookings section */}
          <section className="upcoming-bookings-section">
            <div className="section-header">
              <h2>Upcoming Bookings</h2>
              <Link to="/bookings" className="view-all">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            {upcomingBookings.length > 0 ? (
              <div className="bookings-list">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-header">
                      <h3>{booking.facility}</h3>
                      <span className={`booking-status ${booking.status}`}>
                        {booking.status === "confirmed" && <CheckCircle size={16} />}
                        {booking.status}
                      </span>
                    </div>
                    <div className="booking-details">
                      <div className="booking-detail">
                        <Calendar size={16} />
                        <span>{booking.date}</span>
                      </div>
                      <div className="booking-detail">
                        <Clock size={16} />
                        <span>{booking.time}</span>
                      </div>
                      <div className="booking-detail">
                        <MapPin size={16} />
                        <span>{booking.location}</span>
                      </div>
                    </div>
                    <div className="booking-actions">
                      <Link to={`/bookings/${booking.id}`} className="booking-action-button">
                        View Details
                      </Link>
                      <button className="booking-action-button secondary">Cancel</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>You don't have any upcoming bookings.</p>
                <Link to="/booking/new" className="primary-button">
                  Book Now
                </Link>
              </div>
            )}
          </section>

          {/* Facility availability section */}
          <section className="facility-availability-section">
            <div className="section-header">
              <h2>Facility Availability</h2>
              <Link to="/facilities" className="view-all">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="availability-list">
              {facilityAvailability.map((facility, index) => (
                <div key={index} className="availability-item">
                  <div className="facility-info">
                    <h3>{facility.name}</h3>
                    <span
                      className={`availability-status ${
                        facility.available === 0 ? "unavailable" : "available"
                      }`}
                    >
                      {facility.available === 0
                        ? "Fully Booked"
                        : `${facility.available} Available`}
                    </span>
                  </div>
                  <div className="availability-bar">
                    <div
                      className="availability-progress"
                      style={{
                        width: `${((facility.total - facility.available) / facility.total) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="availability-numbers">
                    <span>
                      {facility.available}/{facility.total} available
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
