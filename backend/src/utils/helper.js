import { statusCodes } from "./httpResponses"

const Product = require("../models/product")
const Feature = require("../models/feature")

// Checks if a product with the corresponding product_id exists in DB
export async function checkProductExist(req, res, next) {
    let product
    try {
        product = await (Product.findById(req.params.product_id))
        if (product == null) {
            // 404, item not found
            return res.status(statusCodes.notFound).json({ message: "Cannot find product data" })
        }
    } catch (err) {
        return res.status(statusCodes.internalServerError).json({ message: err.message })
    }
    res.product = product
    next()
}

// Checks if a feature with the corresponding feature_id exists in DB
export async function checkFeatureExist(req, res, next) {
    let feature
    try {
        feature = await (Feature.findById(req.params.feature_id))
        if (feature == null) {
            // 404, item not found
            return res.status(statusCodes.notFound).json({ message: "Cannot find feature data" })
        }
    } catch (err) {
        return res.status(statusCodes.internalServerError).json({ message: err.message })
    }
    res.feature = feature
    next()
}
