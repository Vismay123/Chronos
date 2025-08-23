import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  // ✅ Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      const orders = res.data;

      // Recent orders: latest 5
      const sortedOrders = orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setRecentOrders(
        sortedOrders.map((o) => ({
          id: o._id,
          user: o.user.name,
          total: o.total,
          status: o.status,
        }))
      );

      // Stats calculation
      const totalOrders = orders.length;
      const pendingOrders = orders.filter((o) => o.status === "Pending").length;

      // For total products, sum up unique product count across orders
      let productSet = new Set();
      orders.forEach((o) => o.items.forEach((item) => productSet.add(item.name)));

      setStats({
        totalOrders,
        pendingOrders,
        totalProducts: productSet.size,
      });

      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="p-10">Loading dashboard...</p>;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">⚡ Admin Panel</h2>
        <nav className="space-y-4">
          <Link to="/admin/orders" className="block hover:text-yellow-300">
            📦 Manage Orders
          </Link>
          <Link to="/admin/products" className="block hover:text-yellow-300">
            🛒 Manage Products
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-10 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg"
        >
          🚪 Logout
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, Admin 🎉</h1>
          <p className="text-gray-600">Manage your e-commerce efficiently</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-white shadow-lg rounded-xl p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800">{stats.totalOrders}</h2>
            <p className="text-gray-600">Total Orders</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800">{stats.pendingOrders}</h2>
            <p className="text-gray-600">Pending Orders</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800">{stats.totalProducts}</h2>
            <p className="text-gray-600">Total Products</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🕒 Recent Orders</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-2">Order ID</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Total</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{order.id}</td>
                  <td className="py-2">{order.user}</td>
                  <td className="py-2">₹{order.total}</td>
                  <td
                    className={`py-2 font-semibold ${
                      order.status === "Pending" ? "text-yellow-600" : "text-green-600"
                    }`}
                  >
                    {order.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 text-right">
            <Link
              to="/admin/orders"
              className="text-blue-600 hover:underline font-semibold"
            >
              View All Orders →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
