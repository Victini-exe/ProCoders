import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  return (
    <div className="flex justify-between items-center px-4 py-4 bg-white shadow">
      <button onClick={() => navigate('/landing')} className="text-xl font-bold">EcoFinds</button>
      <div className="flex items-center space-x-4">
        <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
          <FaShoppingCart size={24} />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
              {cartItems.length}
            </span>
          )}
        </div>
        <FaUserCircle size={24} className="cursor-pointer" onClick={() => navigate('/profile')} />
      </div>
    </div>
  );
};

export default Navbar;
