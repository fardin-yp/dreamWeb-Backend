const Users = require('../models/userModel');
const UsersRouter = require("express").Router()
const jwt = require('jsonwebtoken')
const UsersAuth = require('../Auth/users');
const bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
const request = require("request");
const cache = require('../cache');
const Sells = require("../models/sells/sells")

 
UsersRouter.post('/resetemail' ,async(req,res) => {

  const {email ,captcha} = req.body;
  const reset = req.cookies.reset;

try { 
  if(!email) {
    return res.json({errMessage:"ایمیل خود را وارد کنید!"})
  }
  if(!captcha){
    return res.json({errMessage:"به دلیل امنیتی  انجام درخواست امکان پذیر نمیباشد"})
   }
   
  const existing = await Users.findOne({email})
  if(!existing) {
    return res.json({errMessage:"این اکانت در سیستم ثبت نشده است!"})
  }

  const secret = process.env.INVISIBLE_CAPTCHA;
  // captcha url
  const verificationUrl ="https://www.google.com/recaptcha/api/siteverify?secret=" + secret + "&response=" + captcha + "&remoteip=" + req.connection.remoteAddress;
  
  request(verificationUrl, async function(error,response,body) {
   body = JSON.parse(body);
   // Success will be true or false depending upon captcha validation.
   if(body.success !== undefined && !body.success) {
     return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
   }
  const token =jwt.sign(
    {
      email:email
    },
    process.env.JWT_RESET_PASSWORD,
    {expiresIn:"620s"})

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS
  }
});

  var mailOptions = {
    from: 'dream.web.webiste@gmail.com',
    to: `${email}`,
    subject: 'تغییر رمز عبور اکانت DreamWeb',
    html:`
    <h2>برای تغییر رمز عبور خود کلیک کنید</h2>
    <p>http://localhost:3000/Auth/resetPassword/${token}</p>`
  };

  if(reset){
    jwt.verify(reset , process.env.JWT_RESET_PASSWORD ,async function(err,decodedToken){
      if(err){
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            res.json({errMessage:"ایمیل ارسال نشد لطفا دوباره تلاش کنید"})
          } else {
           res.cookie("reset", token, {
            httpOnly: true,
            secure:true
          }).send();  
          }
        });
      }
      if(!err){
        res.json({errMessage:"درخواست شما قبلا ارسال شده است لطفا ایمیل خود را بررسی کنید!",err:"reset"})
      }
    })
    
  }
  
if(!reset){
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      res.json({errMessage:"ایمیل ارسال نشد لطفا دوباره تلاش کنید"})
    } else {
     res.cookie("reset", token, {
      httpOnly: true,
      secure:true
    }).send();  
    }
  });
}
  })
}catch(err){
  res.json({errMessage:"درخواست ارسال نشد لطفا مجددا تلاش کنید!"})
}
  
})
UsersRouter.get('/reset/:token' , async (req ,res) => {

  try{
    const token = req.params.token;

    if(!token) return res.json(false);

    jwt.verify(token , process.env.JWT_RESET_PASSWORD ,async function(err,decodedToken){
      if(err){
       res.send(false)
      }
      if(!err){
        res.send(true)
      }
    })

  }catch(err){

  }
})

