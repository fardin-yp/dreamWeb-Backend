const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const cors = require("cors");
const Sessions = require("./models/session/sessions");
const http = require('http');
const app = express();
const jwt = require('jsonwebtoken')
const cookieparser = require("cookie-parser");
const bodyParser = require("body-parser")
require('dotenv').config();
const session = require('express-session');
const server = http.createServer(app);
const MongoStore = require('connect-mongo');
const multiparty = require('connect-multiparty');
const io = require("socket.io")(server ,{
   cors:{origin:"http://localhost:3000"}
});
const bodyParserErrorHandler = require('express-body-parser-error-handler')

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParserErrorHandler());

   const MuiltiPartyMiddleware = multiparty({uploadDir:"../images"});
   app.use(express.json());
   app.set('trust proxy', 1);

   app.use(express.static("uploads"));
   app.use(cookieparser())
   app.use(cors({
   origin:["https://dream-web.runflare.run/"],
   credentials:true,
   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
   allowedHeaders: ["Content-Type", "Authorization"],
}))

let users = []
let OnlineUsers = []

const addUser = (userId , socketId) => {
   !users.some(res => res.userId === userId) && 
   users.push({userId ,socketId})
}
const removeUser = (socketId) => {
   users = users.filter(user => user.socketId !== socketId)
}
const getUser = (userId) => {
  return users.find(user => user.userId === userId)
}
const addOnlineUsers = (socketId) => {
   !OnlineUsers.some(res => res.socketId === socketId) && 
   OnlineUsers.push({socketId})
}
const removeOnlineUsers = (socketId) => {
   OnlineUsers = OnlineUsers.filter(user => user.socketId !== socketId)
}
// connect user to chat
io.on('connection', (socket) => {
   // take userId socketId from user
   addOnlineUsers(socket.id);

   socket.on("addUser" ,(userId) => {
      if(userId){
         addUser(userId , socket.id);
      }
      io.emit("getUsers" , users);
      io.emit("getOnlineUsers" , OnlineUsers);
   })
   // send and get Message
socket.on("sendMessage" , ({senderId ,receiverId  ,text}) => {
   const user = getUser(receiverId);
if(user !== undefined && user.socketId){
   io.to(user.socketId).emit("getMessage", {
      senderId,
      text
     })
}
  })
  // remove user to chat
socket.on("disconnect" , () => {
   removeUser(socket.id);
   removeOnlineUsers(socket.id);
   io.emit("getUsers" , users);
   io.emit("getOnlineUsers" , OnlineUsers);
})

});

const PORT = process.env.PORT || 27017;

server.listen(PORT ,() => console.log('server connected on 8080'));
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
app.use('/message' ,require('./routes/chat/messages'));
app.use('/conversation' ,require('./routes/chat/conversation'));
app.use('/comment' ,require('./routes/comment'));





   
