const { user, temp_image, destination, package_trip, review, wishlist, tour_package, category } = require("../../models");

class UserDetailController {
  // ? destination

  static async detailDest(req, res) {
    try {
      const { id } = req.params;
      const userId = +req.user.id;
      let reviews = [];
      let userReview;
      let dataDestination = await destination.findOne({
        include: [category],
        where: { id },
      });
      if (dataDestination) {
        let images = await temp_image.findAll({
          attributes: ["id", "destinationId", "img"],
          where: { destinationId: dataDestination.id },
        });
        const revDes = await review.findAll({
          attributes: { exclude: ["createdAt", "updatedAt", "package_tripId"] },
          include: [user],
          where: { destinationId: dataDestination.id },
        });
        for (let i in revDes) {
          let reviewId = revDes[i].id;
          let images = await temp_image.findAll({ attributes: ["id", "reviewId", "img"], where: { reviewId } });
          let data = { ...revDes[i].dataValues, images };
          reviews.push(data);
        }

        const userRevDes = await review.findOne({
          attributes: { exclude: ["createdAt", "updatedAt", "package_tripId"] },
          include: [user],
          where: { destinationId: dataDestination.id, userId },
        });
        if (userRevDes) {
          let userReviewId = userRevDes.id;
          let userRevImages = await temp_image.findAll({
            attributes: ["id", "reviewId", "img"],
            where: { reviewId: userReviewId },
          });
          userReview = { ...userRevDes.dataValues, images: userRevImages };
        } else {
          userReview = {};
        }

        let is_wishlist = false;
        const dataWishlists = await wishlist.findAll({ where: { userId, destinationId: id } });
        dataWishlists.forEach((data) => {
          if (data.destinationId === +id) {
            is_wishlist = true;
          }
        });

        let data = { ...dataDestination.dataValues, is_wishlist, images, reviews, userReview };
        res.status(200).json(data);
      } else {
        res.status(404).json({ msg: `Not found` });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async addReviewDest(req, res) {
    try {
      const id = +req.params.id;
      const userId = +req.user.id;
      const { comment, rating } = req.body;
      const valDest = await destination.findOne({ where: { id } });
      if (valDest) {
        let valReview = await review.findOne({ where: { userId, destinationId: id } });
        if (valReview) {
          res.status(200).json({ message: `User already add a comment!` });
        } else {
          let result = await review.create({ comment, rating, userId, destinationId: id });
          const jmlRating = await review.findAll({ where: { destinationId: id } });
          let hasil = 0;
          jmlRating.forEach((rat) => {
            hasil += rat.rating;
          });
          let newRating = hasil / jmlRating.length;
          await destination.update({ rating: newRating }, { where: { id } });
          res.status(201).json(result);
        }
      } else {
        res.status(404).json({ msg: "Destination not found!" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async delReviewDest(req, res) {
    try {
      const { id } = req.params;
      const userId = +req.user.id;
      const dataReview = await review.findOne({ where: { id, userId } });
      if (dataReview && dataReview.package_tripId === null) {
        if (dataReview.destinationId !== null) {
          await review.destroy({ where: { id } });
          const jmlRating = await review.findAll({ where: { destinationId: dataReview.destinationId } });
          let hasil = 0;
          jmlRating.forEach((rat) => (hasil += rat.rating));
          let newRating = 0;
          if (jmlRating.length > 0) {
            newRating = hasil / jmlRating.length;
          }
          await destination.update({ rating: +newRating }, { where: { id: dataReview.destinationId } });
          res.status(200).json({ message: `Review with id ${id} has been deleted` });
        }
      } else {
        res.status(404).json({ msg: "Review not found!" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async updReviewDest(req, res) {
    try {
      const { id } = req.params;
      const userId = +req.user.id;
      const { comment, rating } = req.body;
      const dataReview = await review.findOne({ where: { id, userId } });
      if (dataReview && dataReview.package_tripId === null) {
        await review.update({ comment, rating, userId }, { where: { id } });
        const jmlRating = await review.findAll({ where: { destinationId: dataReview.destinationId } });
        let hasil = 0;
        jmlRating.forEach((rat) => {
          hasil += rat.rating;
        });
        let newRating = hasil / jmlRating.length;
        await destination.update({ rating: newRating }, { where: { id: dataReview.destinationId } });
        const result = await review.findOne({
          attributes: { exclude: ["createdAt", "updatedAt", "package_tripId"] },
          where: { id, userId },
        });
        res.status(200).json({ result, message: `Review with id ${id} has been updated` });
      } else {
        res.status(404).json({ msg: "Review not found!" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // ? package trip

  static async detailPack(req, res) {
    try {
      let destinations = [];
      const userId = +req.user.id;
      const { id } = req.params;
      let dataPackageTrip = await package_trip.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: { id },
      });
      if (dataPackageTrip) {
        let images = await temp_image.findAll({
          attributes: ["id", "package_tripId", "img"],
          where: { package_tripId: dataPackageTrip.id },
        });
        let dataTourPackage = await tour_package.findAll({ where: { package_tripId: dataPackageTrip.id } });
        for (let i in dataTourPackage) {
          let id = dataTourPackage[i].dataValues.destinationId;
          let dataDes = await destination.findAll({
            include: [category],
            where: { id },
          });
          for (let i in dataDes) {
            let destinationId = dataDes[i].id;
            let images = await temp_image.findAll({ attributes: ["id", "destinationId", "img"], where: { destinationId } });
            destinations.push({ ...dataDes[i].dataValues, images });
          }
        }
        let reviews = [];
        const revPack = await review.findAll({
          attributes: { exclude: ["createdAt", "updatedAt", "destinationId"] },
          include: [user],
          where: { package_tripId: dataPackageTrip.id },
        });
        for (let i in revPack) {
          let reviewId = revPack[i].id;
          let images = await temp_image.findAll({ attributes: ["id", "reviewId", "img"], where: { reviewId } });
          let data = { ...revPack[i].dataValues, images };
          reviews.push(data);
        }

        const userRevPack = await review.findOne({
          attributes: { exclude: ["createdAt", "updatedAt", "destinationId"] },
          include: [user],
          where: { package_tripId: dataPackageTrip.id, userId },
        });
        let userReview;
        if (userRevPack) {
          let userReviewId = userRevPack.id;
          let userReviewImages = await temp_image.findAll({
            attributes: ["id", "reviewId", "img"],
            where: { reviewId: userReviewId },
          });
          userReview = { ...userRevPack.dataValues, images: userReviewImages };
        } else {
          userReview = {};
        }

        let is_wishlist = false;
        const dataWishlists = await wishlist.findAll({ where: { userId, package_tripId: id } });
        dataWishlists.forEach((data) => {
          if (data.package_tripId === +id) {
            is_wishlist = true;
          }
        });

        let data = { ...dataPackageTrip.dataValues, is_wishlist, images, destinations, reviews, userReview };
        res.status(200).json(data);
      } else {
        res.status(404).json({ msg: `Not found!` });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async addReviewPack(req, res) {
    try {
      const id = +req.params.id;
      const userId = +req.user.id;
      const { comment, rating } = req.body;
      const valPack = await package_trip.findOne({ where: { id } });
      if (valPack) {
        let valReview = await review.findOne({ where: { userId, package_tripId: id } });
        if (valReview) {
          res.status(200).json({ message: `User already add a comment!` });
        } else {
          let result = await review.create({ comment, rating, userId, package_tripId: id });
          const jmlRating = await review.findAll({ where: { package_tripId: id } });
          let hasil = 0;
          jmlRating.forEach((rat) => {
            hasil += rat.rating;
          });
          let newRating = hasil / jmlRating.length;
          await package_trip.update({ rating: newRating }, { where: { id } });
          res.status(201).json(result);
        }
      } else {
        res.status(404).json({ msg: "Package trip not found!" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async delReviewPack(req, res) {
    try {
      const { id } = req.params;
      const userId = +req.user.id;
      const dataReview = await review.findOne({ where: { id, userId } });
      if (dataReview && dataReview.destinationId === null) {
        if (dataReview.package_tripId !== null) {
          await review.destroy({ where: { id } });
          const jmlRating = await review.findAll({ where: { package_tripId: dataReview.package_tripId } });
          let hasil = 0;
          jmlRating.forEach((rat) => (hasil += rat.rating));
          let newRating = 0;
          if (jmlRating.length > 0) {
            newRating = hasil / jmlRating.length;
          }
          await package_trip.update({ rating: +newRating }, { where: { id: dataReview.package_tripId } });
          res.status(200).json({ message: `Review with id ${id} has been deleted` });
        }
      } else {
        res.status(404).json({ msg: "Review not found!" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async updReviewPack(req, res) {
    try {
      const { id } = req.params;
      const userId = +req.user.id;
      const { comment, rating } = req.body;
      const dataReview = await review.findOne({ where: { id, userId } });
      if (dataReview && dataReview.destinationId === null) {
        await review.update({ comment, rating, userId }, { where: { id } });
        const jmlRating = await review.findAll({ where: { package_tripId: dataReview.package_tripId } });
        let hasil = 0;
        jmlRating.forEach((rat) => {
          hasil += rat.rating;
        });
        let newRating = hasil / jmlRating.length;
        await package_trip.update({ rating: newRating }, { where: { id: dataReview.package_tripId } });
        const result = await review.findOne({
          attributes: { exclude: ["createdAt", "updatedAt", "destinationId"] },
          where: { id, userId },
        });
        res.status(200).json({ result, message: `Review with id ${id} has been updated` });
      } else {
        res.status(404).json({ msg: "Review not found!" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

module.exports = UserDetailController;
