const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")
const Campground = require("../models/campground")
const {campgroundSchema} = require("../schemas")
const { isLoggedIn } = require("../middleware");
const campground = require('../models/campground');

const validationCampground = (req,res,next) => {
    const result = campgroundSchema.validate(req.body)
    if(result.error) {
        const msg = result.error.details.map(detail => detail.message).join(", ")
    throw new ExpressError(msg,400)
    }
    next()
}

// / キャンプ場一覧ページ
router.get("/", catchAsync (async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render("campgrounds/index",{campgrounds})
}))

// キャンプ場新規登録
router.get("/new", isLoggedIn,(req,res) => {
    res.render("campgrounds/new")
})
router.post("/", isLoggedIn, validationCampground , catchAsync (async(req,res) => {
    const newCampground = new Campground(req.body.campground)
    newCampground.author = req.user._id    
    await newCampground.save()
    req.flash("success","キャンプ場を登録しました")
    res.redirect(`/campgrounds/${newCampground._id}`)
}))

// キャンプ場更新
router.get("/:id/edit", isLoggedIn,catchAsync (async(req,res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if(!campground) {
        req.flash("error","キャンプ場が見つかりません")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/edit",{campground})
}))
router.put("/:id", isLoggedIn,validationCampground ,catchAsync (async(req,res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if(!campground.author.equals(req.user._id)) {
        req.flash("error","このキャンプ場を更新する権限はありません")
        return res.redirect(`/campgrounds/${id}`)
    }
    const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground}, { runValidators: true, new: true });
    res.flash("success","キャンプ場を更新しました")
    res.redirect(`/campgrounds/${camp._id}`)
}))

// キャンプ場削除
router.delete("/:id",isLoggedIn, catchAsync (async(req,res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash("success","キャンプ場を削除しました")
    res.redirect("/campgrounds")
}))


// キャンプ場詳細ページ
router.get("/:id", catchAsync (async(req,res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate("reviews").populate("author")
    console.log(campground)
    if(!campground) {
        req.flash("error","キャンプ場が見つかりません")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/shows",{campground})
}))



module.exports = router