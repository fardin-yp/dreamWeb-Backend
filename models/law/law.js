const mongoose = require('mongoose');

const exSchema = mongoose.Schema({
    text:{type:String ,required:true},
})

const Laws = mongoose.model('laws' , exSchema);

module.exports = Laws