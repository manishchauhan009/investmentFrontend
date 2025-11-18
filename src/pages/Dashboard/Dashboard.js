import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DarkColors from "../../styles/ColorSchema";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { dashboardService } from "../../services/dashboardService";
import {
  Building,
  LineChart,
  Gem,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Spinner from "../../components/Spinner";

const Dashboard = () => {
  const Colors = DarkColors;

  const [portfolioData, setPortfolioData] = useState([]);
  const [portfolioTotals, setPortfolioTotals] = useState(null);
  const [counts, setCounts] = useState({});
  const [businessInfo, setBusinessInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboardService.getPortfolioSummary();
        if (!res) throw new Error("No data received");

        setCounts(res.counts || {});
        setPortfolioTotals(res.portfolio || {});
        setBusinessInfo(res.totals?.businesses || {});

        setPortfolioData(
          (res.breakdown || []).map((item) => ({
            name: item.category,
            invested: item.invested || 0,
            current: item.current || 0,
            valuation: item.valuation || 0,
            value: item.current || item.valuation || item.invested || 0,
          }))
        );
      } catch (err) {
        console.error("❌ Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Use theme-based accent colors for chart
  const COLORS = [
    Colors.secondary,
    Colors.success,
    "#F59E0B", // warm amber for contrast
    Colors.error,
  ];

  const totalValue = portfolioData.reduce((sum, i) => sum + i.value, 0);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <Spinner />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg" style={{ color: Colors.error }}>
            {error}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div
        className="p-4 sm:p-6 space-y-10"
        style={{ minHeight: "100vh", backgroundColor: Colors.background }}
      >
        {/* Header */}
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: Colors.secondary }}
          >
            Dashboard
          </h1>
          <p
            className="text-sm sm:text-base mt-1"
            style={{ color: Colors.textSecondary }}
          >
            Get insights into your investments, assets, and performance.
          </p>
        </div>

        {/* Portfolio Totals */}
        {portfolioTotals && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div
              className="p-5 sm:p-6 rounded-2xl shadow-lg text-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(15,23,42,0.95))",
                border: "1px solid rgba(59,130,246,0.4)",
              }}
            >
              <h2
                className="text-sm font-semibold"
                style={{ color: Colors.textSecondary }}
              >
                Total Invested
              </h2>
              <p
                className="text-2xl sm:text-3xl font-bold mt-1"
                style={{ color: Colors.textPrimary }}
              >
                ₹{portfolioTotals.invested?.toLocaleString() || 0}
              </p>
            </div>
            <div
              className="p-5 sm:p-6 rounded-2xl shadow-lg text-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(16,185,129,0.22), rgba(15,23,42,0.95))",
                border: "1px solid rgba(16,185,129,0.5)",
              }}
            >
              <h2
                className="text-sm font-semibold"
                style={{ color: Colors.textSecondary }}
              >
                Current Value
              </h2>
              <p
                className="text-2xl sm:text-3xl font-bold mt-1"
                style={{ color: Colors.textPrimary }}
              >
                ₹{portfolioTotals.current?.toLocaleString() || 0}
              </p>
            </div>
            <div
              className="p-5 sm:p-6 rounded-2xl shadow-lg text-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(139,92,246,0.22), rgba(15,23,42,0.95))",
                border: "1px solid rgba(139,92,246,0.5)",
              }}
            >
              <h2
                className="text-sm font-semibold"
                style={{ color: Colors.textSecondary }}
              >
                Overall ROI
              </h2>
              <p
                className="text-2xl sm:text-3xl font-bold mt-1"
                style={{ color: Colors.textPrimary }}
              >
                {isNaN(portfolioTotals.roi)
                  ? "0.0"
                  : portfolioTotals.roi.toFixed(1)}
                %
              </p>
            </div>
          </div>
        )}

        {/* Counts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div
            className="p-4 rounded-2xl shadow text-center"
            style={{ backgroundColor: Colors.card }}
          >
            <Building
              size={22}
              className="mx-auto mb-2"
              style={{ color: Colors.secondary }}
            />
            <p
              className="text-xs sm:text-sm"
              style={{ color: Colors.textSecondary }}
            >
              Real Estate
            </p>
            <p
              className="text-lg sm:text-xl font-bold"
              style={{ color: Colors.textPrimary }}
            >
              {counts.realEstate || 0}
            </p>
          </div>

          <div
            className="p-4 rounded-2xl shadow text-center"
            style={{ backgroundColor: Colors.card }}
          >
            <LineChart
              size={22}
              className="mx-auto mb-2"
              style={{ color: Colors.secondary }}
            />
            <p
              className="text-xs sm:text-sm"
              style={{ color: Colors.textSecondary }}
            >
              Stocks
            </p>
            <p
              className="text-lg sm:text-xl font-bold"
              style={{ color: Colors.textPrimary }}
            >
              {counts.stocks || 0}
            </p>
          </div>

          <div
            className="p-4 rounded-2xl shadow text-center"
            style={{ backgroundColor: Colors.card }}
          >
            <Gem
              size={22}
              className="mx-auto mb-2"
              style={{ color: Colors.secondary }}
            />
            <p
              className="text-xs sm:text-sm"
              style={{ color: Colors.textSecondary }}
            >
              Commodities
            </p>
            <p
              className="text-lg sm:text-xl font-bold"
              style={{ color: Colors.textPrimary }}
            >
              {counts.commodities || 0}
            </p>
          </div>

          <div
            className="p-4 rounded-2xl shadow text-center"
            style={{ backgroundColor: Colors.card }}
          >
            <Briefcase
              size={22}
              className="mx-auto mb-2"
              style={{ color: Colors.secondary }}
            />
            <p
              className="text-xs sm:text-sm"
              style={{ color: Colors.textSecondary }}
            >
              Businesses
            </p>
            <p
              className="text-lg sm:text-xl font-bold"
              style={{ color: Colors.textPrimary }}
            >
              {counts.businesses || 0}
            </p>
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {portfolioData.map((card, index) => {
            const roi =
              card.invested > 0
                ? (
                    ((card.current - card.invested) / card.invested) *
                    100
                  ).toFixed(1)
                : null;

            const roiNum = roi !== null ? parseFloat(roi) : null;

            return (
              <div
                key={index}
                className="p-5 rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-1"
                style={{ backgroundColor: Colors.card }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                      color: "#FFFFFF",
                    }}
                  >
                    {card.name === "Real Estate" && <Building size={22} />}
                    {card.name === "Stocks" && <LineChart size={22} />}
                    {card.name === "Commodities" && <Gem size={22} />}
                    {card.name === "Businesses" && <Briefcase size={22} />}
                  </div>
                  <h2
                    className="font-semibold text-lg"
                    style={{ color: Colors.textPrimary }}
                  >
                    {card.name}
                  </h2>
                </div>

                <p
                  className="mt-2 text-sm"
                  style={{ color: Colors.textSecondary }}
                >
                  Value:{" "}
                  <span
                    className="font-bold"
                    style={{ color: Colors.textPrimary }}
                  >
                    ₹{card.value.toLocaleString()}
                  </span>
                </p>

                {roiNum !== null && !isNaN(roiNum) && (
                  <p
                    className={`font-bold mt-1 flex items-center gap-1 text-sm ${
                      roiNum >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    ROI: {roiNum}%
                    {roiNum >= 0 ? (
                      <ArrowUpRight size={16} />
                    ) : (
                      <ArrowDownRight size={16} />
                    )}
                  </p>
                )}

                <p
                  className="text-xs sm:text-sm mt-1"
                  style={{ color: Colors.textSecondary }}
                >
                  Share:{" "}
                  {totalValue > 0
                    ? ((card.value / totalValue) * 100).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
            );
          })}
        </div>

        {/* Business Insights */}
        {businessInfo && (
          <div
            className="p-5 sm:p-6 rounded-2xl shadow-lg mt-4 sm:mt-6"
            style={{ backgroundColor: Colors.card }}
          >
            <h2
              className="font-semibold mb-4 text-lg"
              style={{ color: Colors.secondary }}
            >
              Business Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="p-4 rounded-lg text-center"
                style={{ backgroundColor: Colors.primary }}
              >
                <p
                  className="text-xs sm:text-sm"
                  style={{ color: Colors.textSecondary }}
                >
                  Valuation
                </p>
                <p
                  className="text-lg sm:text-xl font-bold"
                  style={{ color: Colors.textPrimary }}
                >
                  ₹{businessInfo.valuation?.toLocaleString() || 0}
                </p>
              </div>
              <div className="p-4 rounded-lg text-center"
                style={{ backgroundColor: Colors.primary }}
              >
                <p
                  className="text-xs sm:text-sm"
                  style={{ color: Colors.textSecondary }}
                >
                  Revenue
                </p>
                <p
                  className="text-lg sm:text-xl font-bold"
                  style={{ color: Colors.textPrimary }}
                >
                  ₹{businessInfo.revenue?.toLocaleString() || 0}
                </p>
              </div>
              <div className="p-4 rounded-lg text-center"
                style={{ backgroundColor: Colors.primary }}
              >
                <p
                  className="text-xs sm:text-sm"
                  style={{ color: Colors.textSecondary }}
                >
                  Net Profit
                </p>
                <p
                  className="text-lg sm:text-xl font-bold"
                  style={{ color: Colors.textPrimary }}
                >
                  ₹{businessInfo.netProfit?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Pie Chart */}
        <div
          className="p-5 sm:p-6 rounded-2xl shadow-lg mt-6 sm:mt-10"
          style={{ backgroundColor: Colors.card }}
        >
          <h2
            className="font-semibold mb-4 text-lg"
            style={{ color: Colors.secondary }}
          >
            Portfolio Allocation
          </h2>
          <div className="w-full h-72 sm:h-80 flex justify-center items-center">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill={Colors.primary}
                  dataKey="value"
                  label={({ percent }) =>
                    `${(percent * 100).toFixed(0)}%`
                  }
                >
                  {portfolioData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => `₹${v.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: Colors.primary,
                    borderColor: Colors.secondary,
                    color: Colors.textPrimary,
                  }}
                />
                <Legend
                  wrapperStyle={{
                    color: Colors.textSecondary,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
