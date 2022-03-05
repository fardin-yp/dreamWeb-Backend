const mongoose = require('mongoose');


const QuestionsModel = mongoose.Schema({
    question:{type:String},
    route:{type:String},
    answer:{type:String }
})

const Questions = mongoose.models.Questions || mongoose.model('Questions' , QuestionsModel);
module.exports = Questions 