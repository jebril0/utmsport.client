"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Users, Edit, Trash2, Plus, X, Mail, User, Lock, UserCheck, Search, Filter } from "lucide-react"
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
  }

  const handleUpdate = async () => {
    if (!editingEmail) return
    try {
      setSubmitting(true)
      await updateUser(editingEmail, form)
      setEditingEmail(null)
      setForm({ email: "", name: "", password: "", rolebase: "student" })
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
            <div className="skeleton-header"></div>
            <div className="skeleton-subtitle"></div>
            <div className="skeleton-stats"></div>
            <div className="skeleton-table"></div>
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
            <Users className="header-icon utm-maroon" />
            <div>
                <h1 className="management-title" style={{ color: "#fff" }}>User Management</h1>
                <p className="management-subtitle" style={{ color: "#fff" }}>Manage system users and their roles</p>
            </div>
          </div>
        </div>

        {/* User Statistics */}
        <div className="user-stats">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <span className="stat-label">Total Users</span>
                <span className="stat-value">{users.length}</span>
              </div>
              <Users className="stat-icon utm-maroon" />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <span className="stat-label">Students</span>
                <span className="stat-value">{getRoleCount("student")}</span>
              </div>
              <div className="stat-icon-container student-bg">
                <User className="stat-icon student-color" />
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <span className="stat-label">Staff</span>
                <span className="stat-value">{getRoleCount("staff")}</span>
              </div>
              <div className="stat-icon-container staff-bg">
                <UserCheck className="stat-icon staff-color" />
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <span className="stat-label">Admins</span>
                <span className="stat-value">{getRoleCount("admin")}</span>
              </div>
              <div className="stat-icon-container admin-bg">
                <Users className="stat-icon admin-color" />
              </div>
            </div>
          </div>
        </div>

        <div className="management-sections">
          {/* Users Table Section */}
          <div className="table-section">
            <div className="section-card">
              <div className="section-header">
                <h3 className="section-title">Users List</h3>
                <div className="table-controls">
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

              <div className="table-container">
                {filteredAndSortedUsers.length > 0 ? (
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th
                          className={`sortable ${sortField === "email" ? `sorted-${sortDirection}` : ""}`}
                          onClick={() => handleSort("email")}
                        >
                          <div className="th-content">
                            <Mail className="th-icon" />
                            <span>Email</span>
                            <div className="sort-indicator"></div>
                          </div>
                        </th>
                        <th
                          className={`sortable ${sortField === "name" ? `sorted-${sortDirection}` : ""}`}
                          onClick={() => handleSort("name")}
                        >
                          <div className="th-content">
                            <User className="th-icon" />
                            <span>Name</span>
                            <div className="sort-indicator"></div>
                          </div>
                        </th>
                        <th
                          className={`sortable ${sortField === "rolebase" ? `sorted-${sortDirection}` : ""}`}
                          onClick={() => handleSort("rolebase")}
                        >
                          <div className="th-content">
                            <UserCheck className="th-icon" />
                            <span>Role</span>
                            <div className="sort-indicator"></div>
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
            </div>
          </div>

          {/* User Form Section */}
          <div className="form-section">
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
      </div>
    </div>
  )
}

export default UserManagement
