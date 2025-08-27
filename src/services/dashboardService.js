import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL + "api/v1/dashboard";

export const dashboardService = {
  getPortfolioSummary: async () => {
    try {
      const res = await axios.get(API_URL);

      if (res.data.success && res.data.data) {
        return res.data.data; // 🔹 Return whole data object
      }

      return null;
    } catch (error) {
      console.error("❌ Error fetching dashboard summary:", error.message);
      return null;
    }
  },
};
