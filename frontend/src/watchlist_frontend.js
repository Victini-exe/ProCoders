import React, { useEffect, useState } from "react";
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import axios from "axios";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    axios.get("/api/watchlist")
      .then((response) => setWatchlist(response.data))
      .catch((error) => console.error("Failed to fetch watchlist:", error));
  }, []);

  const handleRemove = (productId) => {
    axios.delete(`/api/watchlist/${productId}`)
      .then(() => setWatchlist((prev) => prev.filter(item => item.id !== productId)))
      .catch((error) => console.error("Failed to remove item:", error));
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">🕒 My Watchlist</h2>
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
                <Button variant="outline" onClick={() => window.location.href = `/product/${item.id}`}>View</Button>
                <Button variant="destructive" onClick={() => handleRemove(item.id)}>Remove</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
