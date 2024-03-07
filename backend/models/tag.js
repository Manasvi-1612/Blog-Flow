const mongoose = require('mongoose')

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,  //will remove leading and trailing whitespaces
        required: true,
        max: 32
    },
    slug: {
        type: String,
        unique: true,
        index: true
    }
},{timestamps: true}
)
module.exports = mongoose.model('Tag', tagSchema)