const User = require('../models/User');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  try {
    const { firstname, surname, email, password } = req.body;

    // เช็กว่ามีอีเมลนี้ในระบบแล้วหรือยัง
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'อีเมลนี้ถูกใช้แล้ว' });
    }

    // แฮชรหัสผ่านก่อนบันทึก (ถ้าไม่ได้ใช้ middleware)
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้างผู้ใช้ใหม่
    const newUser = new User({
      firstname,
      surname,
      email,
      password: hashedPassword, // แฮชรหัสผ่านก่อนบันทึก
    });

    // บันทึกลงฐานข้อมูล
    const savedUser = await newUser.save();

    if (savedUser) {
      res.status(201).json({
        message: 'ลงทะเบียนสำเร็จ',
        user: {
          id: savedUser._id,
          firstname: savedUser.firstname,
          surname: savedUser.surname,
          email: savedUser.email,
        },
      });
    } else {
      res.status(400).json({ message: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register };
