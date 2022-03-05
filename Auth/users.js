const jwt = require("jsonwebtoken")

function UsersAuth (req,res ,next) {
    try{
        const token = req.cookies.token;

       if(!token){
        return res.json({errMessage:"برای استفاده از این بخش وارد اکانت خود شوید"})
       } 
       const verified = jwt.verify(token ,process.env.USERS_JWT_SECRET)
       req.user = verified.user;  
       next();
    }catch(err){
       res.json({errMessage:"برای استفاده از این بخش وارد اکانت خود شوید"})
    }
}

module.exports = UsersAuth