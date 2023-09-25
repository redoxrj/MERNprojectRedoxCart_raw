const Order = require('../models/orderModel')
const ErrorHandler = require ('../utils/errorhandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Product = require('../models/productModel')   // Product bhi cahyie afc for reference



// create a new order

exports.newOrder = catchAsyncErrors(async(req,res,next)=>{
    const {shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice} = req.body

    const order = await Order.create({shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice,paidAt: Date.now(),user: req.user._id}) // afc wo user logged in hai uski ka order

    res.status(201).json({success: true, order})

});

// get Single order details 

exports.getSingleOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate('user', 'name email') // user wali field populate krney se ab wo user ki collection/db mien jaake same user id waein ki name or email info laa  ke dedega wo bhi additionally(populate)

    if(!order) {
        return next(new ErrorHandler('Order not found for this id',404))
    }

    res.status(201).json({success: true, order})

});

// get logged in user all order details

exports.myOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders = await Order.find({user: req.user._id}) // total Order db mein jo bhi user fiield mein agar loggend in user ki id match hojaati hai mtlb usiki order hai or usey filter/find krke dedo | if nothing found it will return an empty array
    if(orders.length===0) {
        return next(new ErrorHandler('No Orders yet please make now',404))
    }

    res.status(201).json({success: true, orders})

});

// get all orders details (admin only)

exports.getAllOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders = await Order.find() 
    if(orders.length===0) {
        return next(new ErrorHandler('No Orders made yet by users',404))
    }
    let totalAmount = 0  // all orders total amount sum (total ka total) like we did avg before
    orders.forEach((order)=>{
        totalAmount += order.totalPrice
    })

    res.status(201).json({success: true, orders,totalAmount});

});

// update order status (admin only)

exports.updateOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id) 
    if(!order) {
        return next(new ErrorHandler('Order not found for this id',404))
    }
    if(order.orderStatus==='Delivered'){
        return next(new ErrorHandler('Already Delivered',400))

    }
    if(req.body.status==='Shipped'){
        order.orderItems.forEach(async(order)=>{
            await updateStock(order.product, order.quantity)
        })
    }
    order.orderStatus = req.body.status  // us order ka status ye set krdo jobhi body mein dengey
    if(req.body.status==='Delivered'){
        order.deliveredAt = Date.now()
    }
    await order.save({validateBeforeSave: false})
    res.status(201).json({success:true, message:'order status updated successfully'})

});

async function updateStock(id, quantity) {
    const product = await Product.findById(id)
    product.stock -= quantity
    await product.save({validateBeforeSave: false})

}

// delete a order details (admin only)

exports.deleteOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id) 
    if(!order) {
        return next(new ErrorHandler('Order not found for this id',404))
    }
    await Order.findByIdAndDelete(req.params.id)

    res.status(201).json({success: true, message:'Order deleted successfully'});

});