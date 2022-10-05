const homeRoute = require("express").Router();
const { HomeController } = require("../../controllers");

homeRoute.get("/", HomeController.home);
homeRoute.post("/login", HomeController.login);
homeRoute.post("/register", HomeController.register);
homeRoute.get("/category", HomeController.category);
homeRoute.get("/category/:id", HomeController.categoryId);
homeRoute.get("/allDestinations", HomeController.allDestinations);
homeRoute.get("/allPackageTrip", HomeController.allPackageTrip);
homeRoute.get("/recomenDestinations", HomeController.recomenDestinations);
homeRoute.get("/recomenPackageTrip", HomeController.recomenPackageTrips);
homeRoute.get("/dest-by-cat/:id", HomeController.destByCat);
homeRoute.get("/destination/:id", HomeController.destinationId);
homeRoute.get("/packageTrip/:id", HomeController.packageTripId);
// homeRoute.get("/reviewDestination/:id", HomeController.reviewDestinationId);
// homeRoute.get("/reviewPackageTrip/:id", HomeController.reviewPackageTripId);

module.exports = homeRoute;
