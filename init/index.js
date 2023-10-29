const mongoose = require('mongoose');
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
const mongose_URL = "mongodb://127.0.0.1:27017/Wanderlust";

// Making Connection with the data base
main().then((result)=>{
    console.log(`Connected to DB ${result}`);
}).catch((error)=>{
 console.log(`${error}`);
})

async function main() {
    await mongoose.connect(mongose_URL);
  }

  const initDB = async ()=>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({
       ...obj,owner:"653c7e8047f26d143948cb9b",
    }));
    await Listing.insertMany(initdata.data);
  }
  initDB();