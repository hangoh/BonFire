const {placeSchema,reviewSchema} = require("./validateSchema")
const Places = require('./models/places');
const Reviews = require('./models/reviews')
const ExpressError = require('./utils/expressError')

module.exports.isLoggedIn = (req,res,next) => {
    if (!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error',"You must be signed in")
        return res.redirect('/login')
    }else{
        next()

    }
}

module.exports.validateCampground = (req, res, next)=>{
    const {error} = placeSchema.validate(req.body)
    if(error){
        const msg = error.details.map(e => e.message).join(',')
        throw new ExpressError(msg,400)
    }
    next();
}


module.exports.isAuthor = async(req,res,next)=>{
    const {id} = req.params
    const place = await Places.findById(id)
    if(!(place.author.equals(req.user._id))){
        req.flash('error',"You don't have permission to do this")
        return res.redirect(`/places/${place.id}`);
    }else{
        next()
    }
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id, reviewId} = req.params
    const review = await Reviews.findById(reviewId)
    if(!(review.author.equals(req.user._id))){
        req.flash('error', "You don't have permission to do this")
        return res.redirect(`/places/${id}`)
    }else{
        next()
    }
}

module.exports.validateReview = (req,res, next)=>{
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(e=>e.message).join(",")
        throw new ExpressError(msg,400)
    }
    next();
}
