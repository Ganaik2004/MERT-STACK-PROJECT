const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
module.exports.index=async(req,res)=>{
    const allListing = await Listing.find({});
   res.render("listings/index.ejs",{allListing});
   }

   module.exports.rendernewform = (req,res)=>{  
    res.render("listings/new.ejs");
    }

    module.exports.rendershowrout = async(req,res)=>{
        let {id} = req.params;
         const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
         if(!listing){
            req.flash("error","Listing you requested for does not exist");
            res.redirect("/listings");
         }
         res.render("listings/show.ejs",{listing});
    }

    module.exports.rendercreaterout = async(req,res,next)=>{
    let response =  await  geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1
          }).send()
           
     let url = req.file.path;
     let filename = req.file.filename;
        const newlisting = new Listing(req.body.listing);
        newlisting.owner = req.user._id;
        newlisting.image = {url,filename};
        newlisting.geometry = response.body.features[0].geometry;
        await newlisting.save();
        req.flash("success","New Listing Is Created");
        res.redirect("/listings");
    }

    module.exports.rendereditrout = async(req,res)=>{
        let {id} = req.params;
        const listing = await Listing.findById(id);
        if(!listing){
            req.flash("error","Listing you requested for does not exist");
            res.redirect("/listings");
         }
        let orignaimageurl =  listing.image.url;
        orignaimageurl= orignaimageurl.replace("/upload","/upload/w_250");
        res.render("listings/edit.ejs",{listing, orignaimageurl});
    }

    module.exports.renderupdaterout = async(req,res)=>{
     
        let {id} = req.params;
      let listing =  await Listing.findByIdAndUpdate(id,{...req.body.listing});
      if(typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = {url,filename};
      await listing.save(); 
      }
       req.flash("success","Updated The List");
       res.redirect(`/listings/${id}`);
    }

    module.exports.renderdeleterout = async(req,res)=>{
        let {id} = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success","Deleted The List");
        res.redirect("/listings");
    }