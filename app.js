if(process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express = require("express");
const app = express();
const path = require("path")
const mongoose = require("mongoose")
const ejsMate = require("ejs-mate")
const Campground = require("./models/campground")
const Review = require("./models/review")
const catchAsync = require("./utils/catchAsync")
const methodOverride = require("method-override");
const { renderFile } = require("ejs");
const ExpressError = require("./utils/ExpressError")
const campground = require("./models/campground");
const campgroundRoutes = require("./routes/campgrounds")
const reviewRoutes = require("./routes/reviews")
const usersRoutes = require("./routes/users")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user")
const MongoStore = require("connect-mongo")


// postman使うために必要（下2行）
const cors = require("cors");
app.use(cors());

app.engine("ejs", ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "public")))

// 'mongodb://127.0.0.1:27017/yelp-camp'
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp'
const secret = process.env.SECRET || "secret"
// セッションの設定
const store =  MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret,
    },  
    touchAfter: 24 * 60 * 60,
})

store.on("error", e => {
    console.log("セッションのエラー",e)
})


const sessionConfig = {
    store,
    name: "session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    }
}

app.use(session(sessionConfig))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



app.use(flash())
app.use((req,res,next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})


mongoose.set('strictQuery', false); // 必要に応じて追加

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("DBにコネクションOK");
    })
    .catch((err) => {
        console.log("DBにコネクション失敗", err);
    });

app.get("/", (req,res) => {
    res.render("home")
})

app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/reviews", reviewRoutes)
app.use("/", usersRoutes)   


app.all("*", (req, res, next) => {
    next(new ExpressError("ページが見つかりません",404))
})



// エラーの処理
app.use((err,req,res,next) => {
    const {statusCode = 500 } = err;
    if(!err.message) {
        err.message = "問題が起きました"
    }
    res.status(statusCode).render("error", {err})
})


const port = process.env.PORT || 3000
// サーバーの立ち上げ
app.listen(port,() => {
    console.log(`ポート${port}でサーバーが立ち上がりました`)
})


