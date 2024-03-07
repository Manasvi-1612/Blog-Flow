const {check} = require('express-validator')

exports.categoryCreateValidator = [
    check('name')
    .trim().notEmpty()
    .withMessage('Name is required')
]