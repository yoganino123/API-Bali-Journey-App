// ? Controller Home
const HomeController = require("./home/HomeController");

// ? Controller Admin
const CategoryController = require("./admin/CategoryController");
const DestinationController = require("./admin/DestinationController");
const UserController = require("./admin/UserController");
const ReviewController = require("./admin/ReviewController");
const TempImageController = require("./admin/TempImageController");
const PackageTripController = require("./admin/PackageTripController");
const ReportController = require("./admin/ReportController");

// ? Controller User
const UserProfileController = require("./users/UserProfileController");
const UserDetailController = require("./users/UserDetailController");
const UserWishlistController = require("./users/UserWishlistController");
const UserPaymentController = require("./users/UserPaymentController");

module.exports = {
  HomeController,
  CategoryController,
  DestinationController,
  UserController,
  ReviewController,
  ReportController,
  TempImageController,
  PackageTripController,
  UserProfileController,
  UserDetailController,
  UserWishlistController,
  UserPaymentController,
};
