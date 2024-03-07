const User = require('../models/user')
const Blog = require('../models/blog')
const errorHandler = require('../helper/dbErrorHandler')
const _ = require('lodash')
const formidable = require('formidable')
const fs = require('fs')
// const bcrypt = require('bcrypt');
// const saltRounds = 10;

exports.read = (req, res) => {
    req.profile.hashed_password = undefined
    return res.json(req.profile)
}

exports.publicProfile = async (req, res) => {
    let username = req.params.username
    let blogs

    try {
        let user = await User.findOne({ username }).exec()

        if (!user) {
            return res.status(400).json({
                error: 'User not found'
            })
        }

        let userId = user._id

        try {
            let data = await Blog.find({ postedBy: userId })
                .populate('categories', '_id name slug')
                .populate('tags', "_id name slug")
                .populate('postedBy', '_id name')
                .limit(10)
                .select('_id title slug excerpt categories tags postedAt createdAt updatedAt')
                .exec()

            user.photo = undefined
            user.hashed_password = undefined

            res.json({
                user,
                blogs: data
            })

        } catch (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }


    } catch (error) {
        return res.status(400).json({
            error: 'User not found'
        })
    }
}

exports.update = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not upload'
            });
        }

        let user = req.profile

        user = _.extend(user, fields)

        const { name, username, email, password, about } = fields

        if (name) {
            user.name = name[0]
        }

        if (username) {
            user.username = username[0]
        }

        if (email) {
            user.email = email[0]
        }

        if (about) {
            console.log(about)
            user.about = about[0]
        }


        if (files.photo) {

            console.log(files.photo)

            if (files.photo.size > 10000000) {
                return res.status(400).json({
                    error: 'Image should be less then 1mb in size'
                });
            }

            user.photo.data = fs.readFileSync(files.photo[0].filepath);
            user.photo.contentType = files.photo[0].mimetype;
        }

        try {
            let result = await user.save()

            result.hashed_password = undefined
            result.salt = undefined
            result.photo = undefined
            res.json(result)
        } catch (error) {
            return res.status(400).json({
                error
            });
        }
    })
}

exports.photo = async (req, res) => {
    const id = req.params._id

    try {
        let user = await User.findOne({ _id: id }).exec()

        if (!user) {
            return res.status(400).json({
                error: 'User not found'
            })
        }

        // res.json(user)
        if (user.photo.data) {
            res.set('Content-Type', user.photo.contentType)
            return res.send(user.photo.data)
        }
    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err)
        })
    }
}


