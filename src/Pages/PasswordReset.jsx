// PasswordReset.js
// PasswordReset.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function PasswordReset() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const handleSignInClick = () => {
    navigate("/signin");
  }
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/reset-password', { email, newPassword });
      if (response.data.success) {
        setMessage(response.data.message);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Internal server error');
    }
  };

  return (
    <div>
      <h2>Password Reset</h2>
      <form onSubmit={handleResetPassword}>
        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
        <input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /><br />
        <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /><br />
        <button type="submit">Reset Password</button>
        <button type = "submit" onClick={handleSignInClick}>Sign In</button>
      </form>
      {message && <div style={{ color: 'green' }}>{message}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default PasswordReset;
