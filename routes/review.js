const express =  require('express');
const router = express.Router({mergeParams:true});
// const Listing = require("../models/listing.js");
const wrapAsync =require("../utils/wrapAsync.js");
// const Review = require("../models/reviews.js");
const {validatereview, isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controller/reviews.js");
// Reviews Rout
router.post("/",isLoggedIn, validatereview,wrapAsync(reviewController.renderreviews ));
   // Delete Review rout 
   router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.renderdeletereviews)
   );
   module.exports = router;