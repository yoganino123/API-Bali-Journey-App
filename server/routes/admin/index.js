const adminRoute = require("express").Router();
const categoryRoutes = require("./categoryRoute");
const destinationRoutes = require("./destinationRoute");
const userRoutes = require("./userRoute");
const reviewRoutes = require("./reviewRoute");
const tempImageRoutes = require("./tempImageRoute");
const packageTripRoutes = require("./packageTripRoute");
const reportRoutes = require("./reportRoute");
const profileRoutes = require("./profileRoute");

adminRoute.get("/", (req, res) => res.json({ message: "Home Page dashboard admin" }));
adminRoute.use("/profiles", profileRoutes);
adminRoute.use("/categories", categoryRoutes);
adminRoute.use("/destinations", destinationRoutes);
adminRoute.use("/users", userRoutes);
adminRoute.use("/reviews", reviewRoutes);
adminRoute.use("/tempImages", tempImageRoutes);
adminRoute.use("/packageTrips", packageTripRoutes);
adminRoute.use("/reports", reportRoutes);

module.exports = adminRoute;
