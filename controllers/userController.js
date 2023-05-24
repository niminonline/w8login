
const User= require("../models/userModel");
const bcrypt= require("bcrypt");

//=====================Registration=======================
const securePassword= async(password)=>{
    try{
        const passwordHash= await bcrypt.hash(password,10);
       return  await bcrypt.hash(password,10);
    }
    catch(error){
        console.log(error.message)
    }
}
const loadRegister =(req,res)=>{
    try{
        console.log("register page");
        res.render("registration");
    }
    catch(error){
        console.log(error.message)
    }
}

const insertUser= async(req,res)=>{
    try{
        const spassword= await securePassword(req.body.password);
        const user=  new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            password:spassword,
            isAdmin: 0,
            image:req.file.filename
        });
        const userData= await user.save();
        if(userData){
            res.render("registration", {message:"Registration Successfull"});
        }
        else{
            res.render("registration", {message:"Registration Failed"});

        }
    }
    catch(err){
        console.log(err);

    }}
//==============================Login===============================

const loginLoad= async (req,res)=>{

    try{
        
        res.render("login");

    }
    catch(err){
        console.log(err.message);
    }
}

const verifyLogin = async(req,res)=>{
    try{
        
       const email= req.body.email;
       const password= req.body.password;
       const userData= await User.findOne({email:email});

       if(userData){
       const passwordMatch= await bcrypt.compare(password,userData.password);

       if(passwordMatch){
        res.redirect("/home");


       }
       else{
        res.render("login",{message:"Incorrect Password"});
       }

       }
       else{
        res.render("login",{message:"User not found"});
       }

    }
    catch(err){
        console.log(err.message);
    }

}
const loadHome= async (req,res)=>{
   
    try{
        
        res.render("home");
    }
    catch(err){
        console.log(err.message);
    }
}

module.exports= { loadRegister, insertUser,loginLoad,verifyLogin,loadHome}
