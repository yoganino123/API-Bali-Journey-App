const reportRoute = require("express").Router();
const { ReportController } = require("../../controllers");

reportRoute.get("/paids", ReportController.getAllPaids);
reportRoute.get("/unpaids", ReportController.getAllUnpaids);

module.exports = reportRoute;
