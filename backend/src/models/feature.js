import mongoose from "mongoose";

const Schema = mongoose.Schema;

const featureSchema = new Schema({
    product_id: {
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
    },
    listOfTestcases: {
        type: Array({
            type: Schema.Types.ObjectId,
            ref: "Testcase"
        }),
        default: []
    }
});

const Feature = mongoose.model('Feature', featureSchema);
export default Feature;