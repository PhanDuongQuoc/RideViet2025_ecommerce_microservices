const typeproduct = require('../models/Typeproduct');
const Product = require('../../product-service/models/Product');



// Lấy danh sách sản phẩm
exports.getAllTypeproducts = async (req, res) => {
    try {
        const typeproducts = await typeproduct.find();
        res.json(typeproducts);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách sản phẩm' });
    }
};

exports.getAllTypeproductlimit = async (req, res) => {
    try {
        const typeproducts = await typeproduct.find().limit(4);
        res.json(typeproducts);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách sản phẩm' });
    }
};



exports.getProductsByType = async (req, res) => {
    try {
        const typeId = req.params.typeId; 
        const products = await Product.find({ category: typeId }).populate("category");
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy sản phẩm theo loại", error });
    }
};


exports.getTypeproductById = async (req, res) => {
    try {
        const typeId = req.params.typeId;
        const type = await typeproduct.findById(typeId);
        
        if (!type) {
            return res.status(404).json({ error: 'Loại sản phẩm không tồn tại' });
        }

        res.json(type);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy loại sản phẩm theo ID' });
    }
};


exports.createTypeproduct = async (req, res) => {
    try {
        const { name, image } = req.body;
        const newTypeproduct = new typeproduct({ name, image });
        await newTypeproduct.save();
        res.status(201).json(newTypeproduct);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi tạo loại sản phẩm' });
    }
};

exports.updateTypeproduct = async (req, res) => {
    try {
        const typeId = req.params.typeId;
        const { name, image } = req.body;
        const updatedTypeproduct = await typeproduct.findByIdAndUpdate(typeId, { name, image }, { new: true });
        if (!updatedTypeproduct) {
            return res.status(404).json({ error: 'Loại sản phẩm không tồn tại' });
        }
        res.json(updatedTypeproduct);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi cập nhật loại sản phẩm' });
    }
};

exports.deleteTypeproduct = async (req, res) => {
    try {
        const typeId = req.params.typeId;
        const deletedTypeproduct = await typeproduct.findByIdAndDelete(typeId);
        if (!deletedTypeproduct) {
            return res.status(404).json({ error: 'Loại sản phẩm không tồn tại' });
        }
        res.json({ message: 'Loại sản phẩm đã được xóa thành công' });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi xóa loại sản phẩm' });
    }
};