const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

router.get('/', videoController.getAllVideos);

router.get('/:id', videoController.getVideoById);

router.post('/create', videoController.createVideo);

router.put('/:id', videoController.updateVideo);

router.delete('/:id', videoController.deleteVideo);

module.exports = router;
