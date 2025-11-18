import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DarkColors from "../../styles/ColorSchema";
import { Plus, Edit, Trash2, Check } from "lucide-react";
import {
  getBusinessData,
  addBusiness,
  updateBusiness,
  deleteBusiness,
} from "../../services/businessServices";
import Spinner from "../../components/Spinner";

const Businesses = () => {
  const Colors = DarkColors;
  const [businesses, setBusinesses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 💰 Cash pile state for businesses
  const [cashPile, setCashPile] = useState(0);
  const [cashToAdd, setCashToAdd] = useState("");

  // Load businesses on mount
  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const data = await getBusinessData();
      setBusinesses(data);
    } catch (error) {
      console.error("❌ Failed to fetch businesses:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Load & persist cash pile to localStorage
  useEffect(() => {
    const stored = localStorage.getItem("businessesCashPile");
    if (stored) {
      const parsed = Number(stored);
      if (!isNaN(parsed)) setCashPile(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("businessesCashPile", cashPile.toString());
  }, [cashPile]);

  // Handle input changes
  const handleChange = (id, field, value) => {
    const numericFields = ["valuation", "revenue", "netProfit"];
    const parsedValue = numericFields.includes(field) ? Number(value) : value;
    setBusinesses((prev) =>
      prev.map((b) => (b._id === id ? { ...b, [field]: parsedValue } : b))
    );
  };

  // Start editing
  const handleEdit = (id) => setEditingId(id);

  // Delete business
  const handleDelete = async (biz) => {
    try {
      if (!biz.isNew) await deleteBusiness(biz._id);
      setBusinesses((prev) => prev.filter((b) => b._id !== biz._id));
      if (editingId === biz._id) setEditingId(null);
    } catch (error) {
      console.error("❌ Failed to delete business:", error);
    }
  };

  const handleAdd = () => {
    const newBiz = {
      _id: `new-${Date.now()}`, // temporary id
      name: "New Business",
      industry: "unknown",
      valuation: 0,
      ownership: "0%",
      revenue: 0,
      netProfit: 0,
      status: "Active",
      isNew: true,
    };

    setBusinesses((prev) => [newBiz, ...prev]);
    setEditingId(newBiz._id);
  };

  const handleSave = async (biz) => {
    try {
      let savedBiz;
      if (biz.isNew) {
        const { isNew, ...payload } = biz;
        savedBiz = await addBusiness(payload);
      } else {
        savedBiz = await updateBusiness(biz._id, biz);
      }

      setBusinesses((prev) =>
        prev.map((b) => (b._id === biz._id ? savedBiz : b))
      );
      setEditingId(null);
    } catch (error) {
      console.error("❌ Failed to save business:", error);
    }
  };

  // 💰 Handle cash pile addition
  const handleAddCashPile = () => {
    const amount = Number(cashToAdd);
    if (isNaN(amount)) return;
    setCashPile((prev) => prev + amount);
    setCashToAdd("");
  };

  // 🔢 Helper to parse ownership like "25%" or "25"
  const parseOwnership = (ownership) => {
    if (!ownership) return 0;
    const cleaned = ownership.toString().replace("%", "");
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  // 📊 Totals
  const totals = businesses.reduce(
    (acc, biz) => {
      const valuation = biz.valuation || 0;
      const revenue = biz.revenue || 0;
      const netProfit = biz.netProfit || 0;
      const ownershipPercent = parseOwnership(biz.ownership);
      const stakeValue = valuation * (ownershipPercent / 100);

      acc.totalValuation += valuation;
      acc.totalStakeValue += stakeValue;
      acc.totalRevenue += revenue;
      acc.totalNetProfit += netProfit;

      return acc;
    },
    {
      totalValuation: 0,
      totalStakeValue: 0,
      totalRevenue: 0,
      totalNetProfit: 0,
    }
  );

  const totalProfitMargin = totals.totalRevenue
    ? ((totals.totalNetProfit / totals.totalRevenue) * 100).toFixed(2)
    : 0;

  const totalPortfolioValue = totals.totalStakeValue + cashPile;

  // Full-screen spinner only when first loading and nothing yet
  if (loading && businesses.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <Spinner />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6 min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: Colors.secondary }}
            >
              Business Investments
            </h1>
            <p
              className="text-sm sm:text-base"
              style={{ color: Colors.textSecondary }}
            >
              Track your business holdings, valuations, and performance.
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded-xl flex items-center gap-2 shadow-md hover:scale-105 transition text-sm sm:text-base"
            style={{ backgroundColor: Colors.primary, color: "#fff" }}
          >
            <Plus size={18} /> Add Business
          </button>
        </div>

        {/* 📊 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            className="rounded-xl p-4 shadow-md flex flex-col gap-1"
            style={{ backgroundColor: Colors.card }}
          >
            <span
              className="text-xs sm:text-sm"
              style={{ color: Colors.textSecondary }}
            >
              Total Valuation (All Businesses)
            </span>
            <span
              className="text-lg sm:text-xl font-semibold"
              style={{ color: Colors.textPrimary }}
            >
              ₹{totals.totalValuation.toLocaleString()}
            </span>
          </div>

          <div
            className="rounded-xl p-4 shadow-md flex flex-col gap-1"
            style={{ backgroundColor: Colors.card }}
          >
            <span
              className="text-xs sm:text-sm"
              style={{ color: Colors.textSecondary }}
            >
              Total Stake Value (Your Share)
            </span>
            <span
              className="text-lg sm:text-xl font-semibold"
              style={{ color: Colors.textPrimary }}
            >
              ₹{totals.totalStakeValue.toLocaleString()}
            </span>
          </div>

          <div
            className="rounded-xl p-4 shadow-md flex flex-col gap-1"
            style={{ backgroundColor: Colors.card }}
          >
            <span
              className="text-xs sm:text-sm"
              style={{ color: Colors.textSecondary }}
            >
              Total Revenue
            </span>
            <span
              className="text-lg sm:text-xl font-semibold"
              style={{ color: Colors.textPrimary }}
            >
              ₹{totals.totalRevenue.toLocaleString()}
            </span>
          </div>

          <div
            className="rounded-xl p-4 shadow-md flex flex-col gap-1"
            style={{ backgroundColor: Colors.card }}
          >
            <span
              className="text-xs sm:text-sm"
              style={{ color: Colors.textSecondary }}
            >
              Total Net Profit & Margin
            </span>
            <span
              className={`text-lg sm:text-xl font-semibold ${
                totals.totalNetProfit >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              ₹{totals.totalNetProfit.toLocaleString()}
            </span>
            <span
              className={`text-xs sm:text-sm ${
                Number(totalProfitMargin) >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {totalProfitMargin}% margin
            </span>
          </div>
        </div>

        {/* 💰 Cash Pile & Portfolio Value */}
        <div
          className="rounded-xl p-4 sm:p-5 shadow-md flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          style={{ backgroundColor: Colors.card }}
        >
          <div className="space-y-1">
            <p
              className="text-xs sm:text-sm"
              style={{ color: Colors.textSecondary }}
            >
              Cash Pile (Business Cash / Dry Powder)
            </p>
            <p
              className="text-lg sm:text-xl font-semibold"
              style={{ color: Colors.textPrimary }}
            >
              ₹{cashPile.toLocaleString()}
            </p>

            <p
              className="text-xs sm:text-sm mt-2"
              style={{ color: Colors.textSecondary }}
            >
              Total Portfolio Value (Stake Value + Cash)
            </p>
            <p
              className="text-lg sm:text-xl font-semibold"
              style={{ color: Colors.textPrimary }}
            >
              ₹{totalPortfolioValue.toLocaleString()}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
            <input
              type="number"
              value={cashToAdd}
              onChange={(e) => setCashToAdd(e.target.value)}
              placeholder="Amount to add"
              className="bg-transparent border border-gray-600 rounded-lg px-3 py-2 text-sm w-full sm:w-40 focus:outline-none"
              style={{ color: Colors.textPrimary }}
            />
            <button
              onClick={handleAddCashPile}
              disabled={loading || !cashToAdd}
              className="px-4 py-2 rounded-xl shadow-md text-sm sm:text-base disabled:opacity-50 flex justify-center"
              style={{ backgroundColor: Colors.primary, color: "#fff" }}
            >
              Add Cash Pile
            </button>
          </div>
        </div>

        {/* Table */}
        <div
          className="p-4 md:p-6 rounded-xl shadow-lg overflow-x-auto"
          style={{ backgroundColor: Colors.card }}
        >
          {loading && businesses.length > 0 && (
            <div className="flex justify-center items-center mb-3">
              <Spinner />
            </div>
          )}

          {businesses.length === 0 && !loading ? (
            <p
              className="text-sm sm:text-base"
              style={{ color: Colors.textSecondary }}
            >
              No businesses found. Add one to get started.
            </p>
          ) : (
            <table className="w-full text-sm sm:text-sm md:text-base text-left min-w-[600px]">
              <thead>
                <tr style={{ color: Colors.textPrimary }}>
                  <th className="p-2 sm:p-3">Business</th>
                  <th className="p-2 sm:p-3 hidden md:table-cell">Industry</th>
                  <th className="p-2 sm:p-3">Valuation</th>
                  <th className="p-2 sm:p-3">Ownership</th>
                  <th className="p-2 sm:p-3 hidden lg:table-cell">Revenue</th>
                  <th className="p-2 sm:p-3 hidden lg:table-cell">Net Profit</th>
                  <th className="p-2 sm:p-3">Status</th>
                  <th className="p-2 sm:p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody style={{ color: Colors.textSecondary }}>
                {businesses.map((biz) => {
                  const isEditing = editingId === biz._id;
                  return (
                    <tr
                      key={biz._id}
                      className="border-t border-gray-700 hover:bg-gray-800 transition"
                    >
                      {/* Business Name */}
                      <td className="p-2 sm:p-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={biz.name}
                            onChange={(e) =>
                              handleChange(biz._id, "name", e.target.value)
                            }
                            className="bg-transparent border-b border-gray-500 px-1 w-full"
                          />
                        ) : (
                          biz.name
                        )}
                      </td>

                      {/* Industry */}
                      <td className="p-2 sm:p-3 hidden md:table-cell">
                        {isEditing ? (
                          <input
                            type="text"
                            value={biz.industry}
                            onChange={(e) =>
                              handleChange(
                                biz._id,
                                "industry",
                                e.target.value
                              )
                            }
                            className="bg-transparent border-b border-gray-500 px-1 w-full"
                          />
                        ) : (
                          biz.industry
                        )}
                      </td>

                      {/* Valuation */}
                      <td className="p-2 sm:p-3">
                        {isEditing ? (
                          <input
                            type="number"
                            value={biz.valuation}
                            onChange={(e) =>
                              handleChange(
                                biz._id,
                                "valuation",
                                e.target.value
                              )
                            }
                            className="bg-transparent border-b border-gray-500 px-1 max-w-[120px]"
                          />
                        ) : (
                          `₹${biz.valuation?.toLocaleString() || 0}`
                        )}
                      </td>

                      {/* Ownership */}
                      <td className="p-2 sm:p-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={biz.ownership}
                            onChange={(e) =>
                              handleChange(
                                biz._id,
                                "ownership",
                                e.target.value
                              )
                            }
                            className="bg-transparent border-b border-gray-500 px-1 max-w-[90px]"
                          />
                        ) : (
                          biz.ownership
                        )}
                      </td>

                      {/* Revenue */}
                      <td className="p-2 sm:p-3 hidden lg:table-cell">
                        {isEditing ? (
                          <input
                            type="number"
                            value={biz.revenue}
                            onChange={(e) =>
                              handleChange(
                                biz._id,
                                "revenue",
                                e.target.value
                              )
                            }
                            className="bg-transparent border-b border-gray-500 px-1 max-w-[120px]"
                          />
                        ) : (
                          `₹${biz.revenue?.toLocaleString() || 0}`
                        )}
                      </td>

                      {/* Net Profit */}
                      <td className="p-2 sm:p-3 hidden lg:table-cell">
                        {isEditing ? (
                          <input
                            type="number"
                            value={biz.netProfit}
                            onChange={(e) =>
                              handleChange(
                                biz._id,
                                "netProfit",
                                e.target.value
                              )
                            }
                            className="bg-transparent border-b border-gray-500 px-1 max-w-[120px]"
                          />
                        ) : (
                          `₹${biz.netProfit?.toLocaleString() || 0}`
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-2 sm:p-3">
                        {isEditing ? (
                          <select
                            value={biz.status}
                            onChange={(e) =>
                              handleChange(
                                biz._id,
                                "status",
                                e.target.value
                              )
                            }
                            className="bg-transparent border-b border-gray-500 px-2 py-1"
                          >
                            <option value="Active">Active</option>
                            <option value="Exited">Exited</option>
                            <option value="Planning">Planning</option>
                          </select>
                        ) : (
                          biz.status
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-2 sm:p-3">
                        <div className="flex justify-end gap-2">
                          {isEditing ? (
                            <button
                              onClick={() => handleSave(biz)}
                              className="px-2 sm:px-3 py-1 rounded-lg bg-green-600 text-white flex items-center gap-1 hover:bg-green-700 transition text-xs sm:text-sm"
                            >
                              <Check size={14} /> Save
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEdit(biz._id)}
                              className="px-2 sm:px-3 py-1 rounded-lg bg-blue-600 text-white flex items-center gap-1 hover:bg-blue-700 transition text-xs sm:text-sm"
                            >
                              <Edit size={14} /> Edit
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(biz)}
                            className="px-2 sm:px-3 py-1 rounded-lg bg-red-600 text-white flex items-center gap-1 hover:bg-red-700 transition text-xs sm:text-sm"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Businesses;
