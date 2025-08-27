import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/businesses"; // Update if your backend URL is different

// GET all businesses
export const getBusinessData = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch businesses:", error);
    throw error;
  }
};

// POST new business
export const addBusiness = async (business) => {
  try {
    const res = await axios.post(API_URL, business);
    return res.data;
  } catch (error) {
    console.error("Failed to add business:", error);
    throw error;
  }
};

// PUT update business
export const updateBusiness = async (id, business) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, business);
    return res.data;
  } catch (error) {
    console.error("Failed to update business:", error);
    throw error;
  }
};

// DELETE business
export const deleteBusiness = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Failed to delete business:", error);
    throw error;
  }
};
