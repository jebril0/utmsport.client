"use client"

import type React from "react"
import { useState } from "react"
import { registerUser } from "../../api/usersApi" // Import the API service
import { Link } from "react-router-dom"
import "./Registration.css"

const Registration: React.FC = () => {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Passwords do not match!")
      return
    }

    try {
      const response = await registerUser({ email, password, name })
      alert("Registration successful!")
      console.log("User registered:", response)
    } catch (error) {
      console.error("Error registering user:", error)
      alert("Registration failed. Please try again.")
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
      <form onSubmit={handleRegistration}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
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
