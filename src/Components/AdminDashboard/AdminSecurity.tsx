"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Shield, Lock, Wrench, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import { getAllUsers, toggleLoginLockout, toggleMaintenanceMode, getMaintenanceModeStatus } from "../../api/usersApi"
import "./AdminSecurity.css"

const AdminSecurity: React.FC = () => {
  const [lockoutEnabled, setLockoutEnabled] = useState<boolean>(true)
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false)
  const [loadingLockout, setLoadingLockout] = useState<boolean>(false)
  const [loadingMaintenance, setLoadingMaintenance] = useState<boolean>(false)
  const [initialLoading, setInitialLoading] = useState<boolean>(true)

  useEffect(() => {
    fetchInitialData()
  }, [])

  type User = { isLoginLockoutEnabled?: boolean }

  const fetchInitialData = async () => {
    setInitialLoading(true)
    try {
      await Promise.all([fetchLockoutStatus(), fetchMaintenanceModeStatus()])
    } catch (error) {
      console.error("Error fetching initial data:", error)
    } finally {
      setInitialLoading(false)
    }
  }

  const fetchLockoutStatus = async () => {
    try {
      const data = (await getAllUsers()) as User[]
      if (Array.isArray(data) && data.length > 0) {
        setLockoutEnabled(data[0].isLoginLockoutEnabled ?? true)
      }
    } catch (error) {
      console.error("Error fetching lockout status:", error)
    }
  }

  const fetchMaintenanceModeStatus = async () => {
    try {
      const status = await getMaintenanceModeStatus()
      if (typeof status === "object" && status !== null && "maintenanceModeEnabled" in status) {
        setMaintenanceMode((status as { maintenanceModeEnabled: boolean }).maintenanceModeEnabled)
      }
    } catch (error) {
      console.error("Error fetching maintenance mode status:", error)
    }
  }

  const handleToggleLockout = async () => {
    setLoadingLockout(true)
    try {
      await toggleLoginLockout(!lockoutEnabled)
      setLockoutEnabled(!lockoutEnabled)
    } catch (error) {
      console.error("Error toggling lockout:", error)
    } finally {
      setLoadingLockout(false)
    }
  }

  const handleToggleMaintenanceMode = async () => {
    setLoadingMaintenance(true)
    try {
      await toggleMaintenanceMode(!maintenanceMode)
      setMaintenanceMode(!maintenanceMode)
    } catch (error) {
      console.error("Error toggling maintenance mode:", error)
    } finally {
      setLoadingMaintenance(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="security-container">
        <div className="security-content">
          <div className="loading-skeleton">
            <div className="skeleton-header">
              <div className="skeleton-title"></div>
              <div className="skeleton-subtitle"></div>
            </div>
            <div className="skeleton-cards">
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="security-container">
      <div className="security-content">
        {/* Header */}
        <div className="security-header">
          <div className="header-content">
            <div className="header-icon-wrapper">
              <Shield className="header-icon" />
            </div>
            <div className="header-text">
              <h1 className="security-title">Security Management</h1>
              <p className="security-subtitle">System Security & Maintenance Controls</p>
            </div>
          </div>
        </div>

        {/* Security Cards */}
        <div className="security-cards">
          {/* Login Security Section */}
          <div className="security-card">
            <div className="card-content">
              <div className="card-header">
                <div className="card-icon-wrapper lockout-icon">
                  <Lock className="card-icon" />
                </div>
                <div className="card-header-text">
                    <h3 className="card-title" style={{ color: "white" }}>Login Attempt Lockout</h3>
                    <p className="card-description" style={{ color: "white" }}>Control user login attempt restrictions</p>
                </div>
              </div>

              <div className="card-body">
                <div className="status-section">
                  <div className="status-header">
                    <span className="status-label">Current Status</span>
                    <div className={`status-badge ${lockoutEnabled ? "status-enabled" : "status-disabled"}`}>
                      {lockoutEnabled ? (
                        <>
                          <CheckCircle className="status-icon" />
                          Enabled
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="status-icon" />
                          Disabled
                        </>
                      )}
                    </div>
                  </div>
                  <p className="status-description">
                    {lockoutEnabled
                      ? "Users will be temporarily locked out after multiple failed login attempts."
                      : "No restrictions on failed login attempts. Users can attempt login unlimited times."}
                  </p>
                </div>

                <button
                  onClick={handleToggleLockout}
                  disabled={loadingLockout}
                  className={`action-button ${lockoutEnabled ? "button-danger" : "button-primary"}`}
                >
                  {loadingLockout ? (
                    <>
                      <Loader2 className="button-icon spinning" />
                      Processing...
                    </>
                  ) : (
                    <>{lockoutEnabled ? "Disable" : "Enable"} Login Lockout</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Maintenance Mode Section */}
          <div className="security-card">
            <div className="card-content">
              <div className="card-header">
                <div className="card-icon-wrapper maintenance-icon">
                  <Wrench className="card-icon" />
                </div>
                <div className="card-header-text">
                    <h3 className="card-title" style={{ color: "white" }}>Maintenance Mode</h3>
                    <p className="card-description" style={{ color: "white" }}>Control system-wide maintenance mode</p>
                </div>
              </div>

              <div className="card-body">
                <div className="status-section">
                  <div className="status-header">
                    <span className="status-label">Current Status</span>
                    <div className={`status-badge ${maintenanceMode ? "status-maintenance" : "status-operational"}`}>
                      {maintenanceMode ? (
                        <>
                          <AlertTriangle className="status-icon" />
                          Active
                        </>
                      ) : (
                        <>
                          <CheckCircle className="status-icon" />
                          Inactive
                        </>
                      )}
                    </div>
                  </div>
                  <p className="status-description">
                    {maintenanceMode
                      ? "System is currently in maintenance mode. Users cannot access the booking system."
                      : "System is operational. All booking features are available to universiti teknologi malaysia users."}
                  </p>
                </div>

                <button
                  onClick={handleToggleMaintenanceMode}
                  disabled={loadingMaintenance}
                  className={`action-button ${maintenanceMode ? "button-success" : "button-warning"}`}
                >
                  {loadingMaintenance ? (
                    <>
                      <Loader2 className="button-icon spinning" />
                      Processing...
                    </>
                  ) : (
                    <>{maintenanceMode ? "Disable" : "Enable"} Maintenance Mode</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Summary */}
        <div className="security-summary">
          <div className="summary-card">
            <h3 className="summary-title">Security Status Overview</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <div className="summary-item-header">
                  <Lock className="summary-icon" />
                  <span className="summary-item-title">Login Security</span>
                </div>
                <div className={`summary-status ${lockoutEnabled ? "summary-secure" : "summary-warning"}`}>
                  {lockoutEnabled ? "Protected" : "Unprotected"}
                </div>
              </div>

              <div className="summary-item">
                <div className="summary-item-header">
                  <Wrench className="summary-icon" />
                  <span className="summary-item-title">System Status</span>
                </div>
                <div className={`summary-status ${maintenanceMode ? "summary-maintenance" : "summary-operational"}`}>
                  {maintenanceMode ? "Maintenance" : "Operational"}
                </div>
              </div>

              <div className="summary-item">
                <div className="summary-item-header">
                  <Shield className="summary-icon" />
                  <span className="summary-item-title">Overall Security</span>
                </div>
                <div
                  className={`summary-status ${
                    lockoutEnabled && !maintenanceMode ? "summary-optimal" : "summary-attention"
                  }`}
                >
                  {lockoutEnabled && !maintenanceMode ? "Optimal" : "Needs Attention"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSecurity
