// import React, { useContext, useState, useMemo } from 'react';
// import { AppContext } from '../context/AppContext';
// import { useNavigate } from 'react-router-dom';
// import '../styles/PreviousPurchases.css';

// const PreviousPurchasesPage = () => {
//   const { previousPurchases, cartItems } = useContext(AppContext);
//   const navigate = useNavigate();

//   // Search query state
//   const [searchQuery, setSearchQuery] = useState('');

//   // Sort/filter/group states (simple placeholders)
//   const [sortBy, setSortBy] = useState('name'); // name, price, category
//   const [filterByCategory, setFilterByCategory] = useState('all');
//   const [groupBy, setGroupBy] = useState('none'); // no grouping for now

//   // Filter and sort previous purchases based on search and selected options
//   const filteredPurchases = useMemo(() => {
//     let items = [...previousPurchases];

//     // Filter by search query (case-insensitive)
//     if (searchQuery.trim()) {
//       items = items.filter(item =>
//         item.name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     // Filter by category
//     if (filterByCategory !== 'all') {
//       items = items.filter(item => item.category === filterByCategory);
//     }

//     // Sort items
//     if (sortBy === 'name') {
//       items.sort((a, b) => a.name.localeCompare(b.name));
//     } else if (sortBy === 'price') {
//       items.sort((a, b) => a.price - b.price);
//     } else if (sortBy === 'category') {
//       items.sort((a, b) => a.category.localeCompare(b.category));
//     }

//     return items;
//   }, [previousPurchases, searchQuery, filterByCategory, sortBy]);

//   // Unique categories for filter dropdown
//   const categories = useMemo(() => {
//     const cats = previousPurchases.map(item => item.category);
//     return ['all', ...new Set(cats)];
//   }, [previousPurchases]);

//   return (
//     <div style={{ maxWidth: '900px', margin: 'auto', padding: '20px' }}>
//       {/* Top Bar */}
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
//         {/* Logo Center */}
//         <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
//           <img src="/logo.png" alt="Logo" style={{ height: '50px' }} />
//         </div>

//         {/* Icons on right */}
//         <div style={{ marginLeft: 'auto', display: 'flex', gap: '20px', position: 'absolute', right: '20px' }}>
//           {/* Cart Icon with badge */}
//           <div
//             style={{ position: 'relative', cursor: 'pointer' }}
//             onClick={() => navigate('/cart')}
//             title="Go to Cart"
//           >
//             <img src="/icons/cart.svg" alt="Cart" style={{ height: '30px' }} />
//             {cartItems.length > 0 && (
//               <span
//                 style={{
//                   position: 'absolute',
//                   top: '-8px',
//                   right: '-8px',
//                   background: 'red',
//                   color: 'white',
//                   borderRadius: '50%',
//                   padding: '2px 6px',
//                   fontSize: '12px',
//                   fontWeight: 'bold',
//                 }}
//               >
//                 {cartItems.length}
//               </span>
//             )}
//           </div>

//           {/* User Profile Icon */}
//           <div
//             style={{ cursor: 'pointer' }}
//             onClick={() => navigate('/user-profile')}
//             title="User Profile"
//           >
//             <img
//               src="/icons/user-placeholder.png"
//               alt="User Profile"
//               style={{ height: '35px', borderRadius: '50%' }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Page Title */}
//       <h2 style={{ marginTop: '80px', marginBottom: '10px' }}>Previous Purchases</h2>

