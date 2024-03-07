const { check } = require('express-validator')

exports.userSignupValidator = [
    check('name')
        .trim().notEmpty()
        .withMessage('Name is required'),
    check('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    check('password')
        .trim().notEmpty()
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters long')
]

exports.userSigninValidator = [
    check('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters long')
]

exports.forgotPasswordValidator = [
    check('email')
        .trim()
        .notEmpty()
        .isEmail()
        .withMessage('Must be a valid email address'),
]

exports.resetPasswordValidator = [
    check('newPassword')
        .trim()
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters long')
]