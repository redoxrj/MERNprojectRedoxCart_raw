const ErrorHandler = require('../utils/errorhandler')

module.exports =(err,req,res,next)=>{
   err.statusCode = err.statusCode || 500
   err.message = err.message || 'Internal Server Error'

   // to handle wrong mongodb id eroor /CastError say you given string in object id 
   if(err.name === 'CastError'){
      const message = `Resource not found: ${err.path}`
      err= new ErrorHandler(message,400)
   }

   //Mongoose duplicate key error
   if(err.code===11000){
      const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
      err= new ErrorHandler(message,400)

   }
    // wrong JWT error
    if(err.name === 'JsonWebTokenError'){
      const message = `Json Web Token is Invalid,try again`
      err= new ErrorHandler(message,400)
   }
    // expired JWT error
    if(err.name === 'TokenExpiredError'){
      const message = `Json Web Token is Expired,try again`
      err= new ErrorHandler(message,400)
   }

   res.status(err.statusCode).json({
    succcess: false,
    message: err.message,
    message2 : err.stack
   })
}


// we are doing this just for eroor handling by a creatting a func lol so to
// implement DRY principle 