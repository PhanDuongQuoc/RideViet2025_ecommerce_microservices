const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  name: String,         
  image: String,       
  content: String,      
  author:String,       
  category: String,    
  tags:String,                      
  views:Number,            
  createdAt: { type: Date, default: Date.now },   
  updatedAt: { type: Date, default: Date.now },  

});

module.exports = mongoose.model("News", newsSchema, "news");
