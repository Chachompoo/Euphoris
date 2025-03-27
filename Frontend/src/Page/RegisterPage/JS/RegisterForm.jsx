import React, { useState } from 'react';
import '../CSS/Register.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';


function RegisterForm() {
  const [firstname, setFirstname] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  

  const getPasswordStrength = () => {
    if (password.length > 8) return "Excellent";
    if (password.length > 5) return "Good";
    return "Weak";
  };

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('/api/users/register', {
        firstname,
        surname,
        email,
        password,
      });
      console.log('ลงทะเบียนสำเร็จ:', response.data);
      // Redirect to login page or show success message
      navigate('/login');
    } catch (error) {
      console.error('ลงทะเบียนล้มเหลว:', error);
      if (error.response) {
        console.error('เซิร์ฟเวอร์ตอบกลับ:', error.response.data);
        setErrorMessage(error.response.data.message || 'Registration failed');
      } else {
        setErrorMessage('An error occurred');
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="image-section">
          <img src="src/assets/images/LogoFull2.png" alt="Resgister" />
        </div>
        <div className="form-section">
          <h2>Register</h2>
          <p>Create your account. It's free and only takes a minute.</p>
          <form onSubmit={handleSubmit}> {/* เพิ่ม onSubmit */}
            <div className="form-row">
              <input
                type="text"
                placeholder="Firstname"
                value={firstname} // เพิ่ม value
                onChange={(e) => setFirstname(e.target.value)} // เพิ่ม onChange
                required
              />
              <input
                type="text"
                placeholder="Surname"
                value={surname} // เพิ่ม value
                onChange={(e) => setSurname(e.target.value)} // เพิ่ม onChange
                required
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email} // เพิ่ม value
              onChange={(e) => setEmail(e.target.value)} // เพิ่ม onChange
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password} // เพิ่ม value
              onChange={(e) => setPassword(e.target.value)} // เพิ่ม onChange
              required
            />
            <div className="strength-bar">
              <div className={`bar ${getPasswordStrength().toLowerCase()}`}></div>
            </div>
            <p className="password-strength">Password strength: <span>{getPasswordStrength()}</span></p>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword} // เพิ่ม value
              onChange={(e) => setConfirmPassword(e.target.value)} // เพิ่ม onChange
              required
            />
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <button type="submit">Register Now</button>
            <p className="login-link-text">
              Already have an account? <Link to="/login">Login</Link> {/* เปลี่ยนเป็น Link */}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;