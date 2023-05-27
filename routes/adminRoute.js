const express = require('express');
const admin_route= express();
const session =require("express-session");
const config= require("../config/config");
const bodyParser=require("body-parser")
const adminController= require("../controllers/adminController")
const auth= require("../middleware/auth");

admin_route.set("view engine","ejs");
admin_route.set("views","views/admin");

admin_route.use(bodyParser.urlencoded({extended:true}));
admin_route.use(session({secret:config.sessionSecret,resave:false,saveUninitialized:false}));

admin_route.get("/",auth.isAdminLogin, adminController.adminLogin)
admin_route.get("/login",auth.isAdminLogin, adminController.adminLogin)
admin_route.get("/home",auth.isAdminLogout,adminController.adminDashboard)
admin_route.post("/login",adminController.verifyLogin)
admin_route.get("/logout",adminController.logout)
admin_route.get("/adduser",adminController.loadAddUser)
// admin_route.get("*",(req,res)=>{
//     res.redirect("/admin");
// })
module.exports= admin_route;

