import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DarkColors from "../../styles/ColorSchema";
import { Plus, Edit, Trash, Save } from "lucide-react";
import { getBusinessData, addBusiness, updateBusiness, deleteBusiness } from "../../services/businessServices";

const Businesses = () => {
  const Colors = DarkColors;
  const [businesses, setBusinesses] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Load businesses on mount
  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      const data = await getBusinessData();
      setBusinesses(data);
    } catch (error) {
      console.error("Failed to fetch businesses:", error);
    }
  };

  // Handle input changes
  const handleChange = (id, field, value) => {
    const parsedValue = ["valuation", "revenue", "netProfit"].includes(field) ? Number(value) : value;
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
      console.error("Failed to delete business:", error);
    }
  };

  const handleAdd = async () => {
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

  // Add to state immediately
  setBusinesses((prev) => [newBiz, ...prev]);

  // Set editingId to temporary _id
  setEditingId(newBiz._id);
};


 const handleSave = async (biz) => {
  try {
    let savedBiz;
    if (biz.isNew) {
      savedBiz = await addBusiness(biz); // create in backend
    } else {
      savedBiz = await updateBusiness(biz._id, biz); // update
    }

    setBusinesses((prev) =>
      prev.map((b) => (b._id === biz._id ? savedBiz : b))
    );
    setEditingId(null);
  } catch (error) {
    console.error("Failed to save business:", error);
  }
};




  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: Colors.secondary }}>
              Business Investments
            </h1>
            <p style={{ color: Colors.textSecondary }}>
              Track your business holdings, valuations, and performance.
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded-xl flex items-center gap-2 shadow-md hover:scale-105 transition"
            style={{ backgroundColor: Colors.primary, color: "#fff" }}
          >
            <Plus size={18} /> Add Business
          </button>
        </div>

        {/* Table */}
        <div className="p-6 rounded-xl shadow-lg overflow-x-auto" style={{ backgroundColor: Colors.card }}>
          <table className="w-full text-sm text-left">
            <thead>
              <tr style={{ color: Colors.textPrimary }}>
                <th className="p-3">Business</th>
                <th className="p-3">Industry</th>
                <th className="p-3">Valuation</th>
                <th className="p-3">Ownership</th>
                <th className="p-3">Revenue</th>
                <th className="p-3">Net Profit</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody style={{ color: Colors.textSecondary }}>
              {businesses.map((biz) => {
                const isEditing = editingId === biz._id;
                return (
                  <tr key={biz._id} className="border-t border-gray-700 hover:bg-gray-800 transition">
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={biz.name}
                          onChange={(e) => handleChange(biz._id, "name", e.target.value)}
                          className="bg-transparent border-b border-gray-500 px-1 w-full"
                        />
                      ) : (
                        biz.name
                      )}
                    </td>
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={biz.industry}
                          onChange={(e) => handleChange(biz._id, "industry", e.target.value)}
                          className="bg-transparent border-b border-gray-500 px-1 w-full"
                        />
                      ) : (
                        biz.industry
                      )}
                    </td>
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="number"
                          value={biz.valuation}
                          onChange={(e) => handleChange(biz._id, "valuation", e.target.value)}
                          className="bg-transparent border-b border-gray-500 px-1 w-28"
                        />
                      ) : (
                        `₹${biz.valuation?.toLocaleString() || 0}`
                      )}
                    </td>
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={biz.ownership}
                          onChange={(e) => handleChange(biz._id, "ownership", e.target.value)}
                          className="bg-transparent border-b border-gray-500 px-1 w-20"
                        />
                      ) : (
                        biz.ownership
                      )}
                    </td>
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="number"
                          value={biz.revenue}
                          onChange={(e) => handleChange(biz._id, "revenue", e.target.value)}
                          className="bg-transparent border-b border-gray-500 px-1 w-28"
                        />
                      ) : (
                        `₹${biz.revenue?.toLocaleString() || 0}`
                      )}
                    </td>
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="number"
                          value={biz.netProfit}
                          onChange={(e) => handleChange(biz._id, "netProfit", e.target.value)}
                          className="bg-transparent border-b border-gray-500 px-1 w-28"
                        />
                      ) : (
                        `₹${biz.netProfit?.toLocaleString() || 0}`
                      )}
                    </td>
                    <td className="p-3">
                      {isEditing ? (
                        <select
                          value={biz.status}
                          onChange={(e) => handleChange(biz._id, "status", e.target.value)}
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
                    <td className="p-3 flex justify-end gap-2">
                      {isEditing ? (
                        <button
                          onClick={() => handleSave(biz)}
                          className="px-3 py-1 rounded-lg bg-green-600 text-white flex items-center gap-1 hover:bg-green-700 transition"
                        >
                          <Save size={16} /> Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(biz._id)}
                          className="px-3 py-1 rounded-lg bg-blue-600 text-white flex items-center gap-1 hover:bg-blue-700 transition"
                        >
                          <Edit size={16} /> Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(biz)}
                        className="px-3 py-1 rounded-lg bg-red-600 text-white flex items-center gap-1 hover:bg-red-700 transition"
                      >
                        <Trash size={16} /> Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Businesses;
