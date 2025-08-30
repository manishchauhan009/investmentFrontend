import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DarkColors from "../../styles/ColorSchema";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
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

        // 🔹 Set states
        setCounts(res.counts || {});
        setPortfolioTotals(res.portfolio || {});
        setBusinessInfo(res.totals?.businesses || {});

        // 🔹 Format breakdown for charts/cards
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

  const COLORS = [Colors.primary, Colors.secondary, Colors.accent, "#8884d8"];
  const totalValue = portfolioData.reduce((sum, i) => sum + i.value, 0,);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <Spinner />
        </div>
      </DashboardLayout>
    );
  }

  // 🔹 Error State
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-10" style={{ minHeight: "100vh" }}>
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold" style={{ color: Colors.secondary }}>
            Dashboard
          </h1>
          <p className="text-sm" style={{ color: Colors.textSecondary }}>
            Get insights into your investments, assets, and performance
          </p>
        </div>

        {/* Portfolio Totals */}
        {portfolioTotals && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl shadow-lg text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <h2 className="text-lg font-semibold">Total Invested</h2>
              <p className="text-2xl font-bold mt-1">
                ₹{portfolioTotals.invested?.toLocaleString() || 0}
              </p>
            </div>
            <div className="p-6 rounded-2xl shadow-lg text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <h2 className="text-lg font-semibold">Current Value</h2>
              <p className="text-2xl font-bold mt-1">
                ₹{portfolioTotals.current?.toLocaleString() || 0}
              </p>
            </div>
            <div className="p-6 rounded-2xl shadow-lg text-center bg-gradient-to-r from-purple-500 to-pink-600 text-white">
              <h2 className="text-lg font-semibold">Overall ROI</h2>
              <p className="text-2xl font-bold mt-1">
                {isNaN(portfolioTotals.roi) ? "0.0" : portfolioTotals.roi.toFixed(1)}%
              </p>
            </div>
          </div>
        )}

        {/* Counts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-4 rounded-2xl shadow bg-gray-800 text-center text-white">
            <Building size={22} className="mx-auto mb-2" />
            <p className="text-sm">Real Estate</p>
            <p className="text-lg font-bold">{counts.realEstate || 0}</p>
          </div>
          <div className="p-4 rounded-2xl shadow bg-gray-800 text-center text-white">
            <LineChart size={22} className="mx-auto mb-2" />
            <p className="text-sm">Stocks</p>
            <p className="text-lg font-bold">{counts.stocks || 0}</p>
            {/* Optional: show total quantity */}
            {portfolioData.find(d => d.name === "Stocks")?.quantity && (
              <p className="text-xs text-gray-400">
                Qty: {portfolioData.find(d => d.name === "Stocks").quantity}
              </p>
            )}
          </div>
          <div className="p-4 rounded-2xl shadow bg-gray-800 text-center text-white">
            <Gem size={22} className="mx-auto mb-2" />
            <p className="text-sm">Commodities</p>
            <p className="text-lg font-bold">{counts.commodities || 0}</p>
          </div>
          <div className="p-4 rounded-2xl shadow bg-gray-800 text-center text-white">
            <Briefcase size={22} className="mx-auto mb-2" />
            <p className="text-sm">Businesses</p>
            <p className="text-lg font-bold">{counts.businesses || 0}</p>
          </div>
        </div>


        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {portfolioData.map((card, index) => {
            const roi =
              card.invested > 0
                ? (((card.current - card.invested) / card.invested) * 100).toFixed(1)
                : null;

            return (
              <div
                key={index}
                className="p-5 rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-1 bg-gray-900 text-white"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                      color: "white",
                    }}
                  >
                    {card.name === "Real Estate" && <Building size={22} />}
                    {card.name === "Stocks" && <LineChart size={22} />}
                    {card.name === "Commodities" && <Gem size={22} />}
                    {card.name === "Businesses" && <Briefcase size={22} />}
                  </div>
                  <h2 className="font-semibold text-lg">{card.name}</h2>
                </div>

                <p className="mt-2 text-gray-300">
                  Value:{" "}
                  <span className="font-bold text-white">
                    ₹{card.value.toLocaleString()}
                  </span>
                </p>
                {roi && (
                  <p
                    className={`font-bold mt-1 flex items-center gap-1 ${roi >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                  >
                    ROI: {roi}%
                    {roi >= 0 ? (
                      <ArrowUpRight size={16} />
                    ) : (
                      <ArrowDownRight size={16} />
                    )}
                  </p>
                )}
                <p className="text-gray-400">
                  Share: {totalValue > 0 ? ((card.value / totalValue) * 100).toFixed(1) : 0}%
                </p>
              </div>
            );
          })}
        </div>

        {/* Business Insights */}
        {businessInfo && (
          <div className="p-6 rounded-2xl shadow-lg mt-6 bg-gray-900 text-white">
            <h2 className="font-semibold mb-4 text-lg text-indigo-400">Business Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-gray-800 text-center">
                <p className="text-sm text-gray-400">Valuation</p>
                <p className="text-lg font-bold">₹{businessInfo.valuation?.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-800 text-center">
                <p className="text-sm text-gray-400">Revenue</p>
                <p className="text-lg font-bold">₹{businessInfo.revenue?.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-800 text-center">
                <p className="text-sm text-gray-400">Net Profit</p>
                <p className="text-lg font-bold">₹{businessInfo.netProfit?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Pie Chart */}
        <div className="p-6 rounded-2xl shadow-lg mt-10 bg-gray-900 text-white">
          <h2 className="font-semibold mb-4 text-lg text-indigo-400">Portfolio Allocation</h2>
          <div className="w-full h-80 flex justify-center items-center ">
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
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {portfolioData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
