const express= require("express");
const router=express.Router({mergeParams:true});
const wrapAsync= require("../utils/wrapAsync.js")
const ExpressError= require("../utils/ExpressError.js");
const Review = require("../models/review.js");

// const Review= require("../models/review.js")
const Listing = require("../models/listing.js");
const{validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");
const reviewControlller=require("../controllers/reviews.js");

 


  
//reviews route
router.post("/",validateReview,isLoggedIn,wrapAsync(reviewControlller.createReview));
      
    
    // delete review
    router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewControlller.destroyReview));
    module.exports=router;

