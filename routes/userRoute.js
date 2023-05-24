const express = require("express");
const user_route= express();
const bodyParser= require("body-parser")
const multer= require("multer");
const path= require("path");
user_route.set("view engine","ejs");
user_route.set("views",__dirname+"/../views/users/");
user_route.use(bodyParser.urlencoded({extended:true}))
const userController = require("../controllers/userController");
const { model } = require("mongoose");
const config= require("../config/config");
const session = require("express-session");


const storage= multer.diskStorage({destination:(req,file,cb)=>{cb(null,path.join(__dirname,'../public/userImages'))},
                                    filename:(req,file,cb)=>{
                                        const name=Date.now()+'-'+file.originalname;
                                        cb(null, name);
                                    }});

const upload=multer({storage:storage});
user_route.get("/register", userController.loadRegister);
user_route.post("/register", upload.single("image"),userController.insertUser);
user_route.get("/login", userController.loginLoad);
user_route.get("/", userController.loginLoad);
user_route.post("/login", userController.verifyLogin);
user_route.get("/home", userController.loadHome);

module.exports= user_route;

