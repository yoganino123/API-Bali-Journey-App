const { user, temp_image, category, destination, package_trip, tour_package, review } = require("../../models");
const { decryptPass } = require("../../helpers/bcrypt");
const { tokenGenerator } = require("../../helpers/jsonwebtoken");
const Op = require("sequelize").Op;
class HomeController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      let emailFound = await user.findOne({
        where: { email },
      });

      if (emailFound) {
        if (decryptPass(password, emailFound.password)) {
          let accessToken = tokenGenerator(emailFound);
          switch (emailFound.status) {
            case "active":
              if (emailFound.level === "admin") {
                res.status(200).json({ accessToken, level: emailFound.level });
              } else {
                res.status(200).json({ accessToken });
              }
              break;
            case "inactive":
              res.status(307).json({ msg: "Cannot reach this account!" });
              break;
            case "blocked":
              res.status(308).json({
                msg: "Your account is temporary blocked, contact CS!",
              });
              break;
          }
        } else {
          res.status(403).json({
            massage: "Invalid password!",
          });
        }
      } else {
        res.status(404).json({
          message: "Email not found!",
        });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;
      const valUser = await user.findOne({ where: { email } });
      if (valUser) {
        res.status(200).json({ msg: `Email sudah terdaftar!` });
      } else {
        const addUser = await user.create({ name, email, password });
        await temp_image.create({
          userId: addUser.id,
          img: "images/default-profil.jpg",
        });
        res.status(201).json(addUser);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async category(req, res) {
    try {
      let result = await category.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async categoryId(req, res) {
    try {
      const { id } = req.params;
      const result = await category.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"], where: { id } },
      });
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async allDestinations(req, res) {
    try {
      let images = [];
      let result = [];

      let destinations = await destination.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [category],
      });

      for (let i in destinations) {
        const { id, name, categoryId, rating, description, address, open_day, open_time, map_link, category } =
          destinations[i];
        let destinationId = destinations[i].id;
        images = await temp_image.findAll({
          attributes: ["id", "destinationId", "img"],
          where: { destinationId: destinationId },
        });
        let data = {
          id,
          name,
          categoryId,
          rating,
          description,
          address,
          open_day,
          open_time,
          map_link,
          category,
          images,
        };
        result.push(data);
      }

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async allPackageTrip(req, res) {
    try {
      let result = [];
      let package_trips = await package_trip.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      for (let i in package_trips) {
        let package_tripId = package_trips[i].id;
        let images = await temp_image.findAll({ attributes: ["id", "package_tripId", "img"], where: { package_tripId } });
        let destinations = await tour_package.findAll({ where: { package_tripId }, include: [destination] });
        let data = { ...package_trips[i].dataValues, images, destinations };
        result.push(data);
      }
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async destinationId(req, res) {
    try {
      const { id } = req.params;
      let dataDestination = await destination.findOne({
        include: [category],
        where: { id },
      });
      if (dataDestination) {
        let images = await temp_image.findAll({
          attributes: ["id", "destinationId", "img"],
          where: { destinationId: dataDestination.id },
        });
        let reviews = [];
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
        let data = { ...dataDestination.dataValues, images, reviews };
        res.status(200).json(data);
      } else {
        res.status(404).json({ msg: `Not found` });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async packageTripId(req, res) {
    try {
      let destinations = [];
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
        let data = { ...dataPackageTrip.dataValues, images, destinations, reviews };
        res.status(200).json(data);
      } else {
        res.status(404).json({ msg: `Not found!` });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async recomenDestinations(req, res) {
    try {
      let result = [];
      let destinations = await destination.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [category],
        where: { rating: { [Op.gte]: 4 } },
        order: [["rating", "DESC"]],
      });

      for (let i in destinations) {
        let destinationId = destinations[i].id;
        let images = await temp_image.findAll({
          attributes: ["id", "destinationId", "img"],
          where: { destinationId: destinationId },
        });
        let data = { ...destinations[i].dataValues, images };
        result.push(data);
      }

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async recomenPackageTrips(req, res) {
    try {
      let result = [];
      let package_trips = await package_trip.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: { rating: { [Op.gte]: 4 } },
        order: [["rating", "DESC"]],
      });
      for (let i in package_trips) {
        let package_tripId = package_trips[i].id;
        let images = await temp_image.findAll({ attributes: ["id", "package_tripId", "img"], where: { package_tripId } });
        let destinations = await tour_package.findAll({ where: { package_tripId }, include: [destination] });
        let data = { ...package_trips[i].dataValues, images, destinations };
        result.push(data);
      }
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async home(req, res) {
    try {
      let recPackage = [];
      let package_trips = await package_trip.findAll({
        limit: 7,
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: { rating: { [Op.gte]: 4 } },
        order: [["rating", "DESC"]],
      });
      for (let i in package_trips) {
        let package_tripId = package_trips[i].id;
        let images = await temp_image.findAll({ attributes: ["id", "package_tripId", "img"], where: { package_tripId } });
        let destinations = await tour_package.findAll({ where: { package_tripId }, include: [destination] });
        let data = { ...package_trips[i].dataValues, images, destinations };
        recPackage.push(data);
      }
      let recDest = [];
      let destinations = await destination.findAll({
        limit: 7,
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [category],
        where: { rating: { [Op.gte]: 4 } },
        order: [["rating", "DESC"]],
      });

      for (let i in destinations) {
        let destinationId = destinations[i].id;
        let images = await temp_image.findAll({
          attributes: ["id", "destinationId", "img"],
          where: { destinationId: destinationId },
        });
        let data = { ...destinations[i].dataValues, images };
        recDest.push(data);
      }
      res.status(200).json({ recDest, recPackage });
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async destByCat(req, res) {
    try {
      let images = [];
      let result = [];
      let categoryId = +req.params.id;
      let destinations = await destination.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [category],
        where: { categoryId },
      });

      for (let i in destinations) {
        let destinationId = destinations[i].id;
        images = await temp_image.findAll({
          attributes: ["id", "destinationId", "img"],
          where: { destinationId: destinationId },
        });
        let data = {
          ...destinations[i].dataValues,
          images,
        };
        result.push(data);
      }

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
module.exports = HomeController;
