import { Router } from "express";
import models from "../models/index";
import { statusCodes } from "../utils/httpResponses";
import { checkProductExist, checkFeatureExist, updateFeatureCoverage } from "../utils/helper";

const router = Router();
const { Product, Feature } = models;

// GET all features in DB
router.get('/', async (req, res) => {
    try {
        const features = await Feature.find();
        res.status(statusCodes.ok).json(features);
    } catch (err) {
        res.status(statusCodes.internalServerError).json({ message: err.message });
    }
});

// GET all features of a product
router.get('/product/:product_id', checkProductExist, async (req, res) => {
    try {
        const features = await Feature.find({ product_id: res.product._id });
        res.status(statusCodes.ok).json(features);
    } catch (err) {
        res.status(statusCodes.internalServerError).json({ message: err.message });
    }
});

// GET one feature
router.get('/:feature_id', checkFeatureExist, async (req, res) => {
    res.status(statusCodes.ok).json(res.feature);
});

// POST one feature to an existing product
router.post('/:product_id', checkProductExist, async (req, res) => {
    // Check if feature already exist in product
    const duplicateFeature = await Feature.findOne({ product_id: req.params.product_id, name: req.body.name });
    if (duplicateFeature != null) {
        res.status(statusCodes.badRequest).json({ message: `The feature you want to add (${req.body.name}) already exists for the product (${res.product.name})` });
        return;
    }

    const feature = new Feature({
        product_id: req.params.product_id,
        name: req.body.name,
    });
    res.product.listOfFeatures.push(feature._id);

    try {
        await res.product.save();
        await feature.save();
        // Need check if any existing testcase covered the feature, if so compute feature_coverage
        await updateFeatureCoverage(req.params.product_id);
        const newFeature = await Feature.find({ _id: feature._id });
        res.status(statusCodes.createContent).json(newFeature);
    } catch (err) {
        res.status(statusCodes.badRequest).json({ message: err.message });
    }
});

// TO EDIT A FEATURE, YOU HAVE TO DELETE AND ADD THE FEATURE AGAIN
// NO PATCH METHOD FOR FEATURES

// DELETE all features for a product, need delete it from product as well
router.delete('/product/:product_id', checkProductExist, async (req, res) => {
    try {
        await Product.updateOne({ _id: req.params.product_id }, { $set: { listOfFeatures: [] } });
        await Feature.deleteMany({ product_id: req.params.product_id });
        res.status(statusCodes.ok).json({ message: `Deleted all feature data related to the specific product (${res.product.name})` });
    } catch (err) {
        res.status(statusCodes.internalServerError).json({ message: err.message });
    }
});

// DELETE one feature, need delete it from product as well
router.delete('/:feature_id', checkFeatureExist, async (req, res) => {
    try {
        const product = await Product.findById(res.feature.product_id);
        product.listOfFeatures = product.listOfFeatures.filter(x => x != req.params.feature_id);
        await product.save();
        const removedFeature = await res.feature.remove();
        res.status(statusCodes.ok).json({ message: `Deleted feature (${removedFeature.name}) data` });
    } catch (err) {
        res.status(statusCodes.internalServerError).json({ message: err.message });
    }
});

export default router;