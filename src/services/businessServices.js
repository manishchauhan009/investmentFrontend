import API from "./api";

export const getBusinessData = async () => {
  const res = await API.get("businesses");
  return res.data;
};

export const addBusiness = async (business) => {
  const res = await API.post("businesses", business);
  return res.data;
};

export const updateBusiness = async (id, business) => {
  const res = await API.put(`businesses/${id}`, business);
  return res.data;
};

export const deleteBusiness = async (id) => {
  const res = await API.delete(`businesses/${id}`);
  return res.data;
};
