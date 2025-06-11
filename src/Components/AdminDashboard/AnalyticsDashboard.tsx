"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Users, Calendar, CheckCircle, Clock, FileText, MapPin, UserCheck } from "lucide-react"
import { getAllUsers } from "../../api/usersApi"
import { getAllBookings } from "../../api/bookingsApi"
import jsPDF from "jspdf"
import "./AnalyticsDashboard.css"

const AnalyticsDashboard: React.FC = () => {
  const [users, setUsers] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const usersData = (await getAllUsers()) as any[]
      const bookingsData = (await getAllBookings()) as any[]
      setUsers(usersData)
      setBookings(bookingsData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Analytics calculations
  const totalUsers = users.length
  const totalBookings = bookings.length
  const pendingPayments = bookings.filter((b) => !b.isConfirmed).length
  const confirmedBookings = bookings.filter((b) => b.isConfirmed).length

  // Bookings per venue
  const bookingsPerVenue: { [venue: string]: number } = {}
  bookings.forEach((b) => {
    const venueName = b.timeSlot?.venueName || b.venueName || "Unknown Venue"
    bookingsPerVenue[venueName] = (bookingsPerVenue[venueName] || 0) + 1
  })

  // User roles breakdown
  const rolesBreakdown: { [role: string]: number } = {}
  users.forEach((u) => {
    rolesBreakdown[u.rolebase] = (rolesBreakdown[u.rolebase] || 0) + 1
  })

  const generatePDFReport = () => {
    const doc = new jsPDF()
    let yPosition = 20

    // Helper function to check if we need a new page
    const checkNewPage = (requiredSpace = 10) => {
      if (yPosition + requiredSpace > 280) {
        doc.addPage()
        yPosition = 20
      }
    }

    // Header
    doc.setFontSize(16)
    doc.text("UTM BOOKING SYSTEM ANALYTICS REPORT", 20, yPosition)
    yPosition += 10
    doc.setFontSize(12)
    doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 20, yPosition)
    yPosition += 20

    // Summary Statistics
    doc.setFontSize(14)
    doc.text("SUMMARY STATISTICS", 20, yPosition)
    yPosition += 10

    doc.setFontSize(11)
    doc.text(`Total Users: ${totalUsers}`, 20, yPosition)
    yPosition += 7
    doc.text(`Total Bookings: ${totalBookings}`, 20, yPosition)
    yPosition += 7
    doc.text(`Confirmed Bookings: ${confirmedBookings}`, 20, yPosition)
    yPosition += 7
    doc.text(`Pending Payments: ${pendingPayments}`, 20, yPosition)
    yPosition += 7

    const confirmationRate = totalBookings > 0 ? ((confirmedBookings / totalBookings) * 100).toFixed(1) : "0"
    doc.text(`Success Rate: ${confirmationRate}%`, 20, yPosition)
    yPosition += 20

    // Venue Performance
    const venueEntries = Object.entries(bookingsPerVenue)
    if (venueEntries.length > 0) {
      checkNewPage(30)
      doc.setFontSize(14)
      doc.text("VENUE PERFORMANCE", 20, yPosition)
      yPosition += 10

      doc.setFontSize(11)
      venueEntries.forEach(([venue, count], index) => {
        checkNewPage()
        doc.text(`${index + 1}. ${venue}: ${count} bookings`, 20, yPosition)
        yPosition += 7
      })
      yPosition += 10
    }

    // Top 5 Popular Venues
    const topVenues = Object.entries(bookingsPerVenue)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)

    if (topVenues.length > 0) {
      checkNewPage(40)
      doc.setFontSize(14)
      doc.text("TOP 5 POPULAR VENUES", 20, yPosition)
      yPosition += 10

      doc.setFontSize(11)
      topVenues.forEach(([venue, count], index) => {
        checkNewPage()
        doc.text(`${index + 1}. ${venue}: ${count} bookings`, 20, yPosition)
        yPosition += 7
      })
      yPosition += 10
    }

    // User Role Distribution
    const roleEntries = Object.entries(rolesBreakdown)
    if (roleEntries.length > 0) {
      checkNewPage(30)
      doc.setFontSize(14)
      doc.text("USER ROLE DISTRIBUTION", 20, yPosition)
      yPosition += 10

      doc.setFontSize(11)
      const totalRoleUsers = roleEntries.reduce((sum, [, count]) => sum + count, 0)

      roleEntries.forEach(([role, count]) => {
        checkNewPage()
        const percentage = ((count / totalRoleUsers) * 100).toFixed(1)
        doc.text(`${role}: ${count} users (${percentage}%)`, 20, yPosition)
        yPosition += 7
      })
    }

    // Simple footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.text(`UTM Booking System Report - Page ${i} of ${pageCount}`, 20, 290)
    }

    // Save the PDF
    doc.save(`UTM_Booking_Analytics_Report_${new Date().toISOString().split("T")[0]}.pdf`)
  }

  const statisticsCards = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      colorClass: "utm-maroon",
      bgClass: "utm-maroon-light",
    },
    {
      title: "Total Bookings",
      value: totalBookings,
      icon: Calendar,
      colorClass: "utm-maroon",
      bgClass: "utm-maroon-light",
    },
    {
      title: "Confirmed Bookings",
      value: confirmedBookings,
      icon: CheckCircle,
      colorClass: "success",
      bgClass: "success-light",
    },
    {
      title: "Pending Payments",
      value: pendingPayments,
      icon: Clock,
      colorClass: "warning",
      bgClass: "warning-light",
    },
  ]

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="loading-skeleton">
            <div className="skeleton-header"></div>
            <div className="skeleton-button"></div>
            <div className="skeleton-cards">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-card"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Analytics Dashboard</h1>
          <p className="dashboard-subtitle">University Technology Malaysia - Sports Facility Booking System</p>
        </div>

        {/* Generate Report Button */}
        <div className="report-button-container">
          <button onClick={generatePDFReport} className="report-button">
            <FileText className="button-icon" />
            Generate PDF Report
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          {statisticsCards.map((card, index) => (
            <div key={index} className="stat-card">
              <div className="stat-card-content">
                <div className="stat-info">
                  <p className="stat-label">{card.title}</p>
                  <p className="stat-value">{card.value.toLocaleString()}</p>
                </div>
                <div className={`stat-icon-container ${card.bgClass}`}>
                  <card.icon className={`stat-icon ${card.colorClass}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Data Sections */}
        <div className="data-sections">
          {/* Bookings per Venue */}
          <div className="data-card">
            <div className="data-card-header">
              <h3 className="data-card-title">
                <MapPin className="title-icon utm-maroon" />
                Bookings per Venue
              </h3>
            </div>
            <div className="data-card-content">
              <div className="data-list">
                {Object.entries(bookingsPerVenue).length > 0 ? (
                  Object.entries(bookingsPerVenue)
                    .sort(([, a], [, b]) => b - a)
                    .map(([venue, count], index) => (
                      <div key={venue} className="data-item">
                        <div className="data-item-left">
                          <div className="data-item-number">{index + 1}</div>
                          <span className="data-item-label">{venue}</span>
                        </div>
                        <div className="data-item-right">
                          <span className="data-item-value utm-maroon">{count}</span>
                          <span className="data-item-unit">bookings</span>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="empty-state">
                    <MapPin className="empty-icon" />
                    <p>No venue data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Roles Breakdown */}
          <div className="data-card">
            <div className="data-card-header">
              <h3 className="data-card-title">
                <UserCheck className="title-icon utm-maroon" />
                User Roles Breakdown
              </h3>
            </div>
            <div className="data-card-content">
              <div className="data-list">
                {Object.entries(rolesBreakdown).length > 0 ? (
                  Object.entries(rolesBreakdown)
                    .sort(([, a], [, b]) => b - a)
                    .map(([role, count], index) => {
                      const percentage = totalUsers > 0 ? ((count / totalUsers) * 100).toFixed(1) : "0"
                      return (
                        <div key={role} className="data-item">
                          <div className="data-item-left">
                            <div className="data-item-number">{index + 1}</div>
                            <span className="data-item-label">{role}</span>
                          </div>
                          <div className="data-item-right">
                            <span className="data-item-value utm-maroon">{count}</span>
                            <span className="data-item-unit">({percentage}%)</span>
                          </div>
                        </div>
                      )
                    })
                ) : (
                  <div className="empty-state">
                    <UserCheck className="empty-icon" />
                    <p>No user role data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="summary-card">
          <div className="data-card-header">
            <h3 className="data-card-title">Quick Summary</h3>
          </div>
          <div className="data-card-content">
            <div className="summary-grid">
              <div className="summary-item">
                <p className="summary-label">Success Rate</p>
                <p className="summary-value success">
                  {totalBookings > 0 ? ((confirmedBookings / totalBookings) * 100).toFixed(1) : "0"}%
                </p>
              </div>
              <div className="summary-item">
                <p className="summary-label">Most Popular Venue</p>
                <p className="summary-value utm-maroon">
                  {Object.entries(bookingsPerVenue).length > 0
                    ? Object.entries(bookingsPerVenue).sort(([, a], [, b]) => b - a)[0][0]
                    : "N/A"}
                </p>
              </div>
              <div className="summary-item">
                <p className="summary-label">Primary User Role</p>
                <p className="summary-value utm-maroon">
                  {Object.entries(rolesBreakdown).length > 0
                    ? Object.entries(rolesBreakdown).sort(([, a], [, b]) => b - a)[0][0]
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
