const mongoose = require('mongoose')
const Schema = mongoose.Schema

const testcaseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    coverage: {
        type: Number,
        required: true
    }
})

const Testcase = mongoose.model('Testcase', testcaseSchema)
module.exports = Testcase