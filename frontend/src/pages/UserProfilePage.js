// src/pages/UserDashboard.jsx
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import '../styles/UserProfilePage.css';

function UserDashboard() {
  const navigate = useNavigate();
  const { cartItems, userDetails, setUserDetails } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState(userDetails);

  const handleSave = () => {
    setUserDetails(editedDetails);
    setIsEditing(false);
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="header-icons">
          <div className="icon-wrapper" onClick={() => navigate('/cart')}>
            <img src="/assets/cart-icon.png" alt="Cart" />
            {cartItems.length > 0 && <span className="badge">{cartItems.length}</span>}
          </div>
          <div className="icon-wrapper" onClick={() => navigate('/dashboard')}>
            <img src="/assets/user-icon.png" alt="Profile" />
          </div>
        </div>
        <div className="logo">YourLogo</div>
      </div>

      {/* Profile Section */}
      <div className="profile-section">
        <img className="profile-picture" src="/assets/profile-placeholder.png" alt="Profile" />
        <div className="profile-details">
          {isEditing ? (
            <>
              <input
                value={editedDetails.name}
                onChange={e => setEditedDetails({ ...editedDetails, name: e.target.value })}
              />
              <input
                value={editedDetails.email}
                onChange={e => setEditedDetails({ ...editedDetails, email: e.target.value })}
              />
              <button onClick={handleSave}>Save</button>
            </>
          ) : (
            <>
              <h3>{userDetails.name}</h3>
              <p>{userDetails.email}</p>
              <button onClick={() => setIsEditing(true)}>Edit</button>
            </>
          )}
        </div>
      </div>

      {/* Navigation Section */}
      <div className="dashboard-nav">
        <button onClick={() => navigate('/mylistings')}>My Listings</button>
        <button onClick={() => navigate('/purchases')}>My Purchases</button>
      </div>
    </div>
  );
}

export default UserDashboard;