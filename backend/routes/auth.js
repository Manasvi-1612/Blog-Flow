const express = require('express')
const router = express.Router()
const { signup, signin, signout, requireSignin, forgotPassword, resetPassword, preSignup, googleLogin } = require('../controller/auth')
const cors = require('cors')

//validation
const { runValidation } = require('../validators/index')
const { userSignupValidator, userSigninValidator, forgotPasswordValidator, resetPasswordValidator } = require('../validators/auth')


router.post('/pre-signup', userSignupValidator, runValidation, preSignup)
router.post('/signup', signup)
router.post('/signin', userSigninValidator, runValidation, signin)
router.get('/signout', signout)
router.put('/forgot-password', forgotPasswordValidator, runValidation, forgotPassword)
router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword)
router.post('/google-login', googleLogin)
//test
// router.get('/secret',requireSignin, (req,res)=>{  
//     res.json({           //It makes the user availablein the request object
//         auth: req.auth
//     })
// })

module.exports = router