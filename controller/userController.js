const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

module.exports.getRegisterForm = (req,res, next)=>{
    res.render('users/register')
}

module.exports.register = catchAsync(async(req,res,next)=>{
    if(req.body){
        try{
            const {email,password,username} = req.body
            const user = new User({email,username})
            const registeredUser = await User.register(user,password)
            req.login(registeredUser, err=>{
                if(err){
                    return next(err)
                }
            })
            req.flash('success','Welcome to BonFire')
            res.redirect('/places')
        }catch(e){
            req.flash('error',`${e.message}`)
            res.redirect('/registered')
        }
    }
})

module.exports.getLoginForm = (req,res, next)=>{
    res.render('users/login')
}

module.exports.login = (req,res)=>{
    req.flash('success','Welcome back to BonFire')
    if(req.session.returnTo){
        console.log(req.session.returnTo)
        res.redirect(`${req.session.returnTo}`)
        delete req.session.returnTo 
    }else{
        res.redirect('/places')
    }
}

module.exports.logout = (req,res,next)=>{
    delete req.session.returnTo 
    req.logout();
    req.flash('success','Log Out')
    res.redirect('/places')
}