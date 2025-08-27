// utils/commoditiesUtils.js
export const calculateValue = (qty, marketPrice) => qty * marketPrice;

export const calculateProfit = (qty, buyPrice, marketPrice) =>
  qty * (marketPrice - buyPrice);

export const calculateROI = (buyPrice, marketPrice) =>
  buyPrice > 0 ? (((marketPrice - buyPrice) / buyPrice) * 100).toFixed(2) : 0;
