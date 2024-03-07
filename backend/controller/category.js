const { default: slugify } = require('slugify')
const Category = require('../models/category')
const { errorHandler } = require('../helper/dbErrorHandler')
const Blog = require('../models/blog')

exports.create = async (req, res) => {

    try {
        const { name } = req.body
        let slug = slugify(name).toLowerCase()

        let category = new Category({ name, slug })
        let data = await category.save()

        res.json(data)

    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err)
        })
    }
}

exports.list = async (req, res) => {

    try {
        let data = await Category.find({}).exec()

        res.json(data)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err)
        })
    }
}

exports.read = async (req, res) => {

    try {

        let slug = req.params.slug.toLowerCase()

        let category = await Category.findOne({ slug }).exec()

        // res.json(category)
        try {
            let data = await Blog.find({ categories: category })
                .populate('categories', '_id name slug')
                .populate('tags', '_id name slug')
                .populate('postedBy', '_id name')
                .select('_id title slug excerpt categories postedBy tags updatedAt createdAt')
                .exec()

            res.json({
                category,
                blogs : data
            })

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

exports.remove = async (req, res) => {

    try {

        let slug = req.params.slug.toLowerCase()

        let data = await Category.findOneAndRemove({ slug }).exec()

        res.json({
            message: "Category deleted successfully!"
        })
    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err)
        })
    }

}








