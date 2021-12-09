import chai from "chai";
import chaiHttp from "chai-http";
import models from "../src/models/index";
import app from "../src/server";
import { statusCodes } from "../src/utils/httpResponses";
import handleTestError from './utils/handleTestError';
import { validFeature1, validFeature2 } from './utils/dummyData';
import { validateFeature } from "./utils/validationMethods";

chai.use(chaiHttp);
chai.should();

const { Product, Feature, Testcase } = models;

const route = "/feature";

// Clear database on each run
const cleanup = async () => {
    await Testcase.deleteMany({});
    await Feature.deleteMany({});
    await Product.deleteMany({});

};

describe(`POST ${route}`, () => {
    let product_id;
    let feature_id;
    before(async () => {
        const product = await Product.create({ name: "ACAMEP", buildId: "DST_H040", listOfFeatures: [] });
        product_id = product._id;
    });
    it("SUCCESS: Add a validFeature1 to database", done => {
        chai.request(app)
            .post(`${route}/${product_id}`)
            .send(validFeature1)
            .then(result => {
                result.should.have.status(statusCodes.createContent);
                result.body.feature_coverage.should.equal(0);
                validateFeature(result.body, validFeature1);
                // set feature_id to check if it is added to Product's listOfFeatures
                feature_id = result.body._id;
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });
    it("ERROR: name is a required field for Feature", done => {
        chai.request(app)
            .post(`${route}/${product_id}`)
            .send({})
            .then(result => {
                result.should.have.status(statusCodes.badRequest);
                result.error.text.should.equal("Feature validation failed: name: Path `name` is required.");
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });
    it("SUCCESS: Feature Object Id is added to Product", done => {
        chai.request(app)
            .get(`/product/${product_id}`)
            .then(result => {
                result.should.have.status(statusCodes.ok);
                result.body.listOfFeatures.should.include(feature_id);
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });
    after(async () => {
        await cleanup();
    });
});

describe(`GET ${route}`, () => {
    let product_id;
    let feature_id;
    before(async () => {
        const product = await Product.create({ name: "ACAMEP", buildId: "DST_H040", listOfFeatures: [] });
        product_id = product._id;
    });
    it("SUCCESS: Add a validFeature1 to database", done => {
        chai.request(app)
            .post(`${route}/${product_id}`)
            .send(validFeature1)
            .then(result => {
                result.should.have.status(statusCodes.createContent);
                result.body.feature_coverage.should.equal(0);
                validateFeature(result.body, validFeature1);
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });
    it("SUCCESS: Add a validFeature2 to database", done => {
        chai.request(app)
            .post(`${route}/${product_id}`)
            .send(validFeature2)
            .then(result => {
                result.should.have.status(statusCodes.createContent);
                result.body.feature_coverage.should.equal(0);
                validateFeature(result.body, validFeature2);
                // set feature_id for GET test below
                feature_id = result.body._id;
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });
    it("SUCCESS: Gets all Features in the database", done => {
        chai.request(app)
            .get(`${route}`)
            .then(result => {
                result.should.have.status(statusCodes.ok);
                result.body.should.have.length(2);
                validateFeature(result.body[0], validFeature1);
                validateFeature(result.body[1], validFeature2);
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });
    it("SUCCESS: Gets all Features in the database by product_id", done => {
        chai.request(app)
            .get(`${route}/product/${product_id}`)
            .then(result => {
                result.should.have.status(statusCodes.ok);
                result.body.should.have.length(2);
                validateFeature(result.body[0], validFeature1);
                validateFeature(result.body[1], validFeature2);
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });
    it("SUCCESS: Gets a single Feature in the database by feature_id", done => {
        chai.request(app)
            .get(`${route}/${feature_id}`)
            .then(result => {
                result.should.have.status(statusCodes.ok);
                validateFeature(result.body, validFeature2);
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });
    after(async () => {
        await cleanup();
    });
});

describe(`DELETE ${route}`, () => {
    let product_id;
    let feature_id;
    before(async () => {
        const product = await Product.create({ name: "ACAMEP", buildId: "DST_H040", listOfFeatures: [] });
        product_id = product._id;
    });
    it("SUCCESS: Add a validFeature1 to database", done => {
        chai.request(app)
            .post(`${route}/${product_id}`)
            .send(validFeature1)
            .then(result => {
                result.should.have.status(statusCodes.createContent);
                result.body.feature_coverage.should.equal(0);
                validateFeature(result.body, validFeature1);
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });
    it("SUCCESS: Add a validFeature2 to database", done => {
        chai.request(app)
            .post(`${route}/${product_id}`)
            .send(validFeature2)
            .then(result => {
                result.should.have.status(statusCodes.createContent);
                result.body.feature_coverage.should.equal(0);
                validateFeature(result.body, validFeature2);
                // set feature_id for GET test below
                feature_id = result.body._id;
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });
    it("SUCCESS: Deletes validFeature2 from the database", done => {
        chai.request(app)
            .delete(`${route}/${feature_id}`)
            .then(result => {
                result.should.have.status(statusCodes.ok);
                result.text.should.equal(`Deleted feature (${validFeature2.name}) data`);
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });
    it("SUCCESS: Retrieves validFeature1 from the database", done => {
        chai.request(app)
            .get(`${route}`)
            .then(result => {
                result.should.have.status(statusCodes.ok);
                // result body is an array with only 1 element
                result.body.should.have.length(1);
                validateFeature(result.body[0], validFeature1);
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });
    it("SUCCESS: Deletes validFeature1 from the database by referencing product_id", done => {
        chai.request(app)
            .delete(`${route}/product/${product_id}`)
            .then(result => {
                result.should.have.status(statusCodes.ok);
                result.text.should.equal(`Deleted all feature data related to the specific product (ACAMEP)`);
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });
    after(async () => {
        await cleanup();
    });
});
