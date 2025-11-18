import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DarkColors from "../../styles/ColorSchema";
import Spinner from "../../components/Spinner"; // ✅ Import Spinner
import {
  getCommodities,
  addCommodity,
  updateCommodity,
  deleteCommodity,
} from "../../services/commoditiesService";
import { Edit, Trash2, Check, Plus } from "lucide-react";

const Commodities = () => {
  const Colors = DarkColors;
  const [commodities, setCommodities] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 💰 Cash pile for commodities
  const [cashPile, setCashPile] = useState(0);
  const [cashToAdd, setCashToAdd] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getCommodities();
        // Normalize id
        const mapped = data.map((c) => ({ ...c, id: c.id ?? c._id }));
        setCommodities(mapped);
      } catch (error) {
        console.error("Failed to fetch commodities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔄 Load & persist cash pile in localStorage
  useEffect(() => {
    const stored = localStorage.getItem("commoditiesCashPile");
    if (stored) {
      const parsed = Number(stored);
      if (!isNaN(parsed)) setCashPile(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("commoditiesCashPile", cashPile.toString());
  }, [cashPile]);

  const handleChange = (id, field, value) => {
    setCommodities((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              [field]:
                field === "name" || field === "unit" ? value : Number(value),
            }
          : c
      )
    );
  };

  const handleEdit = (id) => setEditingId(id);

  const handleSave = async (id) => {
    const commodity = commodities.find((c) => c.id === id);
    try {
      const updated = await updateCommodity(id, commodity);
      const updatedWithId = { ...updated, id: updated.id ?? updated._id };
      setCommodities((prev) =>
        prev.map((c) => (c.id === id ? updatedWithId : c))
      );
      setEditingId(null);
    } catch (error) {
      console.error("Failed to update commodity:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCommodity(id);
      setCommodities((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Failed to delete commodity:", error);
    }
  };

  const handleAdd = async () => {
    const newCommodity = {
      name: "New Commodity",
      quantity: 0,
      unit: "kg",
      buyPrice: 0,
      marketPrice: 0,
    };
    try {
      const created = await addCommodity(newCommodity);
      const createdWithId = {
        ...created,
        id: created.id ?? created._id ?? Date.now().toString(),
      };
      setCommodities((prev) => [...prev, createdWithId]);
      setEditingId(createdWithId.id);
    } catch (error) {
      console.error("Failed to add commodity:", error);
    }
  };

  const calculateValue = (qty, marketPrice) => qty * marketPrice;
  const calculateProfit = (qty, buyPrice, marketPrice) =>
    qty * (marketPrice - buyPrice);
  const calculateROI = (buyPrice, marketPrice) =>
    buyPrice > 0 ? ((marketPrice - buyPrice) / buyPrice) * 100 : 0;

  // 💰 Handle cash pile addition
  const handleAddCashPile = () => {
    const amount = Number(cashToAdd);
    if (isNaN(amount)) return;
    setCashPile((prev) => prev + amount);
    setCashToAdd("");
  };

  // 📊 Totals: total investment, value, profit, ROI
  const totals = commodities.reduce(
    (acc, item) => {
      const invested = item.quantity * item.buyPrice;
      const value = item.quantity * item.marketPrice;
      acc.totalInvested += invested;
      acc.totalValue += value;
      return acc;
    },
    { totalInvested: 0, totalValue: 0 }
  );

  const totalProfit = totals.totalValue - totals.totalInvested;
  const totalROI = totals.totalInvested
    ? ((totalProfit / totals.totalInvested) * 100).toFixed(2)
    : 0;

  const totalPortfolioValue = totals.totalValue + cashPile;

  // Full-screen loader only on first load
  if (loading && commodities.length === 0)
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <Spinner />
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1
              className="text-2xl md:text-3xl font-bold"
              style={{ color: Colors.secondary }}
            >
              Commodities
            </h1>
            <p
              className="text-sm md:text-base"
              style={{ color: Colors.textSecondary }}
            >
              Manage your commodity investments and track performance.
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded-xl flex items-center gap-2 shadow-md hover:scale-105 transition text-sm md:text-base"
            style={{ backgroundColor: Colors.primary, color: "#fff" }}
          >
            <Plus size={18} /> Add Commodity
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
              Total Investment
            </span>
            <span
              className="text-lg sm:text-xl font-semibold"
              style={{ color: Colors.textPrimary }}
            >
              ₹{totals.totalInvested.toLocaleString()}
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
              Total Market Value
            </span>
            <span
              className="text-lg sm:text-xl font-semibold"
              style={{ color: Colors.textPrimary }}
            >
              ₹{totals.totalValue.toLocaleString()}
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
              Total Profit / Loss
            </span>
            <span
              className={`text-lg sm:text-xl font-semibold ${
                totalProfit >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              ₹{totalProfit.toLocaleString()}
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
              Total ROI %
            </span>
            <span
              className={`text-lg sm:text-xl font-semibold ${
                Number(totalROI) >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {totalROI}%
            </span>
          </div>
        </div>

        {/* 💰 Cash Pile Section */}
        <div
          className="rounded-xl p-4 md:p-5 shadow-md flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
          style={{ backgroundColor: Colors.card }}
        >
          <div className="space-y-1">
            <p
              className="text-xs md:text-sm"
              style={{ color: Colors.textSecondary }}
            >
              Cash Pile (for Commodities)
            </p>
            <p
              className="text-lg md:text-xl font-semibold"
              style={{ color: Colors.textPrimary }}
            >
              ₹{cashPile.toLocaleString()}
            </p>

            <p
              className="text-xs md:text-sm mt-2"
              style={{ color: Colors.textSecondary }}
            >
              Total Portfolio Value (Commodities + Cash)
            </p>
            <p
              className="text-lg md:text-xl font-semibold"
              style={{ color: Colors.textPrimary }}
            >
              ₹{totalPortfolioValue.toLocaleString()}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-2 md:items-center w-full md:w-auto">
            <input
              type="number"
              value={cashToAdd}
              onChange={(e) => setCashToAdd(e.target.value)}
              placeholder="Amount to add"
              className="bg-transparent border border-gray-600 rounded-lg px-3 py-2 text-sm w-full md:w-40 focus:outline-none"
              style={{ color: Colors.textPrimary }}
            />
            <button
              onClick={handleAddCashPile}
              disabled={loading || !cashToAdd}
              className="px-4 py-2 rounded-xl shadow-md text-sm md:text-base disabled:opacity-50 flex justify-center"
              style={{ backgroundColor: Colors.primary, color: "#fff" }}
            >
              Add Cash Pile
            </button>
          </div>
        </div>

        {/* Table (scrollable on small screens) */}
        <div
          className="p-4 md:p-6 rounded-xl shadow-lg overflow-x-auto"
          style={{ backgroundColor: Colors.card }}
        >
          {loading && commodities.length > 0 && (
            <div className="flex justify-center items-center mb-3">
              <Spinner />
            </div>
          )}

          {commodities.length === 0 && !loading ? (
            <p
              className="text-sm md:text-base"
              style={{ color: Colors.textSecondary }}
            >
              No commodities found. Add some!
            </p>
          ) : (
            <table className="w-full min-w-[800px] text-xs md:text-sm text-left">
              <thead>
                <tr style={{ color: Colors.textPrimary }}>
                  <th className="p-3">Commodity</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Unit</th>
                  <th className="p-3">Buy Price</th>
                  <th className="p-3">Market Price</th>
                  <th className="p-3">Value</th>
                  <th className="p-3">Profit</th>
                  <th className="p-3">ROI %</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody style={{ color: Colors.textSecondary }}>
                {commodities.map((item) => {
                  const value = calculateValue(item.quantity, item.marketPrice);
                  const profit = calculateProfit(
                    item.quantity,
                    item.buyPrice,
                    item.marketPrice
                  );
                  const roi = calculateROI(item.buyPrice, item.marketPrice);
                  const isEditing = editingId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className="border-t border-gray-700 hover:bg-gray-800 transition"
                    >
                      {/* Commodity Name */}
                      <td className="p-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) =>
                              handleChange(item.id, "name", e.target.value)
                            }
                            className="bg-transparent border-b border-gray-500 px-1 w-full"
                          />
                        ) : (
                          item.name
                        )}
                      </td>

                      {/* Quantity */}
                      <td className="p-3">
                        {isEditing ? (
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleChange(
                                item.id,
                                "quantity",
                                e.target.value
                              )
                            }
                            className="bg-transparent border-b border-gray-500 px-1 w-20"
                          />
                        ) : (
                          item.quantity
                        )}
                      </td>

                      {/* Unit */}
                      <td className="p-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={item.unit}
                            onChange={(e) =>
                              handleChange(item.id, "unit", e.target.value)
                            }
                            className="bg-transparent border-b border-gray-500 px-1 w-16"
                          />
                        ) : (
                          item.unit
                        )}
                      </td>

                      {/* Buy Price */}
                      <td className="p-3">
                        {isEditing ? (
                          <input
                            type="number"
                            value={item.buyPrice}
                            onChange={(e) =>
                              handleChange(
                                item.id,
                                "buyPrice",
                                e.target.value
                              )
                            }
                            className="bg-transparent border-b border-gray-500 px-1 w-24"
                          />
                        ) : (
                          `₹${item.buyPrice.toLocaleString()}`
                        )}
                      </td>

                      {/* Market Price */}
                      <td className="p-3">
                        {isEditing ? (
                          <input
                            type="number"
                            value={item.marketPrice}
                            onChange={(e) =>
                              handleChange(
                                item.id,
                                "marketPrice",
                                e.target.value
                              )
                            }
                            className="bg-transparent border-b border-gray-500 px-1 w-24"
                          />
                        ) : (
                          `₹${item.marketPrice.toLocaleString()}`
                        )}
                      </td>

                      {/* Value */}
                      <td className="p-3">₹{value.toLocaleString()}</td>

                      {/* Profit */}
                      <td
                        className={`p-3 font-semibold ${
                          profit >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        ₹{profit.toLocaleString()}
                      </td>

                      {/* ROI */}
                      <td
                        className={`p-3 font-semibold ${
                          roi >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {roi.toFixed(2)}%
                      </td>

                      {/* Actions */}
                      <td className="p-3 flex justify-end gap-2">
                        {isEditing ? (
                          <button
                            onClick={() => handleSave(item.id)}
                            className="px-3 py-1 rounded-lg bg-green-600 text-white flex items-center gap-1 hover:bg-green-700 transition text-xs md:text-sm"
                          >
                            <Check size={16} /> Save
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEdit(item.id)}
                            className="px-3 py-1 rounded-lg bg-blue-600 text-white flex items-center gap-1 hover:bg-blue-700 transition text-xs md:text-sm"
                          >
                            <Edit size={16} /> Edit
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-3 py-1 rounded-lg bg-red-600 text-white flex items-center gap-1 hover:bg-red-700 transition text-xs md:text-sm"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
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

export default Commodities;
