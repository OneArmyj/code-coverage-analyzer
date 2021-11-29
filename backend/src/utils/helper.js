import { statusCodes } from "./httpResponses"
import models from "../models/index"

const { Product, Feature, Testcase } = models

// Check for duplicates in an array
export function checkIfDuplicateExists(arr) {
    return new Set(arr).size !== arr.length
}

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

// To be used when adding/ deleting/ updating Testcases
// To be used when adding/ updating Features
export async function updateFeatureCoverage(product_id) {
    // find all features belonging to the product_id
    // for every feature, find the testcases that still exist that test it and sum it
    const featuresToUpdate = await Feature.find({ product_id: product_id })

    for (let i = 0; i < featuresToUpdate.length; i++) {
        const newFeatureCoverage = await Testcase.aggregate([
            { $unwind: "$coverageByFeatures" },
            { $match: { "product_id": product_id, "coverageByFeatures.feature": featuresToUpdate[i].name } },
            { $group: { _id: "$coverageByFeatures.feature", feature_coverage: { $sum: "$coverageByFeatures.coverage" } } }
        ])

        console.log(newFeatureCoverage)

        // if array is empty, hence no feature coverage is present in all testcases
        if (!newFeatureCoverage.length) {
            featuresToUpdate[i].feature_coverage = 0
        } else {
            featuresToUpdate[i].feature_coverage = newFeatureCoverage[0].feature_coverage
        }

        try {
            await featuresToUpdate[i].save()
        } catch (err) {
            console.log(err.message)
        }
    }

    console.log("Feature coverage data is updated!")
}