import React, { createContext, useState, useEffect } from 'react';

// Create context
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // User info placeholder (you can extend with actual auth logic)
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    // add more user details here
  });

  // Cart items: array of product objects added to cart
  const [cartItems, setCartItems] = useState(() => {
    // Persist cart in localStorage if needed
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Previous purchases: products bought
  const [previousPurchases, setPreviousPurchases] = useState(() => {
    const savedPurchases = localStorage.getItem('previousPurchases');
    return savedPurchases ? JSON.parse(savedPurchases) : [];
  });

  // User's product listings for "My Listings" page
  const [myListings, setMyListings] = useState(() => {
    const savedListings = localStorage.getItem('myListings');
    return savedListings ? JSON.parse(savedListings) : [];
  });

  // Save cart, listings, purchases to localStorage on changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('previousPurchases', JSON.stringify(previousPurchases));
  }, [previousPurchases]);

  useEffect(() => {
    localStorage.setItem('myListings', JSON.stringify(myListings));
  }, [myListings]);

  // Add product to cart
  const addToCart = (product) => {
    setCartItems(prev => [...prev, product]);
  };

  // Remove product from cart by id
  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  // Add new product to listings (from Add Product page)
  const addListing = (product) => {
    setMyListings(prev => [...prev, product]);
  };

  // Checkout: move all cart items to previous purchases and clear cart
  const checkout = () => {
    setPreviousPurchases(prev => [...prev, ...cartItems]);
    setCartItems([]);
  };

  const [userDetails, setUserDetails] = useState({
  name: "John Doe",
  email: "john@example.com"
});


  return (
    <AppContext.Provider
      value={{
        user,
        cartItems,
        addToCart,
        removeFromCart,
        myListings,
        addListing,
        previousPurchases,
        checkout,
        setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// ---