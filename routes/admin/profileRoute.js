const profileRoute = require("express").Router();
const { UserProfileController } = require("../../controllers");
const { upload } = require("../../middlewares");

profileRoute.get("/", UserProfileController.getProfile);
profileRoute.put("/", UserProfileController.updateProfile);
profileRoute.put("/img", upload.single("img"), UserProfileController.updateProfilePicture);

module.exports = profileRoute;
