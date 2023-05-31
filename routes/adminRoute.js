const express = require('express');
const admin_route= express();
const session =require("express-session");
const config= require("../config/config");
const bodyParser=require("body-parser")
const adminController= require("../controllers/adminController")
const auth= require("../middleware/auth");
const {body,validationResult}= require("express-validator");
const path= require("path");    
const validator= require("../middleware/validator")



admin_route.use(express.static("public"));
admin_route.use(bodyParser.urlencoded({extended:true}));
admin_route.use(session({secret:config.sessionSecret,resave:false,saveUninitialized:false}));

admin_route.set("view engine","ejs");
admin_route.set("views","views/admin");


const multer= require("multer");
const storage= multer.diskStorage({destination:(req,file,cb)=>{cb(null,path.join(__dirname,'../public/userImages'))},
                                    filename:(req,file,cb)=>{
                                        const name=Date.now()+'-'+file.originalname;
                                        cb(null, name);
                                    }});
const upload=multer({storage:storage});

admin_route.get("/",auth.isAdminLogin, adminController.adminLogin)
admin_route.get("/login",auth.isAdminLogin, adminController.adminLogin)
admin_route.get("/home",auth.isAdminLogout,adminController.adminDashboard)
admin_route.post("/login",adminController.verifyLogin)
admin_route.get("/logout",adminController.logout)
admin_route.get("/adduser",auth.isAdminLogout,adminController.loadAddUser)
admin_route.post("/adduser",upload.single("image"),
[
    body("name").trim()
    .matches(/^[A-Za-z\s]+$/).withMessage("Username cannot contain invalid characters")
    .isLength({min:3}).withMessage('Name must contain atleat 3 characters'),
    body("email","Invalid email address")
    .trim()
    .normalizeEmail({gmail_remove_dots:false})
    .isEmail()
    .custom(async(value)=>{
        const result=await  validator.isEmailExist(value)
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
    .isLength({min:10,max:10}).withMessage('Mobile number must contain 10 digits'),
    body("password")
    .isLength({min:8}).withMessage("Password must contain atleat 8 characters")
    .custom((value,{req})=>{
        if(value!==req.body.confirmpassword){
            throw new Error("Passwords do not match");
        }
        return true;
    })
],adminController.addUser)
admin_route.get("/removeuser",auth.isAdminLogout,adminController.removeUser)
admin_route.get("/useredit",auth.isAdminLogout,adminController.loadEdit);
admin_route.post("/useredit",[
    body("name").trim()
    .matches(/^[A-Za-z\s]+$/).withMessage("Username cannot contain invalid characters")
    .isLength({min:3}).withMessage('Name must contain atleat 3 characters'),
    body("email","Invalid email address")
    .trim()
    .normalizeEmail({gmail_remove_dots:false})
    .isEmail()
    .custom(async (value,{req})=>{
        const result= await validator.isDuplicateEmail(req);
        console.log("More email?  ="+result);
        if(result){
            throw Error("Entered email already exist")}
            else
            return true;
    }) 
    ,
    body("mobile")
    .trim()
    .isNumeric().withMessage('Mobile number contains invalid characters')
    .isLength({min:10,max:10}).withMessage('Mobile number must contain 10 digits')


],adminController.updateUser);


// admin_route.get("*",(req,res)=>{
//     res.redirect("/admin");
// })
module.exports= admin_route;

