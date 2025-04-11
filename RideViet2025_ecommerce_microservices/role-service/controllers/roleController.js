// role-service/controllers/roleController.js
const Role = require('../models/Role');

exports.createRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    const role = new Role({ name, description });
    await role.save();
    res.status(201).json({ message: 'Role created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;  // Lấy id từ URL
    const { name, description } = req.body;

    const role = await Role.findByIdAndUpdate(id, { name, description }, { new: true });
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.json({ message: 'Role updated successfully', role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByIdAndDelete(id);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.json({ message: 'Role deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
