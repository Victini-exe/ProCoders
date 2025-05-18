import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaUserCircle, FaShoppingCart, FaSearch, FaFilter, FaSortAmountDown, FaLayerGroup } from 'react-icons/fa';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(2);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    console.log(`Searching for ${searchTerm}`);
  };

  const products = [
    { id: 1, name: 'Product 1', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Product 2', image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Product 3', image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Product 4', image: 'https://via.placeholder.com/150' },
    { id: 5, name: 'Product 5', image: 'https://via.placeholder.com/150' },
  ];

  return (
    <div className="landing-page">
      <header className="header">
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}><FaBars /></button>
        <div className="logo">MyStore</div>
        <div className="header-icons">
          <div className="cart" onClick={() => navigate('/cart')}>
            <FaShoppingCart />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </div>
          <div className="profile" onClick={() => navigate('/dashboard')}>
            <FaUserCircle />
          </div>
        </div>
      </header>

      {menuOpen && (
        <nav className="side-menu">
          <ul>
            <li onClick={() => navigate('/my-listing')}>My Listing</li>
            <li onClick={() => navigate('/add-product')}>Add Product</li>
            <li onClick={() => navigate('/about')}>About</li>
            <li onClick={() => navigate('/contact')}>Contact</li>
          </ul>
        </nav>
      )}

      <div className="search-section">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}><FaSearch /></button>
      </div>

      <div className="action-buttons">
        <button><FaSortAmountDown /> Sort</button>
        <button><FaFilter /> Filter</button>
        <button><FaLayerGroup /> Group By</button>
      </div>

      <div className="banner">
        <img src="https://via.placeholder.com/1000x300" alt="Banner" />
      </div>

      <div className="categories">
        <button onClick={() => alert('Show categories')}>Browse Categories</button>
      </div>

      <div className="product-grid">
        {products.length > 0 ? products.map(product => (
        //   <div
        //     className="product-card"
        //     key={product.id}
        //     onClick={() => navigate(`/product/${product.id}`)}
        //     style={{ cursor: 'pointer' }}
        //   >
        //     <img src={product.image} alt={product.name} />
        //     <h3>{product.name}</h3>
        //   </div>

        <div
  className="product-card"
  key={product.id}
  onClick={() => navigate('/product', {
    state: {
      product: {
        ...product,
        description: 'This is a sample description for ' + product.name,
        price: 499,
        images: [
          'https://via.placeholder.com/300x200',
          'https://via.placeholder.com/300x201',
          'https://via.placeholder.com/300x202',
        ],
      },
    }
  })}
>
  <img src={product.image} alt={product.name} />
  <h3>{product.name}</h3>
</div>


        )) : <p className="no-results">No products found</p>}
      </div>
    </div>
  );
};

export default LandingPage;
