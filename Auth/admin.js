const jwt = require("jsonwebtoken")

function AdminAuth (req ,res ,next) {
    const token = req.cookies.Admin;

    if(!token){
        return res.json({errMessage:"!!! لطفا آرامش ما رو نخراش"})
       } 

    try{
       const verified = jwt.verify(token ,process.env.JWT_SECRET)
       req.Admin = verified.Admin;  
       next();
    }catch(err){
       res.json({errMessage:"برای استفاده از این بخش وارد اکانت خود شوید"})
    }
}

module.exports = AdminAuth