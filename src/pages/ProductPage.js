// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';
// import '../styles/ProductPage.css';

// const ProductPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { product } = location.state || {};
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [cartCount, setCartCount] = useState(2); // Update with global state later

//   if (!product) {
//     return <div>No product data found.</div>;
//   }

//   const handleAddToCart = () => {
//     setCartCount(prev => prev + 1);
//     // Add to cart logic to be implemented with context or global state
//   };

//   return (
//     <div className="product-page">
//       <header className="header">
//         <div className="logo" onClick={() => navigate('/')}>MyStore</div>
//         <div className="header-icons">
//           <div className="cart" onClick={() => navigate('/cart')}>
//             <FaShoppingCart />
//             {cartCount > 0 && <span className="badge">{cartCount}</span>}
//           </div>
//           <div className="profile" onClick={() => navigate('/dashboard')}>
//             <FaUserCircle />
//           </div>
//         </div>
//       </header>

//       <h1 className="page-title">Product Page</h1>

//       <div className="product-images">
//         <button onClick={() => setSelectedImageIndex((selectedImageIndex - 1 + product.images.length) % product.images.length)}>◀</button>
//         <img
//           src={product.images[selectedImageIndex]}
//           alt={product.name}
//           className="main-image"
//         />
//         <button onClick={() => setSelectedImageIndex((selectedImageIndex + 1) % product.images.length)}>▶</button>
//       </div>

//       <div className="product-info">
//         <h2>{product.name}</h2>
//         <p>{product.description}</p>
//         <p><strong>Price:</strong> ₹{product.price}</p>
//       </div>

//       <button className="add-to-cart" onClick={handleAddToCart}>
//         Add to Cart
//       </button>
//     </div>
//   );
// };

// export default ProductPage;

// ---

// import React, { useEffect, useState, useContext } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { CartContext } from '../context/CartContext';

// const ProductPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const backendURL = process.env.REACT_APP_BACKEND_URL;

//   const [product, setProduct] = useState(null);
//   const [activeImageIndex, setActiveImageIndex] = useState(0);
//   const [zoom, setZoom] = useState(false);

//   const { cartItems, addToCart } = useContext(CartContext);

//   useEffect(() => {
//     fetchProduct();
//   }, []);

//   const fetchProduct = async () => {
//     try {
//       const res = await axios.get(`${backendURL}/api/products/${id}`);
//       setProduct(res.data);
//     } catch (error) {
//       console.error('Failed to load product:', error);
//     }
//   };

//   const handleImageNav = (direction) => {
//     const total = product.images.length;
//     setActiveImageIndex((prev) =>
//       direction === 'left'
//         ? (prev - 1 + total) % total
//         : (prev + 1) % total
//     );
//   };

//   if (!product) {
//     return <div className="text-center py-10">Loading...</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Header */}
//       <div className="flex justify-between items-center px-4 py-4 bg-white shadow">
//         <button onClick={() => navigate('/menu')} className="text-xl font-bold">EcoFinds</button>
//         <div className="flex items-center space-x-4">
//           <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
//             <FaShoppingCart size={22} />
//             {cartItems.length > 0 && (
//               <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 rounded-full">
//                 {cartItems.length}
//               </span>
//             )}
//           </div>
//           <div className="cursor-pointer" onClick={() => navigate('/profile')}>
//             <FaUserCircle size={24} />
//           </div>
//         </div>
//       </div>

//       {/* Title */}
//       <h2 className="text-2xl text-center mt-4 font-semibold">Product Page</h2>

//       {/* Image Carousel */}
//       <div className="flex justify-center items-center mt-6 relative">
//         <ChevronLeft
//           className="absolute left-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600 hover:text-black"
//           onClick={() => handleImageNav('left')}
//         />
//         <div
//           className={`w-72 h-72 rounded-lg overflow-hidden ${zoom ? 'scale-110' : 'scale-100'} transition-transform duration-300`}
//           onClick={() => setZoom(!zoom)}
//         >
//           <img
//             src={product.images[activeImageIndex]}
//             alt="product"
//             className="w-full h-full object-cover"
//           />
//         </div>
//         <ChevronRight
//           className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600 hover:text-black"
//           onClick={() => handleImageNav('right')}
//         />
//       </div>

