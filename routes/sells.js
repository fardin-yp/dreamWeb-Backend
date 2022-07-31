const sellRouter = require("express").Router();
const Users = require('../models/userModel');
const jwt = require('jsonwebtoken')
const UsersAuth = require('../Auth/users');
var nodemailer = require('nodemailer');
const Sells = require("../models/sells/sells");
const axios = require("axios");
const Products = require("../models/products/products");

sellRouter.post('/pay' ,UsersAuth, async (req, res ) => {

  const {amount ,email ,object ,description ,callback_url ,merchant_id} = req.body;

  try{
 
    const postData = {amount:parseInt(amount) ,description ,callback_url,merchant_id}
 
   const post = await axios.post('https://api.zarinpal.com/pg/v4/payment/request.json', postData);

   const token = jwt.sign(
    {
      amount:JSON.stringify(amount),
      email:email ,
      description:description,
      object:JSON.stringify(object),
      category:req.body.category
    },
    process.env.PURCHASE_SECRET)
    
    res.json({token , post:post.data})

    }catch(err){
      res.json({errMessage:"خطا در اتصال شما به درگا پرداخت !"})
      }
 })
 
 sellRouter.post('/orderComplete',UsersAuth, async (req, res) =>{
 
    const date = new Date().toLocaleDateString("fa-IR" ,{timeZone:"Asia/Tehran" } );
    const {Authority,amount ,merchant ,purchase} = req.body;
    const date_ob = new Date();

// current year
const year = date_ob.getFullYear();

const monthName = date_ob.toLocaleString('en-us',{month:'short'});



 try{

  if(!Authority || !amount || !merchant || !purchase){
    return res.json({errMessage:"خطا در تراکش مقادیر ارسالی مورد تایید نمیباشد !"})
  }

  const postData = {amount:parseInt(amount) ,merchant_id:merchant ,authority:Authority}
  
  const post = await axios.post('https://api.zarinpal.com/pg/v4/payment/verify.json', postData);
  const token = purchase.token;

  if(post && post.data.data.code === -9){
    return res.json({errMessage:"خطا در تراکنش اگر مبلغ از حساب شما کسر شده است تا 48 ساغت آینده مبلغ برگشت داده خواهد شد !"})
  }

  if(post && post.data.data.code === 101){
    return res.json({message:"این خرید قبلا تایید شده است !",Tracking:post.data.data.ref_id})
  }

  if(post && post.data.data.code === 100){

     
      jwt.verify( token , process.env.PURCHASE_SECRET,async function(err,decodedToken){
        if(err){   
         return res.json({errMessage:"لطفا وارد اکانت خود شوید"})
        } 
        if(decodedToken){
          const {email ,amount ,object ,description ,category} = decodedToken;
          const find = await Users.findOne({email:email});
          const newSell = new Sells({
              buyer:`${find.username} ${find.family}`
             ,price:amount
             ,product:JSON.parse(object)
             ,email:email
             ,meliCode:find.meliCode
             ,number:find.number
             ,description:description
             ,date:date
             ,month:monthName
             ,year:year
             ,confirmation:false
             ,Tracking:post.data.data.ref_id
             ,category:category
          })
            
 const savedSell = await newSell.save((err,secc) => {
 if(err){
  return res.json({errMessage:'خطا در ثبت خرید شما در صورت برداشت وجه از حساب خود مبلغ تا 72 ساعت آینده عودت داده میشود !'})
 }

    res.json({message:'خرید شما ثبت شد شما میتوانید لیست خرید های خود را در بخش پنل کاربری مشاهده کنید !'})

 }) 

}
})
    
}
   }catch(err){
    res.json({errMessage:'خطا در ثبت خرید شما در صورت برداشت وجه از حساب خود مبلغ تا 72 ساعت آینده عودت داده میشود !'})
   }
 })

 sellRouter.post('/confirm', async (req, res) =>{
  const {id} = req.body;
  const filter = { _id: id };
  const update = {confirmation:true}

    try {

      const exist = await Sells.findById(id);

      if(!exist){
        res.json({errMessage:"این خرید وجود ندارد !"})
      }
 
      if(exist){
      await Sells.findOneAndUpdate(filter, update, {
       returnOriginal: false
     });
     res.json({Message:" خرید تایید شد !"});
    }

    }catch(err){
      console.log(err)
    }
 
 })

 sellRouter.post('/delete', async (req, res) =>{
  const {id} = req.body;
  const filter = { _id: id };

    try {

      const exist = await Sells.findById(id);

      if(!exist){
        res.json({errMessage:"این خرید وجود ندارد !"})
      }
 
      if(exist){
      await Sells.findOneAndRemove(filter)
     res.json({Message:" خرید حذف شد !"});
    }

    }catch(err){
      console.log(err)
    }
 
 })


 module.exports = sellRouter