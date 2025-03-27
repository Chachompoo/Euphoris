import React, { useState } from 'react';
import '../CSS/ForgotPassword.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('/api/users/forgot-password', { email });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };


  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="logo">
          {/* ใส่โลโก้ของคุณที่นี่ */}
          <img src="src/assets/images/ForgotPass_Logo.png" alt="Logo" />
        </div>
        <div className="forgot-password-content">
          <h1>Forgot your password?</h1>
          <p>Enter your email so that we can send you password reset link</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                placeholder="e.g. username@kinety.com" 
                value={email} // เพิ่ม value
                onChange={(e) => setEmail(e.target.value)} // เพิ่ม onChange
                required // เพิ่ม required
              />
            </div>
            {message && <p style={{ color: 'green' }}>{message}</p>} {/* เพิ่มการแสดง message */}
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* เพิ่มการแสดง error */}
            <button type="submit" className="send-email-button">Send Email</button>
          </form>
          <Link to="/login" className="back-to-login"> {/* แก้ไข a tag */}
            <span className="arrow-left"></span> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;