const Slide = require('../models/Slide');


// Lấy danh sách sản phẩm
exports.getAllSlides = async (req, res) => {
    try {
        const slide = await Slide.find();
        res.json(slide);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách slide' });
    }
};

exports.createSlide = async (req, res) => {
    try {
        const { title, image } = req.body;
        const newSlide = new Slide({ title, image });
        await newSlide.save();
        res.status(201).json(newSlide);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi tạo slide' });
    }
};

exports.updateSlide = async (req, res) => {
    try {
        const { title, image } = req.body;
        const updatedSlide = await Slide.findByIdAndUpdate(
            req.params.id,
            { title, image },
            { new: true }
        );
        if (!updatedSlide) return res.status(404).json({ error: 'Không tìm thấy slide' });
        res.json(updatedSlide);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi cập nhật slide' });
    }
};


exports.deleteSlide = async (req, res) => {
    try {
        const deletedSlide = await Slide.findByIdAndDelete(req.params.id);
        if (!deletedSlide) return res.status(404).json({ error: 'Không tìm thấy slide' });
        res.json({ message: 'Xóa slide thành công' });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi xóa slide' });
    }
};