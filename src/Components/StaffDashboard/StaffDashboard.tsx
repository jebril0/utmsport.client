import React, { useEffect, useRef, useState } from "react";
import {
  getAllVenuesWithTimeSlots,
  createVenue,
  updateVenue,
  deleteVenue,
  getVenueWithTimeSlots,
} from "../../api/venuesApi";
import {
  getAllBookings,
  acceptPayment,
  rejectPayment,
  deleteBooking,
} from "../../api/bookingsApi";
import { timeSlotsApi } from "../../api/timeSlotsApi";
import "./StaffDashboard.css";
// @ts-ignore
import { Html5QrcodeScanner } from "html5-qrcode";

const StaffDashboard: React.FC = () => {
  const [venues, setVenues] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [venueForm, setVenueForm] = useState({ name: "", location: "", capacity: 0, type: "", status: true });
  const [timeSlotForm, setTimeSlotForm] = useState({ startTime: "", endTime: "" });
  const [venueTimeSlots, setVenueTimeSlots] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"venues" | "bookings" | "scanner">("venues");
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<any>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchVenues();
    fetchBookings();
  }, []);

  useEffect(() => {
    if (!showScanner || !scannerRef.current) return;
    const scanner = new Html5QrcodeScanner(
      "staff-qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );
    scanner.render(
      async (decodedText: string) => {
        setScanResult(decodedText);
        // Call backend to validate QR token
        try {
          const response = await fetch(`http://localhost:5320/api/bookings/validate-qr?token=${encodeURIComponent(decodedText)}`, {
            headers: {
              Accept: "application/json",
            },
            credentials: "include", // Use cookies for authentication
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();
          setValidationResult(result);
        } catch (error) {
          console.error("Error validating QR code:", error);
          setValidationResult({ valid: false, message: "Error validating QR code." });
        }
        scanner.clear();
        setShowScanner(false);
      },
      (error: any) => {
        // Optionally handle scan errors
      }
    );
    return () => {
      scanner.clear().catch(() => {});
    };
  }, [showScanner]);

  const fetchVenues = async () => {
    const data: any[] = await getAllVenuesWithTimeSlots();
    setVenues(data);
  };

  const fetchBookings = async () => {
    const data = await getAllBookings() as any[];
    setBookings(data);
  };

  // Venue CRUD
  const handleVenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVenueForm({ ...venueForm, [e.target.name]: e.target.value });
  };

  const handleAddVenue = async () => {
    await createVenue(venueForm);
    setVenueForm({ name: "", location: "", capacity: 0, type: "", status: true });
    fetchVenues();
  };

  const handleUpdateVenue = async (venueName: string) => {
    await updateVenue(venueName, venueForm);
    setVenueForm({ name: "", location: "", capacity: 0, type: "", status: true });
    setSelectedVenue(null);
    fetchVenues();
  };

  const handleDeleteVenue = async (venueName: string) => {
    await deleteVenue(venueName);
    setVenueForm({ name: "", location: "", capacity: 0, type: "", status: true });
    setSelectedVenue(null);
    fetchVenues();
  };

  // Time Slot Management
  const handleTimeSlotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeSlotForm({ ...timeSlotForm, [e.target.name]: e.target.value });
  };

  const handleShowTimeSlots = async (venueName: string) => {
    const venueWithSlots = await getVenueWithTimeSlots(venueName);
    setVenueTimeSlots(venueWithSlots.timeSlots);
    setSelectedVenue({ ...venueWithSlots.venue, name: venueName });
  };

  const handleAddTimeSlot = async () => {
    if (!selectedVenue) return;
    await timeSlotsApi.createTimeSlot(selectedVenue.name, timeSlotForm);
    setTimeSlotForm({ startTime: "", endTime: "" });
    handleShowTimeSlots(selectedVenue.name);
    fetchVenues();
  };

  const handleDeleteTimeSlot = async (venueName: string, startTime: string, endTime: string) => {
    await timeSlotsApi.deleteTimeSlot(venueName, startTime, endTime);
    handleShowTimeSlots(venueName);
    fetchVenues();
  };

  // Booking confirmation/rejection
  const handleAcceptBooking = async (booking: any) => {
    await acceptPayment(booking.userEmail, booking.venueName, booking.startTime, booking.endTime);
    fetchBookings();
  };

  const handleRejectBooking = async (booking: any) => {
    await rejectPayment(booking.userEmail, booking.venueName, booking.startTime, booking.endTime);
    fetchBookings();
  };

  const handleDeleteBooking = async (booking: any) => {
    await deleteBooking(booking.userEmail, booking.venueName, booking.startTime, booking.endTime);
    fetchBookings();
  };

  const handleTabChange = (tab: "venues" | "bookings" | "scanner") => {
    setActiveTab(tab);
    setShowScanner(false);
    setScanResult(null);
    setValidationResult(null);
  };

  return (
    <div className="staff-dashboard">
      <h1>Staff Dashboard</h1>
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => handleTabChange("venues")} disabled={activeTab === "venues"}>
          Venue Management
        </button>
        <button onClick={() => handleTabChange("bookings")} disabled={activeTab === "bookings"}>
          Booking Validation
        </button>
        <button onClick={() => handleTabChange("scanner")} disabled={activeTab === "scanner"}>
          QR Scan Validation
        </button>
      </div>

      {activeTab === "venues" && (
        <>
          {/* Venue Management Section */}
          <section>
            <h2>Venues</h2>
            <div>
              <input name="name" placeholder="Name" value={venueForm.name} onChange={handleVenueChange} />
              <input name="location" placeholder="Location" value={venueForm.location} onChange={handleVenueChange} />
              <input name="capacity" type="number" placeholder="Capacity" value={venueForm.capacity} onChange={handleVenueChange} />
              <input name="type" placeholder="Type" value={venueForm.type} onChange={handleVenueChange} />
              <button onClick={handleAddVenue}>Add Venue</button>
              {selectedVenue && (
                <>
                  <button onClick={() => handleUpdateVenue(selectedVenue.name)}>Update Venue</button>
                  <button onClick={() => {
                    setVenueForm({ name: "", location: "", capacity: 0, type: "", status: true });
                    setSelectedVenue(null);
                  }}>Cancel</button>
                </>
              )}
            </div>
            <ul>
              {venues.map((venue: any) => (
                <li key={venue.name}>
                  {venue.name} ({venue.location}) - {venue.type} - Capacity: {venue.capacity}
                  <button onClick={() => {
                    setVenueForm(venue);
                    setSelectedVenue(venue);
                  }}>Edit</button>
                  <button onClick={() => handleDeleteVenue(venue.name)}>Delete</button>
                  <button onClick={() => handleShowTimeSlots(venue.name)}>Manage Time Slots</button>
                </li>
              ))}
            </ul>
          </section>
          {/* Time Slot Management */}
          {selectedVenue && (
            <section>
              <h3>Time Slots for {selectedVenue.name}</h3>
              <div>
                <input name="startTime" placeholder="Start Time (e.g. 09:00:00)" value={timeSlotForm.startTime} onChange={handleTimeSlotChange} />
                <input name="endTime" placeholder="End Time (e.g. 10:00:00)" value={timeSlotForm.endTime} onChange={handleTimeSlotChange} />
                <button onClick={handleAddTimeSlot}>Add Time Slot</button>
                <button onClick={() => setSelectedVenue(null)}>Close</button>
              </div>
              <ul>
                {venueTimeSlots.map((slot: any) => (
                  <li key={slot.id || `${slot.startTime}-${slot.endTime}`}>
                    {slot.startTime} - {slot.endTime}
                    <button onClick={() => handleDeleteTimeSlot(selectedVenue.name, slot.startTime, slot.endTime)}>Delete</button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      {activeTab === "bookings" && (
        <section>
          <h2>Bookings</h2>
          <ul>
            {bookings.map((booking: any) => (
              <li key={booking.id}>
                {booking.userEmail} - {booking.venueName} - {booking.startTime} to {booking.endTime}
                {booking.paymentScreenshotUrl && (
                  <div>
                    <a href={`http://localhost:5320${booking.paymentScreenshotUrl}`} target="_blank" rel="noopener noreferrer">
                      View Payment Screenshot
                    </a>
                  </div>
                )}
                {!booking.isConfirmed && (
                  <>
                    <button onClick={() => handleAcceptBooking(booking)}>Confirm</button>
                    <button onClick={() => handleRejectBooking(booking)}>Reject</button>
                  </>
                )}
                <button onClick={() => handleDeleteBooking(booking)}>Delete</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {activeTab === "scanner" && (
        <section>
          <h2>Scan Booking QR Code</h2>
          {!showScanner && (
            <button onClick={() => setShowScanner(true)}>
              Start Scanning
            </button>
          )}
          {showScanner && (
            <div id="staff-qr-reader" ref={scannerRef} style={{ width: "500px" }}></div>
          )}
          {scanResult && (
            <div>
              <p>Scanned Token: {scanResult}</p>
              {validationResult && (
                <div>
                  {validationResult.valid ? (
                    <div style={{ color: "green" }}>
                      <strong>Valid Booking!</strong>
                      <div>Email: {validationResult.userEmail}</div>
                      <div>Venue: {validationResult.venueName}</div>
                      <div>Start: {validationResult.startTime}</div>
                      <div>End: {validationResult.endTime}</div>
                    </div>
                  ) : (
                    <div style={{ color: "red" }}>
                      <strong>Invalid QR Code:</strong> {validationResult.message}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default StaffDashboard;