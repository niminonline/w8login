const express = require("express");
const user_route= express();
const bodyParser= require("body-parser")
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
const {check,validationResult}= require("express-validator");


const multer= require("multer");
const storage= multer.diskStorage({destination:(req,file,cb)=>{cb(null,path.join(__dirname,'../public/userImages'))},
                                    filename:(req,file,cb)=>{
                                        const name=Date.now()+'-'+file.originalname;
                                        cb(null, name);
                                    }});
const upload=multer({storage:storage});
user_route.get("/register", auth.isLogin, userController.loadRegister);
user_route.post("/register",[
    check('req.name')
    .isLength({min:3}).withMessage('Name must contain atleat 3 characters')
    .matches(/^[A-Za-z\s]+$/).withMessage('Username cannot contain invalid characters'),
    check('email','Invalid email')
    .isEmail(),
    check('mobile')
    .isNumeric().withMessage('Mobile number contains invalid characters')
    .isLength({min:10,max:10}).withMessage('Invalid phone number')
    


], upload.single("image"),userController.insertUser);
// .islength({min:3}).withMessage("Username should contain atleast 3 characters."),
// .islength(10).withMessage("mobile number must be 10 digits")

user_route.get("/login", auth.isLogin, userController.loginLoad);
user_route.get("/", auth.isLogin,userController.loginLoad);
user_route.post("/login", userController.verifyLogin);
user_route.get("/home",auth.isLogout, userController.loadHome);
user_route.get("/logout",auth.isLogout, userController.userLogout);
user_route.get("/edit",auth.isLogout, userController.editProfile);
user_route.post("/edit",upload.single("image"), userController.update);
user_route.get("/changepassword",auth.isLogout, userController.loadChangePassword);
user_route.post("/changepassword",userController.changePassword);
module.exports= user_route;

