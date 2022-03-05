const mongoose = require("mongoose");

const sessionsSchema = mongoose.Schema({
    session:{type:String },
    day:{type:String},
    month:{type:String},
    year:{type:String},
},{timestamps:true});

module.exports = mongoose.models.sessions || mongoose.model("sessions" , sessionsSchema);


