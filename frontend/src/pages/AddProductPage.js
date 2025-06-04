// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';
// import '../styles/AddProductPage.css';

// const AddProductPage = ({ addProductToListing }) => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     title: '',
//     category: '',
//     description: '',
//     price: '',
//     quantity: '',
//     condition: '',
//     year: '',
//     brand: '',
//     model: '',
//     length: '',
//     width: '',
//     height: '',
//     weight: '',
//     material: '',
//     colour: '',
//     originalPackaging: false,
//     manualIncluded: false,
//     workingCondition: '',
//     image: 'https://via.placeholder.com/300x200',
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === 'checkbox' ? checked : value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     addProductToListing(formData);
//     navigate('/my-listing');
//   };

//   return (
//     <div className="add-product-page">
//       <header className="header">
//         <div className="logo">MyStore</div>
//         <div className="header-icons">
//           <div className="cart" onClick={() => navigate('/cart')}>
//             <FaShoppingCart />
//             <span className="badge">2</span>
//           </div>
//           <div className="profile" onClick={() => navigate('/dashboard')}>
//             <FaUserCircle />
//           </div>
//         </div>
//       </header>

//       <h1 className="title">Add a New Product</h1>

//       <form className="product-form" onSubmit={handleSubmit}>
//         <div className="image-section">
//           <img src={formData.image} alt="Placeholder" />
//         </div>

//         <div className="form-section">
//           <input name="title" placeholder="Product Title" value={formData.title} onChange={handleChange} required />
//           <input name="category" placeholder="Product Category" value={formData.category} onChange={handleChange} required />
//           <textarea name="description" placeholder="Product Description" value={formData.description} onChange={handleChange} required />
//           <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
//           <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required />
//           <input name="condition" placeholder="Condition" value={formData.condition} onChange={handleChange} required />
//           <input type="number" name="year" placeholder="Year of Manufacture" value={formData.year} onChange={handleChange} />
//           <input name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} />
//           <input name="model" placeholder="Model" value={formData.model} onChange={handleChange} />
//           <input name="length" placeholder="Length" value={formData.length} onChange={handleChange} />
//           <input name="width" placeholder="Width" value={formData.width} onChange={handleChange} />
//           <input name="height" placeholder="Height" value={formData.height} onChange={handleChange} />
//           <input name="weight" placeholder="Weight" value={formData.weight} onChange={handleChange} />
//           <input name="material" placeholder="Material" value={formData.material} onChange={handleChange} />
//           <input name="colour" placeholder="Colour" value={formData.colour} onChange={handleChange} />
//           <label>
//             <input type="checkbox" name="originalPackaging" checked={formData.originalPackaging} onChange={handleChange} />
//             Original Packaging
//           </label>
//           <label>
//             <input type="checkbox" name="manualIncluded" checked={formData.manualIncluded} onChange={handleChange} />
//             Manual/Instructions Included
//           </label>
//           <textarea name="workingCondition" placeholder="Working Condition Description" value={formData.workingCondition} onChange={handleChange} />
//         </div>

//         <button type="submit" className="submit-btn">Add Item</button>
//       </form>
//     </div>
//   );
// };

// export default AddProductPage;

// ---

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const AddProductPage = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const backendURL = process.env.REACT_APP_BACKEND_URL;

  const [productData, setProductData] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    quantity: '',
    condition: '',
    year: '',
    brand: '',
    model: '',
    dimensions: { length: '', width: '', height: '' },
    weight: '',
    material: '',
    color: '',
    originalPackaging: false,
    manualIncluded: false,
    conditionDescription: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('dimensions.')) {
      const dimensionKey = name.split('.')[1];
      setProductData((prev) => ({
        ...prev,
        dimensions: { ...prev.dimensions, [dimensionKey]: value },
      }));
    } else if (type === 'checkbox') {
      setProductData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setProductData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e) => {
    setProductData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      Object.entries(productData).forEach(([key, value]) => {
        if (key === 'dimensions') {
          Object.entries(value).forEach(([dimKey, dimVal]) =>
            formData.append(`dimensions[${dimKey}]`, dimVal)
          );
        } else {
          formData.append(key, value);
        }
      });

      const res = await axios.post(`${backendURL}/api/products`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (res.status === 201) {
        navigate('/listings');
      }
    } catch (err) {
      console.error('Add Product Failed:', err);
      alert('Error adding product. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-4 bg-white shadow">
        <div
          className="flex-1 text-center text-xl font-bold cursor-pointer"
          onClick={() => navigate('/landing')}
        >
          EcoFinds
        </div>
        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
            <FaShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <FaUserCircle size={24} className="cursor-pointer" onClick={() => navigate('/profile')} />
        </div>
      </div>

      {/* Title */}
      <div className="px-4 mt-6">
        <h2 className="text-2xl font-semibold">Add a New Product</h2>
      </div>

      {/* Form */}
      <div className="px-4 mt-4 space-y-4">
        {/* Image Upload */}
        <div className="flex flex-col items-center gap-2">
          <label className="text-sm font-medium">Product Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>

        {/* Product Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" placeholder="Product Title" onChange={handleChange} className="p-2 border rounded" />
          <input name="category" placeholder="Category" onChange={handleChange} className="p-2 border rounded" />
          <input name="price" type="number" placeholder="Price" onChange={handleChange} className="p-2 border rounded" />
          <input name="quantity" type="number" placeholder="Quantity" onChange={handleChange} className="p-2 border rounded" />
          <input name="condition" placeholder="Condition" onChange={handleChange} className="p-2 border rounded" />
          <input name="year" type="number" placeholder="Year of Manufacture" onChange={handleChange} className="p-2 border rounded" />
          <input name="brand" placeholder="Brand" onChange={handleChange} className="p-2 border rounded" />
          <input name="model" placeholder="Model" onChange={handleChange} className="p-2 border rounded" />
          <input name="material" placeholder="Material" onChange={handleChange} className="p-2 border rounded" />
          <input name="color" placeholder="Color" onChange={handleChange} className="p-2 border rounded" />
          <input name="weight" placeholder="Weight" onChange={handleChange} className="p-2 border rounded" />
        </div>

        {/* Dimensions */}
        <div className="grid grid-cols-3 gap-4">
          <input name="dimensions.length" placeholder="Length" onChange={handleChange} className="p-2 border rounded" />
          <input name="dimensions.width" placeholder="Width" onChange={handleChange} className="p-2 border rounded" />
          <input name="dimensions.height" placeholder="Height" onChange={handleChange} className="p-2 border rounded" />
        </div>

        {/* Description & Booleans */}
        <textarea
          name="description"
          placeholder="Product Description"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="conditionDescription"
          placeholder="Working Condition Description"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="originalPackaging" onChange={handleChange} />
            Original Packaging
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="manualIncluded" onChange={handleChange} />
            Manual/Instructions Included
          </label>
        </div>

        {/* Submit */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Add Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
