 /*const Listing=require("./models/listing");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()) {
      req.session.redirectUrl=req.originallUrl
        req.flash("error","you must be logged in to create listing");
         return res.redirect("/login")
       }
       next();
}
module.exports.saveRedirectUrl=(req,res,next) =>{
  if(req.session.redirectUrl) {
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
}
module.exports.isOwner= async(req,res,next) =>{
  
  let {id} = req.params;
let listing= await Listing.findById(id);
if(!listing.owner._id.equals(res.locals.currUser._id))  {
  req.flash("error", "you are not the ower of thus listing!");
   return res.redirect(`/listings/${id}`);

}

next();

} */

const Listing = require("./models/listing");
const Review = require("./models/review");
const{listingSchema,reviewSchema}= require("./schema.js");
const ExpressError= require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create a listing.");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  if (!listing.owner || !listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};
module.exports.validateListing =(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
 if(error){
  let errmsg=error.details.map((el)=>el.message).join(",");
  throw new ExpressError(400,errmsg)
 }else{
  next();
 }
};
module.exports.validateReview =(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
   if(error){
    let errmsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errmsg)
   }else{
    next();
   }
  }
  module.exports.isReviewAuthor = async (req, res, next) => {
    const {id,reviewId } = req.params;
    const review = await Review.findById(reviewId);
  
    if (!review) {
      req.flash("error", "review not found.");
      return res.redirect("/listings");
    }
  
    if (!review.author || !review.author.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the author of this  review!");
      return res.redirect(`/listings/${id}`);
    }
  
    next();
  };