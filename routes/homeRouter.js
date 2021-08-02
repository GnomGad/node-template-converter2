const express = require("express");
const homeController = require("../controllers/homeControllers");
const covController = require("../controllers/convertControllers");

const homeRouter = express.Router();

homeRouter.get("/1-OPT", covController.convertOneOpt);
homeRouter.get("/1-PE", covController.convertOnePE);


homeRouter.get("/test", homeController.test);
homeRouter.get("/", homeController.index);

 
module.exports = homeRouter;