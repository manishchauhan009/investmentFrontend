import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DarkColors from "../../styles/ColorSchema";
import { realEstateService } from "../../services/realEstateService";
import { Edit, Trash2, Check, Plus } from "lucide-react";

const RealEstate = () => {
  const Colors = DarkColors;
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);



  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
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
    try {
      const property = properties.find((p) => p._id === id);
      await realEstateService.updateProperty(id, property);
      setEditingId(null);
    } catch (error) {
      console.error("❌ Failed to update property:", error);
    }
  };

  // Delete property
  const handleDelete = async (id) => {
    try {
      await realEstateService.deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("❌ Failed to delete property:", error);
    }
  };

  // Add new property
  // Add new property
  const handleAddProperty = async () => {
    try {
      // Default new property
      const propertyToAdd = {
        name: "New Property",
        location: "",
        investedValue: 0,
        currentValue: 0,
        roi: 0,
        rent: 0,
      };

      // Add to backend
      const created = await realEstateService.addProperty(propertyToAdd);

      // Use backend _id or fallback temporary id
      const propertyWithId = { ...created, _id: created._id ?? Date.now().toString() };

      // Add to state
      setProperties((prev) => [...prev, propertyWithId]);

      // Immediately set as editable
      setEditingId(propertyWithId._id);

    } catch (error) {
      console.error("❌ Failed to add property:", error);
    }
  };


  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header + Add Button */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: Colors.secondary }}>
              Real Estate Portfolio
            </h1>
            <p style={{ color: Colors.textSecondary }}>
              Manage your properties, ROI, rent yields and values here.
            </p>
          </div>
          <button
            onClick={handleAddProperty}
            className="px-4 py-2 rounded-xl flex items-center gap-2 shadow-md hover:scale-105 transition"
            style={{ backgroundColor: Colors.primary, color: "#fff" }}
          >
            <Plus size={18} /> Add Property
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <p style={{ color: Colors.textSecondary }}>Loading properties...</p>
        ) : properties.length === 0 ? (
          <p style={{ color: Colors.textSecondary }}>No properties found. Add some!</p>
        ) : (
          <div
            className="p-6 rounded-xl shadow-lg overflow-x-auto"
            style={{ backgroundColor: Colors.card }}
          >
            <table className="w-full text-sm text-left">
              <thead>
                <tr style={{ color: Colors.textPrimary }}>
                  <th className="p-3">Property</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Invested Value</th>
                  <th className="p-3">Current Value</th>
                  <th className="p-3">ROI (%)</th>
                  <th className="p-3">Gain / Loss</th>
                  <th className="p-3">Rent</th>
                  <th className="p-3">Rent Yield (%)</th>
                  <th className="p-3 text-right">Actions</th>
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
                      <td className="p-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={property.name}
                            onChange={(e) =>
                              handleChange(property._id, "name", e.target.value)
                            }
                            className="bg-transparent border-b border-gray-500 px-1 w-full"
                          />
                        ) : (
                          property.name
                        )}
                      </td>

                      {/* Location */}
                      <td className="p-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={property.location}
                            onChange={(e) =>
                              handleChange(property._id, "location", e.target.value)
                            }
                            className="bg-transparent border-b border-gray-500 px-1 w-full"
                          />
                        ) : (
                          property.location
                        )}
                      </td>

                      {/* Invested Value */}
                      <td className="p-3">
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
                            className="bg-transparent border-b border-gray-500 px-1 w-24"
                          />
                        ) : (
                          `₹${property.investedValue.toLocaleString()}`
                        )}
                      </td>

                      {/* Current Value */}
                      <td className="p-3">
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
                            className="bg-transparent border-b border-gray-500 px-1 w-24"
                          />
                        ) : (
                          `₹${property.currentValue.toLocaleString()}`
                        )}
                      </td>

                      {/* ROI */}
                      <td
                        className="p-3 font-semibold"
                        style={{ color: property.roi >= 0 ? "green" : "red" }}
                      >
                        {property.roi?.toFixed(2) || 0}%
                      </td>

                      {/* Gain / Loss */}
                      <td
                        className="p-3 font-semibold"
                        style={{ color: gain >= 0 ? "green" : "red" }}
                      >
                        ₹{gain.toLocaleString()}
                      </td>

                      {/* Rent */}
                      <td className="p-3">
                        {isEditing ? (
                          <input
                            type="number"
                            value={property.rent}
                            onChange={(e) =>
                              handleChange(
                                property._id,
                                "rent",
                                Number(e.target.value)
                              )
                            }
                            className="bg-transparent border-b border-gray-500 px-1 w-24"
                          />
                        ) : (
                          `₹${property.rent.toLocaleString()}`
                        )}
                      </td>

                      {/* Rent Yield */}
                      <td className="p-3 font-semibold">{rentYield}%</td>

                      {/* Actions */}
                      <td className="p-3 flex justify-end gap-2">
                        {isEditing ? (
                          <button
                            onClick={() => handleSave(property._id)}
                            className="px-3 py-1 rounded-lg bg-green-600 text-white flex items-center gap-1 hover:bg-green-700 transition"
                          >
                            <Check size={16} /> Save
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingId(property._id)}
                            className="px-3 py-1 rounded-lg bg-blue-600 text-white flex items-center gap-1 hover:bg-blue-700 transition"
                          >
                            <Edit size={16} /> Edit
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(property._id)}
                          className="px-3 py-1 rounded-lg bg-red-600 text-white flex items-center gap-1 hover:bg-red-700 transition"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RealEstate;
