const express = require('express')
const router = express.Router()
const Product = require('../models/product')

// getting all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find()
        res.json(products)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// getting one product
router.get('/:id', getProduct, (req, res) => {
    res.json(res.product)
})

// creating one product
router.post('/', async (req, res) => {
    const product = new Product({
        name: req.body.name,
        buildId: req.body.buildId,
    })

    try {
        const newProduct = await product.save()
        // always use 201 for post, to show successful creation of data
        res.status(201).json(newProduct)
    } catch (err) {
        // 400 error for client side error
        res.status(400).json({ message: err.message })
    }
})

// updating one product, .patch will online update the schema based on the information passed in
// .post will replace the entire document
router.patch('/:id', getProduct, async (req, res) => {
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
        res.status(400).json({ message: err.message })
    }
})

// deleting one product
router.delete('/:id', getProduct, async (req, res) => {
    try {
        await res.product.remove()
        res.json({ message: "Deleted product data" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// middleware
async function getProduct(req, res, next) {
    let product
    try {
        product = await (Product.findById(req.params.id))
        if (product == null) {
            // 404, item not found
            return res.status(404).json({ message: "Cannot find product data" })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.product = product
    next()
}

module.exports = router