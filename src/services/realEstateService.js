// frontend/src/services/realEstateService.js
import API from "./api"; // ✅ use centralized instance

const API_URL = "real-estate"; // baseURL already has /api/v1/

export const realEstateService = {
  // Get all properties
  getAllProperties: async () => {
    const res = await API.get(API_URL);
    return res.data;
  },

  // Add new property
  addProperty: async (property) => {
    const res = await API.post(API_URL, property);
    return res.data;
  },

  // Update property
  updateProperty: async (id, property) => {
    const res = await API.put(`${API_URL}/${id}`, property);
    return res.data;
  },

  // Delete property
  deleteProperty: async (id) => {
    const res = await API.delete(`${API_URL}/${id}`);
    return res.data.success;
  },
};
