import axios from "axios";

// Enable cookies for all requests
axios.defaults.withCredentials = true;

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

export const getAllVenuesWithTimeSlots = async () => {
  try {
    const response = await axios.get<VenueWithTimeSlotsResponse[]>(`${API_BASE_URL}`);
    console.log("Raw venue data from API:", response.data);

    const flattened: VenueForList[] = response.data.map((item, index) => ({
      id: index + 1, // 👈 Fake ID starts from 1
      name: item.venue.name,
      location: item.venue.location,
      capacity: item.venue.capacity,
      type: item.venue.type,
      status: item.venue.status,
      timeSlots: item.timeSlots.map(slot => ({
        id: slot.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isAvailable: slot.isAvailable,
      })),
    }));

    return flattened;
  } catch (error) {
    console.error("Error fetching venues with time slots:", error);
    throw error;
  }
};

// Get a specific venue with its time slots
export const getVenueWithTimeSlots = async (name: string) => {
  const response = await axios.get<VenueWithTimeSlotsResponse>(`${API_BASE_URL}/${name}/timeslots`);
  return response.data;
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

// Book a time slot
export const bookTimeSlot = async ({ timeSlotID, userEmail }: { timeSlotID: number; userEmail: string }) => {
  const response = await axios.post("http://localhost:5320/api/bookings", {
    timeSlotID,
    userEmail,
  });
  return response.data;
};