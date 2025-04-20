const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")
const Campground = require("../models/campground")
const {campgroundSchema} = require("../schemas")

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
router.get("/new", (req,res) => {
    res.render("campgrounds/new")
})
router.post("/", validationCampground , catchAsync (async(req,res) => {
    const newCampground = new Campground(req.body.campground)
    await newCampground.save()
    res.redirect(`/${newCampground._id}`)
}))

// キャンプ場編集
router.get("/:id/edit", catchAsync (async(req,res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render("campgrounds/edit",{campground})
}))
router.put("/:id", validationCampground ,catchAsync (async(req,res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground},{runValidators:true,new:true,useFindAndModify: false})
    res.redirect(`/campgrounds/${campground._id}`)
}))

// キャンプ場削除
router.delete("/:id", catchAsync (async(req,res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect("/campgrounds")
}))


// キャンプ場詳細ページ
router.get("/:id", catchAsync (async(req,res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate("reviews")
    res.render("campgrounds/shows",{campground})
}))



module.exports = router