UsersRouter.post('/reset' ,async (req, res) => {
  const {token ,password ,verify} = req.body;

  if(password !== verify){
    return res.json({errMessage:"رمز ها تطابق ندارند"})
  }
  if(password.length < 6){
    return res.json({errMessage:"تعداد رمز ها باید بیشتر از 5 عدد باشد"})
  }
  if(token && password){
    jwt.verify(token , process.env.JWT_RESET_PASSWORD ,async function(err,decodedToken){
     if(err){
      res.json({errMessage:"خطا در اجرای درخواست"})
     } 
if(!err){
  const {email} = decodedToken;
  const salt = await bcrypt.genSalt()
  const passwordHash = await bcrypt.hash(password ,salt)
  
  const filter = {email};
  const update = {passwordHash};

  const existing = await Users.findOneAndUpdate(filter, update, {
   new: true,
   upsert: true,
   rawResult: true // Return the raw result from the MongoDB driver
 });
 res.json({message:"رمز شما با موفقیت تغییر یافت"})
}
    }
    )}
  });

  UsersRouter.post('/sendEmail' ,async(req,res) => {

    const {email ,username ,family ,captcha} = req.body;
  
  try { 
    if(!email && !username && !family) {
      return res.json({errMessage:"تمامی فیلد ها ازامیست !" ,err:"all"})
    }
    if(!email) {
      return res.json({errMessage:"ایمیل خود را وارد کنید!" ,err:"email"})
    }
    if(!username) {
      return res.json({errMessage:"نام خود را وارد کنید !" ,err:"username"})
    }
    if(!family) {
      return res.json({errMessage:"نام خانوادگی خود را وارد کنید !" ,err:"family"})
    }
    if(!captcha){
      return res.json({errMessage:"به دلیل امنیتی  انجام درخواست امکان پذیر نمیباشد"})
     }
     
    const existing = await Users.findOne({email})
    if(existing) {
      return res.json({errMessage:"این اکانت در سیستم ثبت شده است!"})
    }
    const index = email.indexOf("@");
    const com = email.indexOf("com");

    if(index === -1 || com === -1){
        return res.json({errMessage:"لطفا ایمیل خود را به درستی وارد کنید!" ,err:"email"})
    }
    if(username.length > 16){
      return res.json({errMessage:"نام نمیتواند بیش از 16 کارکتر باشد!" ,err:"name"})
  }
  const existMeliCode = await Users.findOne({meliCode:meliCode});
  if(existMeliCode) {
    return res.json({errMessage:" این کدملی در سیستم ثبت شده است!" ,err:"meliCode"})
  }
  if(meliCode.length > 10) {
    return res.json({errMessage:"کد ملی نمیتوتند بیش از 10 کاراکتر باشد !"})
  }
  if(meliCode.length < 10) {
    return res.json({errMessage:"کد ملی نمیتوتند کمتر از 10 کاراکتر باشد !"})
  }
    const secret = process.env.INVISIBLE_CAPTCHA;
    // captcha url
    const verificationUrl ="https://www.google.com/recaptcha/api/siteverify?secret=" + secret + "&response=" + captcha + "&remoteip=" + req.connection.remoteAddress;
    
    request(verificationUrl, async function(error,response,body) {
     body = JSON.parse(body);
     // Success will be true or false depending upon captcha validation.
     if(body.success !== undefined && !body.success) {
       return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
     }
    const token =jwt.sign(
      {
        email:email,
        username:username,
        family:family
      },
      process.env.JWT_ACCOUNT_ACTIVATE)
  
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
  });
  
    var mailOptions = {
      from: 'dream.web.webiste@gmail.com',
      to: `${email}`,
      subject: `تایید ایمیل اکانت دریم وب آقا/خانم ${username} ${family} `,
      html:`
      <h2> سلام </h2>
      <h2> !از اینکه ما را انتخاب کردید متشکریم </h2>
      <h2> !شما میتوانید با کلیک روی لینک زیر ایمیل خود را تایید کنید  </h2>
      <p>http://localhost:3000/Auth/activate?token=${token}</p>`
    };
  
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              res.json({errMessage:"ایمیل ارسال نشد لطفا دوباره تلاش کنید"})
            } else {
             res.json({message:"ایمیل تایید برای شما ارسال شد لطفا صندوق ایمیل خود را بررسی کنید !"})
            }
          });   
        });
  }catch(err){
    res.json({errMessage:"درخواست ارسال نشد لطفا مجددا تلاش کنید!"})
  }
    
  })


