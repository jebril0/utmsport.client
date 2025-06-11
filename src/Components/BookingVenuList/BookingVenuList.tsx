"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { getAllVenuesWithTimeSlots, type VenueForList } from "../../api/venuesApi"
import BookingVenu from "../BookingVenu/BookingVenu"
import "./BookingVenuList.css"

const BookingVenuList: React.FC = () => {
  const [venues, setVenues] = useState<VenueForList[]>([])
  const [filteredVenues, setFilteredVenues] = useState<VenueForList[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryQuery, setCategoryQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const data = await getAllVenuesWithTimeSlots()
        console.log("Fetched Venues:", data) // Log the fetched data
        setVenues(data)
        setFilteredVenues(data)
      } catch (err) {
        setError("Failed to load venues. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchVenues()
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)
    filterVenues(query, categoryQuery)
  }

  const handleCategorySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setCategoryQuery(query)
    filterVenues(searchQuery, query)
  }

  const filterVenues = (nameQuery: string, categoryQuery: string) => {
    if (!venues || venues.length === 0) {
      setFilteredVenues([])
      return
    }

    const filtered = venues.filter(
      (venue) =>
        (venue.name.toLowerCase().includes(nameQuery) || venue.location.toLowerCase().includes(nameQuery)) &&
        venue.type.toLowerCase().includes(categoryQuery),
    )
    setFilteredVenues(filtered)
  }

  return (
    <div className="booking-list-container">
      <h1>Book a Venue</h1>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by venue name or location..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <input
          type="text"
          placeholder="Search by venue category..."
          value={categoryQuery}
          onChange={handleCategorySearch}
        />
      </div>

      {/* Loading state */}
      {loading && (
        <div className="loading">
          <p>Loading venues...</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {/* Venue List */}
      {!loading && !error && filteredVenues.length > 0 ? (
        <div className="booking-container">
          {filteredVenues.map((venue) => (
            <BookingVenu key={venue.id} venue={venue} />
          ))}
        </div>
      ) : !loading && !error ? (
        <div className="no-results">
          <p>No venues found matching your search criteria.</p>
        </div>
      ) : null}
    </div>
  )
}

export default BookingVenuList
