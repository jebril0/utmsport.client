import axios from "axios";

// Enable cookies for all requests
axios.defaults.withCredentials = true;

const API_BASE_URL = "http://localhost:5320/api/bookings";

export const getAllBookings = async () => {
  const response = await axios.get(`${API_BASE_URL}`);
  return response.data;
};

export const getBookingsByEmail = async (email: string) => {
  const response = await axios.get(`${API_BASE_URL}/user/${email}`);
  return response.data;
};

export const createBooking = async (booking: FormData) => {
  const response = await axios.post(`${API_BASE_URL}`, booking, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteBooking = async (
  email: string,
  venueName: string,
  startTime: string,
  endTime: string
) => {
  const response = await axios.delete(`${API_BASE_URL}/user/${email}/venue/${venueName}/time`, {
    params: { startTime, endTime },
  });
  return response.data;
};

export const acceptPayment = async (
  email: string,
  venueName: string,
  startTime: string,
  endTime: string
) => {
  const response = await axios.put(`${API_BASE_URL}/accept`, null, {
    params: { email, venueName, startTime, endTime },
  });
  return response.data;
};

export const rejectPayment = async (
  email: string,
  venueName: string,
  startTime: string,
  endTime: string
) => {
  const response = await axios.put(`${API_BASE_URL}/reject`, null, {
    params: { email, venueName, startTime, endTime },
  });
  return response.data;
};

export const cancelBooking = async (
  email: string,
  venueName: string,
  startTime: string,
  endTime: string
) => {
  console.log("CancelBooking API called with:", { email, venueName, startTime, endTime });
  const response = await axios.delete(`${API_BASE_URL}/cancel`, {
    params: { email, venueName, startTime, endTime },
  });
  return response.data;
};