UsersRouter.post("/signup/:token"  ,async (req ,res) => {

  try{
      const { number , password ,meliCode  ,confirm ,captcha } = req.body;
      const cookie = req.params.token;
      const date = new Date().toLocaleDateString("fa-IR" ,{timeZone:"Asia/Tehran" } )

      if(!captcha){
        return res.json({errMessage:"به دلیل امنیتی ارسال پیام امکان پذیر نمیباشد"})
       }

       if(!cookie){
        return res.json({errMessage:"توکن مورد تایید نیست یا ممکن منقضی شده باشد !"})
       }
     
      if(!password || !number || !confirm || !meliCode) {
        return res.json({errMessage:"تمامی فیلد ها الزامی است",err:"all"})
   }
   const existingNumber = await Users.findOne({number});

      if(password.length < 6){
        return res.json({errMessage:"تعداد رمز ها باید بیشتر از 5 عدد باشد" ,err:"password"})
      }
      if(password !== confirm){
        return res.json({errMessage:"رمز ها مشابه نیستند", err:"confirm"})
      }
      if(number.length !== 11){
        return res.json({errMessage:" تعداد رقم های شماره تلفن باید 11 رقم باشد!" ,err:'number'})
      }
      if(number.charAt(0) !== "0" || number.charAt(1) !== "9" ) {
        return res.json({errMessage:" لطفا شماره تلفن صحیح را وارد نمایید!" ,err:"number"})
      }
      if(existingNumber) {
        return res.json({errMessage:"این شماره در سیستم ثبت شده است!" ,err:"number"})
      }


    const secret = process.env.INVISIBLE_CAPTCHA;
    // captcha url
    const verificationUrl ="https://www.google.com/recaptcha/api/siteverify?secret=" + secret + "&response=" + captcha + "&remoteip=" + req.connection.remoteAddress;
    
    request(verificationUrl, async function(error,response,body) {
     body = JSON.parse(body);
     // Success will be true or false depending upon captcha validation.
     if(body.success !== undefined && !body.success) {
       return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
     }
     if(cookie){
      jwt.verify(cookie , process.env.JWT_ACCOUNT_ACTIVATE,async function(err,decodedToken){
       if(err){   
         res.json({errMessage:"خطا: ممکن است توکن شما اشتباه یا منقضی شده باشد !"})
       } 
       if(decodedToken){
         const {email ,username ,family} = decodedToken;
  //hash Password
  const salt = await bcrypt.genSalt()
  const passwordHash = await bcrypt.hash(password ,salt);

const newUser = new Users({email ,meliCode ,family ,username ,passwordHash ,number ,blocked:false ,timestamp:date})

const savedUser = await newUser.save((err,secc) => {
if(err){
  res.json({errMessage:'!اکانت ایجاد نشد لطفا دوباره تلاش نمایید !'})
}
//sign the token
const token =jwt.sign(
  {
  email:email,username:username
  },
  process.env.USERS_JWT_SECRET
  );
  // send the token
  res.cookie("token", token, {
    httpOnly: true,
    secure:true
    }).send();
})
       }
    
      })
    }

});

}catch(err){
  console.log(err)
}

})

   //login
   UsersRouter.post("/login" , async (req,res) => {
  
    const {email , password ,captcha} = req.body;
  try{
    
   if(!email || !password) {
        return res.json({errMessage:"تمامی فیلد ها الزامی است"})
   }
   if(!captcha){
    return res.json({errMessage:"به دلیل امنیتی ارسال پیام امکان پذیر نمیباشد"})
   }
   
    const existingUser = await Users.findOne({email});

   if(!existingUser){
    return res.json({errMessage:"ایمیل یا رمز اشتباه"})
    }
    if(existingUser.blocked === true){
      return res.json({errMessage:"این اکانت بن شده است "})
    }
  const correct = await bcrypt.compare(password, existingUser.passwordHash)
   if(!correct){
    return res.json({errMessage:" ایمیل یا رمز اشتباه"})
  }
  
  const secret = process.env.INVISIBLE_CAPTCHA;
  // captcha url
  const verificationUrl ="https://www.google.com/recaptcha/api/siteverify?secret=" + secret + "&response=" + captcha + "&remoteip=" + req.connection.remoteAddress;
  
  request(verificationUrl, async function(error,response,body) {
   body = JSON.parse(body);
   // Success will be true or false depending upon captcha validation.
   if(body.success !== undefined && !body.success) {
     return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
   }
  //sign the token
  const token =jwt.sign(
    {
      email:email,username:existingUser.username
    },
    process.env.USERS_JWT_SECRET
    
   );

  // send the token
res.cookie("token", token, {
  httpOnly: true,
  secure:true
}).send();
  })

    }catch(err){
   
    }
  })
 
   //log out
   UsersRouter.get("/logout", cache(300) , (req,res) => {
     res.cookie("token" ,"", {
       httpOnly:true,
       expires:new Date(0)
     }).send()
   })
 //loggedIn
 UsersRouter.get("/loggedIn",(req,res) => {
  try{
     const token = req.headers.cookie ;

     if(!token) return res.json(false);

     jwt.verify(token, process.env.USERS_JWT_SECRET)

  res.send(true)

}catch(err){
  res.json(false)
}
});
 UsersRouter.get('/find',async(req ,res) => {
  const token = req.headers.cookie;

  if(!token){
    return res.json({errMessage:"لطفا وارد اکانت خود شوید"})
  }

  if(token){
  jwt.verify(token , process.env.USERS_JWT_SECRET ,async function(err,decodedToken){
   if(err){   
     res.json({errMessage:"لطفا وارد اکانت خود شوید"})
   } 
   if(decodedToken){
     const {email ,username} = decodedToken;
     const find = await Users.find({email:email});
     const purchases = await Sells.find({email:email})
     res.json({email ,username ,number:find ,purchases:purchases})
   }

  })
}
 })

 UsersRouter.get('/findUser' ,async(req ,res) => {
  const token = req.cookies.token;

  if(!token){
    return res.json({errMessage:"لطفا وارد اکانت خود شوید"})
  }

  if(token){
  jwt.verify(token , process.env.USERS_JWT_SECRET ,async function(err,decodedToken){
   if(err){   
     res.json({errMessage:"لطفا وارد اکانت خود شوید"})
   } 
   if(decodedToken){
     const {email ,username} = decodedToken;
     const purchases = await Sells.find({email:email})

     res.json({email ,username ,purchases })
   }

  })
}
 })




 UsersRouter.put('/editUser/:id/:type' ,async(req ,res) => {

  const {username ,email ,number ,meliCode} = req.body;
  const token = req.cookies.token;
  const filter = req.params.id;
  const type = req.params.type;
  const updateUser = {username:username}

  if(!token){
    return res.json({errMessage:"لطفا وارد اکانت خود شوید"})
  }

  if(token){
  jwt.verify(token , process.env.USERS_JWT_SECRET ,async function(err,decodedToken){
   if(err){   
     res.json({errMessage:"لطفا وارد اکانت خود شوید"})
   } 
   if(decodedToken){
     if(type === "email"){
       if(!req.body.email){
         return res.json({errMessage:"لطفا ایمیل خود را وارد کنید"})
       }
       const existing = await Users.findOne({email:req.body.email});
     if(existing) {
        return res.json({errMessage:"اکانت با این ایمیل در سیستم موجود است" , err:"email"})
     }
     const index = req.body.email.indexOf("@");
     const com = req.body.email.indexOf("com");

    if(index === -1 || com === -1){
    return res.json({errMessage:"لطفا ایمیل خود را به درستی وارد کنید!" ,err:"email"})
    }
      await Users.findOneAndUpdate(filter, {email:req.body.email} , {
        returnOriginal: false
      });

      const token =jwt.sign(
        {
          email:email,username:username
        },
        process.env.USERS_JWT_SECRET
        
       );
    
      // send the token
    res.cookie("token", token, {
      httpOnly: true,
      secure:true
    }).send();
     
     }

     if(type === "username"){

      try{
      if(!req.body.username){
        return res.json({errMessage:"لطفا نام کاربری خود را وارد کنید"})
      }
      if(req.body.username.length > 16){
        return res.json({errMessage:"نام نمیتواند بیش از 16 کارکتر باشد!" ,err:"name"})
      }
      await Users.findOneAndUpdate(filter, updateUser, {
        returnOriginal: false
      });
       }catch(err){}
       
       const token =jwt.sign(
        {
          email:email,username:username
        },
        process.env.USERS_JWT_SECRET
        
       );
    
      // send the token
    res.cookie("token", token, {
      httpOnly: true,
      secure:true
    }).send();
   
     }

     if(type === "number"){
      const existingNumber = await Users.findOne({number:number});
      if(!req.body.number){
        return res.json({errMessage:"لطفا شماره خود را وارد کنید"})
      }
      if(req.body.number.length !== 11){
        return res.json({errMessage:" تعداد رقم های شماره تلفن باید 11 رقم باشد!" ,err:'number'})
      }
      if(req.body.number.charAt(0) !== "0" || req.body.number.charAt(1) !== "9" ) {
        return res.json({errMessage:" لطفا شماره تلفن صحیح را وارد نمایید!" ,err:"number"})
      }
      if(existingNumber) {
        return res.json({errMessage:" این شماره در سیستم ثبت شده است!" ,err:"number"})
      }
      await Users.findOneAndUpdate(filter, {number:req.body.number} , {
        returnOriginal: false
      });
      res.json({message:"شماره آپدیت شد !"})
     }

     
     if(type === "meliCode"){
      const existingNumber = await Users.findOne({meliCode:meliCode});
      if(existingNumber) {
        return res.json({errMessage:" این کدملی در سیستم ثبت شده است!" ,err:"meliCode"})
      }
      if(meliCode.length > 10) {
        return res.json({errMessage:"کد ملی نمیتوتند بیش از 10 کاراکتر باشد !"})
      }
      if(meliCode.length < 10) {
        return res.json({errMessage:"کد ملی نمیتوتند کمتر از 10 کاراکتر باشد !"})
      }
      await Users.findOneAndUpdate(filter, {meliCode:req.body.meliCode} , {
        returnOriginal: false
      });
      res.json({message:"کدملی آپدیت شد !"})
     }

   }

  })
}
 });




module.exports = UsersRouter