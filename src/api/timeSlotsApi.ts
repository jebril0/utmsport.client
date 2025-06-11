import axios from 'axios';

// Enable cookies for all requests
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


const API_BASE_URL = 'http://localhost:5320/api/timeslots';

export const timeSlotsApi = {
  // Get all time slots for a specific venue
  getTimeSlotsByVenue: async (venueName: string) => {
    const response = await axios.get(`${API_BASE_URL}/venue/${venueName}`);
    return response.data;
  },

  // Create a new time slot for a specific venue
  createTimeSlot: async (venueName: string, timeSlot: { startTime: string; endTime: string }) => {
    const response = await axios.post(`${API_BASE_URL}/${venueName}`, timeSlot);
    return response.data;
  },

  // Delete a time slot by venue name, start time, and end time
  deleteTimeSlot: async (venueName: string, startTime: string, endTime: string) => {
    const response = await axios.delete(`${API_BASE_URL}/${venueName}/${startTime}/${endTime}`);
    return response.data;
  },
};