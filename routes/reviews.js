const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")
const Campground = require("../models/campground")
const {reviewSchema} = require("../schemas")
const Review = require("../models/review")
const reviews = require('../controllers/reviews')

const validationReview = (req,res,next) => {
    const result = reviewSchema.validate(req.body)
    if(result.error) {
        const msg = result.error.details.map(detail => detail.message).join(", ")
    throw new ExpressError(msg,400)
    }
    next()
}


// キャンプ場のレビュー登録
router.post("/",validationReview,  catchAsync( reviews.createReview))

// キャンプ場のレビュー削除
router.delete("/:reviewId", catchAsync (reviews.deleteReview))


module.exports = router