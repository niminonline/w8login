
const isLogin= async(req,res,next)=>{
    try{
        if(req.session.user_id){
            
            res.redirect("/home");
        }
        else
        next();
    }
    catch(err){
        console.log(err.message);
    }
}
const isLogout= async(req,res,next)=>{
    try{

        if(!req.session.user_id){
            res.redirect("/");
        }
        else
        next();
    }
    catch(err){
        console.log(err.message);
    }
}


const isAdminLogin= async(req,res,next)=>{
    try{
        if(req.session.admin_id){
            res.redirect("/admin/home");
        }
        else
        next();
    }
    catch(err){
        console.log(err.message);
    }
}
const isAdminLogout= async(req,res,next)=>{
    try{

        if(!req.session.admin_id){
            res.redirect("/admin");
        }
        else
        next();
    }
    catch(err){
        console.log(err.message);
    }
}



module.exports={isLogin,isLogout,isAdminLogin,isAdminLogout}