//       {/* Search Bar */}
//       <input
//         type="text"
//         placeholder="Search previous purchases..."
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         style={{
//           width: '100%',
//           padding: '10px',
//           fontSize: '16px',
//           marginBottom: '10px',
//           boxSizing: 'border-box',
//         }}
//       />

//       {/* Buttons: Sort, Filter, Group By */}
//       <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
//         {/* Sort */}
//         <select
//           value={sortBy}
//           onChange={(e) => setSortBy(e.target.value)}
//           style={{ padding: '8px', flex: '1' }}
//         >
//           <option value="name">Sort by Name</option>
//           <option value="price">Sort by Price</option>
//           <option value="category">Sort by Category</option>
//         </select>

//         {/* Filter */}
//         <select
//           value={filterByCategory}
//           onChange={(e) => setFilterByCategory(e.target.value)}
//           style={{ padding: '8px', flex: '1' }}
//         >
//           {categories.map((cat) => (
//             <option key={cat} value={cat}>
//               {cat === 'all' ? 'Filter by Category' : cat}
//             </option>
//           ))}
//         </select>

//         {/* Group By - placeholder, no grouping implemented */}
//         <select
//           value={groupBy}
//           onChange={(e) => setGroupBy(e.target.value)}
//           style={{ padding: '8px', flex: '1' }}
//         >
//           <option value="none">Group By</option>
//           {/* You can extend this to support grouping by seller or category */}
//         </select>
//       </div>

//       {/* Products List */}
//       <div>
//         {filteredPurchases.length === 0 ? (
//           <p>No previous purchases found.</p>
//         ) : (
//           filteredPurchases.map((product) => (
//             <div
//               key={product.id}
//               onClick={() => navigate(`/product/${product.id}`)}
//               style={{
//                 display: 'flex',
//                 gap: '20px',
//                 padding: '15px',
//                 marginBottom: '15px',
//                 border: '1px solid #ccc',
//                 borderRadius: '8px',
//                 cursor: 'pointer',
//                 alignItems: 'center',
//               }}
//             >
//               {/* Product Image */}
//               <img
//                 src={product.image}
//                 alt={product.name}
//                 style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '6px' }}
//               />

//               {/* Product Details */}
//               <div style={{ flex: 1 }}>
//                 <h3 style={{ margin: '0 0 5px 0' }}>{product.name}</h3>
//                 <p style={{ margin: '3px 0' }}>
//                   <strong>Price:</strong> Rs. {product.price}
//                 </p>
//                 <p style={{ margin: '3px 0' }}>
//                   <strong>Category:</strong> {product.category}
//                 </p>
//                 <p style={{ margin: '3px 0' }}>
//                   <strong>Seller:</strong> {product.seller}
//                 </p>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default PreviousPurchasesPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const PurchasesPage = () => {
  const navigate = useNavigate();
  const { previousPurchases, cartCount } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('name'); // name, price
  const [filterOption, setFilterOption] = useState(''); // e.g., 'recyclable'
  const [groupByOption, setGroupByOption] = useState(''); // e.g., 'category'

  // Simulated filter logic: assuming items have 'category' and 'tags' (e.g., recyclable)
  const filteredPurchases = previousPurchases
    .filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(item =>
      filterOption ? (item.tags?.includes(filterOption) || item.category === filterOption) : true
    )
    .sort((a, b) => {
      if (sortOption === 'price') return a.price - b.price;
      return a.title.localeCompare(b.title);
    });

  const groupedPurchases = groupByOption
    ? filteredPurchases.reduce((acc, item) => {
        const key = item[groupByOption] || 'Others';
        acc[key] = acc[key] || [];
        acc[key].push(item);
        return acc;
      }, {})
    : { All: filteredPurchases };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-4 bg-white shadow">
        <div className="flex-1 text-center text-xl font-bold cursor-pointer" onClick={() => navigate('/landing')}>
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

      {/* Title */}
      <h2 className="text-2xl text-center mt-4 font-semibold">Previous Purchases</h2>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto px-4 mt-6">
        <input
          type="text"
          placeholder="Search previous purchases..."
          className="w-full border border-gray-300 rounded-lg p-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="max-w-3xl mx-auto px-4 mt-4 flex gap-2">
        <select
          className="p-2 rounded border w-1/3"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
        </select>

        <select
          className="p-2 rounded border w-1/3"
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
        >
          <option value="">No Filter</option>
          <option value="recyclable">Recyclable</option>
          <option value="reusable">Reusable</option>
          <option value="category1">Category: Electronics</option>
        </select>

        <select
          className="p-2 rounded border w-1/3"
          value={groupByOption}
          onChange={(e) => setGroupByOption(e.target.value)}
        >
          <option value="">No Group</option>
          <option value="category">Group by Category</option>
          <option value="seller">Group by Seller</option>
        </select>
      </div>

      {/* Product List */}
      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-6 pb-20">
        {Object.entries(groupedPurchases).map(([group, items]) => (
          <div key={group}>
            {groupByOption && (
              <h3 className="text-xl font-semibold text-gray-700 mb-2">{group}</h3>
            )}
            {items.map((item, index) => (
              <div key={index} className="flex items-center bg-white shadow p-4 rounded-lg mb-3">
                <img
                  src={item.images?.[0] || '/placeholder.png'}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="ml-4 flex-grow">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-gray-600">₹{item.price}</p>
                  <p className="text-gray-500 text-sm">Category: {item.category || '—'}</p>
                  <p className="text-gray-500 text-sm">Seller: {item.seller || '—'}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchasesPage;

