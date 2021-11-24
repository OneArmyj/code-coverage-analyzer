import { statusCodes } from "../utils/httpResponses"
import { checkProductExist, checkFeatureExist } from "../utils/helper"

const express = require('express')
const router = express.Router()
const Feature = require('../models/feature')

// getting all features of a product
router.get('/:product_id', checkProductExist, async (req, res) => {
    try {
        const features = await Feature.find({ product: res.product._id })
        res.json(features)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// getting one feature
router.get('/:id', getFeature, (req, res) => {
    res.json(res.feature)
})

// creating one feature
router.post('/', async (req, res) => {
    const feature = new Feature({
        product: req.body.product,
        name: req.body.name,
    })

    try {
        const newFeature = await feature.save()
        // always use 201 for post, to show successful creation of data
        res.status(201).json(newFeature)
    } catch (err) {
        // 400 error for client side error
        res.status(400).json({ message: err.message })
    }
})

// updating one feature, .patch will online update the schema based on the information passed in
// .post will replace the entire document
router.patch('/:id', getFeature, async (req, res) => {
    if (req.body.name != null) {
        res.feature.name = req.body.name
    }

    try {
        const updatedFeature = await res.feature.save()
        res.json(updatedFeature)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// deleting one feature
router.delete('/:id', getFeature, async (req, res) => {
    try {
        await res.feature.remove()
        res.json({ message: "Deleted feature data" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// middleware
async function getFeature(req, res, next) {
    let feature
    try {
        feature = await (Feature.findById(req.params.id))
        if (feature == null) {
            // 404, item not found
            return res.status(404).json({ message: "Cannot find feature data" })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.feature = feature
    next()
}

module.exports = router