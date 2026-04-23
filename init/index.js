const mongoose= require("mongoose");
const Listing= require("../models/listing");
const initdata=require("./data.js");
const mongo_url="mongodb://localhost:27017/airbnb";

main().then(()=>{
    console.log("connected to db");
}).catch(err => console.log(err));

async function main(){
 await mongoose.connect(mongo_url);
}

const initDB= async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initdata);
    console.log("Data inserted");
};

initDB();