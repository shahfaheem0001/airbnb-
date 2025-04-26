const express= require("express");
const router=express.Router();
const wrapAsync= require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const mongoose = require("mongoose");
const{isLoggedIn, isOwner, validateListing}= require("../middleware.js")
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });


router.route("/")
.get(wrapAsync(listingController.index))
 .post( upload.single('listing[image]'),isLoggedIn,
  wrapAsync(listingController.createListing) )


 // NEW Route
  router.get("/new", isLoggedIn,listingController.renderNewForm)


  router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));



  
  // EDIT Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

 


module.exports = router; 

  