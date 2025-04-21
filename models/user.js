const { string } = require("joi")
const mongoose = require("mongoose")
const { Schema } = mongoose
const passportLocalMongoose = require("passport-local-mongoose")
const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    }
})

userSchema.plugin(passportLocalMongoose, {
    errorMessages: {
        IncorrectPassword: "パスワードが違います",
        UserExists: "そのユーザー名はすでに使われています",
        UserNotFound: "そのユーザーは見つかりませんでした",
    }
})




module.exports = mongoose.model("User", userSchema)