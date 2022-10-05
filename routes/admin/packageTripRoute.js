const packageTripRoutes = require("express").Router();
const { PackageTripController, TempImageController } = require("../../controllers");
const { upload } = require("../../middlewares");

packageTripRoutes.get("/", PackageTripController.getPackageTrip);
packageTripRoutes.get("/:id", PackageTripController.getPackageTripId);
packageTripRoutes.post("/:id", PackageTripController.addPackageDestination);
packageTripRoutes.post("/", upload.single("img"), PackageTripController.addPackageTrip);
packageTripRoutes.get("/img/:id", TempImageController.getImagesByPack);
packageTripRoutes.post("/img/:id", upload.single("img"), TempImageController.addImgPack);
packageTripRoutes.delete("/img/:id", TempImageController.deleteImage);
packageTripRoutes.delete("/:id", PackageTripController.deletePackageTrip);
packageTripRoutes.delete("/dest/:id", PackageTripController.deletePackageDestination);
packageTripRoutes.put("/:id", PackageTripController.updatePackageTrip);

module.exports = packageTripRoutes;
