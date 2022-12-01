const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token

    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err){res.status(403).json("Token is not valid!");} 
            else{
                req.user = user;
                next();
            }
            
        })
    } else {
        return res.status(401).json("You are not authenticated!");
    }
}

const verifyTokenAndAuthorizarion = (req, res, next)=>{
    verifyToken(req,res,()=>{
        console.log(`user id ${req.user.id}`);
        console.log(`param id ${req.params.userId}`);
        if(req.user.id === req.params.userId || req.user.isAdmin){
            next();
        }else{
            res.status(403).json("You are not alowed to do that!");
        }
    })
}

const verifyTokenAndAdmin = (req, res, next)=>{
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next();
        }else{
            res.status(403).json("You are not alowed to do that!");
        }
    })
}
module.exports = {verifyToken,verifyTokenAndAuthorizarion,verifyTokenAndAdmin};
