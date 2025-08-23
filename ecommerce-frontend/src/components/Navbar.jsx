import { useState, useEffect } from "react";
import { FaUserCircle, FaShoppingCart, FaHeart, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "./Logo.jpg"; // Make sure Logo.jpg is inside src/assets

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [favCount, setFavCount] = useState(0);
  const navigate = useNavigate();

  // Load counts
  useEffect(() => {
    const loadCounts = () => {
      const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
      const favItems = JSON.parse(localStorage.getItem("favourites")) || [];
      setCartCount(cartItems.length);
      setFavCount(favItems.length);
    };

    loadCounts();
    window.addEventListener("storage", loadCounts);
    return () => window.removeEventListener("storage", loadCounts);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    localStorage.removeItem("favourites");
    setCartCount(0);
    setFavCount(0);
    window.location.href = "/";
  };

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-gradient-to-r from-gray-900 via-teal-700 to-gray-900 text-white shadow-lg sticky top-0 z-50">
      {/* Logo + Brand */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/home")}
      >
        <img src={logo} alt="Chronos Logo" className="h-10 w-10 rounded-full shadow-md" />
        <h1 className="text-2xl font-bold tracking-wide">Chronos</h1>
      </div>

      {/* Desktop Icons */}
      <div className="hidden md:flex items-center gap-6">
        {/* Favourites */}
        <button onClick={() => navigate("/favourites")} className="relative">
          <FaHeart size={22} className="hover:text-pink-400 transition" />
          {favCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
              {favCount}
            </span>
          )}
        </button>

        {/* Cart */}
        <button onClick={() => navigate("/cart")} className="relative">
          <FaShoppingCart size={22} className="hover:text-yellow-400 transition" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold rounded-full px-1.5 py-0.5">
              {cartCount}
            </span>
          )}
        </button>

        {/* Profile */}
        <div className="relative">
          <button onClick={() => setOpen(!open)} className="flex items-center">
            <FaUserCircle size={28} className="hover:text-amber-400 transition" />
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-40 bg-white text-black rounded-lg shadow-lg py-2 z-20 animate-fadeIn">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded-md"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-16 right-4 bg-gray-800 text-white rounded-lg shadow-lg flex flex-col w-40 py-2 md:hidden animate-fadeIn">
          <button
            onClick={() => navigate("/favourites")}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700"
          >
            <FaHeart /> Favourites
            {favCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                {favCount}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700"
          >
            <FaShoppingCart /> Cart
            {cartCount > 0 && (
              <span className="ml-auto bg-yellow-500 text-black text-xs font-bold rounded-full px-1.5 py-0.5">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700"
          >
            <FaUserCircle /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
