const route = require("express").Router();
const Exclusive = require("../models/Exclusive/exclusive");
const Contact = require("../models/contact");
const Consalting = require("../models/consalting");
const Products = require('../models/products/products');
const Articles = require("../models/Articles/Article");
const ExclusiveForm = require("../models/exclusiveModel/exclusive");
const Sells = require("../models/sells/sells");
var nodemailer = require('nodemailer');
const Questions = require("../models/questions/question");
const request = require("request");
const Namad = require("../models/namad");
const Seo = require("../models/Seo/Seo");
const cache = require('../cache');
const SeoService = require("../models/Seo/seoService");
const UsersAuth = require("../Auth/users");
const Laws = require("../models/law/law");
const jwt = require("jsonwebtoken");
const Links = require("../models/Links/Links");

route.post('/exclusive' ,async (req ,res) => {
    const {email ,number ,name ,des ,captcha} = req.body;
    const date = new Date().toLocaleDateString("fa-IR" ,{timeZone:"Asia/Tehran" } );

   try {

   if(!captcha){
    return res.json({errMessage:"به دلیل امنیتی ارسال پیام امکان پذیر نمیباشد"})
   }
   if(!email) {
      return res.json({errMessage:"ایمیل خود را وارد کنید!",err:"email"})
    }
    const index = email.indexOf("@");
    const com = email.indexOf("com");

    if(index === -1 || com === -1){
        return res.json({errMessage:"لطفا ایمیل خود را به درستی وارد کنید!" ,err:"email"})
    }
    if(!number){
        return res.json({errMessage:"فیلد شماره همراه الزامی است" ,err:"number"})
    }
    if(number.length !== 11){
        return res.json({errMessage:" تعداد رقم های شماره تلفن باید 11 رقم باشد!" ,err:'number'})
      }
    if(number.charAt(0) !== "0" || number.charAt(1) !== "9" ) {
        return res.json({errMessage:" لطفا شماره تلفن صحیح را وارد نمایید!" ,err:"number"})
      }
    if(!name){
        return res.json({errMessage:"فیلد  نام الزامی است" ,err:"name"})
    }
    const existNumber = await Exclusive.findOne({number:number});
    if( existNumber ){
        return res.json({errMessage:"درخواست شما قبلا ارسال شده است منتظر تایید بمانید"})
    }
    const existemail = await Exclusive.findOne({email:email});

    if( existemail ){
      return res.json({errMessage:"درخواست شما قبلا ارسال شده است منتظر تایید بمانید"})
  }
    const secret = "6LfMd88dAAAAAJH3mPde_pSETx_RXS8pjDzHsnY3";
    // captcha url
    const verificationUrl ="https://www.google.com/recaptcha/api/siteverify?secret=" + secret + "&response=" + captcha + "&remoteip=" + req.connection.remoteAddress;
    
    request(verificationUrl,async function(error,response,body) {
     body = JSON.parse(body);
     // Success will be true or false depending upon captcha validation.
     if(body.success !== undefined && !body.success) {
       return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
     }
    const newExclusive = new Exclusive({
        email,
        number,
        des,
        name,
        timestamp:date
    })
    const saveEx =await newExclusive.save();
    res.json({Message:"درخواست با موفقیت ارسال شد!"})

   });
}catch(err){
   res.json({errMessage:"درخواست ارسال نشد لطفا مجدد تلاش کنید!"})
}
})
route.post('/consulting' ,async (req ,res) => {
    const {number ,name ,captcha} = req.body;
    const date = new Date().toLocaleDateString("fa-IR" ,{timeZone:"Asia/Tehran" } )

    try {

   if(!captcha){
    return res.json({errMessage:"به دلیل امنیتی ارسال پیام امکان پذیر نمیباشد"})
   }     
    if(!number){
        return res.json({errMessage:"فیلد شماره همراه الزامی است" ,err:"number"})
    }
    if(number.length !== 11){
        return res.json({errMessage:" تعداد رقم های شماره تلفن باید 11 رقم باشد!"})
      }
    if(number.charAt(0) !== "0" || number.charAt(1) !== "9" ) {
        return res.json({errMessage:" لطفا شماره تلفن صحیح را وارد نمایید!"})
      }
    if(!name){
        return res.json({errMessage:"فیلد نام و نام خانوادگی الزامی است" ,err:"name"})
    }
    const exist = await Consalting.find({number:number});
    if(exist){
        return res.json({errMessage:"درخواست شما قبلا ارسال شده است منتظر تایید بمانید"})
    }

    const secret = "6LfMd88dAAAAAJH3mPde_pSETx_RXS8pjDzHsnY3";
    // captcha url
    const verificationUrl ="https://www.google.com/recaptcha/api/siteverify?secret=" + secret + "&response=" + captcha + "&remoteip=" + req.connection.remoteAddress;
    
    request(verificationUrl,async function(error,response,body) {
     body = JSON.parse(body);
     // Success will be true or false depending upon captcha validation.
     if(body.success !== undefined && !body.success) {
       return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
     }

    const newExclusive = new Consalting({
        email,
        number,
        des,
        number,
        timestamp:date
    })
    const saveEx = await newExclusive.save();
    res.json({Message:"درخواست با موفقیت ارسال شد!"})
   })
}catch(err){
   res.json({errMessage:"درخواست ارسال نشد لطفا مجدد تلاش کنید!"})
}
})


