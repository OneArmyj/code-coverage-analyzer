import mongoose from "mongoose";

const Schema = mongoose.Schema;

const testcaseSchema = new Schema({
    product_id: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    feature_id: {
        type: Schema.Types.ObjectId,
        ref: "Feature",
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
    line_coverage: {
        type: Number,
        required: true
    }
});

const Testcase = mongoose.model('Testcase', testcaseSchema);
export default Testcase;