const mongoose = require("mongoose");
const express = require("express"); 

mongoose.connect("mongodb://127.0.0.1:27017/ums");
const app= express();

const {noCache} = require("./middleware/routingMW")




//user route
const userRoute=require("./routes/userRoute");
app.use("/",userRoute);

//Admin route
const adminRoute=require("./routes/adminRoute");
app.use("/admin",adminRoute);


app.listen(3000,()=>{console.log("Server is running on port 3000 => http://localhost:3000/")} )