route.post('/contact' ,async (req ,res) => {
    const {email ,name ,message ,des ,captcha} = req.body;
    const date = new Date().toLocaleDateString("fa-IR" ,{timeZone:"Asia/Tehran" } )

    try {

    if(!captcha){
         return res.json({errMessage:"به دلیل امنیتی ارسال پیام امکان پذیر نمیباشد"})
      }     

    if(!name || !email || !des || !message){
        return res.json({errMessage:"تمام فیلد ها الزامی است!" ,err:"all"})
    }
    const index = email.indexOf("@");
    const com = email.indexOf("com");

    if(index === -1 || com === -1){
        return res.json({errMessage:"لطفا ایمیل خود را به درستی وارد کنید!" ,err:"email"})
    }
    if(name.length > 16){
        return res.json({errMessage:"نام نمیتواند بیش از 16 کارکتر باشد!" ,err:"name"})
    }
    const secret = "6LfMd88dAAAAAJH3mPde_pSETx_RXS8pjDzHsnY3";
    // captcha url
    const verificationUrl ="https://www.google.com/recaptcha/api/siteverify?secret=" + secret + "&response=" + captcha + "&remoteip=" + req.connection.remoteAddress;
    
    request(verificationUrl,async function(error,response,body) {
     body = JSON.parse(body);
     // Success will be true or false depending upon captcha validation.
     if(body.success !== undefined && !body.success) {
       return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
     }
    const newExclusive = new Contact({
        email,
        name,
        des,
        message,
        timestamp:date
    })
    const saveEx = await newExclusive.save();
    res.json({Message:"پیام شما ارسال شد!"})
   });
}catch(err){
   
}
});

route.get('/shop', cache(300) , async (req ,res) => {

      try{
       const findPost = await Products.find({category:"shop"}).sort({"_id":-1})
       res.json({ findPost,route:"shop-website" });
      }catch(err){
         res.send(true);
      } 
   });
   route.get('/company' , async (req ,res) => {
   try{
    const findPost = await Products.find({category:"company"}).sort({"_id":-1})

       res.json({ findPost });
      }catch(err){
         res.send(true);
      } 
   });
   route.get('/personal', cache(300) , async (req ,res) => {

   try{
    const findPost = await Products.find({category:"personal"}).sort({"_id":-1})

       res.json({ findPost });
      }catch(err){
         res.send(true);
      } 
   });
   route.get('/news', cache(300) , async (req ,res) => {

   try{
    
    const findPost = await Products.find({category:"news"}).sort({"_id":-1})

       res.json({ findPost });
      }catch(err){
         res.send(true);
      } 
   });
   route.get('/real-state', cache(300) , async (req ,res) => {
 
   try{
    
    const findPost = await Products.find({category:"realState"}).sort({"_id":-1})

       res.json({ findPost });
      }catch(err){
         res.send(true);
      } 
   });
   route.get('/resturant', cache(300) , async (req ,res) => {

   try{
    const findPost = await Products.find({category:"resturant"}).sort({"_id":-1})

       res.json({ findPost });
      }catch(err){
         res.send(true);
      } 
   });
   route.get('/medical', cache(300) , async (req ,res) => {
      try{

      const findPost = await Products.find({category:"medical"}).sort({"_id":-1})
  
         res.json({ findPost });
        }catch(err){
           res.send(true);
        } 
     });
     route.get('/articles',cache(300) , async (req ,res) => {
      let { page } = req.query;
   
      if(!page) {
         page = 1;
      }
        try{
         let size = 10;
         const limit = parseInt(size);
         const skip = (page - 1 ) * size;
   
      const total = await Articles.find().countDocuments();
      const pages = Math.ceil(total / limit);
      const findPost = await Articles.find().sort({"_id":-1}).limit(limit).skip(skip);
      const findQuestions = await Questions.find().limit(5);
      const seoService = await SeoService.find().sort({"_id":-1}).limit(2);

      res.json({ findPost  ,findQuestions, pages ,page ,route:"articles" ,seoService});
        }catch(err){
           res.send({errMessage:"somting went wrong find Articles"});
        } 
     });

   route.get('/fullPost/:id', cache(300) , async (req ,res) => {
       const id = req.params.id

    try{
    const findPost = await Products.findById(id)

       res.json(findPost);
      }catch(err){
         res.send(true)
      } 
   });

   route.get('/fullArticle/:id', cache(300) , async (req ,res) => {
      const id = req.params.id

   try{
   const findPost = await Articles.findById(id)

      res.json(findPost);
     }catch(err){
        res.send(true)
     } 
  });

  route.post('/viewArticle/:id' , async (req ,res) => {
   const id = req.params.id

try{
const findPost = await Articles.findById(id)

   res.json(findPost);
  }catch(err){
     res.send(true)
  } 
});
 route.post("/orderSold" , async (req,res) => {

   const {email ,number ,name , information ,des ,price} = req.body;

  const newPost = new Sells({
   name:name,
   email:email,
   number:number,
   information:information,
   des:des,
   price:price,

  });
  const token =jwt.sign(
   {
     email:email,
     name:name,
     email:email,
     number:number,
     information:information,
     des:des,
     price:price,
   }, process.env.JWT_RESET_PASSWORD,{expiresIn:"1h"})
   
   res.cookie("token", token, {
      httpOnly: true,
      secure:true
    }).send();
});

