import API from "./api";

export const getCommodities = async () => {
  const res = await API.get("commodities");
  return res.data;
};

export const addCommodity = async (commodity) => {
  const res = await API.post("commodities", commodity);
  return res.data;
};

export const updateCommodity = async (id, commodity) => {
  const res = await API.put(`commodities/${id}`, commodity);
  return res.data;
};

export const deleteCommodity = async (id) => {
  const res = await API.delete(`commodities/${id}`);
  return res.data;
};
