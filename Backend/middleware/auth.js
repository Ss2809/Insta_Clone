const jwt = require("jsonwebtoken")

const authmiddleware = (req,res,next)=>{
    const authorization = req.headers.authorization
   if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token not provided!" });
  }

   try
   { const token = authorization.split(" ")[1];
    const decoder =  jwt.verify(token, process.env.Access_key)
    req.user = decoder
    next();
  }
    catch(err){
      console.log(err)
      return res.status(403).json({message:"Invalid Token"})
    }
}

module.exports = authmiddleware