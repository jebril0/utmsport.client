"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom" // For navigation
import { loginUser, type LoginResponse } from "../../api/usersApi" // Import the login API and response type
import "./Login.css"

const Login: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rolebase, setRolebase] = useState("student") // Default role
  const navigate = useNavigate() // Hook for navigation

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response: LoginResponse = await loginUser({ email, password, rolebase })
      alert(response.message)
      console.log("User logged in:", response.user)

      if (rolebase === "student") {
        navigate("/StudentDashboard")
      } else if (rolebase === "admin") {
        navigate("/admin")
      } else if (rolebase === "staff") {
        navigate("/staffDashboard")
      }
    } catch (error: any) {
      if (error.response?.status === 503) {
        alert("The system is under maintenance. Only admins can log in.")
      } else {
        alert(error.response?.data || "Login failed. Please try again.")
      }
    }
  }

  return (
    <div className="login-container">
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

      <h1>Login</h1>
      <form onSubmit={handleLogin}>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <select value={rolebase} onChange={(e) => setRolebase(e.target.value)} required>
        <option value="student">Student</option>
        <option value="admin">Admin</option>
        <option value="staff">Staff</option>
      </select>
      <button type="submit">Login</button>
      </form>

      {/* Added a link to redirect to the Forgot Password page */}
      <div className="forgot-password" style={{ position: "relative", zIndex: 2 }}>
        <Link to="/ForgotPassword" style={{ display: "inline-block", color: "#007bff", textDecoration: "underline", cursor: "pointer" }}>
          Forgot Password?
        </Link>
      </div>
    </div>
  )
}

export default Login
