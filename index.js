const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");


dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("DB connection successfull");
    app.listen(process.env.PORT 
        || 8000, ()=>{
        console.log("Backend server is running");
    });
    
}).catch((err)=>{
    console.log(err);
});
app.use(express.json());
app.get("/api/test", ()=>{
    console.log("test is successfull");
})
///auth api
app.use("/api/auth", authRoute);
/// user api
app.use("/api/users", userRoute);
// products api
app.use("/api/products", productRoute);
//cart api
app.use("/api/cart", cartRoute);
//order api
app.use("/api/orders", orderRoute);

