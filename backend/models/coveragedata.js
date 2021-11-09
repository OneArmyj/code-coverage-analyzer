const mongoose = require('mongoose')

const coveragedataSchema = new mongoose.Schema({
    product: {
        type: String,
        required: true
    },
    buildId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    lineCoverage: {
        type: Number,
        required: true,
        default: 0
    }
})

module.exports = mongoose.model('CoverageData', coveragedataSchema)