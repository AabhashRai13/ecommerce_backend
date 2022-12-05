const Cart = require("../models/Cart");
const {verifyToken, verifyTokenAndAuthorizarion, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();


//Create Cart

router.post("/", verifyToken, async (req, res) => {
    const newCart = new Cart(req.body)
    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (error) {
        res.status(500).json(error);

    }
});

//update Cart
router.put("/:userId/:id", verifyTokenAndAuthorizarion, async (req, res) => {

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

router.delete("/:userId/:id", verifyTokenAndAuthorizarion, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted....")
    }
    catch (err) {
        res.status(500).json(err)
    }
});

//GET user Cart

router.get("/find/:userId",verifyTokenAndAuthorizarion, async (req, res) => {
    console.log(`request parameters ${req.params.userId}`)

    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        res.status(200).json(cart);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

//GET all Cart

router.get("/", verifyTokenAndAdmin, async (req, res) => {

    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    }
    catch (err) {
        res.status(500).json(err)
    }
});


module.exports = router