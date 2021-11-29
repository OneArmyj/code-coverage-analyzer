import chai from "chai";
import chaiHttp from "chai-http";
import models from "../src/models/index";
import app from "../src/server";

chai.use(chaiHttp);
chai.should();

