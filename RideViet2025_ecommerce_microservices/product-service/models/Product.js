const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    image: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Typeproduct' } // Khóa ngoại
});

module.exports = mongoose.model('Product', ProductSchema,'products');
