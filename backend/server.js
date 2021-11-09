require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = process.env.PORT
const cors = require('cors')
app.use(cors())

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())

const coveragedataRouter = require('./routes/coveragedatas')

app.use('/coveragedata', coveragedataRouter)

app.listen(port, () => { console.log(`Currently listening on port ${port}`) })

/*
NOTES
- Import REST Client plugin for .rest/.http api calls testing (route.rest)
-
*/