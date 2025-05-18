// src/pages/CartPage.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CartPage.css';
import { AppContext } from '../context/AppContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, setCartItems, setPreviousPurchases } = useContext(AppContext);

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);

  const handleCheckout = () => {
    setPreviousPurchases((prev) => [...prev, ...cartItems]);
    setCartItems([]);
    alert('Checkout successful! Items moved to Previous Purchases.');
  };

  return (
    <div className="cart-page">
      <div className="top-bar">
        <div className="logo">LOGO</div>
        <div className="top-icons">
          <div className="profile" onClick={() => navigate('/profile')}>
            <img src="https://via.placeholder.com/40" alt="User" />
          </div>
        </div>
      </div>

      <h2 className="page-title">Cart Page</h2>

      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((item, idx) => (
            <div className="cart-card" key={idx}>
              <img src={item.image} alt={item.name} />
              <div className="details">
                <h3>{item.name}</h3>
                <p>Price: ₹{item.price}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <>
          <div className="total">Total price to pay: ₹{totalPrice}</div>
          <button className="checkout" onClick={handleCheckout}>Checkout</button>
        </>
      )}
    </div>
  );
};

export default CartPage;