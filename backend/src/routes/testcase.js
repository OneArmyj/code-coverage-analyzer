const express = require('express')
const router = express.Router()
const Testcase = require('../models/testcase')

// getting all testcase 
router.get('/', async (req, res) => {
    try {
        const testcases = await Testcase.find()
        res.json(testcases)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// getting one testcase
router.get('/:id', getTestcase, (req, res) => {
    res.json(res.testcase)
})

// creating one testcase
router.post('/', async (req, res) => {
    const testcase = new Testcase({
        product_id: req.body.product_id,
        name: req.body.name,
        description: req.body.description,
        coverageByFeatures: req.body.coverageByFeatures
    })

    try {
        const newTestcase = await testcase.save()
        // always use 201 for post, to show successful creation of data
        res.status(201).json(newTestcase)
    } catch (err) {
        // 400 error for client side error
        res.status(400).json({ message: err.message })
    }
})

// updating one testcase, .patch will online update the schema based on the information passed in
// .post will replace the entire document
router.patch('/:id', getTestcase, async (req, res) => {
    if (req.body.name != null) {
        res.testcase.name = req.body.name
    }

    try {
        const updatedTestcase = await res.testcase.save()
        res.json(updatedTestcase)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// deleting one testcase
router.delete('/:id', getTestcase, async (req, res) => {
    try {
        await res.testcase.remove()
        res.json({ message: "Deleted testcase data" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// middleware
async function getTestcase(req, res, next) {
    let testcase
    try {
        testcase = await (Testcase.findById(req.params.id))
        if (testcase == null) {
            // 404, item not found
            return res.status(404).json({ message: "Cannot find testcase data" })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.testcase = testcase
    next()
}

module.exports = router