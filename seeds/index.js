
const mongoose = require("mongoose")
const Campground = require("../models/campground")
const {descriptors,places} = require("./seedHelpers")
const cities = require("./cities")


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
.then(() => {
    console.log("DBにコネクションOK")
})
.catch(() => {
    console.log("DBにコネクション失敗")
})

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for(let i=0; i<50; i++) {
        const randomCityIndex = Math.floor(Math.random() * cities.length);
        const price = Math.floor((Math.random()*2000) + 1000)
        const camp = new Campground({
            author:"680613d0fd84be451067b88c",
            location:`${cities[randomCityIndex].prefecture}${cities[randomCityIndex].city}`,
            title:`${sample(descriptors)}・${sample(places)}`,
            geometry:{
                type: "Point",
                coordinates: [
                    cities[randomCityIndex].longitude,
                    cities[randomCityIndex].latitude
                ]
            },
            price,
            images:  [
                {
                url: 'https://res.cloudinary.com/dpsc6auav/image/upload/v1745764800/YelpCamp/ozvh4pdfofyx7yblv56g.jpg',
                filename: 'YelpCamp/ozvh4pdfofyx7yblv56g'   
                }
                ],
            description:"都会の喧騒を離れ、澄んだ空気と美しい星空の下で過ごすひととき。ここでは、朝は鳥のさえずりとともに目覚め、昼は川のせせらぎを聞きながらリラックスし、夜は焚き火を囲んで語り合う、そんな贅沢な時間が流れています。",
        })
        await camp.save()
    }

}

seedDB()
.then(() => {
    mongoose.connection.close()
})