route.get("/order-complete/:token", cache(300), async (req, res) => {
   const {email ,number ,name , information ,des ,price} = req.body;

   const newPost = new Sells({
    name:name,
    email:email,
    number:number,
    information:information,
    des:des,
    price:price,
 
   });

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
}
});

var mailOptions = {
  from: 'DreamWeb@gmail.com',
  to: `${email}`,
  subject: `خرید${information}`,
  html:`
  <h2>خرید ${information} انجام شد!</h2>`
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    res.json({errMessage:"ایمیل ارسال نشد لطفا دوباره تلاش کنید"})
  } else {
   Users.find()
   res.json({message:" ایمیل برای شما ارسال شد لطفا ایمیل خود را چک کنید"})

  }
});
const save = newPost.save()
res.json({Message:"done!!!!!!!"})

})

 route.get('/exclusiveForm/', cache(300) , async (req ,res) => {
   const id = req.params.id

try{
const findPost = await ExclusiveForm.find()

   res.json(findPost);
  }catch(err){

  } 
});

route.get('/exclusive/', cache(300) , async (req ,res) => {
   const id = req.params.id

try{
const findPost = await ExclusiveForm.find()
const Question = await Questions.find({route:"exclusive"});

   res.json({findPost  ,Question});
  }catch(err){

  } 
});

route.get('/namad', cache(300), async (req ,res) => {

   try{
   const namad = await Namad.find()
   
     res.json(namad)
     }catch(err){
      res.json({errMessage:"namad  err"})
     } 
   });

   route.get('/allProducts',cache(300) , async (req, res) => {
      try{
        const find = await Products.find();
        res.json(find);
        
        }catch(err){
           res.send(true)
        } 
   })

   route.get('/allArticles',cache(300) , async (req, res) => {
      try{
        const find = await Articles.find();
        res.json(find);
        
        }catch(err){
         res.send(true)
        } 
   })

   route.get("/Seo/:route" ,async (req, res) => {
      const route = req.params.route;
    try{
      const seo = await Seo.find({route:route});
      res.json(seo);
    }catch(err){
       res.json(true)
    }
   })
   route.get("/SeoService/:id" ,async (req, res) => {
      const id = req.params.id;
    try{
      const seo = await SeoService.findOne({_id:id});
      res.json(seo);
    }catch(err){
       res.json(true)
    }
   })

   route.get("/laws" ,cache(300) , async (req,res) => {
      try{
          const findPost = await Laws.find();
          res.json(findPost)
      }catch(err){}

   });

   route.get("/Links" ,cache(300) , async (req,res) => {
      try{
          const findPost = await Links.findOne();
          res.json(findPost)
      }catch(err){}

   });


   

module.exports = route;