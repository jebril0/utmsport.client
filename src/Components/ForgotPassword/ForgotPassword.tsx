"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Mail, Lock, Shield, CheckCircle, ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react"
import { requestPasswordResetOtp, resetPassword } from "../../api/usersApi"
import "./ForgotPassword.css"

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleRequestOtp = async () => {
    if (!email) {
      setError("Please enter your email address")
      return
    }

    try {
      setLoading(true)
      setError("")
      await requestPasswordResetOtp(email)
      setStep(2)
    } catch (err) {
      setError("Failed to send OTP. Please check your email and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!otp) {
      setError("Please enter the OTP")
      return
    }

    if (!newPassword) {
      setError("Please enter a new password")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    try {
      setLoading(true)
      setError("")
      await resetPassword({ email, otp: Number.parseInt(otp), newPassword })
      setStep(3)
    } catch (err) {
      setError("Failed to reset password. Please check your OTP and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleBackToStep1 = () => {
    setStep(1)
    setOtp("")
    setNewPassword("")
    setConfirmPassword("")
    setError("")
  }

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        {/* Header */}
        <div className="forgot-password-header">
          <div className="utm-logo">
            <Shield className="logo-icon" />
          </div>
          <h1 className="page-title">Reset Password</h1>
          <p className="page-subtitle">
            {step === 1 && "Enter your email to receive a password reset code"}
            {step === 2 && "Enter the code sent to your email and create a new password"}
            {step === 3 && "Your password has been successfully reset"}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="progress-indicator">
          <div className={`progress-step ${step >= 1 ? "active" : ""} ${step > 1 ? "completed" : ""}`}>
            <div className="step-circle">{step > 1 ? <CheckCircle className="step-icon" /> : <span>1</span>}</div>
            <span className="step-label">Email</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? "active" : ""} ${step > 2 ? "completed" : ""}`}>
            <div className="step-circle">{step > 2 ? <CheckCircle className="step-icon" /> : <span>2</span>}</div>
            <span className="step-label">Reset</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 3 ? "active" : ""}`}>
            <div className="step-circle">
              <span>3</span>
            </div>
            <span className="step-label">Complete</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="form-content">
          {/* Step 1: Request OTP */}
          {step === 1 && (
            <div className="form-step">
              <div className="step-header">
                <Mail className="step-icon-large" />
                <h2 className="step-title">Enter Your Email</h2>
                <p className="step-description">
                  We'll send a verification code to your email address to help you reset your password.
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

              {error && (
                <div className="error-message">
                  <span>{error}</span>
                </div>
              )}

              <button onClick={handleRequestOtp} className="primary-button" disabled={loading || !email}>
                {loading ? (
                  <>
                    <Loader2 className="button-icon spinning" />
                    Sending Code...
                  </>
                ) : (
                  <>
                    <Mail className="button-icon" />
                    Send Verification Code
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 2: Reset Password */}
          {step === 2 && (
            <div className="form-step">
              <div className="step-header">
                <Lock className="step-icon-large" />
                <h2 className="step-title">Reset Your Password</h2>
                <p className="step-description">
                  Enter the verification code sent to <strong>{email}</strong> and create a new password.
                </p>
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
                  onChange={(e) => setOtp(e.target.value)}
                  className="form-input otp-input"
                  maxLength={6}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Lock className="label-icon" />
                  New Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="form-input"
                    disabled={loading}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                    {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Lock className="label-icon" />
                  Confirm New Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="password-toggle"
                  >
                    {showConfirmPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="error-message">
                  <span>{error}</span>
                </div>
              )}

              <div className="button-group">
                <button onClick={handleBackToStep1} className="secondary-button" disabled={loading}>
                  <ArrowLeft className="button-icon" />
                  Back
                </button>
                <button
                  onClick={handleResetPassword}
                  className="primary-button"
                  disabled={loading || !otp || !newPassword || !confirmPassword}
                >
                  {loading ? (
                    <>
                      <Loader2 className="button-icon spinning" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      <Lock className="button-icon" />
                      Reset Password
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="form-step success-step">
              <div className="success-content">
                <div className="success-icon-wrapper">
                  <CheckCircle className="success-icon" />
                </div>
                <h2 className="success-title">Password Reset Successfully!</h2>
                <p className="success-description">
                  Your password has been reset successfully. You can now log in with your new password.
                </p>
                <Link to="/login" className="primary-button">
                  <ArrowLeft className="button-icon" />
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="forgot-password-footer">
          <p className="footer-text">
            Remember your password?{" "}
            <Link to="/login" className="footer-link">
              Sign in here
            </Link>
          </p>
          <p className="footer-brand">UTM Sports Facility Booking System</p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
