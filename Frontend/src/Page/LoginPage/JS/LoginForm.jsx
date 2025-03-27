import React, { useState } from 'react';
import '../CSS/Login.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    try {
      const response = await axios.post('/api/users/login', { email, password });
      console.log('Login successful:', response.data);
      // Redirect to the home page or dashboard
      navigate('/home');
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response) {
        setErrorMessage(error.response.data.message || 'เข้าสู่ระบบล้มเหลว');
      } else {
        setErrorMessage('เกิดข้อผิดพลาด');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="form-section">  {/* ฟอร์มย้ายมาด้านซ้าย */}
          <h2>Login</h2>
          <p>Please sign in to continue.</p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <button type="submit">Login Now</button>
            <div className="register-link">
                Don't have an account? <a href="/register">Register Now</a>
            </div>
            <p>
              <Link to="/forgot-password">Forgot Password?</Link> 
            </p>
          </form>
        </div>
        <div className="image-section"> {/* รูปภาพย้ายไปขวา */}
          <img src="src/assets/images/LogoFull3.png" alt="Login" />
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
