const express = require('express')
const router = express.Router()
const { requireSignin, adminMiddleware} = require('../controller/auth')

//validation
const {runValidation} = require('../validators/index')
const {TagValidator} = require('../validators/tag')

const { create,list,read,remove } = require('../controller/tag')

//Creating/Adding tag
router.post('/tag',TagValidator,runValidation,requireSignin,adminMiddleware, create)

//fetching all tags
router.get('/tags', list)

//fetching single tag
router.get('/tag/:slug', read)

//deleting tag
router.delete('/tag/:slug', requireSignin,adminMiddleware,remove)

module.exports = router