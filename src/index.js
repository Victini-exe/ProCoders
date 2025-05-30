// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './context/AppContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; // <-- Import AuthProvider
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* <-- Wrap with AuthProvider here */}
      <AppProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AppProvider>
    </AuthProvider>
  </React.StrictMode>
);
