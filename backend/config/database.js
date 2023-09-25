const mongoose = require('mongoose');

// const mongoURI =process.env.DB_URI;

const connectToMongo =async ()=>{
    await mongoose.connect(process.env.DB_URI).then(()=>{

        console.log('connnected to mongoose successfully')
    })
   
}

module.exports = connectToMongo