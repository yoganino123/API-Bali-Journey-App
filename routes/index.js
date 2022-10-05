const route = require("express").Router();
const { homeRoute } = require("./home");
const adminRoute = require("./admin");
const userRoute = require("./users");
const { valUser, valAdmin } = require("../middlewares");

route.use("/home", homeRoute);
route.use("/admin", valAdmin, adminRoute);
route.use("/users", valUser, userRoute);

module.exports = route;
