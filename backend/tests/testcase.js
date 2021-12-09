import chai from "chai";
import chaiHttp from "chai-http";
import models from "../src/models/index";
import app from "../src/server";
import { statusCodes } from "../src/utils/httpResponses";
import handleTestError from './utils/handleTestError';
import { validProduct1, validProduct2, validTestcase1, validTestcase2, invalidTestcase1_duplicate_test_name } from './utils/dummyData';
import { validateTestcase, validateProduct } from "./utils/validationMethods";

chai.use(chaiHttp);
chai.should();

const { Product, Feature, Testcase } = models;

const route = "/testcase";

// Clear database on each run
const cleanup = async () => {
    await Testcase.deleteMany({});
    await Feature.deleteMany({});
    await Product.deleteMany({});
};

describe(`POST ${route}`, () => {
    let product_id;
    before(async () => {
        await cleanup();
    });

    it("SUCCESS: Adds validProduct1 to database", done => {
        chai.request(app)
            .post(`/product`)
            .send(validProduct1)
            .then(result => {
                result.should.have.status(statusCodes.createContent);
                validateProduct(result.body, validProduct1);
                // set product_id
                product_id = result.body._id
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });

    it("SUCCESS: Adds validTestcase1 to database, link to validProduct1", done => {
        chai.request(app)
            .post(`${route}/${product_id}`)
            .send(validTestcase1)
            .then(result => {
                result.should.have.status(statusCodes.createContent);
                validateTestcase(result.body, validTestcase1.data);
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });

    it("ERROR: Duplicate testcases (same name) cannot be added to a Feature", done => {
        chai.request(app)
            .post(`${route}/${product_id}`)
            .send(invalidTestcase1_duplicate_test_name)
            .then(result => {
                result.should.have.status(statusCodes.badRequest);
                result.error.text.should.equal(`The testcase you want to add (TestcaseA) already exists for the feature (Wall)`);
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });
});

describe(`GET ${route}`, () => {
    let product_id;
    let product_id2;
    let feature_id;

    before(async () => {
        await cleanup();
    });

    it("SUCCESS: Adds validProduct1 to database", done => {
        chai.request(app)
            .post(`/product`)
            .send(validProduct1)
            .then(result => {
                result.should.have.status(statusCodes.createContent);
                validateProduct(result.body, validProduct1);
                // set product_id
                product_id = result.body._id
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });

    it("SUCCESS: Adds validTestcase1 to database, link to validProduct1", done => {
        chai.request(app)
            .post(`${route}/${product_id}`)
            .send(validTestcase1)
            .then(result => {
                result.should.have.status(statusCodes.createContent);
                validateTestcase(result.body, validTestcase1.data);
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });

    it("SUCCESS: Adds validTestcase2 to database, link to validProduct1", done => {
        chai.request(app)
            .post(`${route}/${product_id}`)
            .send(validTestcase2)
            .then(result => {
                result.should.have.status(statusCodes.createContent);
                validateTestcase(result.body, validTestcase2.data);
                // set feature_id
                feature_id = result.body[0].feature_id;
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });

    it("SUCCESS: Gets all Testcases in database", done => {
        chai.request(app)
            .get(`${route}`)
            .then(result => {
                result.should.have.status(statusCodes.ok);
                result.body.should.have.length(4);
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });

    it("SUCCESS: Gets all Testcases in database by feature_id", done => {
        chai.request(app)
            .get(`${route}/feature/${feature_id}`)
            .then(result => {
                result.should.have.status(statusCodes.ok);
                // 2 testcases were added for the feature Wall - TestcaseA and TestcaseD
                result.body.should.have.length(2);
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });

    it("SUCCESS: Adds validProduct2 to database", done => {
        chai.request(app)
            .post(`/product`)
            .send(validProduct2)
            .then(result => {
                result.should.have.status(statusCodes.createContent);
                validateProduct(result.body, validProduct2);
                // set product_id2
                product_id2 = result.body._id
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });

    it("ERROR: Adds validTestcase1 to database, link to validProduct2, fail because the features in validTestcase1 do not exist in validProduct2", done => {
        chai.request(app)
            .post(`${route}/${product_id2}`)
            .send(validTestcase1)
            .then(result => {
                result.should.have.status(statusCodes.badRequest);
                result.error.text.should.equal(`The feature (Wall) specified in the testcase you want to add (TestcaseA) does not exist`);
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });

    it("SUCCESS: Gets all Testcases in database belonging to validProduct1", done => {
        chai.request(app)
            .get(`${route}/product/${product_id}`)
            .then(result => {
                result.should.have.status(statusCodes.ok);
                result.body.should.have.length(4);
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });
});

describe(`DELETE ${route}`, () => {
    let product_id;
    let feature_id;
    let testcase_id;

    before(async () => {
        await cleanup();
    });

    it("SUCCESS: Adds validProduct1 to database", done => {
        chai.request(app)
            .post(`/product`)
            .send(validProduct1)
            .then(result => {
                result.should.have.status(statusCodes.createContent);
                validateProduct(result.body, validProduct1);
                // set product_id
                product_id = result.body._id
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });

    it("SUCCESS: Adds validTestcase1 to database, link to validProduct1", done => {
        chai.request(app)
            .post(`${route}/${product_id}`)
            .send(validTestcase1)
            .then(result => {
                result.should.have.status(statusCodes.createContent);
                validateTestcase(result.body, validTestcase1.data);
                // set testcase_id
                testcase_id = result.body[2]._id;
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });

    it("SUCCESS: Adds validTestcase2 to database, link to validProduct1", done => {
        chai.request(app)
            .post(`${route}/${product_id}`)
            .send(validTestcase2)
            .then(result => {
                result.should.have.status(statusCodes.createContent);
                validateTestcase(result.body, validTestcase2.data);
                // set feature_id
                feature_id = result.body[0].feature_id;
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });

    it("SUCCESS: Delete a single Testcase (TestcaseC)", done => {
        chai.request(app)
            .delete(`${route}/${testcase_id}`)
            .then(result => {
                result.should.have.status(statusCodes.ok);
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });

    it("SUCCESS: Gets all Testcases in database", done => {
        chai.request(app)
            .get(`${route}`)
            .then(result => {
                result.should.have.status(statusCodes.ok);
                result.body.should.have.length(3);
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });

    it("SUCCESS: Delete Testcases related to a Product", done => {
        chai.request(app)
            .delete(`${route}/product/${product_id}`)
            .then(result => {
                result.should.have.status(statusCodes.ok);
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });

    it("SUCCESS: Gets all Testcases in database", done => {
        chai.request(app)
            .get(`${route}`)
            .then(result => {
                result.should.have.status(statusCodes.ok);
                result.body.should.have.length(0);
                done();
            })
            .catch(error => {
                handleTestError(error);
            });
    });
});
