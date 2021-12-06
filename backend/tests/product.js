import chai from "chai";
import chaiHttp from "chai-http";
import models from "../src/models/index";
import app from "../src/server";
import { statusCodes } from "../src/utils/httpResponses";
import handleTestError from './utils/handleTestError';
import { product1 } from './utils/dummyData';

chai.use(chaiHttp);
chai.should();

const { Product, Feature } = models;

const route = "/product";

const cleanup = async () => {
    await Feature.deleteMany({});
    await Product.deleteMany({});
};

describe(`POST ${route}`, () => {
    before(async () => {
        await cleanup();
    });
    it("It should POST product1 to 'products' collection", done => {
        chai.request(app)
            .post(`${route}`)
            .send(product1)
            .end((error, result) => {
                result.should.have.status(201);
                result.body.should.equal(product1);
                done();
            });
    });
});