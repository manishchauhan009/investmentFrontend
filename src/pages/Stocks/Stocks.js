import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DarkColors from "../../styles/ColorSchema";
import { getStocks, updateStock, deleteStock, addStock } from "../../services/stocksService";
import { Edit, Trash2, Check, Plus } from "lucide-react";

const Stocks = () => {
  const Colors = DarkColors;
  const [stocks, setStocks] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // ✅ Load from backend on mount
  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {
    const data = await getStocks();
    setStocks(data);
  };

  const handleChange = (id, field, value) => {
    setStocks((prev) =>
      prev.map((stock) =>
        stock._id === id ? { ...stock, [field]: field === "name" ? value : Number(value) } : stock
      )
    );
  };

  const handleEdit = (id) => setEditingId(id);

  const handleSave = async (id) => {
    const stock = stocks.find((s) => s._id === id);
    await updateStock(id, stock);
    setEditingId(null);
    loadStocks(); // refresh from backend
  };

  const handleDelete = async (id) => {
    await deleteStock(id);
    loadStocks(); // refresh
  };

  const handleAdd = async () => {
    const newStock = {
      name: "New Stock",
      quantity: 0,
      buyPrice: 0,
      marketPrice: 0,
    };

    try {
      // Add to backend
      const created = await addStock(newStock);

      // Use backend _id or temporary one
      const stockWithId = { ...created, _id: created._id ?? Date.now().toString() };

      // Add to state
      setStocks((prev) => [...prev, stockWithId]);

      // Immediately set as editable
      setEditingId(stockWithId._id);
    } catch (error) {
      console.error("Failed to add stock:", error);
    }
  };


  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: Colors.secondary }}>
              Stocks
            </h1>
            <p style={{ color: Colors.textSecondary }}>
              Manage your stock holdings and track performance.
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded-xl flex items-center gap-2 shadow-md hover:scale-105 transition"
            style={{ backgroundColor: Colors.primary, color: "#fff" }}
          >
            <Plus size={18} /> Add Stock
          </button>
        </div>

        {/* Table */}
        <div className="p-6 rounded-xl shadow-lg overflow-x-auto" style={{ backgroundColor: Colors.card }}>
          <table className="w-full text-sm text-left">
            <thead>
              <tr style={{ color: Colors.textPrimary }}>
                <th className="p-3">Stock</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Buy Price</th>
                <th className="p-3">Market Price</th>
                <th className="p-3">Invested</th>
                <th className="p-3">Market Value</th>
                <th className="p-3">Net P/L</th>
                <th className="p-3">Change %</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody style={{ color: Colors.textSecondary }}>
              {stocks.map((stock) => {
                const investedValue = stock.quantity * stock.buyPrice;
                const marketValue = stock.quantity * stock.marketPrice;
                const netPL = marketValue - investedValue;
                const changePercent = investedValue ? ((netPL / investedValue) * 100).toFixed(2) : 0;
                const isEditing = editingId === stock._id;

                return (
                  <tr key={stock._id} className="border-t border-gray-700 hover:bg-gray-800 transition">
                    {/* Stock Name */}
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={stock.name}
                          onChange={(e) => handleChange(stock._id, "name", e.target.value)}
                          className="bg-transparent border-b border-gray-500 px-1 w-full"
                        />
                      ) : (
                        stock.name
                      )}
                    </td>

                    {/* Quantity */}
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="number"
                          value={stock.quantity}
                          onChange={(e) => handleChange(stock._id, "quantity", e.target.value)}
                          className="bg-transparent border-b border-gray-500 px-1 w-20"
                        />
                      ) : (
                        stock.quantity
                      )}
                    </td>

                    {/* Buy Price */}
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="number"
                          value={stock.buyPrice}
                          onChange={(e) => handleChange(stock._id, "buyPrice", e.target.value)}
                          className="bg-transparent border-b border-gray-500 px-1 w-24"
                        />
                      ) : (
                        `₹${stock.buyPrice.toLocaleString()}`
                      )}
                    </td>

                    {/* Market Price */}
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="number"
                          value={stock.marketPrice}
                          onChange={(e) => handleChange(stock._id, "marketPrice", e.target.value)}
                          className="bg-transparent border-b border-gray-500 px-1 w-24"
                        />
                      ) : (
                        `₹${stock.marketPrice.toLocaleString()}`
                      )}
                    </td>

                    {/* Invested */}
                    <td className="p-3">₹{investedValue.toLocaleString()}</td>
                    <td className="p-3">₹{marketValue.toLocaleString()}</td>

                    {/* Net P/L */}
                    <td className={`p-3 font-semibold ${netPL >= 0 ? "text-green-400" : "text-red-400"}`}>
                      ₹{netPL.toLocaleString()}
                    </td>

                    {/* Change % */}
                    <td className={`p-3 ${changePercent >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {changePercent}%
                    </td>

                    {/* Actions */}
                    <td className="p-3 flex justify-end gap-2">
                      {isEditing ? (
                        <button
                          onClick={() => handleSave(stock._id)}
                          className="px-3 py-1 rounded-lg bg-green-600 text-white flex items-center gap-1 hover:bg-green-700 transition"
                        >
                          <Check size={16} /> Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(stock._id)}
                          className="px-3 py-1 rounded-lg bg-blue-600 text-white flex items-center gap-1 hover:bg-blue-700 transition"
                        >
                          <Edit size={16} /> Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(stock._id)}
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
      </div>
    </DashboardLayout>
  );
};

export default Stocks;
