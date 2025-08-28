import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DarkColors from "../../styles/ColorSchema";
import { realEstateService } from "../../services/realEstateService";
import { Edit, Trash2, Check, Plus } from "lucide-react";
import Spinner from "../../components/Spinner"; // ✅ Import Spinner

const RealEstate = () => {
  const Colors = DarkColors;
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

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


  if (loading)
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

        {properties.length === 0 ? (
          <p style={{ color: Colors.textSecondary }}>No properties found. Add some!</p>
        ) : (
          <div
            className="p-4 sm:p-6 rounded-xl shadow-lg overflow-x-auto"
            style={{ backgroundColor: Colors.card }}
          >
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
                    const gain = property.currentValue - property.investedValue;
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
                                handleChange(
                                  property._id,
                                  "investedValue",
                                  Number(e.target.value)
                                )
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
                                handleChange(
                                  property._id,
                                  "currentValue",
                                  Number(e.target.value)
                                )
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
                                handleChange(property._id, "rent", Number(e.target.value))
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
                        <td className="p-2 sm:p-3 flex justify-end gap-2">
                          {isEditing ? (
                            <button
                              onClick={() => handleSave(property._id)}
                              className="px-2 sm:px-3 py-1 rounded-lg bg-green-600 text-white flex items-center gap-1 hover:bg-green-700 transition text-xs sm:text-sm"
                            >
                              <Check size={14} className="sm:size-16" /> Save
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
