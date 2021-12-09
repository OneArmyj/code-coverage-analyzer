import { Router } from "express";
import models from "../models/index";
import { ObjectId } from "mongodb";
import { statusCodes } from "../utils/httpResponses";
import { checkProductExist, checkIfDuplicateExists } from "../utils/helper";

const router = Router();
const { Product, Feature, Testcase } = models;

// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate("listOfFeatures");
        res.status(statusCodes.ok).json(products);
    } catch (err) {
        res.status(statusCodes.internalServerError).send(err.message);
    }
});

// GET one product
router.get('/:product_id', checkProductExist, (req, res) => {
    res.status(statusCodes.ok).json(res.product);
});

// POST one product
router.post('/', async (req, res) => {
    const product = new Product({
        name: req.body.name,
        buildId: req.body.buildId,
    });

    // Checks if listOfFeatures is included in post request
    if (!req.body.hasOwnProperty("listOfFeatures")) {
        res.status(statusCodes.badRequest).send("listOfFeatures is a compulsory field");
        return;
    }

    // check if req.body.listOfFeatures contain any duplicates
    if (checkIfDuplicateExists(req.body.listOfFeatures)) {
        res.status(statusCodes.badRequest).send("Duplicate features found in listOfFeatures field");
        return;
    }

    req.body.listOfFeatures.forEach(async featureName => {
        const featureId = ObjectId();
        product.listOfFeatures.push(featureId);
        const feature = new Feature({
            _id: featureId,
            product_id: product._id,
            name: featureName
        });
        try {
            await feature.save();
        } catch (err) {
            res.status(statusCodes.internalServerError).send(err.message);
        }
    });

    try {
        const newProduct = await product.save();
        res.status(statusCodes.createContent).json(newProduct);
    } catch (err) {
        res.status(statusCodes.badRequest).send(err.message);
    }
});

// PATCH one product, .patch will online update the schema based on the information passed in
// .post will replace the entire document
// Only name and buildID can be updated for a product
router.patch('/:product_id', checkProductExist, async (req, res) => {
    if (req.body.name != null) {
        res.product.name = req.body.name;
    }
    if (req.body.buildId != null) {
        res.product.buildId = req.body.buildId;
    }

    try {
        const updatedProduct = await res.product.save();
        res.status(statusCodes.ok).json(updatedProduct);
    } catch (err) {
        res.status(statusCodes.badRequest).send(err.message);
    }
});

// DELETE everything in product collection, and all features and all testcases related to it
router.delete('/', async (req, res) => {
    try {
        await Testcase.deleteMany({});
        await Feature.deleteMany({});
        await Product.deleteMany({});
        res.status(statusCodes.ok).send("Deleted all product data");
    } catch (err) {
        res.status(statusCodes.internalServerError).send(err.message);
    }
});

// DELETE one product, and all features and testcases related to it
router.delete('/:product_id', checkProductExist, async (req, res) => {
    try {
        await Testcase.deleteMany({ product_id: req.params.product_id });
        await Feature.deleteMany({ product_id: req.params.product_id });
        const deletedProduct = await res.product.remove();
        res.status(statusCodes.ok).send(`Deleted product (${deletedProduct.name} - ${deletedProduct.buildId}) data`);
    } catch (err) {
        res.status(statusCodes.internalServerError).send(err.message);
    }
});

export default router;