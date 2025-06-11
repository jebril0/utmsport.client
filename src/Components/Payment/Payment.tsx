"use client";

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createBooking } from "../../api/bookingsApi";
import "./Payment.css";

const Payment: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract timeSlotID, userEmail, venueName, startTime, and endTime from the state passed via navigation
  const { timeSlotID, userEmail, venueName, startTime, endTime } = location.state || {};

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!uploadedFile) {
      alert("Please upload a payment screenshot.");
      return;
    }
    if (!userEmail || !venueName || !startTime || !endTime) {
      alert("Missing booking information.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("userEmail", userEmail);
      formData.append("venueName", venueName);
      formData.append("startTime", startTime);
      formData.append("endTime", endTime);
      formData.append("paymentScreenshot", uploadedFile);

      // Debug: log all form data
      for (let pair of Array.from(formData.entries())) {
        console.log(pair[0] + ':', pair[1]);
      }

      await createBooking(formData);

      alert("Payment submitted successfully! Your booking is pending confirmation.");
      navigate("/");
    } catch (error: any) {
      // Show more details from the backend
      if (error.response) {
        console.error("Server error:", error.response.data);
        alert(
          "Booking failed: " +
          (error.response.data?.message ||
           JSON.stringify(error.response.data) ||
           "Unknown server error.")
        );
      } else {
        console.error("Error submitting payment:", error);
        alert("Failed to complete the booking. See console for details.");
      }
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h1 className="payment-title">Complete Your Payment</h1>
        <p className="payment-description">
          Please upload a screenshot of your payment confirmation to complete the booking.
        </p>

        {/* Upload Section */}
        <div className="upload-section">
          <h2 className="upload-title">Upload Payment Confirmation</h2>
          <p className="upload-description">
            After completing the payment, upload a screenshot of your payment confirmation.
          </p>

          <div className="file-upload-container">
            <label htmlFor="file-upload" className="custom-file-upload">
              <span className="upload-icon">📁</span>
              <span>Choose File</span>
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="file-input"
            />
          </div>

          {uploadedFile && (
            <div className="upload-success">
              <span className="success-icon">✓</span>
              <p>File uploaded: {uploadedFile.name}</p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button onClick={handleSubmit} className="submit-button">
          Confirm Payment
        </button>
      </div>
    </div>
  );
};

export default Payment;
