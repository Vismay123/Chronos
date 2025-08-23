import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Favourites from "./pages/Favourites";
import Checkout from "./pages/Checkout";

// 🔹 Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageOrders from "./pages/admin/ManageOrders";
import ManageProducts from "./pages/admin/ManageProducts";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const checkAuth = () => setIsAuthenticated(!!localStorage.getItem("token"));
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              user?.role === "admin" ? (
                <Navigate to="/admin/dashboard" />
              ) : (
                <Navigate to="/home" />
              )
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/home" />
            ) : (
              <Register setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />

        {/* Normal User Routes */}
        <Route
          path="/home"
          element={isAuthenticated && user?.role !== "admin" ? <Home /> : <Navigate to="/" />}
        />
        <Route
          path="/cart"
          element={isAuthenticated && user?.role !== "admin" ? <Cart /> : <Navigate to="/" />}
        />
        <Route
          path="/favourites"
          element={isAuthenticated && user?.role !== "admin" ? <Favourites /> : <Navigate to="/" />}
        />
        <Route
          path="/checkout"
          element={isAuthenticated && user?.role !== "admin" ? <Checkout /> : <Navigate to="/" />}
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={isAuthenticated && user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/admin/orders"
          element={isAuthenticated && user?.role === "admin" ? <ManageOrders /> : <Navigate to="/" />}
        />
        <Route
          path="/admin/products"
          element={isAuthenticated && user?.role === "admin" ? <ManageProducts /> : <Navigate to="/" />}
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      
    </Router>
  );
}
