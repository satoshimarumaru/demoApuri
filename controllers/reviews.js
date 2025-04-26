const Campground = require('../models/campground');
const Review = require('../models/review');


module.exports.createReview = async (req, res)  => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash("success","レビューを登録しました")
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params
    await Review.findByIdAndDelete(reviewId)
    await Campground.findByIdAndUpdate(id, {$pull: { reviews:reviewId}})
    req.flash("success","レビューを削除しました")
    res.redirect(`/campgrounds/${id}`)
}