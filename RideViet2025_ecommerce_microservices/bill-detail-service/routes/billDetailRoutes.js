const express = require('express');
const router = express.Router();
const { getAllBillDetails,getBillDetailById,createBillDetail,updateBillDetail,deleteBillDetail } = require('../controllers/billDetailController');


router.get('/', getAllBillDetails);
router.get('/:id', getBillDetailById);
router.post('/create', createBillDetail);
router.put('/:id', updateBillDetail);
router.delete('/:id', deleteBillDetail);
module.exports = router;
