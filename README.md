<div id="top"></div>

<!-- PROJECT Name -->
<br />
<div align="center">
<h1 align="center">Code Coverage Analyzer</h3>
</div>


<!-- ABOUT THE PROJECT -->
## About The Project
Code Coverage Analyzer is a full-stack web application developed to visualize and analyze code coverage data generated for AutoCAD vertical products.

Frontend:
* ReactJS
* Vega-Lite

Backend:
* ExpressJS
* MongoDB
* NodeJS

Testing:
* Mocha and Chai

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- USEFUL LINKS -->
## Useful Links

* [Introduction to Vega-Lite](https://vega.github.io/vega-lite/tutorials/getting_started.html)
* [Styling Vega-Lite Components](https://vega.github.io/vega-lite/docs/size.html)
* [Customizing Vega-Lite Visualization](https://vega.github.io/vega/docs/config/)
* [MongoDB CRUD Documentation](https://docs.mongodb.com/drivers/node/current/fundamentals/crud/)

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

Ensure you have NodeJS installed on your machine. Installing npm will install node as well.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo (To be edited with new github link)
   ```sh
   git clone https://github.com/github_username/repo_name.git
   ```
2. Install NPM packages for root, frontend and backend folders
   ```sh
   npm run postinstall
   ```
3. Start up both frontend and backend
   ```sh
   npm run dev
   ```
4. You can also choose to start up frontend and backend individually, using 2 bash sessions
   ```sh
   # 1st Bash session - Frontend
   cd frontend
   npm start

   # 2nd Bash session - Backend
   cd backend
   npm run server
   ```
5. Running backend tests
    ```sh
    cd backend
    npm run test
    ```

The scripts used to start frontend and backend can be configured by editing the "scripts" section of their respective package.json

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- Backend API -->
## Backend API

There are 3 collections created: 
* Products
* Features
* Testcases

They are related and linked in the following way:
* A Product has multiple Features (one-to-many)
* A Feature belongs to 1 Product (many-to-one)
* A Feature has multiple Testcases (one-to-many)
* A Testcase belongs to 1 Feature and 1 Product (many-to-one)

<hr/>

<!-- Product Routes -->
## Products
A Product contains the following properties: 
* name
  * eg. ACAMEP, ACE, ACM
* buildId 
  * eg. DST_H036, ACE_L040, ACM_Q034
* listOfFeatures
  * an array of Feature Object Ids, form relation with Feature collection
* date
  * by default 
  
<br/>

A Product has the following schema (\backend\src\models\product.js): 
```js
const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    buildId: {
        type: String,
        required: true
    },
    listOfFeatures: {
        type: Array({
            type: Schema.Types.ObjectId,
            ref: "Feature"
        }),
        default: []
    },
    date: {
        type: Date,
        default: Date.now()
    }
});
```

<br/>
It supports the following operations:

<br/>

<details>
<summary>Creating a Product</summary>

* Send a POST request to the route **/product**, with a request body containing JSON elements "name", "buildId" and "listOfFeatures". All 3 fields are compulsory in the POST request <br/>
* Note that listOfFeatures cannot contain any duplicate strings
```
POST http://localhost:5001/product
Content-Type: application/json

{
    "name": "ACAMEP",
    "buildId": "DST_H036",
    "listOfFeatures": ["Wall", "Door", "Room"] 
}
```
</details>

<details>
<summary>Getting Product Informations</summary>

* Send a GET request to the route **/product** to retrieve all product informations in the database
```
GET http://localhost:5001/product
```
</details>

<details>
<summary>Editing a single Product</summary>

* Send a PATCH request to the route **/product/:product_id** to edit a specific product <br/>
* Only name and buildId can be edited for a Product, use Feature routes to update the listOfFeatures of a Product
```
PATCH http://localhost:5001/product/61a46f26a46904fb2704a72c

Content-Type: application/json
{
    "buildId": "DST_H040"
}
```
</details>

<details>
<summary>Deleting all Products</summary>

* Send a DELETE request to the route **/product** to delete all product informations in the database <br/>
* This will delete all Features and Testcases documents in the database as well
```
DELETE http://localhost:5001/product
```
</details>

<details>
<summary>Deleting a single Product</summary>

* Send a DELETE request to the route **/product/:product_id** to delete a specific product with the corresponding product_id reference. <br/>
* It will also delete all Features and Testcases information that is related to that product from the database
```
DELETE http://localhost:5001/product/61a46f26a46904fb2704a72c
```
</details>

<p align="right">(<a href="#top">back to top</a>)</p>
<hr/>

<!-- Feature Routes -->
## Features
A Feature contains the following properties:
* product_id 
  * to identify which Product does the Feature belong to
* name 
  * eg. Wall
* feature_coverage 
  * that will be computed automatically when Testcases data are uploaded
* listOfTestcases 
  * an array of Testcase Object Ids, form relation with Testcase collection

<br/>

A Feature has the following schema (\backend\src\models\feature.js): 
```js
const featureSchema = new Schema({
    product_id: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    feature_coverage: {
        type: Number,
        default: 0
    },
    listOfTestcases: {
        type: Array({
            type: Schema.Types.ObjectId,
            ref: "Testcase"
        }),
        default: []
    }
});
```


<br/>
It supports the following operations:

<br/>

<details>
<summary>Adding a Feature</summary>

* Send a POST request to the route **/feature/product_id**, with a request body containing JSON elements "name"<br/>
* Note that the Product with the corresponding product_id used in the URL params must be an existing Product in the database
```
POST http://localhost:5001/feature/61aeea97fb429d7df8a94c6e
Content-Type: application/json

{
    "name": "Door"
}
```
</details>

<details>
<summary>Getting all Features</summary>

* Send a GET request to the route **/feature**, this will retrieve all the Features in the database
```
POST http://localhost:5001/feature
```
</details>

<details>
<summary>Getting a single Feature</summary>

* Send a GET request to the route **/feature/feature_id**, this will retrieve information of the specific Feature corresponding to feature_id used in the URL params
```
GET http://localhost:5001/feature/619e412f5fae31bf70e6c66a
```
</details>

<details>
<summary>Getting all Features grouped by Product</summary>

* Send a GET request to the route **/feature/product/product_id**, this will retrieve all Features belonging to a specific Product
* Note that the Product with the corresponding product_id use in URL params must be an existing Product in the database
```
GET http://localhost:5001/feature/product/619e412f5fae31bf70e6c66a
```
</details>

<details>
<summary>Deleting a single Feature</summary>

* Send a DELETE request to the route **/feature/feature_id**, this will delete the specific Feature itself, along with all Testcase objects that is linked to it
```
DELETE http://localhost:5001/feature/619e412f5fae31bf70e6c66a
```
</details>

<details>
<summary>Deleting all Features of a Product</summary>

* Send a DELETE request to the route **/feature/product/product_id**, this will delete all Features belonging to a specific Product, along with all the Testcase objects that is linked to the Product 
* Since a Testcase is linked to a Feature, deleting all Features of a Product also deletes all Testcases of a Product
```
DELETE http://localhost:5001/feature/product/619e412f5fae31bf70e6c66a
```
</details>

<p align="right">(<a href="#top">back to top</a>)</p>
<hr/>

<!-- Testcase Routes -->
## Testcase
A Testcase contains the following properties: 
* product_id 
  * to identify which Product does the Testcase belong to
* feature_id 
  * to identify which Feature does the Testcase belong to
* name
* description 
* line_coverage
  * the amount of coverage related to the particular Feature the Testcase is targeting

<br/>

A Testcase has the following schema (\backend\src\models\testcase.js): 
```js
const testcaseSchema = new Schema({
    product_id: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    feature_id: {
        type: Schema.Types.ObjectId,
        ref: "Feature",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    line_coverage: {
        type: Number,
        required: true
    }
});
```


<br/>
It supports the following operations:

<br/>

<details>
<summary>Adding a Testcase</summary>

* Send a POST request to the route **/testcase/product_id**, with a request body containing JSON elements "data", which holds an array of objects with the keys ["name", "feature", "description", "line_coverage"] <br/>
* Note that the Product with the corresponding product_id used in the URL params must be an existing Product in the database
* Note that the Feature specified in the testcase must exist in the database as well
```
POST http://localhost:5001/testcase/61adb7a2a5fc1368019091b8
Content-Type: application/json

{
    "data": [
        {
            "name": "TestcaseA",
            "feature": "Wall",
            "description": "Testing API",
            "line_coverage": 2.0
        },
        {
            "name": "TestcaseB",
            "feature": "Door",
            "description": "Testing API",
            "line_coverage": 4.0
        },
        {
            "name": "TestcaseC",
            "feature": "Room",
            "description": "Testing API",
            "line_coverage": 6.0
        }
    ]
}
```
</details>

<details>
<summary>Getting all Testcases</summary>

* Send a GET request to the route **/testcase**, this will retrieve all the Testcases in the database
```
POST http://localhost:5001/testcase
```
</details>

<details>
<summary>Getting Testcases grouped by Product</summary>

* Send a GET request to the route **/testcase/product/product_id**, this will retrieve all the Testcases related to a specific Product, as identified by the unique product_id used in the URL params
```
POST http://localhost:5001/testcase/product/61adb7a2a5fc1368019091b8
```
</details>

<details>
<summary>Getting Testcases grouped by Feature</summary>

* Send a GET request to the route **/testcase/feature/feature_id**, this will retrieve all the Testcases related to a specific Feature, as identified by the unique feature_id used in the URL params
```
POST http://localhost:5001/testcase/product/61adb7a2a5fc1368019091b8
```
</details>

<details>
<summary>Editing a single Testcase</summary>

* Send a PATCH request to the route **/testcase/testcase_id**, this will edit the specific Testcase, as identified by the unique testcase_id used in the URL params
* Note that only the name and description of a Testcase can be updated
```
PATCH http://localhost:5001/testcase/61adb7a2a5fc1368019091b8
Content-Type: application/json

{
    "name": "TestcaseWall",
    "description": "A testcase targeting the Wall Feature"
}
```
</details>

<details>
<summary>Deleting a single Testcase</summary>

* Send a DELETE request to the route **/testcase/testcase_id**, this will delete the specific Testcase, as identified by the unique testcase_id used in the URL params
```
DELETE http://localhost:5001/testcase/61adb7a2a5fc1368019091b8
```
</details>


<details>
<summary>Deleting Testcases grouped by Product</summary>

* Send a DELETE request to the route **/testcase/product/product_id**, this will delete all the Testcases related to a specific Product
```
DELETE http://localhost:5001/testcase/product/61adb7a2a5fc1368019091b8
```
</details>


