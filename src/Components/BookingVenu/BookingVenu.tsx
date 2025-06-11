"use client";

import type React from "react";
import type { VenueForList } from "../../api/venuesApi";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Users,
  Tag,
  Clock,
  CheckCircle,
  XCircle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getCurrentUser } from "../../api/usersApi"; // Import the API function
import "./BookingVenu.css";

interface BookingVenuProps {
  venue: VenueForList;
}

const BookingVenu: React.FC<BookingVenuProps> = ({ venue }) => {
  const navigate = useNavigate();
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");

  // Fetch the logged-in user's email using the API
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const data = await getCurrentUser(); // Call the API function
        if (typeof data === "object" && data !== null && "email" in data && typeof (data as any).email === "string") {
          setUserEmail((data as { email: string }).email); // Assuming the response contains { email, role }
        } else {
          console.error("User data does not have an email property:", data);
        }
      } catch (error) {
        console.error("Failed to fetch user email:", error);
      }
    };

    fetchUserEmail();
  }, []);

  // Navigate to payment screen with selected time slot and user email
  const handleBookNow = (slot: any) => {
    if (!userEmail) {
      alert("User email not found. Please log in.");
      return;
    }

    navigate("/payment", {
      state: {
        userEmail,
        venueName: venue.name,
        startTime: slot.startTime,
        endTime: slot.endTime,
      },
    });
  };

  const toggleTimeSlots = () => {
    setShowTimeSlots((prev) => !prev);
  };

  return (
    <div className="booking-card">
      <div className="booking-card-header">
        <div className="booking-card-badge">
          {venue.status ? (
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
          <img
            src="/Image/360_F_333141947_xz1nD223W2f9EW43iZbjGqCRFC3WAgTy.jpg"
            alt={venue.name}
          />
        </div>

        <h2 className="booking-card-title">{venue.name}</h2>
      </div>

      <div className="booking-card-body">
        {/* Venue Details */}
        <div className="venue-details">
          <div className="venue-detail-item">
            <MapPin size={16} className="venue-detail-icon" />
            <div className="venue-detail-content">
              <span className="venue-detail-label">Location</span>
              <span className="venue-detail-value">{venue.location}</span>
            </div>
          </div>

          <div className="venue-detail-item">
            <Users size={16} className="venue-detail-icon" />
            <div className="venue-detail-content">
              <span className="venue-detail-label">Capacity</span>
              <span className="venue-detail-value">{venue.capacity} people</span>
            </div>
          </div>

          <div className="venue-detail-item">
            <Tag size={16} className="venue-detail-icon" />
            <div className="venue-detail-content">
              <span className="venue-detail-label">Type</span>
              <span className="venue-detail-value">{venue.type}</span>
            </div>
          </div>
        </div>

        <div className="booking-card-divider"></div>

        {/* Time slots toggle button */}
        <button
          className={`time-slots-toggle ${showTimeSlots ? "active" : ""}`}
          onClick={toggleTimeSlots}
        >
          <Clock size={16} />
          <span>
            {venue.timeSlots.filter((slot) => slot.isAvailable).length} Available Time Slots
          </span>
          {showTimeSlots ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {/* Time slots list */}
        <div className={`time-slots-section ${showTimeSlots ? "show" : ""}`}>
          <div className="time-slots-container">
            {venue.timeSlots.length > 0 ? (
              <ul>
                {venue.timeSlots.map((slot) => (
                  <li key={slot.id}>
                    {slot.startTime} - {slot.endTime} ({slot.isAvailable ? "Available" : "Booked"})
                    {slot.isAvailable && (
                      <button onClick={() => handleBookNow(slot)}>
                        Book
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-slots">
                <p>No available time slots.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingVenu;
