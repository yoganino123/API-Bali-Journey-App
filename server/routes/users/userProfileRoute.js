const userProfileRoute = require("express").Router();
const { UserProfileController } = require("../../controllers");
const { upload } = require("../../middlewares");

userProfileRoute.get("/", UserProfileController.getProfile);
userProfileRoute.put("/", UserProfileController.updateProfile);
userProfileRoute.put("/img", upload.single("img"), UserProfileController.updateProfilePicture);

module.exports = userProfileRoute;
