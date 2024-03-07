const express = require('express')
const router = express.Router()
const { create, read, list, lstAllBlogsCategoriesTags, remove, update, photo, listRelated, listSearch, listByUser } = require('../controller/blog')
const { requireSignin, adminMiddleware, authMiddleware, canUpdateAndDelete } = require('../controller/auth')


//Admin crud....

router.post('/blog', requireSignin, adminMiddleware, create)
router.get('/blogs', list)  //getting all the blogs

router.post('/blogs-categories-tags', lstAllBlogsCategoriesTags) //getting blogs, categories,tags a/c to loadMore func.(at once 5-6 blogs are loaded)

router.get('/blog/:slug', read) //get single blog
router.delete('/blog/:slug', requireSignin, adminMiddleware, remove) //delete single blog
router.put('/blog/:slug', requireSignin, adminMiddleware, update) //update single blog
router.get('/blog/photo/:slug', photo) //get blog photo
router.post('/blogs/related', listRelated) //get related blog that will share the same category
router.get('/blogs/search', listSearch)  //search for blogs


//Auth user crud...
router.post('/user/blog', requireSignin, authMiddleware, create)
router.get('/:username/blogs', listByUser)
router.delete('/user/blog/:slug', requireSignin, authMiddleware, canUpdateAndDelete, remove)
router.put('/user/blog/:slug', requireSignin, authMiddleware, canUpdateAndDelete, update)

module.exports = router