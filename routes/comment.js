const messagesRoute = require('express').Router();
const AdminAuth = require('../Auth/admin');
const Article = require('../models/Articles/Article');
const Product = require('../models/products/products');
const jwt = require('jsonwebtoken');
const request = require('request');


messagesRoute.put('/ArticleComment' , async (req,res)=> {
    const date = new Date().toLocaleDateString("fa-IR" ,{timeZone:"Asia/Tehran" } );

  try {
   const ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || 
   req.socket.remoteAddress;

   const {name ,email ,des ,captcha} = req.body;
   const token = req.cookies.Admin;
   const index = email.indexOf("@");
   const com = email.indexOf("com");

   if(!captcha){
      res.json({errMessage:"لطفا کپچا را تایید کنید!" ,err:"captcha"})
   }

     if(!name || !email || !des){
        res.json({errMessage:"تمامی فیلد ها الزامیست" ,err:"all"})
     }
     if(index === -1 || com === -1){
      return res.json({errMessage:"لطفا ایمیل خود را به درستی وارد کنید!" ,err:"email"})
   }
     if(name.length > 16){
      return res.json({errMessage:"نام نمیتواند بیش از 16 کارکتر باشد!" ,err:"name"})
    }

    if(token){
      const verified = jwt.verify(token ,process.env.JWT_SECRET) 
      if(verified){
         var post = {
            name:'Admin',
            email:'Admin@gmail.com',
            des:req.body.des,
            admin:true,
            time:date
            }
          
           Article.findByIdAndUpdate(
             {_id:`${req.body.id}` }, 
             { $push: { comments: post } },{new:true ,useFindAndModify:false}
         ).exec((err,result)=>{
            if(err){
             res.json({errMessage:'دیدگاه ارسال نشد ! لطفا مجدد تلاش کنید'})
            }else{
               res.json(post)
            }
         });
      }

    }

if(!token){

   var post = {
      ip:"dfghjsgjfg",
      name:name,
      email:email,
      des:des,
      admin:false,
      answer:req.body.answer || "false",
      time:date
    }

   //  captcha secret
  const secret = process.env.VISIBLE_CAPTCHA;

  // captcha url
  
  const verificationUrl ="https://www.google.com/recaptcha/api/siteverify?secret=" + secret + "&response=" + captcha + "&remoteip=" + req.connection.remoteAddress;
  
  request(verificationUrl,function(error,response,body) {
   body = JSON.parse(body);
   // Success will be true or false depending upon captcha validation.
   if(body.success !== undefined && !body.success) {
     return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
   }
   Article.findByIdAndUpdate(
      {_id:`${req.body.id}` }, 
      { $push: { comments: post } },{new:true ,useFindAndModify:false}
  ).exec((err,result)=>{
     if(err){
        res.json(err)
     }else{
        res.json(post)
     }
  });
      })
}

   }catch(err){}

});

messagesRoute.put('/ProductComment' , async (req,res) => {

   const date = new Date().toLocaleDateString("fa-IR" ,{timeZone:"Asia/Tehran" } );
   try {
      const ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || 
      req.socket.remoteAddress;
      const {name ,email ,des ,captcha} = req.body;
      const token = req.cookies.Admin;
      const index = email.indexOf("@");
      const com = email.indexOf("com");
      
   if(!captcha){
      return res.json({errMessage:"لطفا کپچا را تایید کنید!" ,err:"captcha"})
   }
   
        if(!name || !email || !des){
         return res.json({errMessage:"تمامی فیلد ها الزامیست" ,err:"all"})
        }
        if(index === -1 || com === -1){
         return res.json({errMessage:"لطفا ایمیل خود را به درستی وارد کنید!" ,err:"email"})
      }
        if(name.length > 16){
         return res.json({errMessage:"نام نمیتواند بیش از 16 کارکتر باشد!" ,err:"name"})
       }
       
       if(token){
         const verified = jwt.verify(token ,process.env.JWT_SECRET);
         if(verified.email){
            
         var post = {
            name:'Admin',
            email:'Admin@gmail.com',
            des:req.body.des,
            admin:true,
            time:date
            }
          
           Product.findByIdAndUpdate(
             {_id:`${req.body.id}` }, 
             { $push: { comments: post } },{new:true ,useFindAndModify:false}
         ).exec((err,result)=>{
            if(err){
             res.json({errMessage:'دیدگاه ارسال نشد ! لطفا مجدد تلاش کنید'})
            }else{
               res.json(post)
            }
         });
      }
   }
   if(!token){
    var post = {
       name:name,
       email:email,
       des:des,
       admin:false,
       answer:req.body.answer,
       time:date,
       ip:"jkjshkjghdfk"
     }

   //  captcha secret
   const secret = process.env.VISIBLE_CAPTCHA;
   // captcha url
   const verificationUrl ="https://www.google.com/recaptcha/api/siteverify?secret=" + secret + "&response=" + captcha + "&remoteip=" + req.connection.remoteAddress;
   
   request(verificationUrl,function(error,response,body) {
    body = JSON.parse(body);
    // Success will be true or false depending upon captcha validation.
    if(body.success !== undefined && !body.success) {
      return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
    }
    Product.findByIdAndUpdate(
       {_id:`${req.body.id}` }, 
       { $push: { comments: post } },{new:true ,useFindAndModify:false}
   ).exec((err,result)=>{
      if(err){
         res.json(err)
      }else{
         res.json(post)
      }
   });
       })
   }
     }catch(err){
        res.send(true)
     }
});

messagesRoute.delete('/deleteMessage/:id/:messId' ,AdminAuth ,async (req ,res) => {

      try{
         Post.findByIdAndUpdate(
            {_id:`${req.params.id}` }, 
            { $pull: { messages: {_id: req.params.messId}} },{multi:true ,useFindAndModify:false}
        ).exec((err,result)=>{
           if(err){
              res.json(err)
           }else{
              res.json(result)
           }
        });
        res.json({Message:"کامنت با موفقیت حذف شد!"})
      }catch(err){
         res.json({errMessage:"خطا در انجام عملیات!!"})
      }
})

module.exports = messagesRoute;