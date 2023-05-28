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
                    req.session.admin_id= adminData._id;
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
        let search='';
        if(req.query.search){
            search= req.query.search;

        }
        const userData= await User.find({
            isAdmin:0,
            $or:[
                {name:{$regex:".*"+search+".*",$options:"i"}},
                {email:{$regex:".*"+search+".*",$options:"i"}},
                {mobile:{$regex:".*"+search+".*",$options:"i"}},
            ]
        });
        res.render("home",{userData:userData});
        
    }
    catch(err){
        console.log(err.message);
    }
}

//======================================Logout======================================//

const logout = async(req,res)=>{
    try{
        delete req.session.admin_id;
        // req.session.destroy();
        res.redirect("/admin");

    }

    catch(err){
        console.log(err.message);
    }
}
//===================================Add User============================//

const loadAddUser = async(req,res)=>{

    try{

        res.render("adduser");
    }
    catch(err){
        console.log(err.message);
    }

}

const addUser= async(req,res)=>{
    try{
        const secPassword= await bcrypt.hash(req.body.password,10);
        const name=req.body.name;
        const email=req.body.email;
        const mobile=req.body.mobile;
        const password=secPassword;
        const useOne= new User({name:name,email:email,mobile:mobile,password:password});
        
       const opUserAdd= await useOne.save();
        if(opUserAdd)
        {
         
       res.redirect("/admin/home");}
       else
       res.render("adduser",{message:"User add failed"})

    }
    catch(err){
        console.log(err.message);
    }
}
//============================Remove User===============================
const removeUser= async(req,res)=>{
    try{
        const id= req.query.id;
        await User.deleteOne({_id:id});
        res.redirect("/admin/home");
       
    }
    catch(err){
        console.log(err.message);
    }
}
//=================================Load Edit Page========================
const loadEdit= async(req,res)=>{
    try{
        const id= req.query.id;
        message="";
        const userData= await  User.findOne({_id:id});
                
        res.render("useredit",{userData:userData});
       
        }
    
    catch(err){
        console.log(err.message);
    }
}
//=======================================Update User=============================
const updateUser= async (req,res)=>{

    try{
        const id=req.body.id;
        const name=req.body.name;
        const email= req.body.email;
        const mobile= req.body.mobile;

        await User.updateOne({_id:id},{$set:{name:name,email:email,mobile:mobile}})
        res.redirect("/admin/home")
    }
    catch(err){
        console.log(err.message);
    }
}


module.exports= {adminLogin, verifyLogin,adminDashboard, logout,loadAddUser,addUser,removeUser,loadEdit,updateUser}