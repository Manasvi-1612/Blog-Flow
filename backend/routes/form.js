const express = require('express')
const router = express.Router()
const {contactForm,authorContactForm} = require('../controller/form')

//validation
const {runValidation} = require('../validators/index')
const {contactFormValidator} = require('../validators/form')

router.post('/contact',contactFormValidator,runValidation, contactForm)
router.post('/user/contact',contactFormValidator,runValidation, authorContactForm)


//test
// router.get('/secret',requireSignin, (req,res)=>{  
//     res.json({           //It makes the user availablein the request object
//         auth: req.auth
//     })
// })

module.exports = router