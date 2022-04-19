const catchAsync = require('../utils/catchAsync')
const Places = require('../models/places');
const Reviews = require('../models/reviews')

module.exports.deleteReview = catchAsync(async(req,res,next)=>{
    const {id, reviewId} = req.params
    const place = await Places.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Reviews.findByIdAndDelete(reviewId)
    req.flash('success', "You successfully deleted your review")
    res.redirect(`/places/${id}`) 
})

module.exports.addReview = catchAsync(async(req,res,next)=>{
    const {id} = req.params
    const place = await Places.findById(id)
    if (place){
        const review = new Reviews(req.body)
        review.author = req.user._id
        place.reviews.push(review);
        await review.save();
        await place.save();
        req.flash("success", "You just reviewed on this post")
    }
    res.redirect(`/places/${id}`)

})