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

export function validateTestcase(arr, testcase) {
    for (let i = 0; i < arr.length; i++) {
        const responseJson = arr[i]
        responseJson.should.have.property("product_id");
        responseJson.should.have.property("feature_id");
        responseJson.should.have.property("name");
        responseJson.should.have.property("description");
        responseJson.should.have.property("line_coverage");
        responseJson.name.should.equal(testcase[i].name);
        responseJson.description.should.equal(testcase[i].description);
        responseJson.line_coverage.should.equal(testcase[i].line_coverage);
    }
}