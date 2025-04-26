const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")
const Campground = require("../models/campground")
const {campgroundSchema} = require("../schemas")
const { isLoggedIn } = require("../middleware");
const campground = require('../models/campground');
const multer = require('multer');
const upload  = multer({dest:"uploads/"})


const validationCampground = (req,res,next) => {
    const result = campgroundSchema.validate(req.body)
    if(result.error) {
        const msg = result.error.details.map(detail => detail.message).join(", ")
    throw new ExpressError(msg,400)
    }
    next()
}


router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validationCampground , catchAsync (campgrounds.createCampground))

// キャンプ場新規登録
router.get("/new", isLoggedIn, campgrounds.newCampground)


router.route("/:id")
    .get(catchAsync (campgrounds.showCampground))
    .put( validationCampground,isLoggedIn ,catchAsync (campgrounds.updateCampground))
    .delete(isLoggedIn, catchAsync(campgrounds.deleteCampground))
// / キャンプ場一覧ページ
// router.get("/", catchAsync (campgrounds.index))

// キャンプ場新規登録
// router.get("/new", isLoggedIn, campgrounds.newCampground)
// router.post("/", isLoggedIn, validationCampground , catchAsync (campgrounds.createCampground))

// キャンプ場更新
router.get("/:id/edit", isLoggedIn,catchAsync (campgrounds.editCampground))
// router.put("/:id", isLoggedIn,validationCampground ,catchAsync (campgrounds.updateCampground))
// キャンプ場削除
// router.delete("/:id",isLoggedIn, catchAsync(campgrounds.deleteCampground))

// キャンプ場詳細ページ
// router.get("/:id", catchAsync (campgrounds.showCampground))


module.exports = router