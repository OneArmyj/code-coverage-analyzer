const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

require('dotenv').config()

const app = express()
const port = process.env.PORT

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to Database'))

app.use(cors())
app.use(express.json())

const productRouter = require('./routes/product')
const featureRouter = require('./routes/feature')

app.use('/product', productRouter)
app.use('/feature', featureRouter)

app.listen(port || 3001, () => { console.log(`Currently listening on port ${port}`) })
