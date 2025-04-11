const mongoose = require("mongoose");

const TypeProductSchema = new mongoose.Schema({
  name: String,
  image: String
});

module.exports = mongoose.model("Typeproduct", TypeProductSchema,'type_products');
