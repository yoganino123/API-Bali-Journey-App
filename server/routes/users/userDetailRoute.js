const userDetailRoute = require("express").Router();
const { UserDetailController, TempImageController } = require("../../controllers");
const { upload } = require("../../middlewares");

// ? destinations
userDetailRoute.get("/dest/:id", UserDetailController.detailDest);
userDetailRoute.post("/dest/review/:id", UserDetailController.addReviewDest);
userDetailRoute.delete("/dest/review/:id", UserDetailController.delReviewDest);
userDetailRoute.put("/dest/review/:id", UserDetailController.updReviewDest);
userDetailRoute.post("/dest/review/img/:id", upload.single("img"), TempImageController.addImgRevDest);
userDetailRoute.delete("/dest/review/img/:id", TempImageController.deleteImage);

// ? package-trips
userDetailRoute.get("/pack/:id", UserDetailController.detailPack);
userDetailRoute.post("/pack/review/:id", UserDetailController.addReviewPack);
userDetailRoute.delete("/pack/review/:id", UserDetailController.delReviewPack);
userDetailRoute.put("/pack/review/:id", UserDetailController.updReviewPack);
userDetailRoute.post("/pack/review/img/:id", upload.single("img"), TempImageController.addImgRevPack);
userDetailRoute.delete("/pack/review/img/:id", TempImageController.deleteImage);

module.exports = userDetailRoute;
