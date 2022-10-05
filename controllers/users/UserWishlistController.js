const { encryptPass } = require("../../helpers/bcrypt");
const { user, temp_image, wishlist, destination, package_trip } = require("../../models");
const Op = require("sequelize").Op;

class UserWishlistController {
  static async getWishlistDests(req, res) {
    try {
      const userId = req.user.id;
      let result = [];
      const data = await wishlist.findAll({
        attributes: { exclude: ["createdAt", "updatedAt", "package_tripId"] },
        where: { userId, destinationId: { [Op.not]: null } },
        include: [user, destination],
      });
      for (let i in data) {
        let destinationId = data[i].destinationId;
        let dataDest = await destination.findOne({ where: { id: destinationId } });
        let images = await temp_image.findAll({
          attributes: ["id", "destinationId", "img"],
          where: { destinationId },
        });
        result.push({ ...dataDest.dataValues, images });
      }
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async addWishlistDest(req, res) {
    try {
      const userId = +req.user.id;
      const destinationId = +req.params.id;
      const valDest = await destination.findOne({ where: { id: destinationId } });
      if (valDest) {
        const valWish = await wishlist.findOne({ where: { userId, destinationId } });
        if (valWish) {
          res.status(403).json({ msg: "Destination already on wishlist" });
        } else {
          const result = await wishlist.create({ userId, destinationId });
          res.status(201).json(result);
        }
      } else {
        res.status(404).json({ msg: "Destination not found!" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async getWishlistPacks(req, res) {
    try {
      const userId = req.user.id;
      let result = [];
      const data = await wishlist.findAll({
        attributes: { exclude: ["createdAt", "updatedAt", "destinationId"] },
        where: { userId, package_tripId: { [Op.not]: null } },
        include: [user, package_trip],
      });
      for (let i in data) {
        let package_tripId = data[i].package_tripId;
        let dataPack = await package_trip.findOne({ where: { id: package_tripId } });
        let images = await temp_image.findAll({
          attributes: ["id", "package_tripId", "img"],
          where: { package_tripId },
        });
        result.push({ ...dataPack.dataValues, images });
      }
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async addWishlistPack(req, res) {
    try {
      const userId = +req.user.id;
      const package_tripId = +req.params.id;

      const valPack = await package_trip.findOne({ where: { id: package_tripId } });
      if (valPack) {
        const valWish = await wishlist.findOne({ where: { userId, package_tripId } });
        if (valWish) {
          res.status(403).json({ msg: "Package trip already on wishlist" });
        } else {
          const result = await wishlist.create({ userId, package_tripId });
          res.status(201).json(result);
        }
      } else {
        res.status(404).json({ msg: "Package trip not found!" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async deleteWishlist(req, res) {
    try {
      const userId = +req.user.id;
      const id = +req.params.id;
      const result = await wishlist.destroy({ where: { id, userId } });
      if (result !== 0) {
        res.status(200).json({ message: `Wishlist with id ${id} has been deleted` });
      } else {
        res.status(404).json({ message: `Wishlist not found!` });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

module.exports = UserWishlistController;
