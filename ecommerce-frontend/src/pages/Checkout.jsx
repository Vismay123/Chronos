import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2"; // npm install sweetalert2

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const cart =
    location.state?.cart || JSON.parse(localStorage.getItem("cart")) || [];

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  // ✅ Logged in user
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  // ✅ Form data state
  const [formData, setFormData] = useState({
    name: loggedInUser?.name || "",
    email: loggedInUser?.email || "",
    address: "",
  });

  // ✅ Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      Swal.fire("Oops!", "Your cart is empty!", "error");
      return;
    }

    if (!loggedInUser?._id) {
      Swal.fire("Login Required", "Please login to place an order!", "warning");
      navigate("/");
      return;
    }

    setLoading(true);

    try {
      const totalAmount = cart.reduce(
        (sum, item) => sum + parseFloat(item.price),
        0
      );

      // ✅ Send only required fields to backend
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          total: totalAmount,
          user: {
            name: formData.name,
            email: formData.email,
            address: formData.address,
          },
          paymentMethod:
            paymentMethod === "card" ? "Card" : "Cash on Delivery",
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Order failed");

      localStorage.removeItem("cart");
      setLoading(false);

      Swal.fire({
        title: "🎉 Order Placed!",
        text:
          paymentMethod === "cod"
            ? "Your order will be delivered. Pay on delivery."
            : "Payment successful! Your order is confirmed.",
        icon: "success",
        confirmButtonText: "Continue Shopping",
      }).then(() => {
        navigate("/home");
      });
    } catch (error) {
      setLoading(false);
      Swal.fire("Error", error.message || "Something went wrong!", "error");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-extrabold text-center mb-6 text-teal-700">
        Checkout
      </h2>

      {/* Order Summary */}
      <div className="bg-white p-6 mb-6 rounded-xl shadow-lg">
        <h3 className="font-semibold mb-3 text-lg border-b pb-2">
          🛒 Order Summary
        </h3>
        {cart.length === 0 ? (
          <p className="text-gray-600">No items in cart.</p>
        ) : (
          cart.map((item, i) => (
            <div
              key={i}
              className="flex justify-between border-b py-2 text-gray-700"
            >
              <span>{item.name}</span>
              <span>${item.price}</span>
            </div>
          ))
        )}
        <p className="font-bold mt-3 text-right text-lg">
          Total: $
          {cart
            .reduce((sum, item) => sum + parseFloat(item.price), 0)
            .toFixed(2)}
        </p>
      </div>

      {/* Payment Form */}
      <form
        onSubmit={handlePayment}
        className="space-y-4 bg-white p-6 shadow-lg rounded-xl"
      >
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-teal-500"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-teal-500"
          required
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-teal-500"
          required
        />

        {/* Payment Options */}
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="card"
              checked={paymentMethod === "card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Credit / Debit Card
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Cash on Delivery
          </label>
        </div>

        {paymentMethod === "card" && (
          <input
            type="text"
            placeholder="Card Number"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-teal-500"
            required
          />
        )}

        <button
          type="submit"
          className="bg-gradient-to-r from-teal-500 to-green-500 text-white px-4 py-3 rounded-lg w-full hover:opacity-90 font-semibold"
          disabled={loading}
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </form>

      {/* Continue Shopping */}
      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/home")}
          className="text-teal-600 hover:underline"
        >
          ← Continue Shopping
        </button>
      </div>
    </div>
  );
}
