const { payment, user, temp_image, cart_item, package_trip } = require("../../models");
const Op = require("sequelize").Op;
class ReportController {
  static async getAllPaids(req, res) {
    try {
      let result = [];
      const payments = await payment.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: { status: "paid" },
      });
      for (let i in payments) {
        let { userId, payment_code, total, status, responseMidtrans } = payments[i];
        const { va_numbers, transaction_time, payment_type } = JSON.parse(responseMidtrans);
        const bank = va_numbers[0].bank;

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
          temp.push({
            ...dataCarts[i].dataValues,
            name: dataPack.name,
            price: dataPack.price,
            rating: dataPack.rating,
          });
        }
        result.push({
          id: payments[i].id,
          userId,
          payment_code,
          total,
          status,
          payment_type,
          bank,
          transaction_time,
          name_user: users.name,
          user_email: users.email,
          user_images: users.images,
          cart_items: temp,
        });
      }

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async getAllPayments(req, res) {
    try {
      let result = [];
      const payments = await payment.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: { status: { [Op.or]: ["pending", "unpaid", "paid"] } },
      });
      for (let i in payments) {
        let pym_type, trc_time, type_bank;
        let { userId, payment_code, total, status, responseMidtrans } = payments[i];
        if (status === "unpaid") {
          pym_type = "none";
          trc_time = "none";
          type_bank = "none";
        } else {
          const { va_numbers, transaction_time, payment_type } = JSON.parse(responseMidtrans);
          pym_type = payment_type;
          trc_time = transaction_time;
          type_bank = va_numbers[0].bank;
        }

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
          temp.push({
            ...dataCarts[i].dataValues,
            name: dataPack.name,
            price: dataPack.price,
            rating: dataPack.rating,
          });
        }
        result.push({
          id: payments[i].id,
          userId,
          payment_code,
          total,
          status,
          pym_type,
          type_bank,
          trc_time,
          name_user: users.name,
          user_email: users.email,
          user_images: users.images,
          cart_items: temp,
        });
      }

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

module.exports = ReportController;
