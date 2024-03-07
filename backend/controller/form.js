"use strict";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_APP_PASSWORD
    }
});

exports.contactForm = async (req, res) => {

    const { name, email, subject, message } = req.body

    const mailOptions = {
        from: email,
        to: process.env.MAIL_USER,
        subject: `Message form ${email} ${subject ? `subject: ${subject}` : ''}`,
        text: message
    }

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err)
            res.status(500).json('Error while sending an email')
        } else {
            console.log("Message sent", info.response)
            res.status(200).json('Email sent successfully')
        }
    })

}

exports.authorContactForm = async (req, res) => {

    const { authorMail, name, email, subject, message } = req.body

    const mailOptions = {
        from: `Contact Info ${email}`,
        to: authorMail,
        subject: `Message form ${email} ${subject ? `subject: ${subject}` : ''}`,
        text: message
    }

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err)
            res.status(500).json('Error while sending an email')
        } else {
            console.log("Message sent", info.response)
            res.status(200).json('Email sent successfully')
        }
    })

}
