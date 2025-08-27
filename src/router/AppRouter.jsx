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
      {/* Auth */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/real-estate"
        element={
          <ProtectedRoute>
            <RealEstate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stocks"
        element={
          <ProtectedRoute>
            <Stocks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/commodities"
        element={
          <ProtectedRoute>
            <Commodities />
          </ProtectedRoute>
        }
      />
      <Route
        path="/businesses"
        element={
          <ProtectedRoute>
            <Businesses />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRouter;
