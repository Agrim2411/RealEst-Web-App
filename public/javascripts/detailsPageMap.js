const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
        useNewUrlParser: true,
        // useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => { console.log("Mongo Connection Open!") })
    .catch((err) => { console.log("Error!!", err) })

const campGround = require("../models/campground.js")

const Clearallseeds = async() => {
    await campGround.deleteMany({});
}


const randomPicker = arr => arr[Math.floor(Math.random() * arr.length)];
const AddseedData = async() => {
    Clearallseeds();
    //try {
    for (let i = 0; i < 50; i++) {
        const random = Math.floor(Math.random() * 100);
        const camp = new campGround({
            owner: "613753897fd52526a4bd5196",
            location: `${cities[random].city} , ${cities[random].state}`,

            title: `${randomPicker(descriptors)}  ${randomPicker(places)}`,

            images: [{
                    url: 'https://res.cloudinary.com/dg2j1ky8k/image/upload/v1631093568/YelpCamp/vivmmxdpxw9w18dn4ylx.jpg',
                    filename: "YelpCamp/vivmmxdpxw9w18dn4ylx.jpg"
                },
                {
                    url: 'https://res.cloudinary.com/dg2j1ky8k/image/upload/v1629895279/YelpCamp/elzq1oitvlql752aoa5r.jpg',
                    filename: 'YelpCamp/elzq1oitvlql752aoa5r'
                }
            ],
            geometry: { "type": "Point", "coordinates": [cities[random].longitude, cities[random].latitude] },

            price: Math.floor(Math.random() * 1000),

            description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet facere animi a cumque. Inventore officia ullam atque error quidem doloribus natus alias minus, vero ipsam. Itaque illo obcaecati consectetur dolorum."
        })
        await camp.save();
    }
}

AddseedData()
    .then(() => { mongoose.connection.close(); })