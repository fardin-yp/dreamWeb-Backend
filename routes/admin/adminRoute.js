const AdminRoute = require("express").Router();
const Products = require('../../models/products/products');
const multer = require('multer');
const Article = require("../../models/Articles/Article");
const ExclusiveForm = require("../../models/exclusiveModel/exclusive");
const Questions = require("../../models/questions/question");
const AdminAuth = require("../../Auth/admin");
const Namad = require("../../models/namad");
const Users = require('../../models/userModel');
const Seo = require('../../models/Seo/Seo');
const SeoService = require("../../models/Seo/seoService");
const cache = require('../../cache');
const fs = require("fs")
const Contact = require("../../models/contact");
const Consalting = require("../../models/consalting");
const Exclusive = require("../../models/Exclusive/exclusive");
const Sessions = require("../../models/session/sessions");
const Laws = require("../../models/law/law");
const Links = require("../../models/Links/Links");
const Sells = require("../../models/sells/sells");

const storage = multer.diskStorage({
    destination:(req , file ,callback) => {
       callback(null , '../public/uploads/')
    },
    filename:(req ,file , callback) => {
      callback(null , file.originalname);
    }
  })
  
  const upload = multer({storage:storage})
  

  AdminRoute.post("/product",AdminAuth ,upload.single("image","file") ,async (req , res) => {
    const date = new Date().toLocaleDateString("fa-IR" ,{timeZone:"Asia/Tehran" } );
    
    try {

      const exist = await Products.findOne({name:req.body.name})

      if(exist){
        return res.json({errMessage:"این پروژه وجود دارد !"})
      }

      if(!req.body.name){
       return res.json({errMessage:"نام پروژه الزامیست !"})
      }
      if(!req.body.category){
        return res.json({errMessage:"دسته بندی الزامیست !"})
       }
       if(!req.file){
        return res.json({errMessage:"عکس اصلی پروژه الزامی است !"})
       }


     if(!exist) {
      const newPost = new Products({
        name:req.body.name,
        image:req.file.originalname,
        price:req.body.price,
        off:req.body.off,
        category:req.body.category,
        link:req.body.link,
        Property:req.body.Property,
        description:req.body.description,
        timestamp:date
      })
      const savedPost = await newPost.save();
      res.json({Message:"پست با موفقیت ارسال شد!"})
    }
    }catch(err){
     res.send({errMessage:"پروژه ارسال نشد  !"})
    }
    });


  AdminRoute.post("/article",AdminAuth,upload.single('image') ,async (req, res) => {
      const date = new Date().toLocaleDateString("fa-IR" ,{timeZone:"Asia/Tehran" } )
       
          try {

              const newExclusive = new Article({
                  title:req.body.title,
                  image:req.file && req.file.originalname,
                  info:req.body.info,
                  timestamp:date,
                  views:1,
              })
              const saveEx = await newExclusive.save();
              res.json({Message:"درخواست با موفقیت ارسال شد!"})
          }catch(err){
            res.send(true)
          }
  })

  AdminRoute.put('/ArticleUpdate' ,AdminAuth ,upload.single('image') , async (req ,res) => {
    const {title ,info ,id} = req.body;
    const filter = { _id: id };
    const update = {title:title , image:req.file && req.file.originalname ,info:info }
   try{
     const exist = await Article.findById(id);

     if(!exist){
       res.json({errMessage:"این مقاله وجود ندارد !"})
     }

     if(exist){
     await Article.findOneAndUpdate(filter, update, {
      returnOriginal: false
    });
      res.json({Message:" مقاله آپدیت شد !"});
     }
     }catch(err){
      res.send(true)
     } 
     
   });

   AdminRoute.put('/ProductsUpdate' ,AdminAuth ,upload.single('image') , async (req ,res) => {
    const {name ,Property ,description ,id ,category ,price ,link ,off:off} = req.body;
    const filter = { _id: id };
    const path = "../public/uploads/" + req.body.deleteImage;
    const update = {
      name:name 
      ,Property:Property 
      ,description:description 
      ,image:req.file && req.file.originalname 
      ,category:category 
      ,price:price 
      ,link:link
      ,off:off
    }
   try{
     const exist = await Products.findById(id);

     if(!exist){
       res.json({errMessage:"این پروژه وجود ندارد !"})
     }
    if(exist){
      if(req.file){
        fs.unlink(path , (err) => {
          if(err){
             return
          }
       })
      }
     await Products.findOneAndUpdate(filter, update, {
      returnOriginal: false
    });
      res.json({Message:" پروژه آپدیت شد !"});
     }
     }catch(err){
      res.send(true)
     } 
    
     
   });

  AdminRoute.post("/uploadImage" ,AdminAuth ,upload.single("image"),async (req, res ) => {

        try {
          res.send("upload complete")

        }catch(err){
          res.send("درخواست ارسال نشد لطفا مجدد تلاش کنید!")
        }
})

  AdminRoute.put('/exclusiveForm' ,AdminAuth , async (req ,res) => {

  const form = req.body;

   try{
    await ExclusiveForm.findOneAndUpdate(
      { _id: "61b0ea570295b371fcd454a1" }, 
      { $set: { form: form } }
   )

   res.json({Message:" پروژه آپدیت شد !"});
     
  }catch(err){
    res.send(true)
     } 
  });
  AdminRoute.get('/exclusiveForm' ,AdminAuth , async (req ,res) => {
    try{
      const find = await ExclusiveForm.find();
      res.json(find);
    }catch(err){}
  })
  AdminRoute.get("/info",cache(300) ,AdminAuth ,async (req, res) => {

      try {
        const allArticles = await Article.find();
        const allProducts = await Products.find();
        const allUsers = await Users.find();
        const allSeo = await Seo.find();
        const allSessions = await Sessions.find();
        const laws = await Laws.find()
        const sells = await Sells.find()
      
         res.json({allProducts ,allUsers , allArticles ,allSeo ,allSessions ,laws ,sells})

        }catch(err){
          res.json({errMessage:"درخواست ارسال نشد لطفا مجدد تلاش کنید!"})
        }
});

