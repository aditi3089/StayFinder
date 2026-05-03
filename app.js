const express= require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing");
const methodOverride= require("method-override");
const engine= require("ejs-mate");
const path= require("path");
const wrapAsync= require("./utils/wrapAsync");
const ExpressError= require("./utils/ExpressError");
const listingSchema= require("./schema");

app.engine("ejs", engine);

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


const mongo_url="mongodb://localhost:27017/airbnb";
main().then(()=>{
    console.log("connected to db");
}).catch(err => console.log(err));

//schema validation middleware
const validateListing= (req,res,next)=>{

    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
}

async function main(){
 await mongoose.connect(mongo_url);
}
app.get("/", (req,res)=>{ 
    res.send("Hello World");
});

//listing routes
app.get("/listings", wrapAsync(async (req,res)=>{
    const display= await Listing.find({});
    res.render("listings/index", {display});
}));

app.get("/listings/new", wrapAsync(async(req,res)=>{
    res.render("listings/new.ejs");
}));

app.get("/listings/:id", wrapAsync(async (req, res)=>{
    let {id}= req.params;
    const item= await Listing.findById(id);
    res.render("listings/show.ejs", {item});
}));

//create route
app.post("/listings", validateListing, wrapAsync(async (req,res)=>{
    
    const newListing= new Listing({
        ...req.body.listing,
        image: { url: req.body.listing.image }
    });
    await newListing.save();
    res.redirect("/listings");
}));    

//edit route
app.get("/listings/:id/edit", validateListing,wrapAsync(async (req,res)=>{
    let {id}= req.params;
    const item= await Listing.findById(id);
    res.render("listings/edit", {item});
}));

app.put("/listings/:id", wrapAsync(async (req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {
        ...req.body.listing,
        image: { url: req.body.listing.image }
    });
    res.redirect("/listings");
}));

app.delete("/listings/:id", wrapAsync(async (req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

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
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

//error handler
app.use((err, req, res, next)=>{

    const {status=500, message="Something went wrong"}= err;
    res.status(status).render("error.ejs", { message });
})
app.listen(8080, ()=>{
    console.log("Server is running on port 8080");
});