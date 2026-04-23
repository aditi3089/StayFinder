const express= require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing");
const methodOverride= require("method-override");

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
//ejs setup
const path= require("path");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


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


app.get("/listings", async (req,res)=>{
    const display= await Listing.find({});
    res.render("listings/index", {display});
});

app.get("/listings/new", async(req,res)=>{
    res.render("listings/new.ejs");
});

app.get("/listings/:id", async (req, res)=>{
    let {id}= req.params;
    const item= await Listing.findById(id);
    res.render("listings/show.ejs", {item});
});

app.post("/listings", async (req,res)=>{
    const newListing= new Listing(req.body);
    await newListing.save();
    res.redirect("/listings");
});

app.get("/listings/:id/edit", async (req,res)=>{
    let {id}= req.params;
    const item= await Listing.findById(id);
    res.render("listings/edit", {item});
});

app.put("/listings/:id", async (req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, req.body);
    res.redirect("/listings");
});

app.delete("/listings/:id", async (req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

// app.get("/testlistings", async (req,res)=>{
//  let list1= new Listing({
//     title: "Cozy Apartment in Downtown",
//     description: "A cozy apartment located in the heart of downtown, close to all amenities.",
//     image: "",
//     price: 120,
//     location: "Downtown",
//     country: "USA"
//  });
//  await list1.save();
//  console.log("Listing created");
//     res.send("Listing created");
// });

app.listen(8080, ()=>{
    console.log("Server is running on port 8080");
});