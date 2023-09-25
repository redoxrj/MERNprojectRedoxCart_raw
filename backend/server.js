const app = require('./app') 
const connectToMongo = require('./config/database')
// const cloudinary = require('cloudinary')
const cloudinary = require('cloudinary');
//Config
if (process.env.NODE_ENV !== "PRODUCTION") {
require("dotenv").config({path: 'backend/config/config.env'})
}

connectToMongo();

cloudinary.v2.config({
  cloud_name : process.env.CLOUDINARY_NAME,
  api_key : process.env.API_KEY,
  api_secret : process.env.API_SECRET,
  secure: true,
})



const server= app.listen(process.env.PORT, () => {
  console.log(`server running on http://localhost:${process.env.PORT}`)
})


// handling uncaught exceptions  --> always written at the top
process.on("uncaughtException",(err)=>{
  console.log(`Error: ${err.message}`)
  console.log(`Shutting down the server due to uncaught exceptions `)
 
  server.close(()=>{  
   process.exit(1)
  })
 
})
  // console.log(yoyo) // --> this will produce uncaught error/exception






// Unhandled Promise rejections  -- kisi ne let sey string mien chedkhani kridiho mongo uri ki
process.on("unhandledRejection",(err)=>{
  console.log(`Error: ${err.message}`)
  console.log(`Shutting down the server due to unhandled  promise rejection`)
 
  server.close(()=>{  // taaki bestie na ho
   process.exit(1)
  })
  // now also no need to cath eroor in mongodb db connect promise
  // ctach se whi handleed ho jarha thaa 
})

