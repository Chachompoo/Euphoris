const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const connection = require('./config/DB');
const nodemailer = require('nodemailer'); // เพิ่ม nodemailer
const jwt = require('jsonwebtoken'); // เพิ่ม jsonwebtoken
const bcrypt = require('bcrypt'); // เพิ่ม bcrypt
const User = require('./models/User'); // เพิ่ม User model

dotenv.config();

// Create express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connection();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

// Add this before your routes
const validateResetPassword = (req, res, next) => {
  const { token, password } = req.body;
  
  if (!token || !password) {
    console.log('Missing required fields:', { token: !!token, password: !!password });
    return res.status(400).json({ message: 'Token และรหัสผ่านต้องไม่ว่างเปล่า' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' });
  }
  
  next();
};


// API Endpoint: /api/users/forgot-password
app.post('/api/users/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้นี้ในระบบ' });
    }

    // สร้าง token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { // ใช้ JWT_SECRET จาก .env
      expiresIn: '1h', // token หมดอายุใน 1 ชั่วโมง
    });

    // เก็บ token ในเอกสารผู้ใช้ (คุณอาจต้องเพิ่มฟิลด์ token ใน User schema)
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 ชั่วโมง
    await user.save();

    // ส่งอีเมล
    const mailOptions = {
      from: process.env.USER,
      to: email,
      subject: 'รีเซ็ตรหัสผ่านของคุณ',
      html: `<p>คลิก <a href="${process.env.BASE_URL_FRONT}/reset-password?token=${token}">ที่นี่</a> เพื่อรีเซ็ตรหัสผ่านของคุณ</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'ระบบได้ส่งอีเมลสำหรับรีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดกับเซิร์ฟเวอร์' });
  }
});

// API Endpoint: /api/users/reset-password
// Remove or comment out the duplicate forgot-password endpoint
// and add the correct reset-password endpoint:

app.post('/api/users/reset-password', validateResetPassword, async (req, res) => {
  const { token, password } = req.body;

  console.log('Reset password request received:', {
    token,
    password
  });

  try {
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);
    } catch (err) {
      console.error('Token verification failed:', err);
      return res.status(400).json({ message: 'Token ไม่ถูกต้องหรือหมดอายุ' });
    }

    // Find user by ID and valid token
    const user = await User.findOne({
      _id: decoded.userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    console.log('Found user:', user);

    if (!user) {
      return res.status(400).json({ message: 'Token ไม่ถูกต้องหรือหมดอายุ' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    console.log('Password updated successfully');

    res.status(200).json({ message: 'รีเซ็ตรหัสผ่านสำเร็จ' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน' });
  }
});

// API Endpoint: /api/users/login
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้นี้ในระบบ' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
    }

    res.status(200).json({ message: 'เข้าสู่ระบบสำเร็จ' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดกับเซิร์ฟเวอร์' });
  }
});


// API Endpoint: /api/users/register
app.post('/api/users/register', async (req, res) => {
  const { firstname, surname, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'มีผู้ใช้นี้อยู่ในระบบแล้ว' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      firstname,
      surname,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'ลงทะเบียนสำเร็จ' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดกับเซิร์ฟเวอร์' });
  }
});


// Routes
app.use('/api/users', userRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
