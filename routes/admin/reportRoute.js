const reportRoute = require("express").Router();
const { ReportController } = require("../../controllers");

reportRoute.get("/all", ReportController.getAllPayments);
reportRoute.get("/paids", ReportController.getAllPaids);

module.exports = reportRoute;
