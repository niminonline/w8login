
const { validationResult } = require("express-validator");
const User= require("../models/userModel");
const bcrypt= require("bcrypt");



//=====================Registration page Load=======================

const loadRegister =(req,res)=>{
    try{
        console.log("register page");
        res.render("registration");
    }
    catch(error){
        console.log(error.message)
    }


}
//==========================Register User=====================
const securePassword= async(password)=>{
    try{
        const passwordHash= await bcrypt.hash(password,10);
       return  await bcrypt.hash(password,10);
    }
    catch(error){
        console.log(error.message)
    }
}


const insertUser= async(req,res)=>{
    try{


        const valErrors= validationResult(req);
        if(!valErrors.isEmpty()){
        //   const errors= valError.array();
          console.log(valErrors);
           //    res.status(400).json({valError:errors})
             res.render("registration",{errors:valErrors.array()})

        }
        else{
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


//===============Verify Login===================

const isEmailExist = async(enteredEmail)=>{
    const emailFound= await User.findOne({email:enteredEmail});
    //console.log(emailFound);
    if(emailFound){
        return true;
    }
    else
    return false;
}

const isMoreEmailExist=async (enteredEmail)=>{
    const emailCount = await User.find({email:enteredEmail}).count();
    console.log("email count"+ emailCount);
    if (emailCount>1)
    return true;
    else
    return false;


}

const verifyLogin = async(req,res)=>{
    try{
        
       const email= req.body.email;
       const password= req.body.password;
       const userData= await User.findOne({email:email});
       if(userData){
       const passwordMatch= await bcrypt.compare(password,userData.password);

       if(passwordMatch){
        req.session.user_id= userData._id;
        console.log("SessionID2:"+req.session.user_id);
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
//=====================User Home Page===================

const loadHome= async (req,res)=>{
    const userData= await User.findOne({_id: req.session.user_id});
            
    try{
        res.render("home",{userDetails:userData});
    }
    catch(err){
        console.log(err.message);
    }
}

//=====================Logout==============================

const userLogout = async(req,res,next)=>{
    try{
        delete req.session.user_id
        // req.session.destroy();
        res.redirect("/"); 
        
    }
    
    catch(err){
        console.log(err.message);
    }
}

//===========================Edit Profile=================//


const editProfile= async(req,res)=>{

    try{
            const id= req.query.id;
            const userData= await User.findById({_id:id});

        if(userData){
           res.render("edit",{data:{user:userData,errors:[]}})
        }
        else{
            res.redirect("/home")
        }
    }
    catch(err){
        console.log(err.message);
    }
}
//=========================Update profile===============//



const update = async(req,res)=>{


    try{

        const id= req.body.user_id;
            const userData= await User.findById({_id:id});

        const errors= validationResult(req);
        if(!errors.isEmpty()){
            console.log(errors);
            res.render("edit",{data:{user:userData,errors:errors.array()}});
    
        }
        else{
        if(req.file){
            const userdate=  await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name: req.body.name,email: req.body.email,mobile:req.body.mobile,image:req.file.filename }})
        }    
        else
        {
            const userdate=  await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name: req.body.name,email: req.body.email,mobile:req.body.mobile }})
        }
        res.redirect("/home")
    }
}
    catch(err){
        console.log(err.message);
    }

}
//===================Load Change password Page================================//
const loadChangePassword= async(req,res)=>{

    try{
        const message="";
        const id=req.query.id;
       res.render("changepassword",{data:{_id:id,message:""}});
    }
    catch(err){
        console.log(err.message);
    }
}

//=================== Change password ================================//
const changePassword= async(req,res)=>{
    try{
        const id= req.body.id;
        const oldPassword= req.body.oldPassword;
        const newPassword= req.body.newPassword;
        const confirmPassword= req.body.confirmPassword;

        const userData= await User.findOne({_id:id});
        console.log(userData);
        if(userData){
            console.log("stored pass "+ userData.password);
            if( await bcrypt.compare(oldPassword,userData.password)){
                if(newPassword===confirmPassword){
                  
                    const secPassword= await bcrypt.hash(newPassword,10);
                    if(secPassword){
                        await User.updateOne({_id:id},{$set:{password:secPassword}});
                        res.redirect("home");
                    }
                    else{
                    res.render("changepassword",{data:{_id:id,message:"Password updation failed"}});
                    }
                }
                else{
                    res.render("changepassword",{data:{_id:id,message:"New password and confirm password doesn't match"}});
                }
                
            }
            res.render("changepassword",{data:{_id:id,message:"Old password is wrong"}});
        }
        res.render("changepassword",{data:{_id:id,message:"db fetch failed"}});
    }
    catch(err){
        console.log(err.message);
    }
}



module.exports= { loadRegister, insertUser,loginLoad,verifyLogin,loadHome,userLogout,editProfile,update,
                  loadChangePassword,changePassword,isEmailExist,isMoreEmailExist}
