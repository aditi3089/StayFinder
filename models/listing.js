const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,

    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            default: "https://www.richardhaworth.co.uk/media/wordpress/82168fafddab10191259a256df44f41f.png"
        }
    },

    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ] 
});

listingSchema.post("findOneAndDelete", async function(listing) {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});
const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;