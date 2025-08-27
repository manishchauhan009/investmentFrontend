// frontend/src/services/stockService.js
import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL + "api/v1/stocks";

export const getStocks = async () => {
  const res = await axios.get(API_URL);
  return res.data.data; // ✅ only return the array
};

export const addStock = async (stock) => {
  const res = await axios.post(API_URL, stock);
  return res.data.data;
};

export const updateStock = async (id, stock) => {
  const res = await axios.put(`${API_URL}/${id}`, stock);
  return res.data.data;
};

export const deleteStock = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data.data;
};
