const reviewRoutes = require("express").Router();
const { ReviewController } = require("../../controllers");
const { upload } = require("../../middlewares");

//yang dipakai bagian admin hanya ini
reviewRoutes.get("/destinations", ReviewController.getReviewDestinations);
reviewRoutes.get("/packageTrips", ReviewController.getReviewPackages);
reviewRoutes.put("/violations/:id", ReviewController.updateViolations);

//yang ini untuk user
reviewRoutes.get("/detail/:id", ReviewController.getReviewId);
reviewRoutes.post("/", upload.single("img"), ReviewController.addReview);
reviewRoutes.delete("/:id", ReviewController.deleteReview);
reviewRoutes.put("/:id", ReviewController.updateReview);

module.exports = reviewRoutes;
