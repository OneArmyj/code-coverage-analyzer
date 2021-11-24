import { statusCodes } from "../utils/httpResponses"
import { checkProductExist } from "../utils/helper"

const express = require('express')
const router = express.Router()
const Product = require('../models/product')
const Feature = require('../models/feature')
var ObjectId = require('mongodb').ObjectId;

// getting all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find()
        res.status(statusCodes.ok).json(products)
    } catch (err) {
        res.status(statusCodes.internalServerError).json({ message: err.message })
    }
})

// getting one product
router.get('/:product_id', checkProductExist, (req, res) => {
    res.status(statusCodes.ok).json(res.product)
})

// creating one product
router.post('/', async (req, res) => {
    const product = new Product({
        name: req.body.name,
        buildId: req.body.buildId,
    })

    req.body.listOfFeatures.forEach(async featureName => {
        const featureId = ObjectId()
        product.listOfFeatures.push(featureId)
        const feature = new Feature({
            _id: featureId,
            product: product._id,
            name: featureName
        })
        try {
            await feature.save()
        } catch (err) {
            res.status(statusCodes.internalServerError).json({ message: err.message })
        }
    })

    try {
        const newProduct = await product.save()
        // always use 201 for post, to show successful creation of data
        res.status(statusCodes.createContent).json(newProduct)
    } catch (err) {
        // 400 error for client side error
        res.status(statusCodes.badRequest).json({ message: err.message })
    }
})

// updating one product, .patch will online update the schema based on the information passed in
// .post will replace the entire document
// Can only update the name and buildID of the product
router.patch('/:product_id', checkProductExist, async (req, res) => {
    if (req.body.name != null) {
        res.product.name = req.body.name
    }
    if (req.body.buildId != null) {
        res.product.buildId = req.body.buildId
    }

    try {
        const updatedProduct = await res.product.save()
        res.json(updatedProduct)
    } catch (err) {
        res.status(statusCodes.badRequest).json({ message: err.message })
    }
})

// delete everything in product collection, and all features related to it
router.delete('/', async (req, res) => {
    try {
        await Feature.deleteMany({})
        await Product.deleteMany({})
        res.status(statusCodes.ok).json({ message: "Deleted all product data" })
    } catch (err) {
        res.status(statusCodes.internalServerError).json({ message: err.message })
    }
})


// delete one product, and all features related to it
router.delete('/:product_id', checkProductExist, async (req, res) => {
    try {
        await Feature.deleteMany({ product: req.params.product_id })
        await Product.deleteOne({ _id: req.params.product_id })
        res.status(statusCodes.ok).json({ message: "Deleted product data" })
    } catch (err) {
        res.status(statusCodes.internalServerError).json({ message: err.message })
    }
})

module.exports = router