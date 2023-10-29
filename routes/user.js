const express =  require('express');
const router = express.Router();
// const User = require("../models/user.js");
const wrapAsync =require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require('../middleware.js');
const userController = require("../controller/users.js");

router.get("/signup",userController.rendersignupget)
router.post("/signup",wrapAsync( userController.rendersignuppost)
);


router.get("/login",userController.renderloginget)
router.post("/login",saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}),userController.renderloginpost
)
router.get("/logout",userController.renderlogout)
module.exports = router;