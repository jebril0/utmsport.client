"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getCurrentUser } from "../../api/usersApi"
import { getBookingsByEmail, cancelBooking } from "../../api/bookingsApi"
import { getAllVenuesWithTimeSlots } from "../../api/venuesApi"
import "./StudentDashboard.css"

const StudentDashboard: React.FC = () => {
  const [userName, setUserName] = useState<string>("Student")
  const [userEmail, setUserEmail] = useState<string>("")
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([])
  const [availableVenues, setAvailableVenues] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("pending")

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data = await getCurrentUser()
        if (data && typeof data === "object" && "email" in data && typeof (data as any).email === "string") {
          const email = (data as { email: string }).email
          setUserEmail(email)
          const nameFromEmail = email.split("@")[0]
          setUserName(nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1))
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error)
      }
    }

    fetchUserDetails()
  }, [])

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getBookingsByEmail(userEmail)
        if (Array.isArray(data)) {
          setUpcomingBookings(data)
        } else {
          setUpcomingBookings([])
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error)
      }
    }

    if (userEmail) {
      fetchBookings()
    }
  }, [userEmail])

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const data = await getAllVenuesWithTimeSlots()
        const available = data.map((venue: any) => ({
          name: venue.name,
          available: venue.timeSlots.filter((slot: any) => slot.isAvailable).length,
          total: venue.timeSlots.length,
        }))
        setAvailableVenues(available)
      } catch (error) {
        console.error("Failed to fetch venues:", error)
      }
    }

    fetchVenues()
  }, [])

  const handleCancelBooking = async (booking: any) => {
    const { id: bookingId, timeSlot } = booking
    if (!timeSlot || !timeSlot.venueName || !timeSlot.startTime || !timeSlot.endTime) {
      alert("Failed to retrieve TimeSlot details. Cannot cancel booking.")
      return
    }

    try {
      await cancelBooking(booking.userEmail, timeSlot.venueName, timeSlot.startTime, timeSlot.endTime)
      alert("Booking canceled successfully.")
      setUpcomingBookings((prevBookings) => prevBookings.filter((b) => b.id !== bookingId))
    } catch (error) {
      console.error("Failed to cancel booking:", error)
      alert("Failed to cancel booking. Please try again.")
    }
  }

  // Filter bookings based on status
  const pendingBookings = upcomingBookings.filter((booking) => !booking.isConfirmed)
  const completedBookings = upcomingBookings.filter((booking) => booking.isConfirmed)
  const totalAvailableSlots = availableVenues.reduce((sum, venue) => sum + venue.available, 0)

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <span className="badge badge-success">Approved</span>
    ) : (
      <span className="badge badge-warning">Pending</span>
    )
  }

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1 className="dashboard-title">Welcome back, {userName}</h1>
            <p className="dashboard-subtitle">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="header-actions">
            <Link to="/booking" className="btn btn-primary">
              Book New Facility
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-icon-wrapper stat-icon-pending">
              <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="stat-details">
              <dt className="stat-label">Active Bookings</dt>
              <dd className="stat-value">{pendingBookings.length}</dd>
            </div>
          </div>
          <div className="stat-footer">
            <button className="stat-link" onClick={() => setActiveTab("pending")}>
              View pending bookings
            </button>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-icon-wrapper stat-icon-completed">
              <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="stat-details">
              <dt className="stat-label">Completed Bookings</dt>
              <dd className="stat-value">{completedBookings.length}</dd>
            </div>
          </div>
          <div className="stat-footer">
            <button className="stat-link" onClick={() => setActiveTab("completed")}>
              View completed bookings
            </button>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-icon-wrapper stat-icon-available">
              <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div className="stat-details">
              <dt className="stat-label">Available Slots</dt>
              <dd className="stat-value">{totalAvailableSlots}</dd>
            </div>
          </div>
          <div className="stat-footer">
            <Link to="/booking" className="stat-link">
              Book now
            </Link>
          </div>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="bookings-section">
        <div className="section-header">
          <div className="tab-navigation">
            <button
              className={`tab-button ${activeTab === "pending" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("pending")}
            >
              Active Bookings ({pendingBookings.length})
            </button>
            <button
              className={`tab-button ${activeTab === "completed" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("completed")}
            >
              Completed Bookings ({completedBookings.length})
            </button>
          </div>
        </div>

        <div className="bookings-content">
          {activeTab === "pending" ? (
            <div className="bookings-table-container">
              {pendingBookings.length > 0 ? (
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>Facility</th>
                      <th>Date & Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>
                          <div className="facility-info">
                            <div className="facility-icon">
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            </div>
                            <div className="facility-name">{booking.timeSlot.venueName}</div>
                          </div>
                        </td>
                        <td>
                          <div className="booking-time">
                            <div className="booking-date">
                              {new Date().toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </div>
                            <div className="booking-slot">
                              {booking.timeSlot.startTime} - {booking.timeSlot.endTime}
                            </div>
                          </div>
                        </td>
                        <td>{getStatusBadge(booking.isConfirmed)}</td>
                        <td>
                          <button className="btn btn-danger btn-sm" onClick={() => handleCancelBooking(booking)}>
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3>No active bookings</h3>
                  <p>You don't have any pending bookings at the moment.</p>
                  <Link to="/booking" className="btn btn-primary">
                    Book a Facility
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="bookings-table-container">
              {completedBookings.length > 0 ? (
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>Facility</th>
                      <th>Date & Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>
                          <div className="facility-info">
                            <div className="facility-icon">
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            </div>
                            <div className="facility-name">{booking.timeSlot.venueName}</div>
                          </div>
                        </td>
                        <td>
                          <div className="booking-time">
                            <div className="booking-date">
                              {new Date().toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </div>
                            <div className="booking-slot">
                              {booking.timeSlot.startTime} - {booking.timeSlot.endTime}
                            </div>
                          </div>
                        </td>
                        <td>{getStatusBadge(booking.isConfirmed)}</td>
                        <td>
                          <button className="btn btn-outline btn-sm">View Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3>No completed bookings</h3>
                  <p>You don't have any completed bookings yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Available Venues Section */}
      <div className="venues-section">
        <div className="section-header">
          <h2 className="section-title">Available Venues</h2>
          <Link to="/venues" className="btn btn-outline">
            View All Venues
          </Link>
        </div>

        <div className="venues-grid">
          {availableVenues.map((venue, index) => (
            <div key={index} className="venue-card">
              <div className="venue-header">
                <div className="venue-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="venue-name">{venue.name}</h3>
              </div>
              <div className="venue-availability">
                <div className="availability-bar">
                  <div
                    className="availability-fill"
                    style={{ width: `${(venue.available / venue.total) * 100}%` }}
                  ></div>
                </div>
                <div className="availability-text">
                  {venue.available === 0 ? (
                    <span className="fully-booked">Fully Booked</span>
                  ) : (
                    <span className="available-slots">{venue.available} Available</span>
                  )}
                </div>
                <div className="availability-ratio">
                  {venue.available}/{venue.total} slots available
                </div>
              </div>
              <div className="venue-actions">
                <Link
                  to={`/booking?venue=${encodeURIComponent(venue.name)}`}
                  className="btn btn-primary btn-sm"
                  style={{
                    opacity: venue.available === 0 ? 0.5 : 1,
                    pointerEvents: venue.available === 0 ? "none" : "auto",
                  }}
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Section */}
      <div className="profile-section">
        <div className="section-header">
          <h2 className="section-title">Your Profile</h2>
          <Link to="/profile" className="btn btn-outline">
            Edit Profile
          </Link>
        </div>

        <div className="profile-card">
          <div className="profile-content">
            <div className="profile-avatar">
              <div className="avatar-placeholder">{userName.charAt(0).toUpperCase()}</div>
            </div>
            <div className="profile-info">
              <h3 className="profile-name">{userName}</h3>
              <p className="profile-email">{userEmail}</p>
              <p className="profile-role">Student</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
