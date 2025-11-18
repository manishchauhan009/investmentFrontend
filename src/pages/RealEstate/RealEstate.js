import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DarkColors from "../../styles/ColorSchema";
import { realEstateService } from "../../services/realEstateService";
import { Edit, Trash2, Check, Plus } from "lucide-react";
import Spinner from "../../components/Spinner"; // ✅ Import Spinner
import { cashPileService } from "../../services/cashPileService";


const RealEstate = () => {
  const Colors = DarkColors;
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // 💰 Cash pile state
  const [cashPile, setCashPile] = useState(0);
  const [cashToAdd, setCashToAdd] = useState("");


  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const data = await realEstateService.getAllProperties();
        setProperties(data);
      } catch (error) {
        console.error("❌ Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    const fetchCashPile = async () => {
      try {
        const data = await cashPileService.getCashPile("realEstate");
        setCashPile(data?.amount || 0);
      } catch (err) {
        console.error("Failed to fetch stocks cash pile:", err);
      }
    };
    fetchCashPile();
  }, []);


  // Handle input changes for editing
  const handleChange = (id, field, value) => {
    setProperties((prev) =>
      prev.map((p) =>
        p._id === id
          ? {
            ...p,
            [field]:
              field === "name" || field === "location" ? value : Number(value),
          }
          : p
      )
    );
  };

  // Save property update
  const handleSave = async (id) => {
    setLoading(true);
    try {
      const property = properties.find((p) => p._id === id);
      await realEstateService.updateProperty(id, property);
      setEditingId(null);
    } catch (error) {
      console.error("❌ Failed to update property:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete property
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await realEstateService.deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("❌ Failed to delete property:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add new property
  const handleAddProperty = async () => {
    setLoading(true);
    try {
      const propertyToAdd = {
        name: "New Property",
        location: "",
        investedValue: 0,
        currentValue: 0,
        roi: 0,
        rent: 0,
      };
      const created = await realEstateService.addProperty(propertyToAdd);
      const propertyWithId = { ...created, _id: created._id ?? Date.now().toString() };
      setProperties((prev) => [...prev, propertyWithId]);
      setEditingId(propertyWithId._id);
    } catch (error) {
      console.error("❌ Failed to add property:", error);
    } finally {
      setLoading(false);
    }
  };

  // 💰 Handle cash pile addition
  const handleAddCashPile = async () => {
    const amount = Number(cashToAdd);
    if (isNaN(amount) || !amount) return;

    try {
      const updated = await cashPileService.addToCashPile("realEstate", amount);
      setCashPile(updated.amount);
      setCashToAdd("");
    } catch (err) {
      console.error("Failed to update stocks cash pile:", err);
    }
  };


  // 📊 Totals
  const totals = properties.reduce(
    (acc, property) => {
      acc.totalInvested += property.investedValue || 0;
      acc.totalCurrent += property.currentValue || 0;
      acc.totalRent += property.rent || 0;
      return acc;
    },
    { totalInvested: 0, totalCurrent: 0, totalRent: 0 }
  );

  const totalGain = totals.totalCurrent - totals.totalInvested;
  const totalROI = totals.totalInvested
    ? ((totalGain / totals.totalInvested) * 100).toFixed(2)
    : 0;

  const totalRentYield = totals.totalInvested
    ? ((totals.totalRent * 12 * 100) / totals.totalInvested).toFixed(2)
    : 0;

  const totalPortfolioValue = totals.totalCurrent + cashPile;

  if (loading && properties.length === 0)
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <Spinner />
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header + Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: Colors.secondary }}
            >
              Real Estate Portfolio
            </h1>
            <p
              className="text-sm sm:text-base"
              style={{ color: Colors.textSecondary }}
            >
              Manage your properties, ROI, rent yields and values here.
            </p>
          </div>
          <button
            onClick={handleAddProperty}
            disabled={loading}
            className="px-4 py-2 rounded-xl flex items-center gap-2 shadow-md hover:scale-105 transition text-sm sm:text-base disabled:opacity-50"
            style={{ backgroundColor: Colors.primary, color: "#fff" }}
          >
            <Plus size={18} /> Add Property
          </button>
        </div>

        {/* 📊 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            className="rounded-xl p-4 shadow-md flex flex-col gap-1"
            style={{ backgroundColor: Colors.card }}
          >
            <span className="text-xs sm:text-sm" style={{ color: Colors.textSecondary }}>
              Total Investment
            </span>
            <span className="text-lg sm:text-xl font-semibold" style={{ color: Colors.textPrimary }}>
              ₹{totals.totalInvested.toLocaleString()}
            </span>
          </div>

          <div
            className="rounded-xl p-4 shadow-md flex flex-col gap-1"
            style={{ backgroundColor: Colors.card }}
          >
            <span className="text-xs sm:text-sm" style={{ color: Colors.textSecondary }}>
              Total Current Value
            </span>
            <span className="text-lg sm:text-xl font-semibold" style={{ color: Colors.textPrimary }}>
              ₹{totals.totalCurrent.toLocaleString()}
            </span>
          </div>

          <div
            className="rounded-xl p-4 shadow-md flex flex-col gap-1"
            style={{ backgroundColor: Colors.card }}
          >
            <span className="text-xs sm:text-sm" style={{ color: Colors.textSecondary }}>
              Total Gain / Loss
            </span>
            <span
              className={`text-lg sm:text-xl font-semibold ${totalGain >= 0 ? "text-green-400" : "text-red-400"
                }`}
            >
              ₹{totalGain.toLocaleString()}
            </span>
          </div>

          <div
            className="rounded-xl p-4 shadow-md flex flex-col gap-1"
            style={{ backgroundColor: Colors.card }}
          >
            <span className="text-xs sm:text-sm" style={{ color: Colors.textSecondary }}>
              Total ROI %
            </span>
            <span
              className={`text-lg sm:text-xl font-semibold ${totalROI >= 0 ? "text-green-400" : "text-red-400"
                }`}
            >
              {totalROI}%
            </span>
          </div>
        </div>

        {/* 💰 Cash Pile & Rent Summary */}
        <div
          className="rounded-xl p-4 sm:p-5 shadow-md flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          style={{ backgroundColor: Colors.card }}
        >
          <div className="space-y-1">
            <p className="text-xs sm:text-sm" style={{ color: Colors.textSecondary }}>
              Cash Pile (Real Estate Cash / FD)
            </p>
            <p className="text-lg sm:text-xl font-semibold" style={{ color: Colors.textPrimary }}>
              ₹{cashPile.toLocaleString()}
            </p>

            <p className="text-xs sm:text-sm mt-2" style={{ color: Colors.textSecondary }}>
              Total Monthly Rent
            </p>
            <p className="text-lg sm:text-xl font-semibold" style={{ color: Colors.textPrimary }}>
              ₹{totals.totalRent.toLocaleString()}
            </p>

            <p className="text-xs sm:text-sm mt-2" style={{ color: Colors.textSecondary }}>
              Overall Rent Yield (Annual)
            </p>
            <p className="text-lg sm:text-xl font-semibold" style={{ color: Colors.textPrimary }}>
              {totalRentYield}%
            </p>

            <p className="text-xs sm:text-sm mt-2" style={{ color: Colors.textSecondary }}>
              Total Portfolio Value (Properties + Cash)
            </p>
            <p className="text-lg sm:text-xl font-semibold" style={{ color: Colors.textPrimary }}>
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

        {properties.length === 0 ? (
          <p style={{ color: Colors.textSecondary }}>No properties found. Add some!</p>
        ) : (
          <div
            className="p-4 sm:p-6 rounded-xl shadow-lg overflow-x-auto"
            style={{ backgroundColor: Colors.card }}
          >
            {loading && properties.length > 0 && (
              <div className="flex justify-center items-center mb-3">
                <Spinner />
              </div>
            )}

            <div className="w-full overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left min-w-[800px]">
                <thead>
                  <tr style={{ color: Colors.textPrimary }}>
                    <th className="p-2 sm:p-3">Property</th>
                    <th className="p-2 sm:p-3">Location</th>
                    <th className="p-2 sm:p-3">Invested</th>
                    <th className="p-2 sm:p-3">Current</th>
                    <th className="p-2 sm:p-3">ROI (%)</th>
                    <th className="p-2 sm:p-3">Gain/Loss</th>
                    <th className="p-2 sm:p-3">Rent</th>
                    <th className="p-2 sm:p-3">Yield (%)</th>
                    <th className="p-2 sm:p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody style={{ color: Colors.textSecondary }}>
                  {properties.map((property) => {
                    const rentYield = property.investedValue
                      ? ((property.rent * 12 * 100) / property.investedValue).toFixed(2)
                      : 0;
                    const gain = (property.currentValue || 0) - (property.investedValue || 0);
                    const isEditing = editingId === property._id;

                    return (
                      <tr
                        key={property._id}
                        className="border-t border-gray-700 hover:bg-gray-800 transition"
                      >
                        {/* Property Name */}
                        <td className="p-2 sm:p-3">
                          {isEditing ? (
                            <input
                              type="text"
                              value={property.name}
                              onChange={(e) =>
                                handleChange(property._id, "name", e.target.value)
                              }
                              className="bg-transparent border-b border-gray-500 px-1 w-full text-xs sm:text-sm"
                            />
                          ) : (
                            property.name
                          )}
                        </td>

                        {/* Location */}
                        <td className="p-2 sm:p-3">
                          {isEditing ? (
                            <input
                              type="text"
                              value={property.location}
                              onChange={(e) =>
                                handleChange(property._id, "location", e.target.value)
                              }
                              className="bg-transparent border-b border-gray-500 px-1 w-full text-xs sm:text-sm"
                            />
                          ) : (
                            property.location
                          )}
                        </td>

                        {/* Invested Value */}
                        <td className="p-2 sm:p-3">
                          {isEditing ? (
                            <input
                              type="number"
                              value={property.investedValue}
                              onChange={(e) =>
                                handleChange(property._id, "investedValue", e.target.value)
                              }
                              className="bg-transparent border-b border-gray-500 px-1 w-20 sm:w-24 text-xs sm:text-sm"
                            />
                          ) : (
                            `₹${property.investedValue.toLocaleString()}`
                          )}
                        </td>

                        {/* Current Value */}
                        <td className="p-2 sm:p-3">
                          {isEditing ? (
                            <input
                              type="number"
                              value={property.currentValue}
                              onChange={(e) =>
                                handleChange(property._id, "currentValue", e.target.value)
                              }
                              className="bg-transparent border-b border-gray-500 px-1 w-20 sm:w-24 text-xs sm:text-sm"
                            />
                          ) : (
                            `₹${property.currentValue.toLocaleString()}`
                          )}
                        </td>

                        {/* ROI */}
                        <td
                          className="p-2 sm:p-3 font-semibold"
                          style={{ color: property.roi >= 0 ? "green" : "red" }}
                        >
                          {property.roi?.toFixed(2) || 0}%
                        </td>

                        {/* Gain / Loss */}
                        <td
                          className="p-2 sm:p-3 font-semibold"
                          style={{ color: gain >= 0 ? "green" : "red" }}
                        >
                          ₹{gain.toLocaleString()}
                        </td>

                        {/* Rent */}
                        <td className="p-2 sm:p-3">
                          {isEditing ? (
                            <input
                              type="number"
                              value={property.rent}
                              onChange={(e) =>
                                handleChange(property._id, "rent", e.target.value)
                              }
                              className="bg-transparent border-b border-gray-500 px-1 w-20 sm:w-24 text-xs sm:text-sm"
                            />
                          ) : (
                            `₹${property.rent.toLocaleString()}`
                          )}
                        </td>

                        {/* Rent Yield */}
                        <td className="p-2 sm:p-3 font-semibold">{rentYield}%</td>

                        {/* Actions */}
                        <td className="p-2 sm:p-3">
                          <div className="flex justify-end gap-2">
                            {isEditing ? (
                              <button
                                onClick={() => handleSave(property._id)}
                                className="px-2 sm:px-3 py-1 rounded-lg bg-green-600 text-white flex items-center gap-1 hover:bg-green-700 transition text-xs sm:text-sm"
                              >
                                <Check size={14} /> Save
                              </button>
                            ) : (
                              <button
                                onClick={() => setEditingId(property._id)}
                                className="px-2 sm:px-3 py-1 rounded-lg bg-blue-600 text-white flex items-center gap-1 hover:bg-blue-700 transition text-xs sm:text-sm"
                              >
                                <Edit size={14} /> Edit
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(property._id)}
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
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RealEstate;
