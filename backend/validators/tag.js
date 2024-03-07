const {check} = require('express-validator')

exports.TagValidator = [
    check('name')
    .trim().notEmpty()
    .withMessage('Name is required')
]