"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Users, Edit, Trash2, Plus, X, Mail, User, Lock, UserCheck, Search, Filter, ChevronUp, ChevronDown } from 'lucide-react'
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
  const [showForm, setShowForm] = useState<boolean>(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = (await getAllUsers()) as any[]
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
      showNotification('error', 'Failed to fetch users')
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
      setShowForm(false)
      await fetchUsers()
      showNotification('success', 'User added successfully')
    } catch (error) {
      console.error("Error adding user:", error)
      showNotification('error', 'Failed to add user')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (user: any) => {
    setEditingEmail(user.email)
    setForm({ email: user.email, name: user.name, password: "", rolebase: user.rolebase })
    setShowForm(true)
  }

  const handleUpdate = async () => {
    if (!editingEmail) return
    try {
      setSubmitting(true)
      await updateUser(editingEmail, form)
      setEditingEmail(null)
      setForm({ email: "", name: "", password: "", rolebase: "student" })
      setShowForm(false)
      await fetchUsers()
      showNotification('success', 'User updated successfully')
    } catch (error) {
      console.error("Error updating user:", error)
      showNotification('error', 'Failed to update user')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (email: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(email)
        await fetchUsers()
        showNotification('success', 'User deleted successfully')
      } catch (error) {
        console.error("Error deleting user:", error)
        showNotification('error', 'Failed to delete user')
      }
    }
  }

  const handleCancel = () => {
    setEditingEmail(null)
    setForm({ email: "", name: "", password: "", rolebase: "student" })
    setShowForm(false)
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

  const getRoleCount = (role: string) => {
    return users.filter((user) => user.rolebase === role).length
  }

  const LoadingSkeleton = () => (
    <div className="loading-container">
      <div className="skeleton-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-subtitle"></div>
      </div>
      <div className="skeleton-stats">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton-stat-card">
            <div className="skeleton-stat-number"></div>
            <div className="skeleton-stat-label"></div>
          </div>
        ))}
      </div>
      <div className="skeleton-table">
        <div className="skeleton-table-header"></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton-table-row"></div>
        ))}
      </div>
    </div>
  )

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="user-management">
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)}>×</button>
        </div>
      )}

      <div className="user-management-container">
        {/* Header */}
        <div className="header-section">
          <div className="header-content">
            <div className="header-icon">
              <Users />
            </div>
            <div className="header-text">
              <h1>User Management</h1>
              <p>Manage system users and their roles</p>
            </div>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            <Plus />
            Add User
          </button>
        </div>

        {/* User Statistics */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <span className="stat-label">Total Users</span>
                <span className="stat-number">{users.length}</span>
              </div>
              <div className="stat-icon">
                <Users />
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <span className="stat-label">Students</span>
                <span className="stat-number">{getRoleCount("student")}</span>
              </div>
              <div className="stat-icon">
                <User />
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <span className="stat-label">Staff</span>
                <span className="stat-number">{getRoleCount("staff")}</span>
              </div>
              <div className="stat-icon">
                <UserCheck />
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <span className="stat-label">Admins</span>
                <span className="stat-number">{getRoleCount("admin")}</span>
              </div>
              <div className="stat-icon">
                <Users />
              </div>
            </div>
          </div>
        </div>

        <div className="content-grid">
          {/* Users Table Section */}
          <div className="table-section">
            <div className="section-card">
              <div className="section-header">
                <h3>Users List</h3>
                <div className="filters-container">
                  <div className="search-container">
                    <Search className="search-icon" />
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="filter-container">
                    <Filter className="filter-icon" />
                    <select
                      className="filter-select"
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
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
                        <th onClick={() => handleSort("email")} className="sortable">
                          <div className="th-content">
                            <Mail />
                            <span>Email</span>
                            {sortField === "email" && (
                              sortDirection === "asc" ? <ChevronUp /> : <ChevronDown />
                            )}
                          </div>
                        </th>
                        <th onClick={() => handleSort("name")} className="sortable">
                          <div className="th-content">
                            <User />
                            <span>Name</span>
                            {sortField === "name" && (
                              sortDirection === "asc" ? <ChevronUp /> : <ChevronDown />
                            )}
                          </div>
                        </th>
                        <th onClick={() => handleSort("rolebase")} className="sortable">
                          <div className="th-content">
                            <UserCheck />
                            <span>Role</span>
                            {sortField === "rolebase" && (
                              sortDirection === "asc" ? <ChevronUp /> : <ChevronDown />
                            )}
                          </div>
                        </th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedUsers.map((user) => (
                        <tr key={user.email}>
                          <td className="email-cell">{user.email}</td>
                          <td className="name-cell">{user.name}</td>
                          <td>
                            <span className={`role-badge role-${user.rolebase}`}>
                              {user.rolebase.charAt(0).toUpperCase() + user.rolebase.slice(1)}
                            </span>
                          </td>
                          <td>
                            <div className="actions-container">
                              <button
                                className="btn-icon btn-edit"
                                onClick={() => handleEdit(user)}
                                title="Edit user"
                              >
                                <Edit />
                              </button>
                              <button
                                className="btn-icon btn-delete"
                                onClick={() => handleDelete(user.email)}
                                title="Delete user"
                              >
                                <Trash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <Users />
                    </div>
                    <h3>No users found</h3>
                    <p>
                      {searchTerm || roleFilter !== "all"
                        ? "Try adjusting your search or filter criteria."
                        : "Start by adding your first user."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingEmail ? "Edit User" : "Add New User"}</h3>
              <button className="close-btn" onClick={handleCancel}>
                <X />
              </button>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="user-form">
              <div className="form-group">
                <label className="form-label">
                  <Mail />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={handleChange}
                  disabled={!!editingEmail}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <User />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="Enter full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Lock />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder={editingEmail ? "Leave blank to keep current password" : "Enter password"}
                  value={form.password}
                  onChange={handleChange}
                  required={!editingEmail}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <UserCheck />
                  Role
                </label>
                <select
                  name="rolebase"
                  className="form-select"
                  value={form.rolebase}
                  onChange={handleChange}
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
                      className="btn btn-primary"
                      onClick={handleUpdate}
                      disabled={submitting}
                    >
                      {submitting ? "Updating..." : "Update User"}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleAdd}
                      disabled={submitting}
                    >
                      <Plus />
                      {submitting ? "Adding..." : "Add User"}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement
