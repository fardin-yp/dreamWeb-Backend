const mongoose = require("mongoose");

const NamadSchema = mongoose.Schema({
    image:{type:String ,required:true}
})

const Namad = mongoose.models.namad || mongoose.model('namad' , NamadSchema)

module.exports =  Namad