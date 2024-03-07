const { default: slugify } = require('slugify')
const Tag = require('../models/tag')
const { errorHandler } = require('../helper/dbErrorHandler')
const Blog = require('../models/blog')

exports.create = async (req, res) => {

    try {
        const { name } = req.body
        let slug = slugify(name).toLowerCase()

        let tag = new Tag({ name, slug })
        let data = await tag.save()

        res.json(data)

    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err)
        })
    }
}

exports.list = async (req, res) => {

    try {
        let data = await Tag.find({}).exec()

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

        let tag = await Tag.findOne({ slug }).exec()

        // res.json(tag)
        try {
            let data = await Blog.find({ tags: tag })
                .populate('categories', '_id name slug')
                .populate('tags', '_id name slug')
                .populate('postedBy', '_id name')
                .select('_id title slug excerpt categories postedBy tags updatedAt createdAt')
                .exec()

            res.json({
                tag,
                blogs: data
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

        let data = await Tag.findOneAndRemove({ slug }).exec()

        res.json({
            message: "Tag deleted successfully!"
        })
    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err)
        })
    }

}