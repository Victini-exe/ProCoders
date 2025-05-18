import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import '../styles/ProductPage.css';
// import logo from '../assets/logo.png';

const ProductPage = ({ products, addToCart, cartCount }) => {
  const { productId } = useParams();
  const product = products.find((p) => p.id.toString() === productId);
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  if (!product) return <div>Product not found</div>;

  return (
    <div className="product-page">
      <header className="top-bar">
        <div className="logo-center">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="icons-right">
          <div className="cart-icon" onClick={() => (window.location.href = '/cart')}>
            <FaShoppingCart />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>
          <div
            className="profile-icon"
            onClick={() => (window.location.href = '/profile')}
          >
            <FaUserCircle />
          </div>
        </div>
      </header>

      <h2 className="page-title">Product Page</h2>

      <div className="product-image-section">
        <button onClick={prevImage} className="nav-button">◀</button>
        <img src={product.images[currentImage]} alt={product.name} className="product-img" />
        <button onClick={nextImage} className="nav-button">▶</button>
      </div>

      <div className="product-details">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p>Price: ₹{product.price}</p>
        <p>Category: {product.category}</p>
        {/* Add more details as needed */}
      </div>

      <button
        className="add-to-cart-btn"
        onClick={() => addToCart(product)}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductPage;
