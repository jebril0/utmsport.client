import React, { useEffect, useState } from 'react'
import BookingVenuList from '../../Components/BookingVenuList/BookingVenuList'
import { getCurrentUser } from '../../api/usersApi'
import { useNavigate } from 'react-router-dom'

interface Props  {}

const BookingPage = (props: Props) => {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getCurrentUser()
      .then(user => {
        // Type guard to ensure user has a 'role' property
        if (
          typeof user !== "object" ||
          user === null ||
          !("role" in user) ||
          (user as any).role !== "admin" &&
          (user as any).role !== "staff" &&
          (user as any).role !== "student"
        ) {
          navigate("/login")
        }
        setLoading(false)
      })
      .catch(() => {
        navigate("/login")
      })
  }, [navigate])

  if (loading) return <div>Loading...</div>

  return (
    <div><BookingVenuList/></div>
  )
}

export default BookingPage