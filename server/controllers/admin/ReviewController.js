const { review, temp_image, user, destination, package_trip } = require("../../models");
const Op = require("sequelize").Op;

class ReviewController {
  static async getReviewDestinations(req, res) {
    try {
      let result = [];
      const reviews = await review.findAll({
        attributes: { exclude: ["createdAt", "updatedAt", "package_tripId"] },
        include: [destination],
        where: { destinationId: { [Op.not]: null } },
      });
      for (let i in reviews) {
        let reviewId = reviews[i].id;
        let userId = reviews[i].userId;
        let dataUser = await user.findOne({
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
          where: { id: userId },
        });
        let userImages = await temp_image.findOne({ attributes: ["id", "userId", "img"], where: { userId } });
        let users = { ...dataUser.dataValues, images: userImages.img };
        let images = await temp_image.findAll({ attributes: ["id", "reviewId", "img"], where: { reviewId } });
        let data = { ...reviews[i].dataValues, user: users, images };
        result.push(data);
      }
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async getReviewPackages(req, res) {
    try {
      let result = [];
      const reviews = await review.findAll({
        attributes: { exclude: ["createdAt", "updatedAt", "destinationId"] },
        include: [package_trip],
        where: { package_tripId: { [Op.not]: null } },
      });
      for (let i in reviews) {
        let reviewId = reviews[i].id;
        let userId = reviews[i].userId;
        let dataUser = await user.findOne({
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
          where: { id: userId },
        });
        let userImages = await temp_image.findOne({ attributes: ["id", "userId", "img"], where: { userId } });
        let users = { ...dataUser.dataValues, images: userImages.img };
        let images = await temp_image.findAll({ attributes: ["id", "reviewId", "img"], where: { reviewId } });
        let data = { ...reviews[i].dataValues, user: users, images };
        result.push(data);
      }
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async getReviewId(req, res) {
    try {
      const { id } = req.params;
      const dataReview = await review.findOne({ where: { id } });
      if (dataReview) {
        const { comment, rating, userId, destinationId, package_tripId } = dataReview;
        let images = await temp_image.findAll({
          attributes: ["id", "reviewId", "img"],
          where: { reviewId: dataReview.id },
        });
        let dataUser = await user.findOne({
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
          where: { id: userId },
        });
        let dataDest = await destination.findOne({
          attributes: { exclude: ["createdAt", "updatedAt"] },
          where: { id: destinationId },
        });
        let dataPack = await destination.findOne({
          attributes: { exclude: ["createdAt", "updatedAt"] },
          where: { id: package_tripId },
        });
        let userImages = await temp_image.findOne({ attributes: ["id", "userId", "img"], where: { userId } });
        let users = { ...dataUser.dataValues, images: userImages.img };
        if (destinationId !== null) {
          let data = { id, comment, rating, userId, destinationId, dest_name: dataDest.name, user: users, images };
          res.status(200).json(data);
        } else {
          let data = { id, comment, rating, userId, package_tripId, package_name: dataPack.name, user: users, images };
          res.status(200).json(data);
        }
      } else {
        res.status(404).json({ msg: "Review not found!" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  //bagian admin hanya bisa menampilkan, menghapus / mengubah saja.
  static async addReview(req, res) {
    try {
      const { comment, rating, userId, destinationId, package_tripId } = req.body;
      const img = req.file.path;
      if (typeof destinationId !== "undefined") {
        let valReview = await review.findOne({ where: { userId, destinationId } });
        if (valReview) {
          res.status(200).json({ message: `User already add a comment!` });
        } else {
          let result = await review.create({ comment, rating, userId, destinationId, package_tripId });
          await temp_image.create({ reviewId: result.id, img });
          const jmlRating = await review.findAll({ where: { destinationId } });
          let hasil = 0;
          jmlRating.forEach((rat) => {
            hasil += rat.rating;
          });
          let newRating = hasil / jmlRating.length;
          await destination.update({ rating: newRating }, { where: { id: destinationId } });
          res.status(201).json(result);
        }
      }
      if (typeof package_tripId !== "undefined") {
        let valReview = await review.findOne({ where: { userId, package_tripId } });
        if (valReview) {
          res.status(200).json({ message: `User already add a comment!` });
        } else {
          let result = await review.create({ comment, rating, userId, destinationId, package_tripId });
          await temp_image.create({ reviewId: result.id, img });
          const jmlRating = await review.findAll({ where: { package_tripId } });
          let hasil = 0;
          jmlRating.forEach((rat) => {
            hasil += rat.rating;
          });
          let newRating = hasil / jmlRating.length;
          await package_trip.update({ rating: newRating }, { where: { id: package_tripId } });
          res.status(201).json(result);
        }
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async deleteReview(req, res) {
    try {
      const { id } = req.params;
      const dataReview = await review.findOne({ where: { id } });
      if (dataReview) {
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
        if (dataReview.package_tripId !== null) {
          await review.destroy({ where: { id } });
          const jmlRating = await review.findAll({ where: { package_tripId: dataReview.package_tripId } });
          let hasil = 0;
          jmlRating.forEach((rat) => (hasil += rat.rating));
          let newRating = 0;
          if (jmlRating.length > 0) {
            newRating = hasil / jmlRating.length;
          }
          await package_trip.update({ rating: newRating }, { where: { id: dataReview.package_tripId } });
          res.status(200).json({ message: `Review with id ${id} has been deleted` });
        }
      } else {
        res.status(404).json({ msg: "Review not found!" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async updateViolations(req, res) {
    try {
      const { id } = req.params;
      const { is_violation } = req.body;
      const result = await review.update({ is_violation }, { where: { id } });
      result[0] === 1
        ? res.status(200).json({ message: `Review with id ${id} has been updated` })
        : res.status(404).json({ msg: "Review not found!" });
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async updateReview(req, res) {
    try {
      const { id } = req.params;
      const { comment, rating, userId, destinationId, package_tripId } = req.body;
      const dataReview = await review.findOne({ where: { id } });
      if (dataReview) {
        await review.update({ comment, rating, userId, destinationId, package_tripId }, { where: { id } });
        if (typeof destinationId !== "undefined") {
          const jmlRating = await review.findAll({ where: { destinationId } });
          let hasil = 0;
          jmlRating.forEach((rat) => {
            hasil += rat.rating;
          });
          let newRating = hasil / jmlRating.length;
          await destination.update({ rating: newRating }, { where: { id: destinationId } });
        }
        if (typeof package_tripId !== "undefined") {
          const jmlRating = await review.findAll({ where: { package_tripId } });
          let hasil = 0;
          jmlRating.forEach((rat) => {
            hasil += rat.rating;
          });
          let newRating = hasil / jmlRating.length;
          await package_trip.update({ rating: newRating }, { where: { id: package_tripId } });
        }
        res.status(200).json({ message: `Review with id ${id} has been updated` });
      } else {
        res.status(404).json({ msg: "Review not found!" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

module.exports = ReviewController;
