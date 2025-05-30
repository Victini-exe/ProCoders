import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import ProductPage from './pages/ProductPage';
import AddProductPage from './pages/AddProductPage';
import MyListingsPage from './pages/MyListingsPage';
import CartPage from './pages/CartPage';
import PreviousPurchasesPage from './pages/PreviousPurchasesPage';
import UserProfilePage from './pages/UserProfilePage';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/addproduct" element={<AddProductPage />} />
        <Route path="/listings" element={<MyListingsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/purchases" element={<PreviousPurchasesPage />} />
        <Route path="/dashboard" element={<UserProfilePage />} />


        {/* <Route path="/product/:productId" element={<ProductPage products={products} addToCart={addToCart} cartCount={cart.length} />} /> */}

        {/* <Route path="/addproduct" element={<AddProductPage />} />
        <Route path="/listing" element={<MyListingsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/purchases" element={<PreviousPurchasesPage />} />
        <Route path="/profile" element={<UserProfilePage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
