"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Building2, Calendar, QrCode, Plus, Edit, Trash2, Clock, MapPin, Users, DollarSign, Check, X, Eye, Camera, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import {
  getAllVenuesWithTimeSlots,
  createVenue,
  updateVenue,
  deleteVenue,
  getVenueWithTimeSlots,
} from "../../api/venuesApi"
import { getAllBookings, acceptPayment, rejectPayment, deleteBooking } from "../../api/bookingsApi"
import { timeSlotsApi } from "../../api/timeSlotsApi"
// @ts-ignore
import { Html5QrcodeScanner } from "html5-qrcode"
import "./StaffDashboard.css"

const StaffDashboard: React.FC = () => {
  const [venues, setVenues] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [selectedVenue, setSelectedVenue] = useState<any>(null)
  const [venueForm, setVenueForm] = useState({
    name: "",
    location: "",
    capacity: 0,
    type: "",
    status: true,
    price: 0,
  })
  const [timeSlotForm, setTimeSlotForm] = useState({
    startHour: "00",
    startMinute: "00",
    startSecond: "00",
    endHour: "00",
    endMinute: "00",
    endSecond: "00",
  })
  const [venueTimeSlots, setVenueTimeSlots] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"venues" | "bookings" | "scanner">("venues")
  const [showScanner, setShowScanner] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [validationResult, setValidationResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const scannerRef = useRef<HTMLDivElement>(null)

  const [currentVenuePage, setCurrentVenuePage] = useState(1)
  const venuesPerPage = 6

  useEffect(() => {
    fetchVenues()
    fetchBookings()
  }, [])

  useEffect(() => {
    if (!showScanner || !scannerRef.current) return
    const scanner = new Html5QrcodeScanner("staff-qr-reader", { fps: 10, qrbox: 250 }, false)
    scanner.render(
      async (decodedText: string) => {
        setScanResult(decodedText)
        try {
          const response = await fetch(
            `http://localhost:5320/api/bookings/validate-qr?token=${encodeURIComponent(decodedText)}`,
            {
              headers: {
                Accept: "application/json",
              },
              credentials: "include",
            },
          )
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const result = await response.json()
          setValidationResult(result)
        } catch (error) {
          console.error("Error validating QR code:", error)
          setValidationResult({ valid: false, message: "Error validating QR code." })
        }
        scanner.clear()
        setShowScanner(false)
      },
      (error: any) => {},
    )
    return () => {
      scanner.clear().catch(() => {})
    }
  }, [showScanner])

  const fetchVenues = async () => {
    setLoading(true)
    try {
      const data: any[] = await getAllVenuesWithTimeSlots()
      setVenues(data)
    } catch (error) {
      console.error("Error fetching venues:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBookings = async () => {
    try {
      const data = (await getAllBookings()) as any[]
      setBookings(data)
    } catch (error) {
      console.error("Error fetching bookings:", error)
    }
  }

  const handleVenueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setVenueForm({ ...venueForm, [e.target.name]: e.target.value })
  }

  const handleAddVenue = async () => {
    try {
      await createVenue(venueForm)
      setVenueForm({ name: "", location: "", capacity: 0, type: "", status: true, price: 0 })
      fetchVenues()
    } catch (error) {
      console.error("Error adding venue:", error)
    }
  }

  const handleUpdateVenue = async (venueName: string) => {
    try {
      await updateVenue(venueName, venueForm)
      setVenueForm({ name: "", location: "", capacity: 0, type: "", status: true, price: 0 })
      setSelectedVenue(null)
      fetchVenues()
    } catch (error) {
      console.error("Error updating venue:", error)
    }
  }

  const handleDeleteVenue = async (venueName: string) => {
    if (window.confirm("Are you sure you want to delete this venue?")) {
      try {
        await deleteVenue(venueName)
        setVenueForm({ name: "", location: "", capacity: 0, type: "", status: true, price: 0 })
        setSelectedVenue(null)
        fetchVenues()
      } catch (error) {
        console.error("Error deleting venue:", error)
      }
    }
  }

  // Handle changes for time slot fields
  const handleTimeSlotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (/^\d{0,2}$/.test(value) && parseInt(value, 10) <= 59) {
      setTimeSlotForm({ ...timeSlotForm, [name]: value.padStart(2, "0") });
    }
  };

  // Combine time fields into HH:mm:ss format
  const formatTime = (hour: string, minute: string, second: string) => {
    return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:${second.padStart(2, "0")}`;
  };

  const handleAddTimeSlot = async () => {
    if (!selectedVenue) return;
    const startTime = formatTime(timeSlotForm.startHour, timeSlotForm.startMinute, timeSlotForm.startSecond);
    const endTime = formatTime(timeSlotForm.endHour, timeSlotForm.endMinute, timeSlotForm.endSecond);

    try {
      await timeSlotsApi.createTimeSlot(selectedVenue.name, { startTime, endTime });
      setTimeSlotForm({
        startHour: "00",
        startMinute: "00",
        startSecond: "00",
        endHour: "00",
        endMinute: "00",
        endSecond: "00",
      });
      handleShowTimeSlots(selectedVenue.name);
      fetchVenues();
    } catch (error) {
      console.error("Error adding time slot:", error);
    }
  };

  const handleShowTimeSlots = async (venueName: string) => {
    try {
      const venueWithSlots = await getVenueWithTimeSlots(venueName)
      setVenueTimeSlots(venueWithSlots.timeSlots)
      setSelectedVenue({ ...venueWithSlots.venue, name: venueName })
    } catch (error) {
      console.error("Error fetching time slots:", error)
    }
  }

  const handleDeleteTimeSlot = async (venueName: string, startTime: string, endTime: string) => {
    if (window.confirm("Are you sure you want to delete this time slot?")) {
      try {
        await timeSlotsApi.deleteTimeSlot(venueName, startTime, endTime)
        handleShowTimeSlots(venueName)
        fetchVenues()
      } catch (error) {
        console.error("Error deleting time slot:", error)
      }
    }
  }

  const handleAcceptBooking = async (booking: any) => {
    try {
      await acceptPayment(booking.userEmail, booking.venueName, booking.startTime, booking.endTime)
      fetchBookings()
    } catch (error) {
      console.error("Error accepting booking:", error)
    }
  }

  const handleRejectBooking = async (booking: any) => {
    if (window.confirm("Are you sure you want to reject this booking?")) {
      try {
        await rejectPayment(booking.userEmail, booking.venueName, booking.startTime, booking.endTime)
        fetchBookings()
      } catch (error) {
        console.error("Error rejecting booking:", error)
      }
    }
  }

  const handleDeleteBooking = async (booking: any) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteBooking(booking.userEmail, booking.venueName, booking.startTime, booking.endTime)
        fetchBookings()
      } catch (error) {
        console.error("Error deleting booking:", error)
      }
    }
  }

  const handleTabChange = (tab: "venues" | "bookings" | "scanner") => {
    setActiveTab(tab)
    setShowScanner(false)
    setScanResult(null)
    setValidationResult(null)
  }

  return (
    <div className="staff-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Staff Dashboard</h1>
          <p className="dashboard-subtitle">Manage venues, bookings, and validate QR codes</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          onClick={() => handleTabChange("venues")}
          className={`tab-button ${activeTab === "venues" ? "active" : ""}`}
        >
          <Building2 className="tab-icon" />
          Venue Management
        </button>
        <button
          onClick={() => handleTabChange("bookings")}
          className={`tab-button ${activeTab === "bookings" ? "active" : ""}`}
        >
          <Calendar className="tab-icon" />
          Booking Validation
        </button>
        <button
          onClick={() => handleTabChange("scanner")}
          className={`tab-button ${activeTab === "scanner" ? "active" : ""}`}
        >
          <QrCode className="tab-icon" />
          QR Scan Validation
        </button>
      </div>

      {/* Venues Tab */}
      {activeTab === "venues" && (
        <div className="tab-content">
          <div className="content-card">
            <div className="card-header">
              <h2 className="card-title">
                <Building2 className="title-icon" />
                Venue Management
              </h2>
            </div>

            {/* Venue Form */}
            <div className="form-section">
              <div className="form-grid">
                <div className="input-group">
                  <label className="input-label">
                    <Building2 className="label-icon" />
                    Venue Name
                  </label>
                  <input
                    name="name"
                    placeholder="Enter venue name"
                    value={venueForm.name}
                    onChange={handleVenueChange}
                    className="form-input"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">
                    <MapPin className="label-icon" />
                    Location
                  </label>
                  <input
                    name="location"
                    placeholder="Enter location"
                    value={venueForm.location}
                    onChange={handleVenueChange}
                    className="form-input"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">
                    <Users className="label-icon" />
                    Capacity
                  </label>
                  <input
                    name="capacity"
                    type="number"
                    placeholder="Enter capacity"
                    value={venueForm.capacity}
                    onChange={handleVenueChange}
                    className="form-input"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">
                    <Building2 className="label-icon" />
                    Type
                  </label>
                  <select name="type" value={venueForm.type} onChange={handleVenueChange} className="form-select">
                    <option value="">Select type</option>
                    <option value="Sports Hall">Sports Hall</option>
                    <option value="Football Field">Football Field</option>
                    <option value="Basketball Court">Basketball Court</option>
                    <option value="Tennis Court">Tennis Court</option>
                    <option value="Badminton Court">Badminton Court</option>
                    <option value="Sepak Takraw Court">Sepak Takraw Court</option>
                    <option value="Squash Court">Squash Court</option>
                    <option value="Table Tennis Room">Table Tennis Room</option>
                    <option value="Swimming Pool">Swimming Pool</option>
                    <option value="Gym">Gym</option>
                    <option value="Hockey Field">Hockey Field</option>
                    <option value="Rugby Field">Rugby Field</option>
                    <option value="Netball Court">Netball Court</option>
                    <option value="Cricket Ground">Cricket Ground</option>
                    <option value="Volleyball Court">Volleyball Court</option>
                    <option value="Archery Range">Archery Range</option>
                    <option value="Athletics Track">Athletics Track</option>
                    <option value="Futsal Court">Futsal Court</option>
                    <option value="Petanque Court">Petanque Court</option>
                    <option value="Silat Hall">Silat Hall</option>
                    <option value="Martial Arts Room">Martial Arts Room</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">
                    <DollarSign className="label-icon" />
                    Price (RM)
                  </label>
                  <input
                    name="price"
                    type="number"
                    placeholder="Enter price"
                    value={venueForm.price}
                    onChange={handleVenueChange}
                    className="form-input"
                  />
                </div>

                <div className="button-group">
                  {!selectedVenue ? (
                    <button onClick={handleAddVenue} className="btn btn-primary">
                      <Plus className="btn-icon" />
                      Add Venue
                    </button>
                  ) : (
                    <>
                      <button onClick={() => handleUpdateVenue(selectedVenue.name)} className="btn btn-primary">
                        <Check className="btn-icon" />
                        Update Venue
                      </button>
                      <button
                        onClick={() => {
                          setVenueForm({ name: "", location: "", capacity: 0, type: "", status: true, price: 0 })
                          setSelectedVenue(null)
                        }}
                        className="btn btn-secondary"
                      >
                        <X className="btn-icon" />
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Venues List */}
            <div className="list-section">
              <h3 className="section-title">
                Existing Venues 
                {venues.length > venuesPerPage && (
                  <span className="venue-pagination-info">
                    Page {currentVenuePage} of {Math.ceil(venues.length / venuesPerPage)}
                  </span>
                )}
              </h3>
              {loading ? (
                <div className="loading-state">
                  <Loader2 className="loading-icon" />
                  Loading venues...
                </div>
              ) : (
                <>
                  <div className="venues-grid">
                    {venues
                      .slice((currentVenuePage - 1) * venuesPerPage, currentVenuePage * venuesPerPage)
                      .map((venue: any) => (
                        <div key={venue.name} className="venue-card">
                          <div className="venue-info">
                            <h4 className="venue-name">{venue.name}</h4>
                            <div className="venue-details">
                              <span className="venue-detail">
                                <MapPin className="detail-icon" />
                                {venue.location}
                              </span>
                              <span className="venue-detail">
                                <Building2 className="detail-icon" />
                                {venue.type}
                              </span>
                              <span className="venue-detail">
                                <Users className="detail-icon" />
                                {venue.capacity} people
                              </span>
                              <span className="venue-detail">
                                <DollarSign className="detail-icon" />
                                RM {venue.price}
                              </span>
                            </div>
                          </div>
                          <div className="venue-actions">
                            <button
                              onClick={() => {
                                setVenueForm(venue)
                                setSelectedVenue(venue)
                              }}
                              className="btn btn-edit"
                            >
                              <Edit className="btn-icon" />
                              Edit
                            </button>
                            <button onClick={() => handleDeleteVenue(venue.name)} className="btn btn-danger">
                              <Trash2 className="btn-icon" />
                              Delete
                            </button>
                            <button onClick={() => handleShowTimeSlots(venue.name)} className="btn btn-info">
                              <Clock className="btn-icon" />
                              Time Slots
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Venue Pagination */}
                  {venues.length > venuesPerPage && (
                    <div className="venue-pagination">
                      <button
                        onClick={() => setCurrentVenuePage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentVenuePage === 1}
                        className="pagination-button"
                      >
                        Previous
                      </button>

                      <div className="pagination-numbers">
                        {Array.from({ length: Math.ceil(venues.length / venuesPerPage) }, (_, i) => (
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
                            Math.min(prev + 1, Math.ceil(venues.length / venuesPerPage))
                          )
                        }
                        disabled={currentVenuePage === Math.ceil(venues.length / venuesPerPage)}
                        className="pagination-button"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Time Slots Management */}
          {selectedVenue && (
            <div className="content-card">
              <div className="card-header">
                <h3 className="card-title">
                  <Clock className="title-icon" />
                  Time Slots for {selectedVenue.name}
                </h3>
                <button onClick={() => setSelectedVenue(null)} className="btn btn-secondary">
                  <X className="btn-icon" />
                  Close
                </button>
              </div>

              <div className="form-section">
                <div className="form-grid">
                  <div className="input-group">
                    <label className="input-label">Start Time</label>
                    <div className="time-input-group">
                      <input
                        name="startHour"
                        type="number"
                        placeholder="HH"
                        value={timeSlotForm.startHour}
                        onChange={handleTimeSlotChange}
                        className="form-input"
                      />
                      :
                      <input
                        name="startMinute"
                        type="number"
                        placeholder="MM"
                        value={timeSlotForm.startMinute}
                        onChange={handleTimeSlotChange}
                        className="form-input"
                      />
                      :
                      <input
                        name="startSecond"
                        type="number"
                        placeholder="SS"
                        value={timeSlotForm.startSecond}
                        onChange={handleTimeSlotChange}
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">End Time</label>
                    <div className="time-input-group">
                      <input
                        name="endHour"
                        type="number"
                        placeholder="HH"
                        value={timeSlotForm.endHour}
                        onChange={handleTimeSlotChange}
                        className="form-input"
                      />
                      :
                      <input
                        name="endMinute"
                        type="number"
                        placeholder="MM"
                        value={timeSlotForm.endMinute}
                        onChange={handleTimeSlotChange}
                        className="form-input"
                      />
                      :
                      <input
                        name="endSecond"
                        type="number"
                        placeholder="SS"
                        value={timeSlotForm.endSecond}
                        onChange={handleTimeSlotChange}
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="button-group">
                    <button onClick={handleAddTimeSlot} className="btn btn-primary">
                      <Plus className="btn-icon" />
                      Add Time Slot
                    </button>
                  </div>
                </div>
              </div>

              <div className="time-slots-grid">
                {venueTimeSlots.map((slot: any) => (
                  <div key={slot.id || `${slot.startTime}-${slot.endTime}`} className="time-slot-card">
                    <div className="time-slot-info">
                      <Clock className="slot-icon" />
                      <span className="slot-time">
                        {slot.startTime.includes(':') ? 
                          (slot.startTime.split(':').length === 2 ? 
                            slot.startTime + ':00' : slot.startTime) : 
                          slot.startTime.padStart(8, '0')} - {slot.endTime.includes(':') ? 
                          (slot.endTime.split(':').length === 2 ? 
                            slot.endTime + ':00' : slot.endTime) : 
                          slot.endTime.padStart(8, '0')}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteTimeSlot(selectedVenue.name, slot.startTime, slot.endTime)}
                      className="btn btn-danger btn-sm"
                    >
                      <Trash2 className="btn-icon" />
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === "bookings" && (
        <div className="tab-content">
          <div className="content-card">
            <div className="card-header">
              <h2 className="card-title">
                <Calendar className="title-icon" />
                Booking Management
              </h2>
            </div>

            <div className="bookings-grid">
              {bookings.map((booking: any) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-info">
                    <h4 className="booking-title">{booking.venueName}</h4>
                    <div className="booking-details">
                      <span className="booking-detail">
                        <Users className="detail-icon" />
                        {booking.userEmail}
                      </span>
                      <span className="booking-detail">
                        <Clock className="detail-icon" />
                        {booking.startTime.includes(':') ? 
                          (booking.startTime.split(':').length === 2 ? 
                            booking.startTime + ':00' : booking.startTime) : 
                          booking.startTime.padStart(8, '0')} - {booking.endTime.includes(':') ? 
                          (booking.endTime.split(':').length === 2 ? 
                            booking.endTime + ':00' : booking.endTime) : 
                          booking.endTime.padStart(8, '0')}
                      </span>
                      <span className={`booking-status ${booking.isConfirmed ? "confirmed" : "pending"}`}>
                        {booking.isConfirmed ? (
                          <>
                            <CheckCircle className="status-icon" />
                            Confirmed
                          </>
                        ) : (
                          <>
                            <AlertCircle className="status-icon" />
                            Pending
                          </>
                        )}
                      </span>
                    </div>
                    {booking.paymentScreenshotUrl && (
                      <a
                        href={`http://localhost:5320${booking.paymentScreenshotUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="payment-link"
                      >
                        <Eye className="link-icon" />
                        View Payment Screenshot
                      </a>
                    )}
                  </div>
                  <div className="booking-actions">
                    {!booking.isConfirmed && (
                      <>
                        <button onClick={() => handleAcceptBooking(booking)} className="btn btn-success">
                          <Check className="btn-icon" />
                          Confirm
                        </button>
                        <button onClick={() => handleRejectBooking(booking)} className="btn btn-warning">
                          <X className="btn-icon" />
                          Reject
                        </button>
                      </>
                    )}
                    <button onClick={() => handleDeleteBooking(booking)} className="btn btn-danger">
                      <Trash2 className="btn-icon" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Scanner Tab */}
      {activeTab === "scanner" && (
        <div className="tab-content">
          <div className="content-card">
            <div className="card-header">
              <h2 className="card-title">
                <QrCode className="title-icon" />
                QR Code Scanner
              </h2>
            </div>

            <div className="scanner-section">
              {!showScanner && (
                <div className="scanner-start">
                  <QrCode className="scanner-icon" />
                  <h3>Scan Booking QR Code</h3>
                  <p>Click the button below to start scanning QR codes for booking validation</p>
                  <button onClick={() => setShowScanner(true)} className="btn btn-primary btn-lg">
                    <Camera className="btn-icon" />
                    Start Scanning
                  </button>
                </div>
              )}

              {showScanner && (
                <div className="scanner-active">
                  <div id="staff-qr-reader" ref={scannerRef}></div>
                </div>
              )}

              {scanResult && (
                <div className="scan-results">
                  <div className="scan-token">
                    <h4>Scanned Token:</h4>
                    <code className="token-display">{scanResult}</code>
                  </div>

                  {validationResult && (
                    <div className={`validation-result ${validationResult.valid ? "valid" : "invalid"}`}>
                      {validationResult.valid ? (
                        <div className="valid-booking">
                          <CheckCircle className="result-icon" />
                          <h4>Valid Booking!</h4>
                          <div className="booking-details">
                            <div className="detail-item">
                              <Users className="detail-icon" />
                              <span>Email: {validationResult.userEmail}</span>
                            </div>
                            <div className="detail-item">
                              <Building2 className="detail-icon" />
                              <span>Venue: {validationResult.venueName}</span>
                            </div>
                            <div className="detail-item">
                              <Clock className="detail-icon" />
                              <span>
                                Time: {validationResult.startTime.includes(':') ? 
                                  (validationResult.startTime.split(':').length === 2 ? 
                                    validationResult.startTime + ':00' : validationResult.startTime) : 
                                  validationResult.startTime.padStart(8, '0')} - {validationResult.endTime.includes(':') ? 
                                  (validationResult.endTime.split(':').length === 2 ? 
                                    validationResult.endTime + ':00' : validationResult.endTime) : 
                                  validationResult.endTime.padStart(8, '0')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="invalid-booking">
                          <AlertCircle className="result-icon" />
                          <h4>Invalid QR Code</h4>
                          <p>{validationResult.message}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StaffDashboard
