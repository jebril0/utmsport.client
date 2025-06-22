"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Users, Calendar, CheckCircle, Clock, FileText, MapPin, UserCheck, TrendingUp } from "lucide-react"
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

  const generatePDFReport = async () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height
    const margin = 20

    // --- Load Logo as Base64 ---
    const getImageBase64 = (url: string) =>
      new Promise<string>((resolve) => {
        const img = new window.Image()
        img.crossOrigin = "anonymous"
        img.onload = function () {
          const canvas = document.createElement("canvas")
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext("2d")
          ctx?.drawImage(img, 0, 0)
          resolve(canvas.toDataURL("image/png"))
        }
        img.src = url
      })

    const logoUrl = "/Image/LOGO-UTM.png"
    const logoBase64 = await getImageBase64(logoUrl)

    // --- Centered Cover Page ---
    let yPosition = 40

    // Center logo
    if (logoBase64) {
      const logoWidth = 50
      const logoHeight = 50
      doc.addImage(logoBase64, "PNG", (pageWidth - logoWidth) / 2, yPosition, logoWidth, logoHeight)
      yPosition += logoHeight + 10
    }

    // Title
    doc.setFont("helvetica", "bold")
    doc.setFontSize(28)
    doc.setTextColor(127, 29, 29)
    doc.text("UTM Sports Facility", pageWidth / 2, yPosition, { align: "center" })
    yPosition += 18

    // Subtitle
    doc.setFontSize(20)
    doc.setTextColor(30, 41, 59)
    doc.text("Booking System Analytics Report", pageWidth / 2, yPosition, { align: "center" })
    yPosition += 14

    // University
    doc.setFontSize(14)
    doc.setTextColor(100, 116, 139)
    doc.text("University Technology Malaysia", pageWidth / 2, yPosition, { align: "center" })
    yPosition += 10

    // Date
    doc.setFontSize(11)
    doc.text(`Generated: ${new Date().toLocaleString("en-MY")}`, pageWidth / 2, yPosition, { align: "center" })
    yPosition += 10

    // Decorative line
    doc.setDrawColor(127, 29, 29)
    doc.setLineWidth(1.5)
    doc.line(margin, yPosition + 8, pageWidth - margin, yPosition + 8)

    // Add a new page for the report content
    doc.addPage()
    yPosition = 30

    // --- Section Helper ---
    const sectionHeader = (title: string) => {
      doc.setFillColor(127, 29, 29)
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 12, "F")
      doc.setFontSize(14)
      doc.setTextColor(255, 255, 255)
      doc.setFont("helvetica", "bold")
      doc.text(title, margin + 5, yPosition + 8)
      yPosition += 18
    }

    // --- Key Metrics ---
    sectionHeader("Key Performance Metrics")
    const metrics = [
      { label: "Total Users", value: totalUsers },
      { label: "Total Bookings", value: totalBookings },
      { label: "Confirmed Bookings", value: confirmedBookings },
      { label: "Pending Payments", value: pendingPayments },
    ]
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(30, 41, 59)
    metrics.forEach((m, i) => {
      doc.text(`${m.label}:`, margin + 5, yPosition + i * 8)
      doc.setFont("helvetica", "bold")
      doc.text(`${m.value}`, margin + 60, yPosition + i * 8)
      doc.setFont("helvetica", "normal")
    })
    yPosition += metrics.length * 8 + 10

    // --- Success Rate ---
    sectionHeader("Success Rate")
    const successRate = totalBookings > 0 ? (confirmedBookings / totalBookings) * 100 : 0
    doc.setFontSize(12)
    doc.setTextColor(5, 150, 105)
    doc.text(`Booking Confirmation Rate: ${successRate.toFixed(1)}%`, margin + 5, yPosition)
    yPosition += 12

    // --- Venue Performance Table ---
    sectionHeader("Venue Performance")
    const venueEntries = Object.entries(bookingsPerVenue)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
    if (venueEntries.length === 0) {
      doc.setTextColor(100, 116, 139)
      doc.text("No venue data available.", margin + 5, yPosition)
      yPosition += 10
    } else {
      // Table header
      doc.setFont("helvetica", "bold")
      doc.setFontSize(11)
      doc.setFillColor(243, 244, 246)
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 10, "F")
      doc.setTextColor(127, 29, 29)
      doc.text("Venue", margin + 5, yPosition + 7)
      doc.text("Bookings", pageWidth / 2, yPosition + 7, { align: "center" })
      doc.text("Percent", pageWidth - margin - 5, yPosition + 7, { align: "right" })
      yPosition += 10
      doc.setFont("helvetica", "normal")
      venueEntries.forEach(([venue, count], idx) => {
        const percent = totalBookings > 0 ? ((count as number) / totalBookings) * 100 : 0
        if (idx % 2 === 0) {
          doc.setFillColor(248, 250, 252)
          doc.rect(margin, yPosition - 2, pageWidth - 2 * margin, 9, "F")
        }
        doc.setTextColor(30, 41, 59)
        doc.text(venue.length > 20 ? venue.slice(0, 20) + "..." : venue, margin + 5, yPosition + 5)
        doc.text(`${count}`, pageWidth / 2, yPosition + 5, { align: "center" })
        doc.text(`${percent.toFixed(1)}%`, pageWidth - margin - 5, yPosition + 5, { align: "right" })
        yPosition += 9
      })
      yPosition += 5
    }

    // --- User Roles ---
    sectionHeader("User Role Distribution")
    const roleEntries = Object.entries(rolesBreakdown).sort(([, a], [, b]) => b - a)
    if (roleEntries.length === 0) {
      doc.setTextColor(100, 116, 139)
      doc.text("No user role data available.", margin + 5, yPosition)
      yPosition += 10
    } else {
      doc.setFont("helvetica", "normal")
      doc.setFontSize(11)
      roleEntries.forEach(([role, count], idx) => {
        const percent = totalUsers > 0 ? ((count as number) / totalUsers) * 100 : 0
        doc.setTextColor(30, 41, 59)
        doc.text(`${role.charAt(0).toUpperCase() + role.slice(1)}:`, margin + 5, yPosition + 6)
        doc.setTextColor(127, 29, 29)
        doc.text(`${count} (${percent.toFixed(1)}%)`, margin + 60, yPosition + 6)
        yPosition += 8
      })
      yPosition += 5
    }

    // --- Insights ---
    sectionHeader("Insights & Recommendations")
    const insights = []
    if (totalBookings > 0) {
      if (successRate >= 80) {
        insights.push("Excellent booking confirmation rate indicates strong user engagement.")
      } else if (successRate >= 60) {
        insights.push("Moderate confirmation rate - consider improving payment processes.")
      } else {
        insights.push("Low confirmation rate requires immediate attention to booking flow.")
      }
    }
    if (venueEntries.length > 0) {
      insights.push(`Most popular venue: ${venueEntries[0][0]} (${venueEntries[0][1]} bookings)`)
    }
    if (pendingPayments > totalBookings * 0.3) {
      insights.push("High number of pending payments - consider automated reminders.")
    }
    if (insights.length === 0) {
      insights.push("Insufficient data for detailed insights. Continue monitoring trends.")
    }
    doc.setFont("helvetica", "normal")
    doc.setFontSize(11)
    doc.setTextColor(100, 116, 139)
    insights.forEach((insight, idx) => {
      doc.text(`- ${insight}`, margin + 5, yPosition + idx * 7)
    })

    // --- Footer on all pages ---
    const totalPages = doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setDrawColor(226, 232, 240)
      doc.setLineWidth(0.3)
      doc.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25)
      doc.setFontSize(8)
      doc.setTextColor(100, 116, 139)
      doc.text("UTM Sports Facility Booking System - Confidential Report", margin, pageHeight - 15)
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 15, { align: "right" })
      doc.text(`Generated on ${new Date().toLocaleDateString("en-MY")}`, pageWidth / 2, pageHeight - 15, { align: "center" })
    }

    // --- Save the document ---
    const fileName = `UTM_Booking_Analytics_Report_${new Date().toISOString().split("T")[0]}.pdf`
    doc.save(fileName)
  }

  const statisticsCards = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      colorClass: "utm-maroon",
      bgClass: "utm-maroon-bg",
      change: "+12%",
    },
    {
      title: "Total Bookings",
      value: totalBookings,
      icon: Calendar,
      colorClass: "utm-maroon",
      bgClass: "utm-maroon-bg",
      change: "+8%",
    },
    {
      title: "Confirmed Bookings",
      value: confirmedBookings,
      icon: CheckCircle,
      colorClass: "success-color",
      bgClass: "success-bg",
      change: "+15%",
    },
    {
      title: "Pending Payments",
      value: pendingPayments,
      icon: Clock,
      colorClass: "warning-color",
      bgClass: "warning-bg",
      change: "-5%",
    },
  ]

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="loading-skeleton">
            <div className="skeleton-header">
              <div className="skeleton-title"></div>
              <div className="skeleton-subtitle"></div>
            </div>
            <div className="skeleton-stats">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-stat-card"></div>
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
          <div className="header-content">
            <div className="header-text">
              <h1 className="dashboard-title">Analytics Dashboard</h1>
              <p className="dashboard-subtitle">University Technology Malaysia - Sports Facility Booking System</p>
            </div>
            <button onClick={generatePDFReport} className="report-button">
              <FileText className="button-icon" />
              Generate PDF Report
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          {statisticsCards.map((card, index) => (
            <div key={index} className="stat-card">
              <div className="stat-card-content">
                <div className="stat-header">
                  <div className={`stat-icon-wrapper ${card.bgClass}`}>
                    <card.icon className={`stat-icon ${card.colorClass}`} />
                  </div>
                  <div className="stat-change">
                    <TrendingUp className="trend-icon" />
                    {card.change}
                  </div>
                </div>
                <div className="stat-info">
                  <p className="stat-value">{card.value.toLocaleString()}</p>
                  <p className="stat-label">{card.title}</p>
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
              <div className="data-card-icon-wrapper">
                <MapPin className="data-card-icon" />
              </div>
              <h3 className="data-card-title">Bookings per Venue</h3>
            </div>
            <div className="data-card-content">
              <div className="data-list">
                {Object.entries(bookingsPerVenue).length > 0 ? (
                  Object.entries(bookingsPerVenue)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([venue, count], index) => (
                      <div key={venue} className="data-item">
                        <div className="data-item-left">
                          <div className="data-item-number">{index + 1}</div>
                          <span className="data-item-label">{venue}</span>
                        </div>
                        <div className="data-item-right">
                          <span className="data-item-value">{count}</span>
                          <span className="data-item-unit">bookings</span>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="empty-state">
                    <MapPin className="empty-icon" />
                    <p className="empty-text">No venue data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Roles Breakdown */}
          <div className="data-card">
            <div className="data-card-header">
              <div className="data-card-icon-wrapper">
                <UserCheck className="data-card-icon" />
              </div>
              <h3 className="data-card-title">User Roles Breakdown</h3>
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
                            <span className="data-item-value">{count}</span>
                            <span className="data-item-unit">({percentage}%)</span>
                          </div>
                        </div>
                      )
                    })
                ) : (
                  <div className="empty-state">
                    <UserCheck className="empty-icon" />
                    <p className="empty-text">No user role data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="summary-section">
          <div className="summary-card">
            <h3 className="summary-title">Quick Summary</h3>
            <div className="summary-grid">
              <div className="summary-item success-gradient">
                <p className="summary-label">Success Rate</p>
                <p className="summary-value">
                  {totalBookings > 0 ? ((confirmedBookings / totalBookings) * 100).toFixed(1) : "0"}%
                </p>
              </div>
              <div className="summary-item utm-gradient">
                <p className="summary-label">Most Popular Venue</p>
                <p className="summary-value">
                  {Object.entries(bookingsPerVenue).length > 0
                    ? Object.entries(bookingsPerVenue).sort(([, a], [, b]) => b - a)[0][0]
                    : "N/A"}
                </p>
              </div>
              <div className="summary-item utm-gradient">
                <p className="summary-label">Primary User Role</p>
                <p className="summary-value">
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
