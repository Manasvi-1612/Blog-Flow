const Blog = require('../models/blog')
const Category = require('../models/category')
const Tag = require('../models/tag')
const formidable = require('formidable')
const slugify = require('slugify')
const { errorHandler } = require('../helper/dbErrorHandler')
const { stripHtml } = require("string-strip-html")   //older version
const fs = require('fs')
const { smartTrim } = require('../helper/blog')
const _ = require('lodash')
const User = require('../models/user')


const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types


exports.create = (req, res) => {

    let form = new formidable.IncomingForm()  //getting form data
    form.keepExtensions = true  //if form data conatins file then keep extensions(like: .png,.jpg) as it is 

    form.parse(req, async (err, fields, files) => {  //parsing -> then getting valid JS object
        if (err) {
            return res.status(400).json({
                error: 'Image could not upload'
            })
        }

        const { title, body, categories, tags } = fields

        console.log(categories)

        if (!body[0] || !body[0].length) {
            return res.status(400).json({
                error: 'Content is required!'
            })
        }

        let t = title === undefined ? '' : (title[0].replace(/\s+/g, ' ').trim())
        let b = body[0].replace(/\s+/g, ' ').trim()


        if (!t || !t.length) {
            return res.status(400).json({
                error: 'Title is required'
            })
        }


        if (!b || b.length < 200) {
            return res.status(400).json({
                error: 'Content is too short'
            })
        }

        let cat = categories === undefined ? '' : (categories[0])
        // console.log(c.length)

        if (!cat || cat.length === 0) {
            return res.status(400).json({
                error: 'At least one category is required'
            })
        }

        let tag = tags === undefined ? '' : (tags[0])

        if (!tag || tag.length === 0) {
            return res.status(400).json({
                error: 'At least one tag is required'
            })
        }


        let blog = new Blog()
        blog.title = `${t}`
        blog.body = b
        // blog.excerpt = smartTrim(stripHtml(b).result,500, ' ', ' ...')
        blog.excerpt = smartTrim(b, 320, ' ', ' ...')
        blog.slug = slugify(t).toLowerCase()
        blog.mtitle = `${t} | ${process.env.APP_NAME}`
        blog.mdesc = stripHtml(b.substring(0, 160)).result
        blog.postedBy = req.auth._id

        let arrayOfCategories = categories[0] && categories[0].split(',')
        let arrayOfTags = tags[0] && tags[0].split(',')

        if (files.photo === undefined) {
            return res.status(400).json({
                error: 'Image is required!'
            })
        }

        else if (files.photo || files.photo[0]) {
            if (files.photo[0].size > 10000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                })
            }

            // res.json( files.photo )

            blog.photo.data = fs.readFileSync(files.photo[0].filepath)
            blog.photo.contentType = files.photo[0].mimetype

            // let data = await blog.save()
            // res.json(data)

            try {
                let data = await blog.save()
                // res.json(data)


                let res1 = await Blog.findByIdAndUpdate(data._id, { $push: { categories: arrayOfCategories } }, { new: true }).exec()

                let res2 = await Blog.findByIdAndUpdate(data._id, { $push: { tags: arrayOfTags } }, { new: true }).exec()


                res.json(res2)


            } catch (err) {
                res.status(400).json({
                    error: errorHandler(err)
                })
            }
        }
    })
};

// read,list,lstAllBlogsCategoriesTags,remove,update
exports.list = async (req, res) => {

    try {
        let data = await Blog.find({})
            .populate('categories', '_id name slug')
            .populate('tags', '_id name slug')
            .populate('postedBy', '_id name username')
            .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
            .exec()

        res.json(data)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err)
        })
    }

}


exports.lstAllBlogsCategoriesTags = async (req, res) => {
    //limit -> getting from frontend(they tell us how many blog they want one each request(loadMore button))=> pagination
    let limit = req.body.limit ? parseInt(req.body.limit) : 10
    let skip = req.body.skip ? parseInt(req.body.skip) : 0

    let blogs
    let categories
    let tags

    try {
        let dataB = await Blog.find({})
            .populate('categories', '_id name slug')
            .populate('tags', '_id name slug')
            .populate('postedBy', '_id name username profile')
            .sort({ createdAt: -1 }) //recent/latest will get first
            .skip(skip)
            .limit(limit)
            .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
            .exec()

        blogs = dataB //blogs

        //get all categories
        try {
            let dataC = await Category.find({}).exec()
            categories = dataC //categories

            //get all tags
            try {
                let dataT = await Tag.find({}).exec()
                tags = dataT //tags

                res.json({ blogs, categories, tags, size: blogs.length })
            } catch (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
        } catch (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err)
        })
    }
}

