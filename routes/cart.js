const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { verifyToken, verifyTokenAndAuthorizarion, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

//add cart
router.post("/", verifyToken, async (req, res) => {
  const owner = req.user.id;
  const { itemId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ owner });
    const item = await Product.findOne({ _id: itemId });

    if (!item) {
      res.status(404).send({ message: "item not found" });
      return;
    }
    const price = item.price;
    const name = item.title;
    //If cart already exists for user,
    if (cart) {
      const itemIndex = cart.items.findIndex((item) => item.itemId == itemId);
      //check if product exists or not

      if (itemIndex > -1) {
        let product = cart.items[itemIndex];
        product.quantity += quantity;

        cart.bill = cart.items.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0)

        cart.items[itemIndex] = product;
        await cart.save();
        res.status(200).send(cart);
      } else {
        cart.items.push({ itemId, name, quantity, price });
        cart.bill = cart.items.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0)

        await cart.save();
        res.status(200).send(cart);
      }
    } else {
      //no cart exists, create one
      const newCart = await Cart.create({
        owner,
        items: [{ itemId, name, quantity, price }],
        bill: quantity * price,
      });
      return res.status(201).send(newCart);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
});

//delete item in cart

router.delete("/", verifyToken, async (req, res) => {
  const owner = req.user.id;
  const itemId = req.query.itemId;
  try {
    let cart = await Cart.findOne({ owner });

    const itemIndex = cart.items.findIndex((item) => item.itemId == itemId);

    if (itemIndex > -1) {
      let item = cart.items[itemIndex];
      cart.bill -= item.quantity * item.price;
      if (cart.bill < 0) {
        cart.bill = 0
      }
      cart.items.splice(itemIndex, 1);
      cart.bill = cart.items.reduce((acc, curr) => {
        return acc + curr.quantity * curr.price;
      }, 0)
      cart = await cart.save();

      res.status(200).send(cart);
    } else {
      res.status(404).send("item not found");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send();
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

router.get("/find/", verifyToken, async (req, res) => {
  const owner = req.user.id;

  try {
    const cart = await Cart.findOne({ userId: owner });
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