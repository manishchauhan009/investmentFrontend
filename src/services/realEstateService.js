import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL + "api/v1/real-estate";

export const realEstateService = {
  // Get all properties
  getAllProperties: async () => {
    const res = await axios.get(API_URL);
    return res.data 
  },


  // Add new property
  addProperty: async (property) => {
    const res = await axios.post(API_URL, property);
    return res.data; // ⬅️ return created property
  },

  // Update property
  updateProperty: async (id, property) => {
    const res = await axios.put(`${API_URL}/${id}`, property);
    return res.data; // ⬅️ updated property
  },

  // Delete property
  deleteProperty: async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data.success; // ⬅️ just return true/false
  },
};
