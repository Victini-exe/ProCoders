import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import '../styles/AddProductPage.css';

const AddProductPage = ({ addProductToListing }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    quantity: '',
    condition: '',
    year: '',
    brand: '',
    model: '',
    length: '',
    width: '',
    height: '',
    weight: '',
    material: '',
    colour: '',
    originalPackaging: false,
    manualIncluded: false,
    workingCondition: '',
    image: 'https://via.placeholder.com/300x200',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addProductToListing(formData);
    navigate('/my-listing');
  };

  return (
    <div className="add-product-page">
      <header className="header">
        <div className="logo">MyStore</div>
        <div className="header-icons">
          <div className="cart" onClick={() => navigate('/cart')}>
            <FaShoppingCart />
            <span className="badge">2</span>
          </div>
          <div className="profile" onClick={() => navigate('/dashboard')}>
            <FaUserCircle />
          </div>
        </div>
      </header>

      <h1 className="title">Add a New Product</h1>

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="image-section">
          <img src={formData.image} alt="Placeholder" />
        </div>

        <div className="form-section">
          <input name="title" placeholder="Product Title" value={formData.title} onChange={handleChange} required />
          <input name="category" placeholder="Product Category" value={formData.category} onChange={handleChange} required />
          <textarea name="description" placeholder="Product Description" value={formData.description} onChange={handleChange} required />
          <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
          <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required />
          <input name="condition" placeholder="Condition" value={formData.condition} onChange={handleChange} required />
          <input type="number" name="year" placeholder="Year of Manufacture" value={formData.year} onChange={handleChange} />
          <input name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} />
          <input name="model" placeholder="Model" value={formData.model} onChange={handleChange} />
          <input name="length" placeholder="Length" value={formData.length} onChange={handleChange} />
          <input name="width" placeholder="Width" value={formData.width} onChange={handleChange} />
          <input name="height" placeholder="Height" value={formData.height} onChange={handleChange} />
          <input name="weight" placeholder="Weight" value={formData.weight} onChange={handleChange} />
          <input name="material" placeholder="Material" value={formData.material} onChange={handleChange} />
          <input name="colour" placeholder="Colour" value={formData.colour} onChange={handleChange} />
          <label>
            <input type="checkbox" name="originalPackaging" checked={formData.originalPackaging} onChange={handleChange} />
            Original Packaging
          </label>
          <label>
            <input type="checkbox" name="manualIncluded" checked={formData.manualIncluded} onChange={handleChange} />
            Manual/Instructions Included
          </label>
          <textarea name="workingCondition" placeholder="Working Condition Description" value={formData.workingCondition} onChange={handleChange} />
        </div>

        <button type="submit" className="submit-btn">Add Item</button>
      </form>
    </div>
  );
};

export default AddProductPage;
