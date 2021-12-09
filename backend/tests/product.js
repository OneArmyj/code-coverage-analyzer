import chai from "chai";
import chaiHttp from "chai-http";
import models from "../src/models/index";
import app from "../src/server";
import { statusCodes } from "../src/utils/httpResponses";
import handleTestError from './utils/handleTestError';
import { validProduct1, validProduct2, invalidProduct1_no_name, invalidProduct2_no_buildId, invalidProduct3_no_listOfFeatures, invalidProduct4_duplicate_features } from './utils/dummyData';
import { validateProduct } from "./utils/validationMethods";

chai.use(chaiHttp);
chai.should();

const { Product, Feature, Testcase } = models;

const route = "/product";

// Clear database on each run
const cleanup = async () => {
    await Testcase.deleteMany({});
    await Feature.deleteMany({});
    await Product.deleteMany({});
};

describe(`POST ${route}`, () => {
    before(async () => {
        await cleanup();
    });
    it("SUCCESS: Adds validProduct1 to database", done => {
        chai.request(app)
            .post(`${route}`)
            .send(validProduct1)
            .then(result => {
                result.should.have.status(statusCodes.createContent);
                validateProduct(result.body, validProduct1);
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });
    it("ERROR: name is a required field for Product", done => {
        chai.request(app)
            .post(`${route}`)
            .send(invalidProduct1_no_name)
            .then(result => {
                result.should.have.status(statusCodes.badRequest);
                result.error.text.should.equal("Product validation failed: name: Path `name` is required.");
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });
    it("ERROR: buildId is a required field for Product", done => {
        chai.request(app)
            .post(`${route}`)
            .send(invalidProduct2_no_buildId)
            .then(result => {
                result.should.have.status(statusCodes.badRequest);
                result.error.text.should.equal("Product validation failed: buildId: Path `buildId` is required.");
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });
    it("ERROR: listOfFeatures is a required field for Product", done => {
        chai.request(app)
            .post(`${route}`)
            .send(invalidProduct3_no_listOfFeatures)
            .then(result => {
                result.should.have.status(statusCodes.badRequest);
                result.error.text.should.equal("listOfFeatures is a compulsory field");
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });
    it("ERROR: Duplicate entries in listOfFeatures not allowed", done => {
        chai.request(app)
            .post(`${route}`)
            .send(invalidProduct4_duplicate_features)
            .then(result => {
                result.should.have.status(statusCodes.badRequest);
                result.error.text.should.equal("Duplicate features found in listOfFeatures field");
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });
});

describe(`GET ${route}`, () => {
    before(async () => {
        await cleanup();
    });
    it("SUCCESS: Adds validProduct1 to database", done => {
        chai.request(app)
            .post(`${route}`)
            .send(validProduct1)
            .then(result => {
                result.should.have.status(statusCodes.createContent);
                validateProduct(result.body, validProduct1);
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });
    it("SUCCESS: Adds validProduct2 to database", done => {
        chai.request(app)
            .post(`${route}`)
            .send(validProduct2)
            .then(result => {
                result.should.have.status(statusCodes.createContent);
                validateProduct(result.body, validProduct2);
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });
    it("SUCCESS: Gets all the Product in the database", done => {
        chai.request(app)
            .get(`${route}`)
            .then(result => {
                result.should.have.status(statusCodes.ok);
                result.body.should.have.length(2);
                validateProduct(result.body[0], validProduct1);
                validateProduct(result.body[1], validProduct2);
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });
});

describe(`DELETE ${route}`, () => {
    let product_id;
    before(async () => {
        await cleanup();
    });
    it("SUCCESS: Adds validProduct1 to database", done => {
        chai.request(app)
            .post(`${route}`)
            .send(validProduct1)
            .then(result => {
                result.should.have.status(statusCodes.createContent);
                // set product_id to test deleting single product
                product_id = result.body._id;
                validateProduct(result.body, validProduct1);
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });
    it("SUCCESS: Adds validProduct2 to database", done => {
        chai.request(app)
            .post(`${route}`)
            .send(validProduct2)
            .then(result => {
                result.should.have.status(statusCodes.createContent);
                validateProduct(result.body, validProduct2);
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });
    it("SUCCESS: Deletes validProduct1 from the database", done => {
        chai.request(app)
            .delete(`${route}/${product_id}`)
            .then(result => {
                result.should.have.status(statusCodes.ok);
                result.text.should.equal("Deleted product (ACAMEP - DST_H040) data");
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });
    it("SUCCESS: Retrieves validProduct2 from the database", done => {
        chai.request(app)
            .get(`${route}`)
            .then(result => {
                result.should.have.status(statusCodes.ok);
                // result body is an array with only 1 element
                result.body.should.have.length(1);
                validateProduct(result.body[0], validProduct2);
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });
    it("SUCCESS: Deletes all Products from the database", done => {
        chai.request(app)
            .delete(`${route}`)
            .then(result => {
                result.should.have.status(statusCodes.ok);
                result.text.should.equal("Deleted all product data");
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });
    it("SUCCESS: Retrieves empty array from the database", done => {
        chai.request(app)
            .get(`${route}`)
            .then(result => {
                result.should.have.status(statusCodes.ok);
                // result body is an empty array
                result.body.should.have.length(0);
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });
});