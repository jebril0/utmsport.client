import axios from "axios";

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