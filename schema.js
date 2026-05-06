const joi= require("joi");

const listingSchema= joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string(),
        image: joi.string(),
        price: joi.number().required().min(0),
        location: joi.string().allow("", null),
        country: joi.string().required()
    }).required()
});

module.exports= listingSchema;