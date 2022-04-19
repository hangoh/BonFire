const express = require('express');
const router = express.Router({mergeParams:true});
const {isLoggedIn, validateReview, isReviewAuthor} = require('../middleware')
const {deleteReview, addReview} = require('../controller/reviewsController')

///////////////////////////////////////////// Async Function  /////////////////////////////////////////////////////////////
router.delete('/:reviewId',isLoggedIn, isReviewAuthor, deleteReview)

router.post('/',isLoggedIn, validateReview, addReview)

module.exports = router