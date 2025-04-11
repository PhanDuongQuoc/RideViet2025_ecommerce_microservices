const express = require('express');
const router = express.Router();
const authMiddleware = require('../../auth-service/middleware/authMiddleware');
const { getAllBills,createBill,getBillsByUserId,getBill,create_bill,updateBill,deleteBill } = require('../controllers/billController');
router.get('/', getAllBills);


router.post('/',authMiddleware,createBill);
router.get('/my-orders', authMiddleware, getBillsByUserId);

router.get('/getbill/:billId', getBill);
router.post('/create', create_bill);

router.put('/update/:billId', updateBill);

router.delete('/delete/:billId', deleteBill);
module.exports = router;
