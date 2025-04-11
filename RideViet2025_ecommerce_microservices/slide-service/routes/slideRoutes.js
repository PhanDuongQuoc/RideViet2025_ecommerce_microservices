const express = require('express');
const router = express.Router();
const slideController = require('../controllers/slideController');

router.get('/', slideController.getAllSlides);
router.post('/', slideController.createSlide);
router.put('/:id', slideController.updateSlide);
router.delete('/:id', slideController.deleteSlide);

module.exports = router;
