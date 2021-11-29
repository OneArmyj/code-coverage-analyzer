import { Router } from "express"
import models from "../models/index"
import { statusCodes } from "../utils/httpResponses"
import { checkProductExist, checkFeatureExist, checkTestcaseExist, updateFeatureCoverage } from "../utils/helper"

const router = Router()
const { Feature, Testcase } = models

// GET all testcases in DB
router.get('/', async (req, res) => {
    try {
        const testcases = await Testcase.find()
        res.status(statusCodes.ok).json(testcases)
    } catch (err) {
        res.status(statusCodes.internalServerError).json({ message: err.message })
    }
})

// GET all testcases of a product
router.get('/product/:product_id', checkProductExist, async (req, res) => {
    try {
        const testcases = await Testcase.find({ product_id: res.product._id })
        res.status(statusCodes.ok).json(testcases)
    } catch (err) {
        res.status(statusCodes.internalServerError).json({ message: err.message })
    }
})

// GET all testcases of a feature
router.get('/feature/:feature_id', checkFeatureExist, async (req, res) => {
    try {
        const testcases = await Testcase.find({
            product_id: res.feature.product_id,
            coverageByFeatures: { $elemMatch: { feature: res.feature.name } }
        })

        res.status(statusCodes.ok).json(testcases)
    } catch (err) {
        res.status(statusCodes.internalServerError).json({ message: err.message })
    }
})

// GET one testcase
router.get('/:testcase_id', checkTestcaseExist, async (req, res) => {
    res.status(statusCodes.ok).json(res.testcase)
})

// POST testcases to an existing product
router.post('/:product_id', checkProductExist, async (req, res) => {
    // Need check if any existing testcase covered the feature, if so compute feature_coverage
    let newTestcases = []
    const data = req.body.data

    for (let i = 0; i < data.length; i++) {
        const testcase = new Testcase({
            product_id: req.params.product_id,
            name: data[i].name,
            description: data[i].description,
            coverageByFeatures: data[i].coverageByFeatures
        })

        try {
            newTestcases.push(await testcase.save())
        } catch (err) {
            res.status(statusCodes.badRequest).json({ message: err.message })
        }
    }
    updateFeatureCoverage(req.params.product_id)

    res.status(statusCodes.createContent).json(newTestcases)
})

// PATCH one testcase, .patch will online update the schema based on the information passed in
// .post will replace the entire document
// Only name, description and can be updated for a testcase
router.patch('/:testcase_id', checkTestcaseExist, async (req, res) => {
    if (req.body.name != null) {
        res.testcase.name = req.body.name
    }
    if (req.body.description != null) {
        res.testcase.description = req.body.name
    }
    if (req.body.coverageByFeatures != null) {
        res.testcase.coverageByFeatures = req.body.coverageByFeatures
    }

    try {
        const updatedTestcase = await res.testcase.save()
        updateFeatureCoverage(res.testcase.product_id)
        res.status(statusCodes.ok).json(updatedTestcase)
    } catch (err) {
        res.status(statusCodes.badRequest).json({ message: err.message })
    }
})

// DELETE all testcases for a product, need to update feature coverage in Feature
router.delete('/product/:product_id', checkProductExist, async (req, res) => {
    try {
        await Testcase.deleteMany({ product: req.params.product_id })
        updateFeatureCoverage(req.params.product_id)
        res.status(statusCodes.ok).json({ message: "Deleted all testcase data related to the specific Product" })
    } catch (err) {
        res.status(statusCodes.internalServerError).json({ message: err.message })
    }
})

// DELETE one testcase, need to update feature coverage in Feature
router.delete('/:testcase_id', checkTestcaseExist, async (req, res) => {
    try {
        await res.testcase.remove()
        updateFeatureCoverage(res.testcase.product_id)
        res.status(statusCodes.ok).json({ message: "Deleted feature data" })
    } catch (err) {
        res.status(statusCodes.internalServerError).json({ message: err.message })
    }
})

export default router