const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    buildId: {
        type: String,
        required: true
    },
    listOfFeatures: {
        // list of Feature's ObjectId
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Feature"
        }],
        default: []
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

const Product = mongoose.model('Product', productSchema)
module.exports = Product