"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Calendar, MapPin, User, Mail, UserCircle, Plus, X, CheckCircle, AlertCircle } from "lucide-react"
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
  const [loading, setLoading] = useState(true)
  const [currentVenuePage, setCurrentVenuePage] = useState(1)
  const venuesPerPage = 3

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
        setLoading(true)
        const data = await getAllVenuesWithTimeSlots()
        const available = data.map((venue: any) => ({
          name: venue.name,
          available: venue.timeSlots.filter((slot: any) => slot.isAvailable).length,
          total: venue.timeSlots.length,
        }))
        setAvailableVenues(available)
      } catch (error) {
        console.error("Failed to fetch venues:", error)
      } finally {
        setLoading(false)
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

  const pendingBookings = upcomingBookings.filter((booking) => !booking.isConfirmed)
  const completedBookings = upcomingBookings.filter((booking) => booking.isConfirmed)
  const totalAvailableSlots = availableVenues.reduce((sum, venue) => sum + venue.available, 0)

  const getStatusBadge = (status: boolean) => (status ? "Approved" : "Pending")

  if (loading) {
    return (
      <div className="student-dashboard">
        <div className="dashboard-container">
          <div className="loading-skeleton">
            <div className="skeleton-welcome"></div>
            <div className="skeleton-content"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="student-dashboard">
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-content">
            <h2 className="welcome-title">Welcome back, {userName}</h2>
            <p className="welcome-date">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <Link to="/booking" className="book-new-link">
              <Plus className="w-4 h-4" />
              Book New Facility
            </Link>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Bookings Section */}
          <div className="bookings-section">
            <div className="section-header">
              <h3 className="section-title">My Bookings</h3>
              <div className="booking-tabs">
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`tab-button ${activeTab === "pending" ? "active" : ""}`}
                >
                  <AlertCircle className="w-4 h-4" />
                  Active Bookings
                  <span className="tab-badge">{pendingBookings.length}</span>
                </button>
                <button
                  onClick={() => setActiveTab("completed")}
                  className={`tab-button ${activeTab === "completed" ? "active" : ""}`}
                >
                  <CheckCircle className="w-4 h-4" />
                  Completed Bookings
                  <span className="tab-badge">{completedBookings.length}</span>
                </button>
              </div>
            </div>

            <div className="bookings-content">
              {activeTab === "pending" ? (
                <div>
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
                            <td data-label="Facility">
                              <div className="facility-name">{booking.timeSlot.venueName}</div>
                            </td>
                            <td data-label="Date & Time">
                              <div className="booking-time">
                                {booking.timeSlot.startTime} - {booking.timeSlot.endTime}
                              </div>
                            </td>
                            <td data-label="Status">
                              <span className={`status-badge status-${booking.isConfirmed ? "approved" : "pending"}`}>
                                {getStatusBadge(booking.isConfirmed)}
                              </span>
                            </td>
                            <td data-label="Actions">
                              <button
                                onClick={() => handleCancelBooking(booking)}
                                className="action-button cancel-button"
                              >
                                <X className="w-4 h-4" />
                                Cancel
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="empty-state">
                      <Calendar className="empty-state-icon" />
                      <h4 className="empty-state-title">No active bookings</h4>
                      <p className="empty-state-description">You don't have any pending bookings at the moment.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {completedBookings.length > 0 ? (
                    <table className="bookings-table">
                      <thead>
                        <tr>
                          <th>Facility</th>
                          <th>Date & Time</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {completedBookings.map((booking) => (
                          <tr key={booking.id}>
                            <td data-label="Facility">
                              <div className="facility-name">{booking.timeSlot.venueName}</div>
                            </td>
                            <td data-label="Date & Time">
                              <div className="booking-time">
                                {booking.timeSlot.startTime} - {booking.timeSlot.endTime}
                              </div>
                            </td>
                            <td data-label="Status">
                              <span className={`status-badge status-${booking.isConfirmed ? "approved" : "pending"}`}>
                                {getStatusBadge(booking.isConfirmed)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="empty-state">
                      <CheckCircle className="empty-state-icon" />
                      <h4 className="empty-state-title">No completed bookings</h4>
                      <p className="empty-state-description">Your completed bookings will appear here.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="sidebar-sections">
            {/* Available Venues Section */}
            <div className="venues-section">
              <div className="section-header">
                <h3 className="section-title">Available Venues</h3>
                {availableVenues.length > venuesPerPage && (
                  <div className="venue-pagination-info">
                    Page {currentVenuePage} of {Math.ceil(availableVenues.length / venuesPerPage)}
                  </div>
                )}
              </div>
              <div className="venues-content">
                <div className="venues-list">
                  {availableVenues
                    .slice((currentVenuePage - 1) * venuesPerPage, currentVenuePage * venuesPerPage)
                    .map((venue, idx) => (
                      <div key={idx} className="venue-item">
                        <div className="venue-info">
                          <div className="venue-name">{venue.name}</div>
                          <div className={`venue-availability ${venue.available === 0 ? "no-slots" : ""}`}>
                            <MapPin className="w-4 h-4 inline mr-1" />
                            {venue.available}/{venue.total} slots available
                          </div>
                        </div>
                        <Link
                          to={`/booking?venue=${encodeURIComponent(venue.name)}`}
                          className={`book-venue-link ${venue.available === 0 ? "disabled" : ""}`}
                        >
                          <Calendar className="w-4 h-4" />
                          Book Now
                        </Link>
                      </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                {availableVenues.length > venuesPerPage && (
                  <div className="venue-pagination">
                    <button
                      onClick={() => setCurrentVenuePage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentVenuePage === 1}
                      className="pagination-button"
                    >
                      Previous
                    </button>

                    <div className="pagination-numbers">
                      {Array.from({ length: Math.ceil(availableVenues.length / venuesPerPage) }, (_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentVenuePage(i + 1)}
                          className={`pagination-number ${currentVenuePage === i + 1 ? "active" : ""}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentVenuePage((prev) =>
                          Math.min(prev + 1, Math.ceil(availableVenues.length / venuesPerPage)),
                        )
                      }
                      disabled={currentVenuePage === Math.ceil(availableVenues.length / venuesPerPage)}
                      className="pagination-button"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Section */}
            <div className="profile-section">
              <div className="section-header">
                <h3 className="section-title">Your Profile</h3>
              </div>
              <div className="profile-content">
                <div className="profile-info">
                  <div className="profile-item">
                    <User className="profile-icon" />
                    <div className="profile-details">
                      <div className="profile-label">Name</div>
                      <div className="profile-value">{userName}</div>
                    </div>
                  </div>
                  <div className="profile-item">
                    <Mail className="profile-icon" />
                    <div className="profile-details">
                      <div className="profile-label">Email</div>
                      <div className="profile-value">{userEmail}</div>
                    </div>
                  </div>
                  <div className="profile-item">
                    <UserCircle className="profile-icon" />
                    <div className="profile-details">
                      <div className="profile-label">Role</div>
                      <div className="profile-value">Student</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
