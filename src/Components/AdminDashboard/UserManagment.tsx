"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Users, Edit, Trash2, Plus, X, Mail, User, Lock, UserCheck, Search, Filter, Menu, Grid } from 'lucide-react'
import { getAllUsers, updateUser, deleteUser, registerUser_for_admin } from "../../api/usersApi"
import "./UserManagment.css"

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([])
  const [form, setForm] = useState({ email: "", name: "", password: "", rolebase: "student" })
  const [editingEmail, setEditingEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const [showMobileForm, setShowMobileForm] = useState<boolean>(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = (await getAllUsers()) as any[]
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAdd = async () => {
    try {
      setSubmitting(true)
      await registerUser_for_admin(form)
      setForm({ email: "", name: "", password: "", rolebase: "student" })
      setShowMobileForm(false)
      await fetchUsers()
    } catch (error) {
      console.error("Error adding user:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (user: any) => {
    setEditingEmail(user.email)
    setForm({ email: user.email, name: user.name, password: "", rolebase: user.rolebase })
    setShowMobileForm(true)
  }

  const handleUpdate = async () => {
    if (!editingEmail) return
    try {
      setSubmitting(true)
      await updateUser(editingEmail, form)
      setEditingEmail(null)
      setForm({ email: "", name: "", password: "", rolebase: "student" })
      setShowMobileForm(false)
      await fetchUsers()
    } catch (error) {
      console.error("Error updating user:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (email: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(email)
        await fetchUsers()
      } catch (error) {
        console.error("Error deleting user:", error)
      }
    }
  }

  const handleCancel = () => {
    setEditingEmail(null)
    setForm({ email: "", name: "", password: "", rolebase: "student" })
    setShowMobileForm(false)
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Filter and sort users
  const filteredAndSortedUsers = users
    .filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = roleFilter === "all" || user.rolebase === roleFilter
      return matchesSearch && matchesRole
    })
    .sort((a, b) => {
      const aValue = a[sortField]?.toLowerCase() || ""
      const bValue = b[sortField]?.toLowerCase() || ""
      if (sortDirection === "asc") {
        return aValue.localeCompare(bValue)
      } else {
        return bValue.localeCompare(aValue)
      }
    })

  const getRoleBadgeClass = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "role-badge role-admin"
      case "staff":
        return "role-badge role-staff"
      case "student":
        return "role-badge role-student"
      default:
        return "role-badge role-default"
    }
  }

  const getRoleCount = (role: string) => {
    return users.filter((user) => user.rolebase === role).length
  }

  if (loading) {
    return (
      <div className="user-management-container">
        <div className="user-management-content">
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
    <div className="user-management-container">
      <div className="user-management-content">
        {/* Header */}
        <div className="management-header">
          <div className="header-content">
            <div className="header-left">
              <div className="header-icon-wrapper">
                <Users className="header-icon" />
              </div>
              <div className="header-text">
                <h1 className="management-title">User Management</h1>
                <p className="management-subtitle">Manage system users and their roles</p>
              </div>
            </div>
            <button 
              className="mobile-add-button"
              onClick={() => setShowMobileForm(true)}
            >
              <Plus className="mobile-add-icon" />
              <span className="mobile-add-text">Add User</span>
            </button>
          </div>
        </div>

        {/* User Statistics */}
        <div className="user-stats">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Total Users</p>
                <p className="stat-value">{users.length}</p>
              </div>
              <div className="stat-icon-wrapper utm-maroon-bg">
                <Users className="stat-icon utm-maroon" />
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Students</p>
                <p className="stat-value">{getRoleCount("student")}</p>
              </div>
              <div className="stat-icon-wrapper student-bg">
                <User className="stat-icon student-color" />
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Staff</p>
                <p className="stat-value">{getRoleCount("staff")}</p>
              </div>
              <div className="stat-icon-wrapper staff-bg">
                <UserCheck className="stat-icon staff-color" />
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Admins</p>
                <p className="stat-value">{getRoleCount("admin")}</p>
              </div>
              <div className="stat-icon-wrapper admin-bg">
                <Users className="stat-icon admin-color" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="controls-section">
          <div className="controls-card">
            <div className="controls-header">
              <h3 className="controls-title">Users List</h3>
              <div className="view-toggle">
                <button
                  className={`view-button ${viewMode === "table" ? "active" : ""}`}
                  onClick={() => setViewMode("table")}
                >
                  <Menu className="view-icon" />
                </button>
                <button
                  className={`view-button ${viewMode === "cards" ? "active" : ""}`}
                  onClick={() => setViewMode("cards")}
                >
                  <Grid className="view-icon" />
                </button>
              </div>
            </div>
            
            <div className="controls-content">
              <div className="search-filter-row">
                <div className="search-container">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                <div className="filter-container">
                  <Filter className="filter-icon" />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Roles</option>
                    <option value="student">Students</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admins</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="management-sections">
          {/* Users Display Section */}
          <div className="users-section">
            <div className="section-card">
              {viewMode === "table" ? (
                <div className="table-container">
                  {filteredAndSortedUsers.length > 0 ? (
                    <>
                      {/* Desktop Table */}
                      <table className="users-table desktop-table">
                        <thead>
                          <tr>
                            <th
                              className={`sortable ${sortField === "email" ? `sorted-${sortDirection}` : ""}`}
                              onClick={() => handleSort("email")}
                            >
                              <div className="th-content">
                                <Mail className="th-icon" />
                                <span>Email</span>
                              </div>
                            </th>
                            <th
                              className={`sortable ${sortField === "name" ? `sorted-${sortDirection}` : ""}`}
                              onClick={() => handleSort("name")}
                            >
                              <div className="th-content">
                                <User className="th-icon" />
                                <span>Name</span>
                              </div>
                            </th>
                            <th
                              className={`sortable ${sortField === "rolebase" ? `sorted-${sortDirection}` : ""}`}
                              onClick={() => handleSort("rolebase")}
                            >
                              <div className="th-content">
                                <UserCheck className="th-icon" />
                                <span>Role</span>
                              </div>
                            </th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAndSortedUsers.map((user) => (
                            <tr key={user.email} className="table-row">
                              <td className="email-cell">{user.email}</td>
                              <td className="name-cell">{user.name}</td>
                              <td className="role-cell">
                                <span className={getRoleBadgeClass(user.rolebase)}>
                                  {user.rolebase.charAt(0).toUpperCase() + user.rolebase.slice(1)}
                                </span>
                              </td>
                              <td className="actions-cell">
                                <div className="action-buttons">
                                  <button
                                    onClick={() => handleEdit(user)}
                                    className="action-button edit-button"
                                    title="Edit user"
                                  >
                                    <Edit className="action-icon" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(user.email)}
                                    className="action-button delete-button"
                                    title="Delete user"
                                  >
                                    <Trash2 className="action-icon" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Mobile Cards */}
                      <div className="mobile-user-cards">
                        {filteredAndSortedUsers.map((user) => (
                          <div key={user.email} className="mobile-user-card">
                            <div className="mobile-card-header">
                              <div className="mobile-card-info">
                                <h4 className="mobile-card-name">{user.name}</h4>
                                <p className="mobile-card-email">{user.email}</p>
                              </div>
                              <span className={getRoleBadgeClass(user.rolebase)}>
                                {user.rolebase.charAt(0).toUpperCase() + user.rolebase.slice(1)}
                              </span>
                            </div>
                            <div className="mobile-card-actions">
                              <button
                                onClick={() => handleEdit(user)}
                                className="mobile-action-button edit-button"
                              >
                                <Edit className="mobile-action-icon" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(user.email)}
                                className="mobile-action-button delete-button"
                              >
                                <Trash2 className="mobile-action-icon" />
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="empty-state">
                      <Users className="empty-icon" />
                      <h3 className="empty-title">No users found</h3>
                      <p className="empty-description">
                        {searchTerm || roleFilter !== "all"
                          ? "Try adjusting your search or filter criteria."
                          : "Start by adding your first user."}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="cards-container">
                  {filteredAndSortedUsers.length > 0 ? (
                    <div className="user-cards-grid">
                      {filteredAndSortedUsers.map((user) => (
                        <div key={user.email} className="user-card">
                          <div className="user-card-header">
                            <div className="user-avatar">
                              <User className="avatar-icon" />
                            </div>
                            <div className="user-card-info">
                              <h4 className="user-card-name">{user.name}</h4>
                              <p className="user-card-email">{user.email}</p>
                            </div>
                          </div>
                          <div className="user-card-body">
                            <div className="user-card-role">
                              <span className={getRoleBadgeClass(user.rolebase)}>
                                {user.rolebase.charAt(0).toUpperCase() + user.rolebase.slice(1)}
                              </span>
                            </div>
                            <div className="user-card-actions">
                              <button
                                onClick={() => handleEdit(user)}
                                className="card-action-button edit-button"
                                title="Edit user"
                              >
                                <Edit className="card-action-icon" />
                              </button>
                              <button
                                onClick={() => handleDelete(user.email)}
                                className="card-action-button delete-button"
                                title="Delete user"
                              >
                                <Trash2 className="card-action-icon" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <Users className="empty-icon" />
                      <h3 className="empty-title">No users found</h3>
                      <p className="empty-description">
                        {searchTerm || roleFilter !== "all"
                          ? "Try adjusting your search or filter criteria."
                          : "Start by adding your first user."}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Form Section */}
          <div className="form-section desktop-form">
            <div className="section-card">
              <div className="section-header">
                <h3 className="section-title">{editingEmail ? "Edit User" : "Add New User"}</h3>
                {editingEmail && (
                  <button onClick={handleCancel} className="cancel-button">
                    <X className="cancel-icon" />
                  </button>
                )}
              </div>

              <form className="user-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label className="form-label">
                    <Mail className="label-icon" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    value={form.email}
                    onChange={handleChange}
                    disabled={!!editingEmail}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <User className="label-icon" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter full name"
                    value={form.name}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Lock className="label-icon" />
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder={editingEmail ? "Leave blank to keep current password" : "Enter password"}
                    value={form.password}
                    onChange={handleChange}
                    className="form-input"
                    required={!editingEmail}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <UserCheck className="label-icon" />
                    Role
                  </label>
                  <select
                    name="rolebase"
                    value={form.rolebase}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="form-actions">
                  {editingEmail ? (
                    <>
                      <button
                        type="button"
                        onClick={handleUpdate}
                        disabled={submitting}
                        className="form-button primary-button"
                      >
                        {submitting ? "Updating..." : "Update User"}
                      </button>
                      <button type="button" onClick={handleCancel} className="form-button secondary-button">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAdd}
                      disabled={submitting}
                      className="form-button primary-button"
                    >
                      <Plus className="button-icon" />
                      {submitting ? "Adding..." : "Add User"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Mobile Form Modal */}
        {showMobileForm && (
          <div className="mobile-form-overlay">
            <div className="mobile-form-modal">
              <div className="mobile-form-header">
                <h3 className="mobile-form-title">{editingEmail ? "Edit User" : "Add New User"}</h3>
                <button onClick={handleCancel} className="mobile-form-close">
                  <X className="mobile-close-icon" />
                </button>
              </div>

              <form className="mobile-user-form" onSubmit={(e) => e.preventDefault()}>
                <div className="mobile-form-group">
                  <label className="mobile-form-label">
                    <Mail className="mobile-label-icon" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    value={form.email}
                    onChange={handleChange}
                    disabled={!!editingEmail}
                    className="mobile-form-input"
                    required
                  />
                </div>

                <div className="mobile-form-group">
                  <label className="mobile-form-label">
                    <User className="mobile-label-icon" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter full name"
                    value={form.name}
                    onChange={handleChange}
                    className="mobile-form-input"
                    required
                  />
                </div>

                <div className="mobile-form-group">
                  <label className="mobile-form-label">
                    <Lock className="mobile-label-icon" />
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder={editingEmail ? "Leave blank to keep current password" : "Enter password"}
                    value={form.password}
                    onChange={handleChange}
                    className="mobile-form-input"
                    required={!editingEmail}
                  />
                </div>

                <div className="mobile-form-group">
                  <label className="mobile-form-label">
                    <UserCheck className="mobile-label-icon" />
                    Role
                  </label>
                  <select
                    name="rolebase"
                    value={form.rolebase}
                    onChange={handleChange}
                    className="mobile-form-select"
                    required
                  >
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="mobile-form-actions">
                  {editingEmail ? (
                    <>
                      <button
                        type="button"
                        onClick={handleUpdate}
                        disabled={submitting}
                        className="mobile-form-button primary-button"
                      >
                        {submitting ? "Updating..." : "Update User"}
                      </button>
                      <button type="button" onClick={handleCancel} className="mobile-form-button secondary-button">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAdd}
                      disabled={submitting}
                      className="mobile-form-button primary-button"
                    >
                      <Plus className="mobile-button-icon" />
                      {submitting ? "Adding..." : "Add User"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserManagement
