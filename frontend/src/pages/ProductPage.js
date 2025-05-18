import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import '../styles/ProductPage.css';

const ProductPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { product } = location.state || {};
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [cartCount, setCartCount] = useState(2); // Update with global state later

  if (!product) {
    return <div>No product data found.</div>;
  }

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
    // Add to cart logic to be implemented with context or global state
  };

  return (
    <div className="product-page">
      <header className="header">
        <div className="logo" onClick={() => navigate('/')}>MyStore</div>
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

      <h1 className="page-title">Product Page</h1>

      <div className="product-images">
        <button onClick={() => setSelectedImageIndex((selectedImageIndex - 1 + product.images.length) % product.images.length)}>◀</button>
        <img
          src={product.images[selectedImageIndex]}
          alt={product.name}
          className="main-image"
        />
        <button onClick={() => setSelectedImageIndex((selectedImageIndex + 1) % product.images.length)}>▶</button>
      </div>

      <div className="product-info">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p><strong>Price:</strong> ₹{product.price}</p>
      </div>

      <button className="add-to-cart" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductPage;
