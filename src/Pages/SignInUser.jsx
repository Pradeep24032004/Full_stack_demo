// App.js


import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignInUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    showPassword: false // Add state for password visibility
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTogglePasswordVisibility = () => {
    setFormData({
      ...formData,
      showPassword: !formData.showPassword
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/signin', formData);
      if (response.data.success) {
        // Redirect to dashboard or profile page upon successful sign-in
        console.log('Sign in successful');
        navigate('/postlist');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Internal server error');
    }
  };

  const handleResetPassword = async () => {
    navigate('/password-reset');
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} /><br/>
        <input 
          type={formData.showPassword ? "text" : "password"} 
          name="password" 
          placeholder="Password" 
          value={formData.password} 
          onChange={handleChange} 
        />
        <button type="button" onClick={handleTogglePasswordVisibility}>
          {formData.showPassword ? "Hide" : "Show"}
        </button><br/>
        <button type="submit">Sign In</button>
      </form>
      <button onClick={handleResetPassword}>Reset Password</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default SignInUser;
