const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review")

const ImageSchema = new Schema({
    url: String,
    filename: String,
});
ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace("/upload", "/upload/w_200")
});
const campGroundSchema = new Schema({
    title: {
        type: String
    },
    images: [ImageSchema],
    price: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: "Default"
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    location: {
        type: String
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
});

campGroundSchema.post("findOneAndDelete", async function(doc) {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } })
    }
})

module.exports = mongoose.model('Campground', campGroundSchema);