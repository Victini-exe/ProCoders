import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [previousPurchases, setPreviousPurchases] = useState([]);

  const backendURL = process.env.REACT_APP_BACKEND_URL;

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/cart`);
      setCartItems(res.data.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId) => {
    try {
      const res = await axios.post(`${backendURL}/api/cart/add`, {
        productId,
        quantity: 1,
      });

      if (res.data.success) {
        fetchCart();
      }
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.post(`${backendURL}/api/cart/clear`);
      setCartItems([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  const addPreviousPurchase = (items) => {
    setPreviousPurchases((prev) => [...prev, ...items]);
  };


  useEffect(() => {

    fetchCart();


//     // DUMMY TEST
//   setCartItems([
//     {
//       title: 'Reusable Water Bottle',
//       price: 250,
//       images: ['/dummy-bottle.jpg'], // Place this image in public folder or use URL
//     },
//     {
//       title: 'Recyclable Notebook',
//       price: 150,
//       images: ['/dummy-notebook.jpg'],
//     },
//   ]);

//     // DUMMY TEST
//     setPreviousPurchases([
//   {
//     title: 'Recyclable Notebook',
//     price: 150,
//     category: 'Stationery',
//     tags: ['recyclable'],
//     seller: 'EcoStation',
//     images: ['/dummy-notebook.jpg'],
//   },
//   {
//     title: 'Reusable Bag',
//     price: 80,
//     category: 'Accessories',
//     tags: ['reusable'],
//     seller: 'GreenLife',
//     images: ['/dummy-bag.jpg'],
//   },
//   {
//     title: 'Eco Toothbrush',
//     price: 40,
//     category: 'Personal Care',
//     tags: ['recyclable'],
//     seller: 'GreenLife',
//     images: ['/dummy-brush.jpg'],
//   },
// ]);

  
}, []);


  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount: cartItems.length,
        addToCart,
        clearCart,
        previousPurchases,
        addPreviousPurchase,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ✅ Export this custom hook
export const useCart = () => useContext(CartContext);
