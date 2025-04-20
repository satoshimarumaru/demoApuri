const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")
const Campground = require("../models/campground")
const {reviewSchema} = require("../schemas")
const Review = require("../models/review")

const validationReview = (req,res,next) => {
    const result = reviewSchema.validate(req.body)
    if(result.error) {
        const msg = result.error.details.map(detail => detail.message).join(", ")
    throw new ExpressError(msg,400)
    }
    next()
}


// キャンプ場のレビュー関連
router.post("/",validationReview,  catchAsync( async (req,res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

// キャンプ場のレビュー削除
router.delete("/:reviewId", catchAsync (async(req,res) => {
    const { id, reviewId } = req.params
    await Review.findByIdAndDelete(reviewId)
    await Campground.findByIdAndUpdate(id, {$pull: { reviews:reviewId}})
    res.redirect(`/campgrounds/${id}`)
}))


module.exports = router