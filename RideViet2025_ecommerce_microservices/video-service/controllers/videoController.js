const Video =require('../models/Video')


exports.getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find();
        res.json(videos);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách video' });
    }
};


// Get a video by ID
exports.getVideoById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ error: 'Video không tìm thấy' });
        }
        res.json(video);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy video' });
    }
};

exports.createVideo = async (req, res) => {
    try {
        const { title, url, description } = req.body;
        const newVideo = new Video({ title, url, description });
        await newVideo.save();
        res.status(201).json(newVideo);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi tạo video' });
    }
};

exports.updateVideo = async (req, res) => {
    try {
        const { title, url, description } = req.body;
        const updatedVideo = await Video.findByIdAndUpdate(
            req.params.id,
            { title, url, description },
            { new: true }
        );
        if (!updatedVideo) {
            return res.status(404).json({ error: 'Video không tìm thấy để cập nhật' });
        }
        res.json(updatedVideo);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi cập nhật video' });
    }
};

exports.deleteVideo = async (req, res) => {
    try {
        const deletedVideo = await Video.findByIdAndDelete(req.params.id);
        if (!deletedVideo) {
            return res.status(404).json({ error: 'Video không tìm thấy để xóa' });
        }
        res.json({ message: 'Video đã được xóa thành công' });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi xóa video' });
    }
};