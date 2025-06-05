import React, { useEffect, useState } from "react";
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import axios from "axios";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/wishlist", {
      headers: {
        Authorization: `Bearer YOUR_TOKEN_HERE`, // Replace with actual token logic
      }
    })
    .then((response) => {
      const products = response.data.map(item => ({
        ...item.product,
        wishlistItemId: item.id, // for delete
        alertOnPriceDrop: item.alert_on_price_drop,
      }));
      setWatchlist(products);
    })
    .catch((error) => console.error("Failed to fetch wishlist:", error))
    .finally(() => setLoading(false));
  }, []);

  const handleRemove = (wishlistItemId) => {
    axios.delete(`/wishlist/${wishlistItemId}`, {
      headers: {
        Authorization: `Bearer YOUR_TOKEN_HERE`,
      }
    })
    .then(() => {
      setWatchlist((prev) =>
        prev.filter(item => item.wishlistItemId !== wishlistItemId)
      );
    })
    .catch((error) => console.error("Failed to remove item:", error));
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">🕒 My Watchlist</h2>

      {loading ? (
        <p className="text-gray-500">Loading watchlist...</p>
      ) : watchlist.length === 0 ? (
        <p className="text-gray-500">No items in your watchlist yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {watchlist.map((item) => (
            <Card key={item.id} className="rounded-2xl shadow-md hover:shadow-lg transition-all">
              <img
                src={item.imageUrl || "https://via.placeholder.com/150"}
                alt={item.title}
                className="rounded-t-2xl h-48 w-full object-cover"
              />
              <CardContent className="p-4">
                <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <p className="text-sm text-gray-500 mb-2">Category: {item.category}</p>
                <p className="font-semibold text-green-700 mb-4">₹{item.price}</p>
                <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={() => window.location.href = `/product/${item.id}`}>
                    View
                  </Button>
                  <Button variant="destructive" onClick={() => handleRemove(item.wishlistItemId)}>
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;


