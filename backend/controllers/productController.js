const Product = require('../models/productModel')
const ErrorHandler = require ('../utils/errorhandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ApiFeatures = require('../utils/apifeatures');
const cloudinary = require("cloudinary");

// create a new Product -- only admin access
exports.createProduct = catchAsyncErrors(async(req,res,next)=>{

    let images = [];

    if (typeof req.body.images === "string") { // mtln sirf 1 image aayi
      images.push(req.body.images);
    } else { // if multile images h(images ki)
      images = req.body.images;
    }
  
    const imagesLinks = [];
  
    for (let i = 0; i < images.length; i++) { //jab tak loop khtm ni hota image uplod
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
  
      imagesLinks.push({  // images ke links
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  
    req.body.images = imagesLinks;
    // req.body.user ki value yha se assign krdo wha se deney ki bjaaye
    req.body.user = req.user.id // remember humney user ke login krtey hi save krli this uski info in req.user
    const product = await Product.create(req.body)
    res.status(201).json({success:true,product}) 
 

})

// get/fetch all products 
exports.getAllProducts =catchAsyncErrors(async (req, res,next)=>{
    const resultsPerPage = 8
    const productsCount = await Product.countDocuments()
    // note : Product.find() or Product.find().find() will work same as we set it using ApiFeatures constructor
    const apiFeature=new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultsPerPage)
    // apiFeature.search()   // same as above .search()
    const products = await apiFeature.query
    res.status(200).json({success:true,productsCount,resultsPerPage,products});
    
})

// update a existing Product -- only admin access
exports.updateProduct =catchAsyncErrors(async(req,res,next)=>{
    let product = await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler("Product not found",404)) 
    }

     // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) { // agar images mein kuch mila toh
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) { // delte all previous
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) { // add new ones now
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true,useFindAndModify:false});
    res.status(201).json({success:true,product})

})
// delete a existing Product -- only admin access
exports.deleteProduct =catchAsyncErrors(async(req,res,next)=>{
    let product = await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler("Product not found",404)) 
    }

     // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

    await Product.findByIdAndDelete(req.params.id)
    res.status(201).json({success:true,message : "Product deleted successfully"})

})

// get/fetch a single product  details
exports.getProductDetails =catchAsyncErrors(async (req, res,next)=>{
    let product = await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler("Product not found",404))  // next is call by function basically
    }
    res.status(201).json({success:true,product})
    
})

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find();
  
    res.status(200).json({
      success: true,
      products,
    });
  });


// product review create/update
exports.createProductReview =catchAsyncErrors(async (req, res,next)=>{
    const {rating,comment,productId} = req.body

    const review ={
        user : req.user._id,  // isAuthenticated se aaya req.user as we have stored in it
        name : req.user.name,
        rating : Number(rating),
        comment
    }
    const product = await Product.findById(productId) // specific product selcet hogyi

    const isReviewed = product.reviews.find(rev=>rev.user.toString() === req.user._id.toString())
    // will evaluate true if pehly se review de rkha hoga toh (user id match hojagi)

    if (isReviewed) { // update a existing review for the same product by that user
        product.reviews.forEach((rev) => {
          if (rev.user.toString() === req.user._id.toString())
            (rev.rating = rating), (rev.comment = comment);
        });
      }
    else{  // creating review first time
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length
     
    }

    let avg=0;
    // ye overall product ki ratings hai different property in product schema
    product.reviews.forEach(rev=>{
        avg += rev.rating  // avg = avg + rev.rating
    })
    product.ratings = avg/product.reviews.length

    await product.save({validateBeforeSave: false})
    res.status(201).json({success:true,message:'rating successful'})
    
})

// get all reviews of a product
exports.getProductReviews =catchAsyncErrors(async (req, res,next)=>{

    let product = await Product.findById(req.query.id)

    if(!product){
        return next(new ErrorHandler("Product not found",404))
    }
    res.status(200).json({success:true,reviews: product.reviews})

})

// delete review of a product
exports.deleteReview =catchAsyncErrors(async (req, res,next)=>{

    let product = await Product.findById(req.query.productId)  // product ki id

    if(!product){
        return next(new ErrorHandler("Product not found",404))
    }
    // ismien wo reviews rakh lenegy jo humey cahayie, delte wali ko hta k
    const reviews = product.reviews.filter( rev=>  rev._id.toString()!==req.query.id.toString()) // review ki id query parameter se jo denegy , yhi id dengey jo delte krna hai humey
    let avg = 0;

    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
    const numOfReviews=reviews.length

    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numOfReviews
    },{new: true,runValidators: true,useFindAndModify: false})


    res.status(200).json({success:true,message:'review deleted successfully'})

})