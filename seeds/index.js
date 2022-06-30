const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Zoo = require('../models/zoo');

mongoose.connect('mongodb://localhost:27017/zoo-review', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async() => {
    await Zoo.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Zoo({
            //YOUR USER ID
            author: '62bd649efb01743580a60b73',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [{
                    url: 'https://res.cloudinary.com/dg2j1ky8k/image/upload/v1656578301/ZooReview/ZOO-MAIN_vwxiro_glpfoj.png',
                    filename: 'ZooReview/ZOO-MAIN_vwxiro_glpfoj'
                },
                {
                    url: 'https://res.cloudinary.com/dg2j1ky8k/image/upload/v1656578299/ZooReview/gettyimages-1234383774-612x612_hi4q7d_ioijkm.jpg',
                    filename: 'ZooReview/gettyimages-1234383774-612x612_hi4q7d_ioijkm'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})