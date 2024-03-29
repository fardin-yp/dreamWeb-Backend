const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const cors = require("cors");
const Sessions = require("./models/session/sessions");
const https = require("http");
const app = express();
const jwt = require('jsonwebtoken')
const cookieparser = require("cookie-parser");
require('dotenv').config();
const multiparty = require('connect-multiparty');
const bodyParser = require("body-parser")

app.use(cors()); // <---- use cors middleware

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/static'));


   const MuiltiPartyMiddleware = multiparty({uploadDir:"../images"});
   app.use(express.json());

   app.use(express.static("uploads"));
   app.use(cookieparser())


const PORT = process.env.PORT || 27017;

app.listen(PORT ,() => console.log('server connected on 8080'));
mongoose.connect(process.env.MONGODB_URI , {useNewUrlParser:true ,useUnifiedTopology:true} , err => {
   if(err) return console.log(err);
   console.log('mongodb connected')
})

app.get("/session" , async (req ,res ,next) => {
const session = req.cookies.session;
const date_ob = new Date();

let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

const monthName = date_ob.toLocaleString('en-us',{month:'short'})

   try{
      if(!session){

         const token =jwt.sign(
            {
              session:"hello welcome to my site"
            },
            process.env.SESSION_SECRET
            
           );
      
         const newSession = new Sessions({
            session:token,
            day:`${date}/${month}/${year}`,
            month:`${monthName}`,
            year:year
         })
         const save = await newSession.save();
      // send the token
        res.cookie("session", token, {
         httpOnly: true,
         secure:true
       }).send();
      }
      }catch(err){}
   
})

app.post('/upload', MuiltiPartyMiddleware, (req, res) =>{
    
   var TempFile = req.files.upload;
   var TempPathfile = TempFile.path;

  const targetPathUrl = path.join(__dirname,"../public/uploads/"+TempFile.name);

  if(path.extname(TempFile.originalFilename).toLowerCase() === ".png" || ".jpg"){
    
   fs.rename(TempPathfile, targetPathUrl, err =>{

       res.status(200).json({
        uploaded: true,
         url: `/uploads/${TempFile.originalFilename}`
       });

       if(err) return ;
   })
  }
})


app.use('/auth' ,require('./routes/admin/auth'));
app.use('/authentication' ,require('./routes/usersAuth'));
app.use('/allRoutes' ,require('./routes/allRoutes'));
app.use('/adminRoute' ,require('./routes/admin/adminRoute'));
app.use('/comment' ,require('./routes/comment'));
app.use("/sell" ,require("./routes/sells"))





   
