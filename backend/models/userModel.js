const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name :{
        type : String,
        required: [true,'Please enter name'],
        maxLength : [30,'name cannot exceed 30 characters'],
        minLength : [4,'name should have at least 4 characters'],
     
    },
    email :{
        type : String,
        required: [true,'Please enter email'],
        unique : true,
        validate : [validator.isEmail,'please enter a valid email'],
     
    },
    password :{
        type : String,
        required: [true,'Please enter password'],
        select : false, // taaki db se fetch krney par dirct show na ho
        minLength : [8,'password must be at least 8 characters'],
     
    },
    avatar :{
        public_id:{
         type : String,
        //  required: true
        },
        url:{
         type : String,
        //  required: true
        }
    },
    role:{
        type : String,
        default : 'user',
    },
    createdAt :{
        type : Date,
        default : Date.now

    },
    resetPasswordToken : String,
    resetPasswordExpire : Date

})
// now this is an event jab bhi user schema save honey wala hoga usessy just pehly kuch kaam krna hai
userSchema.pre('save',async function(next){ //coz this use is not possible in arrow func
    if(!this.isModified('password')){
        next()  // ek trah se neechey wala code skip krdega agar pass modify ni kiya gya hai toh
    }
    this.password = await bcrypt.hash(this.password,10)
    
})

//JWT Token 
userSchema.methods.getJWTToken = function (){
    // jwt sign() requires a desired object (on which based on jwt token will be given) and a signing private key(our own)
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRE
    })
}

//compare password 
userSchema.methods.comparePassword =  async function (userEnteredPassword){
   
   return await bcrypt.compare(userEnteredPassword,this.password)
}

//Generating password reset token
userSchema.methods.getResetPasswordToken = function () {

    //Genrating Token
    const resetToken = crypto.randomBytes(20).toString('hex')

    //Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    // sha256 is an algorithm basically
    this.resetPasswordExpire = Date.now() + 15*60*1000 // 15 min tak generated code valid rehna chayie
    return resetToken
}


module.exports = mongoose.model('User', userSchema)

