import { statusCodes } from "./httpResponses";
import models from "../models/index";

const { Product, Feature, Testcase } = models;

// Check for duplicates in an array
export function checkIfDuplicateExists(arr) {
    return new Set(arr).size !== arr.length;
}

// Checks if a product with the corresponding product_id exists in DB
// If exist, store in res.product
export async function checkProductExist(req, res, next) {
    let product;
    try {
        product = await Product.findById(req.params.product_id);
        if (product == null) {
            return res.status(statusCodes.notFound).send("Cannot find product data");
        }
    } catch (err) {
        return res.status(statusCodes.internalServerError).send(err.message);
    }
    res.product = product;
    next();
}

// Checks if a feature with the corresponding feature_id exists in DB
// If exist, store in res.feature
export async function checkFeatureExist(req, res, next) {
    let feature;
    try {
        feature = await Feature.findById(req.params.feature_id);
        if (feature == null) {
            return res.status(statusCodes.notFound).send("Cannot find feature data");
        }
    } catch (err) {
        return res.status(statusCodes.internalServerError).send(err.message);
    }
    res.feature = feature;
    next();
}

// Checks if a testcase with the corresponding testcase_id exists in DB
// If exist, store in res.testcase
export async function checkTestcaseExist(req, res, next) {
    let testcase;
    try {
        testcase = await Testcase.findById(req.params.testcase_id);
        if (testcase == null) {
            return res.status(statusCodes.notFound).send("Cannot find testcase data");
        }
    } catch (err) {
        return res.status(statusCodes.internalServerError).send(err.message);
    }
    res.testcase = testcase;
    next();
}

// Check if there is an existing feature_name in the product document
// Used in post method for feature
export async function checkUniqueFeature(req, res, next) {
    try {
        const exist = await Feature.findOne({ product_id: req.params.product_id, name: req.body.name });
        if (exist != null) {
            return res.status(statusCodes.badRequest).send(`The feature you want to add (${req.body.name}) already exists for the product (${res.product.name} - ${res.product.buildId})`);
        }
    } catch (err) {
        return res.status(statusCodes.internalServerError).send(err.message);
    }

    next();
}

// Check if the feature specified exists, and that there is an existing testcase_name in the feature document
// Used in post method for testcase
export async function checkUniqueTestcase(req, res, next) {
    const data = req.body.data;
    try {
        for (let i = 0; i < data.length; i++) {
            const feature = await Feature.findOne({ name: data[i].feature });
            if (feature == null) {
                return res.status(statusCodes.badRequest).send(`The feature (${data[i].feature}) specified in the testcase you want to add (${data[i].name}) does not exist`);
            }
            const exist = await Testcase.findOne({ name: data[i].name, feature_id: feature._id });
            if (exist != null) {
                return res.status(statusCodes.badRequest).send(`The testcase you want to add (${data[i].name}) already exists for the feature (${feature.name})`);
            }
        }
    } catch (err) {
        return res.status(statusCodes.internalServerError).send(err.message);
    }

    next();
}
