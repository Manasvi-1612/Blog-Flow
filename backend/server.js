const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
require('dotenv').config()

//app
const app = express()

//db
mongoose.connect(process.env.DATABASE).then(() => {
    console.log('DB connected')
})

//middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())

// if (process.env.NODE_ENV == 'development') {
//   app.use(cors({origin: [`${process.env.CLIENT_URL}`,`http://192.168.145.70:3000`]}))
// app.use(cors({
//     origin: `${process.env.CLIENT_URL}`,

//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Origin', 'Accept',  'Authorization'],
//     credentials: true
// }))
// }

app.use(cors({
    origin: `${process.env.CLIENT_URL}`
}))

//router middleware
app.use('/api', require('./routes/blog'))
app.use('/api', require('./routes/auth'))
app.use('/api', require('./routes/user'))
app.use('/api', require('./routes/category'))
app.use('/api', require('./routes/tag'))
app.use('/api', require('./routes/form'))
// app.get('/api', (req, res) => {
//     res.json({ time: Date().toString() })
// })


const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
