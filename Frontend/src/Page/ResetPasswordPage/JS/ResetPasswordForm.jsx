import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../CSS/ResetPassword.css';

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams(); // ใช้ useSearchParams
  const navigate = useNavigate();
  const token = searchParams.get('token'); // ดึง token จาก URL

  const getPasswordStrength = () => {
    if (password.length > 8) return "Excellent";
    if (password.length > 5) return "Good";
    return "Weak";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    console.log('Sending reset password request with:', {
      token,
      password
    });
    
    if (password !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }

    try {
      const response = await axios.post('/api/users/reset-password', { token, password });
      setMessage(response.data.message);
      // Redirect to login page after successful password reset
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="image-section-reset">
          <img src="src/assets/images/ResetPass.png" alt="Reset" />
        </div>
        <h2>Reset password</h2>
        <p>Please kindly set your new password.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>New password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="password-input"
                required
              />
              <button onClick={() => setShowPassword(!showPassword)} className="eye-button">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="strength-bar">
              <div className={`bar ${getPasswordStrength().toLowerCase()}`}></div>
            </div>
            <p className="password-strength">Password strength: <span>{getPasswordStrength()}</span></p>
          </div>

          <div className="input-group">
            <label>Re-enter password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="password-input"
                required
              />
              <button onClick={() => setShowPassword(!showPassword)} className="eye-button">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {message && <p style={{ color: 'green' }}>{message}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button type="submit" className="button">รีเซ็ตรหัสผ่าน</button>
        </form>

        <a href="/login" className="back-to-login">
          <span className="arrow-left"></span> Back to Login
        </a>
      </div>
    </div>
  );
};

export default ResetPasswordForm;