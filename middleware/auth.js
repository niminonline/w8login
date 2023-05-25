
const isLogin= async(req,res,next)=>{
    try{
        if(req.session.user_id){
            res.redirect("home");
        }
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
        next();
    }
    catch(err){
        console.log(err.message);
    }
}



module.exports={isLogin,isLogout}