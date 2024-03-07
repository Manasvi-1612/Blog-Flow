const User = require('../models/user')
const shortId = require('shortid')
const jwt = require('jsonwebtoken')
const { expressjwt: JWT } = require('express-jwt')
const Blog = require('../models/blog')
const nodemailer = require("nodemailer");
const _ = require('lodash')
const { OAuth2Client } = require('google-auth-library')

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_APP_PASSWORD
    }
});

exports.preSignup = async (req, res) => {

    try {
        const { name, email, password } = req.body

        let user = await User.findOne({ email: email.toLowerCase() }).exec()
        if (user) {
            return res.status(400).json({
                error: "Email is already taken!"
            })
        }

        const token = jwt.sign({ name, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: '10m' })

        const mailOptions = {
            from: `noreplay`,
            to: email,
            subject: `Account activation link`,
            html: `
                <p>Please use the following link to activate your account</p>
                <p>${process.env.CLIENT_URL}/auth/account/activate/${token}</p>
                <hr/>
                <p>This email may contain sensitive information</p>
            `
        }

        try {

            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err)
                    res.status(500).json('Error while sending an email')
                } else {
                    console.log("Message sent", info.response)
                    res.status(200).json({ message: `Email has been sent to ${email}. Follow the instructions to activate your account.` })
                }
            })

        } catch (err) {
            console.log("err1", err)
            return res.status(400).json(err)
        }


    } catch (err) {
        console.log("err2", err)
        res.status(400).json({ error: err })
    }

}

// exports.signup = async (req, res) => {

//     try {
//         let user = await User.findOne({ email: req.body.email }).exec()
//         if (user) {
//             return res.status(400).json({
//                 error: "Email is already taken!"
//             })
//         }

//         const { name, email, password } = req.body

//         let username = shortId.generate()
//         let profile = `${process.env.CLIENT_URL}/profile/${username}`
//         let newUser = new User({ name, email, password, profile, username })

//         let success = await newUser.save()

//         // res.json({
//         //     user: success
//         // })
//         res.json({
//             message: "Signup success! Please signin"
//         })
//     } catch (err) {
//         res.status(400).json({ error: err })
//     }

// }

exports.signup = async (req, res) => {
    const token = req.body.token

    if (token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async function (err, decoded) {
            if (err) {
                return res.status(401).json({
                    error: 'Expired link. Signup again'
                })
            }

            const { name, email, password } = jwt.decode(token)

            let username = shortId.generate()
            let profile = `${process.env.CLIENT_URL}/profile/${username}`
            let newUser = new User({ name, email, password, profile, username })

            try {
                let success = await newUser.save()

                res.json({
                    message: "Signup success! Please signin"
                })
            } catch (err) {
                res.status(400).json({ error: err })
            }
        })
    }

}

exports.signin = async (req, res) => {

    try {

        //check if the user exists
        // const { email, password } = req.body
        let user = await User.findOne({ email: req.body.email }).exec()

        if (!user) {
            return res.status(400).json({
                error: "User with this email does not exist. Please signup"
            })
        }

        // authenticate
        if (!user.authenticate(req.body.password)) {
            return res.status(400).json({
                error: "Email and password do not match"
            })
        }

        //generate a token and send to client
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.cookie('token', token, { expiresIn: '1d' })

        const { _id, username, name, email, role } = user

        return res.json({
            token,
            user: { _id, username, name, email, role }
        })

    } catch (err) {
        return res.status(400).json({
            error: "Something went wrong"
        })
    }
}

exports.signout = (req, res) => {
    res.clearCookie('token')
    res.json({
        message: "Signout successfully"
    })
}


//middleware only for the logged in user (it'll compare the incoming token with the token in the env file, returns true if they match)
exports.requireSignin = JWT({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"]
});


//normal user
exports.authMiddleware = async (req, res, next) => {
    const authUserId = req.auth._id

    try {
        const user = await User.findById({ _id: authUserId }).exec()

        if (!user) {
            return res.status(400).json({
                error: 'User not found'
            })
        }

        req.profile = user
        next()
        // return req.profile

    } catch (err) {
        return res.status(400).json({
            error: "Something went wrong"
        })
    }
}

