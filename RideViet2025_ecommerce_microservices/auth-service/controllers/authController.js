const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../user-service/models/User');
const Role = require('../../role-service/models/Role');

exports.register = async (req, res) => {
  const { email, password, full_name, phone_number, date_of_birth, gender, address, roleId } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
  
    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(400).json({ message: 'Role not found' });
    }

    // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
    const salt = await bcrypt.genSalt(10);  // Tạo salt
    const hashedPassword = await bcrypt.hash(password, salt);  // Mã hóa mật khẩu

    const newUser = new User({
      email,
      password: hashedPassword,  // Sử dụng mật khẩu đã mã hóa
      full_name,
      phone_number,
      date_of_birth,
      gender,
      address,
      role_id: role._id
    });
  
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).populate('role_id');
    console.log("Stored password hash: ", user.password);  // In mật khẩu đã mã hóa trong DB

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // So sánh mật khẩu người dùng nhập vào với mật khẩu đã mã hóa trong DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role_id.name }, 'your_jwt_secret', { expiresIn: '1h' });

    res.json({
      message: 'Login successful',
      userId: user._id,
      token,
      role: user.role_id.name,
      username: user.full_name,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
