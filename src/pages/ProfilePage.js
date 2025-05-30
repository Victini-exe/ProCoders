
// import React, { useContext, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AppContext } from '../context/AppContext';
// import '../styles/UserProfilePage.css';

// function UserDashboard() {
//   const navigate = useNavigate();
//   const { cartItems, userDetails, setUserDetails } = useContext(AppContext);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedDetails, setEditedDetails] = useState(userDetails);

//   const handleSave = () => {
//     setUserDetails(editedDetails);
//     setIsEditing(false);
//   };

//   return (
//     <div className="container">
//       {/* Header */}
//       <div className="header">
//         <div className="header-icons">
//           <div className="icon-wrapper" onClick={() => navigate('/cart')}>
//             <img src="/assets/cart-icon.png" alt="Cart" />
//             {cartItems.length > 0 && <span className="badge">{cartItems.length}</span>}
//           </div>
//           <div className="icon-wrapper" onClick={() => navigate('/dashboard')}>
//             <img src="/assets/user-icon.png" alt="Profile" />
//           </div>
//         </div>
//         <div className="logo">YourLogo</div>
//       </div>

//       {/* Profile Section */}
//       <div className="profile-section">
//         <img className="profile-picture" src="/assets/profile-placeholder.png" alt="Profile" />
//         <div className="profile-details">
//           {isEditing ? (
//             <>
//               <input
//                 value={editedDetails.name}
//                 onChange={e => setEditedDetails({ ...editedDetails, name: e.target.value })}
//               />
//               <input
//                 value={editedDetails.email}
//                 onChange={e => setEditedDetails({ ...editedDetails, email: e.target.value })}
//               />
//               <button onClick={handleSave}>Save</button>
//             </>
//           ) : (
//             <>
//               <h3>{userDetails.name}</h3>
//               <p>{userDetails.email}</p>
//               <button onClick={() => setIsEditing(true)}>Edit</button>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Navigation Section */}
//       <div className="dashboard-nav">
//         <button onClick={() => navigate('/mylistings')}>My Listings</button>
//         <button onClick={() => navigate('/purchases')}>My Purchases</button>
//       </div>
//     </div>
//   );
// }

// export default UserDashboard;

// ---

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart, FaEdit, FaSave, FaUpload, FaSignOutAlt } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // ✅ import auth
import axios from 'axios';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { logout } = useAuth(); // ✅ use logout function

  const backendURL = process.env.REACT_APP_BACKEND_URL;

  const [user, setUser] = useState({
    name: '',
    email: '',
    bio: '',
    profilePic: '/placeholder.png',
  });

  const [editedUser, setEditedUser] = useState({ ...user });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backendURL}/api/user/profile`);
        if (res.data) {
          setUser(res.data);
          setEditedUser(res.data);
          setUploadPreview(res.data.profilePic || '/placeholder.png');
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [backendURL]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setUploadPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', editedUser.name);
      formData.append('email', editedUser.email);
      formData.append('bio', editedUser.bio);
      if (uploadFile) {
        formData.append('profilePic', uploadFile);
      }

      const res = await axios.post(`${backendURL}/api/user/profile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setUser(res.data.user);
        setEditedUser(res.data.user);
        setIsEditing(false);
        setUploadFile(null);
        setUploadPreview(res.data.user.profilePic || '/placeholder.png');
      } else {
        setError(res.data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();             // Clear auth state + localStorage
    navigate('/login');   // Redirect to login page
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;

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
          <FaSignOutAlt
            size={22}
            className="cursor-pointer text-red-600 hover:text-red-700"
            onClick={handleLogout}
            title="Logout"
          />
        </div>
      </div>

      {/* Profile Section */}
      <div className="max-w-3xl mx-auto px-4 mt-8">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={uploadPreview || user.profilePic || '/placeholder.png'}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
            />
            {isEditing && (
              <label
                htmlFor="profilePicInput"
                className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700"
                title="Upload new profile picture"
              >
                <FaUpload />
                <input
                  id="profilePicInput"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {error && <p className="mt-3 text-red-600">{error}</p>}

          {isEditing ? (
            <>
              <input
                className="mt-4 p-2 border rounded w-full max-w-sm text-center"
                value={editedUser.name}
                onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
              />
              <input
                className="mt-2 p-2 border rounded w-full max-w-sm text-center"
                value={editedUser.email}
                onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
              />
              <textarea
                className="mt-2 p-2 border rounded w-full max-w-sm text-center"
                value={editedUser.bio}
                onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                rows={3}
              />
              <button
                onClick={handleSave}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded flex items-center gap-2 disabled:opacity-50"
                disabled={loading}
              >
                <FaSave />
                Save
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mt-4">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500 italic">{user.bio}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2"
              >
                <FaEdit />
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>

      {/* Navigation Section */}
      <div className="max-w-3xl mx-auto px-4 mt-10 space-y-4">
        <button
          onClick={() => navigate('/listings')}
          className="w-full bg-white border shadow px-4 py-3 text-left rounded-lg hover:bg-gray-50"
        >
          My Listings
        </button>
        <button
          onClick={() => navigate('/purchases')}
          className="w-full bg-white border shadow px-4 py-3 text-left rounded-lg hover:bg-gray-50"
        >
          My Purchases
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;

