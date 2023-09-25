// creating jwt token and saving in cookie(browser)
const sendToken =(user,statusCode,res)=>{
    const token = user.getJWTToken() //-> register krtey hi jwt token generate krdo on the basis of usr id (as we setted it)

    // options for cookie 
    const options ={
        httpOnly: true,
        expires : new Date(   //cookie konsey date par expire honey wali hai/hogi
                Date.now() + process.env.COOKIE_EXPIRE*24*60*60*1000
        // jab se cookie genarate hui hogi + 
        )
    }

    res.status(statusCode).cookie('token', token,options).json({
        success: true,
        user,token
    })
}

module.exports = sendToken;