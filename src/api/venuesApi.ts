import axios from "axios";

const API_BASE_URL = "http://localhost:5320/api/venues";

// Types that match the backend DTOs
export interface TimeSlotDTO {
  id: number;
  venueName: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}
export interface VenueForList {
    id: number;
    name: string;
    location: string;
    capacity: number;
    type: string;
    status: boolean;
    timeSlots: {
      id: number;
      startTime: string;
      endTime: string;
      isAvailable: boolean;
    }[];
  }
  
export interface VenuesDTO {
  name: string;
  location: string;
  capacity: number;
  type: string;
  status: boolean;
}

export interface VenueWithTimeSlotsResponse {
  venue: VenuesDTO;
  timeSlots: TimeSlotDTO[];
}

export interface VenuesCreateUpdateDTO {
  name: string;
  location: string;
  capacity: number;
  type: string;
  status: boolean;
}

// Get all venues with their time slots
export const getVenues = async () => {
  const response = await axios.get<VenueWithTimeSlotsResponse[]>(API_BASE_URL);
  
  // Transform the data to match the format expected by BookingVenuList
  return response.data.map((item, index) => ({
    id: index + 1, // Generate an id since backend doesn't provide one
    name: item.venue.name,
    location: item.venue.location,
    capacity: item.venue.capacity,
    type: item.venue.type,
    status: item.venue.status,
    timeSlots: item.timeSlots.map(ts => ({
      id: ts.id,
      startTime: ts.startTime,
      endTime: ts.endTime,
      isAvailable: ts.isAvailable
    }))
  }));
};

// Get a specific venue with its time slots
export const getVenueWithTimeSlots = async (name: string) => {
  const response = await axios.get<VenueWithTimeSlotsResponse>(`${API_BASE_URL}/${name}/timeslots`);
  
  return {
    id: 1, // Generate an id since backend doesn't provide one
    name: response.data.venue.name,
    location: response.data.venue.location,
    capacity: response.data.venue.capacity,
    type: response.data.venue.type,
    status: response.data.venue.status,
    timeSlots: response.data.timeSlots.map(ts => ({
      id: ts.id,
      startTime: ts.startTime,
      endTime: ts.endTime,
      isAvailable: ts.isAvailable
    }))
  };
};

// Create a new venue
export const createVenue = async (venueData: VenuesCreateUpdateDTO) => {
  const response = await axios.post(API_BASE_URL, venueData);
  return response.data;
};

// Update an existing venue
export const updateVenue = async (name: string, venueData: VenuesCreateUpdateDTO) => {
  const response = await axios.put(`${API_BASE_URL}/${name}`, venueData);
  return response.data;
};

// Delete a venue
export const deleteVenue = async (name: string) => {
  const response = await axios.delete(`${API_BASE_URL}/${name}`);
  return response.data;
};

// Book a time slot (this would need to be implemented in your backend)
export const bookTimeSlot = async ({ timeSlotID, userEmail }: { timeSlotID: number; userEmail: string }) => {
  const response = await axios.post("http://localhost:5320/api/bookings", {
    timeSlotID,
    userEmail
  });
  return response.data;
};