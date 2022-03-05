const mongoose = require('mongoose');

const exSchema = mongoose.Schema({
    form:{type:Array ,require:true},
})

const ExclusiveForm = mongoose.models.ExclusiveForm || mongoose.model('ExclusiveForm' , exSchema);

module.exports = ExclusiveForm