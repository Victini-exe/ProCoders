// import React, { useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles/CartPage.css';
// import { AppContext } from '../context/AppContext';

// const CartPage = () => {
//   const navigate = useNavigate();
//   const { cartItems, setCartItems, setPreviousPurchases } = useContext(AppContext);

//   const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);

//   const handleCheckout = () => {
//     setPreviousPurchases((prev) => [...prev, ...cartItems]);
//     setCartItems([]);
//     alert('Checkout successful! Items moved to Previous Purchases.');
//   };

//   return (
//     <div className="cart-page">
//       <div className="top-bar">
//         <div className="logo">LOGO</div>
//         <div className="top-icons">
//           <div className="profile" onClick={() => navigate('/profile')}>
//             <img src="https://via.placeholder.com/40" alt="User" />
//           </div>
//         </div>
//       </div>

//       <h2 className="page-title">Cart Page</h2>

//       <div className="cart-items">
//         {cartItems.length === 0 ? (
//           <p>Your cart is empty.</p>
//         ) : (
//           cartItems.map((item, idx) => (
//             <div className="cart-card" key={idx}>
//               <img src={item.image} alt={item.name} />
//               <div className="details">
//                 <h3>{item.name}</h3>
//                 <p>Price: ₹{item.price}</p>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {cartItems.length > 0 && (
//         <>
//           <div className="total">Total price to pay: ₹{totalPrice}</div>
//           <button className="checkout" onClick={handleCheckout}>Checkout</button>
//         </>
//       )}
//     </div>
//   );
// };

// export default CartPage;

// --- 

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useCart } from '../context/CartContext';


const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart, addPreviousPurchase } = useCart();

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    addPreviousPurchase(cartItems);
    clearCart();
    alert('Checkout complete! Items added to Previous Purchases.');
    navigate('/purchases');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-4 bg-white shadow">
        <button onClick={() => navigate('/landing')} className="text-xl font-bold">EcoFinds</button>
        <div className="cursor-pointer" onClick={() => navigate('/profile')}>
          <FaUserCircle size={24} />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl text-center mt-4 font-semibold">Cart Page</h2>

      {/* Cart Items */}
      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-4">
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        ) : (
          cartItems.map((item, index) => (
            <div key={index} className="flex items-center bg-white shadow p-4 rounded-lg">
              <img
                src={item.images?.[0] || '/placeholder.png'}
                alt={item.title}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="ml-4 flex-grow">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-700">₹{item.price}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Total & Checkout */}
      <div className="max-w-3xl mx-auto px-4 mt-8 text-lg font-medium text-right">
        Total Price: ₹{totalPrice}
      </div>

      <div className="fixed bottom-4 w-full flex justify-center px-4">
        <button
          onClick={handleCheckout}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-2xl shadow-md transition"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
