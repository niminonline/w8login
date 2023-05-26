const User= require("../models/userModel");
const bcrypt= require("bcrypt");

//==================Admin Login Page==================
const adminLogin = async(req,res)=>{

    try{
        res.render("login");

    }
    catch(err){
        console.log(err.message);

    }

}
//==========================VerifyLogin===================
const verifyLogin = async(req,res)=>{

    try{
        const email= req.body.email;
        const password=req.body.password;
        const adminData= await User.findOne({email:email});
        if(adminData){
            const passwordMatch = await bcrypt.compare(password,adminData.password);
            if(passwordMatch){

                if(adminData.isAdmin===0){
                    res.render("login",{message: "Invalid Credentials"})
                }
                else{
                    req.session.user_id= adminData._id;
                    res.redirect("/admin/home");
                }
            }
            else
            {
                res.render("login",{message: "Invalid Password"})
            }
        }
        else{
            res.render("login",{message: "Invalid Credentials"})
        }
    }
    catch(err){
        console.log(err.message);

    }

}
//============================Admin Dashboard=========================//

const adminDashboard= async(req,res)=>{

    try{
        res.render("home");
    }
    catch(err){
        console.log(err.message);
    }
}

//==========================Logout======================================//

const logout = async(req,res)=>{
    try{
        req.session.destroy();
        res.redirect("/admin");

    }

    catch(err){
        console.log(err.message);
    }
}

module.exports= {adminLogin, verifyLogin,adminDashboard, logout}