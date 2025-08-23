import { useState, useEffect } from "react";

export default function Favourites() {
  const [favs, setFavs] = useState([]);

  // Load favourites from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favourites")) || [];
    setFavs(stored);
  }, []);

  // Remove product from favourites
  const handleRemove = (id) => {
    const updated = favs.filter((item) => item.id !== id);
    setFavs(updated);
    localStorage.setItem("favourites", JSON.stringify(updated));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Favourites ❤</h2>
      {favs.length === 0 ? (
        <p>No favourites yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favs.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded shadow relative">
              <img
                src={p.image}
                alt={p.name}
                className="h-40 w-full object-cover rounded"
              />
              <h3 className="mt-2 font-semibold">{p.name}</h3>
              <p>${p.price}</p>

              <button
                onClick={() => handleRemove(p.id)}
                className="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded hover:bg-red-600 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
