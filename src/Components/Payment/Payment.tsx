"use client";

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Payment.css";

const Payment: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract timeSlotID and userEmail from the state passed via navigation
  const { timeSlotID, userEmail } = location.state || {};

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

    try {
      const formData = new FormData();
      formData.append("TimeSlotID", timeSlotID.toString());
      formData.append("UserEmail", userEmail);
      formData.append("PaymentScreenshot", uploadedFile);

      // Send the booking request with the payment screenshot
      await fetch("http://localhost:5320/api/bookings/book", {
        method: "POST",
        body: formData,
      });

      alert("Booking successful!");
      navigate("/"); // Redirect to the homepage or another page after successful booking
    } catch (error) {
      console.error("Error submitting payment:", error);
      alert("Failed to complete the booking.");
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
