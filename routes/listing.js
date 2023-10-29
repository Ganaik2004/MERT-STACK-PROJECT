const express =  require('express');
const router = express.Router();
const wrapAsync =require("../utils/wrapAsync.js");
// const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validatelistings} = require("../middleware.js")
const listingController = require("../controller/listings.js")
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});
router.route("/").get(wrapAsync(listingController.index)).post(isLoggedIn,upload.single("listing[image]"),validatelistings,wrapAsync(listingController.rendercreaterout)
)
// New Rout
router.get("/new",isLoggedIn,listingController.rendernewform)
router.route("/:id").get(wrapAsync( listingController.rendershowrout)).put(isLoggedIn,isOwner,upload.single("listing[image]"),validatelistings,wrapAsync(listingController.renderupdaterout )).delete(isLoggedIn,isOwner,wrapAsync( listingController.renderdeleterout));
// Edit Rout
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.rendereditrout ));
module.exports = router;