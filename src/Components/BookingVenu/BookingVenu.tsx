"use client"
import { useState } from "react"
import {
  MapPin,
  Users,
  Tag,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import "./BookingVenu.css"

interface Props {
  name: string
  image: string
  location: string
  capacity: number
  type: string
  status: boolean
  availableTimeSlots: {
    id: number
    startTime: string
    endTime: string
  }[]
  onBook: (timeSlotID: number) => void
}

const BookingVenu = ({
  name,
  image,
  location,
  capacity,
  type,
  status,
  availableTimeSlots,
  onBook,
}: Props) => {
  const [showTimeSlots, setShowTimeSlots] = useState(false)

  const toggleTimeSlots = () => {
    setShowTimeSlots(!showTimeSlots)
  }

  return (
    <div className="booking-card">
      <div className="booking-card-header">
        <div className="booking-card-badge">
          {status ? (
            <span className="badge-available">
              <CheckCircle size={14} /> Available
            </span>
          ) : (
            <span className="badge-unavailable">
              <XCircle size={14} /> Unavailable
            </span>
          )}
        </div>
        <div className="booking-card-image">
          <img src={image || "/placeholder.svg"} alt={name} />
        </div>
        <h2 className="booking-card-title">{name}</h2>
      </div>

      <div className="booking-card-body">
        <div className="venue-details">
          <div className="venue-detail-item">
            <MapPin size={16} className="venue-detail-icon" />
            <div className="venue-detail-content">
              <span className="venue-detail-label">Location</span>
              <span className="venue-detail-value">{location}</span>
            </div>
          </div>

          <div className="venue-detail-item">
            <Users size={16} className="venue-detail-icon" />
            <div className="venue-detail-content">
              <span className="venue-detail-label">Capacity</span>
              <span className="venue-detail-value">{capacity} people</span>
            </div>
          </div>

          <div className="venue-detail-item">
            <Tag size={16} className="venue-detail-icon" />
            <div className="venue-detail-content">
              <span className="venue-detail-label">Type</span>
              <span className="venue-detail-value">{type}</span>
            </div>
          </div>
        </div>

        <div className="booking-card-divider"></div>

        <button
          className={`time-slots-toggle ${showTimeSlots ? "active" : ""}`}
          onClick={toggleTimeSlots}
          disabled={!status || availableTimeSlots.length === 0}
        >
          <Calendar size={16} />
          <span>
            {availableTimeSlots.length}{" "}
            {availableTimeSlots.length === 1 ? "Time Slot" : "Time Slots"} Available
          </span>
          {showTimeSlots ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        <div className={`time-slots-section ${showTimeSlots ? "show" : ""}`}>
          <div className="time-slots-container">
            {availableTimeSlots.length > 0 ? (
              availableTimeSlots.map((slot) => (
                <div key={slot.id} className="time-slot">
                  <div className="time-slot-time">
                    <Clock size={14} />
                    <span>
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                  <button
                    className="book-button"
                    onClick={() => onBook(slot.id)}
                    disabled={!status}
                  >
                    Book Now
                  </button>
                </div>
              ))
            ) : (
              <div className="no-slots">
                <p>No available time slots.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingVenu
