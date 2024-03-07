const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        min: 3,
        max: 160,
    },
    slug: {
        type: String,
        unique: true,
        index: true
    },
    body: {
        type: {},    //empty type means you can store any kind of data like: binary, html file etc.
        required: true,
        min: 200,
        max: 2000000
    },
    excerpt: {
        type: String,
        max: 1000
    },

    //meta
    mtitle: {
        type: String
    },
    mdesc: {
        type: String
    },

    photo: {
        data: Buffer,
        contentType: String
    },
    categories: [{
        type: ObjectId,
        ref: 'Category',
        required: true
    }],
    tags: [{ type: ObjectId, ref: 'Tag', required: true }],

    postedBy: {  //user that posted the blog
        type: ObjectId,
        ref: 'User'
    }
}, { timestamps: true }
)


module.exports = mongoose.model('Blog', blogSchema)