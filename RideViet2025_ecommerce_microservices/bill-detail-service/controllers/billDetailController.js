const BillDetail = require('../models/BillDetail');
const Bill = require('../../bill-service/models/Bill'); // Import Bill model
const Product = require('../../product-service/models/Product'); // Import Product model

exports.getAllBillDetails = async (req, res) => {
  try {
    const billDetails = await BillDetail.find()
      .populate('billId', '_id')  // Populating Bill reference
      .populate('productId', 'name')  // Populating Product reference
      .sort({ createdAt: -1 });

    res.status(200).json(billDetails);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy tất cả chi tiết hóa đơn', error });
  }
};

exports.getBillDetailById = async (req, res) => {
  try {
    const { id } = req.params;
    const billDetail = await BillDetail.findById(id)
      .populate('billId', '_id')
      .populate('productId', 'name');

    if (!billDetail) {
      return res.status(404).json({ message: 'Chi tiết hóa đơn không tồn tại' });
    }

    res.status(200).json(billDetail);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy chi tiết hóa đơn theo ID', error });
  }
};

exports.createBillDetail = async (req, res) => {
  try {
    const { billId, productId, quantity, price } = req.body;

    // Kiểm tra xem billId và productId có hợp lệ không
    const bill = await Bill.findById(billId);
    const product = await Product.findById(productId);

    if (!bill) {
      return res.status(404).json({ message: 'Hóa đơn không tồn tại' });
    }
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    const newBillDetail = new BillDetail({
      billId,
      productId,
      quantity,
      price
    });

    const savedBillDetail = await newBillDetail.save();
    res.status(201).json(savedBillDetail);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi tạo chi tiết hóa đơn', error });
  }
};

exports.updateBillDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, price } = req.body;

    const billDetail = await BillDetail.findById(id);

    if (!billDetail) {
      return res.status(404).json({ message: 'Chi tiết hóa đơn không tồn tại' });
    }

    if (quantity && !isNaN(quantity)) billDetail.quantity = quantity;
    if (price && !isNaN(price)) billDetail.price = price;

    const updatedBillDetail = await billDetail.save();
    res.status(200).json(updatedBillDetail);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật chi tiết hóa đơn', error });
  }
};

exports.deleteBillDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const billDetail = await BillDetail.findById(id);

    if (!billDetail) {
      return res.status(404).json({ message: 'Chi tiết hóa đơn không tồn tại' });
    }

    // Xóa chi tiết hóa đơn
    await billDetail.deleteOne();
    res.status(200).json({ message: 'Chi tiết hóa đơn đã được xóa' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa chi tiết hóa đơn', error });
  }
};
