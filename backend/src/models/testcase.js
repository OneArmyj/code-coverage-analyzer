import mongoose from "mongoose"

const Schema = mongoose.Schema

const testcaseSchema = new Schema({
    product_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    coverageByFeatures: {
        // Object mappings of "Feature Name" : CoverageOfFeature
        type: Object,
        required: true
    }
})

const Testcase = mongoose.model('Testcase', testcaseSchema)
export default Testcase