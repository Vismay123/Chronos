import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    updateCart(newCart);
  };

  const increaseQty = (index) => {
    const newCart = [...cart];
    newCart[index].qty = (newCart[index].qty || 1) + 1;
    updateCart(newCart);
  };

  const decreaseQty = (index) => {
    const newCart = [...cart];
    if (newCart[index].qty > 1) {
      newCart[index].qty -= 1;
      updateCart(newCart);
    }
  };

  const getTotal = () =>
    cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">🛒 Your Shopping Cart</h2>

      {cart.length === 0 ? (
        <p className="text-gray-600">No items in cart.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {cart.map((p, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-white p-4 shadow rounded-lg hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{p.name}</h3>
                    <p className="text-gray-600">${p.price}</p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => decreaseQty(i)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        −
                      </button>
                      <span className="px-4">{p.qty || 1}</span>
                      <button
                        onClick={() => increaseQty(i)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="font-bold text-lg">
                    ${(p.price * (p.qty || 1)).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(i)}
                    className="text-red-500 mt-2 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white shadow p-6 rounded-lg h-fit sticky top-20">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            <p className="flex justify-between text-gray-700 mb-2">
              <span>Total Items:</span>
              <span>{cart.reduce((sum, item) => sum + (item.qty || 1), 0)}</span>
            </p>
            <p className="flex justify-between text-gray-700 mb-4">
              <span>Total Price:</span>
              <span className="font-bold">${getTotal().toFixed(2)}</span>
            </p>
            <button
              onClick={() => navigate("/checkout", { state: { cart } })}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
