"use client";

import type React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Shield, CheckCircle, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { verifyOtp } from "../../api/usersApi";
import "./OtpVerification.css";

const OtpVerification: React.FC = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleVerifyOtp = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await verifyOtp(email, Number.parseInt(otp));
      setMessage((response as { message: string }).message);
      setSuccess(true);

      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      setError(error.response?.data?.message || "OTP verification failed. Please check your code and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6); // Only allow digits, max 6
    setOtp(value);
  };

  if (success) {
    return (
      <div className="otp-verification-page">
        <div className="otp-verification-container">
          <div className="success-content">
            <div className="success-icon-wrapper">
              <CheckCircle className="success-icon" />
            </div>
            <h1 className="success-title">Email Verified Successfully!</h1>
            <p className="success-description">
              Your email has been verified. You will be redirected to the login page shortly.
            </p>
            <div className="success-actions">
              <Link to="/login" className="primary-button">
                <ArrowLeft className="button-icon" />
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="otp-verification-page">
      <div className="otp-verification-container">
        {/* Header */}
        <div className="otp-verification-header">
          <div className="utm-logo">
            <Shield className="logo-icon" />
          </div>
          <h1 className="page-title">Verify Your Email</h1>
          <p className="page-subtitle">
            Enter the 6-digit verification code sent to your email address to complete the verification process.
          </p>
        </div>

        {/* Form Content */}
        <div className="form-content">
          <div className="step-header">
            <Mail className="step-icon-large" />
            <h2 className="step-title">Email Verification</h2>
            <p className="step-description">
              We've sent a verification code to your email. Please check your inbox and enter the code below.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Mail className="label-icon" />
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Shield className="label-icon" />
              Verification Code
            </label>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={handleOtpChange}
              className="form-input otp-input"
              maxLength={6}
              disabled={loading}
            />
            <div className="otp-helper">
              <span className="otp-format">Format: 123456</span>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle className="error-icon" />
              <span>{error}</span>
            </div>
          )}

          {message && !error && (
            <div className="success-message">
              <CheckCircle className="success-icon-small" />
              <span>{message}</span>
            </div>
          )}

          <button
            onClick={handleVerifyOtp}
            className="primary-button"
            disabled={loading || !email || !otp || otp.length !== 6}
          >
            {loading ? (
              <>
                <Loader2 className="button-icon spinning" />
                Verifying...
              </>
            ) : (
              <>
                <Shield className="button-icon" />
                Verify Email
              </>
            )}
          </button>

          <div className="help-section">
            <div className="help-item">
              <h4 className="help-title">Didn't receive the code?</h4>
              <ul className="help-list">
                <li>Check your spam or junk folder</li>
                <li>Make sure you entered the correct email address</li>
                <li>Wait a few minutes for the email to arrive</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="otp-verification-footer">
          <p className="footer-text">
            Need help?{" "}
            <Link to="/login" className="footer-link">
              Back to Login
            </Link>
          </p>
          <p className="footer-brand">UTM Sports Facility Booking System</p>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
