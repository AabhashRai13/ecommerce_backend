const { verifyToken } = require("jsonwebtoken");
const Cart = require("../models/Cart");
const { verifyTokenAndAuthorizarion, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();


//Create Cart

router.post("/", verifyTokenAndAuthorizarion, async (req, res) => {
    const newCart = new Cart(req.body)
    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (error) {
        res.status(500).json(error);
    }
});
//update Cart
router.put("/:id", verifyTokenAndAuthorizarion, async (req, res) => {

    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE

router.delete("/:id", verifyTokenAndAuthorizarion, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted....")
    }
    catch (err) {
        res.status(500).json(err)
    }
});

//GET user Cart

router.get("/find/:userId", verifyTokenAndAuthorizarion, async (req, res) => {
    try {
        const Cart = await Cart.findOne({ userId: req.params.userId });
        res.status(200).json(cart);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

//GET all Cart

router.get("/", verifyTokenAndAdmin,async (req, res) => {
   

    try {
       const carts= await Cart.find();
        res.status(200).json(carts);
    }
    catch (err) {
        res.status(500).json(err)
    }
});


module.exports = router