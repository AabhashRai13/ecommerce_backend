const { verifyToken } = require("jsonwebtoken");
const Product = require("../models/Product");
const { verifyTokenAndAuthorizarion, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();


//Create product

router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body)
    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        res.status(500).json(error);
    }
});
//update product
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE

router.delete("/:id", verifyTokenAndAuthorizarion, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted....")
    }
    catch (err) {
        res.status(500).json(err)
    }
});

//GET Product

router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

//GET all Product

router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;

    try {
        let products;
        if(qNew){
            products = await Product.find().sort({createdAt: -1}).limit(5)
        }else if(qCategory){
            products =await Product.find({categories:{
                $in:[qCategory]
            }})
        }else{
           products = await Product.find()  
        }
        res.status(200).json(products);
    }
    catch (err) {
        res.status(500).json(err)
    }
});


module.exports = router

