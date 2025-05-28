"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { getVenues, bookTimeSlot, type VenueForList } from "../../api/venuesApi" // Updated import
import BookingVenu from "../BookingVenu/BookingVenu"
import "./BookingVenuList.css"

const BookingVenuList = () => {
  const [venues, setVenues] = useState<VenueForList[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("") // State for venue name search query
  const [categoryQuery, setCategoryQuery] = useState<string>("") // State for venue category search query
  const [filteredVenues, setFilteredVenues] = useState<VenueForList[]>([]) // State for filtered venues
  const [loading, setLoading] = useState<boolean>(true)

  // Fetch all venues
  const fetchVenues = async () => {
    setLoading(true)
    try {
      const response = await getVenues()
      setVenues(response)
      setFilteredVenues(response) // Initialize filtered venues
    } catch (error) {
      console.error("Error fetching venues:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle booking a time slot
  const handleBook = async (timeSlotID: number) => {
    try {
      const userEmail = "kamel@graduate.utm.my" // Replace with the logged-in user's email
      await bookTimeSlot({ timeSlotID, userEmail })
      alert("Booking successful!")
      fetchVenues() // Refresh the venues after booking
    } catch (error) {
      console.error("Error booking time slot:", error)
      alert("Failed to book the time slot.")
    }
  }

  // Handle search by venue name
  const handleNameSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)
    filterVenues(query, categoryQuery)
  }

  // Handle search by venue category
  const handleCategorySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setCategoryQuery(query)
    filterVenues(searchQuery, query)
  }

  // Filter venues based on name and category
  const filterVenues = (nameQuery: string, categoryQuery: string) => {
    const filtered = venues.filter(
      (venue) => venue.name.toLowerCase().includes(nameQuery) && venue.type.toLowerCase().includes(categoryQuery),
    )
    setFilteredVenues(filtered)
  }

  useEffect(() => {
    fetchVenues()
  }, [])

  return (
    <div className="booking-list-container">
      <h1>Available Venues</h1>

      <div className="search-container">
        {/* Search Bar for Venue Name */}
        <input type="text" placeholder="Search by venue name" value={searchQuery} onChange={handleNameSearch} />

        {/* Search Bar for Venue Category */}
        <input
          type="text"
          placeholder="Search by venue category"
          value={categoryQuery}
          onChange={handleCategorySearch}
        />
      </div>

      {loading ? (
        <div className="loading">Loading venues...</div>
      ) : filteredVenues.length > 0 ? (
        <div className="booking-container">
          {filteredVenues.map((venue) => (
            <BookingVenu
            key={venue.id}
            name={venue.name}
            image="/Image/360_F_333141947_xz1nD223W2f9EW43iZbjGqCRFC3WAgTy.jpg"
            location={venue.location}
            capacity={venue.capacity}
            type={venue.type}
            status={venue.status}
            availableTimeSlots={venue.timeSlots.filter((slot) => slot.isAvailable)}
            onBook={handleBook}
          />
          
          ))}
        </div>
      ) : (
        <div className="no-results">
          <p>No venues found matching your search criteria.</p>
        </div>
      )}
    </div>
  )
}

export default BookingVenuList
