const router = require("express").Router();
const User = require("../models/User");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
/// REGISTER
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJs.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),

    });
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser)
        console.log(saveUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Login

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(401).json("Wrong User Name!");
         if(!user )return;
        const hashedPassword = CryptoJs.AES.decrypt(user.password, process.env.PASS_SEC);
        const originalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);
       

        const inputPassword = req.body.password;
      

        originalPassword != inputPassword && 
            res.status(401).json("Wrong Password");

        const accessToken = jwt.sign(
        {
            id: user._id,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SEC,
            {expiresIn:"3d"}
        );
  
        const { password, ...others } = user._doc;  
        if(!user || originalPassword != inputPassword)return;
        res.status(200).json({...others, accessToken});

    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router