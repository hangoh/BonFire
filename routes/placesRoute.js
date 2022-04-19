const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/expressError')
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')
const {index, getNewForm, placesDetails, postNewPlaces, getEditForm, editPlace, deletePost} = require('../controller/placesController')
const {storage} =require('../cloudinary')
const multer = require('multer')
const upload = multer({storage})

///////////////////////////////////////////////////  Function  ////////////////////////////////////////////////////////////

router.get('/new', isLoggedIn,getNewForm)

///////////////////////////////////////////// Async Function  /////////////////////////////////////////////////////////////

router.get("/",index)

router.get("/:id",placesDetails)

router.post('/',isLoggedIn, upload.array('image'), validateCampground, postNewPlaces)

router.get('/:id/edit',isLoggedIn ,isAuthor, getEditForm)

router.put('/:id',isLoggedIn,isAuthor,upload.array('image'), validateCampground, editPlace)

router.delete('/:id',isLoggedIn ,isAuthor, deletePost)

module.exports = router