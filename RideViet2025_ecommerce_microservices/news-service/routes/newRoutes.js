const express = require('express');
const router = express.Router();
const newcontroller =require('../controllers/newController');


router.get('/', newcontroller.getAllnews);
router.get('/:id/limit', newcontroller.getNewsById); 
router.get('/limit', newcontroller.getAlllimitnews);
router.get('/topnews', newcontroller.getTopNews);
router.post('/create', newcontroller.createNews);
router.put('/:id', newcontroller.updateNews);
router.delete('/:id', newcontroller.deleteNews);
module.exports = router;