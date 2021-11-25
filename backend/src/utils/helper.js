import { statusCodes } from "./httpResponses"
import models from "../models/index"

const { Product, Feature, Testcase } = models

// Checks if a product with the corresponding product_id exists in DB
// If exist, store in res.product
export async function checkProductExist(req, res, next) {
    let product
    try {
        product = await Product.findById(req.params.product_id)
        if (product == null) {
            return res.status(statusCodes.notFound).json({ message: "Cannot find product data" })
        }
    } catch (err) {
        return res.status(statusCodes.internalServerError).json({ message: err.message })
    }
    res.product = product
    next()
}

// Checks if a feature with the corresponding feature_id exists in DB
// If exist, store in res.feature
export async function checkFeatureExist(req, res, next) {
    let feature
    try {
        feature = await Feature.findById(req.params.feature_id)
        if (feature == null) {
            return res.status(statusCodes.notFound).json({ message: "Cannot find feature data" })
        }
    } catch (err) {
        return res.status(statusCodes.internalServerError).json({ message: err.message })
    }
    res.feature = feature
    next()
}

// Checks if a testcase with the corresponding testcase_id exists in DB
// If exist, store in res.testcase
export async function checkTestcaseExist(req, res, next) {
    let testcase
    try {
        testcase = await Testcase.findById(req.params.testcase_id)
        if (testcase == null) {
            return res.status(statusCodes.notFound).json({ message: "Cannot find testcase data" })
        }
    } catch (err) {
        return res.status(statusCodes.internalServerError).json({ message: err.message })
    }
    res.testcase = testcase
    next()
}
