// import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import SignupPage from './pages/SignupPage';
// import LoginPage from './pages/LoginPage';
// import LandingPage from './pages/LandingPage';
// import ProductPage from './pages/ProductPage';
// import AddProductPage from './pages/AddProductPage';
// import MyListingsPage from './pages/MyListingsPage';
// import CartPage from './pages/CartPage';
// import PreviousPurchasesPage from './pages/PreviousPurchasesPage';
// import UserProfilePage from './pages/UserProfilePage';



// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<SignupPage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/landing" element={<LandingPage />} />
//         <Route path="/product" element={<ProductPage />} />
//         <Route path="/addproduct" element={<AddProductPage />} />
//         <Route path="/listings" element={<MyListingsPage />} />
//         <Route path="/cart" element={<CartPage />} />
//         <Route path="/purchases" element={<PreviousPurchasesPage />} />
//         <Route path="/dashboard" element={<UserProfilePage />} />


//         {/* <Route path="/product/:productId" element={<ProductPage products={products} addToCart={addToCart} cartCount={cart.length} />} /> */}

//         {/* <Route path="/addproduct" element={<AddProductPage />} />
//         <Route path="/listing" element={<MyListingsPage />} />
//         <Route path="/cart" element={<CartPage />} />
//         <Route path="/purchases" element={<PreviousPurchasesPage />} />
//         <Route path="/profile" element={<UserProfilePage />} /> */}
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SignUp from './pages/SignupPage';
import Login from './pages/LoginPage';
import Landing from './pages/LandingPage';
import Products from './pages/ProductPage';
import Cart from './pages/CartPage';
import Purchases from './pages/PreviousPurchasesPage';
import Profile from './pages/ProfilePage';
import Listings from './pages/MyListingsPage';
import AddPrdouct from './pages/AddProductPage';

import PrivateRoute from './components/privateroute'; // <-- Import PrivateRoute

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/product/:id" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/purchases" element={<Purchases />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/addproduct" element={<AddPrdouct />} />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* DUMMY TEST
        <Route path="/profile" element={<Profile />} /> */}
      </Routes>
    </Router>
  );
};

export default App;

