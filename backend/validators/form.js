const { check } = require('express-validator')

exports.contactFormValidator = [
    check('name')
        .trim().notEmpty()
        .withMessage('Name is required'),
    check('email')
        .isEmail()
        .withMessage('Must be valid email address'),
    check('message')
        .trim().notEmpty()
        .isLength({ min: 10 })
        .withMessage('Message must be atleast 10 characters long')
]