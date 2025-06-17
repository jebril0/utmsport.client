"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Building2, AlertCircle, Calendar, Clock, MapPin, Info, Users, CheckCircle2, Shield } from "lucide-react"
import { getAllVenuesWithTimeSlots, type VenueForList } from "../../api/venuesApi"
import { getCurrentUser } from "../../api/usersApi"
import { useNavigate } from "react-router-dom"
import "./BookingVenuList.css"

const BookingVenueList: React.FC = () => {
  const [venues, setVenues] = useState<VenueForList[]>([])
  const [selectedVenueType, setSelectedVenueType] = useState("")
  const [selectedVenueName, setSelectedVenueName] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [userEmail, setUserEmail] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [venuesData, userData] = await Promise.all([getAllVenuesWithTimeSlots(), getCurrentUser()])

        setVenues(venuesData)

        if (typeof userData === "object" && userData !== null && "email" in userData) {
          setUserEmail((userData as { email: string }).email)
        }
      } catch (err) {
        setError("Failed to load venues. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Get venues for selected type
  const getVenuesForType = () => {
    if (!selectedVenueType) return []
    return venues.filter((venue) => venue.type === selectedVenueType)
  }

  // Get selected venue details
  const getSelectedVenue = () => {
    return venues.find((v) => v.name === selectedVenueName) || null
  }

  // Get available times for selected venue
  const getAvailableTimes = () => {
    const venue = getSelectedVenue()
    if (!venue) return []
    return venue.timeSlots.filter((slot) => slot.isAvailable)
  }

  // Format time for display
  const formatTime = (time: string) => {
    if (time.includes(":")) {
      const [hours, minutes] = time.split(":")
      const hour = Number.parseInt(hours)
      const ampm = hour >= 12 ? "PM" : "AM"
      const formattedHour = hour % 12 || 12
      return `${formattedHour}:${minutes} ${ampm}`
    }
    return time
  }

  const handleBookNow = () => {
    if (!userEmail) {
      alert("Please log in to book a venue.")
      return
    }

    if (!selectedVenueName || !selectedDate || !selectedTime) {
      alert("Please complete all selections.")
      return
    }

    const venue = getSelectedVenue()
    if (!venue) {
      alert("Selected venue not found.")
      return
    }
    const selectedSlot = venue.timeSlots.find((slot) => `${slot.startTime}-${slot.endTime}` === selectedTime)

    if (!selectedSlot) {
      alert("Selected time slot not found.")
      return
    }

    navigate("/payment", {
      state: {
        userEmail,
        venueName: venue.name,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        price: venue.price,
        venueLocation: venue.location,
        venueType: venue.type,
        venueCapacity: venue.capacity,
      },
    })
  }

  // Add this function before the component return statement
  const getSportIcon = (venueType: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      "Sports Hall": <Building2 className="empty-icon" />,
      "Football Field": <span className="empty-icon sport-emoji">⚽</span>,
      "Basketball Court": <span className="empty-icon sport-emoji">🏀</span>,
      "Tennis Court": <span className="empty-icon sport-emoji">🎾</span>,
      "Badminton Court": <span className="empty-icon sport-emoji">🏸</span>,
      "Sepak Takraw Court": <span className="empty-icon sport-emoji">🥎</span>,
      "Squash Court": <span className="empty-icon sport-emoji">🎯</span>,
      "Table Tennis Room": <span className="empty-icon sport-emoji">🏓</span>,
      "Swimming Pool": <span className="empty-icon sport-emoji">🏊</span>,
      Gym: <span className="empty-icon sport-emoji">💪</span>,
      "Hockey Field": <span className="empty-icon sport-emoji">🏑</span>,
      "Rugby Field": <span className="empty-icon sport-emoji">🏉</span>,
      "Netball Court": <span className="empty-icon sport-emoji">🥅</span>,
      "Cricket Ground": <span className="empty-icon sport-emoji">🏏</span>,
      "Volleyball Court": <span className="empty-icon sport-emoji">🏐</span>,
      "Archery Range": <span className="empty-icon sport-emoji">🏹</span>,
      "Athletics Track": <span className="empty-icon sport-emoji">🏃</span>,
      "Futsal Court": <span className="empty-icon sport-emoji">⚽</span>,
      "Petanque Court": <span className="empty-icon sport-emoji">🎯</span>,
      "Silat Hall": <span className="empty-icon sport-emoji">🥋</span>,
      "Martial Arts Room": <span className="empty-icon sport-emoji">🥊</span>,
    }

    return iconMap[venueType] || <Building2 className="empty-icon" />
  }

  if (loading) {
    return (
      <div className="booking-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading Premium Sports Facilities</h2>
          <p>Preparing your exclusive booking experience</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="booking-page">
        <div className="error-container">
          <AlertCircle className="error-icon" />
          <h2>Service Temporarily Unavailable</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            <Shield className="w-4 h-4 mr-2" />
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="booking-page">
      {/* Professional Minimal Header */}
      <div className="professional-header">
        <div className="header-container">
          <div className="header-content">
            <h1 className="page-title" style={{ color: "white" }}>Sports Facility Booking</h1>
            <p className="page-subtitle" style={{ color: "white" }}>Book your preferred sports facilities at Universiti Teknologi Malaysia</p>
          </div>
        </div>
      </div>

      <div className="main-container">
        <div className="booking-grid">
          {/* Main Booking Form */}
          <div className="booking-form-section">
            <div className="premium-card">
              <div className="card-header">
                <h2 className="card-title">Facility Reservation</h2>
                <p className="card-subtitle">Complete your booking in 4 simple steps</p>
              </div>

              <div className="card-content">
                <div className="form-steps">
                  {/* Step 1: Venue Type */}
                  <div className="form-step">
                    <div className="step-header">
                      <div className="step-number">1</div>
                      <div className="step-info">
                        <h3 className="step-title">Select Facility Type</h3>
                        <p className="step-description">Choose your preferred sports facility</p>
                      </div>
                    </div>

                    <div className="form-group">
                      <select
                        className="premium-select"
                        value={selectedVenueType}
                        onChange={(e) => {
                          setSelectedVenueType(e.target.value)
                          setSelectedVenueName("")
                          setSelectedTime("")
                        }}
                        required
                      >
                        <option value="">Select facility type</option>
                        <option value="Sports Hall">🏟️ Sports Hall</option>
                        <option value="Football Field">⚽ Football Field</option>
                        <option value="Basketball Court">🏀 Basketball Court</option>
                        <option value="Tennis Court">🎾 Tennis Court</option>
                        <option value="Badminton Court">🏸 Badminton Court</option>
                        <option value="Sepak Takraw Court">🥎 Sepak Takraw Court</option>
                        <option value="Squash Court">🎯 Squash Court</option>
                        <option value="Table Tennis Room">🏓 Table Tennis Room</option>
                        <option value="Swimming Pool">🏊 Swimming Pool</option>
                        <option value="Gym">💪 Gym</option>
                        <option value="Hockey Field">🏑 Hockey Field</option>
                        <option value="Rugby Field">🏉 Rugby Field</option>
                        <option value="Netball Court">🥅 Netball Court</option>
                        <option value="Cricket Ground">🏏 Cricket Ground</option>
                        <option value="Volleyball Court">🏐 Volleyball Court</option>
                        <option value="Archery Range">🏹 Archery Range</option>
                        <option value="Athletics Track">🏃 Athletics Track</option>
                        <option value="Futsal Court">⚽ Futsal Court</option>
                        <option value="Petanque Court">🎯 Petanque Court</option>
                        <option value="Silat Hall">🥋 Silat Hall</option>
                        <option value="Martial Arts Room">🥊 Martial Arts Room</option>
                      </select>
                    </div>
                  </div>

                  {/* Step 2: Specific Venue */}
                  <div className={`form-step ${!selectedVenueType ? "disabled" : ""}`}>
                    <div className="step-header">
                      <div className="step-number">2</div>
                      <div className="step-info">
                        <h3 className="step-title">Choose Specific Venue</h3>
                        <p className="step-description">Select from available venues</p>
                      </div>
                    </div>

                    <div className="form-group">
                      <select
                        className="premium-select"
                        value={selectedVenueName}
                        onChange={(e) => {
                          setSelectedVenueName(e.target.value)
                          setSelectedTime("")
                        }}
                        required
                        disabled={!selectedVenueType}
                      >
                        <option value="">Choose specific venue</option>
                        {getVenuesForType().map((venue) => (
                          <option key={venue.id} value={venue.name}>
                            {venue.name} - {venue.location}
                          </option>
                        ))}
                      </select>
                      {selectedVenueType && getVenuesForType().length === 0 && (
                        <div className="form-hint error">No venues available for this facility type</div>
                      )}
                    </div>
                  </div>

                  {/* Step 3: Date Selection */}
                  <div className={`form-step ${!selectedVenueName ? "disabled" : ""}`}>
                    <div className="step-header">
                      <div className="step-number">3</div>
                      <div className="step-info">
                        <h3 className="step-title">Select Date</h3>
                        <p className="step-description">Pick your preferred date</p>
                      </div>
                    </div>

                    <div className="form-group">
                      <input
                        type="date"
                        className="premium-input"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        max={new Date().toISOString().split("T")[0]}
                        required
                        disabled={!selectedVenueName}
                      />
                      <div className="form-hint">Bookings available for today only</div>
                    </div>
                  </div>

                  {/* Step 4: Time Selection */}
                  <div className={`form-step ${!selectedDate ? "disabled" : ""}`}>
                    <div className="step-header">
                      <div className="step-number">4</div>
                      <div className="step-info">
                        <h3 className="step-title">Select Time Slot</h3>
                        <p className="step-description">Choose your preferred time</p>
                      </div>
                    </div>

                    <div className="form-group">
                      {selectedVenueName && selectedDate ? (
                        getAvailableTimes().length > 0 ? (
                          <div className="time-slots-grid">
                            {getAvailableTimes().map((slot) => {
                              const timeValue = `${slot.startTime}-${slot.endTime}`
                              return (
                                <label key={slot.id} className="time-slot-option">
                                  <input
                                    type="radio"
                                    name="time"
                                    value={timeValue}
                                    checked={selectedTime === timeValue}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    required
                                  />
                                  <div className="time-slot-content">
                                    <Clock className="w-4 h-4" />
                                    <span>
                                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                    </span>
                                  </div>
                                </label>
                              )
                            })}
                          </div>
                        ) : (
                          <div className="no-slots-message">
                            <AlertCircle className="w-5 h-5" />
                            <span>No available time slots for this date</span>
                          </div>
                        )
                      ) : (
                        <div className="placeholder-message">
                          <Info className="w-5 h-5" />
                          <span>Please select a venue and date first</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Book Now Button */}
                  <div className="form-actions">
                    <button
                      onClick={handleBookNow}
                      className="premium-button primary"
                      disabled={!selectedVenueType || !selectedVenueName || !selectedDate || !selectedTime}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Confirm Reservation</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="booking-summary-section">
            <div className="premium-card sticky">
              <div className="card-header">
                <h2 className="card-title">Reservation Summary</h2>
                <p className="card-subtitle">Review your booking details</p>
              </div>

              <div className="card-content">
                {getSelectedVenue() ? (
                  <div className="summary-content">
                    {/* Venue Image Placeholder */}
                    <div className="venue-image">
                      {selectedVenueType ? getSportIcon(selectedVenueType) : <Building2 className="venue-icon" />}
                      <div className="venue-badge">Premium</div>
                    </div>

                    {/* Venue Details */}
                    <div className="venue-details">
                      <h3 className="venue-name">{getSelectedVenue()?.name}</h3>
                      <div className="venue-type">{selectedVenueType}</div>

                      <div className="detail-items">
                        <div className="detail-item">
                          <MapPin className="detail-icon" />
                          <span>{getSelectedVenue()?.location}</span>
                        </div>

                        <div className="detail-item">
                          <Users className="detail-icon" />
                          <span>{getSelectedVenue()?.capacity} people capacity</span>
                        </div>

                        {selectedDate && (
                          <div className="detail-item">
                            <Calendar className="detail-icon" />
                            <span>
                              {new Date(selectedDate).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        )}

                        {selectedTime && (
                          <div className="detail-item">
                            <Clock className="detail-icon" />
                            <span>
                              {selectedTime
                                .split("-")
                                .map((time) => formatTime(time))
                                .join(" - ")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="pricing-section">
                      <div className="price-item">
                        <span className="price-label">Facility Fee</span>
                        <span className="price-value">RM {getSelectedVenue()?.price.toFixed(2)}</span>
                      </div>
                      <div className="price-item total">
                        <span className="price-label">Total Amount</span>
                        <span className="price-value">RM {getSelectedVenue()?.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="empty-summary">
                    {selectedVenueType ? getSportIcon(selectedVenueType) : <Info className="empty-icon" />}
                    <h3>{selectedVenueType ? `${selectedVenueType} Facilities` : "Select a Facility"}</h3>
                    <p>
                      {selectedVenueType
                        ? `Choose a specific ${selectedVenueType.toLowerCase()} to see booking details`
                        : "Choose your preferred sports facility to see booking details"}
                    </p>
                  </div>
                )}

                {/* Booking Information */}
                <div className="info-section">
                  <div className="info-header">
                    <Shield className="w-5 h-5" />
                    <span>Booking Policies</span>
                  </div>
                  <ul className="info-list">
                    <li>Bookings are only available for today</li>
                    <li>Payment must be made immediately to confirm your reservation</li>
                    <li>You can cancel your booking at any time</li>
                    <li>No refund is provided upon cancellation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingVenueList
