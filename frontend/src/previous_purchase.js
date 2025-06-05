import React, { useEffect, useState } from "react";

const MOCK_USER = { user_id: "U001", name: "Harini" };

const MOCK_PURCHASES = [
  {
    product_id: "P012",
    title: "Analysis Device",
    category: "Home Decor",
    avg_rating: 2.67,
    purchase_date: "2025-06-01T12:00:00Z",
  },
  {
    product_id: "P083",
    title: "Several Device",
    category: "Sports",
    avg_rating: 3.0,
    purchase_date: "2025-05-21T08:30:00Z",
  },
];

function PreviousPurchases() {
  const [userId, setUserId] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPurchases, setLoadingPurchases] = useState(false);
  const [error, setError] = useState(null);

  // 1. Fetch current user info (placeholder endpoint)
  useEffect(() => {
    fetch("/api/current_user") // Placeholder: Replace with real backend URL later
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user info");
        return res.json();
      })
      .then((data) => {
        setUserId(data.user_id);
        setLoadingUser(false);
      })
      .catch(() => {
        // On failure, fallback to mock data (for dev)
        setUserId(MOCK_USER.user_id);
        setLoadingUser(false);
      });
  }, []);

  // 2. Fetch purchases once userId is set (placeholder endpoint)
  useEffect(() => {
    if (!userId) return;

    setLoadingPurchases(true);
    fetch(`/api/users/${userId}/purchases`) // Placeholder URL
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch purchases");
        return res.json();
      })
      .then((data) => {
        setPurchases(data);
        setLoadingPurchases(false);
      })
      .catch(() => {
        // On failure, fallback to mock purchases
        setPurchases(MOCK_PURCHASES);
        setLoadingPurchases(false);
      });
  }, [userId]);

  if (loadingUser) return <p>Loading user info...</p>;
  if (error) return <p>Error: {error}</p>;
  if (loadingPurchases) return <p>Loading previous purchases...</p>;
  if (purchases.length === 0) return <p>No previous purchases found.</p>;

  return (
    <div>
      <h2>Your Previous Purchases</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {purchases.map((product) => (
          <li
            key={product.product_id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{product.title}</h3>
            <p>
              <strong>Category:</strong> {product.category}
            </p>
            <p>
              <strong>Average Rating:</strong> {product.avg_rating.toFixed(1)} / 5
            </p>
            {product.purchase_date && (
              <p>
                <strong>Purchased On:</strong>{" "}
                {new Date(product.purchase_date).toLocaleDateString()}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PreviousPurchases;
