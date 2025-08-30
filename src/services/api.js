import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL + "api/v1/",
});

// 🔑 Add token automatically to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
