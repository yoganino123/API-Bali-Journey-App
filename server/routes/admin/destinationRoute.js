const destinationRoute = require("express").Router();
const { DestinationController, TempImageController } = require("../../controllers");
const { upload } = require("../../middlewares");

destinationRoute.get("/", DestinationController.getDestination);
destinationRoute.get("/:id", DestinationController.getDestinationId);
destinationRoute.post("/", upload.single("img"), DestinationController.addDestination);
destinationRoute.get("/img/:id", TempImageController.getImagesByDest);
destinationRoute.post("/img/:id", upload.single("img"), TempImageController.addImgDest);
destinationRoute.delete("/img/:id", TempImageController.deleteImage);
destinationRoute.delete("/:id", DestinationController.deleteDestination);
destinationRoute.put("/:id", DestinationController.updateDestination);

module.exports = destinationRoute;
