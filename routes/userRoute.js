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
const validator = require("../middleware/validator")
const {noCache} = require("../middleware/routingMW")



const multer= require("multer");
const storage= multer.diskStorage({destination:(req,file,cb)=>{cb(null,path.join(__dirname,'../public/userImages'))},
                                    filename:(req,file,cb)=>{
                                        const name=Date.now()+'-'+file.originalname;
                                        cb(null, name);
                                    }});
const upload=multer({storage:storage});

const {body,validationResult}= require("express-validator");
const { error } = require("console");
//========================User Route=============================

user_route.get('/register', auth.isLogin, userController.loadRegister);
user_route.post('/register', upload.single("image"),[
    body("name").trim()
    .matches(/^[A-Za-z\s]+$/).withMessage("Username cannot contain invalid characters")
    .isLength({min:3}).withMessage('Name must contain atleat 3 characters'),
    body("email","Invalid email address")
    .trim()
    .normalizeEmail({gmail_remove_dots:false})
    .isEmail()
    .custom(async(value)=>{
        const result=await validator.isEmailExist(value)
        console.log(result);  
        if(result){
            throw new Error("Email already exists");
        }
        else{
            return true
        }}),
    body("mobile")
    .trim()
    .isNumeric().withMessage('Mobile number contains invalid characters')
    .isLength({min:10,max:10}).withMessage('Mobile number must contain 10 digits')
    .custom(async(value)=>{
        const result=await  validator.isMobileExist(value)
        console.log(result);  
        if(result){
            throw new Error("Mobile number already exists");
        }
        else{

           return true
        }}),
    body("password")
    .isLength({min:8}).withMessage("Password must contain atleat 8 characters")
    .custom((value,{req})=>{
        if(value!==req.body.confirmpassword){
            throw new Error("Passwords do not match");
        }
        return true;
    })


],userController.insertUser);

 
user_route.get("/login", auth.isLogin,noCache, userController.loginLoad);
user_route.get("/",auth.isLogin,noCache,userController.loginLoad);
user_route.post("/login", userController.verifyLogin);
user_route.get("/home", auth.isLogout,noCache, userController.loadHome);
user_route.get("/logout",auth.isLogout, userController.userLogout);
user_route.get("/edit",auth.isLogout, userController.editProfile);
user_route.post("/edit",upload.single("image"),[
    body("name").trim()
    .matches(/^[A-Za-z\s]+$/).withMessage("Username cannot contain invalid characters")
    .isLength({min:3}).withMessage('Name must contain atleat 3 characters'),
    body("email","Invalid email address")
    .trim()
    .normalizeEmail({gmail_remove_dots:false})
    .isEmail()
    .custom(async (value)=>{
        console.log("Duplicate email?  ="+validator.isDuplicateEmail(value));
        if( await userController.isMoreEmailExist(value)){
            throw Error("Entered email already exist")}
            else
            return true;    
    }) ,
    body("mobile")
    .trim()
    .isNumeric().withMessage('Mobile number contains invalid characters')
    .isLength({min:10,max:10}).withMessage('Mobile number must contain 10 digits')
    .custom(async (value,{req})=>{
        const result= await validator.isDuplicateMobile(req);
        console.log("More phone#  ="+result);
        if(result){
            throw Error("Entered Mobile number already exist")}
            else
            return true;
    }) 
]
, userController.update);
user_route.get("/changepassword",auth.isLogout, userController.loadChangePassword);
user_route.post("/changepassword",[
    body("newPassword")
    .isLength({min:8}).withMessage("Password must contain atleat 8 characters")
    .custom((value,{req})=>{
        if(value!==req.body.confirmPassword){
            throw new Error("Passwords do not match");
        }
        return true;
    })

    
],userController.changePassword);
module.exports= user_route;

