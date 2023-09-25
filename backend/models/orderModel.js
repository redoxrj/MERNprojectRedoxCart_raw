const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    shippingInfo :{
        address:{
            type: String,
            required: true
        },
        city:{
            type: String,
            required: true
        },
        state:{
            type: String,
            required: true
        },
        country:{
            type: String,
            required: true
        },
        pinCode:{
            type: Number,
            required: true
        },
        phoneNo:{
            type: Number,
            required: true
        }
    },
    orderItems :[
        {
            name:{
                type: String,
                required: true
            },
            price:{
                type: Number,
                required: true
            },
            quantity:{
                type: Number,
                required: true
            },
            image:{
                type: String,
                required: true
            },
            product:{  // jo prodyct order kiya hia uska reference bhi toh hona cahyie kya chiz order ki hai (productId)
                type: mongoose.Schema.ObjectId,
                ref:'Product',
                required: true
            },
        }
    ],
    user:{  // user ka reference jo bhi login baitaha rhega uski id by default ajayegi
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    paymentInfo :{
        id:{
            type: String,
            required: true
        },
        status:{
            type: String,
            required: true
        }
    },
    paidAt:{
        type : Date,
        required: true
    },
    itemsPrice:{
        type : Number,
        required: true,
        default : 0
    },
    taxPrice:{
        type : Number,
        required: true,
        default : 0

    },
    shippingPrice:{
        type : Number,
        required: true,
        default : 0
    },
    totalPrice:{
        type : Number,
        required: true,
        default : 0
    },
    orderStatus:{
        type : String,
        required: true,
        default : 'Processing'
    },
    deliveredAt : Date,
    createdAt : {
        type : Date,
        default: Date.now,   // default time when the order was created usin smay
    }
    
    
})

module.exports = mongoose.model('Order', orderSchema)
