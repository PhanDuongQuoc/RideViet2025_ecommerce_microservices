const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Role = require('../../role-service/models/Role');

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const skip = (page - 1) * limit;
    const query = search ? { $text: { $search: search } } : {};  

    const users = await User.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('role_id');

    const totalUsers = await User.countDocuments(query);

    res.json({
      data: users,
      total: totalUsers,
      pages: Math.ceil(totalUsers / limit), 
      currentPage: page,
      limit: limit
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.createUser = async (req, res) => {
  try {
    const { email, password, roleId, full_name, phone_number, date_of_birth, gender, address } = req.body;

    console.log("Received roleId: ", roleId);  

    // Tìm role từ database
    const role = await Role.findById(roleId);
    console.log("Role found: ", role);  

    if (!role) {
      return res.status(400).json({ message: 'Role not found' });
    }

    // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
    const salt = await bcrypt.genSalt(10);  // Tạo salt
    const hashedPassword = await bcrypt.hash(password, salt);  // Mã hóa mật khẩu

    const newUser = new User({
      email,
      password: hashedPassword,  // Lưu mật khẩu đã mã hóa
      role_id: role._id,
      full_name,
      phone_number,
      date_of_birth,
      gender,
      address
    });

    await newUser.save();
    res.status(201).json(newUser);

  } catch (err) {
    console.log("Error: ", err);  
    res.status(500).json({ error: err.message });
  }
};


exports.updateUser = async (req, res) => {
  const { userId } = req.params;  
  const { email, password, roleId, full_name, phone_number, date_of_birth, gender, address } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Nếu roleId được cung cấp, cập nhật role
    if (roleId) {
      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(400).json({ message: 'Role not found' });
      }
      user.role_id = role._id;  
    }

    // Cập nhật các trường khác
    user.email = email || user.email;
    user.full_name = full_name || user.full_name;
    user.phone_number = phone_number || user.phone_number;
    user.date_of_birth = date_of_birth || user.date_of_birth;
    user.gender = gender || user.gender;
    user.address = address || user.address;

    // Nếu mật khẩu mới được cung cấp, mã hóa và cập nhật
    if (password) {
      const salt = await bcrypt.genSalt(10);  // Tạo salt
      user.password = await bcrypt.hash(password, salt);  // Mã hóa mật khẩu
    }

    await user.save();

    res.json(user);  
  } catch (err) {
    console.log("Error: ", err);  // Log lỗi chi tiết
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { search } = req.query;

    // Tìm kiếm người dùng theo tên
    const query = search ? { full_name: { $regex: search, $options: 'i' } } : {};

    // Tìm tất cả người dùng thoả mãn điều kiện tìm kiếm
    const users = await User.find(query).populate('role_id');
    
    res.json({
      data: users,
      total: users.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
