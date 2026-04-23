const express= require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing");

const mongo_url="mongodb://localhost:27017/airbnb";
main().then(()=>{
    console.log("connected to db");
}).catch(err => console.log(err));


async function main(){
 await mongoose.connect(mongo_url);
}
app.get("/", (req,res)=>{
    res.send("Hello World");
});

app.get("/testlistings", async (req,res)=>{
 let list1= new Listing({
    title: "Cozy Apartment in Downtown",
    description: "A cozy apartment located in the heart of downtown, close to all amenities.",
    image: "",
    price: 120,
    location: "Downtown",
    country: "USA"
 });
 await list1.save();
 console.log("Listing created");
    res.send("Listing created");
});

app.listen(8080, ()=>{
    console.log("Server is running on port 8080");
});