const express = require('express')
const router = express.Router()
const { requireSignin, adminMiddleware } = require('../controller/auth')

//validation
const { runValidation } = require('../validators/index')
const { categoryCreateValidator } = require('../validators/category')

const { create, list, read, remove } = require('../controller/category')

//Creating/Adding category
router.post('/category', categoryCreateValidator, runValidation, requireSignin, adminMiddleware, create)

//fetching all categories
router.get('/categories', list)

//fetching single category
router.get('/category/:slug', read)

//deleting category
router.delete('/category/:slug', requireSignin, adminMiddleware, remove)

module.exports = router