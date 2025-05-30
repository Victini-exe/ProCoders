// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaBars, FaUserCircle, FaShoppingCart, FaSearch, FaFilter, FaSortAmountDown, FaLayerGroup } from 'react-icons/fa';
// import '../styles/LandingPage.css';

// const LandingPage = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [cartCount, setCartCount] = useState(2);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const navigate = useNavigate();

//   const handleSearch = () => {
//     console.log(`Searching for ${searchTerm}`);
//   };

//   const products = [
//     { id: 1, name: 'Product 1', image: 'https://via.placeholder.com/150' },
//     { id: 2, name: 'Product 2', image: 'https://via.placeholder.com/150' },
//     { id: 3, name: 'Product 3', image: 'https://via.placeholder.com/150' },
//     { id: 4, name: 'Product 4', image: 'https://via.placeholder.com/150' },
//     { id: 5, name: 'Product 5', image: 'https://via.placeholder.com/150' },
//   ];

//   return (
//     <div className="landing-page">
//       <header className="header">
//         <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}><FaBars /></button>
//         <div className="logo">MyStore</div>
//         <div className="header-icons">
//           <div className="cart" onClick={() => navigate('/cart')}>
//             <FaShoppingCart />
//             {cartCount > 0 && <span className="badge">{cartCount}</span>}
//           </div>
//           <div className="profile" onClick={() => navigate('/dashboard')}>
//             <FaUserCircle />
//           </div>
//         </div>
//       </header>

//       {menuOpen && (
//         <nav className="side-menu">
//           <ul>
//             <li onClick={() => navigate('/my-listing')}>My Listing</li>
//             <li onClick={() => navigate('/add-product')}>Add Product</li>
//             <li onClick={() => navigate('/about')}>About</li>
//             <li onClick={() => navigate('/contact')}>Contact</li>
//           </ul>
//         </nav>
//       )}

//       <div className="search-section">
//         <input
//           type="text"
//           placeholder="Search for products..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <button onClick={handleSearch}><FaSearch /></button>
//       </div>

//       <div className="action-buttons">
//         <button><FaSortAmountDown /> Sort</button>
//         <button><FaFilter /> Filter</button>
//         <button><FaLayerGroup /> Group By</button>
//       </div>

//       <div className="banner">
//         <img src="https://via.placeholder.com/1000x300" alt="Banner" />
//       </div>

//       <div className="categories">
//         <button onClick={() => alert('Show categories')}>Browse Categories</button>
//       </div>

//       <div className="product-grid">
//         {products.length > 0 ? products.map(product => (
//         //   <div
//         //     className="product-card"
//         //     key={product.id}
//         //     onClick={() => navigate(`/product/${product.id}`)}
//         //     style={{ cursor: 'pointer' }}
//         //   >
//         //     <img src={product.image} alt={product.name} />
//         //     <h3>{product.name}</h3>
//         //   </div>

//         <div
//   className="product-card"
//   key={product.id}
//   onClick={() => navigate('/product', {
//     state: {
//       product: {
//         ...product,
//         description: 'This is a sample description for ' + product.name,
//         price: 499,
//         images: [
//           'https://via.placeholder.com/300x200',
//           'https://via.placeholder.com/300x201',
//           'https://via.placeholder.com/300x202',
//         ],
//       },
//     }
//   })}
// >
//   <img src={product.image} alt={product.name} />
//   <h3>{product.name}</h3>
// </div>


//         )) : <p className="no-results">No products found</p>}
//       </div>
//     </div>
//   );
// };

// export default LandingPage;

// ---

import Navbar from '../components/navbar';

<Navbar />

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import bannerImage from '../assets/banner.jpg';

const categoriesList = ['All', 'Furniture', 'Electronics', 'Books', 'Clothing', 'Toys'];

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [featureFilter, setFeatureFilter] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [groupedProducts, setGroupedProducts] = useState({});

  const backendURL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/products`);
        setProducts(res.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [backendURL]);

  useEffect(() => {
    let result = [...products];

    // Search
    if (searchTerm.trim()) {
      result = result.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'All') {
      result = result.filter(p => p.category === categoryFilter);
    }

    // Feature filter
    if (featureFilter) {
      result = result.filter(p => p.features?.includes(featureFilter));
    }

    // Sort
    if (sortOption === 'price-low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high-low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'name-asc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    // Group by category
    const grouped = result.reduce((acc, curr) => {
      const groupKey = curr.category || 'Other';
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(curr);
      return acc;
    }, {});

    setGroupedProducts(grouped);
    setFiltered(result);
  }, [products, searchTerm, categoryFilter, featureFilter, sortOption]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        {/* Left Menu (Collapsable - optional future enhancement) */}
        <div>
          <button className="text-gray-600 font-bold">☰ Menu</button>
        </div>

        {/* Center Logo */}
        <div className="text-xl font-bold text-green-700">EcoFinds</div>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          <button onClick={() => (window.location.href = '/cart')}>
            🛒<span className="text-sm bg-red-500 text-white px-1 rounded-full">3</span>
          </button>
          <button onClick={() => (window.location.href = '/profile')}>👤</button>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 rounded-md border border-gray-300 mb-3"
      />

      {/* Filters */}
      <div className="flex gap-2 mb-3">
        <select
          value={featureFilter}
          onChange={(e) => setFeatureFilter(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded"
        >
          <option value="">Filter By Feature</option>
          <option value="recyclable">♻️ Recyclable</option>
          <option value="reusable">🔁 Reusable</option>
          <option value="reducible">📉 Reducible</option>
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded"
        >
          <option value="">Sort By</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
          <option value="name-asc">Name A-Z</option>
        </select>
      </div>

      {/* Banner */}
      <div className="mb-4">
        <img src={bannerImage} alt="EcoFinds Banner" className="w-full rounded-xl max-h-72 object-cover" />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categoriesList.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1 rounded-full border text-sm ${
              categoryFilter === cat
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Display */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No products found.</p>
      ) : (
        Object.entries(groupedProducts).map(([group, items]) => (
          <div key={group} className="mb-8">
            <h3 className="text-lg font-semibold mb-2">{group}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {items.map((product) => (
                <div
                  key={product._id}
                  className="bg-white shadow rounded-xl p-4 cursor-pointer hover:shadow-lg"
                  onClick={() => (window.location.href = `/product/${product._id}`)}
                >
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/150'}
                    alt={product.title}
                    className="w-full h-40 object-cover rounded-lg mb-2"
                  />
                  <h4 className="font-bold text-md">{product.title}</h4>
                  <p className="text-sm text-gray-600">Rs. {product.price}</p>
                  <p className="text-xs text-gray-400">Category: {product.category}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default LandingPage;


