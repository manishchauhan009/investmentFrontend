// frontend/src/services/stockService.js
import API from "./api";

const API_URL = "stocks"; // baseURL already has /api/v1/

export const getStocks = async () => {
  const res = await API.get(API_URL);
  return res.data.data;
};

export const addStock = async (stock) => {
  const res = await API.post(API_URL, stock);
  return res.data.data;
};

export const updateStock = async (id, stock) => {
  const res = await API.put(`${API_URL}/${id}`, stock);
  return res.data.data;
};

export const deleteStock = async (id) => {
  const res = await API.delete(`${API_URL}/${id}`);
  return res.data.data;
};
