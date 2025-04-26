if(process.env.NODE_ENV !="production") {
  require('dotenv').config();
}

console.log(process.env.SECRET);
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");


const dbUrl=process.env.ATLASDB_URL;

const User= require("./models/user.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash=require("connect-flash");
const passport= require("passport");
const LocalStrategy=require("passport-local");
const reviewsRouter = require("./routes/review.js");
const listingRouter=require("./routes/listing.js");
const userRouter= require("./routes/user.js");
// Connect to MongoDB
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("DB Connection Error:", err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

// App Config
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
const store=MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
   secret:process.env.SECRET,
 },
 touchAfter:24 *36,
 });
 store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE",err);
 })
const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie: {
    expires: Date.now() + 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  },
};

// Routes

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});
 

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  
  res.redirect(`/listings/${listing._id}`)
}); 
// 404 Handler
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});


// Error Handling Middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// Start Server
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});