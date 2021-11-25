import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import routes from "./routes"

require('dotenv').config()

const app = express()
const port = process.env.PORT || 3001

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to Database'))

app.use(cors())
app.use(express.json())

app.use('/product', routes.productRouter)
app.use('/feature', routes.featureRouter)
app.use('/testcase', routes.testcaseRouter)

app.listen(port || 3001, () => { console.log(`Currently listening on port ${port}`) })
