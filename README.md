<div id="top"></div>

<!-- PROJECT Name -->
<br />
<div align="center">
<h1 align="center">Code Coverage Analyzer</h3>
</div>


<!-- ABOUT THE PROJECT -->
## About The Project
<hr/>
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
<hr/>

* [Introduction to Vega-Lite](https://vega.github.io/vega-lite/tutorials/getting_started.html)
* [Styling Vega-Lite Components](https://vega.github.io/vega-lite/docs/size.html)
* [MongoDB CRUD Documentation](https://docs.mongodb.com/drivers/node/current/fundamentals/crud/)

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started

<hr/>

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

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- Backend API -->
## Backend API

<hr/>

There are 3 collections created: 
* Products
* Features
* Testcases

<!-- Product Routes -->
## Products
A product has the following schema (\backend\src\models\product.js): 
```json
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
A Product contains a **name** (eg. ACAMEP), a **buildId** (eg. DST_H036), a **listOfFeatures** (an array of Feature Object Ids, form relation with Feature collection) and a **date** 

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

<br/>

<details>
<summary>Getting Product Informations</summary>

* Send a GET request to the route **/product** to retrieve all product informations in the database
```
GET http://localhost:5001/product
```
</details>

<br/>

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

<br/>

<details>
<summary>Deleting all Products</summary>

* Send a DELETE request to the route **/product** to delete all product informations in the database <br/>
* This will delete all Features and Testcases documents in the database as well
```
DELETE http://localhost:5001/product
```
</details>

<br/>

<details>
<summary>Deleting a single Product</summary>

* Send a DELETE request to the route **/product/:product_id** to delete a specific product with the corresponding product_id reference. <br/>
* It will also delete all Features and Testcases information that is related to that product from the database
```
DELETE http://localhost:5001/product/61a46f26a46904fb2704a72c
```
</details>

<p align="right">(<a href="#top">back to top</a>)</p>

<br/>
<hr/>

<!-- Feature Routes -->
## Features
A feature has the following schema (\backend\src\models\feature.js): 
```json
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
A Feature contains a **name** (eg. Wall), a **feature_coverage** that will be computed automatically when Testcases data are uploaded, a **listOfTestcases** (an array of Testcase Object Ids, form relation with Testcase collection) and **product_id** (to identify which Product does the Feature belong to). 

<br/>
It supports the following operations:

<br/>

<details>
<summary>Adding a Feature</summary>

* Send a POST request to the route **/feature/product_id**, with a request body containing JSON elements "name"<br/>
* Note that the Product with the corresponding product_id use in URL params must be an existing Product in the database
```

POST http://localhost:5001/feature/61aeea97fb429d7df8a94c6e
Content-Type: application/json

{
    "name": "Door"
}
```
</details>

<br/>

<details>
<summary>Adding a Feature</summary>

* Send a POST request to the route **/feature/product_id**, with a request body containing JSON elements "name"<br/>
* Note that the Product with the corresponding product_id use in URL params must be an existing Product in the database
```

POST http://localhost:5001/feature/61aeea97fb429d7df8a94c6e
Content-Type: application/json

{
    "name": "Door"
}
```
</details>