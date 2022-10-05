const userRoutes = require("express").Router();
const { UserController } = require("../../controllers");

userRoutes.get("/", UserController.getUser);
userRoutes.get("/sta", UserController.getUserByStatus);
userRoutes.get("/:id", UserController.getUserId);
userRoutes.post("/", UserController.addUser);
userRoutes.delete("/:id", UserController.deleteUser);
userRoutes.put("/:id", UserController.updateUser);

module.exports = userRoutes;
