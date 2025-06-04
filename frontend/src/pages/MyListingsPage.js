// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles/MyListingsPage.css';

// const dummyListings = [
//   {
//     id: 1,
//     name: 'Laptop',
//     price: 65000,
//     category: 'Electronics',
//     status: 'Available',
//     seller: 'John Doe',
//     image: 'https://via.placeholder.com/150',
//   },
//   {
//     id: 2,
//     name: 'Chair',
//     price: 1500,
//     category: 'Furniture',
//     status: 'Sold',
//     seller: 'Jane Smith',
//     image: 'https://via.placeholder.com/150',
//   },
// ];

// const MyListingsPage = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="my-listings">
//       <div className="top-bar">
//         <div className="logo">LOGO</div>
//         <div className="top-icons">
//           <div className="cart" onClick={() => navigate('/cart')}>
//             🛒<span className="badge">2</span>
//           </div>
//           <div className="profile" onClick={() => navigate('/dashboard')}>
//             <img src="https://via.placeholder.com/40" alt="User" />
//           </div>
//         </div>
//       </div>

//       <div className="header-row">
//         <h2>My Listings</h2>
//         <button className="add-btn" onClick={() => navigate('/addproduct')}>+ Add New</button>
//       </div>

//       <div className="search-bar">
//         <input type="text" placeholder="Search listings..." />
//       </div>

//       <div className="filters">
//         <button>Sort</button>
//         <button>Filter</button>
//         <button>Group By</button>
//       </div>

//       <div className="listing-cards">
//         {dummyListings.map((item) => (
//           <div className="listing-card" key={item.id} onClick={() => navigate('/product', { state: { product: item } })}>
//             <img src={item.image} alt={item.name} />
//             <div className="details">
//               <h3>{item.name}</h3>
//               <p>Price: ₹{item.price}</p>
//               <p>Category: {item.category}</p>
//               <p>Status: {item.status}</p>
//               <p>Seller: {item.seller}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MyListingsPage;

// ---

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart, FaPlus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const MyListingsPage = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const backendURL = process.env.REACT_APP_BACKEND_URL;

  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [filterOption, setFilterOption] = useState('');
  const [groupOption, setGroupOption] = useState('');

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/user/my-listings`);
        setListings(res.data || []);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
      }
    };

    fetchMyListings();
  }, [backendURL]);

  useEffect(() => {
    let results = [...listings];

    if (searchQuery) {
      results = results.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterOption) {
      results = results.filter((item) => item.sustainabilityTags?.includes(filterOption));
    }

    if (sortOption === 'priceAsc') {
      results.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'priceDesc') {
      results.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'recent') {
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (groupOption) {
      results.sort((a, b) => a[groupOption]?.localeCompare(b[groupOption]));
    }

    setFilteredListings(results);
  }, [listings, searchQuery, sortOption, filterOption, groupOption]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-4 bg-white shadow">
        <div
          className="flex-1 text-center text-xl font-bold cursor-pointer"
          onClick={() => navigate('/landing')}
        >
          EcoFinds
        </div>
        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
            <FaShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <FaUserCircle size={24} className="cursor-pointer" onClick={() => navigate('/profile')} />
        </div>
      </div>

      {/* Title and Add New */}
      <div className="flex justify-between items-center px-4 mt-6">
        <h2 className="text-2xl font-semibold">My Listings</h2>
        <button
          onClick={() => navigate('/addproduct')}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >
          <FaPlus />
          Add New
        </button>
      </div>

      {/* Search and Controls */}
      <div className="px-4 mt-4 space-y-3">
        <input
          type="text"
          placeholder="Search your listings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
        <div className="flex gap-3 flex-wrap">
          <select
            onChange={(e) => setSortOption(e.target.value)}
            value={sortOption}
            className="border rounded px-3 py-2"
          >
            <option value="">Sort</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="recent">Most Recent</option>
          </select>

          <select
            onChange={(e) => setFilterOption(e.target.value)}
            value={filterOption}
            className="border rounded px-3 py-2"
          >
            <option value="">Filter</option>
            <option value="recyclable">Recyclable</option>
            <option value="reusable">Reusable</option>
            <option value="reducible">Reducible</option>
          </select>

          <select
            onChange={(e) => setGroupOption(e.target.value)}
            value={groupOption}
            className="border rounded px-3 py-2"
          >
            <option value="">Group By</option>
            <option value="category">Category</option>
            <option value="condition">Condition</option>
            <option value="brand">Brand</option>
          </select>
        </div>
      </div>

      {/* Listings */}
      <div className="px-4 mt-6 space-y-4 pb-10">
        {filteredListings.length === 0 ? (
          <p className="text-center text-gray-500">No listings found.</p>
        ) : (
          filteredListings.map((item) => (
            <div
              key={item._id}
              className="flex bg-white border rounded-lg shadow-md overflow-hidden cursor-pointer hover:bg-gray-50"
              onClick={() => navigate(`/product/${item._id}`)}
            >
              <img
                src={item.images?.[0] || '/placeholder.png'}
                alt={item.title}
                className="w-32 h-32 object-cover"
              />
              <div className="p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600">${item.price}</p>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p className="text-xs text-gray-400">Status: {item.condition}</p>
                  <p className="text-xs text-gray-400">Seller: You</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyListingsPage;
