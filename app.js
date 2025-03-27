const express = require("express");
const app = express();
const path = require("path")
const mongoose = require("mongoose")
const ejsMate = require("ejs-mate")
const Campground = require("./models/campground")
const methodOverride = require("method-override");
const { renderFile } = require("ejs");

app.engine("ejs", ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
.then(() => {
    console.log("DBにコネクションOK")
})
.catch(() => {
    console.log("DBにコネクション失敗")
})

app.get("/", (req,res) => {
    res.render("home")
})

// キャンプ場一覧ページ
app.get("/campgrounds", async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render("campgrounds/index",{campgrounds})
})

// キャンプ場新規登録
app.get("/campgrounds/new", (req,res) => {
    res.render("campgrounds/new")
})
app.post("/campgrounds", async(req,res) => {
    const newCampground = new Campground(req.body.campground)
    await newCampground.save()
    res.redirect(`/campgrounds/${newCampground._id}`)
})

// キャンプ場編集
app.get("/campgrounds/:id/edit", async(req,res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render("campgrounds/edit",{campground})
})
app.put("/campgrounds/:id", async(req,res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground},{runValidators:true,new:true,useFindAndModify: false})
    res.redirect(`/campgrounds/${campground._id}`)
})

// キャンプ場削除
app.delete("/campgrounds/:id", async(req,res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect("/campgrounds")
})


// キャンプ場詳細ページ
app.get("/campgrounds/:id", async(req,res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render("campgrounds/shows",{campground})
})


app.listen(3000,() => {
    console.log("ポート3000で受付中")
})


function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch(e => next(e))
    }
}