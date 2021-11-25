import mongoose from "mongoose"

const Schema = mongoose.Schema

const featureSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    feature_coverage: {
        type: Number,
        default: 0
    }
})

const Feature = mongoose.model('Feature', featureSchema)
export default Feature