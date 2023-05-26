const express = require("express");
const user_route= express();
const bodyParser= require("body-parser")
const multer= require("multer");
const path= require("path");
user_route.set("view engine","ejs");
user_route.set("views",__dirname+"/../views/users/");
user_route.use(bodyParser.urlencoded({extended:true}))
user_route.use(express.static("public"));
const userController = require("../controllers/userController");
const { model } = require("mongoose");
const config= require("../config/config");
const session = require("express-session");
user_route.use(session({secret:config.sessionSecret,resave:false,saveUninitialized:false}));
const auth= require("../middleware/auth");


const storage= multer.diskStorage({destination:(req,file,cb)=>{cb(null,path.join(__dirname,'../public/userImages'))},
                                    filename:(req,file,cb)=>{
                                        const name=Date.now()+'-'+file.originalname;
                                        cb(null, name);
                                    }});

const upload=multer({storage:storage});
user_route.get("/register", auth.isLogin, userController.loadRegister);
user_route.post("/register", upload.single("image"),userController.insertUser);
user_route.get("/login", auth.isLogin, userController.loginLoad);
user_route.get("/", auth.isLogin,userController.loginLoad);
user_route.post("/login", userController.verifyLogin);
user_route.get("/home",auth.isLogout, userController.loadHome);
user_route.get("/logout",auth.isLogout, userController.userLogout);
user_route.get("/edit",auth.isLogout, userController.editProfile);
user_route.post("/edit",upload.single("image"), userController.update);

module.exports= user_route;