AdminRoute.post("/questions" ,AdminAuth ,async(req ,res) => {
  try{
    const {question ,answer ,route} = req.body;

    if(!question || !answer || !route){
      return res.json({errMessage:"تمامی فیلد ها الزامی است !"})
    }

   const newQuestions = new Questions({
    question:question,
    answer:answer,
    route:route
   })
   const save = await newQuestions.save();
   res.json({Message:"درخواست شما ارسال شد!!"})
  }catch(err){
   res.json({errMessage:"درخواست ارسال نشد!"})
  }
});
AdminRoute.post('/namad',AdminAuth ,upload.single("image"), async (req ,res) => {

  try{
  const sendPost = new Namad({
     image:req.file.originalname
  })
  
    const savePOst = await sendPost.save()
    res.json("نماد ارسال شد!")
    }catch(err){
      res.send(true)
    } 
  });

  AdminRoute.post('/Seo' ,AdminAuth , async (req ,res) => {
     const {title , route , description ,keywords ,ogSiteName ,ogType ,ogUrl} = req.body;
    try{
      const exist = await Seo.find({route:route});

      if(exist[0]){
        res.json({errMessage:"سئو برای این صفحه وجود دارد !"})
      }

      if(!exist[0]){
        const sendPost = new Seo({
          title,
          route,
          description,
          keywords,
          ogSiteName,
          ogType,
          ogUrl
       })
       
         const savePOst = await sendPost.save()
         res.json({Message:"ارسال شد!"})
      }
      }catch(err){} 
      
    });
    AdminRoute.put('/SeoUpdate' ,AdminAuth , async (req ,res) => {
      const {title , description ,keywords ,ogSiteName ,ogType ,ogUrl ,id} = req.body;
      const filter = { _id: id };
      const update = {title:title , description:description ,keywords:keywords , ogSiteName:ogSiteName ,ogType:ogType , ogUrl:ogUrl}
     try{
       const exist = await Seo.findById(id);

       if(!exist){
         res.json({errMessage:"سئو برای این صفحه وجود ندارد !"})
       }
 
       if(exist){
       await Seo.findOneAndUpdate(filter, update, {
        returnOriginal: false
      });
        res.json({Message:" سئو برای این صفحه آپدیت شد !"});
       }
       }catch(err){
         
       } 
       
     });

     AdminRoute.post('/seoService' ,AdminAuth , async (req ,res) => {
      const {title , price ,payPrice , propertys} = req.body;

     try{
       const post = new SeoService({
         title,
         price,
         payPrice,
         propertys
       });

        const savePost = await post.save()
        res.json({Message:" سرویس سئو ارسال شد !"});
    
       }catch(err){
       } 
       
     });
     AdminRoute.get('/getMessages' ,AdminAuth , async (req,res) => {

      try{
        const Contacts = await Contact.find();
        const Consaltings = await Consalting.find();
        const Exclusives = await Exclusive.find();

        res.json({Contacts ,Consaltings ,Exclusives})
      }catch(err){
        res.json({errMessage:err})
      }

     })
     AdminRoute.put('/delete/:type/:id' ,AdminAuth ,async (req,res) => {

      const type = req.params.type;
      const id = req.params.id;
      const path = "../public/uploads/" + req.body.image;
     try{
      if(type === "product"){
        await Products.findOneAndRemove({_id:id });
       res.json({Message:"پروژه حذف شد !"})
      }
      if(type === "articles"){
        await Article.findOneAndRemove({_id:id });
        res.json({Message:"مقاله حذف شد !"})
      }
      if(req.body.image){
      fs.unlink(path , (err) => {
        if(err){
           return
        }
     })
    }
    }catch(err){

    }
})
AdminRoute.post('/removeComment/:type' ,AdminAuth ,async (req,res) => {
  const type = req.params.type;
  const comments = req.body.newComments;
  const id= req.body.id;

 try{
  if(type === "products"){
    await Products.findOneAndUpdate(
      { _id: id }, 
      { $set: { comments: comments } }
   )
   const Product = await Products.find({_id:id})
  }
  if(type === "articles"){
    await Article.findOneAndUpdate(
      { _id: id }, 
      { $set: { comments: comments } }
   )
   const Article = await Articles.find({_id:id})
  }
}catch(err){
 res.json(err)
}
})
     AdminRoute.post('/deleteMessages' ,AdminAuth , async (req,res) => {
      const type = req.body.type;

      try{
        if(type === "contacts"){
          await Contact.findOneAndRemove({_id:req.body.id });
          const Contacts = await Contact.find();
          res.json({Contacts})
        }
        if(type === "consaltings"){
          await Consalting.findOneAndRemove({_id:req.body.id });
          const Consaltings = await Consalting.find();
          res.json({Consaltings})
        }
        if(type === "exclusives"){
          await Exclusive.findOneAndRemove({_id:req.body.id});
          const Exclusives = await Exclusive.find();
          res.json({Exclusives})
        }

      }catch(err){
      }

     });

     AdminRoute.put("/blockUser/:id", AdminAuth ,async (req ,res) => {

      const id = req.params.id;
      const filter = { _id: id };
      const update = {blocked:true}
    
      try{
          await Users.findOneAndUpdate(filter, update, {
           returnOriginal: false
         });
      res.json("کاربر با موفقیت بلاک شد !");
    
       }catch(err){
        res.json("مشکلی در بلاک کاربر پیش آمده !");
       }
     });

     AdminRoute.post("/laws" ,AdminAuth ,async (req ,res) => {

      const { text } = req.body;
      const update = {text:text};
      try{
        if(!text){
          return res.json({errMessage:"قوانین الزامی است !"})
        }
        const exist = await Laws.find();
        const filter = {_id:"61ed4430e4aef458cb87e594"}

        if(exist.length > 0){

          await Laws.findOneAndUpdate(filter, update, {

            returnOriginal: false
      
            });
           res.json("قوانین ارسال شد")
        }
        if(exist.length === 0){
          const newLaw = new Laws({
            text:text
          })
          const save = newLaw.save();
          res.json("قوانین ارسال شد")
        }

      }catch(err){
        res.json({errMessage:"مشکلی برای ارسال قوانین پیش آمده !"})
      }
      });


       AdminRoute.post('/links' ,AdminAuth , async (req,res) => {

        const { email , instagram ,telegram ,twitter ,phone} = req.body;

        try{
         const exist = await Links.find();
         
         if(!exist || exist.length === 0){
           const newLinks = new Links({
             email:"dream.web.webiste@gmail.com",
             phone:"09905027669",
             instagram:"#",
             telegram:"#",
             twitter:"#"
           })
           const save = await newLinks.save();
           res.json("Links craeted")
         }
        if(exist && exist.lenght > 0){
          const filter = exist._id;
          const update = {email ,phone ,instagram ,telegram ,twitter}
          await Links.findOneAndUpdate(filter, update, {

            returnOriginal: false
      
          });
         res.json("Links Updated !")
         }
        }catch(err){
          res.json("Links didnt created !")
        }
  
       });
       AdminRoute.post('/deleteQuestions' ,AdminAuth , async (req,res) => {
        const { id } = req.body;
        try{
         await Questions.findByIdAndRemove(id);

         res.json({Message:"سوال متد اول حذف شد !"})
  
        }catch(err){
          res.json({errMessage:"متاسفانه سوال حذف نشد !"})
        }
  
       });
       AdminRoute.put("/updateQuestions" ,AdminAuth ,async (req ,res) => {

        const { question ,answer ,route ,id } = req.body;
        const update = {question ,answer ,route };

        try{
          const exist = await Questions.findById(id);
          const filter = {_id:id};

          if(!exist){
           return res.json({errMessage:"این سوال وجود ندارد !"})
          }
  
          if(exist){
  
            await Questions.findOneAndUpdate(filter, update, {
  
              returnOriginal: false
        
              });
             res.json({Message:"سوال آپدیت شد !"})
          }

  
        }catch(err){
          res.json({errMessage:"مشکلی برای آپدیت سوال پیش آمده !"})
        }
        });
    
  
module.exports = AdminRoute