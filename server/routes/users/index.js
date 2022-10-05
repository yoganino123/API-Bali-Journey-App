const userRoute = require("express").Router();
const { HomeController } = require("../../controllers");
const userDetailRoutes = require("./userDetailRoute");
const userProfileRoutes = require("./userProfileRoute");
const userWishlistRoutes = require("./userWishlistRoute");
const userPaymentRoutes = require("./userPaymentRoute");

userRoute.get("/", HomeController.home);
userRoute.use("/profile", userProfileRoutes);
userRoute.use("/detail", userDetailRoutes);
userRoute.use("/wishlist", userWishlistRoutes);
userRoute.use("/payments", userPaymentRoutes);
userRoute.get("/categories", HomeController.category);
userRoute.get("/categories/:id", HomeController.categoryId);
userRoute.get("/dest-by-cat/:id", HomeController.destByCat);
userRoute.get("/destinations", HomeController.allDestinations);
userRoute.get("/package-trips", HomeController.allPackageTrip);

module.exports = userRoute;
