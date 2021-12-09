import { Router } from "express";
import models from "../models/index";
import { statusCodes } from "../utils/httpResponses";
import { checkProductExist, checkFeatureExist, checkTestcaseExist, checkUniqueTestcase } from "../utils/helper";
import Feature from "../models/feature";

const router = Router();
const { Testcase } = models;

// GET all testcases in DB
router.get('/', async (req, res) => {
    try {
        const testcases = await Testcase.find();
        res.status(statusCodes.ok).json(testcases);
    } catch (err) {
        res.status(statusCodes.internalServerError).send(err.message);
    }
});

// GET all testcases of a product
router.get('/product/:product_id', checkProductExist, async (req, res) => {
    try {
        const testcases = await Testcase.find({ product_id: res.product._id });
        res.status(statusCodes.ok).json(testcases);
    } catch (err) {
        res.status(statusCodes.internalServerError).send(err.message);
    }
});

// GET all testcases of a feature
router.get('/feature/:feature_id', checkFeatureExist, async (req, res) => {
    try {
        const testcases = await Testcase.find({ feature_id: res.feature._id });
        res.status(statusCodes.ok).json(testcases);
    } catch (err) {
        res.status(statusCodes.internalServerError).send(err.message);
    }
});

// GET one testcase
router.get('/:testcase_id', checkTestcaseExist, async (req, res) => {
    res.status(statusCodes.ok).json(res.testcase);
});

// POST testcases to an existing product
router.post('/:product_id', checkProductExist, checkUniqueTestcase, async (req, res) => {
    let newTestcases = [];
    const data = req.body.data;

    for (let i = 0; i < data.length; i++) {
        const feature_name = data[i].feature;
        const feature_to_update = await Feature.findOne({ product_id: req.params.product_id, name: feature_name });
        const testcase = new Testcase({
            product_id: req.params.product_id,
            feature_id: feature_to_update._id,
            name: data[i].name,
            description: data[i].description,
            line_coverage: data[i].line_coverage
        });

        feature_to_update.feature_coverage += data[i].line_coverage;
        feature_to_update.listOfTestcases.push(testcase._id);

        try {
            await feature_to_update.save();
            newTestcases.push(await testcase.save());
        } catch (err) {
            res.status(statusCodes.badRequest).send(err.message);
        }
    }

    res.status(statusCodes.createContent).json(newTestcases);
});

// PATCH one testcase, .patch will online update the schema based on the information passed in
// .post will replace the entire document
// Only name, description and can be updated for a testcase
router.patch('/:testcase_id', checkTestcaseExist, async (req, res) => {
    if (req.body.name != null) {
        res.testcase.name = req.body.name;
    }
    if (req.body.description != null) {
        res.testcase.description = req.body.name;
    }

    try {
        const updatedTestcase = await res.testcase.save();
        res.status(statusCodes.ok).json(updatedTestcase);
    } catch (err) {
        res.status(statusCodes.badRequest).send(err.message);
    }
});

// DELETE all testcases for a product, need to update feature coverage in Feature
router.delete('/product/:product_id', checkProductExist, async (req, res) => {
    try {
        await Testcase.deleteMany({ product: req.params.product_id });
        await Feature.updateMany({ product_id: req.params.product_id }, { $set: { feature_coverage: 0, listOfTestcases: [] } });
        res.status(statusCodes.ok).send("Deleted all testcase data related to the specific Product");
    } catch (err) {
        res.status(statusCodes.internalServerError).send(err.message);
    }
});

// DELETE one testcase, need to update feature coverage in Feature
router.delete('/:testcase_id', checkTestcaseExist, async (req, res) => {
    try {
        const feature_to_update = await Feature.findOne({ _id: res.testcase.feature_id });
        feature_to_update.listOfTestcases = feature_to_update.listOfTestcases.filter(x => x != req.params.testcase_id);
        feature_to_update.feature_coverage -= res.testcase.line_coverage;
        await feature_to_update.save();
        await res.testcase.remove();
        res.status(statusCodes.ok).send("Deleted testcase data");
    } catch (err) {
        res.status(statusCodes.internalServerError).send(err.message);
    }
});

export default router;