exports.read = async (req, res) => {  //reading whole blog body not excerpt
    const slug = req.params.slug.toLowerCase()
    try {
        let data = await Blog.findOne({ slug })
            .populate('categories', '_id name slug')
            .populate('tags', '_id name slug')
            .populate('postedBy', '_id name username')
            .select('_id title body slug mtitle mdesc categories tags postedBy createdAt updatedAt')
            .exec()

        res.json(data)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err)
        })
    }
}

exports.remove = async (req, res) => {
    const slug = req.params.slug.toLowerCase()

    try {
        let data = await Blog.findOneAndRemove({ slug }).exec()

        res.json({
            message: 'Blog deleted successfully!'
        })
    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err)
        })
    }
}

exports.update = async (req, res) => {

    const slug = req.params.slug.toLowerCase()

    try {
        let oldBlog = await Blog.findOne({ slug }).exec()

        let form = new formidable.IncomingForm()
        form.keepExtensions = true

        form.parse(req, async (err, fields, files) => {

            if (err) {
                return res.status(400).json({
                    error: 'Image could not upload'
                });
            }

            // console.log(fields.categories[0].split(','))

            let slugBeforeMerge = oldBlog.slug;
            // oldBlog = _.merge(oldBlog, fields);
            oldBlog.slug = slugBeforeMerge;

            const { body, title, tags } = fields;
            const categories = fields.categories[0].split(',')


            if (title) {
                console.log(title)
                oldBlog.title = title[0]
            }


            // console.log(categories)

            if (body) {
                console.log(body)
                oldBlog.excerpt = smartTrim(body[0], 320, ' ', ' ...');
                oldBlog.desc = stripHtml(body[0].toString().substring(0, 160));
                oldBlog.body = body[0]
            }



            if (categories) {
                console.log("bdegf", categories)
                // let ca = categories.split(',')
                oldBlog.categories = categories.map(str => new mongoose.Types.ObjectId(str));
                console.log(oldBlog.categories)
            }

            if (tags) {
                oldBlog.tags = tags.split(',');
            }

            if (files.photo) {

                if (files.photo.size > 10000000) {
                    return res.status(400).json({
                        error: 'Image should be less then 1mb in size'
                    });
                }

                oldBlog.photo.data = fs.readFileSync(files.photo[0].filepath);
                oldBlog.photo.contentType = files.photo[0].mimetype;
            }

            try {
                let data = await oldBlog.save()

                res.json(data)

            } catch (error) {
                return res.status(400).json({ error })
            }
        });

    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err)
        })
    }
};

exports.photo = async (req, res) => {

    const slug = req.params.slug.toLowerCase()

    try {

        let result = await Blog.findOne({ slug })
            .select('photo')
            .exec()

        // res.send(result)
        res.contentType(result.photo.contentType)
        res.send(result.photo.data)

    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err)
        })
    }
}

exports.listRelated = async (req, res) => {

    let limit = req.body.limit ? parseInt(req.body.limi) : 3
    const { _id, categories } = req.body.blog

    try {
        let result = await Blog.find({ _id: { $ne: _id }, categories: { $in: categories } })
            .limit(limit)
            .populate('postedBy', '_id name username profile')
            .select('title slug excerpt postedBy createdAt updatedAt')
            .exec()
        //in- include(the category of this blog)
        // ne- not include(the current id of blog except that show all the blogs that share same category)

        res.json(result)
    } catch (err) {
        return res.status(400).json({
            error: 'Blogs not found'
        })
    }
}

//The $or operator performs a logical OR operation on an array of one or more <expressions> and selects the documents that satisfy at least one of the <expressions>

//$regex. Provides regular expression capabilities for pattern matching strings in queries

//$options. When you want to provide some additional options in regex operator, $options with ‘i’ parameter specifies that we want to carry out search without considering upper or lower case
exports.listSearch = async (req, res) => {
    let search = req.query.search

    if (search) {
        console.log("query", req.query.search)
        try {

            let data = await Blog.find({
                $or: [{ title: { $regex: search, $options: 'i' } }, { body: { $regex: search, $options: 'i' } }]
            }).select('-photo -body')

            res.json(data)

        } catch (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
    }
}

exports.listByUser = async (req, res) => {
    try {

        let user = await User.findOne({ username: req.params.username }).exec()
        if (!user) {
            return res.status(400).json({
                error: 'User not found'
            })
        }

        let userId = user._id
        try {
            let data = await Blog.find({ postedBy: userId })
                .populate('categories', '_id name slug')
                .populate('tags', '_id name slug')
                .populate('postedBy', '_id name username')
                .select('_id title slug postedBy createdAt updatedAt')
                .exec()

            res.json(data)
        } catch (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err)
        })
    }
}

