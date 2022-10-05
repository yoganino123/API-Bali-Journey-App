const userWishlistRoute = require("express").Router();
const { UserWishlistController } = require("../../controllers");

userWishlistRoute.get("/dest", UserWishlistController.getWishlistDests);
userWishlistRoute.post("/dest/:id", UserWishlistController.addWishlistDest);
userWishlistRoute.get("/pack", UserWishlistController.getWishlistPacks);
userWishlistRoute.post("/pack/:id", UserWishlistController.addWishlistPack);
userWishlistRoute.delete("/:id", UserWishlistController.deleteWishlist);

module.exports = userWishlistRoute;
