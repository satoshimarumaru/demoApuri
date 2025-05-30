const Joi = require("joi")
const review = require("./models/review")

module.exports.campgroundSchema = Joi.object({
        campground:Joi.object({
            title:Joi.string().required(),
            price:Joi.number().required().min(0),
            // image:Joi.required(),
            location:Joi.string().required(),
            description:Joi.string().required()
        }).required()
    }).required()

    module.exports.reviewSchema = Joi.object({
        review:Joi.object({
            body:Joi.string().required(),
            rating:Joi.number()
        }).required()
    }).required()

