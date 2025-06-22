"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Users, BarChart3, Shield, Menu, X, LogOut, User, ChevronLeft, ChevronRight } from "lucide-react"
import UserManagement from "../../Components/AdminDashboard/UserManagment"
import AnalyticsDashboard from "../../Components/AdminDashboard/AnalyticsDashboard"
import AdminSecurity from "../../Components/AdminDashboard/AdminSecurity"
import { getCurrentUser } from "../../api/usersApi"
import { useNavigate } from "react-router-dom"
import "./Admindashboard.css"

const AdminDashboard: React.FC = () => {
  const [activePage, setActivePage] = useState<"userManagement" | "analytics" | "security">("userManagement")
  const [loading, setLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        if (
          typeof user === "object" &&
          user !== null &&
          "role" in user &&
          (user as { role: string }).role !== "admin"
        ) {
          navigate("/login")
        } else {
          setCurrentUser(user)
        }
        setLoading(false)
      })
      .catch(() => {
        navigate("/login")
      })
  }, [navigate])

  const handleLogout = () => {
    // Add your logout logic here
    navigate("/")
  }

  const navigationItems = [
    {
      id: "userManagement" as const,
      label: "User Management",
      icon: Users,
      description: "Manage system users and roles",
    },
    {
      id: "analytics" as const,
      label: "Analytics Dashboard",
      icon: BarChart3,
      description: "View system analytics and reports",
    },
    {
      id: "security" as const,
      label: "Admin Security",
      icon: Shield,
      description: "Security settings and controls",
    },
  ]

  const handlePageChange = (page: "userManagement" | "analytics" | "security") => {
    setActivePage(page)
    setMobileMenuOpen(false)
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading Admin Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      {/* REMOVE or COMMENT OUT this block to remove the maroon header */}
      {/*
      <header className="admin-header">
        <div className="header-left">
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            <Menu className="menu-icon" />
          </button>
          <div className="header-brand">
            <div className="utm-logo">
              <Shield className="logo-icon" />
            </div>
            <div className="brand-text">
              <h1 className="brand-title">UTM Admin</h1>
              <p className="brand-subtitle">Sports Facility Management</p>
            </div>
          </div>
        </div>

        <div className="header-right">
          <div className="user-profile">
            <div className="user-avatar">
              <User className="avatar-icon" />
            </div>
            <div className="user-info">
              <span className="user-name">{currentUser?.name || "Admin User"}</span>
              <span className="user-role">Administrator</span>
            </div>
            <button className="logout-button" onClick={handleLogout} title="Logout">
              <LogOut className="logout-icon" />
            </button>
          </div>
        </div>
      </header>
      */}
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && <div className="mobile-overlay" onClick={toggleMobileMenu}></div>}

      <div className="admin-layout">
        {/* Sidebar */}
        <aside
          className={`admin-sidebar ${sidebarCollapsed ? "collapsed" : ""} ${mobileMenuOpen ? "mobile-open" : ""}`}
        >
          <div className="sidebar-header">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              {sidebarCollapsed ? <ChevronRight className="toggle-icon" /> : <ChevronLeft className="toggle-icon" />}
            </button>
            {mobileMenuOpen && (
              <button className="mobile-close" onClick={toggleMobileMenu}>
                <X className="close-icon" />
              </button>
            )}
          </div>

          <nav className="sidebar-nav">
            <ul className="nav-list">
              {navigationItems.map((item) => (
                <li key={item.id} className="nav-item">
                  <button
                    onClick={() => handlePageChange(item.id)}
                    className={`nav-link ${activePage === item.id ? "active" : ""}`}
                    title={sidebarCollapsed ? item.label : ""}
                  >
                    <item.icon className="nav-icon" />
                    {!sidebarCollapsed && (
                      <div className="nav-content">
                        <span className="nav-label">{item.label}</span>
                        <span className="nav-description">{item.description}</span>
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sidebar-footer">
            {!sidebarCollapsed && (
              <div className="footer-content">
                <p className="footer-text">UTM Booking System</p>
                <p className="footer-version">v2.0.1</p>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className={`admin-main ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
          <div className="content-wrapper">
            <div className="page-header">
              <div className="page-title-section">
                <h2 className="page-title">{navigationItems.find((item) => item.id === activePage)?.label}</h2>
                <p className="page-description">
                  {navigationItems.find((item) => item.id === activePage)?.description}
                </p>
              </div>
            </div>

            <div className="page-content">
              {activePage === "userManagement" && <UserManagement />}
              {activePage === "analytics" && <AnalyticsDashboard />}
              {activePage === "security" && <AdminSecurity />}
            </div>
          </div>
        </main>
      </div>
      <button
        className="mobile-menu-toggle"
        onClick={toggleMobileMenu}
        style={{
          display: 'block',
          position: 'fixed',
          top: 56, // <-- moved further down
          left: 16,
          zIndex: 2000,
          background: '#8B1C2B',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}
      >
        <Menu />
      </button>
    </div>
  )
}

export default AdminDashboard
