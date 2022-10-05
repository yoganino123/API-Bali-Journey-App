const { package_trip, temp_image, tour_package, destination, category } = require("../../models");

class PackageTripController {
  static async getPackageTrip(req, res) {
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

  static async getPackageTripId(req, res) {
    try {
      let destinations = [];
      const { id } = req.params;
      let dataPackageTrip = await package_trip.findOne({
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
        let data = { ...dataPackageTrip.dataValues, images, destinations };
        res.status(200).json(data);
      } else {
        res.status(404).json({ msg: `Not found!` });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async addPackageTrip(req, res) {
    try {
      const { name, description, price } = req.body;
      const img = req.file.path;
      let result = await package_trip.create({
        name,
        description,
        price,
      });
      await temp_image.create({ package_tripId: result.id, img });
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async addPackageDestination(req, res) {
    try {
      const id = +req.params.id;
      const { destinationId } = req.body;
      let dataPackageTrip = await package_trip.findOne({
        where: { id },
      });
      if (dataPackageTrip) {
        let result = await tour_package.create({
          package_tripId: id,
          destinationId,
        });
        res.status(201).json(result);
      } else {
        res.status(404).json({ msg: `Not found!` });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async deletePackageDestination(req, res) {
    try {
      const { id } = req.params;
      const result = await tour_package.destroy({ where: { id } });
      if (result !== 0) {
        res.status(200).json({ msg: `Destination Package Trip with id ${id} has been deleted` });
      } else {
        res.status(404).json({ msg: `Destination Package Trip can't be deleted` });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async deletePackageTrip(req, res) {
    try {
      const { id } = req.params;
      const result = await package_trip.destroy({ where: { id } });
      if (result !== 0) {
        res.status(200).json({ msg: `Package Trip with id ${id} has been deleted` });
      } else {
        res.status(404).json({ msg: `Package Trip can't be deleted` });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async updatePackageTrip(req, res) {
    try {
      const { id } = req.params;
      const { name, description, price } = req.body;
      const result = await package_trip.update({ name, description, price }, { where: { id } });
      if (result[0] !== 0) {
        res.status(200).json({ msg: `Package Trip with id ${id} has been updated` });
      } else {
        res.status(404).json({ msg: `Package Trip can't be updated` });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
module.exports = PackageTripController;
