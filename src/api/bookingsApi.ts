import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5320/api/bookings', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export const bookingsApi = {
  getAllBookings: () => apiClient.get('/'),
  getBookingsByEmail: (email: string) => apiClient.get(`/user/${email}`),
  createBooking: (booking: any) => apiClient.post('/', booking),
  deleteBooking: (email: string, venueName: string, startTime: string, endTime: string) =>
    apiClient.delete(`/user/${email}/venue/${venueName}/time`, {
      params: { startTime, endTime },
    }),
  acceptPayment: (email: string, venueName: string, startTime: string, endTime: string) =>
    apiClient.put('/accept', null, {
      params: { email, venueName, startTime, endTime },
    }),
  rejectPayment: (email: string, venueName: string, startTime: string, endTime: string) =>
    apiClient.put('/reject', null, {
      params: { email, venueName, startTime, endTime },
    }),
};