"use client"

import React, { useState } from "react"
import { registerUser, generateOtp } from "../../api/usersApi"
import { Link, useNavigate } from "react-router-dom"
import "./Registration.css"

const Registration: React.FC = () => {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.endsWith("@graduate.utm.my")) {
      alert("Only @graduate.utm.my emails are allowed!")
      return
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!")
      return
    }
    try {
      await registerUser({ email, password, name })
      const response = await generateOtp(email)
      if (response && typeof response === "object" && "message" in response) {
        alert(response.message)
        navigate("/OtpVerification", { state: { email } }) // Redirect to OTP verification page
      } else {
        throw new Error("Unexpected response format")
      }
    } catch (error) {
      alert("Failed to register. Please try again.")
    }
  }

  return (
    <div className="registration-container">
      {/* Animated background elements */}
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>

      {/* White particles */}
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>

      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="white-wave"></div>

      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      <div className="login-link">
        Already have an account? <Link to="/login">Login here</Link>
      </div>
    </div>
  )
}

export default Registration
