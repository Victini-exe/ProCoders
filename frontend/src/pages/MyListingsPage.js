// src/pages/MyListingsPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MyListingsPage.css';

const dummyListings = [
  {
    id: 1,
    name: 'Laptop',
    price: 65000,
    category: 'Electronics',
    status: 'Available',
    seller: 'John Doe',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    name: 'Chair',
    price: 1500,
    category: 'Furniture',
    status: 'Sold',
    seller: 'Jane Smith',
    image: 'https://via.placeholder.com/150',
  },
];

const MyListingsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="my-listings">
      <div className="top-bar">
        <div className="logo">LOGO</div>
        <div className="top-icons">
          <div className="cart" onClick={() => navigate('/cart')}>
            🛒<span className="badge">2</span>
          </div>
          <div className="profile" onClick={() => navigate('/profile')}>
            <img src="https://via.placeholder.com/40" alt="User" />
          </div>
        </div>
      </div>

      <div className="header-row">
        <h2>My Listings</h2>
        <button className="add-btn" onClick={() => navigate('/add-product')}>+ Add New</button>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Search listings..." />
      </div>

      <div className="filters">
        <button>Sort</button>
        <button>Filter</button>
        <button>Group By</button>
      </div>

      <div className="listing-cards">
        {dummyListings.map((item) => (
          <div className="listing-card" key={item.id} onClick={() => navigate('/product', { state: { product: item } })}>
            <img src={item.image} alt={item.name} />
            <div className="details">
              <h3>{item.name}</h3>
              <p>Price: ₹{item.price}</p>
              <p>Category: {item.category}</p>
              <p>Status: {item.status}</p>
              <p>Seller: {item.seller}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyListingsPage;