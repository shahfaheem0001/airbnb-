const mongoose=require("mongoose");
const initData= require("./data.js");
const Listing = require("../models/listing.js");
const MONGO_URL= "mongodb://127.0.0.1:27017/wanderlust";



main()
.then(()=>{
    console.log("connected to DB");

})
.catch((err)=>{
    console.log(err);
});

async function main() {

    await mongoose.connect( MONGO_URL);
}
const initDB = async () => {
    await Listing.deleteMany({});
    const updatedData = initData.data.map((obj) => ({
        ...obj,
        owner: "680a3c6b97155864d4764ddf"
    }));
    await Listing.insertMany(updatedData);
    console.log("data was initialized");
};

initDB();