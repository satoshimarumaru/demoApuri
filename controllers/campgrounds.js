const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
        res.render("campgrounds/index",{campgrounds})
}

module.exports.newCampground = (req, res) => {
    res.render("campgrounds/new")
}


module.exports.createCampground = async (req, res) => { 
    const geoDate= await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const newCampground = new Campground(req.body.campground)
    newCampground.images = req.files.map(f => ({url:f.path, filename:f.filename}))
    newCampground.author = req.user._id   
    newCampground.geometry = geoDate.body.features[0].geometry 
    await newCampground.save()
    console.log(newCampground)
    req.flash("success","キャンプ場を登録しました")
    res.redirect(`/campgrounds/${newCampground._id}`)
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate("reviews").populate("author")
    if(!campground) {
        req.flash("error","キャンプ場が見つかりません")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/shows",{campground})
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate("author")
    if(!campground) {
        req.flash("error","キャンプ場が見つかりません")
        return res.redirect("/campgrounds")
    }
    if(!campground.author.equals(req.user._id)) {
        req.flash("error","このキャンプ場を更新する権限はありません")
        return res.redirect(`/campgrounds/${id}`)
    }
    res.render("campgrounds/edit",{campground})
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate("author")
    if(!campground) {
        req.flash("error","キャンプ場が見つかりません")
        return res.redirect("/campgrounds")
    }
    if(!campground.author.equals(req.user._id)) {
        req.flash("error","このキャンプ場を更新する権限はありません")
        return res.redirect(`/campgrounds/${id}`)
    }
    const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground}, { runValidators: true, new: true });
    req.flash("success","キャンプ場を更新しました")
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash("success","キャンプ場を削除しました")
    res.redirect("/campgrounds")
}