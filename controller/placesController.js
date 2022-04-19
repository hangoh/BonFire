const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/expressError')
const Places = require('../models/places');
const Reviews = require('../models/reviews')
const {cloudinary} = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const token_mb = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({accessToken: token_mb})


module.exports.index = catchAsync(async(req, res) => {
    const places = await Places.find({});
    res.render("places/index",{places})
})

module.exports.getNewForm = (req, res) => {
    res.render("places/new")
}

module.exports.placesDetails = catchAsync(async(req, res, next) => {
    const {id} = req.params
    const place = await Places.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('author')
    if(!place){
        req.flash('error',"Cannot find that campground")
        return res.redirect("/places")
    }

    res.render("places/show",{place})

})

module.exports.postNewPlaces = catchAsync(async(req, res, next) => {
    const geoCoder = await geocoder.forwardGeocode({
        query: req.body.location,
        limit:1
    }).send()
    const place = req.body;
    const p = new Places(place);
    p.images = req.files.map(f => ({url:f.path, filename:f.filename}))
    p.author = req.user._id;
    p.geometry = geoCoder.body.features[0].geometry
    await p.save();
    req.flash('success', 'Successfully added a new Capmground')
    res.redirect(`/places/${p._id}`);
})

module.exports.getEditForm = catchAsync(async(req, res) => {
    const {id} = req.params;
    const place = await Places.findById(id);
    res.render("places/edit",{place});
})

module.exports.editPlace = catchAsync(async(req,res)=>{
    const {id} = req.params;
    const new_p = await Places.findByIdAndUpdate(id,req.body,{new:true})
    const new_img = req.files.map(f=>({url:f.path, filename:f.filename}))
    new_p.images.push(...new_img)
    await new_p.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await new_p.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
    }
    req.flash("success", "Succesfully edited the post")
    res.redirect(`/places/${new_p._id}`);
})

module.exports.deletePost = catchAsync(async(req,res)=>{
    const {id} = req.params;
    const place = await Places.findById(id);
    await Reviews.deleteMany({_id:{$in:place.reviews}})
    await Places.deleteOne({_id:id})
    req.flash('success', "Successfully deleted a Campground post")
    res.redirect('/places');
})