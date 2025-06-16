"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { MapPin, Users, DollarSign, CheckCircle, XCircle, Clock, Star, Zap, Shield } from "lucide-react"
import type { VenueForList } from "../../api/venuesApi"
import { getCurrentUser } from "../../api/usersApi"

interface BookingVenueProps {
  venue: VenueForList
  viewMode?: "grid" | "list"
}

const BookingVenue: React.FC<BookingVenueProps> = ({ venue, viewMode = "grid" }) => {
  const navigate = useNavigate()
  const [userEmail, setUserEmail] = useState<string>("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const data = await getCurrentUser()
        if (typeof data === "object" && data !== null && "email" in data && typeof (data as any).email === "string") {
          setUserEmail((data as { email: string }).email)
        }
      } catch (error) {
        console.error("Failed to fetch user email:", error)
      }
    }

    fetchUserEmail()
  }, [])

  const handleBookNow = (slot: any) => {
    if (!userEmail) {
      alert("Please log in to book a venue.")
      return
    }

    setLoading(true)
    navigate("/payment", {
      state: {
        userEmail,
        venueName: venue.name,
        startTime: slot.startTime,
        endTime: slot.endTime,
        price: venue.price,
        venueLocation: venue.location,
        venueType: venue.type,
        venueCapacity: venue.capacity,
      },
    })
  }

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

  const availableSlots = venue.timeSlots.filter((slot) => slot.isAvailable)
  const isAvailable = venue.status && availableSlots.length > 0

  return (
    <div className="venue-card">
      <div className="venue-card-header">
        <div className="venue-status-badge">
          {isAvailable ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Available</span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4" />
              <span>Unavailable</span>
            </>
          )}
        </div>
        <div className="venue-rating">
          <Star className="w-4 h-4 filled" />
          <span>4.8</span>
        </div>
      </div>

      <div className="venue-card-content">
        <div className="venue-info">
          <h3 className="venue-title">{venue.name}</h3>
          <div className="venue-type-badge">{venue.type}</div>

          <div className="venue-details">
            <div className="detail-row">
              <MapPin className="detail-icon" />
              <span className="detail-text">{venue.location}</span>
            </div>
            <div className="detail-row">
              <Users className="detail-icon" />
              <span className="detail-text">{venue.capacity} people</span>
            </div>
            <div className="detail-row">
              <DollarSign className="detail-icon" />
              <span className="detail-text">RM {venue.price.toFixed(2)}/hour</span>
            </div>
          </div>
        </div>

        {isAvailable ? (
          <div className="time-slots-section">
            <div className="slots-header">
              <Clock className="w-4 h-4" />
              <span>Available Slots</span>
              <div className="slots-count">{availableSlots.length}</div>
            </div>

            <div className="time-slots-container">
              {availableSlots.slice(0, 4).map((slot) => (
                <button key={slot.id} onClick={() => handleBookNow(slot)} className="time-slot-btn" disabled={loading}>
                  <Zap className="w-3 h-3" />
                  <span>
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </span>
                </button>
              ))}
            </div>

            {availableSlots.length > 4 && (
              <div className="more-slots-info">
                <span>+{availableSlots.length - 4} more slots available</span>
              </div>
            )}
          </div>
        ) : (
          <div className="unavailable-section">
            <XCircle className="unavailable-icon" />
            <div className="unavailable-content">
              <h4>Currently Unavailable</h4>
              <p>No time slots available for today</p>
            </div>
          </div>
        )}

        <div className="venue-card-footer">
          <div className="venue-features">
            <div className="feature-badge">
              <Shield className="w-3 h-3" />
              <span>Premium</span>
            </div>
          </div>

          {isAvailable && (
            <button
              className="quick-book-btn"
              onClick={() => availableSlots.length > 0 && handleBookNow(availableSlots[0])}
              disabled={loading}
            >
              <span>Quick Book</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingVenue
