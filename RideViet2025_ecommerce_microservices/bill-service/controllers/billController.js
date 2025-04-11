const Bill = require('../models/Bill');
const BillDetail = require('../../bill-detail-service/models/BillDetail');
exports.getAllBills = async (req, res) => {
  try {
      const bills = await Bill.find()
          .populate('customerId', 'name')  
          .populate('userId', 'full_name')   
          .sort({ createdAt: -1 });

      if (!bills || bills.length === 0) {
          return res.status(404).json({
              message: 'Không có hóa đơn nào được tìm thấy.',
              errorCode: 'BILLS_NOT_FOUND'
          });
      }

      res.status(200).json(bills);
  } catch (error) {
      console.error('Lỗi khi lấy hóa đơn:', error);
      res.status(500).json({
          message: 'Lỗi máy chủ khi lấy hóa đơn',
          error: error.message,
          errorCode: 'FETCH_BILLS_FAILED'
      });
  }
};
exports.createBill = async (req, res) => {
  const { customerId, products, paymentMethod } = req.body;

  if (!customerId || !products || products.length === 0 || !paymentMethod) {
      return res.status(400).json({ 
          message: 'Thông tin không đầy đủ hoặc giỏ hàng trống!', 
          errorCode: 'MISSING_INFORMATION'
      });
  }

  try {
      const totalAmount = products.reduce((total, product) => total + product.price * product.quantity, 0);

      const newBill = new Bill({
          customerId,
          userId: req.userId,
          totalAmount,
          paymentMethod 
      });

      const savedBill = await newBill.save();

      const billDetails = products.map(product => ({
          billId: savedBill._id,
          productId: product.productId,
          quantity: product.quantity,
          price: product.price
      }));

      await BillDetail.insertMany(billDetails);

      res.status(201).json({ message: 'Thanh toán thành công!', bill: savedBill });

  } catch (error) {
      console.error('Lỗi khi thanh toán:', error);
      res.status(500).json({ 
          message: 'Lỗi khi thanh toán', 
          error: error.message, 
          errorCode: 'PAYMENT_FAILED' 
      });
  }
};


exports.getBillsByUserId = async (req, res) => {
    try {
      const userId = req.userId; 
  
      if (!userId) {
        return res.status(401).json({
          message: 'Không xác định được người dùng!',
          errorCode: 'UNAUTHORIZED'
        });
      }
  
      const bills = await Bill.find({ userId }).sort({ createdAt: -1 }); 
  
      res.status(200).json(bills);
  
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng:', error);
      res.status(500).json({
        message: 'Lỗi máy chủ khi lấy đơn hàng',
        error: error.message,
        errorCode: 'FETCH_BILLS_FAILED'
      });
    }
  };


  exports.getBill = async (req, res) => {
    const { billId } = req.params;
  
    try {
      const bill = await Bill.findById(billId)
        .populate('customerId') 
        .populate('userId');  
  
      if (!bill) {
        return res.status(404).json({ error: 'Hóa đơn không tồn tại!' });
      }
  
      res.status(200).json(bill);
    } catch (error) {
      console.error('Lỗi khi lấy hóa đơn:', error);
      res.status(500).json({ error: 'Lỗi khi lấy hóa đơn!' });
    }
  };

  exports.create_bill = async (req, res) => {
    const { customerId, totalAmount, paymentMethod, userId } = req.body; 
  
    // Kiểm tra thông tin đầu vào
    if (!customerId || !totalAmount || !paymentMethod || !userId) {
      return res.status(400).json({
        message: 'Thông tin không đầy đủ!',
        errorCode: 'MISSING_INFORMATION'
      });
    }
  
    try {
      // Tạo hóa đơn mới
      const newBill = new Bill({
        customerId,
        userId,  
        totalAmount,
        paymentMethod
      });
  
      // Lưu hóa đơn
      const savedBill = await newBill.save();
  
      // Trả về kết quả
      res.status(201).json({ message: 'Thanh toán thành công!', bill: savedBill });
  
    } catch (error) {
      console.error('Lỗi khi thanh toán:', error);
      res.status(500).json({
        message: 'Lỗi khi thanh toán',
        error: error.message,
        errorCode: 'PAYMENT_FAILED'
      });
    }
  };
  

  exports.updateBill = async (req, res) => {
    const { billId } = req.params;
    const { customerId, totalAmount, paymentMethod, userId } = req.body;
  
    if (!customerId || !totalAmount || !paymentMethod || !userId) {
      return res.status(400).json({
        message: 'Thông tin không đầy đủ!',
        errorCode: 'MISSING_INFORMATION'
      });
    }
  
    try {
      const bill = await Bill.findById(billId);
  
      if (!bill) {
        return res.status(404).json({
          message: 'Hóa đơn không tồn tại.',
          errorCode: 'BILL_NOT_FOUND'
        });
      }
  
      // Cập nhật thông tin hóa đơn
      bill.customerId = customerId;
      bill.paymentMethod = paymentMethod;
      bill.userId = userId;
      bill.totalAmount = totalAmount;
  
      const updatedBill = await bill.save();
  
      // Xóa tất cả các chi tiết hóa đơn cũ (nếu có) vì bạn không còn dùng `products`
      await BillDetail.deleteMany({ billId: billId });
  
      // Trả về kết quả
      res.status(200).json({ message: 'Hóa đơn đã được cập nhật!', bill: updatedBill });
  
    } catch (error) {
      console.error('Lỗi khi cập nhật hóa đơn:', error);
      res.status(500).json({
        message: 'Lỗi máy chủ khi cập nhật hóa đơn',
        error: error.message,  // In chi tiết lỗi ra đây
        errorCode: 'UPDATE_BILL_FAILED'
      });
    }
  };
  
  
  

  exports.deleteBill = async (req, res) => {
    const { billId } = req.params;
  
    try {
      const bill = await Bill.findById(billId);
  
      if (!bill) {
        return res.status(404).json({
          message: 'Hóa đơn không tồn tại.',
          errorCode: 'BILL_NOT_FOUND'
        });
      }
  
      // Xóa chi tiết hóa đơn
      await BillDetail.deleteMany({ billId: billId });
  
      // Xóa hóa đơn
      await bill.deleteOne();  // Thay remove() bằng deleteOne()
  
      res.status(200).json({ message: 'Hóa đơn đã được xóa thành công!' });
    } catch (error) {
      console.error('Lỗi khi xóa hóa đơn:', error);
      res.status(500).json({
        message: 'Lỗi máy chủ khi xóa hóa đơn',
        error: error.message,
        errorCode: 'DELETE_BILL_FAILED'
      });
    }
  };