const Customer = require('../models/Customer');

exports.createCustomer = async (req, res) => {
    const { name, phone, address } = req.body;

    if (!name || !phone || !address) {
        return res.status(400).json({ message: 'Thông tin khách hàng không đầy đủ!' });
    }

    try {
        const newCustomer = new Customer({
            name,
            phone,
            address
        });

        await newCustomer.save();
        res.status(201).json(newCustomer);
    } catch (error) {
        console.error('Lỗi khi tạo khách hàng:', error);
        res.status(500).json({ message: 'Lỗi khi tạo khách hàng', error: error.message });
    }
};

exports.getAllCustomers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const searchQuery = req.query.search || '';

        const filter = {
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } },
                { phone: { $regex: searchQuery, $options: 'i' } },
                { address: { $regex: searchQuery, $options: 'i' } }
            ]
        };

        const customers = await Customer.find(filter).skip(skip).limit(limit);
        const total = await Customer.countDocuments(filter);

        res.status(200).json({
            data: customers,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách khách hàng', error: error.message });
    }
};
exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thông tin khách hàng', error: error.message });
    }
};

exports.updateCustomer = async (req, res) => {
    const { name, phone, address } = req.body;

    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            { name, phone, address },
            { new: true, runValidators: true }
        );

        if (!updatedCustomer) return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
        res.status(200).json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật khách hàng', error: error.message });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
        if (!deletedCustomer) return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
        res.status(200).json({ message: 'Xóa khách hàng thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa khách hàng', error: error.message });
    }
};