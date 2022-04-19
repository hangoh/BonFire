const express = require('express');
const router = express.Router();
const passport = require('passport');
const {isLoggedIn} = require('../middleware')
const {getLoginForm,getRegisterForm,login,logout,register} = require('../controller/userController')

router.get('/register',getRegisterForm)  

router.post('/register',register)

router.get('/login',getLoginForm)

router.post('/login', passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}),login)

router.get('/logout',isLoggedIn, logout)

module.exports = router;