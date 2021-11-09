const express = require('express')
const router = express.Router()
const CoverageData = require('../models/coveragedata')

// getting all coveragedata
router.get('/', async (req, res) => {
    try {
        const coveragedatas = await CoverageData.find()
        res.json(coveragedatas)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// getting one coveragedata
router.get('/:id', getCoverageData, (req, res) => {
    res.send(res.coverageData.product)
})

// creating one coveragedata
router.post('/', async (req, res) => {
    const coveragedata = new CoverageData({
        product: req.body.product,
        buildId: req.body.buildId,
        // date: req.body.date,
        // lineCoverage: req.body.lineCoverage,
    })

    try {
        const newCoverageData = await coveragedata.save()
        // always use 201 for post, to show successful creation of data
        res.status(201).json(newCoverageData)
    } catch (err) {
        // 400 error for client side error
        res.status(400).json({ message: err.message })
    }
})

// updating one coveragedata, .patch will online update the schema based on the information passed in
// .post will replace the entire schema
router.patch('/:id', getCoverageData, async (req, res) => {
    if (req.body.product != null) {
        res.coverageData.product = req.body.product
    }
    if (req.body.buildId != null) {
        res.coverageData.buildId = req.body.buildId
    }

    try {
        const updatedCoverageData = await res.coverageData.save()
        res.json(updatedCoverageData)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// deleting one coveragedata
router.delete('/:id', getCoverageData, async (req, res) => {
    try {
        await res.coverageData.remove()
        res.json({ message: "Deleted coverage data" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// middleware
async function getCoverageData(req, res, next) {
    let coverageData
    try {
        coverageData = await (CoverageData.findById(req.params.id))
        if (coverageData == null) {
            // 404, item not found
            return res.status(404).json({ message: "Cannot find coverage data" })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.coverageData = coverageData
    next()
}

module.exports = router