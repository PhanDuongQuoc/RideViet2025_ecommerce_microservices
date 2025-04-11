const news = require('../models/New');




exports.getAllnews = async (req, res) => {
    try {
        const newlist = await news.find().sort({_id:-1});
        res.json(newlist);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách sản phẩm' });
    }
};

exports.getNewsById = async (req, res) => {
    try {
        const singleNews = await news.findById(req.params.id);
        if (!singleNews) {
            return res.status(404).json({ error: 'Không tìm thấy tin tức' });
        }
        res.json(singleNews);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy tin tức theo ID' });
    }
};

exports.getAlllimitnews = async (req, res) => {
    try {
        const newlist = await news.find().limit(4);
        res.json(newlist);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách sản phẩm' });
    }
};

exports.getTopNews = async (req, res) => {
    try {
        const topnew = await news.find().sort({ _id: -1 }).limit(6);  // Lấy 6 tin tức mới nhất
        console.log("Danh sách tin tức:", topnew);
        res.json(topnew);  // Trả về danh sách tin tức
    } catch (err) {
        console.error("Lỗi khi lấy danh sách tin tức:", err);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách tin tức' });  // Trả về lỗi khi có vấn đề
    }
};


 // Thêm tin tức
exports.createNews = async (req, res) => {
    try {
        const { name, image, content, author, category, tags, views } = req.body;
        const newNews = new news({
            name,
            image,
            content,
            author,
            category,
            tags,
            views
        });

        await newNews.save();
        res.status(201).json(newNews);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi thêm tin tức' });
    }
};

exports.updateNews = async (req, res) => {
    try {
        const { name, image, content, author, category, tags, views } = req.body;

        const updatedNews = await news.findByIdAndUpdate(
            req.params.id,
            {
                name,
                image,
                content,
                author,
                category,
                tags,
                views,
                updatedAt: Date.now()
            },
            { new: true }
        );

        if (!updatedNews) {
            return res.status(404).json({ error: 'Không tìm thấy tin tức' });
        }

        res.json(updatedNews);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi cập nhật tin tức' });
    }
};

// Xóa tin tức
exports.deleteNews = async (req, res) => {
    try {
        const deletedNews = await news.findByIdAndDelete(req.params.id);
        if (!deletedNews) {
            return res.status(404).json({ error: 'Không tìm thấy tin tức' });
        }
        res.json({ message: 'Xóa tin tức thành công' });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi xóa tin tức' });
    }
};