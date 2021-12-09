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

export function validateFeature(responseJson, feature) {
    responseJson.should.have.property("product_id");
    responseJson.should.have.property("name");
    responseJson.should.have.property("feature_coverage");
    responseJson.should.have.property("listOfTestcases");
    responseJson.name.should.equal(feature.name);
}