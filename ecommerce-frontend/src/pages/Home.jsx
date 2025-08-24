import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load products!");
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let data = [...products];
    if (search) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === "priceLow") {
      data.sort((a, b) => a.price - b.price);
    } else if (sort === "priceHigh") {
      data.sort((a, b) => b.price - a.price);
    } else if (sort === "name") {
      data.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFiltered(data);
  }, [search, sort, products]);

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success(`${product.name} added to cart!`);
  };

  const addToFavourites = (product) => {
    let favs = JSON.parse(localStorage.getItem("favourites")) || [];
    if (favs.find((f) => f.id === product.id)) {
      toast("Already in favourites ❤️");
      return;
    }
    favs.push(product);
    localStorage.setItem("favourites", JSON.stringify(favs));
    toast.success(`${product.name} added to favourites!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <Toaster position="top-center" />

      <header className="relative w-full h-[500px] overflow-hidden shadow-lg">
        <img
          src="./image.jpg" 
          alt="Chronos Banner"
          className="w-full h-full object-cover"
        />
      </header>

      <section className="flex flex-col sm:flex-row justify-between items-center gap-4 px-8 py-6 bg-gray-100 shadow-inner">
        <input
          type="text"
          placeholder="Search watches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-5 py-2 rounded-xl text-black w-full sm:w-1/3 bg-white shadow focus:ring-2 focus:ring-teal-500 outline-none transition"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-5 py-2 rounded-xl text-black bg-white shadow focus:ring-2 focus:ring-teal-500 outline-none transition w-full sm:w-1/4"
        >
          <option value="default">Sort By</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </section>

      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8 flex-grow">
        {filtered.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 text-lg">
            No products found
          </p>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 relative group overflow-hidden"
            >
            
              <div className="w-full h-56 bg-gray-100 flex items-center justify-center">
                <img
                  src={p.image || "https://via.placeholder.com/200"}
                  alt={p.name}
                  className="max-h-56 object-contain p-2"
                />
              </div>

             
              <div className="p-4">
                <h2 className="text-lg font-semibold truncate">{p.name}</h2>
                <p className="text-gray-700 font-medium mt-1">${p.price}</p>
              </div>

              
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => addToCart(p)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg mb-2 hover:bg-green-600"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => navigate("/checkout", { state: p })}
                  className="bg-amber-500 text-white px-4 py-2 rounded-lg mb-2 hover:bg-amber-600"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => addToFavourites(p)}
                  className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
                >
                  ❤ Add to Favourites
                </button>
              </div>
            </div>
          ))
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white text-center py-4 mt-auto">
        <p>© {new Date().getFullYear()} Chronos. All rights reserved.</p>
      </footer>
    </div>
  );
}
