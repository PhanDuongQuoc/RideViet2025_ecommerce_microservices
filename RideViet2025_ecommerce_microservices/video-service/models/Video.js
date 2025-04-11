const mongoose = require('mongoose')
const VideoSchema = new mongoose.Schema({
    title:String,
    url:String,
    description: String,
}); 


module.exports = mongoose.model('Video',VideoSchema,'videos');