//       {/* Product Details */}
//       <div className="max-w-2xl mx-auto mt-8 px-4 space-y-3">
//         <h3 className="text-xl font-semibold">{product.title}</h3>
//         <p className="text-gray-700">{product.description}</p>
//         <p><strong>Price:</strong> ₹{product.price}</p>
//         <p><strong>Category:</strong> {product.category}</p>
//         <p><strong>Brand:</strong> {product.brand}</p>
//         <p><strong>Condition:</strong> {product.condition}</p>
//         <p><strong>Material:</strong> {product.material}</p>
//         <p><strong>Color:</strong> {product.color}</p>
//         <p><strong>Weight:</strong> {product.weight} kg</p>
//         <p><strong>Packaging:</strong> {product.packaging}</p>
//         <p><strong>Manual Included:</strong> {product.manual ? 'Yes' : 'No'}</p>
//         <p><strong>Reusability:</strong> {product.tags?.join(', ')}</p>
//       </div>

//       {/* Add to Cart Button */}
//       <div className="fixed bottom-4 w-full flex justify-center px-4">
//         <button
//           onClick={() => addToCart(product._id)}
//           className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-2xl shadow-md transition"
//         >
//           Add to Cart
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProductPage;



// DUMMY TEST

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    // Mock product data
    setProduct({
      _id: 'mock123',
      title: 'Eco-Friendly Reusable Bottle',
      description: 'Made from recyclable materials, this bottle is perfect for sustainable living.',
      price: 249,
      category: 'Reusable Items',
      brand: 'EcoBrand',
      condition: 'Like New',
      material: 'Stainless Steel',
      color: 'Green',
      weight: 0.5,
      packaging: 'Recyclable Box',
      manual: true,
      tags: ['recyclable', 'reusable'],
      images: [
        require('../assets/product1.jpg'),
        require('../assets/product1b.jpg'),
      ]
    });

    // Mock cart count
    setCartCount(2);
  }, []);

  const addToCart = () => {
    setCartCount(prev => prev + 1); // Mock cart update
  };

  const handleImageNav = (direction) => {
    const total = product.images.length;
    setActiveImageIndex(direction === 'left'
      ? (activeImageIndex - 1 + total) % total
      : (activeImageIndex + 1) % total
    );
  };

  if (!product) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-between items-center px-4 py-4 bg-white shadow">
        <button onClick={() => navigate('/')} className="text-xl font-bold">EcoFinds</button>
        <div className="flex items-center space-x-4">
          <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
            <FaShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 rounded-full">{cartCount}</span>
            )}
          </div>
          <div className="cursor-pointer" onClick={() => navigate('/profile')}>
            <FaUserCircle size={24} />
          </div>
        </div>
      </div>

      <h2 className="text-2xl text-center mt-4 font-semibold">Product Page</h2>

      <div className="flex justify-center items-center mt-6 relative">
        <ChevronLeft
          className="absolute left-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600 hover:text-black"
          onClick={() => handleImageNav('left')}
        />
        <div
          className={`w-72 h-72 rounded-lg overflow-hidden ${zoom ? 'scale-110' : 'scale-100'} transition-transform duration-300`}
          onClick={() => setZoom(!zoom)}
        >
          <img
            src={product.images[activeImageIndex]}
            alt="product"
            className="w-full h-full object-cover"
          />
        </div>
        <ChevronRight
          className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600 hover:text-black"
          onClick={() => handleImageNav('right')}
        />
      </div>

      <div className="max-w-2xl mx-auto mt-8 px-4 space-y-3">
        <h3 className="text-xl font-semibold">{product.title}</h3>
        <p className="text-gray-700">{product.description}</p>
        <p><strong>Price:</strong> ₹{product.price}</p>
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Brand:</strong> {product.brand}</p>
        <p><strong>Condition:</strong> {product.condition}</p>
        <p><strong>Material:</strong> {product.material}</p>
        <p><strong>Color:</strong> {product.color}</p>
        <p><strong>Weight:</strong> {product.weight} kg</p>
        <p><strong>Packaging:</strong> {product.packaging}</p>
        <p><strong>Manual Included:</strong> {product.manual ? 'Yes' : 'No'}</p>
        <p><strong>Reusability:</strong> {product.tags?.join(', ')}</p>
      </div>

      <div className="fixed bottom-4 w-full flex justify-center px-4">
        <button
          onClick={addToCart}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-2xl shadow-md transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductPage;
