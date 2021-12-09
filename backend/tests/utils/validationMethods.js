import chai from "chai";

chai.should();

export function validateProduct(responseJson, product) {
    responseJson.should.have.property("name");
    responseJson.should.have.property("buildId");
    responseJson.should.have.property("listOfFeatures");
    responseJson.should.have.property("date");
    responseJson.name.should.equal(product.name);
    responseJson.buildId.should.equal(product.buildId);
}