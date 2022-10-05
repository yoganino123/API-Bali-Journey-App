const userRoute = require("express").Router();
const { HomeController } = require("../../controllers");

userRoute.get("/", (req, res) => res.json("homepage"));
userRoute.post("/login", HomeController.login);
userRoute.post("/register", HomeController.register);
userRoute.get("/category", HomeController.category);
userRoute.get("/category/:id", HomeController.categoryId);
userRoute.get("/allDestinations", HomeController.allDestinations);
userRoute.get("/allPackageTrip", HomeController.allPackageTrip);
userRoute.get("/recomenDestinations", HomeController.recomenDestinations);
userRoute.get("/recomenPackageTrip", HomeController.recomenPackageTrips);
userRoute.get("/destination/:id", HomeController.destinationId);
userRoute.get("/packageTrip/:id", HomeController.packageTripId);
// userRoute.get("/reviewDestination/:id", HomeController.reviewDestinationId);
// userRoute.get("/reviewPackageTrip/:id", HomeController.reviewPackageTripId);

module.exports = userRoute;
