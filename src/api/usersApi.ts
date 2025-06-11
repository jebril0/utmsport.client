import axios from "axios";

// Enable cookies for all requests
axios.defaults.withCredentials = true;

const API_BASE_URL = "http://localhost:5320/api/users";

export interface LoginResponse {
  message: string;
  user: {
    email: string;
    name: string;
    rolebase: string;
  };
}

export const registerUser = async (userData: { email: string; password: string; name: string }) => {
  const response = await axios.post(API_BASE_URL, { ...userData, rolebase: "student" });
  return response.data;
};

export const registerUser_for_admin = async (userData: { email: string; password: string; name: string }) => {
  const response = await axios.post(`${API_BASE_URL}/create-for-admin`, { ...userData, rolebase: "student" });
  return response.data;
};

export const loginUser = async (userData: { email: string; password: string; rolebase: string }): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_BASE_URL}/login`, userData);
  return response.data;
};

export const getUserByEmail = async (email: string) => {
  const response = await axios.get(`${API_BASE_URL}/${email}`);
  return response.data;
};

export const updateUser = async (email: string, userData: { name: string; password: string; rolebase: string }) => {
  const response = await axios.put(`${API_BASE_URL}/${email}`, userData);
  return response.data;
};

export const deleteUser = async (email: string) => {
  const response = await axios.delete(`${API_BASE_URL}/${email}`);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

// 👇 Add this function to get the current user (from /me endpoint)
export const getCurrentUser = async () => {
  const response = await axios.get(`${API_BASE_URL}/me`);
  return response.data; // { email, role }
};

export const logoutUser = async () => {
  const response = await axios.post(`${API_BASE_URL}/logout`);
  return response.data;
};

// Toggle login lockout
export const toggleLoginLockout = async (enable: boolean) => {
  const response = await axios.post("http://localhost:5320/api/users/toggle-login-lockout", enable, {
    headers: { "Content-Type": "application/json" }
  });
  return response.data;
};

export const toggleMaintenanceMode = async (enable: boolean) => {
  const response = await axios.post(`${API_BASE_URL}/toggle-maintenance-mode`, enable, {
    headers: { "Content-Type": "application/json" }
  });
  return response.data;
};

export const getMaintenanceModeStatus = async () => {
  const response = await axios.get(`${API_BASE_URL}/maintenance-mode-status`);
  return response.data;
};

// Add OTP generation function
export const generateOtp = async (email: string) => {
  const response = await axios.post(`${API_BASE_URL}/generate-otp/${email}`);
  return response.data;
};

// Add OTP verification function
export const verifyOtp = async (email: string, otp: number) => {
  const response = await axios.post(`${API_BASE_URL}/verify-otp`, { email, otp });
  return response.data;
};

// Add function to request OTP for password reset
export const requestPasswordResetOtp = async (email: string) => {
  const response = await axios.post(`${API_BASE_URL}/request-password-reset-otp`, email, {
    headers: { "Content-Type": "application/json" }
  });
  return response.data;
};

// Add function to reset password using OTP
export const resetPassword = async (data: { email: string; otp: number; newPassword: string }) => {
  const response = await axios.post(`${API_BASE_URL}/reset-password`, data);
  return response.data;
};