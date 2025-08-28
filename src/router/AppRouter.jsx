import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import RealEstate from "../pages/RealEstate/RealEstate";
import Stocks from "../pages/Stocks/Stocks";
import Commodities from "../pages/Commodities/Commodities";
import Businesses from "../pages/Businesses/Businesses";
import Login from "../pages/Auth/Login";
import ProtectedRoute from "./ProtectedRoute";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/real-estate" element={<RealEstate />} />
        <Route path="/stocks" element={<Stocks />} />
        <Route path="/commodities" element={<Commodities />} />
        <Route path="/businesses" element={<Businesses />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
