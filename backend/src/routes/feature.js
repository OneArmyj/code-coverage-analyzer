import { Router } from "express"
import models from "../models/index"
import { statusCodes } from "../utils/httpResponses"
import { checkProductExist, checkFeatureExist } from "../utils/helper"

const router = Router()
const { Product, Feature, Testcase } = models

// GET all features in DB
router.get('/', async (req, res) => {
    try {
        const features = await Feature.find()
        res.status(statusCodes.ok).json(features)
    } catch (err) {
        res.status(statusCodes.internalServerError).json({ message: err.message })
    }
})

// GET all features of a product
router.get('/product/:product_id', checkProductExist, async (req, res) => {
    try {
        const features = await Feature.find({ product_id: res.product._id })
        res.status(statusCodes.ok).json(features)
    } catch (err) {
        res.status(statusCodes.internalServerError).json({ message: err.message })
    }
})

// GET one feature
router.get('/:feature_id', checkFeatureExist, async (req, res) => {
    res.status(statusCodes.ok).json(res.feature)
})

// POST one feature to an existing product
router.post('/:product_id', checkProductExist, async (req, res) => {
    // Need check if any existing testcase covered the feature, if so compute feature_coverage
    const feature = new Feature({
        product_id: req.params.product_id,
        name: req.body.name,
    })
    res.product.listOfFeatures.push(feature._id)

    try {
        await res.product.save()
        const newFeature = await feature.save()
        res.status(statusCodes.createContent).json(newFeature)
    } catch (err) {
        res.status(statusCodes.badRequest).json({ message: err.message })
    }
})

// PATCH one feature, .patch will online update the schema based on the information passed in
// .post will replace the entire document
// Only name can be updated for a feature
router.patch('/:feature_id', checkFeatureExist, async (req, res) => {
    if (req.body.name != null) {
        res.feature.name = req.body.name
    }

    try {
        const updatedFeature = await res.feature.save()
        res.status(statusCodes.ok).json(updatedFeature)
    } catch (err) {
        res.status(statusCodes.badRequest).json({ message: err.message })
    }
})

// DELETE all features for a product, need delete it from product as well
router.delete('/product/:product_id', checkProductExist, async (req, res) => {
    try {
        await Product.updateOne({ _id: req.params.product_id }, { $set: { listOfFeatures: [] } })
        await Feature.deleteMany({ product_id: req.params.product_id })
        res.status(statusCodes.ok).json({ message: "Deleted all feature data related to the specific Product" })
    } catch (err) {
        res.status(statusCodes.internalServerError).json({ message: err.message })
    }
})

// DELETE one feature, need delete it from product as well
router.delete('/:feature_id', checkFeatureExist, async (req, res) => {
    try {
        const product = await Product.findById(res.feature.product_id)
        product.listOfFeatures = product.listOfFeatures.filter(x => x != req.params.feature_id)
        await product.save()
        await res.feature.remove()
        res.status(statusCodes.ok).json({ message: "Deleted feature data" })
    } catch (err) {
        res.status(statusCodes.internalServerError).json({ message: err.message })
    }
})

export default router