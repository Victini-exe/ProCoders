import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.emailOrUsername.trim()) newErrors.emailOrUsername = 'Email or Username is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token); // save JWT if applicable
        navigate('/dashboard');
      } else {
        setErrors({ api: data.message || 'Login failed' });
      }
    } catch (err) {
      setErrors({ api: 'Network error. Please try again.' });
    }

    setSubmitting(false);
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <img src="https://via.placeholder.com/100" alt="profile" className="placeholder-image" />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="emailOrUsername"
          placeholder="Email or Username"
          value={formData.emailOrUsername}
          onChange={handleChange}
        />
        {errors.emailOrUsername && <p className="error">{errors.emailOrUsername}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <button type="submit" disabled={submitting}>Login</button>
        {errors.api && <p className="error">{errors.api}</p>}
      </form>
    </div>
  );
};

export default LoginPage;