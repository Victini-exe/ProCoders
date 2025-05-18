import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import '../styles/PreviousPurchases.css';

const PreviousPurchasesPage = () => {
  const { previousPurchases, cartItems } = useContext(AppContext);
  const navigate = useNavigate();

  // Search query state
  const [searchQuery, setSearchQuery] = useState('');

  // Sort/filter/group states (simple placeholders)
  const [sortBy, setSortBy] = useState('name'); // name, price, category
  const [filterByCategory, setFilterByCategory] = useState('all');
  const [groupBy, setGroupBy] = useState('none'); // no grouping for now

  // Filter and sort previous purchases based on search and selected options
  const filteredPurchases = useMemo(() => {
    let items = [...previousPurchases];

    // Filter by search query (case-insensitive)
    if (searchQuery.trim()) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (filterByCategory !== 'all') {
      items = items.filter(item => item.category === filterByCategory);
    }

    // Sort items
    if (sortBy === 'name') {
      items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'price') {
      items.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'category') {
      items.sort((a, b) => a.category.localeCompare(b.category));
    }

    return items;
  }, [previousPurchases, searchQuery, filterByCategory, sortBy]);

  // Unique categories for filter dropdown
  const categories = useMemo(() => {
    const cats = previousPurchases.map(item => item.category);
    return ['all', ...new Set(cats)];
  }, [previousPurchases]);

  return (
    <div style={{ maxWidth: '900px', margin: 'auto', padding: '20px' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        {/* Logo Center */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '50px' }} />
        </div>

        {/* Icons on right */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '20px', position: 'absolute', right: '20px' }}>
          {/* Cart Icon with badge */}
          <div
            style={{ position: 'relative', cursor: 'pointer' }}
            onClick={() => navigate('/cart')}
            title="Go to Cart"
          >
            <img src="/icons/cart.svg" alt="Cart" style={{ height: '30px' }} />
            {cartItems.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: 'red',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '2px 6px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              >
                {cartItems.length}
              </span>
            )}
          </div>

          {/* User Profile Icon */}
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/user-profile')}
            title="User Profile"
          >
            <img
              src="/icons/user-placeholder.png"
              alt="User Profile"
              style={{ height: '35px', borderRadius: '50%' }}
            />
          </div>
        </div>
      </div>

      {/* Page Title */}
      <h2 style={{ marginTop: '80px', marginBottom: '10px' }}>Previous Purchases</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search previous purchases..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '16px',
          marginBottom: '10px',
          boxSizing: 'border-box',
        }}
      />

      {/* Buttons: Sort, Filter, Group By */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: '8px', flex: '1' }}
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="category">Sort by Category</option>
        </select>

        {/* Filter */}
        <select
          value={filterByCategory}
          onChange={(e) => setFilterByCategory(e.target.value)}
          style={{ padding: '8px', flex: '1' }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'Filter by Category' : cat}
            </option>
          ))}
        </select>

        {/* Group By - placeholder, no grouping implemented */}
        <select
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value)}
          style={{ padding: '8px', flex: '1' }}
        >
          <option value="none">Group By</option>
          {/* You can extend this to support grouping by seller or category */}
        </select>
      </div>

      {/* Products List */}
      <div>
        {filteredPurchases.length === 0 ? (
          <p>No previous purchases found.</p>
        ) : (
          filteredPurchases.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              style={{
                display: 'flex',
                gap: '20px',
                padding: '15px',
                marginBottom: '15px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                cursor: 'pointer',
                alignItems: 'center',
              }}
            >
              {/* Product Image */}
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '6px' }}
              />

              {/* Product Details */}
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 5px 0' }}>{product.name}</h3>
                <p style={{ margin: '3px 0' }}>
                  <strong>Price:</strong> Rs. {product.price}
                </p>
                <p style={{ margin: '3px 0' }}>
                  <strong>Category:</strong> {product.category}
                </p>
                <p style={{ margin: '3px 0' }}>
                  <strong>Seller:</strong> {product.seller}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PreviousPurchasesPage;
