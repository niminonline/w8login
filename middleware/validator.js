const User= require("../models/userModel")

const isEmailExist = async(enteredEmail)=>{
    try{

        const emailFound= await User.findOne({email:enteredEmail});
    if(emailFound){
        return true;
    }
    else
    return false;
    }
    catch(err){
    console.log(err.message);
    }
    }
const isDuplicateEmail=async (req)=>{

    try{
        const userData = await User.findOne({email:req.body.email});
    if(userData){
        console.log("req:"+userData.id.trim()+"db :"+req.body.id.trim());
        if(userData._id != req.body.id){
            return true;
        }
        else{
            return false;
        }
    }
    else{
        return false;
    }

    }
    catch(err){
        console.log(err.message);
    }
}



const isMobileExist = async(enteredMobile)=>{
    try{

        const mobileFound= await User.findOne({mobile:enteredMobile});
    if(mobileFound){
        return true;
    }
    else
    return false;
    }
    catch(err){
    console.log(err.message);
    }
    }
const isDuplicateMobile=async (req)=>{

    try{
        const userData = await User.findOne({mobile:req.body.mobile});
    if(userData){
        console.log("req:"+userData.id.trim()+"db :"+req.body.id.trim());
        if(userData._id != req.body.id){
            return true;
        }
        else{
            return false;
        }
    }
    else{
        return false;
    }

    }
    catch(err){
        console.log(err.message);
    }
}


const isValidationError = async(req)=>{
    try{
        const errors=  validationResult(req);
        if(!errors.isEmpty()){
            return errors.array();
            }
            else
            return false
    }
    catch(err){
        console.log(err.message);
    }
}





const allValidation= ()=>{
    return
    [body("name").trim()
    .matches(/^[A-Za-z\s]+$/).withMessage("Username cannot contain invalid characters")
    .isLength({min:3}).withMessage('Name must contain atleat 3 characters'),
    body("email","Invalid email address")
    .trim()
    .normalizeEmail({gmail_remove_dots:false})
    .isEmail()
    .custom(async(value)=>{
        const result=await userController.isEmailExist(value)
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
    })]
}

const validateNameEmailMobile =()=>{
    return [
        body("name").trim()
    .matches(/^[A-Za-z\s]+$/).withMessage("Username cannot contain invalid characters")
    .isLength({min:3}).withMessage('Name must contain atleat 3 characters'),
    body("email","Invalid email address")
    .trim()
    .normalizeEmail({gmail_remove_dots:false})
    .isEmail()
    .custom(async(value)=>{
        const result=await userController.isEmailExist(value)
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

    ]
}

const validation=()=>{
[



    
]
}

module.exports ={allValidation,validateNameEmailMobile,validation, isEmailExist,isDuplicateEmail,
    isValidationError,isMobileExist,isDuplicateMobile}