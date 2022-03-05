const router = require("express").Router();
const Message = require("../../models/chat/message");
const jwt = require("jsonwebtoken");
const AdminAuth = require("../../Auth/admin");

router.post("/" ,async (req ,res) => {

    const newMessage = new Message(req.body);
    try{
        const saveMessage = await newMessage.save();
        res.json(saveMessage)

    }catch(err){
        res.send(true)
    }

});

router.get("/" ,async (req ,res) => {
    try{
    const cookie = req.cookies.chat;

    if(!cookie) {
        res.json({errMessage:"لطفا ابتدا نام و ایمیل خود را وارد کنید",err:"login"})
    }
    
    if(cookie){
    jwt.verify(cookie , process.env.USERS_JWT_SECRET ,async function(err,decodedToken){
            if(err){   
            } if(decodedToken){
                const {email ,username} = decodedToken;
                const Messages = await Message.find({
                    conversationId:email
                });
                res.json(Messages);
            }
              });
        }

    }catch(err){
     
    }

})

router.get("/Admin" ,AdminAuth ,async (req ,res) => {
    try{
    const Admin = req.cookies.Admin;
    const con = req.params.con;

    if(!Admin) {
        res.json({errMessage:"لطفا ابتدا نام و ایمیل خود را وارد کنید",err:"login"})
    }
    
    if(Admin){
        const verifies = jwt.verify(Admin , process.env.JWT_SECRET )
    
            if(!verifies.email){
                res.json({errMessage:"not verified"})
            }
            if(verifies.email){
                const Messages = await Message.find();
                res.json(Messages);
            }
    
    }

    }catch(err){
     
    }

})

module.exports = router;