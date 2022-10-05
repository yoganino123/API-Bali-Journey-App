const { payment, user, temp_image, cart_item, package_trip } = require("../../models");

class ReportController {
  static async getAllPaids(req, res) {
    try {
      let result = [];
      const payments = await payment.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: { status: "paid" },
      });
      for (let i in payments) {
        let userId = payments[i].userId;
        let dataUser = await user.findOne({
          attributes: { exclude: ["createdAt", "updatedAt", "password", "level"] },
          where: { id: userId },
        });
        let userImages = await temp_image.findOne({ attributes: ["id", "userId", "img"], where: { userId } });
        let users = { ...dataUser.dataValues, images: userImages.img };

        const dataCarts = await cart_item.findAll({
          attributes: { exclude: ["createdAt", "updatedAt"] },
          where: { paymentId: payments[i].id },
        });
        let temp = [];
        for (let i in dataCarts) {
          const package_tripId = dataCarts[i].package_tripId;
          const dataPack = await package_trip.findOne({ where: { id: package_tripId } });
          const images = await temp_image.findAll({
            attributes: ["id", "package_tripId", "img"],
            where: { package_tripId },
          });
          temp.push({
            ...dataCarts[i].dataValues,
            name: dataPack.name,
            price: dataPack.price,
            rating: dataPack.rating,
            images,
          });
        }
        result.push({ ...payments[i].dataValues, users, cart_items: temp });
      }

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async getAllUnpaids(req, res) {
    try {
      let result = [];
      const payments = await payment.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: { status: "unpaid" },
      });
      for (let i in payments) {
        let userId = payments[i].userId;
        let dataUser = await user.findOne({
          attributes: { exclude: ["createdAt", "updatedAt", "password", "level"] },
          where: { id: userId },
        });
        let userImages = await temp_image.findOne({ attributes: ["id", "userId", "img"], where: { userId } });
        let users = { ...dataUser.dataValues, images: userImages.img };

        const dataCarts = await cart_item.findAll({
          attributes: { exclude: ["createdAt", "updatedAt"] },
          where: { paymentId: payments[i].id },
        });
        let temp = [];
        for (let i in dataCarts) {
          const package_tripId = dataCarts[i].package_tripId;
          const dataPack = await package_trip.findOne({ where: { id: package_tripId } });
          const images = await temp_image.findAll({
            attributes: ["id", "package_tripId", "img"],
            where: { package_tripId },
          });
          temp.push({
            ...dataCarts[i].dataValues,
            name: dataPack.name,
            price: dataPack.price,
            rating: dataPack.rating,
            images,
          });
        }
        result.push({ ...payments[i].dataValues, users, cart_items: temp });
      }

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

module.exports = ReportController;
