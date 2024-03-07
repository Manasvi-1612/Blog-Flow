const express = require('express')
const router = express.Router()
const { requireSignin, authMiddleware, adminMiddleware } = require('../controller/auth')
const { read, publicProfile, update, photo } = require('../controller/user')
const { runValidation } = require('../validators/index')

router.get('/user/profile', requireSignin, authMiddleware, read)
router.get('/user/:username', publicProfile)
router.put('/user/update', requireSignin, authMiddleware, update) //update user profile
router.get('/user/photo/:_id', photo) //get user photo


module.exports = router