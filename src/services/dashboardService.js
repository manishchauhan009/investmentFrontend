import API from "./api";

export const dashboardService = {
  getPortfolioSummary: async () => {
    try {
      const res = await API.get("dashboard");

      if (res.data.success && res.data.data) {
        return res.data.data;
      }

      return null;
    } catch (error) {
      console.error("❌ Error fetching dashboard summary:", error.message);
      return null;
    }
  },
};
