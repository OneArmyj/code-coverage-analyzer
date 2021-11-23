const mongoose = require('mongoose')
const Schema = mongoose.Schema

const featureSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    listOfTestcases: {
        type: [{ type: Schema.Types.ObjectId, ref: "Testcase" }],
        default: []
    }
})

const Feature = mongoose.model('Feature', featureSchema)
module.exports = Feature