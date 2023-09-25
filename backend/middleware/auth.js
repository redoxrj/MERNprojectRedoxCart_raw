const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require('../models/userModel')



exports.isAuthenticatedUser = catchAsyncErrors(async (req,res,next)=>{
    const {token} = req.cookies
    // console.log(token)
    if(!token){
        return next(new ErrorHandler('please login to access this resource',401));
    }
    const decodedData = jwt.verify(token,process.env.JWT_SECRET) // here will will get that id object that we used to sign the message to generate jwt token

    req.user = await User.findById(decodedData.id)
    // ismien poora documneant store krlia yaani us user ki all details so we can access it anytime
    next()  // call by function | agle walwein ko chlney do

})
 
exports.authorizeRoles =(...roles)=>{  // ... meeans use of array
    return (req, res,next) => {
        if(!roles.includes(req.user.role)){  // req.user.role = user | here(by default of user schema)
            return next(new ErrorHandler(`Role : ${req.user.role} is not allowed to access this resource`,403));
        // coz we have put/inseted 'admin' in our roles array

        }
        next()  // if admin matches admin | includes then he can proceed

    }

}