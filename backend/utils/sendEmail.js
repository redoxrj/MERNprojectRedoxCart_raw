const nodeMailer = require('nodemailer');

const sendEmail  =async function(options){

    const transporter = nodeMailer.createTransport({
        
        service: process.env.SMPT_SERVICE,
        auth : {  // enter your email and password
            user: process.env.SMPT_MAIL, // simple mail transport protocol
            pass: process.env.SMPT_PASSWORD  // gmail app password
        }
    })

    const mailOptions ={
        from:process.env.SMPT_MAIL,  // ismein whi aayega jo humney emial login kri hai ,uski traf se jaayeg
        to:options.email,
        subject: options.subject,
        text :  options.message
    }

    await transporter.sendMail(mailOptions)
  
}

module.exports =sendEmail