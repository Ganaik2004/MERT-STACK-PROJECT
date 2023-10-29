if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const methodOverride =  require("method-override");
const listingsrouts = require("./routes/listing.js");
const reviewsrouts = require("./routes/review.js");
const userrouts = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const dburl = process.env.ATLASDB_URL;
const MongoStore = require('connect-mongo');

// Making Connection with the data base
main().then((result)=>{
    console.log(`Connected to DB ${result}`);
}).catch((error)=>{
 console.log(`${error}`);
})

async function main() {
    await mongoose.connect(dburl);
  }

  app.set("view engine","ejs");
  app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const store = MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})
store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err)
});
const sessionOption = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}
// Home rout


// app.get("/",(req,res)=>{
//     res.send("Hello world");
// })


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use("/listings",listingsrouts);
app.use("/listings/:id/reviews",reviewsrouts);
app.use("/",userrouts)


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})


app.use((err,req,res,next)=>{
    let {status=403,message="Something Went Wrong"} = err;
    res.status(status).render("error.ejs",{message});
})

// Listening the port
const port = 8080;
app.listen(port,()=>{
    console.log("Server starded at port 8080")
})