// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles/SignupPage.css';

// const SignupPage = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     displayName: '',
//     userName: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });

//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);

//   const validate = () => {
//     const newErrors = {};
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!formData.displayName.trim()) newErrors.displayName = 'Display name is required';
//     if (!formData.userName.trim()) newErrors.userName = 'Username is required';
//     if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';
//     if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
//     if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     setErrors(validationErrors);
//     if (Object.keys(validationErrors).length > 0) return;

//     setSubmitting(true);

//     try {
//       const response = await fetch('https://6b2b-49-36-214-232.ngrok-free.app/api/signup', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });
//       const data = await response.json();

//       if (response.ok) {
//         alert('Signup successful');
//         navigate('/login');
//       } else {
//         // Handle all possible error response formats
//         if (typeof data === 'string') {
//           setErrors({ api: data });
//         } else if (data.message) {
//           setErrors({ api: data.message });
//         } else if (data.username) {
//           setErrors({ userName: typeof data.username === 'string' ? data.username : JSON.stringify(data.username) });
//         } else {
//           // Safely stringify the entire error object if format is unexpected
//           setErrors({ api: JSON.stringify(data) });
//         }
//       }
//     } catch (error) {
//       setErrors({ api: 'Network error. Please try again.' });
//     }

//     setSubmitting(false);
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     // Clear error when user starts typing
//     if (errors[e.target.name]) {
//       setErrors({ ...errors, [e.target.name]: '' });
//     }
//     if (errors.api) {
//       setErrors({ ...errors, api: '' });
//     }
//   };

//   // Helper function to safely render error messages
//   const renderError = (error) => {
//     if (!error) return null;
//     if (typeof error === 'string') return error;
//     return JSON.stringify(error);
//   };

//   return (
//     <div className="signup-container">
//       <h2>Sign Up</h2>
//       <img src="https://via.placeholder.com/100" alt="profile" className="placeholder-image" />
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="displayName"
//           placeholder="Display Name"
//           value={formData.displayName}
//           onChange={handleChange}
//         />
//         {errors.displayName && <p className="error">{renderError(errors.displayName)}</p>}

//         <input
//           type="text"
//           name="userName"
//           placeholder="Username"
//           value={formData.userName}
//           onChange={handleChange}
//         />
//         {errors.userName && <p className="error">{renderError(errors.userName)}</p>}

//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//         />
//         {errors.email && <p className="error">{renderError(errors.email)}</p>}

//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//         />
//         {errors.password && <p className="error">{renderError(errors.password)}</p>}

//         <input
//           type="password"
//           name="confirmPassword"
//           placeholder="Confirm Password"
//           value={formData.confirmPassword}
//           onChange={handleChange}
//         />
//         {errors.confirmPassword && <p className="error">{renderError(errors.confirmPassword)}</p>}

//         <button type="submit" disabled={submitting}>
//           {submitting ? 'Signing Up...' : 'Sign Up'}
//         </button>
//         {errors.api && <p className="error">{renderError(errors.api)}</p>}
//       </form>
//     </div>
//   );
// };

// export default SignupPage;

// ---

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- 1. Import useNavigate
import axios from 'axios';

const SignUp = () => {
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate(); // <-- 2. Initialize
  const backendURL = process.env.REACT_APP_BACKEND_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) => password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { displayName, username, email, password, confirmPassword } = formData;

    if (!displayName || !username || !email || !password || !confirmPassword) {
      return setError('Please fill in all fields.');
    }
    if (!validateEmail(email)) {
      return setError('Invalid email format.');
    }
    if (!validatePassword(password)) {
      return setError('Password must be at least 6 characters long.');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    try {
      const res = await axios.post(`${backendURL}/api/signup`, {
        displayName,
        username,
        email,
        password,
      });

      if (res.data.success) {
        setSuccess('Account created successfully. Redirecting...');
        setTimeout(() => {
          navigate('/login'); // <-- 3. Redirect using useNavigate
        }, 2000);
      } else {
        setError(res.data.message || 'Signup failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error during signup.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 rounded-full bg-gray-300" />
        </div>

        <h2 className="text-2xl font-semibold text-center mb-6">Create an Account</h2>

        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
        {success && <p className="text-green-500 mb-3 text-sm">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="displayName"
            placeholder="Display Name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={formData.displayName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email ID"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
