const User = require('../models/userModel')
const ErrorHandler = require ('../utils/errorhandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const sendToken = require('../utils/jwtTokenSend');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const cloudinary = require('cloudinary')



// register/create a user
exports.registerUser = catchAsyncErrors(async(req,res)=>{
    if(req.body.avatar){

    
    const myCloud = await cloudinary.uploader.upload(req.body.avatar,{
        folder : "avatars", // iss folder mien upload krni h
        width : 150,
        crop : "scale",
      
    })
    
    const {name,email,password} = req.body
    const user = await User.create({name,email,password,avatar :{
        public_id: myCloud.public_id,
        url : myCloud.secure_url
    }})
    sendToken(user,201,res)

}
else{
    const {name,email,password} = req.body
    const user = await User.create({name,email,password})

    sendToken(user,201,res)
}

})

// login a user
exports.loginUser = catchAsyncErrors(async(req,res,next)=>{
    const {email,password} = req.body

    if(!email || !password){  // agar email and password ni mila to(koi bhi empty hai toh)
        return next(new ErrorHandler("please enter email and password",401)) 
    }
    const user = await User.findOne({email}).select('+password')
    // we ccanot find password direcltly as we have mentioned in userSchema password as select : false
    if(!user){
        return next(new ErrorHandler("user doesnot exist",401)) 

    }
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){

        return next(new ErrorHandler("invalid email or password",401)) 

    }
    // console.log(isPasswordMatched)
    // wrna whi JWT token generate and send krdo
    sendToken(user,201,res)

    

})

// logout a user 
exports.logoutUser = catchAsyncErrors(async(req, res, next)=>{
       res.cookie('token',null,{
        httpOnly:true,
        expires : new Date(Date.now())  // mtlb abhi ke abhi expire ho jaye cooki
       })
   
    res.status(200).json({success:true,message:'Logged out successfully'})
})

//Forgot Password
exports.forgotPassword = catchAsyncErrors(async(req, res, next)=>{
    const user = await User.findOne({email: req.body.email})
    if(!user) {
        return next(new ErrorHandler("User not found ",404)) 
    }

    // get resetPasswordToken
    const resetToken= await user.getResetPasswordToken()
    await user.save({validateBeforeSave:false}) // qunki abhi tak save ni hua tha khaali add hua tha(resettoken wala)

    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`
    // const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`
    // jo reset token bhejaa hai wo gya hai req.protocol pe and backend ka get host 4000 hai but hum frontend chla rhein 3000 par so temporary givinig it process.env.FRONTEND_URL

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`

    
    try {
        await sendEmail({
            email: user.email,
            subject: `Ecommerce Email Recovery`,
            message
        })

        res.status(200).json({success: true, message:`email sent successfully to ${user.email}`})
        
    } catch (error) {  // kisi kaaranwash ni ho paaya toh
        user.resetPasswordToken = undefined  // jalldi se jladi krna hoga
        user.resetPasswordExpire = undefined
        await user.save({validateBeforeSave:false})  // dobara save
        return next(new ErrorHandler(error.message,401)) 

        
    }
})


//Reset Password
exports.resetPassword = catchAsyncErrors(async(req, res, next)=>{
    // creating token hash
   const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

   const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire :{$gt : Date.now()}  // greatter than hi hona cahyie ,abhi time se jyada hi hona caahyie
   })
   if(!user){
    return next(new ErrorHandler("Reset Password token is invalid or has been expired",401)) 

}
if(req.body.password !== req.body.confirmPassword){
    return next(new ErrorHandler("Password doesnot match",401)) 

}
user.password = req.body.password  // now password is changed successfully
user.resetPasswordToken = undefined  
user.resetPasswordExpire = undefined   

await user.save()
sendToken(user,200,res)  // again instant login him now
})

//get User Details -own 
exports.getUserDetails =catchAsyncErrors(async (req, res,next)=>{
    const user = await User.findById(req.user.id)  // jo humney store kr rkhi thi req.user mein
   // no need for !user found coz afc wo logged in toh hoga hi lol
    res.status(201).json({success:true,user})
    
})

//update User password
exports.updatePassword =catchAsyncErrors(async (req, res,next)=>{
    const user = await User.findById(req.user.id).select('+password')
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){

        return next(new ErrorHandler("Old password is incorrect",401)) 

    }
    if(req.body.newPassword!==req.body.confirmPassword){

        return next(new ErrorHandler("confirm password doesnot match",401)) 

    }
    user.password = req.body.newPassword
    await user.save()
    sendToken(user,200,res)
    
})

//update User profile
exports.updateProfile =catchAsyncErrors(async (req, res,next)=>{
    const newUserData = {
        name : req.body.name,
        email: req.body.email

    }

    if(req.body.avatar!=='' && req.body.avatar ){
        const user = await User.findById(req.user.id)
        const imageId = user.avatar.public_id
        await cloudinary.v2.uploader.destroy(imageId) // image destroy krney ka method cloudinary ka
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
          });
      
          newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };

    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData,{
        new: true,
        runValidators: true,
        useFindAndModify: true
    })
    res.status(201).json({success: true, message:'profile updated successfully'})
    
})

//get all user details(admin)
exports.getAllUsers =catchAsyncErrors(async (req, res,next)=>{
    const users = await User.find()  // sabhi users as documents
    res.status(201).json({success: true, users})
    
})

//get single user details(admin)
exports.getSingleUser =catchAsyncErrors(async (req, res,next)=>{
    const user= await User.findById(req.params.id) 
    if(!user) {
        return next(new ErrorHandler("user not found",404)) 

    } 
    res.status(201).json({success: true, user})
    
})

//update User role(admin)
exports.updateRole =catchAsyncErrors(async (req, res,next)=>{
    const newUserData = {
        name : req.body.name,
        email: req.body.email,
        role: req.body.role
    }
    let user = await User.findById(req.params.id)
    if(!user) {
        return next(new ErrorHandler("user not found",404)) 

    }
     user = await User.findByIdAndUpdate(req.params.id, newUserData,{
        new: true,
        runValidators: true,
        useFindAndModify: true
    })
    res.status(201).json({success: true, message:'role updated successfully'})
    
})

//delete User(admin)
exports.deleteUser =catchAsyncErrors(async (req, res,next)=>{
   
    let user = await User.findById(req.params.id)
    if(!user) {
        return next(new ErrorHandler("user not found",404)) 

    }
    
    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);
    await User.findByIdAndDelete(req.params.id)  /// req.user.id krdega toh khud ko delte krdega lol
    res.status(201).json({success: true, message:'user deleted successfully'})
    
})