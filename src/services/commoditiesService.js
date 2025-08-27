// services/commoditiesService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/commodities"; // Update if your server runs on another port

export const getCommodities = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addCommodity = async (commodity) => {
  const response = await axios.post(API_URL, commodity);
  return response.data;
};

export const updateCommodity = async (id, commodity) => {
  const response = await axios.put(`${API_URL}/${id}`, commodity);
  return response.data;
};

export const deleteCommodity = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
