const User = require("../models/user.js");
module.exports.rendersignupget = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.rendersignuppost = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
const newUser = new User({email,username});
 const registedUser = await User.register(newUser,password);
 req.login( registedUser,(err)=>{
    if(err){
       return next(err);
    }
    req.flash("success","Welcome to Wanderlust!")
    res.redirect("/listings");
})

    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup")
    }
}

module.exports.renderloginget = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.renderloginpost = async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust! You are logged in!");
    let redirectUrl =res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}
module.exports.renderlogout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    })
}