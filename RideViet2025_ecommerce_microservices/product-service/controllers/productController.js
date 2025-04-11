
const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category'); 
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách sản phẩm' });
    }
};

exports.searchProducts = async (req, res) => {
    const keyword = req.query.q;
    if (!keyword) {
      return res.status(400).json({ message: 'Thiếu từ khóa tìm kiếm' });
    }
  
    try {
      const regex = new RegExp(keyword, 'i'); 
      const products = await Product.find({ name: regex }).populate('category');
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: 'Lỗi khi tìm kiếm sản phẩm', message: err.message });
    }
  };
  

exports.getLimitProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category').limit(2); 
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách sản phẩm' });
    }
};

exports.getDetailProduct = async (req, res) => {
    try {
        const id = req.params.id; 
        const product = await Product.findById(id).populate('category'); 

        if (!product) {
            return res.status(404).json({ error: "Không tìm thấy sản phẩm!" });
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: "Lỗi khi lấy chi tiết sản phẩm", details: err.message });
    }
};




exports.createProduct = async (req, res) => {
    const { name, price, description, image, category } = req.body;

    try {
        const newProduct = new Product({
            name,
            price,
            description,
            image,
            category
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ error: "Lỗi khi thêm sản phẩm", details: err.message });
    }
};

exports.updateProduct = async (req, res) => {
    const id = req.params.id;
    const { name, price, description, image, category } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, price, description, image, category },
            { new: true } // Trả về sản phẩm đã được cập nhật
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: "Sản phẩm không tồn tại!" });
        }

        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: "Lỗi khi sửa sản phẩm", details: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    const id = req.params.id;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ error: "Sản phẩm không tồn tại!" });
        }

        res.json({ message: "Sản phẩm đã bị xóa thành công!" });
    } catch (err) {
        res.status(500).json({ error: "Lỗi khi xóa sản phẩm", details: err.message });
    }
};