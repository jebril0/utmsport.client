import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5320/api/timeslots', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export const timeSlotsApi = {
  getTimeSlotsByVenue: (venueName: string) => apiClient.get(`/venue/${venueName}`),
  createTimeSlot: (venueName: string, timeSlot: any) => apiClient.post(`/${venueName}`, timeSlot),
  deleteTimeSlot: (venueName: string, startTime: string, endTime: string) =>
    apiClient.delete(`/${venueName}/${startTime}/${endTime}`),
};