//for admin u have the role of 1
exports.adminMiddleware = async (req, res, next) => {
    const adminUserId = req.auth._id

    try {
        const user = await User.findById({ _id: adminUserId }).exec()

        if (!user) {
            return res.status(400).json({
                error: 'User not found'
            })
        }

        if (user.role !== 1) {
            return res.status(400).json({
                error: 'Admin resource. Access denied'
            })
        }

        req.profile = user
        next()

    } catch (err) {
        return res.status(400).json({
            error: "Something went wrong"
        })
    }
}

exports.canUpdateAndDelete = async (req, res, next) => {

    let slug = req.params.slug.toLowerCase()

    try {

        let data = await Blog.findOne({ slug }).exec()

        let authorizedUser = data.postedBy._id.toString() === req.profile._id.toString()

        if (!authorizedUser) {
            return res.status(400).json({
                error: 'You are not authorized'
            })
        }

        next()
    } catch (err) {

        console.log(err)
        return res.status(400).json({
            error: err
        })
    }
}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body

    try {
        let user = await User.findOne({ email }).exec()

        if (!user) {
            return res.status(401).json({
                error: 'User with this email does not exist'
            })
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, { expiresIn: '10m' })

        const mailOptions = {
            from: `noreplay ${email}`,
            to: email,
            subject: `Password reset link`,
            html: `
                <p>Please use the following link to reset your password</p>
                <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                <hr/>
                <p>This email may contain sensitive information</p>
            `
        }

        try {
            let data = await user.updateOne({ resetPasswordLink: token }).exec()

            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err)
                    res.status(500).json('Error while sending an email')
                } else {
                    console.log("Message sent", info.response)
                    res.status(200).json({ message: `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10min ` })
                }
            })

        } catch (err) {
            return res.status(400).json(err)
        }

    } catch (error) {
        return res.status(401).json({
            error: 'Something went wrong'
        })
    }
}

exports.resetPassword = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body

    if (resetPasswordLink) {

        jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, async function (err, decoded) {
            if (err) {
                return res.status(401).json({
                    error: 'Expired link. Try again'
                })
            }

            try {
                let user = await User.findOne({ resetPasswordLink }).exec()

                if (!user) {
                    return res.status(401).json({
                        error: 'Something went wrong. Try again'
                    })
                }

                const updatedFields = {
                    password: newPassword,
                    resetPasswordLink: ''
                }

                user = _.extend(user, updatedFields)

                try {
                    let data = await user.save()

                    return res.status(200).json({ message: 'Now you can login with new password' })
                } catch (error) {
                    return res.status(400).json({
                        error
                    })
                }
            } catch (error) {
                return res.status(400).json({
                    error
                })
            }

        })
    }
}

//google login
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
exports.googleLogin = (req, res) => {

    const idToken = req.body.tokenId
    client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID }).then(async (response) => {

        res.header('Access-Control-Allow-Origin', 'http://localhost:3000')

        // console.log("response", response)
        const { email_verified, name, email, jti } = response.payload
        if (email_verified) {

            let user = await User.findOne({ email }).exec()

            if (user) {
                // console.log(user)
                const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })

                res.cookie('token', token, { expiresIn: '1d' })
                const { _id, name, email, role, username } = user
                return res.json({ token, user: { _id, name, email, role, username } })

            } else {

                let username = shortId.generate()
                let profile = `${process.env.CLIENT_URL}/profile/${username}`
                let password = jti
                user = new User({ name, email, password, profile, username })

                try {

                    let data = await user.save()

                    const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, { expiresIn: '1d' })

                    res.cookie('token', token, { expiresIn: '1d' })
                    const { _id, name, email, role, username } = data
                    return res.json({ token, user: { _id, name, email, role, username } })

                } catch (err) {
                    res.status(400).json({ error: err })
                }
            }
        }
    })
}
