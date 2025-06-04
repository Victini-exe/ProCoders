// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles/LoginPage.css';

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);

//   const validate = () => {  
//     const newErrors = {};
//     if (!formData.email.trim()) newErrors.email = 'Email or Username is required';
//     if (!formData.password.trim()) newErrors.password = 'Password is required';
//     return newErrors;
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     setErrors(validationErrors);
//     if (Object.keys(validationErrors).length > 0) return;

//     setSubmitting(true);

//     try {
//       const response = await fetch('https://6b2b-49-36-214-232.ngrok-free.app/api/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       });
//       const data = await response.json();

//       if (response.ok) {
//         localStorage.setItem('token', data.token); // save JWT if applicable
//         navigate('/landing');
//       } else {
//         setErrors({ api: data.message || 'Login failed' });
//       }
//     } catch (err) {
//       setErrors({ api: 'Network error. Please try again.' });
//     }

//     setSubmitting(false);
//   };

//   return (
//     <div className="login-container">
//       <h2>Login</h2>
//       <img src="https://via.placeholder.com/100" alt="profile" className="placeholder-image" />
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="email"
//           placeholder="Email or Username"
//           value={formData.email}
//           onChange={handleChange}
//         />
//         {errors.email && <p className="error">{errors.email}</p>}

//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//         />
//         {errors.password && <p className="error">{errors.password}</p>}

//         <button type="submit" disabled={submitting}>Login</button>
//         {errors.api && <p className="error">{errors.api}</p>}
//       </form>
//     </div>
//   );
// };

// export default LoginPage;

// ---

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // <-- Step 1: Import useAuth

const LoginPage = () => {
  const [formData, setFormData] = useState({
    identifier: '', // Can be email or username
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const backendURL = process.env.REACT_APP_BACKEND_URL;

  const { login } = useAuth(); // <-- Step 2: Access login() from context

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { identifier, password } = formData;

    if (!identifier || !password) {
      return setError('Please enter both username/email and password.');
    }

    try {
      const res = await axios.post(`${backendURL}/api/login`, {
        identifier,
        password,
      });

      if (res.data.success) {
        setSuccess('Login successful. Redirecting...');

        // Save login state using context
        login(); // <-- Step 3: Update auth state

        // Optional: Store user in localStorage (optional if you want persistence)
        // localStorage.setItem('user', JSON.stringify(res.data.user));

        setTimeout(() => {
          navigate('/landing'); // Redirect on success
        }, 1000);
      } else {
        setError(res.data.message || 'Login failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error during login.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 rounded-full bg-gray-300" />
        </div>

        <h2 className="text-2xl font-semibold text-center mb-6">Login to EcoFinds</h2>

        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
        {success && <p className="text-green-500 mb-3 text-sm">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="identifier"
            placeholder="Email or Username"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={formData.identifier}
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
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

