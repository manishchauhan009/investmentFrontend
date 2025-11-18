import API from "./api";

export const cashPileService = {
  // GET /cash-piles/:assetClass
  getCashPile: async (assetClass) => {
    const res = await API.get(`cash-piles/${assetClass}`);
    // assuming backend returns: { success, data: { assetClass, amount, ... } }
    return res.data.data;
  },

  // PUT /cash-piles/:assetClass  (set absolute amount)
  setCashPile: async (assetClass, amount) => {
    const res = await API.put(`cash-piles/${assetClass}`, { amount });
    return res.data.data;
  },

  // PATCH /cash-piles/:assetClass/add  (increment or decrement by delta)
  addToCashPile: async (assetClass, delta) => {
    const res = await API.patch(`cash-piles/${assetClass}/add`, { delta });
    return res.data.data;
  },
};
