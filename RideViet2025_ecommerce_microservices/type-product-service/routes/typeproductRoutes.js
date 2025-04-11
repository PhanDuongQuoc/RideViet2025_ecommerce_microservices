const express = require('express');
const router = express.Router();
const typeproductcontroller =require('../controllers/typeproductController');


router.get('/', typeproductcontroller.getAllTypeproducts);
router.get('/limit', typeproductcontroller.getAllTypeproductlimit);
router.get('/:typeId/products', typeproductcontroller.getProductsByType);
router.get('/:typeId', typeproductcontroller.getTypeproductById);
router.post('/', typeproductcontroller.createTypeproduct);

router.put('/:typeId', typeproductcontroller.updateTypeproduct);

router.delete('/:typeId', typeproductcontroller.deleteTypeproduct);
module.exports = router;
